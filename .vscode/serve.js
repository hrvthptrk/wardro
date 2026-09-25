// Egyszerű, függőség nélküli statikus fájlkiszolgáló a projekt gyökeréhez.
// A launch.json ezt indítja el (preLaunchTask) F5 megnyomásakor, mielőtt
// megnyitná a böngészőt a http://localhost:8080 címen.
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;
const ROOT = path.join(__dirname, "..");
// Ha nincs megadva fájl (pl. http://localhost:8080/), ezt szolgáljuk ki.
const DEFAULT_FILE = "Wardro Web.dc.html";

const MIME = {
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
};

console.log("Kiszolgálás indul...");

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split("?")[0]);
  if (reqPath === "/") reqPath = "/" + DEFAULT_FILE;
  const filePath = path.join(ROOT, reqPath);

  // Ne engedjünk kilépni a projekt mappájából.
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Tiltva");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Nem található: " + reqPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    // Már fut egy példány (pl. egy korábbi F5-ből) – ez nem hiba, mehetünk tovább.
    console.log("A 8080-as port már foglalt, feltehetően fut már a szerver.");
    console.log("Kiszolgálás fut a http://localhost:8080 címen");
    process.exit(0);
  }
  console.error("Szerverhiba:", err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log("Kiszolgálás fut a http://localhost:8080 címen");
});
