"use strict";

// Wardro backend.
// Ez szolgálja ki az oldalt, intézi a telefonos QR fotóküldést,
// lekéri az időjárást, és kezeli a fiókokat/szekrényt/outfiteket.
// A tárolást a store.js, a hitelesítést az auth.js kezeli.
//
// Indítás a projekt gyökeréből: node server/index.js
// Indítás a server mappából: node index.js

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const QRCode = require("qrcode");
const { WebSocketServer } = require("ws");
const store = require("./store");
const auth = require("./auth");
const mail = require("./mail");
const tunnel = require("./tunnel");
const ebay = require("./ebay");

const PORT = Number(process.env.PORT) || 8080;
const ROOT = path.join(__dirname, "..");
const DEFAULT_PAGE = "Wardro Web.dc.html";

const PAIR_SESSION_TTL_MS = 20 * 60 * 1000;
const PAIR_SWEEP_MS = 30 * 1000;
const MAX_PHOTOS_PER_SESSION = 40;
const MAX_PHOTO_BYTES = 20 * 1024 * 1024;

// A Beállításokban választható színtémák.
const THEMES = ["ejjel", "rubin", "ocean", "erdo", "ametiszt", "homok", "rozsa", "zsalya", "kontraszt"];

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

const UPLOAD_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/gif",
];

function isUploadMimeOk(mime) {
  for (var i = 0; i < UPLOAD_MIME.length; i++) {
    if (UPLOAD_MIME[i] === mime) return true;
  }

  return false;
}

// Párosítási munkamenetek a QR-kódos fotóküldéshez.
var pairSessions = {};

function newToken() {
  return crypto.randomBytes(9).toString("base64url");
}

function createPairSession() {
  var token = newToken();
  var now = Date.now();

  var session = {
    token: token,
    createdAt: now,
    expiresAt: now + PAIR_SESSION_TTL_MS,
    photos: [],
    nextPhotoId: 1,
    sockets: [],
  };

  pairSessions[token] = session;
  return session;
}

function touchPairSession(session) {
  session.expiresAt = Date.now() + PAIR_SESSION_TTL_MS;
}

function endPairSession(session, reason) {
  delete pairSessions[session.token];

  for (var i = 0; i < session.sockets.length; i++) {
    var ws = session.sockets[i];

    try {
      ws.send(
        JSON.stringify({
          type: "expired",
          reason: reason || "ended",
        })
      );
    } catch (e) {}

    try {
      ws.close();
    } catch (e) {}
  }

  session.sockets = [];
  session.photos = [];
}

setInterval(function () {
  var now = Date.now();

  for (var token in pairSessions) {
    if (pairSessions[token].expiresAt <= now) {
      endPairSession(pairSessions[token], "expired");
    }
  }
}, PAIR_SWEEP_MS).unref();

function broadcast(session, msg) {
  var data = JSON.stringify(msg);

  for (var i = 0; i < session.sockets.length; i++) {
    var ws = session.sockets[i];

    if (ws.readyState === ws.OPEN) {
      ws.send(data);
    }
  }
}

function photoSummary(p) {
  return {
    id: p.id,
    name: p.name,
    mime: p.mime,
    size: p.size,
    uploadedAt: p.uploadedAt,
    url: "/api/pair/" + p.sessionToken + "/photo/" + p.id,
  };
}

// A telefon a gép helyi hálózati IP-címét használja.
// VPN-ek (Hamachi, NordVPN, Wintun...) és a 169.254.x címek kimaradnak,
// az otthoni hálózat (192.168.x, aztán 172.16-31.x, aztán 10.x) az előnyös.
// Kézzel is megadható: LAN_IP=192.168.0.106
function lanAddress() {
  if (process.env.LAN_IP) {
    return process.env.LAN_IP;
  }

  var ifaces = os.networkInterfaces();
  var best = null;
  var bestScore = 0;

  for (var name in ifaces) {
    if (/hamachi|nord|vpn|wintun|tap|tun|virtual|vmware|vbox|wsl|hyper-v/i.test(name)) {
      continue;
    }

    var list = ifaces[name] || [];

    for (var i = 0; i < list.length; i++) {
      var a = list[i];

      if (a.family !== "IPv4" && a.family !== 4) continue;
      if (a.internal || a.address.indexOf("169.254.") === 0) continue;

      var score = 1;
      if (a.address.indexOf("192.168.") === 0) score = 4;
      else if (/^172\.(1[6-9]|2\d|3[01])\./.test(a.address)) score = 3;
      else if (a.address.indexOf("10.") === 0) score = 2;

      if (score > bestScore) {
        best = a.address;
        bestScore = score;
      }
    }
  }

  return best || "localhost";
}

// Csak az oldal működéséhez szükséges fájlokat adjuk ki (engedélyezőlista).
// Minden más – a server/ mappa (benne az email.config.json jelszóval), az
// adatbázis-mentés (ruhatar.sql), a .vscode, a README stb. – tiltott, hiszen a
// szerver a hálózatról, akár az internetről is elérhető.
// (a rel útvonal már "/" elválasztós: gyökérszintű .html/.css/.js, ill. a kepek/ mappa képei)
var PUBLIKUS_GYOKER = /^[^/.][^/]*\.(html|css|js)$/i;
var PUBLIKUS_KEP = /^kepek\/[^\\]+\.(png|jpe?g|webp|gif|svg|avif|ico)$/i;
var PUBLIKUS_EGYEDI = { ".image-slots.state.json": true };

function publikusFajl(filePath) {
  var rel = path.relative(ROOT, filePath).split(path.sep).join("/");
  if (!rel || rel.indexOf("..") === 0) return false;
  if (PUBLIKUS_EGYEDI[rel]) return true;
  if (rel.split("/").some(function (r) { return r.charAt(0) === "."; })) return false;
  return PUBLIKUS_GYOKER.test(rel) || PUBLIKUS_KEP.test(rel);
}

function serveStatic(req, res, reqPath) {
  if (reqPath === "/") {
    reqPath = "/" + DEFAULT_PAGE;
  }

  var filePath;

  try {
    filePath = path.join(ROOT, decodeURIComponent(reqPath));
  } catch (e) {
    res.writeHead(400);
    res.end("Hibás útvonal");
    return;
  }

  if (filePath.indexOf(ROOT) !== 0 || !publikusFajl(filePath)) {
    // nem áruljuk el, hogy a fájl létezik-e: a tiltott fájl is "nem található"
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Nem található: " + reqPath);
    return;
  }

  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, {
        "content-type": "text/plain; charset=utf-8",
      });
      res.end("Nem található: " + reqPath);
      return;
    }

    var ext = path.extname(filePath).toLowerCase();

    res.writeHead(200, {
      "content-type":
        STATIC_MIME[ext] || "application/octet-stream",
    });

    res.end(data);
  });
}

function sendJson(res, status, obj) {
  var body = JSON.stringify(obj);

  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });

  res.end(body);
}

function readBody(req, maxBytes) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    var total = 0;

    req.on("data", function (chunk) {
      total += chunk.length;

      if (total > maxBytes) {
        reject(
          Object.assign(new Error("too large"), {
            code: "TOO_LARGE",
          })
        );

        req.destroy();
        return;
      }

      chunks.push(chunk);
    });

    req.on("end", function () {
      resolve(Buffer.concat(chunks));
    });

    req.on("error", reject);
  });
}

