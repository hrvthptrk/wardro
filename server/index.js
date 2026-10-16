"use strict";
// Wardro backend.
// Ez szolgálja ki az oldalt, intézi a telefonos QR fotóküldést, lekéri az
// időjárást, és most már a fiókokat/szekrényt/outfiteket is (lásd store.js).
// Nincs adatbázis, szóval újraindításkor minden adat elvész - ez egyelőre
// így jó, majd ha meglesz az adatbázis azt bekötjük.
//
// Indítás: node server/index.js

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const QRCode = require("qrcode");
const { WebSocketServer } = require("ws");
const store = require("./store");
const auth = require("./auth");

const PORT = Number(process.env.PORT) || 8080;
const ROOT = path.join(__dirname, "..");
const DEFAULT_PAGE = "Wardro Web.dc.html";

const PAIR_SESSION_TTL_MS = 20 * 60 * 1000;
const PAIR_SWEEP_MS = 30 * 1000;
const MAX_PHOTOS_PER_SESSION = 40;
const MAX_PHOTO_BYTES = 20 * 1024 * 1024;
// a Beállításokban választható színtémák (Wardro Web.css :root[data-theme])
const THEMES = ["homok", "zsalya", "kontraszt"];

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
const UPLOAD_MIME = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/gif"];
function isUploadMimeOk(mime) {
  for (var i = 0; i < UPLOAD_MIME.length; i++) {
    if (UPLOAD_MIME[i] === mime) return true;
  }
  return false;
}

// párosítási munkamenetek a QR-kódos fotóküldéshez, tokenre indexelve
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
    try { ws.send(JSON.stringify({ type: "expired", reason: reason || "ended" })); } catch (e) {}
    try { ws.close(); } catch (e) {}
  }
  session.sockets = [];
  session.photos = [];
}

setInterval(function () {
  var now = Date.now();
  for (var token in pairSessions) {
    if (pairSessions[token].expiresAt <= now) endPairSession(pairSessions[token], "expired");
  }
}, PAIR_SWEEP_MS).unref();

function broadcast(session, msg) {
  var data = JSON.stringify(msg);
  for (var i = 0; i < session.sockets.length; i++) {
    var ws = session.sockets[i];
    if (ws.readyState === ws.OPEN) ws.send(data);
  }
}

function photoSummary(p) {
  return { id: p.id, name: p.name, mime: p.mime, size: p.size, uploadedAt: p.uploadedAt, url: "/api/pair/" + p.sessionToken + "/photo/" + p.id };
}

// kell a gép saját IP-je a helyi hálózaton, mert a telefon a "localhost"-tal
// saját magát érné el, nem a gépünket
function lanAddress() {
  var ifaces = os.networkInterfaces();
  for (var name in ifaces) {
    var list = ifaces[name] || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].family === "IPv4" && !list[i].internal) return list[i].address;
    }
  }
  return "localhost";
}

function serveStatic(req, res, reqPath) {
  if (reqPath === "/") reqPath = "/" + DEFAULT_PAGE;
  var filePath;
  try {
    filePath = path.join(ROOT, decodeURIComponent(reqPath));
  } catch (e) {
    res.writeHead(400);
    res.end("Hibás útvonal");
    return;
  }
  if (filePath.indexOf(ROOT) !== 0) {
    res.writeHead(403);
    res.end("Tiltva");
    return;
  }
  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Nem található: " + reqPath);
      return;
    }
    var ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "content-type": STATIC_MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

function sendJson(res, status, obj) {
  var body = JSON.stringify(obj);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "content-length": Buffer.byteLength(body) });
  res.end(body);
}

