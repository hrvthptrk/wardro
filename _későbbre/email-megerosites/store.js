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

// Az e-mail megerősítéshez kellő oszlopok. Ha egy régebbi adatbázisból
// hiányoznak, induláskor hozzáadjuk őket; a már meglévő fiókokat ilyenkor
// megerősítettnek vesszük, hogy senki ne zárja ki magát.
async function ensureSchema() {
  var [cols] = await pool.query(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'email_verified'"
  );
  if (cols.length) return;
  await pool.query(
    "ALTER TABLE users ADD COLUMN email_verified TINYINT(1) NOT NULL DEFAULT 0, " +
    "ADD COLUMN verify_token VARCHAR(64) DEFAULT NULL, " +
    "ADD COLUMN verify_expires DATETIME DEFAULT NULL"
  );
  await pool.query("UPDATE users SET email_verified = 1");
}

// a ruha-fotókat egyszerűen fájlként tesszük el ide, a kép URL-je csak erre
// a mappára mutat vissza - a clothes.image_url oszlop ezt várja
var UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

var STARTER_CATEGORIES = {
  Male: ["Pólók", "Nadrágok", "Cipők", "Kabátok", "Kiegészítők"],
  Female: ["Felsők", "Nadrágok és szoknyák", "Ruhák", "Cipők", "Kiegészítők"],
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
    createdAt: toMillis(row.created_at),
    emailVerified: row.email_verified === undefined ? true : !!row.email_verified,
    verifyExpires: toMillis(row.verify_expires),
  };
}

async function createUser(info) {
  var email = info.email.toLowerCase();
  var [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length) return null; // már van ilyen email

  var profile = info.profile === "Female" ? "Female" : "Male";
  var [result] = await pool.query(
    "INSERT INTO users (username, email, password_hash, profile, email_verified, verify_token, verify_expires) VALUES (?, ?, ?, ?, 0, ?, ?)",
    [info.name, email, info.passwordHash, profile, info.verifyToken, new Date(info.verifyExpires)]
  );
  var userId = result.insertId;

  var starter = STARTER_CATEGORIES[profile];
  for (var i = 0; i < starter.length; i++) {
    await createCategory(userId, starter[i]);
  }

  return findUserById(userId);
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
  };
  await pool.query(
    "UPDATE users SET username = ?, email = ?, profile = ?, settings = ? WHERE id = ?",
    [merged.name, String(merged.email).toLowerCase(), merged.profile, JSON.stringify(settings), Number(id)]
  );
  return findUserById(id);
}

async function deleteUser(id) {
  await pool.query("DELETE FROM users WHERE id = ?", [Number(id)]);
}

async function setVerifyToken(id, token, expiresAt) {
  await pool.query("UPDATE users SET verify_token = ?, verify_expires = ? WHERE id = ?", [token, new Date(expiresAt), Number(id)]);
}

// Megerősíti a tokenhez tartozó fiókot. Lejárt vagy ismeretlen tokennél null.
async function verifyEmailToken(token) {
  var [rows] = await pool.query(
    "SELECT id FROM users WHERE verify_token = ? AND email_verified = 0 AND verify_expires > NOW()",
    [String(token)]
  );
  if (!rows.length) return null;
  await pool.query("UPDATE users SET email_verified = 1, verify_token = NULL, verify_expires = NULL WHERE id = ?", [rows[0].id]);
  return findUserById(rows[0].id);
}

function publicUser(user) {
  if (!user) return null;
  var copy = {};
  for (var key in user) {
    if (key !== "passwordHash" && key !== "verifyExpires") copy[key] = user[key];
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

function rowToItem(row) {
  return {
    id: row.id,
    userId: row.user_id,
    label: row.name,
    categoryId: row.category_id,
    photoUrl: row.image_url,
    tags: row.tags ? row.tags.split(",").filter(function (t) { return t; }) : [],
    wornToday: !!row.worn_today,
    lastWornAt: toMillis(row.last_worn_at),
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

async function createItem(userId, data) {
  var tags = Array.isArray(data.tags) && data.tags.length ? data.tags.join(",") : null;
  var [result] = await pool.query(
    "INSERT INTO clothes (user_id, name, category_id, image_url, tags) VALUES (?, ?, ?, ?, ?)",
    [Number(userId), data.label, data.categoryId || null, data.photoUrl || null, tags]
  );
  return findItem(userId, result.insertId);
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
  if ("wornToday" in patch) { fields.push("worn_today = ?"); values.push(patch.wornToday ? 1 : 0); }
  if ("lastWornAt" in patch) { fields.push("last_worn_at = ?"); values.push(patch.lastWornAt ? new Date(patch.lastWornAt) : null); }
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
  ensureSchema: ensureSchema,
  createUser: createUser,
  deleteUser: deleteUser,
  setVerifyToken: setVerifyToken,
  verifyEmailToken: verifyEmailToken,
  findUserByEmail: findUserByEmail,
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
  savePhoto: savePhoto,
  getPhoto: getPhoto,
};