async function readJsonBody(req) {
  var buf = await readBody(req, 1024 * 1024);

  if (!buf.length) return {};

  return JSON.parse(buf.toString("utf8"));
}

function isValidEmail(v) {
  return /.+@.+\..+/.test(String(v || "").trim());
}

// Naptári nap ellenőrzése ÉÉÉÉ-HH-NN formátumban.
function isValidDay(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v || ""))) {
    return false;
  }

  var d = new Date(v + "T00:00:00Z");

  return (
    !isNaN(d) &&
    d.toISOString().slice(0, 10) === v
  );
}

// Bejelentkezés ellenőrzése.
async function requireUser(req, res) {
  var userId = auth.currentUserId(req);
  var user = userId
    ? await store.findUserById(userId)
    : null;

  if (!user || !user.emailVerified) {
    sendJson(res, 401, {
      ok: false,
      error: "unauthorized",
    });

    return null;
  }

  return userId;
}

const PHONE_PAGE = fs.readFileSync(
  path.join(__dirname, "phone.html"),
  "utf8"
);

// Időjárás: Open-Meteo, alapértelmezett hely Budapest.
var BUDAPEST_LAT = 47.4979;
var BUDAPEST_LON = 19.0402;
var WEATHER_CACHE_MS = 10 * 60 * 1000;
var weatherCache = {};

var WEATHER_CODE_HU = {
  0: "Derült",
  1: "Túlnyomóan derült",
  2: "Részben felhős",
  3: "Borult",
  45: "Köd",
  48: "Zúzmarás köd",
  51: "Gyenge szitálás",
  53: "Szitálás",
  55: "Sűrű szitálás",
  56: "Fagyos szitálás",
  57: "Sűrű fagyos szitálás",
  61: "Gyenge eső",
  63: "Eső",
  65: "Erős eső",
  66: "Fagyos eső",
  67: "Erős fagyos eső",
  71: "Gyenge hóesés",
  73: "Hóesés",
  75: "Erős hóesés",
  77: "Hószemek",
  80: "Gyenge zápor",
  81: "Zápor",
  82: "Heves zápor",
  85: "Hózápor",
  86: "Erős hózápor",
  95: "Zivatar",
  96: "Zivatar jégesővel",
  99: "Heves zivatar jégesővel",
};

function weatherCodeToText(code) {
  if (WEATHER_CODE_HU[code]) {
    return WEATHER_CODE_HU[code];
  }

  return "Változékony idő";
}

function seasonForTemp(tempC) {
  if (tempC < 10) return "Hideg";
  if (tempC <= 20) return "Enyhe";

  return "Meleg";
}

async function fetchWeather(lat, lon) {
  var key = lat.toFixed(2) + "," + lon.toFixed(2);
  var cached = weatherCache[key];

  if (
    cached &&
    Date.now() - cached.at < WEATHER_CACHE_MS
  ) {
    return cached.data;
  }

  var url =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    lat +
    "&longitude=" +
    lon +
    "&current=temperature_2m,weather_code" +
    "&hourly=temperature_2m" +
    "&timezone=auto&forecast_days=1";

  var r = await fetch(url);

  if (!r.ok) {
    throw new Error("open-meteo http " + r.status);
  }

  var j = await r.json();
  var tempC = j.current.temperature_2m;
  var code = j.current.weather_code;

  // Az este 9 órához legközelebbi hőmérséklet.
  var eveningC = tempC;

  if (j.hourly && j.hourly.time) {
    var bestIdx = 0;
    var bestDiff = 999;

    for (var i = 0; i < j.hourly.time.length; i++) {
      var hour = Number(
        j.hourly.time[i].slice(11, 13)
      );
      var diff = Math.abs(hour - 21);

      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }

    if (
      j.hourly.temperature_2m[bestIdx] !== undefined
    ) {
      eveningC = j.hourly.temperature_2m[bestIdx];
    }
  }

  var data = {
    tempC: tempC,
    eveningC: eveningC,
    code: code,
    description: weatherCodeToText(code),
    season: seasonForTemp(tempC),
  };

  weatherCache[key] = {
    at: Date.now(),
    data: data,
  };

  return data;
}

// Heti időjárás: az elmúlt 7 nap és a következő 7 nap (napi + óránkénti adatok).
// Open-Meteo: ingyenes, nem kell hozzá kulcs; a múltbeli napokat a past_days adja.
var weatherWeekCache = {};
var WEATHER_WEEK_CACHE_MS = 30 * 60 * 1000;

async function fetchWeatherWeek(lat, lon) {
  var key = lat.toFixed(2) + "," + lon.toFixed(2);
  var cached = weatherWeekCache[key];

  if (cached && Date.now() - cached.at < WEATHER_WEEK_CACHE_MS) {
    return cached.data;
  }

  var url =
    "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
    "&longitude=" + lon +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min," +
    "precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset" +
    "&hourly=temperature_2m,precipitation_probability,weather_code" +
    "&timezone=auto&past_days=7&forecast_days=8";

  var r = await fetch(url);

  if (!r.ok) {
    throw new Error("open-meteo http " + r.status);
  }

  var j = await r.json();

  var data = {
    timezone: j.timezone,
    current: j.current,
    daily: j.daily,
    hourly: j.hourly,
  };

  weatherWeekCache[key] = { at: Date.now(), data: data };

  return data;
}

// Helynév a koordinátákból (melyik városban vagy) – OpenStreetMap Nominatim.
// A Nominatim azonosító User-Agentet kér, ezért a szerveren át kérdezzük le.
var reverseCache = {};

async function reverseGeocode(lat, lon) {
  var key = lat.toFixed(2) + "," + lon.toFixed(2);

  if (reverseCache[key]) {
    return reverseCache[key];
  }

  var r = await fetch(
    "https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&accept-language=hu&lat=" +
      lat + "&lon=" + lon,
    { headers: { "User-Agent": "Wardro/1.0 (helyi ruhatar alkalmazas)" } }
  );

  if (!r.ok) {
    throw new Error("nominatim http " + r.status);
  }

  var j = await r.json();
  var a = j.address || {};
  var data = {
    name: a.city || a.town || a.village || a.municipality || j.name || "",
    region: a.county || a.state || a.region || "",
    country: a.country || "",
  };

  reverseCache[key] = data;

  return data;
}

// =====================================================
// VÉDELEM A JELSZÓPRÓBÁLGATÁS ELLEN
// =====================================================
// E-mail címenként 5 rossz jelszó után 15 percre zároljuk a belépést, és egy
// IP-címről is legfeljebb 20 hibás próbálkozást engedünk 15 percen belül.
// A zárolás ideje ismételt zárolásnál duplázódik (legfeljebb 2 óra).
// Ugyanez a számláló fogja vissza az "Elfelejtett jelszó" levelek kérését is.

var PROBA_ABLAK_MS = 15 * 60 * 1000;
var PROBA_LIMIT = { email: 5, ip: 20, forgot: 5 };
var ZAR_MAX_MS = 2 * 60 * 60 * 1000;
var probak = {};

// a valódi kliens IP-je; a Cloudflare Tunnel helyben (127.0.0.1) csatlakozik,
// ilyenkor a Cloudflare által adott fejlécet használjuk
function kliensIp(req) {
  var ip = (req.socket && req.socket.remoteAddress) || "";
  var helyi = ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
  var cf = req.headers["cf-connecting-ip"];
  if (helyi && cf) return String(cf).trim().slice(0, 64);
  return ip;
}

