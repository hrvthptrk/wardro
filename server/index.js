"use strict";
// ============================================================================
// Wardro helyi backend
// ============================================================================
// Ez a szerver két dolgot csinál:
//   1. Kiszolgálja a design-oldal statikus fájljait (a .dc.html-t, .css-t, .js-t)
//      – ugyanúgy, ahogy eddig a .vscode/serve.js tette.
//   2. Megvalósítja a QR-kódos telefonos fotóküldést: párosítási munkamenetet
//      nyit, QR-kódot rajzol hozzá, fogadja a telefonról feltöltött képeket,
//      és élőben (WebSocketen) továbbítja őket az asztali oldalra.
//
// Minden helyben, memóriában fut – nincs adatbázis, nincs fiók, nincs külső
// szolgáltatás. Újraindításkor minden nyitott munkamenet és fotó elvész,
// ez egy prototípushoz szándékosan elég.
//
// Indítás: node server/index.js   (a .vscode/tasks.json F5-re ezt hívja)
// ============================================================================

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const QRCode = require("qrcode");
const { WebSocketServer } = require("ws");

const PORT = Number(process.env.PORT) || 8080;
const ROOT = path.join(__dirname, "..");
const DEFAULT_PAGE = "Wardro Web.dc.html";

const SESSION_TTL_MS = 20 * 60 * 1000; // egy párosítási munkamenet ennyi ideig él tétlenül
const SESSION_SWEEP_MS = 30 * 1000; // ilyen gyakran nézzük meg, lejárt-e valami
const MAX_PHOTOS_PER_SESSION = 40;
const MAX_PHOTO_BYTES = 20 * 1024 * 1024; // 20 MB / fotó

const STATIC_MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/jsx; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};
const UPLOAD_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/gif"]);

// ----------------------------------------------------------------------------
// Párosítási munkamenetek (memóriában – egyfelhasználós, helyi backend)
// ----------------------------------------------------------------------------
/** token -> { token, createdAt, expiresAt, photos:[], nextPhotoId, sockets:Set } */
const sessions = new Map();

function newToken() {
  return crypto.randomBytes(9).toString("base64url"); // rövid, URL-biztos, kitalálhatatlan
}

function createSession() {
  const token = newToken();
  const now = Date.now();
  const session = {
    token,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    photos: [],
    nextPhotoId: 1,
    sockets: new Set(),
  };
  sessions.set(token, session);
  return session;
}

function touchSession(session) {
  session.expiresAt = Date.now() + SESSION_TTL_MS;
}

function endSession(session, reason) {
  sessions.delete(session.token);
  for (const ws of session.sockets) {
    try { ws.send(JSON.stringify({ type: "expired", reason: reason || "ended" })); } catch { /* mindegy, úgyis zárjuk */ }
    try { ws.close(); } catch { /* ugyanaz */ }
  }
  session.sockets.clear();
  session.photos.length = 0; // engedjük el a memóriát
}

// Lejárt munkamenetek rendszeres eltakarítása.
setInterval(() => {
  const now = Date.now();
  for (const session of sessions.values()) {
    if (session.expiresAt <= now) endSession(session, "expired");
  }
}, SESSION_SWEEP_MS).unref();

function broadcast(session, msg) {
  const data = JSON.stringify(msg);
  for (const ws of session.sockets) {
    if (ws.readyState === ws.OPEN) ws.send(data);
  }
}

function photoSummary(p) {
  return { id: p.id, name: p.name, mime: p.mime, size: p.size, uploadedAt: p.uploadedAt, url: `/api/pair/${p.sessionToken}/photo/${p.id}` };
}

// ----------------------------------------------------------------------------
// A gép hálózati címe – erre kell mutatnia a QR-nak, mert a telefon a
// "localhost"-tal nem az asztali gépet érné el, hanem saját magát.
// ----------------------------------------------------------------------------
function lanAddress() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "localhost"; // nincs hálózati kártya – csak ugyanezen a gépen fog működni
}

