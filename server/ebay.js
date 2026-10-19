// eBay Browse API – termékfotók a katalógushoz és szabad keresés.
//
// Beállítás: server/ebay.config.json (gitignore-olva), vagy környezeti változók:
//   EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_MARKETPLACE (pl. EBAY_DE)
// Csak nyilvános termékadatot olvasunk ("client credentials" token), a
// felhasználó nevében nem lépünk be, eBay-felhasználói adatot nem tárolunk.
//
// A katalógus egy-egy termékéhez talált kép címét megjegyezzük
// (server/ebay-kepek.json), így ugyanazért nem kérdezünk rá újra.
// A képeket a saját szerverünkön át adjuk tovább (/api/ebay/kep), hogy a
// böngésző le tudja venni a hátterüket (ehhez azonos eredet kell).

const fs = require("fs");
const path = require("path");

const CONFIG_FILE = path.join(__dirname, "ebay.config.json");
const CACHE_FILE = path.join(__dirname, "ebay-kepek.json");
const API = "https://api.ebay.com";
const SCOPE = "https://api.ebay.com/oauth/api_scope";

function loadConfig() {
  let file = {};
  try {
    if (fs.existsSync(CONFIG_FILE)) file = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch (e) {
    console.log("ebay.config.json nem olvasható: " + e.message);
  }
  const env = process.env;
  return {
    clientId: String(env.EBAY_CLIENT_ID || file.clientId || "").trim(),
    clientSecret: String(env.EBAY_CLIENT_SECRET || file.clientSecret || "").trim(),
    marketplace: String(env.EBAY_MARKETPLACE || file.marketplace || "EBAY_DE").trim(),
  };
}

function isConfigured() {
  const c = loadConfig();
  return !!(c.clientId && c.clientSecret);
}

// --- hozzáférési token (kb. 2 óráig érvényes; lejárat előtt újat kérünk) ---
let token = null;
let tokenLejar = 0;
let tokenKulcs = "";
let utolsoHiba = "";

async function getToken() {
  const c = loadConfig();
  if (!c.clientId || !c.clientSecret) throw Object.assign(new Error("nincs beállítva"), { kod: "not_configured" });
  const kulcs = c.clientId + "|" + c.clientSecret;
  if (token && kulcs === tokenKulcs && Date.now() < tokenLejar - 60 * 1000) return token;
  const r = await fetch(API + "/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: "Basic " + Buffer.from(c.clientId + ":" + c.clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials&scope=" + encodeURIComponent(SCOPE),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) {
    utolsoHiba = j.error_description || j.error || "HTTP " + r.status;
    throw Object.assign(new Error("eBay token: " + utolsoHiba), { kod: j.error === "invalid_client" ? "invalid_client" : "token_failed" });
  }
  token = j.access_token;
  tokenKulcs = kulcs;
  tokenLejar = Date.now() + (Number(j.expires_in) || 7200) * 1000;
  utolsoHiba = "";
  return token;
}

// állapot a felületnek: be van-e állítva, és működik-e a kulcs
async function status() {
  if (!isConfigured()) return { configured: false, ok: false, error: "not_configured" };
  try {
    await getToken();
    return { configured: true, ok: true };
  } catch (e) {
    return { configured: true, ok: false, error: e.kod || "token_failed", message: utolsoHiba };
  }
}

// nagyobb felbontású kép: az eBay kép-URL-jében az s-l225 / s-l500 méretet cseréljük
function nagyKep(url) {
  return String(url || "").replace(/\/s-l\d+\.(jpg|jpeg|png|webp)/i, "/s-l800.$1");
}

// csak az eBay képszerveréről továbbítunk képet
function engedettKep(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && /(^|\.)ebayimg\.com$/i.test(u.hostname);
  } catch (e) {
    return false;
  }
}

function proxyUrl(url) {
  return "/api/ebay/kep?u=" + encodeURIComponent(url);
}

