"use strict";
// Ez tárolja az adatokat - most már tényleg egy MySQL/MariaDB adatbázisban
// (ruhatar.sql), nem csak a memóriában. A kapcsolati adatok környezeti
// változókból jönnek, alapértelmezésben a szokásos XAMPP beállításra:
// root felhasználó, jelszó nélkül, localhost, "ruhatar" adatbázis.

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ruhatar",
  waitForConnections: true,
  connectionLimit: 10,
});

// a ruha-fotókat egyszerűen fájlként tesszük el ide, a kép URL-je csak erre
// a mappára mutat vissza - a clothes.image_url oszlop ezt várja
var UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

var STARTER_CATEGORIES = {
  Male: ["Pólók", "Nadrágok", "Cipők", "Kabátok", "Kiegészítők"],
  Female: ["Felsők", "Topok", "Pulóverek és kardigánok", "Nadrágok", "Szoknyák", "Ruhák", "Cipők", "Táskák", "Sálak és kendők", "Ékszerek", "Kiegészítők"],
};

function toMillis(val) {
  if (!val) return null;
  return new Date(val).getTime();
}

// --- felhasználók ---

function rowToUser(row) {
  if (!row) return null;
  var settings = {};
  if (row.settings) {
    try { settings = JSON.parse(row.settings); } catch (e) { settings = {}; }
  }
  return {
    id: row.id,
    name: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    profile: row.profile,
    density: settings.density || "Comfortable",
    showUnwornFlags: settings.showUnwornFlags === undefined ? true : settings.showUnwornFlags,
    reminders: settings.reminders || { weekly: true, daily: false, idle: true },
    theme: settings.theme || "ejjel",
    // e-mail megerősítés (a régi fiókok oszlop nélkül is megerősítettnek számítanak)
    emailVerified: row.email_verified === undefined || row.email_verified === null ? true : !!row.email_verified,
    verifyToken: row.verify_token || null,
    verifyExpires: toMillis(row.verify_expires),
    verifySentAt: toMillis(row.verify_sent_at),
    createdAt: toMillis(row.created_at),
  };
}

async function createUser(info) {
  var email = info.email.toLowerCase();
  var [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length) return null; // már van ilyen email

  var profile = info.profile === "Female" ? "Female" : "Male";
  // az új fiók megerősítetlenül indul: a megerősítő e-mailben lévő linkkel lesz aktív
  var [result] = await pool.query(
    "INSERT INTO users (username, email, password_hash, profile, email_verified, verify_token, verify_expires, verify_sent_at) VALUES (?, ?, ?, ?, 0, ?, ?, ?)",
    [info.name, email, info.passwordHash, profile, info.verifyToken || null,
      info.verifyToken ? new Date(Date.now() + VERIFY_TTL_MS) : null, info.verifyToken ? new Date() : null]
  );
  var userId = result.insertId;

  var starter = STARTER_CATEGORIES[profile];
  for (var i = 0; i < starter.length; i++) {
    await createCategory(userId, starter[i]);
  }

  return findUserById(userId);
}

// --- e-mail megerősítés ---
var VERIFY_TTL_MS = 24 * 60 * 60 * 1000;

async function findUserByVerifyToken(token) {
  if (!token || !/^[a-f0-9]{64}$/.test(String(token))) return null;
  var [rows] = await pool.query("SELECT * FROM users WHERE verify_token = ?", [String(token)]);
  return rowToUser(rows[0]);
}

async function markEmailVerified(id) {
  await pool.query("UPDATE users SET email_verified = 1, verify_token = NULL, verify_expires = NULL WHERE id = ?", [Number(id)]);
  return findUserById(id);
}

async function setVerifyToken(id, token) {
  await pool.query("UPDATE users SET verify_token = ?, verify_expires = ?, verify_sent_at = ? WHERE id = ?",
    [token, new Date(Date.now() + VERIFY_TTL_MS), new Date(), Number(id)]);
  return findUserById(id);
}

async function findUserByEmail(email) {
  var [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [String(email).toLowerCase()]);
  return rowToUser(rows[0]);
}

async function findUserById(id) {
  var numId = Number(id);
  if (!Number.isFinite(numId)) return null;
  var [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [numId]);
  return rowToUser(rows[0]);
}