function probaRekord(kulcs) {
  var most = Date.now();
  var r = probak[kulcs];
  if (!r || (r.zarVege < most && most - r.elso > PROBA_ABLAK_MS)) {
    r = probak[kulcs] = { db: 0, elso: most, zarVege: 0, zarSzam: r ? r.zarSzam : 0, utolso: most };
  }
  return r;
}

// hány másodperc van hátra a zárolásból (0 = nincs zárolva)
function zarolva(kulcs) {
  var r = probak[kulcs];
  if (!r || r.zarVege <= Date.now()) return 0;
  return Math.ceil((r.zarVege - Date.now()) / 1000);
}

// hibás próbálkozás; visszaadja, hány próbálkozás maradt még
function hibasProba(kulcs, limit) {
  var r = probaRekord(kulcs);
  var most = Date.now();
  if (r.zarVege && r.zarVege <= most) { r.db = 0; r.elso = most; r.zarVege = 0; }
  r.db++;
  r.utolso = most;
  if (r.db >= limit) {
    r.zarVege = most + Math.min(PROBA_ABLAK_MS * Math.pow(2, r.zarSzam), ZAR_MAX_MS);
    r.zarSzam++;
    return 0;
  }
  return limit - r.db;
}

function probaTorol(kulcs) {
  delete probak[kulcs];
}

// a régi bejegyzések kitakarítása, hogy ne nőjön a végtelenségig
setInterval(function () {
  var most = Date.now();
  Object.keys(probak).forEach(function (k) {
    var r = probak[k];
    if (r.zarVege < most && most - r.utolso > ZAR_MAX_MS) delete probak[k];
  });
}, 10 * 60 * 1000).unref();

function tulSokProba(res, mp) {
  res.setHeader("Retry-After", String(mp));
  return sendJson(res, 429, { ok: false, error: "too_many_attempts", retryAfter: mp });
}