// keresés a Browse API-ban; ruházati kategóriákra szűrve (11450 = Clothing, Shoes & Accessories)
async function search(q, limit, kategoria) {
  const c = loadConfig();
  const t = await getToken();
  const params = new URLSearchParams({
    q: String(q).slice(0, 100),
    limit: String(Math.max(1, Math.min(50, Number(limit) || 24))),
    // ékszer és óra: külön eBay-kategória (281 = Jewelry & Watches)
    category_ids: kategoria || (/earring|necklace|bracelet|\bring\b|jewel|watch|pendant|anklet|brooch/i.test(q) ? "281" : "11450"),
    filter: "buyingOptions:{FIXED_PRICE}",
  });
  const r = await fetch(API + "/buy/browse/v1/item_summary/search?" + params, {
    headers: { authorization: "Bearer " + t, "X-EBAY-C-MARKETPLACE-ID": c.marketplace, "accept-language": "de-DE" },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (r.status === 401) token = null;
    throw Object.assign(new Error("eBay keresés: " + r.status + " " + JSON.stringify(j.errors || j).slice(0, 200)), { kod: "search_failed" });
  }
  return (j.itemSummaries || [])
    .filter((i) => i.image && i.image.imageUrl && engedettKep(i.image.imageUrl))
    .map((i) => ({
      id: String(i.itemId || ""),
      title: String(i.title || ""),
      image: proxyUrl(nagyKep(i.image.imageUrl)),
      imageEbay: nagyKep(i.image.imageUrl),
      price: i.price ? Number(i.price.value) : null,
      currency: i.price ? i.price.currency : "",
      url: i.itemWebUrl || "",
      condition: i.condition || "",
    }));
}

// --- magyar terméknevek -> angol keresőszavak (az eBay a magyar szavakat nem érti) ---
// a hosszabb kifejezések előbb jönnek, hogy pl. a "kapucnis pulóver" ne "hoodie sweater" legyen
const FORDITAS = [
  ["kapucnis pulóver", "hoodie"], ["kapucnis felső", "hoodie"], ["melegítőnadrág", "track pants"], ["melegítőfelső", "track jacket"],
  ["melegítő", "tracksuit"], ["rövidnadrág", "shorts"], ["farmerdzseki", "denim jacket"], ["farmerkabát", "denim jacket"],
  ["pehelykabát", "puffer jacket"], ["pufikabát", "puffer jacket"], ["bőrkabát", "leather jacket"], ["bőrdzseki", "leather jacket"],
  ["hátizsák", "backpack"], ["napszemüveg", "sunglasses"], ["fülbevaló", "earrings"], ["nyaklánc", "necklace"], ["karkötő", "bracelet"],
  ["sportmelltartó", "sports bra"], ["melltartó", "bra"], ["baseballsapka", "baseball cap"], ["széldzseki", "windbreaker jacket"],
  ["oldaltáska", "crossbody bag"], ["edzőtáska", "gym bag"], ["övtáska", "belt bag"], ["edzőpóló", "training t-shirt"],
  ["edzőcipő", "training shoes"], ["futócipő", "running shoes"], ["sportcipő", "sneakers"], ["edző", "training"],
  ["v-nyakú", "v-neck"], ["garbó nyakú", "turtleneck"], ["a-vonalú", "a-line"], ["egyvállas", "one shoulder"], ["rozéarany", "rose gold"],
  ["gyöngyház", "mother of pearl"], ["virágmintás", "floral"], ["mikroszálas", "microfiber"], ["kompressziós", "compression"],
  ["smaragdzöld", "emerald green"], ["mentazöld", "mint green"], ["mustársárga", "mustard yellow"], ["teveszínű", "camel"],
  ["égkék", "sky blue"], ["púder", "powder pink"], ["szatén", "satin"], ["viszkóz", "viscose"], ["bordázott", "ribbed"],
  ["átlapolt", "wrap"], ["bársony", "velvet"], ["pántos", "strappy"], ["modál", "modal"], ["kasmír", "cashmere"], ["merinó", "merino"],
  ["hálós", "mesh"], ["mintás", "print"], ["vékony", "thin"], ["kötésű", "knit"], ["kötős", "tie"], ["nyári", "summer"],
  ["elegáns", "elegant"], ["medálos", "pendant"], ["csipkés", "lace"], ["termó", "thermal"], ["acél", "steel"], ["műbőr", "faux leather"],
  ["angóra", "angora"], ["zománcos", "enamel"], ["nyakú", "neck"], ["ujjú", "sleeve"], ["alakú", ""], ["garbó", "turtleneck"],
  ["síkabát", "ski jacket"], ["túrabakancs", "hiking boots"], ["blézer", "blazer"], ["aláöltözet", "base layer"],
  ["búváróra", "diver watch"], ["koktélóra", "cocktail time watch"],
  ["vállra ejtett", "off shoulder"], ["koktél", "cocktail"], ["karika", "hoop"], ["tűsarkú", "stiletto"], ["minimalista", "minimalist"],
  ["kantáros", "dungaree"], ["pléd", "blanket"], ["tüll", "tulle"], ["len", "linen"], ["vászon", "canvas"], ["telitalpú", "platform"],
  ["magassarkú", "heels"], ["balerina", "ballet flats"], ["bokacsizma", "ankle boots"], ["trikó", "tank top"], ["kismama", "maternity"],
  ["magas derekú", "high waist"], ["hosszú ujjú", "long sleeve"], ["rövid ujjú", "short sleeve"],
  ["pulóver", "sweater"], ["pulcsi", "sweater"], ["kapucnis", "hoodie"], ["póló", "t-shirt"], ["ing", "shirt"], ["nadrág", "pants"],
  ["farmer", "jeans"], ["kabát", "jacket"], ["dzseki", "jacket"], ["mellény", "vest"], ["cipő", "shoes"], ["csizma", "boots"],
  ["bakancs", "boots"], ["papucs", "slides"], ["szandál", "sandals"], ["sapka", "cap"], ["kalap", "hat"], ["táska", "bag"],
  ["öv", "belt"], ["óra", "watch"], ["sál", "scarf"], ["kendő", "bandana"], ["szoknya", "skirt"], ["ruha", "dress"], ["blúz", "blouse"],
  ["kardigán", "cardigan"], ["overál", "jumpsuit"], ["body", "bodysuit"], ["ékszer", "jewelry"], ["gyűrű", "ring"], ["zokni", "socks"],
  ["pénztárca", "wallet"], ["logós", "logo"], ["kötött", "knit"], ["bőr", "leather"], ["pamut", "cotton"], ["gyapjú", "wool"],
  ["selyem", "silk"], ["vászon", "linen"], ["ujjatlan", "sleeveless"], ["csíkos", "striped"], ["kockás", "plaid"], ["virágos", "floral"],
  ["pöttyös", "polka dot"], ["hosszú", "long"], ["rövid", "short"], ["bő", "wide"], ["szűk", "slim"], ["női", "women"], ["férfi", "men"],
  ["fekete", "black"], ["fehér", "white"], ["szürke", "grey"], ["sötétkék", "navy"], ["világoskék", "light blue"], ["kék", "blue"],
  ["piros", "red"], ["bordó", "burgundy"], ["zöld", "green"], ["sárga", "yellow"], ["barna", "brown"], ["bézs", "beige"],
  ["rózsaszín", "pink"], ["lila", "purple"], ["narancs", "orange"], ["krém", "cream"], ["olíva", "olive"], ["ezüst", "silver"], ["arany", "gold"],
];
// a magyar ragos alakokat is elkapjuk (pl. "pulóverek"), de csak szó elején egyeztetünk
const FORDITAS_RE = FORDITAS.map(([hu, en]) => [new RegExp("(^|[\\s/,(-])" + hu.replace(/ /g, "\\s+") + "[a-záéíóöőúüű]*(?=$|[\\s/,)-])", "gi"), en]);
function keresoSzoveg(q) {
  let s = " " + String(q || "") + " ";
  FORDITAS_RE.forEach(([re, en]) => { s = s.replace(re, "$1" + en); });
  // összetett szavak, amik nincsenek a listában: a szó végén álló ruhanév számít (pl. "valamitáska" -> "bag")
  s = s.replace(/[a-záéíóöőúüű]{3,}(pulóver|póló|dzseki|kabát|nadrág|sapka|táska|cipő|csizma|szoknya|mellény|ruha)[a-záéíóöőúüű]*/gi,
    (_, tipus) => (FORDITAS.find(([hu]) => hu === tipus.toLowerCase()) || [, tipus])[1]);
  return s.replace(/["'’„”]/g, " ").replace(/\s+/g, " ").trim();
}
// tartalék keresés: márka (első szó) + az utolsó lefordított ruhaszó
const TIPUS_SZAVAK = new Set(FORDITAS.map(([, en]) => en));
function egyszerubb(q) {
  const s = keresoSzoveg(q);
  const szavak = s.split(" ");
  const tipus = [...TIPUS_SZAVAK].filter((t) => (" " + s + " ").includes(" " + t + " ")).pop();
  return tipus ? (szavak[0] !== tipus ? szavak[0] + " " : "") + tipus : "";
}

// --- a katalógus termékeinek képei (megjegyezve) ---
// a gyorsítótárban: kép címe (string), vagy { nincs: időpont } – a sikertelen keresést 7 nap múlva újrapróbáljuk
const NINCS_UJRA_MS = 7 * 24 * 60 * 60 * 1000;
function cacheErtek(v) {
  if (typeof v === "string" && v) return { van: true, url: v };
  if (v && typeof v === "object" && Date.now() - (v.nincs || 0) < NINCS_UJRA_MS) return { van: true, url: null };
  return { van: false };
}

// egy termék képe: előbb a lefordított teljes névvel, aztán egyszerűbben
async function termekKep(q) {
  const k1 = keresoSzoveg(q);
  let t = (await search(k1, 5))[0];
  if (!t) {
    const k2 = egyszerubb(q);
    if (k2 && k2 !== k1) t = (await search(k2, 5))[0];
  }
  // órák (pl. "Rolex Submariner"): a nevükben nincs "óra", ezért az óra-ékszer kategóriában is keresünk
  if (!t) t = (await search(k1, 5, "281"))[0];
  return t ? t.imageEbay : null;
}
let cache = null;
function cacheBetolt() {
  if (cache) return cache;
  try { cache = fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) : {}; } catch (e) { cache = {}; }
  return cache;
}
let mentesIdozito = null;
function cacheMent() {
  if (mentesIdozito) return;
  mentesIdozito = setTimeout(() => {
    mentesIdozito = null;
    try { fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1)); } catch (e) { console.log("ebay-kepek.json mentése: " + e.message); }
  }, 1000);
}