async function updateUser(id, patch) {
  var user = await findUserById(id);
  if (!user) return null;
  var merged = Object.assign({}, user, patch);
  var settings = {
    density: merged.density,
    showUnwornFlags: merged.showUnwornFlags,
    reminders: merged.reminders,
    theme: merged.theme,
  };
  await pool.query(
    "UPDATE users SET username = ?, email = ?, profile = ?, settings = ? WHERE id = ?",
    [merged.name, String(merged.email).toLowerCase(), merged.profile, JSON.stringify(settings), Number(id)]
  );
  return findUserById(id);
}

function publicUser(user) {
  if (!user) return null;
  var copy = {};
  for (var key in user) {
    if (key !== "passwordHash" && key !== "verifyToken" && key !== "verifyExpires") copy[key] = user[key];
  }
  return copy;
}

// --- kategóriák ---

function rowToCategory(row) {
  return { id: row.id, userId: row.user_id, name: row.name, createdAt: toMillis(row.created_at) };
}

async function listCategories(userId) {
  var [rows] = await pool.query("SELECT * FROM categories WHERE user_id = ? ORDER BY id", [Number(userId)]);
  return rows.map(rowToCategory);
}

async function createCategory(userId, name) {
  var [result] = await pool.query("INSERT INTO categories (user_id, name) VALUES (?, ?)", [Number(userId), name]);
  var [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [result.insertId]);
  return rowToCategory(rows[0]);
}

async function renameCategory(userId, id, name) {
  var numId = Number(id);
  if (!Number.isFinite(numId)) return null;
  var [result] = await pool.query("UPDATE categories SET name = ? WHERE id = ? AND user_id = ?", [name, numId, Number(userId)]);
  if (result.affectedRows === 0) return null;
  var [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [numId]);
  return rowToCategory(rows[0]);
}

async function deleteCategory(userId, id) {
  var numId = Number(id);
  if (!Number.isFinite(numId)) return false;
  // a benne lévő ruhák nem tűnnek el, csak kategória nélkül maradnak - ezt
  // már maga a tábla ON DELETE SET NULL megkötése intézi
  var [result] = await pool.query("DELETE FROM categories WHERE id = ? AND user_id = ?", [numId, Number(userId)]);
  return result.affectedRows > 0;
}

// --- ruhadarabok ---

