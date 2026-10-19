// E-mail küldés (fiók megerősítése).
//
// Beállítás – kétféleképpen (a környezeti változók az erősebbek):
//   1. server/email.config.json (minta: email.config.example.json), pl. Gmailhez:
//        { "host": "smtp.gmail.com", "port": 465, "secure": true,
//          "user": "te@gmail.com", "pass": "16 karakteres alkalmazásjelszó",
//          "from": "Wardro <te@gmail.com>", "appUrl": "http://localhost:8080" }
//   2. környezeti változók: SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS,
//      SMTP_FROM, APP_URL
//
// Ha nincs beállítva, nem küldünk levelet: a megerősítő link a szerver
// ablakában jelenik meg, így fejlesztés közben is ki lehet próbálni.

const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const CONFIG_FILE = path.join(__dirname, "email.config.json");

function loadConfig() {
  let file = {};
  try {
    if (fs.existsSync(CONFIG_FILE)) file = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch (e) {
    console.log("email.config.json nem olvasható: " + e.message);
  }
  const env = process.env;
  const cfg = {
    host: env.SMTP_HOST || file.host || "",
    port: Number(env.SMTP_PORT || file.port || 465),
    secure: (env.SMTP_SECURE || String(file.secure === undefined ? "" : file.secure)) !== "false",
    user: env.SMTP_USER || file.user || "",
    pass: env.SMTP_PASS || file.pass || "",
    from: env.SMTP_FROM || file.from || "",
    appUrl: env.APP_URL || file.appUrl || "",
  };
  if (!cfg.from && cfg.user) cfg.from = "Wardro <" + cfg.user + ">";
  return cfg;
}

let transporter = null;
let transporterKey = "";

function getTransporter(cfg) {
  const key = [cfg.host, cfg.port, cfg.secure, cfg.user].join("|");
  if (!transporter || key !== transporterKey) {
    transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: cfg.user ? { user: cfg.user, pass: cfg.pass } : undefined,
    });
    transporterKey = key;
  }
  return transporter;
}

function isConfigured() {
  const cfg = loadConfig();
  return !!(cfg.host && cfg.from);
}

// A levélben lévő link címe. Sorrend: a beállított appUrl (ha nem localhost), a
// Cloudflare Tunnel nyilvános címe (tunnel.js), végül a gép hálózati (wifi) címe, mint a
// telefonos párosításnál: így a link a hálózat bármelyik eszközéről működik, nem csak
// ezen a gépen.
function appUrl(req, lanAddress, port, nyilvanos) {
  const cfg = loadConfig();
  const sajat = (cfg.appUrl || "").trim().replace(/\/+$/, "");
  if (sajat && !/\/\/(localhost|127\.0\.0\.1)(:|$)/i.test(sajat)) return sajat;
  // a Cloudflare Tunnel nyilvános címe: bárhonnan (internetről is) működik
  const pub = typeof nyilvanos === "function" ? nyilvanos() : "";
  if (pub) return pub;
  const ip = typeof lanAddress === "function" ? lanAddress() : "";
  if (ip && ip !== "localhost") return "http://" + ip + ":" + (port || 8080);
  return "http://" + (req.headers.host || "localhost:8080");
}