// items: [{ key, q }] – visszaadja: { key: képcím vagy null }
async function katalogusKepek(items) {
  const c = cacheBetolt();
  const out = {};
  const kell = [];
  items.forEach((it) => {
    const key = String(it.key || "").slice(0, 120);
    if (!key) return;
    const ce = cacheErtek(c[key]);
    if (ce.van) out[key] = ce.url ? proxyUrl(ce.url) : null;
    else kell.push({ key, q: String(it.q || "").slice(0, 100) });
  });
  // egyszerre legfeljebb 4 keresés
  let i = 0;
  const munkas = async () => {
    while (i < kell.length) {
      const it = kell[i++];
      try {
        const nyers = await termekKep(it.q);
        c[it.key] = nyers || { nincs: Date.now() };
        out[it.key] = nyers ? proxyUrl(nyers) : null;
      } catch (e) {
        if (e.kod === "invalid_client" || e.kod === "not_configured") throw e;
        out[it.key] = null; // most nem sikerült: nem jegyezzük meg, legközelebb újra próbáljuk
      }
    }
  };
  await Promise.all([munkas(), munkas(), munkas(), munkas()]);
  cacheMent();
  return out;
}

// A katalógus képeit a szerver a saját lemezére is elmenti (server/ebay-kepcache/),
// így mindenki – bármelyik gépről, bármelyik fiókkal – akkor is látja őket, ha az
// eBay-hirdetés közben megszűnik, és nem kell minden megnyitáskor az eBay-től kérni.
const crypto = require("crypto");
const KEP_MAPPA = path.join(__dirname, "ebay-kepcache");
const KEP_TIPUS = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };
function kepFajl(url) {
  const kit = (String(url).match(/\.(jpe?g|png|webp|gif)(?:$|\?)/i) || [, "jpg"])[1].toLowerCase().replace("jpeg", "jpg");
  return path.join(KEP_MAPPA, crypto.createHash("sha1").update(url).digest("hex") + "." + kit);
}