// a "ma viselve" jelzés csak aznap érvényes (a worn_today oszlop magától nem nullázódik)
function maVolt(ido) {
  if (!ido) return false;
  var d = new Date(ido), n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

function rowToItem(row) {
  return {
    id: row.id,
    userId: row.user_id,
    label: row.name,
    categoryId: row.category_id,
    photoUrl: row.image_url,
    tags: row.tags ? row.tags.split(",").filter(function (t) { return t; }) : [],
    wornToday: !!row.worn_today && maVolt(row.last_worn_at),
    lastWornAt: toMillis(row.last_worn_at),
    // ár (Ft) és a viselések száma - a "viselésenkénti ár"-hoz
    price: row.price === null || row.price === undefined ? null : Number(row.price),
    wearCount: Number(row.wear_count || 0),
    // ha a háttér el lett távolítva, itt az eredeti fotó (vissza lehet állítani)
    origPhotoUrl: row.orig_image_url || null,
    // felismert / megadott szín (név + színkód), márka, mosás és állapot
    color: row.color || null,
    colorHex: row.color_hex || null,
    brand: row.brand || null,
    inLaundry: !!row.in_laundry,
    needsRepair: !!row.needs_repair,
    removedAt: toMillis(row.removed_at),
    createdAt: toMillis(row.created_at),
  };
}

async function listItems(userId) {
  var [rows] = await pool.query("SELECT * FROM clothes WHERE user_id = ? ORDER BY id", [Number(userId)]);
  return rows.map(rowToItem);
}

async function findItem(userId, id) {
  var numId = Number(id);
  if (!Number.isFinite(numId)) return null;
  var [rows] = await pool.query("SELECT * FROM clothes WHERE id = ? AND user_id = ?", [numId, Number(userId)]);
  return rows[0] ? rowToItem(rows[0]) : null;
}

// ár: egész forint, vagy null ha nincs megadva
function arSzam(x) {
  if (x === null || x === undefined || x === "") return null;
  var n = Math.round(Number(x));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

// rövid szöveg (a DB-oszlop hosszáig), üresből null
function rovid(x, max) {
  if (x === null || x === undefined) return null;
  var t = String(x).trim().slice(0, max);
  return t || null;
}
// csak érvényes #rrggbb színkódot tárolunk
function szinKod(x) {
  return /^#[0-9a-f]{6}$/i.test(String(x || "")) ? String(x).toLowerCase() : null;
}

async function createItem(userId, data) {
  var tags = Array.isArray(data.tags) && data.tags.length ? data.tags.join(",") : null;
  var [result] = await pool.query(
    "INSERT INTO clothes (user_id, name, category_id, image_url, tags, price, orig_image_url, color, color_hex, brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [Number(userId), data.label, data.categoryId || null, data.photoUrl || null, tags, arSzam(data.price), data.origPhotoUrl || null,
      rovid(data.color, 50), szinKod(data.colorHex), rovid(data.brand, 50)]
  );
  return findItem(userId, result.insertId);
}

// Mosható-e egy darab viselés után: a cipő, a kabát és a kiegészítők (táska, öv,
// óra, ékszer, sál, sapka…) nem kerülnek automatikusan a szennyesbe. Ugyanazzal a
// logikával döntünk, mint a próbababa: elsősorban a kategória, másodsorban a név alapján.
var HELY_MINTA = [
  ["cipo", /cip|sneaker|láb|csizm|bakancs|papucs|shoe|boot|balerin|szandál|loafer|espadrille|mokaszin/i],
  ["kabat", /kab[áa]t|dzsek|jacket|coat|parka|mellény/i],
  ["also", /nadr|farmer|jean|pant|alsó|short|szokny|skirt|leggings/i],
  ["felso", /pól|felső|ing\b|ingek|top|shirt|pul[cóo]|hoodie|sweat|blúz|ruh[aá]|body|kardig|overál|jumpsuit|garbó/i],
  ["kieg", /kieg|tásk|accessor|sapk|öv|óra|szemüveg|bag|ékszer|sál|kendő|fülbeval|nyaklánc|karkötő|karperec|gyűrű|hajcsat|bross|bizsu/i],
];

function helyNev(szoveg) {
  var x = HELY_MINTA.find(function (m) { return m[1].test(szoveg || ""); });
  return x ? x[0] : "";
}

async function moshato(item) {
  var katNev = "";
  if (item.categoryId) {
    var [rows] = await pool.query("SELECT name FROM categories WHERE id = ?", [Number(item.categoryId)]);
    katNev = rows[0] ? rows[0].name : "";
  }
  var hely = helyNev(katNev) || helyNev(item.label) || "kieg";
  return hely === "felso" || hely === "also";
}

async function updateItem(userId, id, patch) {
  var existing = await findItem(userId, id);
  if (!existing) return null;

  var fields = [];
  var values = [];
  if ("label" in patch) { fields.push("name = ?"); values.push(patch.label); }
  if ("categoryId" in patch) { fields.push("category_id = ?"); values.push(patch.categoryId || null); }
  if ("photoUrl" in patch) { fields.push("image_url = ?"); values.push(patch.photoUrl || null); }
  if ("tags" in patch) {
    var tagsVal = Array.isArray(patch.tags) && patch.tags.length ? patch.tags.join(",") : null;
    fields.push("tags = ?"); values.push(tagsVal);
  }
  if ("wornToday" in patch) {
    fields.push("worn_today = ?"); values.push(patch.wornToday ? 1 : 0);
    // naponta egyszer számít egy viselés
    if (patch.wornToday && !existing.wornToday) fields.push("wear_count = wear_count + 1");
    // viselés után a mosható darab automatikusan a szennyesbe kerül (ha nem kérnek mást) –
    // akkor is, ha ma már egyszer viselted, aztán kimostad, és újra felveszed
    if (patch.wornToday && !existing.inLaundry && !("inLaundry" in patch) && await moshato(existing)) {
      fields.push("in_laundry = 1");
    }
  }
  if ("lastWornAt" in patch) { fields.push("last_worn_at = ?"); values.push(patch.lastWornAt ? new Date(patch.lastWornAt) : null); }
  if ("price" in patch) { fields.push("price = ?"); values.push(arSzam(patch.price)); }
  if ("origPhotoUrl" in patch) { fields.push("orig_image_url = ?"); values.push(patch.origPhotoUrl || null); }
  if ("color" in patch) { fields.push("color = ?"); values.push(rovid(patch.color, 50)); }
  if ("colorHex" in patch) { fields.push("color_hex = ?"); values.push(szinKod(patch.colorHex)); }
  if ("brand" in patch) { fields.push("brand = ?"); values.push(rovid(patch.brand, 50)); }
  if ("inLaundry" in patch) { fields.push("in_laundry = ?"); values.push(patch.inLaundry ? 1 : 0); }
  if ("needsRepair" in patch) { fields.push("needs_repair = ?"); values.push(patch.needsRepair ? 1 : 0); }
  if ("removedAt" in patch) { fields.push("removed_at = ?"); values.push(patch.removedAt ? new Date(patch.removedAt) : null); }

  if (fields.length) {
    values.push(Number(id), Number(userId));
    await pool.query("UPDATE clothes SET " + fields.join(", ") + " WHERE id = ? AND user_id = ?", values);
  }
  return findItem(userId, id);
}

function removeItem(userId, id) {
  return updateItem(userId, id, { removedAt: Date.now() });
}

function restoreItem(userId, id) {
  return updateItem(userId, id, { removedAt: null });
}

async function purgeItem(userId, id) {
  var numId = Number(id);
  if (!Number.isFinite(numId)) return false;
  var [result] = await pool.query("DELETE FROM clothes WHERE id = ? AND user_id = ?", [numId, Number(userId)]);
  return result.affectedRows > 0;
}

// a 30 napnál régebben eltávolított ruhák végleg törlődnek, ezt hívjuk
// időnként az index.js-ből
async function sweepExpiredItems(maxAgeMs) {
  var cutoff = new Date(Date.now() - maxAgeMs);
  await pool.query("DELETE FROM clothes WHERE removed_at IS NOT NULL AND removed_at < ?", [cutoff]);
}

// --- outfitek ---

function rowToOutfit(row, itemIds) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    occasion: row.occasion || "",
    season: row.season || "",
    itemIds: itemIds || [],
    favourite: !!row.favourite,
    wornToday: !!row.worn_today,
    createdAt: toMillis(row.created_at),
  };
}

