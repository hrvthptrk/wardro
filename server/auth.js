"use strict";
// Jelszavak és bejelentkezések kezelése.

const crypto = require("crypto");

const COOKIE_NAME = "wardro_session";
const SESSION_DAYS = 30;

function hashPassword(password) {
  var salt = crypto.randomBytes(16).toString("hex");
  var hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return salt + ":" + hash;
}

function verifyPassword(password, stored) {
  var parts = stored.split(":");
  var salt = parts[0];
  var hash = parts[1];
  if (!salt || !hash) return false;
  var check = crypto.scryptSync(password, salt, 64);
  var want = Buffer.from(hash, "hex");
  // állandó idejű összehasonlítás (ne lehessen időzítésből következtetni)
  return want.length === check.length && crypto.timingSafeEqual(check, want);
}

// munkamenetek egy sima objektumban, nem Map-ben - token a kulcs
var sessions = {};

function createSession(userId) {
  var token = crypto.randomBytes(24).toString("base64url");
  sessions[token] = {
    userId: userId,
    expiresAt: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  return token;
}

function getSession(token) {
  var s = sessions[token];
  if (!s) return null;
  if (s.expiresAt < Date.now()) {
    delete sessions[token];
    return null;
  }
  return s;
}

function destroySession(token) {
  delete sessions[token];
}

// jelszócsere után: a felhasználó minden eszközről kijelentkezik
function destroyUserSessions(userId) {
  Object.keys(sessions).forEach(function (t) {
    if (String(sessions[t].userId) === String(userId)) delete sessions[t];
  });
}

function parseCookies(req) {
  var out = {};
  var header = req.headers.cookie;
  if (!header) return out;
  var parts = header.split(";");
  for (var i = 0; i < parts.length; i++) {
    var eq = parts[i].indexOf("=");
    if (eq === -1) continue;
    var key = parts[i].slice(0, eq).trim();
    var val = parts[i].slice(eq + 1).trim();
    out[key] = decodeURIComponent(val);
  }
  return out;
}

function setSessionCookie(res, token) {
  var maxAge = SESSION_DAYS * 24 * 60 * 60;
  res.setHeader("Set-Cookie", COOKIE_NAME + "=" + token + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + maxAge);
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", COOKIE_NAME + "=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
}

function currentUserId(req) {
  var cookies = parseCookies(req);
  var token = cookies[COOKIE_NAME];
  if (!token) return null;
  var session = getSession(token);
  if (!session) return null;
  return session.userId;
}

module.exports = {
  SESSION_COOKIE: COOKIE_NAME,
  hashPassword: hashPassword,
  verifyPassword: verifyPassword,
  createSession: createSession,
  getSession: getSession,
  destroySession: destroySession,
  destroyUserSessions: destroyUserSessions,
  parseCookies: parseCookies,
  setSessionCookie: setSessionCookie,
  clearSessionCookie: clearSessionCookie,
  currentUserId: currentUserId,
};