function tokenHash(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

const server = http.createServer(
  async function (req, res) {
    var url = new URL(req.url, "http://x");
    var p = url.pathname;

    try {
      // =====================================================
      // FIÓKOK
      // =====================================================

      if (
        p === "/api/auth/signup" &&
        req.method === "POST"
      ) {
        var body;

        try {
          body = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_json",
          });
        }

        var name = String(body.name || "").trim();
        var email = String(body.email || "").trim();
        var password = String(body.password || "");

        if (!name) {
          return sendJson(res, 400, {
            ok: false,
            error: "missing_name",
          });
        }

        if (!isValidEmail(email)) {
          return sendJson(res, 400, {
            ok: false,
            error: "invalid_email",
          });
        }

        if (password.length < 8) {
          return sendJson(res, 400, {
            ok: false,
            error: "weak_password",
          });
        }

        if (await store.findUserByEmail(email)) {
          return sendJson(res, 409, {
            ok: false,
            error: "email_taken",
          });
        }

        var verifyToken = crypto.randomBytes(32).toString("hex");

        var newUser = await store.createUser({
          name: name,
          email: email,
          passwordHash: auth.hashPassword(password),
          profile: body.profile,
          verifyToken: verifyToken,
        });

        // nem léptetjük be: előbb meg kell erősítenie az e-mail címét
        var kuldes = await mail.sendVerification(
          newUser.email,
          newUser.name,
          mail.appUrl(req, lanAddress, PORT, tunnel.url) + "/api/auth/verify?token=" + verifyToken
        );

        return sendJson(res, 200, {
          ok: true,
          needsVerification: true,
          email: newUser.email,
          mailSent: kuldes.sent,
          mailConfigured: kuldes.configured,
        });
      }

      if (
        p === "/api/auth/login" &&
        req.method === "POST"
      ) {
        var loginBody;

        try {
          loginBody = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_json",
          });
        }

        var lEmailKulcs = "email:" + String(loginBody.email || "").trim().toLowerCase();
        var lIpKulcs = "ip:" + kliensIp(req);
        var lZar = Math.max(zarolva(lEmailKulcs), zarolva(lIpKulcs));

        // zárolás alatt a jelszót meg sem nézzük
        if (lZar) return tulSokProba(res, lZar);

        var loginUser = await store.findUserByEmail(
          loginBody.email || ""
        );

        if (
          !loginUser ||
          !auth.verifyPassword(
            String(loginBody.password || ""),
            loginUser.passwordHash
          )
        ) {
          var maradEmail = hibasProba(lEmailKulcs, PROBA_LIMIT.email);
          var maradIp = hibasProba(lIpKulcs, PROBA_LIMIT.ip);
          var lUjZar = Math.max(zarolva(lEmailKulcs), zarolva(lIpKulcs));

          if (lUjZar) return tulSokProba(res, lUjZar);

          return sendJson(res, 401, {
            ok: false,
            error: "invalid_credentials",
            attemptsLeft: Math.min(maradEmail, maradIp),
          });
        }

        probaTorol(lEmailKulcs);

        if (!loginUser.emailVerified) {
          return sendJson(res, 403, {
            ok: false,
            error: "email_not_verified",
            email: loginUser.email,
          });
        }

        auth.setSessionCookie(
          res,
          auth.createSession(loginUser.id)
        );

        return sendJson(res, 200, {
          ok: true,
          user: store.publicUser(loginUser),
        });
      }

      // a megerősítő e-mail linkje: aktiválja a fiókot, belépteti, és visszavisz az oldalra
      if (
        p === "/api/auth/verify" &&
        req.method === "GET"
      ) {
        var vToken = String(url.searchParams.get("token") || "");
        var vUser = await store.findUserByVerifyToken(vToken);
        var vHova = "/";

        if (!vUser) {
          vHova = "/?verified=invalid";
        } else if (vUser.verifyExpires && vUser.verifyExpires < Date.now()) {
          vHova = "/?verified=expired&email=" + encodeURIComponent(vUser.email);
        } else {
          await store.markEmailVerified(vUser.id);
          auth.setSessionCookie(res, auth.createSession(vUser.id));
          vHova = "/?verified=1";
        }

        res.writeHead(302, { Location: vHova, "Cache-Control": "no-store" });
        return res.end();
      }

      // megerősítő e-mail újraküldése (percenként legfeljebb egyszer)
      if (
        p === "/api/auth/resend" &&
        req.method === "POST"
      ) {
        var rBody;

        try {
          rBody = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, { ok: false, error: "bad_json" });
        }

        var rUser = await store.findUserByEmail(String(rBody.email || "").trim());

        // nem áruljuk el, létezik-e a cím: ismeretlen vagy már megerősített címre is "ok"
        if (!rUser || rUser.emailVerified) {
          return sendJson(res, 200, { ok: true, mailConfigured: mail.isConfigured() });
        }

        if (rUser.verifySentAt && Date.now() - rUser.verifySentAt < 60 * 1000) {
          return sendJson(res, 429, { ok: false, error: "too_soon" });
        }

        var ujToken = crypto.randomBytes(32).toString("hex");
        await store.setVerifyToken(rUser.id, ujToken);
        var rKuldes = await mail.sendVerification(
          rUser.email,
          rUser.name,
          mail.appUrl(req, lanAddress, PORT, tunnel.url) + "/api/auth/verify?token=" + ujToken
        );

        return sendJson(res, 200, {
          ok: true,
          mailSent: rKuldes.sent,
          mailConfigured: rKuldes.configured,
        });
      }

      // elfelejtett jelszó: visszaállító link küldése e-mailben
      if (
        p === "/api/auth/forgot" &&
        req.method === "POST"
      ) {
        var fBody;

        try {
          fBody = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, { ok: false, error: "bad_json" });
        }

        var fIpKulcs = "forgot:" + kliensIp(req);
        var fZar = zarolva(fIpKulcs);

        if (fZar) return tulSokProba(res, fZar);
        hibasProba(fIpKulcs, PROBA_LIMIT.forgot);

        var fEmail = String(fBody.email || "").trim();

        if (!isValidEmail(fEmail)) {
          return sendJson(res, 400, { ok: false, error: "invalid_email" });
        }

        var fUser = await store.findUserByEmail(fEmail);

        // nem áruljuk el, létezik-e a cím: ismeretlen címre is ugyanazt válaszoljuk
        if (fUser && !(fUser.resetSentAt && Date.now() - fUser.resetSentAt < 60 * 1000)) {
          var fToken = crypto.randomBytes(32).toString("hex");
          await store.setResetToken(fUser.id, tokenHash(fToken));
          await mail.sendPasswordReset(
            fUser.email,
            fUser.name,
            mail.appUrl(req, lanAddress, PORT, tunnel.url) + "/?reset=" + fToken
          );
        }

        return sendJson(res, 200, { ok: true, mailConfigured: mail.isConfigured() });
      }

      // a visszaállító link érvényes-e még (az oldal ezzel jelzi előre, ha lejárt)
      if (
        p === "/api/auth/reset" &&
        req.method === "GET"
      ) {
        var cUser = await store.findUserByResetHash(tokenHash(url.searchParams.get("token") || ""));

        if (!cUser) return sendJson(res, 404, { ok: false, error: "invalid_token" });
        if (!cUser.resetExpires || cUser.resetExpires < Date.now()) {
          return sendJson(res, 410, { ok: false, error: "expired_token" });
        }

        return sendJson(res, 200, { ok: true, email: cUser.email });
      }

      // új jelszó beállítása a linkben kapott tokennel
      if (
        p === "/api/auth/reset" &&
        req.method === "POST"
      ) {
        var nBody;

        try {
          nBody = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, { ok: false, error: "bad_json" });
        }

        var nUj = String(nBody.password || "");

        if (nUj.length < 8) {
          return sendJson(res, 400, { ok: false, error: "weak_password" });
        }

        var nUser = await store.findUserByResetHash(tokenHash(nBody.token || ""));

        if (!nUser) return sendJson(res, 404, { ok: false, error: "invalid_token" });
        if (!nUser.resetExpires || nUser.resetExpires < Date.now()) {
          return sendJson(res, 410, { ok: false, error: "expired_token" });
        }

        var frissUser = await store.resetPassword(nUser.id, auth.hashPassword(nUj));

        // minden régi bejelentkezés megszűnik, a zárolás feloldódik, és itt rögtön belép
        auth.destroyUserSessions(nUser.id);
        probaTorol("email:" + String(nUser.email).toLowerCase());
        auth.setSessionCookie(res, auth.createSession(nUser.id));

        return sendJson(res, 200, { ok: true, user: store.publicUser(frissUser) });
      }

      if (
        p === "/api/auth/logout" &&
        req.method === "POST"
      ) {
        var logoutToken =
          auth.parseCookies(req)[auth.SESSION_COOKIE];

        if (logoutToken) {
          auth.destroySession(logoutToken);
        }

        auth.clearSessionCookie(res);

        return sendJson(res, 200, {
          ok: true,
        });
      }

      if (
        p === "/api/auth/me" &&
        req.method === "GET"
      ) {
        var meUserId = await requireUser(req, res);

        if (!meUserId) return;

        return sendJson(res, 200, {
          ok: true,
          user: store.publicUser(
            await store.findUserById(meUserId)
          ),
        });
      }

      // =====================================================
      // KATEGÓRIÁK
      // =====================================================

      if (
        p === "/api/categories" &&
        req.method === "GET"
      ) {
        var catUserId = await requireUser(req, res);

        if (!catUserId) return;

        return sendJson(res, 200, {
          ok: true,
          categories:
            await store.listCategories(catUserId),
        });
      }

      if (
        p === "/api/categories" &&
        req.method === "POST"
      ) {
        var newCatUserId =
          await requireUser(req, res);

        if (!newCatUserId) return;

        var catBody;

        try {
          catBody = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_json",
          });
        }

        var catName = String(
          catBody.name || ""
        ).trim();

        if (!catName) {
          return sendJson(res, 400, {
            ok: false,
            error: "missing_name",
          });
        }

        return sendJson(res, 200, {
          ok: true,
          category: await store.createCategory(
            newCatUserId,
            catName
          ),
        });
      }

      var cm = p.match(
        /^\/api\/categories\/([\w-]+)$/
      );

      if (cm && req.method === "PATCH") {
        var renameUserId =
          await requireUser(req, res);

        if (!renameUserId) return;

        var renameBody;

        try {
          renameBody = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_json",
          });
        }

        var renamed = await store.renameCategory(
          renameUserId,
          cm[1],
          String(renameBody.name || "").trim()
        );

        if (!renamed) {
          return sendJson(res, 404, {
            ok: false,
            error: "not_found",
          });
        }

        return sendJson(res, 200, {
          ok: true,
          category: renamed,
        });
      }

      if (cm && req.method === "DELETE") {
        var delCatUserId =
          await requireUser(req, res);

        if (!delCatUserId) return;

        var catDeleted = await store.deleteCategory(
          delCatUserId,
          cm[1]
        );

        return sendJson(
          res,
          catDeleted ? 200 : 404,
          { ok: catDeleted }
        );
      }

      // =====================================================
      // RUHADARABOK
      // =====================================================

      if (
        p === "/api/items" &&
        req.method === "GET"
      ) {
        var listItemsUserId =
          await requireUser(req, res);

        if (!listItemsUserId) return;

        return sendJson(res, 200, {
          ok: true,
          items:
            await store.listItems(listItemsUserId),
        });
      }

      if (
        p === "/api/items" &&
        req.method === "POST"
      ) {
        var newItemUserId =
          await requireUser(req, res);

        if (!newItemUserId) return;

        var itemBody;

        try {
          itemBody = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_json",
          });
        }

        var itemLabel = String(
          itemBody.label || ""
        ).trim();

        if (!itemLabel) {
          return sendJson(res, 400, {
            ok: false,
            error: "missing_label",
          });
        }

        itemBody.label = itemLabel;

        return sendJson(res, 200, {
          ok: true,
          item: await store.createItem(
            newItemUserId,
            itemBody
          ),
        });
      }

      var im = p.match(
        /^\/api\/items\/([\w-]+)$/
      );

      if (im && req.method === "PATCH") {
        var patchItemUserId =
          await requireUser(req, res);

        if (!patchItemUserId) return;

        var patchBody;

        try {
          patchBody = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_json",
          });
        }

        var itemPatch = {};
        var patchableFields = [
          "label",
          "categoryId",
          "photoUrl",
          "tags",
          "wornToday",
          "price",
          "origPhotoUrl",
          "color",
          "colorHex",
          "brand",
          "inLaundry",
          "needsRepair",
          "care",
        ];

        for (
          var pf = 0;
          pf < patchableFields.length;
          pf++
        ) {
          var pfKey = patchableFields[pf];

          if (pfKey in patchBody) {
            itemPatch[pfKey] = patchBody[pfKey];
          }
        }

        if (itemPatch.wornToday) {
          itemPatch.lastWornAt = Date.now();
        }

        var patchedItem = await store.updateItem(
          patchItemUserId,
          im[1],
          itemPatch
        );

        if (!patchedItem) {
          return sendJson(res, 404, {
            ok: false,
            error: "not_found",
          });
        }

        return sendJson(res, 200, {
          ok: true,
          item: patchedItem,
        });
      }

      if (im && req.method === "DELETE") {
        var purgeUserId =
          await requireUser(req, res);

        if (!purgeUserId) return;

        var purged = await store.purgeItem(
          purgeUserId,
          im[1]
        );

        return sendJson(
          res,
          purged ? 200 : 404,
          { ok: purged }
        );
      }

      im = p.match(
        /^\/api\/items\/([\w-]+)\/remove$/
      );

      if (im && req.method === "POST") {
        var removeUserId =
          await requireUser(req, res);

        if (!removeUserId) return;

        var removedItem = await store.removeItem(
          removeUserId,
          im[1]
        );

        if (!removedItem) {
          return sendJson(res, 404, {
            ok: false,
            error: "not_found",
          });
        }

        this;
        this;

        // A visszaállításhoz a kliens újra lekéri a listát.
        return sendJson(res, 200, {
          ok: true,
          item: removedItem,
        });
      }

      im = p.match(
        /^\/api\/items\/([\w-]+)\/restore$/
      );

      if (im && req.method === "POST") {
        var restoreUserId =
          await requireUser(req, res);

        if (!restoreUserId) return;

        var restoredItem = await store.restoreItem(
          restoreUserId,
          im[1]
        );

        if (!restoredItem) {
          return sendJson(res, 404, {
            ok: false,
            error: "not_found",
          });
        }

        return sendJson(res, 200, {
          ok: true,
          item: restoredItem,
        });
      }

      // =====================================================
      // FOTÓK
      // =====================================================

      if (
        p === "/api/photos" &&
        req.method === "POST"
      ) {
        var photoUserId =
          await requireUser(req, res);

        if (!photoUserId) return;

        var photoMime = (
          req.headers["content-type"] || ""
        )
          .split(";")[0]
          .trim()
          .toLowerCase();

        if (!isUploadMimeOk(photoMime)) {
          return sendJson(res, 415, {
            ok: false,
            error: "unsupported_type",
          });
        }

        var photoBuf;

        try {
          photoBuf = await readBody(
            req,
            MAX_PHOTO_BYTES
          );
        } catch (e) {
          return sendJson(
            res,
            e.code === "TOO_LARGE" ? 413 : 400,
            {
              ok: false,
              error: "upload_failed",
            }
          );
        }

        if (!photoBuf.length) {
          return sendJson(res, 400, {
            ok: false,
            error: "empty",
          });
        }

        var newPhotoId = store.savePhoto(
          photoMime,
          photoBuf
        );

        return sendJson(res, 200, {
          ok: true,
          id: newPhotoId,
          url: "/api/photos/" + newPhotoId,
        });
      }

      var pm = p.match(
        /^\/api\/photos\/([\w.-]+)$/
      );

      if (pm && req.method === "GET") {
        var storedPhoto = store.getPhoto(pm[1]);

        if (!storedPhoto) {
          res.writeHead(404);
          return res.end();
        }

        res.writeHead(200, {
          "content-type": storedPhoto.mime,
          "cache-control":
            "public, max-age=31536000, immutable",
        });

        return res.end(storedPhoto.buf);
      }

      // =====================================================
      // OUTFITEK
      // =====================================================

      if (
        p === "/api/outfits" &&
        req.method === "GET"
      ) {
        var listOutfitsUserId =
          await requireUser(req, res);

        if (!listOutfitsUserId) return;

        return sendJson(res, 200, {
          ok: true,
          outfits:
            await store.listOutfits(
              listOutfitsUserId
            ),
        });
      }

      if (
        p === "/api/outfits" &&
        req.method === "POST"
      ) {
        var newOutfitUserId =
          await requireUser(req, res);

        if (!newOutfitUserId) return;

        var outfitBody;

        try {
          outfitBody = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_json",
          });
        }

        var outfitName = String(
          outfitBody.name || ""
        ).trim();

        if (!outfitName) {
          return sendJson(res, 400, {
            ok: false,
            error: "missing_name",
          });
        }

        outfitBody.name = outfitName;

        var createdOutfit =
          await store.createOutfit(
            newOutfitUserId,
            outfitBody
          );

        if (isValidDay(outfitBody.logDay)) {
          await store.setOutfitLog(
            newOutfitUserId,
            outfitBody.logDay,
            createdOutfit.id
          );
        }

        return sendJson(res, 200, {
          ok: true,
          outfit: createdOutfit,
        });
      }

      // =====================================================
      // NAPTÁR
      // =====================================================

      if (
        p === "/api/calendar" &&
        req.method === "GET"
      ) {
        var calUserId =
          await requireUser(req, res);

        if (!calUserId) return;

        return sendJson(res, 200, {
          ok: true,
          entries:
            await store.listOutfitLog(calUserId),
        });
      }

      cm = p.match(
        /^\/api\/calendar\/([\d-]+)$/
      );

      if (cm && req.method === "PUT") {
        var putCalUserId =
          await requireUser(req, res);

        if (!putCalUserId) return;

        if (!isValidDay(cm[1])) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_day",
          });
        }

        var calBody;

        try {
          calBody = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_json",
          });
        }

        var logged = await store.setOutfitLog(
          putCalUserId,
          cm[1],
          calBody.outfitId
        );

        return sendJson(
          res,
          logged ? 200 : 404,
          { ok: logged }
        );
      }

      if (cm && req.method === "DELETE") {
        var delCalUserId =
          await requireUser(req, res);

        if (!delCalUserId) return;

        if (!isValidDay(cm[1])) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_day",
          });
        }

        await store.clearOutfitLog(
          delCalUserId,
          cm[1]
        );

        return sendJson(res, 200, {
          ok: true,
        });
      }

      var om = p.match(
        /^\/api\/outfits\/([\w-]+)$/
      );

      if (om && req.method === "PATCH") {
        var patchOutfitUserId =
          await requireUser(req, res);

        if (!patchOutfitUserId) return;

        var outfitPatchBody;

        try {
          outfitPatchBody =
            await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_json",
          });
        }

        var outfitPatch = {};
        var outfitFields = [
          "name",
          "occasion",
          "season",
          "itemIds",
          "favourite",
          "wornToday",
        ];

        for (
          var of = 0;
          of < outfitFields.length;
          of++
        ) {
          var ofKey = outfitFields[of];

          if (ofKey in outfitPatchBody) {
            outfitPatch[ofKey] =
              outfitPatchBody[ofKey];
          }
        }

        var patchedOutfit =
          await store.updateOutfit(
            patchOutfitUserId,
            om[1],
            outfitPatch
          );

        if (!patchedOutfit) {
          return sendJson(res, 404, {
            ok: false,
            error: "not_found",
          });
        }

        return sendJson(res, 200, {
          ok: true,
          outfit: patchedOutfit,
        });
      }

      if (om && req.method === "DELETE") {
        var delOutfitUserId =
          await requireUser(req, res);

        if (!delOutfitUserId) return;

        var outfitDeleted =
          await store.deleteOutfit(
            delOutfitUserId,
            om[1]
          );

        return sendJson(
          res,
          outfitDeleted ? 200 : 404,
          { ok: outfitDeleted }
        );
      }

      // =====================================================
      // BEÁLLÍTÁSOK
      // =====================================================

      if (
        p === "/api/settings" &&
        req.method === "GET"
      ) {
        var settingsUserId =
          await requireUser(req, res);

        if (!settingsUserId) return;

        return sendJson(res, 200, {
          ok: true,
          user: store.publicUser(
            await store.findUserById(
              settingsUserId
            )
          ),
        });
      }

      if (
        p === "/api/settings" &&
        req.method === "PATCH"
      ) {
        var patchSettingsUserId =
          await requireUser(req, res);

        if (!patchSettingsUserId) return;

        var settingsBody;

        try {
          settingsBody =
            await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_json",
          });
        }

        var settingsPatch = {};
        var settingsFields = [
          "name",
          "email",
          "profile",
          "density",
          "showUnwornFlags",
          "reminders",
          "theme",
        ];

        for (
          var sf = 0;
          sf < settingsFields.length;
          sf++
        ) {
          var sfKey = settingsFields[sf];

          if (sfKey in settingsBody) {
            settingsPatch[sfKey] =
              settingsBody[sfKey];
          }
        }

        if (
          "theme" in settingsPatch &&
          THEMES.indexOf(settingsPatch.theme) === -1
        ) {
          return sendJson(res, 400, {
            ok: false,
            error: "bad_theme",
          });
        }

        return sendJson(res, 200, {
          ok: true,
          user: store.publicUser(
            await store.updateUser(
              patchSettingsUserId,
              settingsPatch
            )
          ),
        });
      }

      // =====================================================
      // EBAY – termékfotók a katalógushoz és szabad keresés
      // (csak bejelentkezve, hogy a nyilvános címen ne lehessen a kulcsunkkal keresgélni)
      // =====================================================

      if (p === "/api/ebay/status" && req.method === "GET") {
        if (!(await requireUser(req, res))) return;
        return sendJson(res, 200, Object.assign({ ok: true }, { ebay: await ebay.status() }));
      }

      if (p === "/api/ebay/katalogus" && req.method === "POST") {
        if (!(await requireUser(req, res))) return;
        var ekBody;
        try {
          ekBody = await readJsonBody(req);
        } catch (e) {
          return sendJson(res, 400, { ok: false, error: "bad_json" });
        }
        var ekItems = Array.isArray(ekBody.items) ? ekBody.items.slice(0, 48) : [];
        try {
          return sendJson(res, 200, { ok: true, kepek: await ebay.katalogusKepek(ekItems) });
        } catch (e) {
          return sendJson(res, 503, { ok: false, error: e.kod || "ebay_failed" });
        }
      }

      if (p === "/api/ebay/kereses" && req.method === "GET") {
        if (!(await requireUser(req, res))) return;
        var ekQ = String(url.searchParams.get("q") || "").trim();
        if (ekQ.length < 3) return sendJson(res, 400, { ok: false, error: "short_query" });
        try {
          return sendJson(res, 200, { ok: true, items: await ebay.search(ekQ, 24) });
        } catch (e) {
          return sendJson(res, 503, { ok: false, error: e.kod || "ebay_failed" });
        }
      }

      // a katalógus már letöltött képei (a Főoldal inspirációjához bejelentkezés nélkül is kell)
      if (p === "/api/ebay/katalogus-kepek" && req.method === "GET") {
        return sendJson(res, 200, { ok: true, alap: "https://i.ebayimg.com/", kepek: ebay.osszesKatalogusKep() });
      }

      if (p === "/api/ebay/kep" && req.method === "GET") {
        var ekKep = String(url.searchParams.get("u") || "");
        // a katalógus ismert képei bárkinek; bármi más (szabad keresés) csak bejelentkezve
        if (!ebay.katalogusKepE(ekKep) && !(await requireUser(req, res))) return;
        try {
          return await ebay.kepTovabbit(ekKep, res);
        } catch (e) {
          if (!res.headersSent) res.writeHead(502);
          return res.end();
        }
      }

      // =====================================================
      // IDŐJÁRÁS
      // =====================================================

      if (
        p === "/api/geocode/reverse" &&
        req.method === "GET"
      ) {
        var gLat = Number(url.searchParams.get("lat"));
        var gLon = Number(url.searchParams.get("lon"));

        if (!Number.isFinite(gLat) || !Number.isFinite(gLon) || Math.abs(gLat) > 90 || Math.abs(gLon) > 180) {
          return sendJson(res, 400, { ok: false, error: "bad_coords" });
        }

        try {
          var hely = await reverseGeocode(gLat, gLon);
          return sendJson(res, 200, Object.assign({ ok: true }, hely));
        } catch (e) {
          console.log("helynév lekérés nem sikerült: " + e.message);
          return sendJson(res, 502, { ok: false, error: "geocode_unavailable" });
        }
      }

      if (
        p === "/api/weather/week" &&
        req.method === "GET"
      ) {
        var wLat = Number(url.searchParams.get("lat"));
        var wLon = Number(url.searchParams.get("lon"));
        var wHasCoords =
          url.searchParams.has("lat") &&
          url.searchParams.has("lon") &&
          Number.isFinite(wLat) &&
          Number.isFinite(wLon) &&
          Math.abs(wLat) <= 90 &&
          Math.abs(wLon) <= 180;

        try {
          var week = await fetchWeatherWeek(
            wHasCoords ? wLat : BUDAPEST_LAT,
            wHasCoords ? wLon : BUDAPEST_LON
          );

          return sendJson(
            res,
            200,
            Object.assign({ ok: true, usedDefaultLocation: !wHasCoords }, week)
          );
        } catch (e) {
          console.log("heti időjárás lekérés nem sikerült: " + e.message);

          return sendJson(res, 502, {
            ok: false,
            error: "weather_unavailable",
          });
        }
      }

      if (
        p === "/api/weather" &&
        req.method === "GET"
      ) {
        var hasParams =
          url.searchParams.has("lat") &&
          url.searchParams.has("lon");

        var lat = Number(
          url.searchParams.get("lat")
        );

        var lon = Number(
          url.searchParams.get("lon")
        );

        var hasCoords =
          hasParams &&
          Number.isFinite(lat) &&
          Number.isFinite(lon) &&
          Math.abs(lat) <= 90 &&
          Math.abs(lon) <= 180;

        try {
          var weatherData = await fetchWeather(
            hasCoords ? lat : BUDAPEST_LAT,
            hasCoords ? lon : BUDAPEST_LON
          );

          return sendJson(
            res,
            200,
            Object.assign(
              {
                ok: true,
                usedDefaultLocation: !hasCoords,
              },
              weatherData
            )
          );
        } catch (e) {
          console.log(
            "időjárás lekérés nem sikerült: " +
              e.message
          );

          return sendJson(res, 502, {
            ok: false,
            error: "weather_unavailable",
          });
        }
      }

      // =====================================================
      // UTAZÁS – időjárás-előrejelzés a bőröndpakolóhoz
      // GET /api/utazas?hely=Barcelona&napok=5&indulas=2026-10-20
      // =====================================================

      if (
        p === "/api/utazas" &&
        req.method === "GET"
      ) {
        var utHely = (url.searchParams.get("hely") || "").trim().slice(0, 80);
        var utNapok = Math.min(14, Math.max(1, Number(url.searchParams.get("napok")) || 3));
        var utIndulas = url.searchParams.get("indulas") || "";

        if (!utHely) {
          return sendJson(res, 400, { ok: false, error: "missing_place" });
        }

        try {
          var geo = await (await fetch(
            "https://geocoding-api.open-meteo.com/v1/search?count=1&language=hu&name=" + encodeURIComponent(utHely)
          )).json();
          var helyAdat = geo.results && geo.results[0];

          if (!helyAdat) {
            return sendJson(res, 200, { ok: false, error: "place_not_found" });
          }

          // az előrejelzés legfeljebb 16 napra előre érhető el
          var maRegg = new Date();
          maRegg.setHours(0, 0, 0, 0);
          // naptári napokat adunk hozzá (nem 24 órákat), különben az óraátállításos napokon elcsúszna
          var pluszNap = function (d, n) {
            var x = new Date(d);
            x.setDate(x.getDate() + n);
            return x;
          };
          var indul = /^\d{4}-\d{2}-\d{2}$/.test(utIndulas) ? new Date(utIndulas + "T00:00:00") : pluszNap(maRegg, 1);
          if (indul < maRegg) indul = maRegg;
          var vege = pluszNap(indul, utNapok - 1);
          var maxVege = pluszNap(maRegg, 15);
          var csakAtlag = vege > maxVege;
          var nap = function (d) {
            return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
          };

          var elo = await (await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=" + helyAdat.latitude + "&longitude=" + helyAdat.longitude +
            "&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto" +
            "&start_date=" + nap(csakAtlag ? maRegg : indul) + "&end_date=" + nap(csakAtlag ? maxVege : vege)
          )).json();

          if (!elo.daily) {
            return sendJson(res, 502, { ok: false, error: "forecast_unavailable" });
          }

          var napok = elo.daily.time.map(function (t, i) {
            return {
              datum: t,
              max: elo.daily.temperature_2m_max[i],
              min: elo.daily.temperature_2m_min[i],
              kod: elo.daily.weather_code[i],
              leiras: weatherCodeToText(elo.daily.weather_code[i]),
              eso: elo.daily.precipitation_probability_max ? elo.daily.precipitation_probability_max[i] : null,
            };
          });

          // ha az utazás 16 napnál messzebb van, a mostani 16 nap mintázatát ismételjük (tájékoztató jelleggel)
          if (csakAtlag) {
            var kiNapok = [];
            for (var ui = 0; ui < utNapok; ui++) {
              var minta = napok[ui % napok.length];
              kiNapok.push(Object.assign({}, minta, { datum: nap(pluszNap(indul, ui)), becsult: true }));
            }
            napok = kiNapok;
          }

          return sendJson(res, 200, {
            ok: true,
            hely: helyAdat.name + (helyAdat.country ? ", " + helyAdat.country : ""),
            becsult: csakAtlag,
            napok: napok,
          });
        } catch (e) {
          console.error("utazási előrejelzés:", e.message);
          return sendJson(res, 502, { ok: false, error: "forecast_unavailable" });
        }
      }

      // =====================================================
      // TELEFONOS QR PÁROSÍTÁS
      // =====================================================

      if (
        p === "/api/pair/start" &&
        req.method === "POST"
      ) {
        var pairSession = createPairSession();

        console.log(
          "[párosítás] új kód: " + pairSession.token +
            " (" + req.socket.remoteAddress + ")"
        );

        var phoneUrl =
          "http://" +
          lanAddress() +
          ":" +
          PORT +
          "/phone/" +
          pairSession.token;

        return sendJson(res, 200, {
          token: pairSession.token,
          phoneUrl: phoneUrl,
          expiresAt: pairSession.expiresAt,
        });
      }

      var m = p.match(
        /^\/api\/pair\/([\w-]+)\/qr\.svg$/
      );

      if (m && req.method === "GET") {
        var qrSession = pairSessions[m[1]];

        if (!qrSession) {
          res.writeHead(404);
          return res.end();
        }

        var qrPhoneUrl =
          "http://" +
          lanAddress() +
          ":" +
          PORT +
          "/phone/" +
          qrSession.token;

        var svg = await QRCode.toString(
          qrPhoneUrl,
          {
            type: "svg",
            margin: 1,
            color: {
              dark: "#57462F",
              light: "#0000",
            },
          }
        );

        res.writeHead(200, {
          "content-type": "image/svg+xml",
          "cache-control": "no-store",
        });

        return res.end(svg);
      }

      m = p.match(
        /^\/api\/pair\/([\w-]+)\/status$/
      );

      if (m && req.method === "GET") {
        var statusSession = pairSessions[m[1]];

        if (!statusSession) {
          return sendJson(res, 404, {
            ok: false,
          });
        }

        return sendJson(res, 200, {
          ok: true,
          expiresAt: statusSession.expiresAt,
          photoCount: statusSession.photos.length,
        });
      }

      m = p.match(
        /^\/api\/pair\/([\w-]+)\/upload$/
      );

      if (m && req.method === "POST") {
        var uploadSession = pairSessions[m[1]];

        if (!uploadSession) {
          return sendJson(res, 410, {
            ok: false,
            error: "expired",
          });
        }

        if (
          uploadSession.photos.length >=
          MAX_PHOTOS_PER_SESSION
        ) {
          return sendJson(res, 429, {
            ok: false,
            error: "too_many",
          });
        }

        var uploadMime = (
          req.headers["content-type"] || ""
        )
          .split(";")[0]
          .trim()
          .toLowerCase();

        if (!isUploadMimeOk(uploadMime)) {
          return sendJson(res, 415, {
            ok: false,
            error: "unsupported_type",
          });
        }

        var uploadBuf;

        try {
          uploadBuf = await readBody(
            req,
            MAX_PHOTO_BYTES
          );
        } catch (e) {
          return sendJson(
            res,
            e.code === "TOO_LARGE" ? 413 : 400,
            {
              ok: false,
              error: "upload_failed",
            }
          );
        }

        if (!uploadBuf.length) {
          return sendJson(res, 400, {
            ok: false,
            error: "empty",
          });
        }

        var photoName = (
          url.searchParams.get("name") ||
          "photo-" +
            uploadSession.nextPhotoId +
            ".jpg"
        ).slice(0, 120);

        var newPhoto = {
          id: uploadSession.nextPhotoId,
          name: photoName,
          mime: uploadMime,
          size: uploadBuf.length,
          buf: uploadBuf,
          uploadedAt: Date.now(),
          sessionToken: uploadSession.token,
        };

        uploadSession.nextPhotoId =
          uploadSession.nextPhotoId + 1;

        uploadSession.photos.push(newPhoto);
        touchPairSession(uploadSession);

        console.log(
          "[párosítás] fotó érkezett (" + uploadSession.token + "), " +
            uploadSession.sockets.length + " gépes kapcsolatnak továbbítva"
        );

        broadcast(
          uploadSession,
          Object.assign(
            { type: "photo" },
            photoSummary(newPhoto)
          )
        );

        return sendJson(res, 200, {
          ok: true,
          id: newPhoto.id,
        });
      }

      m = p.match(
        /^\/api\/pair\/([\w-]+)\/photo\/(\d+)$/
      );

      if (m && req.method === "GET") {
        var photoSession = pairSessions[m[1]];
        var foundPhoto = null;

        if (photoSession) {
          for (
            var i = 0;
            i < photoSession.photos.length;
            i++
          ) {
            if (
              photoSession.photos[i].id ===
              Number(m[2])
            ) {
              foundPhoto = photoSession.photos[i];
              break;
            }
          }
        }

        if (!foundPhoto) {
          res.writeHead(404);
          return res.end();
        }

        res.writeHead(200, {
          "content-type": foundPhoto.mime,
          "cache-control":
            "public, max-age=3600, immutable",
        });

        return res.end(foundPhoto.buf);
      }

      m = p.match(
        /^\/api\/pair\/([\w-]+)\/end$/
      );

      if (m && req.method === "POST") {
        var endSession = pairSessions[m[1]];

        if (endSession) {
          endPairSession(
            endSession,
            "disconnected"
          );
        }

        return sendJson(res, 200, {
          ok: true,
        });
      }

      m = p.match(/^\/phone\/([\w-]+)$/);

      if (m && req.method === "GET") {
        var phoneSession = pairSessions[m[1]];

        var html = PHONE_PAGE
          .replace(/__TOKEN__/g, m[1])
          .replace(
            /__VALID__/g,
            phoneSession ? "1" : "0"
          );

        res.writeHead(
          phoneSession ? 200 : 410,
          {
            "content-type":
              "text/html; charset=utf-8",
          }
        );

        return res.end(html);
      }

      // =====================================================
      // STATIKUS FÁJLOK
      // =====================================================

      if (req.method === "GET") {
        return serveStatic(req, res, p);
      }

      res.writeHead(404);
      res.end();
    } catch (err) {
      console.error("Kiszolgálási hiba:", err);

      if (!res.headersSent) {
        sendJson(res, 500, {
          ok: false,
          error: "server_error",
        });
      }
    }
  }
);