async function itemIdsForOutfit(outfitId) {
  var [rows] = await pool.query("SELECT clothing_id FROM outfit_clothes WHERE outfit_id = ?", [outfitId]);
  return rows.map(function (r) { return r.clothing_id; });
}

async function listOutfits(userId) {
  var [rows] = await pool.query("SELECT * FROM outfits WHERE user_id = ? ORDER BY id", [Number(userId)]);
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    var itemIds = await itemIdsForOutfit(rows[i].id);
    out.push(rowToOutfit(rows[i], itemIds));
  }
  return out;
}

async function findOutfit(userId, id) {
  var numId = Number(id);
  if (!Number.isFinite(numId)) return null;
  var [rows] = await pool.query("SELECT * FROM outfits WHERE id = ? AND user_id = ?", [numId, Number(userId)]);
  if (!rows[0]) return null;
  var itemIds = await itemIdsForOutfit(rows[0].id);
  return rowToOutfit(rows[0], itemIds);
}

async function createOutfit(userId, data) {
  var [result] = await pool.query(
    "INSERT INTO outfits (user_id, name, occasion, season) VALUES (?, ?, ?, ?)",
    [Number(userId), data.name, data.occasion || null, data.season || null]
  );
  var outfitId = result.insertId;
  var itemIds = Array.isArray(data.itemIds) ? data.itemIds : [];
  for (var i = 0; i < itemIds.length; i++) {
    await pool.query("INSERT IGNORE INTO outfit_clothes (outfit_id, clothing_id) VALUES (?, ?)", [outfitId, Number(itemIds[i])]);
  }
  return findOutfit(userId, outfitId);
}

