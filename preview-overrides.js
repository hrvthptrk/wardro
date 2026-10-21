// Lehetővé teszi, hogy URL-paraméterekkel felülírjuk az indítási beállításokat –
// erre a design-eszköz saját beállító panelje szolgálna, de az önálló backenden
// (server/index.js) nincs ilyen. Így linkkel is elérhető, pl.:
//   ?start=app                     -> már bejelentkezve, feltöltött szekrénnyel indul
//   ?start=app&profile=Female      -> ugyanaz, de a női mintaadatokkal
//   ?start=firstLaunch             -> friss fiók, üres szekrény (mintha most regisztráltál volna)
//
// A lehetséges "start" értékek: login | signup | firstLaunch | app
"use strict";
(function () {
  var params = new URLSearchParams(location.search);
  if (!Array.from(params.keys()).length) return;

  var overrides = {};
  ["start", "profile", "density"].forEach(function (key) {
    if (params.has(key)) overrides[key] = params.get(key);
  });
  if (params.has("showUnwornFlags")) overrides.showUnwornFlags = params.get("showUnwornFlags") !== "false";
  if (!Object.keys(overrides).length) return;

  // A runtime (support.js) a boot() után még lefordítja a logikát és a sablont,
  // és csak a felcsatolt komponens figyel a változásokra. Ha ennél korábban
  // állítjuk be a propokat, a változás elvész (hidegindításkor így maradt a
  // belépő képernyő). Ezért megvárjuk, hogy a fő komponens kész legyen és
  // figyeljen – legfeljebb kb. 20 másodpercig.
  function kesz(rootName) {
    var reg = window.__dcRegistry;
    if (!reg) return true; // régebbi runtime: nincs mit figyelni, mehet
    var e = reg[rootName];
    return !!(e && e.Logic && e.tpl && e.subs && e.subs.size);
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    var rootName = window.__dcRootName && window.__dcRootName();
    if (window.__dcSetProps && rootName && kesz(rootName)) {
      clearInterval(timer);
      window.__dcSetProps(rootName, overrides);
      // A logika this.props-a csak a renderelés UTÁN frissül (componentDidUpdate),
      // így az első újrarajzolás még a régi propokkal fut – egy második,
      // azonos beállítás után már az újakkal rajzol.
      setTimeout(function () { window.__dcSetProps(rootName, overrides); }, 100);
    } else if (tries > 400) {
      clearInterval(timer); // kb. 20 másodperc után feladjuk, valami más lehet a gond
    }
  }, 50);
})();