function escapeHtml(x) {
  return String(x).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// a levél: az alkalmazás színvilágában (sötét kártya, lime kiemelés)
function verificationMail(name, link) {
  return levelSablon({
    subject: "Erősítsd meg a Wardro fiókod",
    cim: "Erősítsd meg az e-mail címed",
    bevezeto: "Köszönjük, hogy regisztráltál. Már csak egy lépés: kattints a gombra, és a fiókod aktív lesz – utána rögtön be is léptetünk.",
    gomb: "Fiók megerősítése",
    labjegyzet: "A link 24 óráig érvényes. Ha nem te regisztráltál, nyugodtan hagyd figyelmen kívül ezt a levelet.",
    szovegBevezeto: "Köszönjük, hogy regisztráltál a Wardróba. A fiókod aktiválásához erősítsd meg az e-mail címed az alábbi linkkel:",
  }, name, link);
}

function resetMail(name, link) {
  return levelSablon({
    subject: "Új jelszó a Wardro fiókodhoz",
    cim: "Állíts be új jelszót",
    bevezeto: "Valaki (remélhetőleg te) új jelszót kért a fiókodhoz. Kattints a gombra, és adj meg egy újat – utána minden más eszközről kijelentkeztetünk.",
    gomb: "Új jelszó beállítása",
    labjegyzet: "A link 1 óráig érvényes, és csak egyszer használható. Ha nem te kérted, hagyd figyelmen kívül ezt a levelet – a jelszavad nem változik.",
    szovegBevezeto: "Új jelszót kértek a Wardro fiókodhoz. Az alábbi linken adhatsz meg újat:",
  }, name, link);
}

function levelSablon(t, name, link) {
  const n = escapeHtml(name || "");
  const l = escapeHtml(link);
  const text =
    "Szia " + (name || "") + "!\n\n" + t.szovegBevezeto + "\n\n" + link + "\n\n" + t.labjegyzet + "\n\n– Wardro";
  const html =
    '<!doctype html><html lang="hu"><body style="margin:0;padding:0;background:#0F0F11;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F11;padding:32px 12px;font-family:Segoe UI,Helvetica,Arial,sans-serif;">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#17171A;border:1px solid #2A2A2E;border-radius:24px;">' +
    '<tr><td style="padding:32px 32px 8px;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
    '<td style="width:34px;height:34px;background:#F4F4F5;border-radius:10px;text-align:center;font-weight:700;font-size:15px;color:#0F0F11;">W</td>' +
    '<td style="padding-left:10px;font-weight:700;font-size:18px;color:#F4F4F5;">Wardro</td>' +
    '</tr></table></td></tr>' +
    '<tr><td style="padding:16px 32px 0;">' +
    '<div style="width:18px;height:2px;background:#C8F169;border-radius:2px;margin-bottom:12px;"></div>' +
    '<h1 style="margin:0 0 10px;font-size:28px;line-height:1.15;color:#F4F4F5;letter-spacing:-0.5px;">' + escapeHtml(t.cim) + '</h1>' +
    '<p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#A6A6AE;">Szia ' + n + '! ' + escapeHtml(t.bevezeto) + '</p>' +
    '<a href="' + l + '" style="display:inline-block;background:#C8F169;color:#12140C;text-decoration:none;font-weight:700;font-size:15px;padding:14px 26px;border-radius:999px;">' + escapeHtml(t.gomb) + '</a>' +
    '<p style="margin:22px 0 6px;font-size:12px;line-height:1.6;color:#7D7D86;">Ha a gomb nem működik, másold be ezt a linket a böngésződbe:</p>' +
    '<p style="margin:0 0 26px;font-size:12px;line-height:1.5;word-break:break-all;"><a href="' + l + '" style="color:#C8F169;">' + l + '</a></p>' +
    '</td></tr>' +
    '<tr><td style="padding:18px 32px 28px;border-top:1px solid #2A2A2E;font-size:12px;line-height:1.6;color:#7D7D86;">' + escapeHtml(t.labjegyzet) + '</td></tr>' +
    '</table></td></tr></table></body></html>';
  return { subject: t.subject, text: text, html: html };
}

// visszaadja, sikerült-e ténylegesen elküldeni (beállítás nélkül: false, a link a konzolra kerül)
async function kuld(to, mail, link, fajta) {
  const cfg = loadConfig();
  if (!cfg.host || !cfg.from) {
    console.log("");
    console.log("==================================================================");
    console.log(" " + fajta + " (nincs beállítva e-mail küldés – lásd server/mail.js)");
    console.log(" Címzett: " + to);
    console.log(" Link:    " + link);
    console.log("==================================================================");
    console.log("");
    return { sent: false, configured: false };
  }
  try {
    await getTransporter(cfg).sendMail({ from: cfg.from, to: to, subject: mail.subject, text: mail.text, html: mail.html });
    return { sent: true, configured: true };
  } catch (e) {
    console.log(fajta + " küldése nem sikerült (" + to + "): " + e.message);
    console.log(" Link (kézi továbbításhoz): " + link);
    return { sent: false, configured: true, error: e.message };
  }
}

function sendVerification(to, name, link) {
  return kuld(to, verificationMail(name, link), link, "Megerősítő e-mail");
}

function sendPasswordReset(to, name, link) {
  return kuld(to, resetMail(name, link), link, "Jelszó-visszaállító e-mail");
}

module.exports = { sendVerification, sendPasswordReset, isConfigured, appUrl };
