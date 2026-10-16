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

  // A runtime (support.js) csak azután áll készen a propok felülírására, hogy
  // lefutott a boot() – ezt röviden kivárjuk, majd feladjuk, ha mégsem indul el.
  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    var rootName = window.__dcRootName && window.__dcRootName();
    if (window.__dcSetProps && rootName) {
      clearInterval(timer);
      window.__dcSetProps(rootName, overrides);
    } else if (tries > 100) {
      clearInterval(timer); // kb. 5 másodperc után feladjuk, valami más lehet a gond
    }
  }, 50);
})();