// ----------------------------------------------------------------------------
// Statikus fájlok (maga a design-oldal)
// ----------------------------------------------------------------------------
function serveStatic(req, res, reqPath) {
  if (reqPath === "/") reqPath = "/" + DEFAULT_PAGE;
  let filePath;
  try {
    filePath = path.join(ROOT, decodeURIComponent(reqPath));
  } catch {
    res.writeHead(400); res.end("Hibás útvonal"); return;
  }
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end("Tiltva"); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); res.end("Nem található: " + reqPath); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "content-type": STATIC_MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

// ----------------------------------------------------------------------------
// API segédek
// ----------------------------------------------------------------------------
function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "content-length": Buffer.byteLength(body) });
  res.end(body);
}

function readBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(Object.assign(new Error("too large"), { code: "TOO_LARGE" }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const PHONE_PAGE = fs.readFileSync(path.join(__dirname, "phone.html"), "utf8");

// ----------------------------------------------------------------------------
// Időjárás – a "Mára ajánlott" outfit-javaslathoz. Az Open-Meteo ingyenes,
// kulcs nélküli API-ját hívjuk a szerverről (nem a böngészőből, hogy ne
// legyen CORS-függőség), Budapestre esik vissza, ha a kliens nem küld
// koordinátát (pl. nem engedélyezte a helymeghatározást).
// ----------------------------------------------------------------------------
const BUDAPEST = { lat: 47.4979, lon: 19.0402 };
const WEATHER_CACHE_MS = 10 * 60 * 1000; // 10 percig újra felhasználjuk ugyanazt a választ
const weatherCache = new Map(); // "lat,lon" -> { at, data }

// WMO időjárás-kódok rövid magyar leírása.
const WEATHER_CODE_HU = {
  0: "Derült", 1: "Túlnyomóan derült", 2: "Részben felhős", 3: "Borult",
  45: "Köd", 48: "Zúzmarás köd",
  51: "Gyenge szitálás", 53: "Szitálás", 55: "Sűrű szitálás",
  56: "Fagyos szitálás", 57: "Sűrű fagyos szitálás",
  61: "Gyenge eső", 63: "Eső", 65: "Erős eső",
  66: "Fagyos eső", 67: "Erős fagyos eső",
  71: "Gyenge hóesés", 73: "Hóesés", 75: "Erős hóesés", 77: "Hószemek",
  80: "Gyenge zápor", 81: "Zápor", 82: "Heves zápor",
  85: "Hózápor", 86: "Erős hózápor",
  95: "Zivatar", 96: "Zivatar jégesővel", 99: "Heves zivatar jégesővel",
};
function weatherCodeToText(code) {
  return WEATHER_CODE_HU[code] || "Változékony idő";
}
// Hideg / Enyhe / Meleg – ugyanaz a három évszak-kategória, amit az
// outfit-összeállító is használ, hogy a javaslatok tényleg összeköthetők legyenek.
function seasonForTemp(tempC) {
  if (tempC < 10) return "Hideg";
  if (tempC <= 20) return "Enyhe";
  return "Meleg";
}

async function fetchWeather(lat, lon) {
  const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.at < WEATHER_CACHE_MS) return cached.data;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m&timezone=auto&forecast_days=1`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("open-meteo http " + r.status);
  const j = await r.json();

  const tempC = j.current.temperature_2m;
  const code = j.current.weather_code;

  // A "ma este" hőmérséklet: a 21 órás (vagy ahhoz legközelebbi) óránkénti érték.
  let eveningC = tempC;
  if (j.hourly && Array.isArray(j.hourly.time)) {
    const hours = j.hourly.time.map((t) => Number(t.slice(11, 13)));
    let bestIdx = 0, bestDiff = Infinity;
    hours.forEach((h, i) => { const diff = Math.abs(h - 21); if (diff < bestDiff) { bestDiff = diff; bestIdx = i; } });
    if (j.hourly.temperature_2m[bestIdx] !== undefined) eveningC = j.hourly.temperature_2m[bestIdx];
  }

  const data = {
    tempC,
    eveningC,
    code,
    description: weatherCodeToText(code),
    season: seasonForTemp(tempC),
  };
  weatherCache.set(key, { at: Date.now(), data });
  return data;
}

// ----------------------------------------------------------------------------
// HTTP szerver + útvonalak
// ----------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const p = url.pathname;

  try {
    // --- Időjárás a "Mára ajánlott" panelhez ---
    if (p === "/api/weather" && req.method === "GET") {
      const hasParams = url.searchParams.has("lat") && url.searchParams.has("lon");
      const lat = Number(url.searchParams.get("lat"));
      const lon = Number(url.searchParams.get("lon"));
      const hasCoords = hasParams && Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
      try {
        const data = await fetchWeather(hasCoords ? lat : BUDAPEST.lat, hasCoords ? lon : BUDAPEST.lon);
        return sendJson(res, 200, { ok: true, usedDefaultLocation: !hasCoords, ...data });
      } catch (e) {
        console.error("Időjárás-lekérés sikertelen:", e.message);
        return sendJson(res, 502, { ok: false, error: "weather_unavailable" });
      }
    }

    // --- Párosítás indítása: az asztali oldal hívja "Connect phone"-ra ---
    if (p === "/api/pair/start" && req.method === "POST") {
      const session = createSession();
      const phoneUrl = `http://${lanAddress()}:${PORT}/phone/${session.token}`;
      return sendJson(res, 200, { token: session.token, phoneUrl, expiresAt: session.expiresAt });
    }

    // --- QR kód SVG-ként egy adott munkamenethez ---
    let m = p.match(/^\/api\/pair\/([\w-]+)\/qr\.svg$/);
    if (m && req.method === "GET") {
      const session = sessions.get(m[1]);
      if (!session) { res.writeHead(404); return res.end(); }
      const phoneUrl = `http://${lanAddress()}:${PORT}/phone/${session.token}`;
      const svg = await QRCode.toString(phoneUrl, { type: "svg", margin: 1, color: { dark: "#57462F", light: "#0000" } });
      res.writeHead(200, { "content-type": "image/svg+xml", "cache-control": "no-store" });
      return res.end(svg);
    }

    // --- Munkamenet állapota (a telefon-oldal ezzel ellenőrzi magát) ---
    m = p.match(/^\/api\/pair\/([\w-]+)\/status$/);
    if (m && req.method === "GET") {
      const session = sessions.get(m[1]);
      if (!session) return sendJson(res, 404, { ok: false });
      return sendJson(res, 200, { ok: true, expiresAt: session.expiresAt, photoCount: session.photos.length });
    }

    // --- Fotó feltöltése a telefonról ---
    m = p.match(/^\/api\/pair\/([\w-]+)\/upload$/);
    if (m && req.method === "POST") {
      const session = sessions.get(m[1]);
      if (!session) return sendJson(res, 410, { ok: false, error: "expired" });
      if (session.photos.length >= MAX_PHOTOS_PER_SESSION) return sendJson(res, 429, { ok: false, error: "too_many" });

      const mime = (req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
      if (!UPLOAD_MIME.has(mime)) return sendJson(res, 415, { ok: false, error: "unsupported_type" });

      let buf;
      try {
        buf = await readBody(req, MAX_PHOTO_BYTES);
      } catch (e) {
        return sendJson(res, e.code === "TOO_LARGE" ? 413 : 400, { ok: false, error: "upload_failed" });
      }
      if (!buf.length) return sendJson(res, 400, { ok: false, error: "empty" });

      const name = (url.searchParams.get("name") || `photo-${session.nextPhotoId}.jpg`).slice(0, 120);
      const photo = { id: session.nextPhotoId++, name, mime, size: buf.length, buf, uploadedAt: Date.now(), sessionToken: session.token };
      session.photos.push(photo);
      touchSession(session);
      broadcast(session, { type: "photo", ...photoSummary(photo) });
      return sendJson(res, 200, { ok: true, id: photo.id });
    }

    // --- Feltöltött fotó bájtjainak kiszolgálása (ebből lesz a bélyegkép) ---
    m = p.match(/^\/api\/pair\/([\w-]+)\/photo\/(\d+)$/);
    if (m && req.method === "GET") {
      const session = sessions.get(m[1]);
      const photo = session && session.photos.find((x) => x.id === Number(m[2]));
      if (!photo) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "content-type": photo.mime, "cache-control": "public, max-age=3600, immutable" });
      return res.end(photo.buf);
    }

    // --- Munkamenet lezárása: "Disconnect" az asztali oldalon ---
    m = p.match(/^\/api\/pair\/([\w-]+)\/end$/);
    if (m && req.method === "POST") {
      const session = sessions.get(m[1]);
      if (session) endSession(session, "disconnected");
      return sendJson(res, 200, { ok: true });
    }

    // --- Telefonos feltöltő oldal ---
    m = p.match(/^\/phone\/([\w-]+)$/);
    if (m && req.method === "GET") {
      const session = sessions.get(m[1]);
      const html = PHONE_PAGE.replace(/__TOKEN__/g, m[1]).replace(/__VALID__/g, session ? "1" : "0");
      res.writeHead(session ? 200 : 410, { "content-type": "text/html; charset=utf-8" });
      return res.end(html);
    }

    // --- minden más: a design-oldal statikus fájljai ---
    if (req.method === "GET") return serveStatic(req, res, p);

    res.writeHead(404);
    res.end();
  } catch (err) {
    console.error("Kiszolgálási hiba:", err);
    if (!res.headersSent) sendJson(res, 500, { ok: false, error: "server_error" });
  }
});

