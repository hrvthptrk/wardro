// Nyilvános elérés az internetről – Cloudflare Tunnel (ingyenes "quick tunnel").
//
// Ha a server/bin/cloudflared.exe megvan, a szerver indulásakor elindítjuk, és
// kapunk egy https://valami.trycloudflare.com címet, ami bárhonnan (mobilnetről,
// más hálózatról) eléri ezt a gépet. A megerősítő e-mailek linkjei ezt a címet kapják.
//
// Kikapcsolás: WARDRO_TUNNEL=0 környezeti változó, vagy a server/email.config.json-ban
// "tunnel": false. Állandó (nem változó) címhez saját Cloudflare-fiók és domain kell
// – ilyenkor az "appUrl"-be írd a saját címedet, és az lesz a link.
//
// Fontos: a quick tunnel címe minden szerver-újraindításkor MÁS lesz, ezért egy
// korábban kiküldött link az újraindítás után már nem működik (újraküldéssel jön új).

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const EXE = path.join(__dirname, "bin", process.platform === "win32" ? "cloudflared.exe" : "cloudflared");
const CONFIG_FILE = path.join(__dirname, "email.config.json");

let publicUrl = "";
let child = null;
let probalkozas = 0;
let leall = false;

function bekapcsolva() {
  if (process.env.WARDRO_TUNNEL === "0") return false;
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
      if (cfg.tunnel === false) return false;
    }
  } catch (e) { /* hibás config: maradunk a bekapcsolt állapotnál */ }
  return fs.existsSync(EXE);
}

function start(port) {
  if (!bekapcsolva() || child) return;
  child = spawn(EXE, ["tunnel", "--url", "http://localhost:" + port, "--no-autoupdate"], {
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const olvas = (buf) => {
    const m = String(buf).match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
    if (m && m[0] !== publicUrl) {
      publicUrl = m[0];
      probalkozas = 0;
      // a cím fájlba is kerül (server/bin/public-url.txt), hogy könnyen meg lehessen nézni
      try { fs.writeFileSync(path.join(__dirname, "bin", "public-url.txt"), publicUrl + "\n"); } catch (e) { /* nem baj */ }
      console.log("");
      console.log("==================================================================");
      console.log(" Nyilvános cím (bárhonnan elérhető, az internetről is):");
      console.log("   " + publicUrl);
      console.log(" A megerősítő e-mailek linkjei ezt a címet kapják.");
      console.log("==================================================================");
      console.log("");
    }
  };
  child.stdout.on("data", olvas);
  child.stderr.on("data", olvas);

  child.on("exit", function (code) {
    child = null;
    publicUrl = "";
    if (leall) return;
    probalkozas++;
    if (probalkozas > 5) {
      console.log("A nyilvános cím (Cloudflare Tunnel) nem indult el – csak a helyi hálózaton érhető el az oldal.");
      return;
    }
    console.log("A nyilvános cím leállt (" + code + "), újraindítom…");
    setTimeout(function () { start(port); }, 5000 * probalkozas);
  });
}

function stop() {
  leall = true;
  if (child) {
    try { child.kill(); } catch (e) { /* már leállt */ }
  }
}

process.on("exit", stop);
process.on("SIGINT", function () { stop(); process.exit(0); });
process.on("SIGTERM", function () { stop(); process.exit(0); });

module.exports = { start, stop, url: function () { return publicUrl; } };