// Telefonos fotóküldés: WebSocket-kapcsolat.
const wss = new WebSocketServer({
  noServer: true,
});

server.on(
  "upgrade",
  function (req, socket, head) {
    var m = req.url.match(
      /^\/api\/pair\/([\w-]+)\/socket$/
    );

    var session = m && pairSessions[m[1]];

    console.log(
      "[párosítás] WebSocket kérés: " + req.url +
        " (" + req.socket.remoteAddress + ") -> " +
        (session ? "OK" : "nincs ilyen munkamenet")
    );

    if (!session) {
      socket.write(
        "HTTP/1.1 404 Not Found\r\n\r\n"
      );
      socket.destroy();
      return;
    }

    wss.handleUpgrade(
      req,
      socket,
      head,
      function (ws) {
        session.sockets.push(ws);
        ws.isAlive = true;

        ws.on("pong", function () {
          ws.isAlive = true;
        });

        ws.on("close", function () {
          var idx =
            session.sockets.indexOf(ws);

          if (idx !== -1) {
            session.sockets.splice(idx, 1);
          }
        });

        var photoList = [];

        for (
          var i = 0;
          i < session.photos.length;
          i++
        ) {
          photoList.push(
            photoSummary(session.photos[i])
          );
        }

        ws.send(
          JSON.stringify({
            type: "hello",
            expiresAt: session.expiresAt,
            photos: photoList,
          })
        );
      }
    );
  }
);