// ----------------------------------------------------------------------------
// WebSocket: az asztali oldal ezen kapja élőben az új fotókat
// ----------------------------------------------------------------------------
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  const m = req.url.match(/^\/api\/pair\/([\w-]+)\/socket$/);
  const session = m && sessions.get(m[1]);
  if (!session) { socket.write("HTTP/1.1 404 Not Found\r\n\r\n"); socket.destroy(); return; }
  wss.handleUpgrade(req, socket, head, (ws) => {
    session.sockets.add(ws);
    ws.isAlive = true;
    ws.on("pong", () => { ws.isAlive = true; });
    ws.on("close", () => session.sockets.delete(ws));
    // Azonnal küldjük az eddig beérkezett fotókat is, ha a lap újratöltés
    // után csatlakozik vissza egy már élő munkamenethez.
    ws.send(JSON.stringify({ type: "hello", expiresAt: session.expiresAt, photos: session.photos.map(photoSummary) }));
  });
});

// Holt kapcsolatok kiszűrése (pl. ha a laptop elaludt, majd felébredt).
setInterval(() => {
  for (const session of sessions.values()) {
    for (const ws of session.sockets) {
      if (ws.isAlive === false) { ws.terminate(); session.sockets.delete(ws); continue; }
      ws.isAlive = false;
      ws.ping();
    }
  }
}, 30000).unref();

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    // Már fut egy példány (pl. egy korábbi F5-ből) – ez nem hiba.
    console.log(`A ${PORT}-as port már foglalt, feltehetően fut már a szerver.`);
    console.log(`Kiszolgálás fut a http://localhost:${PORT} címen`);
    process.exit(0);
  }
  console.error("Szerverhiba:", err);
  process.exit(1);
});

console.log("Kiszolgálás indul...");
server.listen(PORT, () => {
  console.log(`Kiszolgálás fut a http://localhost:${PORT} címen`);
  console.log(`Telefonról elérhető cím: http://${lanAddress()}:${PORT}`);
});