async function updateOutfit(userId, id, patch) {
  var existing = await findOutfit(userId, id);
  if (!existing) return null;

  var fields = [];
  var values = [];
  if ("name" in patch) { fields.push("name = ?"); values.push(patch.name); }
  if ("occasion" in patch) { fields.push("occasion = ?"); values.push(patch.occasion || null); }
  if ("season" in patch) { fields.push("season = ?"); values.push(patch.season || null); }
  if ("favourite" in patch) { fields.push("favourite = ?"); values.push(patch.favourite ? 1 : 0); }
  if ("wornToday" in patch) { fields.push("worn_today = ?"); values.push(patch.wornToday ? 1 : 0); }
  if (patch.wornToday) {
    for (var w = 0; w < existing.itemIds.length; w++) {
      await updateItem(userId, existing.itemIds[w], { wornToday: true, lastWornAt: Date.now() });
    }
  }
  if (fields.length) {
    values.push(Number(id), Number(userId));
    await pool.query("UPDATE outfits SET " + fields.join(", ") + " WHERE id = ? AND user_id = ?", values);
  }

  if ("itemIds" in patch) {
    await pool.query("DELETE FROM outfit_clothes WHERE outfit_id = ?", [Number(id)]);
    var itemIds = Array.isArray(patch.itemIds) ? patch.itemIds : [];
    for (var i = 0; i < itemIds.length; i++) {
      await pool.query("INSERT IGNORE INTO outfit_clothes (outfit_id, clothing_id) VALUES (?, ?)", [Number(id), Number(itemIds[i])]);
    }
  }

  return findOutfit(userId, id);
}

async function deleteOutfit(userId, id) {
  var numId = Number(id);
  if (!Number.isFinite(numId)) return false;
  var [result] = await pool.query("DELETE FROM outfits WHERE id = ? AND user_id = ?", [numId, Number(userId)]);
  return result.affectedRows > 0;
}

// --- naptár: melyik nap melyik outfitet viselte ---
// Naponta egy outfit; a nap "ÉÉÉÉ-HH-NN" szövegként jön-megy, így nem
// csúszik el időzóna miatt.

async function listOutfitLog(userId) {
  var [rows] = await pool.query(
    "SELECT DATE_FORMAT(day, '%Y-%m-%d') AS day, outfit_id FROM outfit_log WHERE user_id = ? ORDER BY day",
    [Number(userId)]
  );
  return rows.map(function (r) { return { day: r.day, outfitId: r.outfit_id }; });
}

async function setOutfitLog(userId, day, outfitId) {
  // csak a saját outfitjét naplózhatja
  if (!(await findOutfit(userId, outfitId))) return false;
  await pool.query(
    "REPLACE INTO outfit_log (user_id, day, outfit_id) VALUES (?, ?, ?)",
    [Number(userId), day, Number(outfitId)]
  );
  return true;
}

async function clearOutfitLog(userId, day) {
  await pool.query("DELETE FROM outfit_log WHERE user_id = ? AND day = ?", [Number(userId), day]);
}