// Megszakadt WebSocket-kapcsolatok ellenőrzése.
setInterval(function () {
  for (var token in pairSessions) {
    var session = pairSessions[token];

    for (
      var i = session.sockets.length - 1;
      i >= 0;
      i--
    ) {
      var ws = session.sockets[i];

      if (ws.isAlive === false) {
        ws.terminate();
        session.sockets.splice(i, 1);
        continue;
      }

      ws.isAlive = false;
      ws.ping();
    }
  }
}, 30000).unref();

// Eltávolított ruhák végleges törlése 30 nap után.
var ITEM_RETENTION_MS =
  30 * 24 * 60 * 60 * 1000;

setInterval(function () {
  store
    .sweepExpiredItems(ITEM_RETENTION_MS)
    .catch(function (e) {
      console.error(
        "takarítás sikertelen:",
        e.message
      );
    });
}, 60 * 60 * 1000).unref();

// Szerverhibák kezelése.
server.on("error", function (err) {
  if (err.code === "EADDRINUSE") {
    console.error(
      "A " +
        PORT +
        "-as port foglalt – valószínűleg már fut a Wardro a háttérben (http://localhost:" + PORT + "). Ez a példány kilép."
    );

    // 3-as kód: a felügyelő (felugyelo.js) ebből tudja, hogy nem kell újraindítani
    return process.exit(3);
  }

  console.error("Szerverhiba:", err);
  process.exit(1);
});