function readBody(req, maxBytes) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    var total = 0;
    req.on("data", function (chunk) {
      total += chunk.length;
      if (total > maxBytes) {
        reject(Object.assign(new Error("too large"), { code: "TOO_LARGE" }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", function () { resolve(Buffer.concat(chunks)); });
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

// naptári nap "ÉÉÉÉ-HH-NN" formában, és tényleg létező dátum
function isValidDay(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v || ""))) return false;
  var d = new Date(v + "T00:00:00Z");
  return !isNaN(d) && d.toISOString().slice(0, 10) === v;
}

// ha nincs bejelentkezve, elküldi a 401-et és null-t ad vissza - a hívó
// helyen akkor csak egy "if (!userId) return" kell
async function requireUser(req, res) {
  var userId = auth.currentUserId(req);
  var user = userId ? await store.findUserById(userId) : null;
  if (!user) {
    sendJson(res, 401, { ok: false, error: "unauthorized" });
    return null;
  }
  return userId;
}

const PHONE_PAGE = fs.readFileSync(path.join(__dirname, "phone.html"), "utf8");

// időjárás a "Mára ajánlott" részhez, az Open-Meteo-t hívjuk (nem kell hozzá
// API kulcs), Budapest az alapértelmezett hely ha a kliens nem küld koordinátát
var BUDAPEST_LAT = 47.4979;
var BUDAPEST_LON = 19.0402;
var WEATHER_CACHE_MS = 10 * 60 * 1000;
var weatherCache = {};

var WEATHER_CODE_HU = {
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
  if (WEATHER_CODE_HU[code]) return WEATHER_CODE_HU[code];
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
  if (cached && Date.now() - cached.at < WEATHER_CACHE_MS) return cached.data;

  var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,weather_code&hourly=temperature_2m&timezone=auto&forecast_days=1";
  var r = await fetch(url);
  if (!r.ok) throw new Error("open-meteo http " + r.status);
  var j = await r.json();

  var tempC = j.current.temperature_2m;
  var code = j.current.weather_code;

  // próbáljuk megtalálni az este 9 órás hőmérsékletet az óránkénti listából
  var eveningC = tempC;
  if (j.hourly && j.hourly.time) {
    var bestIdx = 0;
    var bestDiff = 999;
    for (var i = 0; i < j.hourly.time.length; i++) {
      var hour = Number(j.hourly.time[i].slice(11, 13));
      var diff = Math.abs(hour - 21);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }
    if (j.hourly.temperature_2m[bestIdx] !== undefined) eveningC = j.hourly.temperature_2m[bestIdx];
  }

  var data = {
    tempC: tempC,
    eveningC: eveningC,
    code: code,
    description: weatherCodeToText(code),
    season: seasonForTemp(tempC),
  };
  weatherCache[key] = { at: Date.now(), data: data };
  return data;
}

const server = http.createServer(async function (req, res) {
  var url = new URL(req.url, "http://x");
  var p = url.pathname;

  try {
    // fiókok
    if (p === "/api/auth/signup" && req.method === "POST") {
      var body;
      try { body = await readJsonBody(req); } catch (e) { return sendJson(res, 400, { ok: false, error: "bad_json" }); }
      var name = String(body.name || "").trim();
      var email = String(body.email || "").trim();
      var password = String(body.password || "");
      if (!name) return sendJson(res, 400, { ok: false, error: "missing_name" });
      if (!isValidEmail(email)) return sendJson(res, 400, { ok: false, error: "invalid_email" });
      if (password.length < 8) return sendJson(res, 400, { ok: false, error: "weak_password" });
      if (await store.findUserByEmail(email)) return sendJson(res, 409, { ok: false, error: "email_taken" });

      var newUser = await store.createUser({ name: name, email: email, passwordHash: auth.hashPassword(password), profile: body.profile });
      auth.setSessionCookie(res, auth.createSession(newUser.id));
      return sendJson(res, 200, { ok: true, user: store.publicUser(newUser) });
    }

    if (p === "/api/auth/login" && req.method === "POST") {
      var loginBody;
      try { loginBody = await readJsonBody(req); } catch (e) { return sendJson(res, 400, { ok: false, error: "bad_json" }); }
      var loginUser = await store.findUserByEmail(loginBody.email || "");
      if (!loginUser || !auth.verifyPassword(String(loginBody.password || ""), loginUser.passwordHash)) {
        return sendJson(res, 401, { ok: false, error: "invalid_credentials" });
      }
      auth.setSessionCookie(res, auth.createSession(loginUser.id));
      return sendJson(res, 200, { ok: true, user: store.publicUser(loginUser) });
    }

    if (p === "/api/auth/logout" && req.method === "POST") {
      var logoutToken = auth.parseCookies(req)[auth.SESSION_COOKIE];
      if (logoutToken) auth.destroySession(logoutToken);
      auth.clearSessionCookie(res);
      return sendJson(res, 200, { ok: true });
    }

    if (p === "/api/auth/me" && req.method === "GET") {
      var meUserId = await requireUser(req, res); if (!meUserId) return;
      return sendJson(res, 200, { ok: true, user: store.publicUser(await store.findUserById(meUserId)) });
    }

    // kategóriák
    if (p === "/api/categories" && req.method === "GET") {
      var catUserId = await requireUser(req, res); if (!catUserId) return;
      return sendJson(res, 200, { ok: true, categories: await store.listCategories(catUserId) });
    }

    if (p === "/api/categories" && req.method === "POST") {
      var newCatUserId = await requireUser(req, res); if (!newCatUserId) return;
      var catBody;
      try { catBody = await readJsonBody(req); } catch (e) { return sendJson(res, 400, { ok: false, error: "bad_json" }); }
      var catName = String(catBody.name || "").trim();
      if (!catName) return sendJson(res, 400, { ok: false, error: "missing_name" });
      return sendJson(res, 200, { ok: true, category: await store.createCategory(newCatUserId, catName) });
    }

    var cm = p.match(/^\/api\/categories\/([\w-]+)$/);
    if (cm && req.method === "PATCH") {
      var renameUserId = await requireUser(req, res); if (!renameUserId) return;
      var renameBody;
      try { renameBody = await readJsonBody(req); } catch (e) { return sendJson(res, 400, { ok: false, error: "bad_json" }); }
      var renamed = await store.renameCategory(renameUserId, cm[1], String(renameBody.name || "").trim());
      if (!renamed) return sendJson(res, 404, { ok: false, error: "not_found" });
      return sendJson(res, 200, { ok: true, category: renamed });
    }
    if (cm && req.method === "DELETE") {
      var delCatUserId = await requireUser(req, res); if (!delCatUserId) return;
      var catDeleted = await store.deleteCategory(delCatUserId, cm[1]);
      return sendJson(res, catDeleted ? 200 : 404, { ok: catDeleted });
    }

    // ruhadarabok
    if (p === "/api/items" && req.method === "GET") {
      var listItemsUserId = await requireUser(req, res); if (!listItemsUserId) return;
      return sendJson(res, 200, { ok: true, items: await store.listItems(listItemsUserId) });
    }

    if (p === "/api/items" && req.method === "POST") {
      var newItemUserId = await requireUser(req, res); if (!newItemUserId) return;
      var itemBody;
      try { itemBody = await readJsonBody(req); } catch (e) { return sendJson(res, 400, { ok: false, error: "bad_json" }); }
      var itemLabel = String(itemBody.label || "").trim();
      if (!itemLabel) return sendJson(res, 400, { ok: false, error: "missing_label" });
      itemBody.label = itemLabel;
      return sendJson(res, 200, { ok: true, item: await store.createItem(newItemUserId, itemBody) });
    }

    var im = p.match(/^\/api\/items\/([\w-]+)$/);
    if (im && req.method === "PATCH") {
      var patchItemUserId = await requireUser(req, res); if (!patchItemUserId) return;
      var patchBody;
      try { patchBody = await readJsonBody(req); } catch (e) { return sendJson(res, 400, { ok: false, error: "bad_json" }); }
      var itemPatch = {};
      var patchableFields = ["label", "categoryId", "photoUrl", "tags", "wornToday"];
      for (var pf = 0; pf < patchableFields.length; pf++) {
        var pfKey = patchableFields[pf];
        if (pfKey in patchBody) itemPatch[pfKey] = patchBody[pfKey];
      }
      if (itemPatch.wornToday) itemPatch.lastWornAt = Date.now();
      var patchedItem = await store.updateItem(patchItemUserId, im[1], itemPatch);
      if (!patchedItem) return sendJson(res, 404, { ok: false, error: "not_found" });
      return sendJson(res, 200, { ok: true, item: patchedItem });
    }
    if (im && req.method === "DELETE") {
      var purgeUserId = await requireUser(req, res); if (!purgeUserId) return;
      var purged = await store.purgeItem(purgeUserId, im[1]);
      return sendJson(res, purged ? 200 : 404, { ok: purged });
    }

    im = p.match(/^\/api\/items\/([\w-]+)\/remove$/);
    if (im && req.method === "POST") {
      var removeUserId = await requireUser(req, res); if (!removeUserId) return;
      var removedItem = await store.removeItem(removeUserId, im[1]);
      if (!removedItem) return sendJson(res, 404, { ok: false, error: "not_found" });
      return sendJson(res, 200, { ok: true, item: removedItem });
    }
    im = p.match(/^\/api\/items\/([\w-]+)\/restore$/);
    if (im && req.method === "POST") {
      var restoreUserId = await requireUser(req, res); if (!restoreUserId) return;
      var restoredItem = await store.restoreItem(restoreUserId, im[1]);
      if (!restoredItem) return sendJson(res, 404, { ok: false, error: "not_found" });
      return sendJson(res, 200, { ok: true, item: restoredItem });
    }

    // fotó feltöltése egy ruhadarabhoz - ugyanúgy nyers bájtokat küldünk, mint
    // a telefonos feltöltésnél lentebb
    if (p === "/api/photos" && req.method === "POST") {
      var photoUserId = await requireUser(req, res); if (!photoUserId) return;
      var photoMime = (req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
      if (!isUploadMimeOk(photoMime)) return sendJson(res, 415, { ok: false, error: "unsupported_type" });
      var photoBuf;
      try { photoBuf = await readBody(req, MAX_PHOTO_BYTES); } catch (e) { return sendJson(res, e.code === "TOO_LARGE" ? 413 : 400, { ok: false, error: "upload_failed" }); }
      if (!photoBuf.length) return sendJson(res, 400, { ok: false, error: "empty" });
      var newPhotoId = store.savePhoto(photoMime, photoBuf);
      return sendJson(res, 200, { ok: true, id: newPhotoId, url: "/api/photos/" + newPhotoId });
    }
    var pm = p.match(/^\/api\/photos\/([\w.-]+)$/);
    if (pm && req.method === "GET") {
      var storedPhoto = store.getPhoto(pm[1]);
      if (!storedPhoto) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "content-type": storedPhoto.mime, "cache-control": "public, max-age=31536000, immutable" });
      return res.end(storedPhoto.buf);
    }

    // outfitek
    if (p === "/api/outfits" && req.method === "GET") {
      var listOutfitsUserId = await requireUser(req, res); if (!listOutfitsUserId) return;
      return sendJson(res, 200, { ok: true, outfits: await store.listOutfits(listOutfitsUserId) });
    }

    if (p === "/api/outfits" && req.method === "POST") {
      var newOutfitUserId = await requireUser(req, res); if (!newOutfitUserId) return;
      var outfitBody;
      try { outfitBody = await readJsonBody(req); } catch (e) { return sendJson(res, 400, { ok: false, error: "bad_json" }); }
      var outfitName = String(outfitBody.name || "").trim();
      if (!outfitName) return sendJson(res, 400, { ok: false, error: "missing_name" });
      outfitBody.name = outfitName;
      var createdOutfit = await store.createOutfit(newOutfitUserId, outfitBody);
      // az új outfit alapból bekerül a naptárba arra a napra, amit a kliens küld
      if (isValidDay(outfitBody.logDay)) await store.setOutfitLog(newOutfitUserId, outfitBody.logDay, createdOutfit.id);
      return sendJson(res, 200, { ok: true, outfit: createdOutfit });
    }

    // naptár
    if (p === "/api/calendar" && req.method === "GET") {
      var calUserId = await requireUser(req, res); if (!calUserId) return;
      return sendJson(res, 200, { ok: true, entries: await store.listOutfitLog(calUserId) });
    }

    var cm = p.match(/^\/api\/calendar\/([\d-]+)$/);
    if (cm && req.method === "PUT") {
      var putCalUserId = await requireUser(req, res); if (!putCalUserId) return;
      if (!isValidDay(cm[1])) return sendJson(res, 400, { ok: false, error: "bad_day" });
      var calBody;
      try { calBody = await readJsonBody(req); } catch (e) { return sendJson(res, 400, { ok: false, error: "bad_json" }); }
      var logged = await store.setOutfitLog(putCalUserId, cm[1], calBody.outfitId);
      return sendJson(res, logged ? 200 : 404, { ok: logged });
    }
    if (cm && req.method === "DELETE") {
      var delCalUserId = await requireUser(req, res); if (!delCalUserId) return;
      if (!isValidDay(cm[1])) return sendJson(res, 400, { ok: false, error: "bad_day" });
      await store.clearOutfitLog(delCalUserId, cm[1]);
      return sendJson(res, 200, { ok: true });
    }

    var om = p.match(/^\/api\/outfits\/([\w-]+)$/);
    if (om && req.method === "PATCH") {
      var patchOutfitUserId = await requireUser(req, res); if (!patchOutfitUserId) return;
      var outfitPatchBody;
      try { outfitPatchBody = await readJsonBody(req); } catch (e) { return sendJson(res, 400, { ok: false, error: "bad_json" }); }
      var outfitPatch = {};
      var outfitFields = ["name", "occasion", "season", "itemIds", "favourite", "wornToday"];
      for (var of = 0; of < outfitFields.length; of++) {
        var ofKey = outfitFields[of];
        if (ofKey in outfitPatchBody) outfitPatch[ofKey] = outfitPatchBody[ofKey];
      }
      var patchedOutfit = await store.updateOutfit(patchOutfitUserId, om[1], outfitPatch);
      if (!patchedOutfit) return sendJson(res, 404, { ok: false, error: "not_found" });
      return sendJson(res, 200, { ok: true, outfit: patchedOutfit });
    }
    if (om && req.method === "DELETE") {
      var delOutfitUserId = await requireUser(req, res); if (!delOutfitUserId) return;
      var outfitDeleted = await store.deleteOutfit(delOutfitUserId, om[1]);
      return sendJson(res, outfitDeleted ? 200 : 404, { ok: outfitDeleted });
    }

    // beállítások
    if (p === "/api/settings" && req.method === "GET") {
      var settingsUserId = await requireUser(req, res); if (!settingsUserId) return;
      return sendJson(res, 200, { ok: true, user: store.publicUser(await store.findUserById(settingsUserId)) });
    }
    if (p === "/api/settings" && req.method === "PATCH") {
      var patchSettingsUserId = await requireUser(req, res); if (!patchSettingsUserId) return;
      var settingsBody;
      try { settingsBody = await readJsonBody(req); } catch (e) { return sendJson(res, 400, { ok: false, error: "bad_json" }); }
      var settingsPatch = {};
      var settingsFields = ["name", "email", "profile", "density", "showUnwornFlags", "reminders", "theme"];
      for (var sf = 0; sf < settingsFields.length; sf++) {
        var sfKey = settingsFields[sf];
        if (sfKey in settingsBody) settingsPatch[sfKey] = settingsBody[sfKey];
      }
      if ("theme" in settingsPatch && THEMES.indexOf(settingsPatch.theme) === -1) return sendJson(res, 400, { ok: false, error: "bad_theme" });
      return sendJson(res, 200, { ok: true, user: store.publicUser(await store.updateUser(patchSettingsUserId, settingsPatch)) });
    }

    // időjárás a "Mára ajánlott" panelhez
    if (p === "/api/weather" && req.method === "GET") {
      var hasParams = url.searchParams.has("lat") && url.searchParams.has("lon");
      var lat = Number(url.searchParams.get("lat"));
      var lon = Number(url.searchParams.get("lon"));
      var hasCoords = hasParams && Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
      try {
        var weatherData = await fetchWeather(hasCoords ? lat : BUDAPEST_LAT, hasCoords ? lon : BUDAPEST_LON);
        return sendJson(res, 200, Object.assign({ ok: true, usedDefaultLocation: !hasCoords }, weatherData));
      } catch (e) {
        console.log("időjárás lekérés nem sikerült: " + e.message);
        return sendJson(res, 502, { ok: false, error: "weather_unavailable" });
      }
    }

    // telefonos QR párosítás indítása ("Connect phone")
    if (p === "/api/pair/start" && req.method === "POST") {
      var pairSession = createPairSession();
      var phoneUrl = "http://" + lanAddress() + ":" + PORT + "/phone/" + pairSession.token;
      return sendJson(res, 200, { token: pairSession.token, phoneUrl: phoneUrl, expiresAt: pairSession.expiresAt });
    }

    var m = p.match(/^\/api\/pair\/([\w-]+)\/qr\.svg$/);
    if (m && req.method === "GET") {
      var qrSession = pairSessions[m[1]];
      if (!qrSession) { res.writeHead(404); return res.end(); }
      var qrPhoneUrl = "http://" + lanAddress() + ":" + PORT + "/phone/" + qrSession.token;
      var svg = await QRCode.toString(qrPhoneUrl, { type: "svg", margin: 1, color: { dark: "#57462F", light: "#0000" } });
      res.writeHead(200, { "content-type": "image/svg+xml", "cache-control": "no-store" });
      return res.end(svg);
    }

    m = p.match(/^\/api\/pair\/([\w-]+)\/status$/);
    if (m && req.method === "GET") {
      var statusSession = pairSessions[m[1]];
      if (!statusSession) return sendJson(res, 404, { ok: false });
      return sendJson(res, 200, { ok: true, expiresAt: statusSession.expiresAt, photoCount: statusSession.photos.length });
    }

    m = p.match(/^\/api\/pair\/([\w-]+)\/upload$/);
    if (m && req.method === "POST") {
      var uploadSession = pairSessions[m[1]];
      if (!uploadSession) return sendJson(res, 410, { ok: false, error: "expired" });
      if (uploadSession.photos.length >= MAX_PHOTOS_PER_SESSION) return sendJson(res, 429, { ok: false, error: "too_many" });

      var uploadMime = (req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
      if (!isUploadMimeOk(uploadMime)) return sendJson(res, 415, { ok: false, error: "unsupported_type" });

      var uploadBuf;
      try {
        uploadBuf = await readBody(req, MAX_PHOTO_BYTES);
      } catch (e) {
        return sendJson(res, e.code === "TOO_LARGE" ? 413 : 400, { ok: false, error: "upload_failed" });
      }
      if (!uploadBuf.length) return sendJson(res, 400, { ok: false, error: "empty" });

      var photoName = (url.searchParams.get("name") || ("photo-" + uploadSession.nextPhotoId + ".jpg")).slice(0, 120);
      var newPhoto = { id: uploadSession.nextPhotoId, name: photoName, mime: uploadMime, size: uploadBuf.length, buf: uploadBuf, uploadedAt: Date.now(), sessionToken: uploadSession.token };
      uploadSession.nextPhotoId = uploadSession.nextPhotoId + 1;
      uploadSession.photos.push(newPhoto);
      touchPairSession(uploadSession);
      broadcast(uploadSession, Object.assign({ type: "photo" }, photoSummary(newPhoto)));
      return sendJson(res, 200, { ok: true, id: newPhoto.id });
    }

    m = p.match(/^\/api\/pair\/([\w-]+)\/photo\/(\d+)$/);
    if (m && req.method === "GET") {
      var photoSession = pairSessions[m[1]];
      var foundPhoto = null;
      if (photoSession) {
        for (var i = 0; i < photoSession.photos.length; i++) {
          if (photoSession.photos[i].id === Number(m[2])) { foundPhoto = photoSession.photos[i]; break; }
        }
      }
      if (!foundPhoto) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "content-type": foundPhoto.mime, "cache-control": "public, max-age=3600, immutable" });
      return res.end(foundPhoto.buf);
    }

    m = p.match(/^\/api\/pair\/([\w-]+)\/end$/);
    if (m && req.method === "POST") {
      var endSession = pairSessions[m[1]];
      if (endSession) endPairSession(endSession, "disconnected");
      return sendJson(res, 200, { ok: true });
    }

    m = p.match(/^\/phone\/([\w-]+)$/);
    if (m && req.method === "GET") {
      var phoneSession = pairSessions[m[1]];
      var html = PHONE_PAGE.replace(/__TOKEN__/g, m[1]).replace(/__VALID__/g, phoneSession ? "1" : "0");
      res.writeHead(phoneSession ? 200 : 410, { "content-type": "text/html; charset=utf-8" });
      return res.end(html);
    }

    // minden más: statikus fájlok
    if (req.method === "GET") return serveStatic(req, res, p);

    res.writeHead(404);
    res.end();
  } catch (err) {
    console.error("Kiszolgálási hiba:", err);
    if (!res.headersSent) sendJson(res, 500, { ok: false, error: "server_error" });
  }
});