// kép továbbítása (csak ebayimg.com, legfeljebb 8 MB)
async function kepTovabbit(url, res) {
  if (!engedettKep(url)) {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    return res.end("nem engedett kép");
  }
  // a katalógus képe már a lemezen van: onnan adjuk
  const katalogusKep = katalogusKepE(url);
  const fajl = kepFajl(url);
  if (katalogusKep && fs.existsSync(fajl)) {
    const kit = path.extname(fajl).slice(1);
    res.writeHead(200, { "content-type": KEP_TIPUS[kit] || "image/jpeg", "cache-control": "public, max-age=2592000", "x-content-type-options": "nosniff" });
    return fs.createReadStream(fajl).pipe(res);
  }
  const r = await fetch(url);
  const tipus = r.headers.get("content-type") || "";
  if (!r.ok || !/^image\//.test(tipus)) {
    res.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    return res.end("a kép nem érhető el");
  }
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length > 8 * 1024 * 1024) {
    res.writeHead(413, { "content-type": "text/plain; charset=utf-8" });
    return res.end("túl nagy kép");
  }
  if (katalogusKep) {
    try {
      fs.mkdirSync(KEP_MAPPA, { recursive: true });
      fs.writeFileSync(fajl, buf);
    } catch (e) { /* nem baj, legközelebb újra az eBay-től kérjük */ }
  }
  res.writeHead(200, { "content-type": tipus, "cache-control": "public, max-age=604800", "x-content-type-options": "nosniff" });
  res.end(buf);
}

