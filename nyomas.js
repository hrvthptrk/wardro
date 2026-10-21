// Gombnyomás-visszajelzés: amit megnyomsz, az picit összehúzódik, elengedve
// visszarugózik. A kattintható elemek sima div-ek (a runtime React-tel köti
// rájuk az onClick-et), ezért nem osztálynév alapján keresünk, hanem a
// legközelebbi elemet, amelyen tényleg van onClick (a "cursor: pointer"
// öröklődik, az a gomb belső szövegén is ott van). A külön "scale"
// tulajdonságot animáljuk, így nem ütközik a meglévő transform-okkal
// (pl. translate(-50%)) és a hover-emelés transition-jeivel.
"use strict";
(function () {
  if (!Element.prototype.animate || !("scale" in document.documentElement.style)) return;

  var csokkentett = window.matchMedia("(prefers-reduced-motion: reduce)");
  var EASE = "cubic-bezier(.2,.8,.2,1)"; // ugyanaz a görbe, mint a CSS-ben mindenhol
  var aktiv = null;

  function vanKattintas(el) {
    if (el.matches("a[href], button")) return true;
    var kulcsok = Object.keys(el);
    for (var i = 0; i < kulcsok.length; i++) {
      if (kulcsok[i].indexOf("__reactProps$") === 0) return !!(el[kulcsok[i]] && el[kulcsok[i]].onClick);
    }
    return false;
  }

  function nyomhato(el) {
    for (; el && el !== document.body; el = el.parentElement) {
      if (!vanKattintas(el)) continue;
      // a még nem használható gomb (pl. "Először nevezd el") nem rugózik
      if (getComputedStyle(el).cursor !== "pointer") return null;
      var r = el.getBoundingClientRect();
      // háttérre kattintva záródó rétegeket (modal hátterek) nem húzunk össze
      if (r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.5) return null;
      return el;
    }
    return null;
  }

  function lenyom(e) {
    elenged(); // második ujj: az előzőt engedjük el, különben beragadna
    if (csokkentett.matches || e.button !== 0) return;
    var el = nyomhato(e.target);
    if (!el) return;
    var r = el.getBoundingClientRect();
    // nagy kártyán kisebb összehúzás, különben "ugrik" a fél képernyő
    var mertek = r.width * r.height > 60000 ? 0.985 : 0.97;
    aktiv = el;
    el.animate([{ scale: "1" }, { scale: String(mertek) }], {
      duration: 120, easing: EASE, fill: "forwards"
    });
  }

  function elenged() {
    var el = aktiv;
    if (!el) return;
    aktiv = null;
    if (!el.isConnected) return; // közben eltűnt (pl. oldalváltás)
    var most = getComputedStyle(el).scale;
    el.getAnimations().forEach(function (a) {
      if (a.effect && a.effect.getKeyframes().some(function (k) { return "scale" in k; })) a.cancel();
    });
    el.animate([{ scale: most === "none" ? "1" : most }, { scale: "1" }], {
      duration: 220, easing: EASE
    });
  }

  document.addEventListener("pointerdown", lenyom, { passive: true });
  document.addEventListener("pointerup", elenged, { passive: true });
  document.addEventListener("pointercancel", elenged, { passive: true });
  window.addEventListener("blur", elenged);
})();