// a telefonos fotóküldés élő csatornája
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", function (req, socket, head) {
  var m = req.url.match(/^\/api\/pair\/([\w-]+)\/socket$/);
  var session = m && pairSessions[m[1]];
  if (!session) { socket.write("HTTP/1.1 404 Not Found\r\n\r\n"); socket.destroy(); return; }
  wss.handleUpgrade(req, socket, head, function (ws) {
    session.sockets.push(ws);
    ws.isAlive = true;
    ws.on("pong", function () { ws.isAlive = true; });
    ws.on("close", function () {
      var idx = session.sockets.indexOf(ws);
      if (idx !== -1) session.sockets.splice(idx, 1);
    });
    var photoList = [];
    for (var i = 0; i < session.photos.length; i++) photoList.push(photoSummary(session.photos[i]));
    ws.send(JSON.stringify({ type: "hello", expiresAt: session.expiresAt, photos: photoList }));
  });
});

// ha a laptop pl. elaludt, a socket ottmarad "élve" kinézve - ezzel szűrjük ki
setInterval(function () {
  for (var token in pairSessions) {
    var session = pairSessions[token];
    for (var i = session.sockets.length - 1; i >= 0; i--) {
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

// a törölt ruhák 30 nap után véglegesen eltűnnek, óránként elég megnézni
var ITEM_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
setInterval(function () {
  store.sweepExpiredItems(ITEM_RETENTION_MS).catch(function (e) {
    console.error("takarítás sikertelen:", e.message);
  });
}, 60 * 60 * 1000).unref();

server.on("error", function (err) {
  if (err.code === "EADDRINUSE") {
    console.log("A " + PORT + "-as port már foglalt, feltehetően fut már a szerver.");
    console.log("Kiszolgálás fut a http://localhost:" + PORT + " címen");
    process.exit(0);
  }
  console.error("Szerverhiba:", err);
  process.exit(1);
});

console.log("Kiszolgálás indul...");
store.ensureSchema().catch(function (e) {
  console.error("Adatbázis-előkészítés sikertelen:", e.message);
});
server.listen(PORT, function () {
  console.log("Kiszolgálás fut a http://localhost:" + PORT + " címen");
  console.log("Telefonról elérhető cím: http://" + lanAddress() + ":" + PORT);
});