// a háttérbeli előtöltés a képet is lemezre menti (így az első megnyitás is gyors)
async function kepLemezre(url) {
  const fajl = kepFajl(url);
  if (fs.existsSync(fajl) || !engedettKep(url)) return;
  const r = await fetch(url);
  const tipus = r.headers.get("content-type") || "";
  if (!r.ok || !/^image\//.test(tipus)) return;
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length > 8 * 1024 * 1024) return;
  fs.mkdirSync(KEP_MAPPA, { recursive: true });
  fs.writeFileSync(fajl, buf);
}

// --- háttérbeli előtöltés: a katalógus összes termékének képe ---
// A szerver indulása után lassan (kb. 1,2 másodpercenként egy keresés) végigmegy a
// katalóguson – előbb a márkás termékeken, aztán a női alapdarabokon –, így a
// felhasználónak már kész képek jelennek meg. Ami már megvan, azt kihagyja; az eBay
// napi keretét (5000 hívás) nem lépi túl, mert legfeljebb 3500 keresést indít egy nap.
let elotoltesFut = false;
async function elotoltes(katalogusFajl) {
  if (elotoltesFut || !isConfigured()) return;
  elotoltesFut = true;
  try {
    const vm = require("vm");
    const ablak = {};
    vm.runInNewContext(fs.readFileSync(katalogusFajl, "utf8"), { window: ablak });
    const lista = [];
    (ablak.WARDRO_KATALOGUS || []).forEach((b) => (b.termekek || []).forEach((t, i) => {
      lista.push({ key: b.marka + "|" + i, q: b.generikus ? "női " + t[0] : b.marka + " " + t[0], generikus: !!b.generikus });
    }));
    lista.sort((a, b) => a.generikus - b.generikus);
    const c = cacheBetolt();
    // 1) a már megtalált képek, amik még nincsenek a lemezen (ez nem eBay API-hívás)
    const lemezre = lista.filter((it) => typeof c[it.key] === "string" && !fs.existsSync(kepFajl(c[it.key])));
    if (lemezre.length) console.log("eBay: " + lemezre.length + " katalóguskép mentése a szerver lemezére…");
    for (const it of lemezre) {
      try { await kepLemezre(c[it.key]); } catch (e) { /* legközelebb újra */ }
      await new Promise((r) => setTimeout(r, 250));
    }
    // 2) a még kép nélküli termékek keresése (eBay API) és a kép mentése
    const hianyzik = lista.filter((it) => !cacheErtek(c[it.key]).van);
    if (!hianyzik.length) return;
    console.log("eBay: " + hianyzik.length + " katalógustermék képét töltöm le a háttérben…");
    let db = 0, talalt = 0;
    for (const it of hianyzik.slice(0, 3500)) {
      if (cacheErtek(c[it.key]).van) continue; // közben a felületről már lekérték
      try {
        const nyers = await termekKep(it.q);
        c[it.key] = nyers || { nincs: Date.now() };
        if (nyers) {
          talalt++;
          try { await kepLemezre(nyers); } catch (e) { /* a továbbításkor is elmentjük */ }
        }
      } catch (e) {
        if (e.kod === "invalid_client" || e.kod === "not_configured") break;
      }
      db++;
      if (db % 50 === 0) { cacheMent(); console.log("eBay: " + db + " / " + hianyzik.length + " kész (" + talalt + " képpel)"); }
      await new Promise((r) => setTimeout(r, 1200));
    }
    cacheMent();
    console.log("eBay: előtöltés kész – " + talalt + " / " + db + " termékhez van kép.");
  } catch (e) {
    console.log("eBay előtöltés: " + e.message);
  } finally {
    elotoltesFut = false;
  }
}

// a már letöltött katalógusképek (a felület egyszerre kéri le, bejelentkezés nélkül is):
// { key: az eBay-kép útvonala a https://i.ebayimg.com/ után }
const EBAYIMG = "https://i.ebayimg.com/";
function osszesKatalogusKep() {
  const c = cacheBetolt();
  const out = {};
  Object.keys(c).forEach((k) => {
    if (typeof c[k] === "string" && c[k].startsWith(EBAYIMG)) out[k] = c[k].slice(EBAYIMG.length);
  });
  return out;
}

// a kép a katalógus gyorsítótárában van-e (ezeket bejelentkezés nélkül is továbbítjuk)
let cacheUrlek = null, cacheUrlekMeret = -1;
function katalogusKepE(url) {
  const c = cacheBetolt();
  const meret = Object.keys(c).length;
  if (!cacheUrlek || meret !== cacheUrlekMeret) {
    cacheUrlek = new Set(Object.values(c).filter((v) => typeof v === "string"));
    cacheUrlekMeret = meret;
  }
  return cacheUrlek.has(url);
}

module.exports = { isConfigured, status, search, katalogusKepek, kepTovabbit, elotoltes, keresoSzoveg, osszesKatalogusKep, katalogusKepE };
