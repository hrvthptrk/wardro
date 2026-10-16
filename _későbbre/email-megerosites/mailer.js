"use strict";
// E-mail küldés és e-mail cím ellenőrzés a regisztrációhoz.
//
// A levelező fiók adatai a server/.env fájlból jönnek (minta: .env.example).
// Ha nincs beállítva SMTP, nem küldünk levelet, csak kiírjuk a konzolra az
// igazoló linket - így fejlesztés közben is ki lehet próbálni.

const dns = require("dns").promises;
const nodemailer = require("nodemailer");

var transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  var port = Number(process.env.SMTP_PORT) || 587;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function isConfigured() {
  return transporter !== null;
}

// Megnézi, hogy az e-mail cím domainje egyáltalán tud-e levelet fogadni
// (van-e MX rekordja). Ha nincs, a cím biztosan nem létezik.
// Visszatérés: "ok" | "no_domain" | "dns_error"
async function checkEmailDomain(email) {
  var domain = String(email).split("@").pop().trim().toLowerCase();
  if (!domain) return "no_domain";
  try {
    var records = await dns.resolveMx(domain);
    if (records.length && !(records.length === 1 && records[0].exchange === "")) return "ok";
    return "no_domain";
  } catch (e) {
    if (e.code === "ENOTFOUND" || e.code === "ENODATA" || e.code === "ESERVFAIL") return "no_domain";
    return "dns_error";
  }
}

// Visszatérés: "sent" | "rejected" (a levelező szerver szerint nincs ilyen
// postafiók) | "failed" (egyéb hiba)
async function sendVerificationEmail(to, name, link) {
  if (!transporter) {
    console.log("[e-mail] Nincs SMTP beállítva, az igazoló link ehhez: " + to);
    console.log("[e-mail] " + link);
    return "sent";
  }
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: to,
      subject: "Erősítsd meg az e-mail címed – Wardro",
      text:
        "Szia " + name + "!\n\n" +
        "Köszönjük, hogy regisztráltál a Wardro-ra. A fiókod aktiválásához kattints az alábbi linkre:\n\n" +
        link + "\n\n" +
        "A link 24 óráig érvényes. Ha nem te regisztráltál, hagyd figyelmen kívül ezt a levelet.\n",
      html:
        "<p>Szia " + escapeHtml(name) + "!</p>" +
        "<p>Köszönjük, hogy regisztráltál a Wardro-ra. A fiókod aktiválásához kattints az alábbi gombra:</p>" +
        '<p><a href="' + link + '" style="display:inline-block;padding:12px 20px;background:#57462F;color:#F6F1E7;text-decoration:none;border-radius:10px">E-mail cím megerősítése</a></p>' +
        '<p style="color:#6B5940;font-size:13px">A link 24 óráig érvényes. Ha nem te regisztráltál, hagyd figyelmen kívül ezt a levelet.</p>',
    });
    return "sent";
  } catch (e) {
    console.error("[e-mail] küldés sikertelen:", e.message);
    // 550/553 stb.: a fogadó szerver azonnal visszautasította a címzettet
    if (e.responseCode >= 550 && e.responseCode <= 553) return "rejected";
    return "failed";
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

module.exports = {
  isConfigured: isConfigured,
  checkEmailDomain: checkEmailDomain,
  sendVerificationEmail: sendVerificationEmail,
};