// A szervert pontosan egyszer indítjuk el,
// az adatbázis előkészítése után.
async function startServer() {
  console.log("Kiszolgálás indul...");

  // ha a XAMPP (MySQL) még nem fut, nem állunk le: 5 másodpercenként újrapróbáljuk,
  // így a szerver a háttérben előre elindulhat, és a MySQL indítása után magától csatlakozik
  var varakozasKiirva = false;
  for (;;) {
    try {
      await store.ensureSchema();
      if (varakozasKiirva) console.log("Az adatbázis elérhető, folytatom.");
      break;
    } catch (err) {
      var nemFut = err && /ECONNREFUSED|ETIMEDOUT|PROTOCOL_CONNECTION_LOST|ER_BAD_DB_ERROR/.test(String(err.code || err.message));
      if (!nemFut) {
        console.error("Adatbázis-előkészítés sikertelen:", err);
        return process.exit(1);
      }
      if (!varakozasKiirva) {
        console.log("Várom az adatbázist – indítsd el a XAMPP-ban a MySQL-t (5 másodpercenként újrapróbálom)…");
        varakozasKiirva = true;
      }
      await new Promise(function (ok) { setTimeout(ok, 5000); });
    }
  }

  // (ha a port foglalt, a lenti "Szerverhibák kezelése" rész 3-as kóddal kilép)
  server.listen(PORT, function () {
    console.log(
      "Kiszolgálás fut a http://localhost:" +
        PORT +
        " címen"
    );

    console.log(
      "Telefonról elérhető cím: http://" +
        lanAddress() +
        ":" +
        PORT
    );

    // nyilvános cím az internetről (Cloudflare Tunnel), ha a server/bin/cloudflared.exe megvan
    tunnel.start(PORT);
    // a katalógus termékfotói az eBay-ről, a háttérben (lásd ebay.js)
    setTimeout(function () {
      ebay.elotoltes(path.join(__dirname, "..", "katalogus.js"));
    }, 15000);
    // a hiányzó képeket 6 óránként újrapróbálja (pl. ha az eBay napi kerete elfogyott)
    setInterval(function () {
      ebay.elotoltes(path.join(__dirname, "..", "katalogus.js"));
    }, 6 * 60 * 60 * 1000).unref();
  });
}

startServer();