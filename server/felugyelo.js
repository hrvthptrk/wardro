// Felügyelő: a Wardro szerverét a háttérben futtatja, és ha leáll, újraindítja.
// A Windows indításakor a hatter-inditas.vbs indítja el (ablak nélkül).
// A kimenet a server/szerver.log fájlba kerül (5 MB fölött az elejét levágjuk).
// Ha már fut egy Wardro-szerver a porton (a szerver 3-as kóddal lép ki), a felügyelő is kilép.

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const LOG = path.join(__dirname, "szerver.log");
const MAX_LOG = 5 * 1024 * 1024;

function logMeret() {
  try {
    if (fs.existsSync(LOG) && fs.statSync(LOG).size > MAX_LOG) {
      const tartalom = fs.readFileSync(LOG);
      fs.writeFileSync(LOG, tartalom.subarray(tartalom.length - MAX_LOG / 2));
    }
  } catch (e) { /* a napló nem fontos */ }
}

function naplo(sor) {
  try { fs.appendFileSync(LOG, "[" + new Date().toLocaleString("hu-HU") + "] [felügyelő] " + sor + "\n"); } catch (e) { /* mindegy */ }
}

let ujraindit = 0;
function indit() {
  logMeret();
  const ki = fs.openSync(LOG, "a");
  // a böngészőt nem nyitjuk meg (a "Go Live" vagy a http://localhost:8080 címen érhető el)
  const gyerek = spawn(process.execPath, [path.join(__dirname, "index.js")], {
    cwd: __dirname,
    stdio: ["ignore", ki, ki],
    windowsHide: true,
    env: Object.assign({}, process.env, { WARDRO_NO_BROWSER: "1" }),
  });
  const indult = Date.now();
  naplo("szerver elindítva (pid " + gyerek.pid + ")");
  gyerek.on("exit", function (kod) {
    fs.closeSync(ki);
    if (kod === 3) { naplo("már fut egy szerver – a felügyelő kilép"); process.exit(0); }
    // ha gyorsan egymás után többször leáll, lassabban próbálkozunk
    ujraindit = Date.now() - indult < 60 * 1000 ? Math.min(ujraindit + 1, 6) : 0;
    const varas = 3000 * Math.pow(2, ujraindit);
    naplo("a szerver leállt (kód: " + kod + "), újraindítás " + Math.round(varas / 1000) + " mp múlva");
    setTimeout(indit, varas);
  });
}

naplo("felügyelő indul");
indit();