// A naptár táblája később került be - ha egy régebbi adatbázisból hiányzik,
// induláskor létrehozzuk (ugyanaz, mint a ruhatar.sql-ben).
async function ensureSchema() {
  // e-mail megerősítés oszlopai a users táblában; a MEGLÉVŐ fiókok megerősítettek
  // maradnak (DEFAULT 1), az új regisztrációk 0-val indulnak (lásd createUser)
  var [uOszlopok] = await pool.query(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'"
  );
  var uVan = uOszlopok.map(function (o) { return o.COLUMN_NAME; });
  if (uVan.indexOf("email_verified") === -1) await pool.query("ALTER TABLE users ADD COLUMN email_verified tinyint(1) NOT NULL DEFAULT 1");
  if (uVan.indexOf("verify_token") === -1) await pool.query("ALTER TABLE users ADD COLUMN verify_token char(64) DEFAULT NULL, ADD INDEX verify_token (verify_token)");
  if (uVan.indexOf("verify_expires") === -1) await pool.query("ALTER TABLE users ADD COLUMN verify_expires datetime DEFAULT NULL");
  if (uVan.indexOf("verify_sent_at") === -1) await pool.query("ALTER TABLE users ADD COLUMN verify_sent_at datetime DEFAULT NULL");

  // a ruhák új oszlopai (ár, viselésszám, eredeti fotó) - ha hiányoznak, hozzáadjuk
  var [oszlopok] = await pool.query(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clothes'"
  );
  var van = oszlopok.map(function (o) { return o.COLUMN_NAME; });
  if (van.indexOf("price") === -1) await pool.query("ALTER TABLE clothes ADD COLUMN price int(11) DEFAULT NULL");
  if (van.indexOf("wear_count") === -1) await pool.query("ALTER TABLE clothes ADD COLUMN wear_count int(11) NOT NULL DEFAULT 0");
  if (van.indexOf("orig_image_url") === -1) await pool.query("ALTER TABLE clothes ADD COLUMN orig_image_url varchar(255) DEFAULT NULL");
  if (van.indexOf("color_hex") === -1) await pool.query("ALTER TABLE clothes ADD COLUMN color_hex varchar(7) DEFAULT NULL");
  if (van.indexOf("in_laundry") === -1) await pool.query("ALTER TABLE clothes ADD COLUMN in_laundry tinyint(1) NOT NULL DEFAULT 0");
  if (van.indexOf("needs_repair") === -1) await pool.query("ALTER TABLE clothes ADD COLUMN needs_repair tinyint(1) NOT NULL DEFAULT 0");

  await pool.query(
    "CREATE TABLE IF NOT EXISTS outfit_log (" +
    "  user_id int(11) NOT NULL," +
    "  day date NOT NULL," +
    "  outfit_id int(11) NOT NULL," +
    "  PRIMARY KEY (user_id, day)," +
    "  KEY outfit_id (outfit_id)," +
    "  CONSTRAINT outfit_log_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE," +
    "  CONSTRAINT outfit_log_ibfk_2 FOREIGN KEY (outfit_id) REFERENCES outfits (id) ON DELETE CASCADE" +
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci"
  );
}

// --- fotók ---
// nem a DB-ben tároljuk a képet, csak sima fájlként az uploads mappában,
// és az id maga a fájlnév

var EXT_BY_MIME = {
  "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp",
  "image/heic": ".heic", "image/heif": ".heif", "image/gif": ".gif",
};
var MIME_BY_EXT = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".heic": "image/heic", ".heif": "image/heif", ".gif": "image/gif",
};

function savePhoto(mime, buf) {
  var ext = EXT_BY_MIME[mime] || "";
  var filename = Date.now() + "-" + Math.random().toString(36).slice(2) + ext;
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buf);
  return filename;
}

function getPhoto(id) {
  // ne engedjünk kilépni az uploads mappából egy csalárd id-val
  if (!id || id.indexOf("..") !== -1 || id.indexOf("/") !== -1 || id.indexOf("\\") !== -1) return null;
  var filePath = path.join(UPLOAD_DIR, id);
  if (!fs.existsSync(filePath)) return null;
  var ext = path.extname(id).toLowerCase();
  return { mime: MIME_BY_EXT[ext] || "application/octet-stream", buf: fs.readFileSync(filePath) };
}

module.exports = {
  createUser: createUser,
  findUserByEmail: findUserByEmail,
  findUserByVerifyToken: findUserByVerifyToken,
  markEmailVerified: markEmailVerified,
  setVerifyToken: setVerifyToken,
  findUserById: findUserById,
  updateUser: updateUser,
  publicUser: publicUser,
  listCategories: listCategories,
  createCategory: createCategory,
  renameCategory: renameCategory,
  deleteCategory: deleteCategory,
  listItems: listItems,
  findItem: findItem,
  createItem: createItem,
  updateItem: updateItem,
  removeItem: removeItem,
  restoreItem: restoreItem,
  purgeItem: purgeItem,
  sweepExpiredItems: sweepExpiredItems,
  listOutfits: listOutfits,
  findOutfit: findOutfit,
  createOutfit: createOutfit,
  updateOutfit: updateOutfit,
  deleteOutfit: deleteOutfit,
  listOutfitLog: listOutfitLog,
  setOutfitLog: setOutfitLog,
  clearOutfitLog: clearOutfitLog,
  ensureSchema: ensureSchema,
  savePhoto: savePhoto,
  getPhoto: getPhoto,
};
