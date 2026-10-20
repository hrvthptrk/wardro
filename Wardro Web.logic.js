// Ez a "Wardro Web.dc.html" logikája, a sablon <script data-dc-script>
// tartalma volt eredetileg, csak kiszervezve ebbe a fájlba.
window.__dcLogic = window.__dcLogic || {};
window.__dcLogic["Wardro Web"] = function (DCLogic, StreamableLogic, React) {

// ADATOK (mintaadatok) - ezt csak a demó-nézet használja (?start=app / firstLaunch),
// amikor még nem jelentkeztél be ténylegesen. Valódi fiókkal belépve ehelyett
// a backendről (server/index.js, ruhatar adatbázis) jövő adatok jelennek meg.
// Férfi kategóriák: kategórianév -> { items: a kategória ruhái,
//   notes: { ruha indexe: "utoljára viselve" megjegyzés } }
const MALE = {
  'Pólók': { items: ['szürke póló', 'fehér póló', 'sötétkék póló', 'csíkos póló', 'fekete póló', 'vászon póló', 'olívzöld póló', 'rozsdaszín póló'], notes: { 3: '7 hónapja nem viselted', 6: '4 hónapja nem viselted' } },
  'Cipők': { items: ['fehér sneaker', 'velúrbakancs', 'futócipő', 'mokaszin', 'szandál', 'chelsea csizma'], notes: { 3: '6 hónapja nem viselted' } },
  'Kabátok': { items: ['olívzöld bomberdzseki', 'farmerdzseki', 'gyapjúkabát', 'esőkabát', 'blézer', 'mellény'], notes: { 4: '1 éve nem viselted' } },
  'Kiegészítők': { items: ['bőr karóra', 'barna öv', 'napszemüveg', 'pénztárca', 'sapka', 'füles táska'], notes: {} },
  'Nadrágok': { items: ['kék farmer', 'szürke jogging', 'chino nadrág', 'fekete farmer', 'kordbársony nadrág', 'rövidnadrág'], notes: { 4: '9 hónapja nem viselted' } },
};

// Női kategóriák (ugyanaz a szerkezet, mint a férfiaknál)
const FEMALE = {
  'Felsők': { items: ['fehér blúz', 'csíkos póló', 'vászoning', 'fekete garbó', 'selyem ingblúz'], notes: { 3: '4 hónapja nem viselted' } },
  'Topok': { items: ['selyem top', 'rövidített póló', 'fekete body', 'bordázott crop top', 'szatén pántos top'], notes: { 4: '5 hónapja nem viselted' } },
  'Pulóverek és kardigánok': { items: ['kötött pulóver', 'kardigán', 'kasmír garbó', 'oversize kardigán'], notes: { 0: '7 hónapja nem viselted' } },
  'Nadrágok': { items: ['kék farmer', 'széles szárú nadrág', 'leggings', 'szabott rövidnadrág'], notes: {} },
  'Szoknyák': { items: ['pliszírozott szoknya', 'farmerszoknya', 'bézs midi szoknya', 'fekete bőrhatású miniszoknya', 'szatén slip szoknya'], notes: { 3: '9 hónapja nem viselted' } },
  'Ruhák': { items: ['fekete kombiné ruha', 'virágos midi ruha', 'vászon nyári ruha', 'kötött ruha', 'csavart ruha', 'ingruha'], notes: { 4: '1 éve nem viselted' } },
  'Cipők': { items: ['fehér sportcipő', 'bokacsizma', 'balerinacipő', 'blokksarkú cipő', 'szandál', 'mokaszin'], notes: { 3: '6 hónapja nem viselted' } },
  'Sálak és kendők': { items: ['selyemsál', 'kockás gyapjúsál', 'selyem hajkendő'], notes: {} },
  'Ékszerek': { items: ['arany karika fülbevaló', 'gyöngy nyaklánc', 'vékony ezüst karkötő'], notes: {} },
  'Kiegészítők': { items: ['füles táska', 'bőröv', 'napszemüveg', 'barett sapka'], notes: {} },
};

// Előre elkészített outfitek nemenként (alkalom, évszak, ruhadarabok, viselési infó)
const OUTFITS = {
  Male: [
    { name: 'Hétfői irodai', occasion: 'Munka', season: 'Hideg', top: 'vászoning', bottom: 'chino nadrág', shoes: 'mokaszin', extra: 'barna öv', pieces: 'Vászoning · Chino nadrág · Mokaszin · Barna öv', worn: 'viselve 6×, legutóbb hétfőn' },
    { name: 'Szombati séta', occasion: 'Hétvége', season: 'Enyhe', top: 'szürke póló', bottom: 'kék farmer', shoes: 'fehér sneaker', extra: 'bőr karóra', pieces: 'Szürke póló · Kék farmer · Fehér sneaker · Karóra', worn: 'viselve 11×, legutóbb szombaton' },
    { name: 'Vacsora étteremben', occasion: 'Program', season: 'Hideg', top: 'fekete póló', bottom: 'fekete farmer', shoes: 'chelsea csizma', extra: 'gyapjúkabát', pieces: 'Fekete póló · Fekete farmer · Chelsea csizma · Kabát', worn: 'kétszer viselve, legutóbb múlt hónapban' },
  ],
  Female: [
    { name: 'Hétfői irodai', occasion: 'Munka', season: 'Hideg', top: 'fehér blúz', bottom: 'széles szárú nadrág', shoes: 'mokaszin', extra: 'bőröv', pieces: 'Fehér blúz · Széles szárú nadrág · Mokaszin · Öv', worn: 'viselve 6×, legutóbb hétfőn' },
    { name: 'Szombati séta', occasion: 'Hétvége', season: 'Enyhe', top: 'csíkos póló', bottom: 'farmerszoknya', shoes: 'fehér sportcipő', extra: 'füles táska', pieces: 'Csíkos póló · Farmerszoknya · Sportcipő · Táska', worn: 'viselve 11×, legutóbb szombaton' },
    { name: 'Vacsora étteremben', occasion: 'Program', season: 'Hideg', top: 'fekete garbó', bottom: 'pliszírozott szoknya', shoes: 'bokacsizma', extra: 'arany karika fülbevaló', pieces: 'Garbó · Pliszírozott szoknya · Bokacsizma · Fülbevaló', worn: 'kétszer viselve, legutóbb múlt hónapban' },
  ],
};

// Minta fotófájlok a "Hozzáadás" képernyő beejtés-szimulációjához
// (kamerák így nevezik el a fájlokat, ezért maradnak angol/technikai formátumúak)
const DROP_FILES = ['IMG_4192.HEIC', 'IMG_4193.HEIC', 'IMG_4194.HEIC', 'IMG_4195.HEIC', 'IMG_4196.HEIC', 'IMG_4197.HEIC'];

// Ruhához választható címkék (anyag, szín, évszak) - mindkét módban ugyanaz
const TAG_OPTIONS = ['Pamut', 'Gyapjú', 'Vászon', 'Semleges', 'Élénk', 'Hideg hónapok', 'Meleg hónapok', 'Egész évben'];
// Alapértelmezett címkék (új ruháknál / ha még nincs beállítva)
const DEFAULT_TAGS = ['Pamut', 'Semleges', 'Egész évben'];

// Naptárhoz: helyi idő szerinti nap "ÉÉÉÉ-HH-NN" alakban (nem toISOString,
// mert az UTC-re vált, és éjfél körül rossz napot adna)
const dayKey = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const MONTH_NAMES = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
const WEEKDAY_NAMES = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];
const WEEKDAY_SHORT = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];

// Színtémák (a színeket a Wardro Temak.css :root[data-theme] blokkjai adják).
// A minták itt szándékosan fix színkódok: a választóban mindig a saját
// témájuk színeit kell mutatniuk, bármelyik téma is aktív éppen.
// minták sorrendje: kiemelő szín, háttér, felület, szöveg (a választó előnézete ebből rajzol)
const THEMES = [
  { key: 'ejjel', label: 'Éjjel', hint: 'Grafit sötét, lime kiemeléssel', dark: true, swatches: ['#C8F169', '#0F0F11', '#17171A', '#E4E4E7'] },
  { key: 'rubin', label: 'Rubin', hint: 'Mély bordó sötét, piros kiemeléssel', dark: true, swatches: ['#FF5468', '#140B0D', '#1F1215', '#EFE2E4'] },
  { key: 'ocean', label: 'Óceán', hint: 'Éjkék sötét, türkiz kiemeléssel', dark: true, swatches: ['#4CD3F5', '#0A1018', '#111A26', '#E1E8F0'] },
  { key: 'erdo', label: 'Erdő', hint: 'Fenyőzöld sötét, friss zöld kiemeléssel', dark: true, swatches: ['#7BDC8F', '#0B110D', '#131C16', '#E2EAE3'] },
  { key: 'ametiszt', label: 'Ametiszt', hint: 'Sötét lila, levendula kiemeléssel', dark: true, swatches: ['#BC94FF', '#100C17', '#191322', '#E9E3F1'] },
  { key: 'homok', label: 'Homok', hint: 'Lágy, meleg világos – nem vakít', dark: false, swatches: ['#D9531E', '#E9E5DE', '#F3F0EA', '#2A2520'] },
  { key: 'rozsa', label: 'Rózsa', hint: 'Púderes rózsaszín, piros kiemeléssel', dark: false, swatches: ['#D2304C', '#EEE3E3', '#F6EEEE', '#2E1D20'] },
  { key: 'zsalya', label: 'Zsálya', hint: 'Nyugodt, halvány zöld világos', dark: false, swatches: ['#2E8A57', '#E3E9E2', '#EFF3EE', '#1F2A22'] },
  { key: 'kontraszt', label: 'Erős kontraszt', hint: 'Fekete-fehér, a legjobban olvasható', dark: false, swatches: ['#1F45FF', '#E8E8E8', '#F7F7F7', '#141414'] },
];
// --- Termékkatalógus (katalogus.js) ---
// A "Keresés márkák között" fül adatai: márka + terméknév + típus.
const KATALOGUS = (window.WARDRO_KATALOGUS || []).flatMap((b) =>
  b.termekek.map(([nev, tipus, sajatBg, sajatFg], i) => ({
    key: b.marka + '|' + i, marka: b.marka, nev, tipus, bg: sajatBg || b.bg, fg: sajatFg || b.fg, generikus: !!b.generikus,
  })));
const KAT_MARKAK = (window.WARDRO_KATALOGUS || []).map((b) => b.marka);
// egy márka színei a címkéhez (a katalógusból; ismeretlen márkánál semleges, sötét címke)
const markaSzin = (marka) => {
  const m = String(marka || '').trim().toLowerCase();
  const b = m && (window.WARDRO_KATALOGUS || []).find((x) => !x.generikus && x.marka.toLowerCase() === m);
  return b ? { bg: b.bg, fg: b.fg } : { bg: 'rgba(15,15,18,.72)', fg: '#FFFFFF' };
};
// szűrő-chipek: a részletes típusokat pár nagy csoportba soroljuk
const KAT_CSOPORT = {
  'Cipő': 'Cipő', 'Póló': 'Felső', 'Ing': 'Felső', 'Felső': 'Felső', 'Pulóver': 'Pulóver', 'Kabát': 'Kabát',
  'Nadrág': 'Nadrág', 'Rövidnadrág': 'Nadrág', 'Szoknya': 'Szoknya', 'Ruha': 'Ruha', 'Táska': 'Táska',
  'Sapka': 'Kiegészítő', 'Öv': 'Kiegészítő', 'Óra': 'Kiegészítő', 'Napszemüveg': 'Kiegészítő', 'Sál': 'Sál és kendő',
  'Pénztárca': 'Kiegészítő', 'Kiegészítő': 'Kiegészítő',
  // női típusok
  'Top': 'Top', 'Body': 'Top', 'Blúz': 'Felső', 'Overál': 'Ruha', 'Kardigán': 'Pulóver', 'Leggings': 'Nadrág',
  'Kendő': 'Sál és kendő', 'Ékszer': 'Ékszer', 'Női cipő': 'Cipő',
};
// egy eBay-találat típusa a címéből (német / angol / magyar kulcsszavak) – a KAT_CSOPORT kulcsai közül
const EBAY_TIPUS = [
  ['Cipő', /sneaker|schuh|shoe|boot|stiefel|trainer|loafer|sandal|slipper|pumps|cipő|csizma/i],
  ['Rövidnadrág', /shorts|bermuda|rövidnadr/i],
  ['Nadrág', /jeans|hose\b|pants|trousers|chino|jogger|nadrág|farmer/i],
  ['Szoknya', /skirt|\brock\b|szoknya/i],
  ['Ruha', /dress|kleid|\bruha\b/i],
  ['Kabát', /jacke|jacket|coat|mantel|parka|blazer|weste|vest|kabát|dzseki/i],
  ['Pulóver', /hoodie|sweat|pullover|sweater|strick|cardigan|pulóver/i],
  ['Ing', /hemd|\bshirt\b(?!.*t-shirt)|button.?down|\bing\b/i],
  ['Póló', /t-?shirt|\btee\b|polo|póló/i],
  ['Táska', /tasche|bag\b|rucksack|backpack|handbag|táska/i],
  ['Sapka', /mütze|cap\b|beanie|\bhat\b|sapka/i],
  ['Óra', /\buhr\b|watch|óra/i],
  ['Napszemüveg', /sonnenbrille|sunglasses|napszemüveg/i],
  ['Öv', /gürtel|belt|\böv\b/i],
  ['Sál', /schal|scarf|\bsál\b/i],
];
const ebayTipus = (cim) => (EBAY_TIPUS.find(([, re]) => re.test(cim)) || ['Felső'])[0];
// női ruhatípusok: férfi fióknál ezek (és a márka nélküli női alapdarabok) nem látszanak a katalógusban
const KAT_NOI_TIPUSOK = new Set(['Szoknya', 'Ruha', 'Top', 'Body', 'Blúz', 'Overál', 'Leggings', 'Kendő', 'Ékszer', 'Női cipő']);
const KAT_CSOPORTOK = ['Cipő', 'Felső', 'Top', 'Pulóver', 'Kabát', 'Nadrág', 'Szoknya', 'Ruha', 'Táska', 'Sál és kendő', 'Ékszer', 'Kiegészítő'];
// a termék típusából kitaláljuk, melyik saját kategóriába illik (a kategóriák
// nevét a felhasználó szabadon adja meg, ezért kulcsszavakkal keresünk)
const KAT_KATEGORIA_MINTA = {
  'Cipő': /cip|sneaker|láb|csizm|bakancs|shoe|boot/i,
  'Felső': /pól|felső|ing\b|ingek|top|shirt/i,
  'Pulóver': /pul[cóo]|felső|hoodie|sweat/i,
  'Kabát': /kab[áa]t|dzsek|jacket|coat|felső/i,
  'Nadrág': /nadr|farmer|jean|pant|alsó|short/i,
  'Ruha': /ruh[áa]|szokny|dress|skirt|alsó/i,
  'Top': /top|body|felső|pól/i,
  'Szoknya': /szokny|skirt|alsó/i,
  'Sál és kendő': /sál|kendő|kieg/i,
  'Ékszer': /ékszer|bizsu|kieg/i,
  'Táska': /tásk|bag|kieg/i,
  'Kiegészítő': /kieg|accessor|sapk|öv|óra|szemüveg/i,
};
const katNormal = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const katKategoria = (tipus, kategoriak) => {
  const minta = KAT_KATEGORIA_MINTA[KAT_CSOPORT[tipus] || 'Kiegészítő'];
  return kategoriak.find((n) => minta && minta.test(n)) || '';
};
// a ruhára kerülő "fotó": márkaszínű kártya a névvel (PNG, a fotókkal azonos úton mentjük)
const katKartya = (t) => new Promise((resolve) => {
  const c = document.createElement('canvas');
  c.width = 600; c.height = 800;
  const g = c.getContext('2d');
  g.fillStyle = t.bg; g.fillRect(0, 0, 600, 800);
  const fenyes = g.createRadialGradient(470, 120, 20, 470, 120, 520);
  fenyes.addColorStop(0, 'rgba(255,255,255,.14)'); fenyes.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = fenyes; g.fillRect(0, 0, 600, 800);
  g.fillStyle = t.fg;
  g.globalAlpha = .7; g.font = '600 26px "Instrument Sans", sans-serif';
  g.fillText(t.tipus.toUpperCase(), 48, 80);
  g.globalAlpha = 1; g.font = '700 76px Oswald, "Instrument Sans", sans-serif';
  // a hosszú márkanevet és terméknevet sorokra tördeljük
  const tord = (szoveg, max) => {
    const sorok = []; let sor = '';
    szoveg.split(' ').forEach((sz) => {
      const proba = sor ? sor + ' ' + sz : sz;
      if (g.measureText(proba).width > max && sor) { sorok.push(sor); sor = sz; } else { sor = proba; }
    });
    if (sor) sorok.push(sor);
    return sorok;
  };
  const markaSorok = tord(t.marka.toUpperCase(), 504);
  let y = 800 - 60;
  g.font = '500 36px "Instrument Sans", sans-serif';
  const nevSorok = tord(t.nev, 504).slice(0, 3);
  for (let i = nevSorok.length - 1; i >= 0; i--) { g.fillText(nevSorok[i], 48, y); y -= 48; }
  y -= 18;
  g.font = '700 76px Oswald, "Instrument Sans", sans-serif';
  for (let i = markaSorok.length - 1; i >= 0; i--) { g.fillText(markaSorok[i], 48, y); y -= 80; }
  c.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : ''), 'image/png');
});

// --- Háttér-eltávolítás ---
// Teljesen a böngészőben fut (kulcs és regisztráció nélkül). Első használatkor
// letölti a modellt (kb. 40 MB), utána a böngésző gyorsítótárából jön.
let hatterModul = null;
const hatterEltavolit = async (blob) => {
  if (!hatterModul) hatterModul = import('https://esm.sh/@imgly/background-removal@1.4.5');
  const mod = await hatterModul.catch((e) => { hatterModul = null; throw e; });
  return mod.removeBackground(blob, { output: { format: 'image/webp', quality: 0.9 } });
};

// --- Próbababa: melyik ruha hová kerül ---
// A kategóriák nevét a felhasználó adja meg, ezért kulcsszavakkal döntünk.
const BABA_HELYEK = ['kabat', 'felso', 'also', 'cipo', 'kieg'];
const BABA_HELY_NEV = { kabat: 'Kabát', felso: 'Felső', also: 'Alsó', cipo: 'Cipő', kieg: 'Kiegészítő' };
const HELY_MINTA = [
  ['cipo', /cip|sneaker|láb|csizm|bakancs|papucs|shoe|boot|balerin|szandál|loafer|espadrille|mokaszin/i],
  ['kabat', /kab[áa]t|dzsek|jacket|coat|parka|mellény/i],
  ['also', /nadr|farmer|jean|pant|alsó|short|szokny|skirt|leggings/i],
  ['felso', /pól|felső|ing\b|ingek|top|shirt|pul[cóo]|hoodie|sweat|blúz|ruh[aá]|body|kardig|overál|jumpsuit|garbó/i],
  ['kieg', /kieg|tásk|accessor|sapk|öv|óra|szemüveg|bag|ékszer|sál|kendő|fülbeval|nyaklánc|karkötő|karperec|gyűrű|hajcsat|bross|bizsu/i],
];
const helyOf = (kat) => (HELY_MINTA.find(([, re]) => re.test(kat || '')) || ['kieg'])[0];
// egy darab helye: elsősorban a kategóriája alapján, ha abból nem derül ki, a neve alapján
const helyDarab = (d) => {
  const kat = HELY_MINTA.find(([, re]) => re.test(d.cat || ''));
  if (kat) return kat[0];
  const nev = HELY_MINTA.find(([, re]) => re.test(d.label || ''));
  return nev ? nev[0] : 'kieg';
};
// Outfit-összeállító: melyik helyre milyen darabok valók (a próbababa felismerése alapján)
const SLOT_HELY = { top: ['felso'], bottom: ['also'], shoes: ['cipo'], extra: ['kieg', 'kabat'] };
const SLOT_CIM = { top: 'Felsők', bottom: 'Alsók', shoes: 'Cipők', extra: 'Kabátok és kiegészítők' };
// a hely darabjai; ha egy sem illik (pl. szokatlan kategórianevek), minden darab választható marad
const slotSzur = (slotKey, darabok) => {
  const helyek = SLOT_HELY[slotKey];
  if (!helyek) return { darabok, mind: true };
  const x = darabok.filter((d) => helyek.includes(helyDarab(d)));
  return x.length ? { darabok: x, mind: false } : { darabok, mind: true };
};
// a próbababa kis címkéi (a "Kiegészítő" nem fér el)
const BABA_CIMKE = { kabat: 'Kabát', felso: 'Felső', also: 'Alsó', cipo: 'Cipő', kieg: 'Extra' };
// darabok: [{ label, cat, photoUrl, kivagott }] -> helyenként egy darab a próbababára
// --- Próbababa: hol van a ruha a fotón? ---
// Minden fotón egyszer megmérjük a ruha befoglaló téglalapját (kivágott fotón az
// átlátszóság, sima fotón a háttértől – a kép szélének színétől – eltérő pixelek
// alapján). Ezzel a ruhát pontosan a baba megfelelő részére lehet illeszteni:
// a póló válla a vállra, a nadrág szárai a lábakra kerülnek.
const KEP_KERET = new Map(); // src -> { x, y, w, h } (0..1 arányok) | null, amíg mérjük
let kepKeretFrissit = null; // a komponens állítja be: mérés után újrarajzol
const keretSzamol = (img) => {
  const N = 160;
  const arany = img.naturalWidth / img.naturalHeight || 1;
  const cw = arany >= 1 ? N : Math.max(8, Math.round(N * arany));
  const ch = arany >= 1 ? Math.max(8, Math.round(N / arany)) : N;
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0, cw, ch);
  const px = g.getImageData(0, 0, cw, ch).data;
  let atlatszo = 0;
  for (let i = 3; i < px.length; i += 4) if (px[i] < 20) atlatszo++;
  const alfa = atlatszo > cw * ch * 0.03;
  // sima fotó: a háttér színe a kép szélének mediánja
  let hr = 0, hg = 0, hb = 0;
  if (!alfa) {
    const r = [], gg = [], b = [];
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      if (x > 1 && x < cw - 2 && y > 1 && y < ch - 2) continue;
      const i = (y * cw + x) * 4; r.push(px[i]); gg.push(px[i + 1]); b.push(px[i + 2]);
    }
    const med = (t) => t.sort((p, q) => p - q)[t.length >> 1];
    hr = med(r); hg = med(gg); hb = med(b);
  }
  const ruha = (i) => (alfa ? px[i + 3] > 40 : Math.abs(px[i] - hr) + Math.abs(px[i + 1] - hg) + Math.abs(px[i + 2] - hb) > 54);
  const oszlop = new Array(cw).fill(0), sor = new Array(ch).fill(0);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    if (ruha((y * cw + x) * 4)) { oszlop[x]++; sor[y]++; }
  }
  // a zajt (egy-egy elszórt pixel) és a vékony kiálló részeket (vállfa kampója,
  // címke, árnyék) kihagyjuk: a széleken csak a kellően széles sorok / oszlopok számítanak
  const maxSor = Math.max(...sor), maxOszlop = Math.max(...oszlop);
  const xs = oszlop.map((n, i) => (n > Math.max(ch * 0.03, maxOszlop * 0.12) ? i : -1)).filter((i) => i >= 0);
  const ys = sor.map((n, i) => (n > Math.max(cw * 0.03, maxSor * 0.22) ? i : -1)).filter((i) => i >= 0);
  if (!xs.length || !ys.length) return { x: 0, y: 0, w: 1, h: 1, alfa, biztos: false };
  // ar: a kép szélesség / magasság aránya (a talált folt valódi arányához, pl. oldalnézeti cipő)
  const k = { x: xs[0] / cw, y: ys[0] / ch, w: (xs[xs.length - 1] - xs[0] + 1) / cw, h: (ys[ys.length - 1] - ys[0] + 1) / ch, alfa, ar: cw / ch };
  // mennyire tömör a talált folt: ha a téglalap nagy része háttér, vagy majdnem az egész
  // kép, akkor sima fotón nem bízunk a felismerésben (pl. mintás padló, fal)
  let benne = 0;
  for (let y = ys[0]; y <= ys[ys.length - 1]; y++) for (let x = xs[0]; x <= xs[xs.length - 1]; x++) if (ruha((y * cw + x) * 4)) benne++;
  const tomor = benne / ((xs[xs.length - 1] - xs[0] + 1) * (ys[ys.length - 1] - ys[0] + 1));
  k.biztos = alfa || (tomor > 0.45 && k.w * k.h < 0.85 && k.w * k.h > 0.08);
  return k;
};
const kepKeret = (src) => {
  if (!src) return null;
  if (KEP_KERET.has(src)) return KEP_KERET.get(src);
  KEP_KERET.set(src, null);
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try { KEP_KERET.set(src, keretSzamol(img)); } catch (e) { KEP_KERET.set(src, { x: 0, y: 0, w: 1, h: 1 }); }
    if (kepKeretFrissit) kepKeretFrissit();
  };
  img.src = src;
  return null;
};
// hová kerüljön a ruha a helyén belül (a hely téglalapjának arányaiban): a nyak, a csukló
// és a boka miatt nem a teljes téglalap, hanem a ruha tényleges része
// Hová kerül a kivágott ruha a helyén belül (a hely arányaiban). A magasság rögzített: a felső a
// vállától épp a nadrág derékpántjáig ér (kicsit takarja), a nadrág a derékig ér fel és a bokáig le.
// A szélesség a ruha saját arányaiból jön (wMin..wMax között), és középre kerül – így nem nyúlik el.
// zr: a hely szélessége / magassága a baba egységeiben (lásd Wardro Temak.css 14.)
const BABA_CEL = {
  felso: { y: 0.05, h: 0.9, wMin: 0.7, wMax: 0.97, zr: 140 / 176 },
  ruha: { y: 0.04, h: 0.94, wMin: 0.55, wMax: 0.9, zr: 160 / 290 },
  kabat: { y: 0.03, h: 0.93, wMin: 0.7, wMax: 0.97, zr: 152 / 232 },
  also: { y: 0.01, h: 0.94, wMin: 0.62, wMax: 0.8, zr: 100 / 182 },
  short: { y: 0.01, h: 0.42, wMin: 0.62, wMax: 0.8, zr: 100 / 182 },
  szoknya: { y: 0.01, h: 0.56, wMin: 0.62, wMax: 0.94, zr: 100 / 182 },
};
// a fotó mérete és helye: a ruha (k = a körvonala a fotón) a célterületre kerül, arányosan
const babaIllesztes = (k, t) => {
  const ga = (k.w * (k.ar || 1)) / k.h; // a ruha szélesség / magasság aránya a fotón
  const w = Math.max(t.wMin, Math.min(t.wMax, t.h * ga / t.zr));
  const x = (1 - w) / 2;
  const iw = w / k.w, ih = t.h / k.h;
  return {
    iw: (iw * 100).toFixed(2) + '%',
    ih: (ih * 100).toFixed(2) + '%',
    il: ((x - k.x * iw) * 100).toFixed(2) + '%',
    it: ((t.y - k.y * ih) * 100).toFixed(2) + '%',
  };
};

// a darab formája a babán (a ruhaforma-maszkot választja, lásd Wardro Temak.css 14.)
const babaForma = (h, d) => {
  const x = ((d.label || '') + ' ' + (d.cat || '')).toLowerCase();
  if (h === 'felso') {
    if (/\bruha|ruhák|dress|overál|jumpsuit/.test(x)) return 'is-v-ruha';
    if (/\btop\b|topok|trikó|atléta|\bbody|crop|ujjatlan|tank/.test(x)) return 'is-v-ujjatlan';
    if (/pul[cóo]|hoodie|kapucnis|sweat|ing\b|ingek|kardig|garbó|blúz|hosszú ujj|longsleeve|kötött|melegítő/.test(x)) return 'is-v-hosszu';
    return 'is-v-polo';
  }
  if (h === 'also') {
    if (/szokny|skirt/.test(x)) return 'is-v-szoknya';
    if (/rövidnadr|short|bermuda/.test(x)) return 'is-v-short';
    return 'is-v-nadrag';
  }
  return '';
};
const babaAdat = (darabok) => {
  const b = {};
  BABA_HELYEK.forEach((h) => { b[h] = { src: '', nev: '', cls: 'is-ures', cim: BABA_CIMKE[h], szin: '', iw: '', ih: '', il: '', it: '', bg: '' }; });
  darabok.forEach((d) => {
    const h = helyDarab(d);
    if (b[h].nev) return; // helyenként az első darab
    const sz = styDarabSzin(d);
    const forma = babaForma(h, d);
    // a fotón mért ruha a baba megfelelő részére illesztve (a kiegészítő egészben marad)
    const mert = d.photoUrl && h !== 'kieg' ? kepKeret(d.photoUrl) : null;
    // csak a háttér nélküli (átlátszó) fotóknál bízunk a körvonalban: sima fotón a fal, a
    // padló könnyen a ruhához számít – ott marad a szabásminta közepére nagyított kép
    const k = mert && mert.biztos && mert.alfa && h !== 'cipo' ? mert : null;
    // a kivágott, illesztett ruha is a szabásmintába kerül: a mintán kívüli részeket a
    // ruha színe tölti ki, így a forma mindig egységes, rajta a ruha valódi mintájával
    const mintaba = !!k;
    // cipő: fotóként (párban) csak akkor, ha a kivágott kép tisztán egy oldalnézeti cipő (széles folt);
    // ha a fotón doboz, láb vagy több cipő is van, cipőformát kap a saját színében, a fotó csak mintaként
    const cipoPar = h === 'cipo' && d.kivagott && !!mert && mert.alfa && (mert.w * (mert.ar || 1)) / mert.h >= 1.35;
    const cipoMinta = h === 'cipo' && !!d.photoUrl && !cipoPar;
    const celKulcs = forma === 'is-v-ruha' ? 'ruha' : forma === 'is-v-short' ? 'short' : forma === 'is-v-szoknya' ? 'szoknya' : h;
    const ill = k && BABA_CEL[celKulcs] ? babaIllesztes(k, BABA_CEL[celKulcs]) : { iw: '', ih: '', il: '', it: '' };
    b[h] = { src: d.photoUrl || '', nev: d.label, cim: BABA_CIMKE[h],
      // fotó nélkül a darab a saját színében jelenik meg
      szin: d.szinHex || SZIN_LISTA[sz] || '',
      ...ill,
      // kivágott cipő: a fotó kétszer látszik (bal és jobb cipő), az egyik a háttérképből
      bg: cipoPar ? 'url("' + d.photoUrl + '")' : '',
      cls: [d.photoUrl ? '' : 'is-nincsfoto', d.kivagott && !mintaba && !cipoMinta ? 'is-kivagott' : '', mintaba ? 'is-alfa' : '', forma, k ? 'is-illesztett' : '',
        cipoPar ? 'is-par' : '', cipoMinta ? 'is-cipo-minta' : ''].filter(Boolean).join(' ') };
  });
  return b;
};

// --- "Mit vegyek fel ma?" ---
// egyszerű, ismételhető véletlenszám-generátor (ugyanazzal a maggal ugyanazt adja)
const prng = (mag) => () => {
  mag = (mag + 0x6D2B79F5) | 0;
  let t = Math.imul(mag ^ (mag >>> 15), 1 | mag);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
// Darabonként pontozunk: minél régebben viselted, annál előrébb kerül (a rég
// nem hordott ruhák így újra előkerülnek), egy kis véletlennel, hogy a
// "Másikat" gomb tényleg mást adjon. Hűvös időben kabát is kerül rá.
const napiOutfit = (darabok, idojaras, mag) => {
  const rnd = prng(mag * 7919 + 17);
  const most = Date.now();
  const pont = (d) => {
    const nap = d.lastWornAt ? (most - d.lastWornAt) / 864e5 : 45;
    return Math.min(nap, 120) + rnd() * 40 - (d.wornToday ? 60 : 0);
  };
  const valasztas = [];
  // színharmónia: ha már van egy élénk szín, egy másik élénk szín kevesebb pontot kap
  const szinPotlek = (d) => {
    if (!d.szin || SEMLEGES_SZIN.has(d.szin)) return 0;
    const elenk = valasztas.map((x) => x.szin).filter((x) => x && !SEMLEGES_SZIN.has(x));
    return elenk.length && !elenk.includes(d.szin) ? -45 : 0;
  };
  const legjobb = (h) => darabok.filter((d) => helyDarab(d) === h)
    .map((d) => ({ d, p: pont(d) + szinPotlek(d) })).sort((a, b) => b.p - a.p)[0];
  const fok = idojaras && typeof idojaras.tempC === 'number' ? idojaras.tempC : null;
  const helyek = ['felso', 'also', 'cipo'];
  if (fok !== null && fok < 16) helyek.unshift('kabat');
  helyek.forEach((h) => { const x = legjobb(h); if (x) valasztas.push(x.d); });
  const kieg = legjobb('kieg');
  if (kieg && rnd() < 0.5) valasztas.push(kieg.d);
  return { darabok: valasztas, fok };
};
// --- Színfelismerés ---
// A fotót 64×64-esre kicsinyítjük, és megkeressük a leggyakoribb színt.
// Kivágott (átlátszó hátterű) fotónál csak a ruha pixeleit nézzük; sima
// fotónál a kép közepét, és kihagyjuk a háttérhez (a szélekhez) hasonló pixeleket.
const SZIN_LISTA = {
  'fekete': '#1c1c1c', 'sötétszürke': '#4a4a4a', 'szürke': '#8c8c8c', 'világosszürke': '#c8c8c8', 'fehér': '#f4f4f2',
  'bézs': '#d8c3a5', 'barna': '#7a5230', 'khaki': '#8f8a5e', 'olíva': '#6b6b2a', 'sötétzöld': '#2f4f3a', 'zöld': '#3f9a4f',
  'türkiz': '#2bb5b0', 'farmerkék': '#4a6a92', 'világoskék': '#9cc4e8', 'kék': '#2f6fd0', 'sötétkék': '#1f2a4a',
  'lila': '#7a4fb0', 'rózsaszín': '#f2a7c0', 'piros': '#d0302f', 'bordó': '#6e1e2a', 'narancs': '#e87a2a', 'sárga': '#e8c52a',
};
// ezek a "semleges" színek: bármivel jól mennek
const SEMLEGES_SZIN = new Set(['fekete', 'sötétszürke', 'szürke', 'világosszürke', 'fehér', 'bézs', 'barna', 'khaki', 'farmerkék', 'sötétkék', 'olíva']);
const szinNevRgb = (r, g, b) => {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B), l = (max + min) / 2, d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) h = max === R ? 60 * (((G - B) / d) % 6) : (max === G ? 60 * ((B - R) / d + 2) : 60 * ((R - G) / d + 4));
  if (h < 0) h += 360;
  if (l < 0.13) return 'fekete';
  if (l > 0.88 && s < 0.3) return 'fehér';
  if (s < 0.12) return l > 0.7 ? 'világosszürke' : (l < 0.32 ? 'sötétszürke' : 'szürke');
  if (h < 12 || h >= 345) return l < 0.3 ? 'bordó' : (l > 0.72 ? 'rózsaszín' : 'piros');
  if (h < 40) return l < 0.38 ? 'barna' : (s < 0.5 && l > 0.55 ? 'bézs' : 'narancs');
  if (h < 68) return s < 0.35 ? (l > 0.6 ? 'bézs' : 'khaki') : (l < 0.38 ? 'olíva' : 'sárga');
  if (h < 165) return s < 0.25 ? (l > 0.35 ? 'khaki' : 'sötétzöld') : (l < 0.3 ? 'sötétzöld' : (h < 95 && l < 0.45 ? 'olíva' : 'zöld'));
  if (h < 195) return 'türkiz';
  if (h < 255) {
    if (h >= 200 && h < 235 && s < 0.45 && l > 0.25 && l < 0.62) return 'farmerkék';
    return l < 0.3 ? 'sötétkék' : (l > 0.68 ? 'világoskék' : 'kék');
  }
  if (h < 290) return 'lila';
  return l > 0.55 ? 'rózsaszín' : 'lila';
};
const szinFelismer = async (url) => {
  const img = await new Promise((ok, hiba) => {
    const i = new Image(); i.crossOrigin = 'anonymous';
    i.onload = () => ok(i); i.onerror = () => hiba(new Error('kép nem tölthető be')); i.src = url;
  });
  const N = 64, c = document.createElement('canvas'); c.width = N; c.height = N;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0, N, N);
  const px = g.getImageData(0, 0, N, N).data;
  let atlatszo = 0;
  for (let i = 3; i < px.length; i += 4) if (px[i] < 20) atlatszo++;
  const kivagott = atlatszo > N * N * 0.05;
  // háttérszín becslése a kép szélei alapján (sima fotónál)
  let hr = 0, hg = 0, hb = 0, hn = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (x > 2 && x < N - 3 && y > 2 && y < N - 3) continue;
    const i = (y * N + x) * 4; hr += px[i]; hg += px[i + 1]; hb += px[i + 2]; hn++;
  }
  hr /= hn; hg /= hn; hb /= hn;
  const vodrok = {};
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = (y * N + x) * 4, r = px[i], gg = px[i + 1], b = px[i + 2];
    if (px[i + 3] < 128) continue;
    if (!kivagott) {
      if (x < N * 0.2 || x > N * 0.8 || y < N * 0.15 || y > N * 0.85) continue;
      if (Math.abs(r - hr) + Math.abs(gg - hg) + Math.abs(b - hb) < 60) continue; // háttér
    }
    const k = (r >> 5) + ',' + (gg >> 5) + ',' + (b >> 5);
    const v = vodrok[k] || (vodrok[k] = { n: 0, r: 0, g: 0, b: 0 });
    v.n++; v.r += r; v.g += gg; v.b += b;
  }
  const legjobb = Object.values(vodrok).sort((a, b) => b.n - a.n)[0];
  if (!legjobb) return null;
  const r = Math.round(legjobb.r / legjobb.n), gg = Math.round(legjobb.g / legjobb.n), b = Math.round(legjobb.b / legjobb.n);
  const hex = '#' + [r, gg, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return { nev: szinNevRgb(r, gg, b), hex };
};
// Színharmónia egy outfitre: hány "élénk" (nem semleges) szín van benne, és ütik-e egymást
const UTKOZO_SZINEK = [['piros', 'rózsaszín'], ['piros', 'narancs'], ['narancs', 'rózsaszín'], ['piros', 'zöld'], ['lila', 'narancs'], ['sárga', 'rózsaszín'], ['bordó', 'narancs']];
const szinHarmonia = (darabok) => {
  const szinek = darabok.map((d) => d.szin).filter(Boolean);
  if (!szinek.length) return { szoveg: '', cls: '' };
  const elenk = [...new Set(szinek.filter((x) => !SEMLEGES_SZIN.has(x)))];
  if (!elenk.length) return { szoveg: 'Semleges, letisztult színek: ez mindig működik.', cls: 'is-jo' };
  if (elenk.length === 1) return { szoveg: 'Egy kiemelt szín (' + elenk[0] + ') semleges alapon: jó választás.', cls: 'is-jo' };
  if (elenk.length === 2) {
    const utkozik = UTKOZO_SZINEK.some(([a, b]) => elenk.includes(a) && elenk.includes(b));
    return utkozik
      ? { szoveg: 'A ' + elenk[0] + ' és a ' + elenk[1] + ' ütheti egymást. Az egyiket érdemes semlegesre cserélni.', cls: 'is-figyelj' }
      : { szoveg: 'Két szín (' + elenk.join(', ') + '): merész, de működhet.', cls: 'is-jo' };
  }
  return { szoveg: 'Sok élénk szín (' + elenk.join(', ') + '). Érdemes egyet-kettőt semlegesre cserélni.', cls: 'is-figyelj' };
};
const szinPont = (nev, hex) => hex || SZIN_LISTA[nev] || '';

const ftForma = (n) => Math.round(n).toLocaleString('hu-HU') + ' Ft';
// új jelszó erőssége: { cls, label, w } a kis csíkhoz az űrlap alatt
const jelszoErosseg = (pw) => {
  if (!pw) return { cls: 'is-ures', label: 'Legalább 8 karakter', w: '0%' };
  let p = 0;
  if (pw.length >= 8) p++;
  if (pw.length >= 12) p++;
  if (/[a-záéíóöőúüű]/.test(pw) && /[A-ZÁÉÍÓÖŐÚÜŰ]/.test(pw)) p++;
  if (/\d/.test(pw)) p++;
  if (/[^A-Za-z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/.test(pw)) p++;
  if (pw.length < 8) return { cls: 'is-gyenge', label: 'Túl rövid – még ' + (8 - pw.length) + ' karakter', w: '15%' };
  if (p <= 2) return { cls: 'is-gyenge', label: 'Gyenge jelszó', w: '35%' };
  if (p === 3) return { cls: 'is-kozepes', label: 'Közepes jelszó', w: '65%' };
  return { cls: 'is-eros', label: 'Erős jelszó', w: '100%' };
};
// másodperc -> "15 perc" / "1 óra 30 perc" (a zárolás hátralévő idejéhez)
const percSzoveg = (mp) => {
  const p = Math.max(1, Math.ceil((Number(mp) || 60) / 60));
  if (p < 60) return p + ' perc';
  return Math.floor(p / 60) + ' óra' + (p % 60 ? ' ' + (p % 60) + ' perc' : '');
};
const maiMag = () => { const d = new Date(); return d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate(); };

// ==========================================================================
// MOSÁSI CÍMKE
// Darabonként: mosási hőfok, szárítógép, vasalás, fehérítő, vegytisztítás és
// anyag. A címkét le lehet fotózni: a szövegét (pl. „30°”, „do not tumble
// dry”, „100% cotton”) szövegfelismeréssel (Tesseract.js) kiolvassuk, és ezzel
// előtöltjük az űrlapot – a jeleket (szimbólumokat) koppintással lehet javítani.
// Ha nincs címke megadva, a darab típusa, anyaga és színe alapján becsülünk.
// ==========================================================================
const CARE_SOROK = [
  { k: 'mosas', cim: 'Mosás', opts: [['30', '30°'], ['40', '40°'], ['60', '60°'], ['90', '90°'], ['kezi', 'Kézi'], ['tilos', 'Nem mosható']] },
  { k: 'szarito', cim: 'Szárítógép', opts: [['igen', 'Mehet'], ['alacsony', 'Kímélő'], ['tilos', 'Tilos']] },
  { k: 'vasalas', cim: 'Vasalás', opts: [['1', '• alacsony'], ['2', '•• közepes'], ['3', '••• magas'], ['tilos', 'Tilos']] },
  { k: 'feherito', cim: 'Fehérítő', opts: [['igen', 'Mehet'], ['tilos', 'Tilos']] },
  { k: 'vegyi', cim: 'Vegytisztítás', opts: [['igen', 'Mehet'], ['tilos', 'Tilos']] },
];
const CARE_MOSAS_NEV = { 30: '30°', 40: '40°', 60: '60°', 90: '90°', kezi: 'Kézi mosás', tilos: 'Nem mosható' };
// a címke rövid összefoglalója chipekben
const careChipek = (c) => {
  if (!c) return [];
  const out = [];
  if (c.mosas) out.push({ label: c.mosas === 'tilos' ? 'Nem mosható' : (c.mosas === 'kezi' ? 'Kézi mosás' : c.mosas + '°-on mosható'), cls: 'is-fo' });
  if (c.szarito) out.push({ label: c.szarito === 'tilos' ? 'Szárítógép: tilos' : (c.szarito === 'alacsony' ? 'Szárítógép: kímélő' : 'Szárítógép: mehet'), cls: c.szarito === 'tilos' ? 'is-tilos' : '' });
  if (c.vasalas) out.push({ label: c.vasalas === 'tilos' ? 'Vasalás: tilos' : 'Vasalás: ' + '•'.repeat(Number(c.vasalas)), cls: c.vasalas === 'tilos' ? 'is-tilos' : '' });
  if (c.feherito) out.push({ label: c.feherito === 'tilos' ? 'Fehérítő: tilos' : 'Fehérítő: mehet', cls: c.feherito === 'tilos' ? 'is-tilos' : '' });
  if (c.vegyi) out.push({ label: c.vegyi === 'tilos' ? 'Vegytisztítás: tilos' : 'Vegytisztítható', cls: c.vegyi === 'tilos' ? 'is-tilos' : '' });
  if (c.anyag) out.push({ label: c.anyag, cls: 'is-anyag' });
  return out;
};
// becslés, ha nincs megadott címke: a darab neve, címkéi, anyaga és színe alapján
const careBecsles = (d) => {
  const sz = styNorm((d.label || '') + ' ' + (d.cat || '') + ' ' + (d.tags || []).join(' '));
  const h = helyDarab(d);
  if (h === 'cipo' || h === 'kieg') return null;
  if (/selyem|gyapju|kasmir|merino|alpaka|angora|csipke|silk|wool|cashmere/.test(sz)) return { mosas: 'kezi', szarito: 'tilos' };
  if (h === 'kabat') return { mosas: '30', szarito: 'tilos' };
  if (/farmer|jean|denim/.test(sz)) return { mosas: '30', szarito: 'alacsony' };
  if (/sport|edzo|futo|leggings|melegito|fitness|dry ?fit/.test(sz)) return { mosas: '30', szarito: 'tilos' };
  if (/viszkoz|viscose|szatén|szaten|blúz|bluz|ruha|kotott|kardigan|pulover|pulcsi/.test(sz)) return { mosas: '30', szarito: 'tilos' };
  const szin = styDarabSzin(d);
  if ((szin === 'fehér') && /pamut|polo|ing|cotton|zokni|alsone|torolkoz/.test(sz)) return { mosas: '60', szarito: 'igen' };
  return { mosas: '40', szarito: 'alacsony' };
};
// a darab tényleges (megadott vagy becsült) mosási adatai
const careDarab = (d, sajat) => {
  const c = sajat || d.care || null;
  if (c && c.mosas) return { ...c, becsult: false };
  const b = careBecsles(d);
  return b ? { ...(c || {}), ...b, becsult: true } : (c ? { ...c, becsult: false } : null);
};
// a felismert címkeszövegből: { care, talalt: [...] }
const CARE_ANYAGOK = [
  [/(cotton|baumwolle|coton|algodon|cotone|pamut|bavlna|bawelna)/, 'pamut'], [/(polyester|poliester|poliészter|poliiszter|polyest)/, 'poliészter'],
  [/(elastan|elasthan|spandex|lycra|elasztan)/, 'elasztán'], [/(wool|wolle|laine|lana|gyapju|vlna|welna)/, 'gyapjú'],
  [/(viscose|viskose|viscosa|viszkoz|viskoza|wiskoza)/, 'viszkóz'], [/(linen|leinen|\blin\b|lino|\blen\b|lan)/, 'len'],
  [/(silk|seide|soie|seta|selyem|hedvab|jedwab)/, 'selyem'], [/(polyamid|polyamide|nylon|poliamid)/, 'poliamid'],
  [/(acryl|acrylic|akril|acrilic)/, 'akril'], [/(cashmere|kaschmir|kasmir)/, 'kasmír'], [/(modal)/, 'modal'], [/(lyocell|tencel)/, 'liocell'],
];
const careOcrErtelmez = (nyers) => {
  const t = ' ' + String(nyers || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[º˚]/g, '°').replace(/\s+/g, ' ') + ' ';
  const c = {};
  const talalt = [];
  // hőfok: „30°”, „30 °c”, „max 40”, „40c”; a 95-öt 90-nek vesszük
  const fokok = [];
  const fokRe = /(?:max\.?\s*)?\b(30|40|50|60|90|95)\s*(?:°|o\b|c\b|grad|fok)/g;
  let m;
  while ((m = fokRe.exec(t))) fokok.push(Number(m[1]));
  const maxRe = /max\.?\s*(30|40|60|90|95)\b/g;
  while ((m = maxRe.exec(t))) fokok.push(Number(m[1]));
  if (/(hand ?wash|kezi mos|handwasch|lavage a la main|lavar a mano|lavare a mano|pranie reczne|prat v ruce)/.test(t)) c.mosas = 'kezi';
  else if (/(do not wash|ne moss|nicht waschen|ne pas laver|no lavar|non lavare)/.test(t)) c.mosas = 'tilos';
  else if (fokok.length) {
    const f = Math.min(...fokok.map((x) => (x >= 90 ? 90 : x === 50 ? 40 : x)));
    c.mosas = String(f);
  }
  if (/(do not tumble|no tumble|ne szaritsa|ne szaritogep|nicht im trockner|nicht trocknergeeignet|ne pas secher en tambour|no usar secadora|non asciugare)/.test(t)) c.szarito = 'tilos';
  else if (/(tumble dry low|low heat|kimelo szarit|schonend trocknen)/.test(t)) c.szarito = 'alacsony';
  else if (/(tumble dry|szaritogepben szarithato|trocknergeeignet)/.test(t)) c.szarito = 'igen';
  if (/(do not iron|ne vasald|ne vasalja|nicht bugeln|ne pas repasser|no planchar|non stirare)/.test(t)) c.vasalas = 'tilos';
  else if (/(iron low|cool iron|low iron|alacsony hofokon vasal)/.test(t)) c.vasalas = '1';
  else if (/(iron medium|warm iron|medium iron)/.test(t)) c.vasalas = '2';
  else if (/(iron high|hot iron|high iron)/.test(t)) c.vasalas = '3';
  if (/(do not bleach|no bleach|ne feheritsd|ne feheritse|nicht bleichen|ne pas blanchir|no usar lejia|non candeggiare)/.test(t)) c.feherito = 'tilos';
  if (/(do not dry ?clean|ne vegytisztitsd|ne vegytisztitsa|nicht chemisch|ne pas nettoyer a sec|no limpiar en seco)/.test(t)) c.vegyi = 'tilos';
  else if (/(dry ?clean only|csak vegytisztit|nur chemisch|nettoyage a sec uniquement)/.test(t)) { c.vegyi = 'igen'; if (!c.mosas) c.mosas = 'tilos'; }
  // anyagösszetétel: „60% cotton 40% polyester”, „cotton 100%”
  // a „60% cotton” és a „cotton 60%” alak közül azt fogadjuk el, amelyikből több anyag jön ki
  const anyagKeres = (re, szamI, szoI) => {
    const lista = [];
    let x;
    while ((x = re.exec(t))) {
      const p = Number(x[szamI]);
      const a = CARE_ANYAGOK.find(([r]) => r.test(x[szoI]));
      if (a && p > 0 && p <= 100 && !lista.some((y) => y[1] === a[1])) lista.push([p, a[1]]);
    }
    return lista;
  };
  const elol = anyagKeres(/(\d{1,3})\s*%\s*([a-z]+)/g, 1, 2);
  const hatul = anyagKeres(/([a-z]+)\s*(\d{1,3})\s*%/g, 2, 1);
  const anyagok = hatul.length > elol.length ? hatul : elol;
  if (anyagok.length) c.anyag = anyagok.sort((a, b) => b[0] - a[0]).map(([p, n]) => p + '% ' + n).join(', ');
  // ha a hőfok nem olvasható, az anyagból becsülünk (ezt nem soroljuk a "felismert" közé)
  if (c.mosas) talalt.push(CARE_MOSAS_NEV[c.mosas]);
  if (c.szarito) talalt.push(c.szarito === 'tilos' ? 'szárítógép tilos' : 'szárítógép ' + (c.szarito === 'alacsony' ? 'kímélő' : 'mehet'));
  if (c.vasalas) talalt.push(c.vasalas === 'tilos' ? 'vasalás tilos' : 'vasalás ' + '•'.repeat(Number(c.vasalas)));
  if (c.feherito) talalt.push('fehérítő tilos');
  if (c.vegyi) talalt.push(c.vegyi === 'tilos' ? 'vegytisztítás tilos' : 'csak vegytisztítás');
  if (c.anyag) talalt.push(c.anyag);
  if (!c.mosas && anyagok.length) {
    const fo = anyagok[0][1];
    if (/gyapjú|selyem|kasmír/.test(fo)) c.mosas = 'kezi';
    else if (/viszkóz|poliamid|elasztán|akril|modal|liocell/.test(fo)) c.mosas = '30';
    else c.mosas = '40';
  }
  return { care: c, talalt };
};
// Tesseract.js betöltése csak akkor, amikor tényleg kell (a CDN-ről, egyszer)
let tesseractIgeret = null;
const tesseractBetolt = () => tesseractIgeret || (tesseractIgeret = new Promise((ok, hiba) => {
  if (window.Tesseract) return ok(window.Tesseract);
  const sc = document.createElement('script');
  sc.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
  sc.async = true;
  sc.onload = () => (window.Tesseract ? ok(window.Tesseract) : hiba(new Error('nincs Tesseract')));
  sc.onerror = () => { tesseractIgeret = null; hiba(new Error('a szövegfelismerő nem tölthető be')); };
  document.head.appendChild(sc);
}));
// a fotó kicsinyítése (és a szövegfelismeréshez szürkeárnyalat + kontraszt)
const kepCanvas = async (file, max, szurke) => {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, hiba) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => hiba(new Error('a kép nem nyitható meg')); i.src = url; });
    const arany = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(img.naturalWidth * arany));
    c.height = Math.max(1, Math.round(img.naturalHeight * arany));
    const g = c.getContext('2d', { willReadFrequently: !!szurke });
    if (szurke) g.filter = 'grayscale(1) contrast(1.6)';
    g.drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally { URL.revokeObjectURL(url); }
};
const fajlValaszt = (kamera) => new Promise((ok) => {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'image/*';
  if (kamera) inp.setAttribute('capture', 'environment');
  inp.onchange = () => ok(inp.files && inp.files[0] ? inp.files[0] : null);
  inp.click();
});

// ==========================================================================
// "MEGVEGYEM?" – VÁSÁRLÁSI SEGÉD
// A boltban lefotózod a ruhát; megnézzük, hány meglévő darabodhoz illik
// (színharmónia + kiegészítő helyek), van-e már hasonló, és mennyibe kerülne
// egy viselése a saját viselési szokásaid alapján. Ebből lesz az ítélet.
// ==========================================================================
const VS_HELYEK = [['felso', 'Felső'], ['also', 'Alsó'], ['cipo', 'Cipő'], ['kabat', 'Kabát'], ['kieg', 'Kiegészítő']];
// melyik helyekkel alkot outfitet az új darab
const VS_PAROK = { felso: ['also', 'cipo', 'kabat'], also: ['felso', 'cipo', 'kabat'], cipo: ['felso', 'also'], kabat: ['felso', 'also'], kieg: ['felso', 'also', 'cipo'] };
// egy év alatt átlagosan ennyiszer hordunk egy darabot (ha a saját adataidból még nem tudjuk)
const VS_ALAP_VISELES = { felso: 26, also: 40, cipo: 70, kabat: 45, kieg: 35 };
// két szín mennyire megy együtt: 1 = jól, 0.5 = merész, 0 = üti egymást
const vsSzinIllik = (a, b) => {
  if (!a || !b) return 0.7;
  if (SEMLEGES_SZIN.has(a) || SEMLEGES_SZIN.has(b) || a === b) return 1;
  if (UTKOZO_SZINEK.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) return 0;
  return 0.5;
};
const hexTav = (a, b) => {
  if (!a || !b || a.length < 7 || b.length < 7) return 999;
  const p = (h, i) => parseInt(h.slice(i, i + 2), 16);
  return Math.abs(p(a, 1) - p(b, 1)) + Math.abs(p(a, 3) - p(b, 3)) + Math.abs(p(a, 5) - p(b, 5));
};

// v2: az alapértelmezett téma "ejjel" lett; a régi kulcson tárolt érték
// többnyire csak a korábbi alapértelmezés volt, ezért azt nem vesszük át
const THEME_STORE_KEY = 'wardro-theme-v2';
const DEFAULT_THEME = 'ejjel';
// beállítja az oldalon a témát, és megjegyzi ezen a gépen (így a
// bejelentkező képernyő is ezzel jelenik meg legközelebb)
const applyTheme = (key) => {
  const theme = THEMES.some((t) => t.key === key) ? key : DEFAULT_THEME;
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(THEME_STORE_KEY, theme); } catch (e) { /* privát mód stb. - nem baj */ }
};

// Alapállapot: ezt állítja vissza a bejelentkezés / "Reset all" a DEMÓ nézetben.
// (nézet, kijelölés, kategória, szűrő, keresés, outfit-összeállító mezői, eltávolítottak stb.)
const BASE = { view: 'wardrobe', cat: 'All', sel: null, worn: {}, hidden: [], favs: [], oi: 0, filter: 'Összes', q: '', drops: [], dropCats: {}, deleted: [], names: {}, tags: {}, moved: {}, catNames: {}, editOpen: false, editName: '', editTags: [], editCat: '', added: [], fresh: false, bName: '', bOcc: '', bSeason: '', bPicks: {}, bSlot: '', savedCount: 0, addedCats: [], newCat: '', lastGone: '', pairOpen: false, paired: false, phoneCount: 0, purged: [],
  // A saját összeállított outfitek nemenként KÜLÖN listában élnek (Férfinál és Nőnél
  // más a kategória-készlet, ezért egy Férfi outfit Nőnél nem is értelmezhető ugyanúgy).
  madeByGender: { Male: [], Female: [] },
  // Telefonos párosítás (QR-kódos fotóküldés) – a backend session állapota tükröződik ide
  pairToken: '', qrSvgUrl: '', pairPhoneUrl: '', pairExpiresAt: 0, pairError: '', phonePhotos: {} };

// ==========================================================================
// STYLIST – SZÖVEGÉRTÉS
// Saját írású, összetett mondatokat is értelmez (pl. „esős időben megyek egy
// drága étterembe, de ne legyen fekete”). Lépések:
//  1. normalizálás: kisbetű, ékezetek nélkül; a vesszők / mondatvégek
//     tagmondat-határként megmaradnak (a tagadás nem lép át rajtuk)
//  2. szavakra bontás; a magyar ragok miatt szótő-előtaggal egyeztetünk
//     („étterembe” → „etterem”), hosszabb szavaknál 1 elírást is elnézünk
//  3. kulcsszó-szótár: minden találat súlyozott jelzést ad (alkalom, stílus,
//     elegancia-szint, időjárás, kényelem, árnyalat, színpaletta, esemény…);
//     a szleng és az angol kifejezések is benne vannak („comfy”, „date night”)
//  4. erősítés / gyengítés: „nagyon elegáns”, „kicsit lazább”, „kevésbé sötét”,
//     „ne legyen túl elegáns” (= csak kicsit visszafogottabb)
//  5. tagadás: „ne / nem / nincs / se / utálom / kerüld … X”, „X nélkül”,
//     „X helyett”, „X ne legyen”, „inkább Y, mint X”, „vedd le a kabátot”
//  6. színek, ruhadarabok és ezek párosai („kék ing”, „fekete bőr dzseki”),
//     hőfok számmal vagy betűvel („huszonöt fok”), napok („holnap”, „szombaton”)
// ==========================================================================
const styNorm = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9°\-\s]/g, ' ').replace(/\s+/g, ' ').trim();

// két szó távolsága (hány betűt kell cserélni / törölni / beszúrni)
const styTav = (a, b) => {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  let elo = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(elo[j] + 1, cur[j - 1] + 1, elo[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    elo = cur;
  }
  return elo[n];
};

// szó illesztése egy szótőre: előtag-egyezés, vagy hosszú szónál 1 elírás
const styIllik = (szo, to) => {
  if (to.endsWith('$')) return szo === to.slice(0, -1); // pontos egyezés kell (rövid, kétértelmű szavak)
  if (szo.startsWith(to)) return true;
  // elírás-tűrés csak hosszabb szavaknál, és az első két betűnek egyeznie kell (különben túl sok a téves találat)
  return to.length >= 7 && szo.length >= to.length - 1 && szo[0] === to[0] && szo[1] === to[1] && styTav(szo.slice(0, to.length), to) <= 1;
};

// tagmondat-határ jelölő (a vesszőből, pontból… lesz; a normalizálás után is megmarad)
const STY_VESSZO = 'xhatarx';
const STY_TAGADO = new Set(['ne', 'nem', 'nincs', 'se', 'sem', 'soha', 'semmi', 'utalom', 'utalok', 'utalnam', 'gyulolom', 'kerul', 'kerulj', 'kerulnem', 'kerulnek',
  'kerulje', 'kerulnenk', 'nelkul', 'nelkule', 'tilos', 'tiltott', 'felejtsd', 'hagyd', 'hagyjuk', 'kiveve', 'nehogy', 'semmikepp', 'semmikeppen',
  'semmiesetre', 'dehogy', 'kihagy', 'kihagynam', 'kihagynek', 'mellozd', 'mellozzuk', 'kizar', 'kizarva', 'felejtos', 'nemszeretem', 'not', 'dont', 'without', 'never']);
const STY_HATAR = new Set([STY_VESSZO, 'de', 'es', 'hanem', 'viszont', 'csak', 'meg', 'inkabb', 'vagy', 'ha', 'mert', 'amikor', 'ahol', 'aztan', 'utana',
  'plusz', 'illetve', 'valamint', 'azonban', 'mig', 'mivel', 'but', 'and']);
// „X ne legyen”, „X nem kell”: a szó UTÁN álló tagadás
const STY_UTO_IGE = new Set(['legyen', 'legyenek', 'kell', 'kellene', 'kerek', 'kerem', 'akarok', 'akarom', 'szeretnek', 'szeretnem', 'jo', 'tetszik', 'hordok',
  'hordanam', 'veszek', 'vennek', 'vennem', 'nagyon', 'igazan', 'szeretem', 'birom', 'kedvelem', 'jon', 'megy']);
// „vedd le a kabátot”, „hagyd le a sapkát”
const STY_LE_IGE = new Set(['vedd', 'vegyed', 'vegyuk', 'hagyd', 'hagyjuk', 'szedd', 'tedd', 'tegyuk', 'vegyel']);

// erősítő / gyengítő szavak a kulcsszó előtt: „nagyon elegáns”, „kicsit lazább”, „kevésbé sötét”
const STY_ERO = {
  nagyon: 1.6, rettento: 1.8, iszonyu: 1.8, borzaszto: 1.8, szuper: 1.5, hiper: 1.6, abszolut: 1.7, teljesen: 1.6, totalisan: 1.7, kifejezetten: 1.5,
  kulonosen: 1.4, igazan: 1.4, tok: 1.5, full: 1.6, extra: 1.5, maximalisan: 1.8, tul: 1.5, sokkal: 1.6, jocskan: 1.4, ennyire: 1.3, annyira: 1.3,
  egyaltalan: 1.5, very: 1.6, super: 1.5, really: 1.4, eleg: 0.9, kicsit: 0.5, kicsiket: 0.5, kisse: 0.5, picit: 0.5, piciket: 0.5,
  enyhen: 0.5, valamelyest: 0.5, valamennyire: 0.6, mersekelten: 0.6, felig: 0.5, nemileg: 0.6, alig: 0.3, slightly: 0.5, kevesbe: -0.6, less: -0.6,
};

// számok betűvel (hőfokhoz): „huszonöt fok”, „mínusz öt”
const STY_SZAM_EGY = { nulla: 0, egy: 1, ket: 2, ketto: 2, harom: 3, negy: 4, ot: 5, hat: 6, het: 7, nyolc: 8, kilenc: 9 };
const STY_SZAM_TIZ = [['harminc', 30], ['negyven', 40], ['huszon', 20], ['tizen', 10], ['husz', 20], ['tiz', 10]];
const stySzam = (szo) => {
  if (/^-?\d{1,2}$/.test(szo)) return parseInt(szo, 10);
  if (STY_SZAM_EGY[szo] !== undefined) return STY_SZAM_EGY[szo];
  for (const [elo, ertek] of STY_SZAM_TIZ) {
    if (szo === elo) return ertek;
    if (szo.startsWith(elo) && STY_SZAM_EGY[szo.slice(elo.length)] !== undefined) return ertek + STY_SZAM_EGY[szo.slice(elo.length)];
  }
  return null;
};

// napok: melyik napra öltözöl (az előrejelzéshez)
const STY_NAPOK = [
  [['holnaput'], 'holnapután', 2], [['holnap'], 'holnap', 1], [['ma$', 'mai$', 'ma este', 'ma delutan', 'most$', 'mara$'], 'ma', 0],
  [['hetfo'], 'hétfőn', 'hetfo'], [['kedd'], 'kedden', 'kedd'], [['szerda', 'szerdan'], 'szerdán', 'szerda'], [['csutortok'], 'csütörtökön', 'csutortok'],
  [['pentek'], 'pénteken', 'pentek'], [['szombat'], 'szombaton', 'szombat'], [['vasarnap'], 'vasárnap', 'vasarnap'],
  [['hetvege', 'hetvegen', 'hetvegere', 'weekend'], 'hétvégén', 'hetvege'],
];
const STY_HET_NAP = { vasarnap: 0, hetfo: 1, kedd: 2, szerda: 3, csutortok: 4, pentek: 5, szombat: 6 };

// Szótár: [szótövek, hatás]. A szótövek ékezet nélkül; a „$” végű csak pontos szóra illik,
// a szóközt tartalmazó kifejezés a teljes szövegben keresendő.
// Hatások: a = alkalom, st = stílus-szavazat, f = elegancia (+ formálisabb / − lazább),
// ido = időjárás (idoGy: gyenge jel, pl. hónapnév – csak ha más nem szól az időről),
// k = kényelem, arny = sötét / világos, szin = semleges / színes, paletta = előnyben részesített színek,
// ev = különleges esemény, kabat / kieg = kabát / kiegészítő legyen-e, ritka / kedvenc / uj = melyik darabokat
// vegye elő, nt = a tagadás nem fordítja meg („ne fázzak” is meleg ruhát jelent), c = címke a visszajelzéshez
const STY_FOLD = ['barna', 'bézs', 'khaki', 'olíva'];
const STY_SZOTAR = [
  // --- munka ---
  [['iroda', 'irodai', 'munka$', 'munkaba', 'munkara', 'munkahoz', 'munkahely', 'munkam', 'munkanap', 'munkaido', 'melo', 'melohely', 'dolgoz', 'kolleg', 'cegnel', 'ceges', 'office', 'uzleti',
    'business$', 'corporate', 'irodista'], { a: 'munka', f: 1, c: 'munka' }],
  [['meeting', 'megbeszel', 'targyal', 'ugyfel', 'prezent', 'konferenc', 'tanacskoz', 'ertekezlet', 'workshop', 'fonokkel', 'fonokom', 'igazgato', 'vezetoseg',
    'board$', 'partnertalalk', 'tender'], { a: 'munka', f: 1.5, c: 'fontos megbeszélés' }],
  [['uzleti ebed', 'uzleti vacsor', 'business lunch', 'business dinner', 'munkavacsor', 'munkaebed'], { a: 'munka', f: 2, c: 'üzleti étkezés' }],
  [['allasinterj', 'interju', 'felveteli', 'job interview', 'probanap', 'elso munkanap'], { a: 'munka', f: 3, ev: 'interju', c: 'állásinterjú' }],
  [['vizsga$', 'vizsgara', 'vizsgam', 'vizsgaz', 'vizsgat', 'vizsgan', 'allamvizsga', 'zarovizsga', 'szobeli', 'erettsegi', 'vedes', 'szakdolgozat', 'diplomamunk'],
    { a: 'munka', f: 2, ev: 'vizsga', c: 'vizsga' }],
  [['eloadast tartok', 'eloadok', 'prezentalok', 'beszedet mondok', 'beszedet tartok', 'pitch', 'kiallok', 'szinpadra'], { a: 'munka', f: 2, c: 'előadás / prezentáció' }],
  [['home office', 'homeoffice', 'otthonrol dolgoz', 'tavmunk', 'remote'], { a: 'laza', f: -1.5, k: 1, c: 'home office' }],
  [['zoom', 'teams$', 'videohiv', 'videochat', 'online meeting', 'onlinemeeting', 'webkamera', 'kamera elott', 'google meet'], { a: 'munka', f: 0.5, k: 1, ev: 'video', c: 'videóhívás' }],
  [['casual friday', 'laza pentek', 'pentek iroda'], { a: 'munka', f: -0.8, st: { laza: 1 }, c: 'laza péntek' }],
  [['startup', 'kreativ iroda', 'ugynokseg', 'it ceg', 'programozo', 'fejleszto', 'coworking'], { a: 'munka', f: -0.6, st: { laza: 1 }, c: 'laza munkahely' }],
  [['ceges buli', 'ceges parti', 'ceges rendezveny', 'karacsonyi buli', 'evzaro', 'csapatepito', 'teambuilding', 'team building', 'ceges vacsor'],
    { a: 'program', f: 1, c: 'céges rendezvény' }],
  // --- elegáns programok ---
  [['etterem', 'ettermi', 'vacsor', 'bisztro', 'vendeglo', 'restaurant', 'dinner'], { a: 'program', f: 1, c: 'étterem / vacsora' }],
  [['randi', 'randev', 'randiz', 'date$', 'date night', 'udvarl', 'parommal', 'parjaval', 'pasimmal', 'csajommal', 'valentin', 'talalka'],
    { a: 'program', f: 1.2, ev: 'randi', c: 'randi' }],
  [['elso randi', 'first date'], { f: 1, c: 'első randi' }],
  [['romantikus', 'romantika', 'romantic'], { f: 1, st: { elegans: 1 }, c: 'romantikus' }],
  [['szexi', 'sexy', 'dogos', 'vonzo', 'csabit', 'hodit', 'femme fatale'], { f: 0.8, st: { elegans: 1 }, arny: 'sotet', c: 'vonzó' }],
  [['szinhaz', 'opera', 'balett', 'filharmon', 'hangverseny', 'koncertterem', 'musical', 'operett'], { a: 'program', f: 2.5, c: 'színház / opera' }],
  [['gala$', 'galara', 'galan$', 'galaest', 'galavacsor', 'estely', 'bal$', 'balra$', 'balba$', 'fogadas', 'premier', 'dij atad', 'dijatado', 'dijkioszt',
    'jotekonysag', 'charity', 'aukcio', 'hivatalos esemeny'], { a: 'program', f: 3.5, c: 'gála / estély' }],
  [['black tie', 'white tie', 'frakk', 'szmoking', 'tuxedo', 'estelyi', 'nagyestely'], { st: { elegans: 4 }, f: 4, c: 'black tie' }],
  [['eskuvo', 'eskuvoi', 'lagzi', 'lakodalom', 'menyegzo', 'wedding', 'koszorulany', 'tanu leszek', 'tanukent', 'vofely', 'polgari szertartas'],
    { a: 'program', f: 3, ev: 'eskuvo', c: 'esküvő' }],
  [['eljegyz', 'leanykero', 'kezfogo'], { a: 'program', f: 2.5, c: 'eljegyzés' }],
  [['temetes', 'gyasz', 'megemlekez', 'torra', 'torana', 'vegtisztesseg', 'vegso bucsu', 'koszoruz', 'funeral'], { a: 'program', f: 3, ev: 'temetes', arny: 'sotet', c: 'temetés' }],
  [['templom', 'mise$', 'misere', 'misen', 'keresztel', 'bermal', 'elsoaldoz', 'konfirmal', 'istentisztelet', 'zsinagog', 'mecset', 'church'],
    { a: 'program', f: 2, ev: 'templom', c: 'templom' }],
  [['evfordulo', 'jubileum', 'ballagas', 'ballagni', 'diplomaoszt', 'avatas', 'tanevnyito', 'tanevzaro', 'szalagavato', 'gyurusavat', 'prom$', 'bankett'],
    { a: 'program', f: 2, c: 'ünnepi alkalom' }],
  [['szulinap', 'szuletesnap', 'nevnap', 'unnepl', 'csaladi ebed', 'csaladi vacsor', 'birthday'], { a: 'program', f: 0.5, c: 'ünneplés' }],
  [['karacsony', 'szenteste', 'advent', 'mikulas'], { a: 'program', f: 1, ev: 'karacsony', c: 'karácsony' }],
  [['szilveszter', 'ujev$', 'ujevi', 'ujevkor'], { a: 'buli', f: 2, st: { elegans: 1 }, c: 'szilveszter' }],
  [['husvet', 'punkosd', 'hosszu hetvege'], { a: 'program', f: 0.8, c: 'ünnep' }],
  [['halloween', 'jelmez', 'farsang', 'beoltoz'], { a: 'buli', c: 'jelmezes buli' }],
  [['halloween'], { arny: 'sotet' }],
  [['legenybucsu', 'lanybucsu', 'bachelor'], { a: 'buli', f: -0.5, c: 'legény- / lánybúcsú' }],
  [['koktel', 'borkostol', 'borbar', 'rooftop', 'tetobar', 'pezsgoz', 'whisky'], { a: 'program', f: 1.5, c: 'koktélbár' }],
  [['jazz', 'zongoraest', 'piano bar'], { a: 'program', f: 1.2, c: 'jazzklub' }],
  [['muzeum', 'kiallitas', 'galeria', 'tarlat', 'vernisszazs', 'megnyito'], { a: 'program', f: 0.8, k: 0.5, c: 'kiállítás' }],
  [['kabare', 'stand up', 'standup', 'stand-up', 'comedy', 'improv'], { a: 'program', f: 0.5, c: 'stand-up / kabaré' }],
  [['vendegseg', 'vendegkent', 'meghivtak', 'meghivas', 'vacsorameghiv', 'atjonnek', 'atmegyunk'], { a: 'program', f: 0.8, c: 'vendégség' }],
  [['szuleivel', 'szuleihez', 'szuleit', 'szuleinek', 'anyosom', 'anyossal', 'apossal', 'bemutatkoz'], { a: 'program', f: 1.5, c: 'bemutatkozás a szülőknek' }],
  // --- elegancia-szintet jelző szavak ---
  [['draga$', 'dragab', 'dragan', 'pricey', 'fancy'], { f: 2, c: 'drága hely' }],
  [['luxus', 'elokelo', 'exkluziv', 'puccos', 'flancos', 'michelin', 'fine dining', 'csillagos', 'otcsillag', 'nivos', 'upscale', 'vip$', 'vip-'], { f: 2.5, c: 'előkelő hely' }],
  [['elegans', 'elegansan', 'elegansab', 'elegancia', 'elegant', 'classy', 'chic', 'sikk', 'kifinomult', 'igenyes', 'stilusos', 'nobel', 'urias', 'holgyes'],
    { st: { elegans: 3 }, f: 1.5, c: 'elegáns' }],
  [['formal', 'oltony', 'nyakkendo', 'csokornyakkendo', 'dress code', 'dresszkod', 'kiolt', 'kicsip', 'kicsinosit', 'alkalmi', 'unnepi', 'unneplo'],
    { st: { elegans: 3 }, f: 2.5, c: 'formális' }],
  [['smart casual', 'business casual', 'felelegans', 'felig elegans', 'laza elegans', 'elegans laza', 'sportelegans', 'sport elegans', 'smart$'],
    { st: { elegans: 1.5, laza: 1 }, f: 0.8, c: 'smart casual' }],
  [['csinos', 'jol akarok kinez', 'jol nezzek ki', 'jol kell kinez', 'lenyugoz', 'benyomas', 'fontos nekem', 'fontos alkalom', 'fontos nap', 'impress'],
    { f: 1, c: 'fontos, hogy jól nézz ki' }],
  [['magabiztos', 'eros benyomas', 'tekintely', 'profi', 'komolyan vegyenek', 'hatarozott', 'power', 'dominans'], { f: 1.5, st: { elegans: 1.5 }, arny: 'sotet', c: 'magabiztos' }],
  [['olcso', 'gyorsett', 'mekis', 'mcdonald', 'burger', 'kebab', 'gyros', 'bufe', 'menza', 'kifozde', 'street food', 'food truck', 'lacikonyha', 'langos'],
    { f: -1.5, c: 'laza hely' }],
  [['pizzer', 'kocsma', 'sorozo', 'kricsmi', 'romkocsma', 'pub$', 'talponallo', 'borozo'], { a: 'buli', f: -1, st: { laza: 1, street: 1 }, c: 'kocsma / pizzéria' }],
  // --- buli, szórakozás ---
  [['buli', 'parti', 'party', 'bulizn', 'klub', 'diszko', 'szorakoz', 'hazibuli', 'haziparti', 'afterparty', 'techno', 'rave', 'clubbing', 'kimozdul'], { a: 'buli', c: 'buli' }],
  [['bar$', 'barba', 'barban', 'barral', 'barokba', 'bar hopping'], { a: 'buli', f: 0.5, c: 'bár' }],
  [['tancol', 'tancest', 'tancmulat', 'tancba', 'salsa', 'bachata', 'tango', 'tanchaz', 'swing$'], { a: 'buli', f: 0.5, k: 1, c: 'táncos este' }],
  [['fesztival', 'sziget', 'volt fesztival', 'balaton sound', 'strand fesztival', 'efott', 'fezen', 'campus fesztival', 'open air'],
    { a: 'buli', st: { street: 2, laza: 1 }, k: 1.5, ev: 'fesztival', c: 'fesztivál' }],
  [['koncert', 'gig$', 'stadionkoncert', 'arena$', 'arenaba'], { a: 'buli', st: { street: 2 }, k: 1, c: 'koncert' }],
  [['meccs', 'szurkol', 'stadion', 'derbi'], { a: 'buli', st: { street: 1.5, sportos: 1 }, k: 1, c: 'meccs' }],
  [['karaoke', 'kviz', 'quiz', 'tarsasjat', 'tarsasoz', 'lan party', 'gamer', 'videojatek', 'jatekest', 'filmest', 'sorozatnez'], { a: 'laza', f: -0.8, c: 'játékos / filmes este' }],
  // --- sport, mozgás ---
  [['edzes', 'edzeni', 'edzore', 'edzesre', 'kondi', 'gym', 'konditer', 'fitnesz', 'fitness', 'crossfit', 'sulyz', 'workout', 'treningre'],
    { a: 'sport', st: { sportos: 3 }, k: 1, c: 'edzés' }],
  [['futas', 'futni', 'futok', 'futunk', 'kocog', 'jogg', 'maraton', 'felmaraton', 'terepfut', 'running'], { a: 'sport', st: { sportos: 3 }, k: 1, c: 'futás' }],
  [['joga', 'pilates', 'zumba', 'spinning', 'tancora', 'tancedz', 'tanciskol', 'tancprob', 'aerobik', 'stretching', 'nyujtas'], { a: 'sport', st: { sportos: 2.5 }, k: 1, c: 'jóga / tánc' }],
  [['foci', 'kosar', 'tenisz', 'padel', 'squash', 'roplabda', 'uszas', 'uszni', 'bicikl', 'bringa', 'kerekpar', 'gorkori', 'korcsoly', 'sport$', 'sportol', 'sportra',
    'sportpalya', 'falmasz', 'boulder', 'box$', 'boxol', 'boxedz', 'judo', 'karate', 'harcmuv', 'evez', 'kajak', 'kenu', 'roller', 'gordeszk'],
  { a: 'sport', st: { sportos: 2.5 }, k: 1, c: 'sport' }],
  [['golf'], { a: 'sport', st: { elegans: 1, sportos: 1 }, f: 0.5, c: 'golf' }],
  [['lovagl', 'lovas', 'lovarda'], { a: 'sport', st: { sportos: 1.5 }, k: 1, c: 'lovaglás' }],
  [['siel', 'sizni', 'sizes', 'si$', 'snowboard', 'sipalya', 'sitabor', 'szankoz', 'hegyi hazba'], { a: 'sport', ido: 'hideg', st: { sportos: 2 }, k: 1, ev: 'sieles', c: 'síelés' }],
  [['tura', 'turaz', 'kirandul', 'hegy', 'erdo', 'termeszet', 'kemping', 'satoraz', 'hiking', 'hike$', 'trekking', 'barlang', 'nemzeti park', 'kilato'],
    { a: 'laza', st: { sportos: 2 }, k: 2, ev: 'tura', c: 'túra / kirándulás' }],
  [['horgasz', 'vadasz', 'gombasz'], { a: 'laza', st: { sportos: 1 }, k: 1.5, f: -2, c: 'szabadtéri program' }],
  // --- laza napok ---
  [['hetvege', 'hetvegi', 'szabadnap', 'pihen', 'lazul', 'chill', 'nyugis nap', 'weekend'], { a: 'laza', f: -1, c: 'laza nap' }],
  [['seta', 'setal', 'csatangol', 'varosnez', 'belvaros', 'sightseeing'], { a: 'laza', k: 1, c: 'séta' }],
  [['varos', 'varosban', 'belvaros', 'centrum', 'kozpontba', 'downtown'], { a: 'laza', k: 0.5, c: 'város' }],
  [['kave', 'kavez', 'brunch', 'reggeliz', 'cukrasz', 'tea$', 'teazo', 'teahaz', 'fagyi', 'pekseg', 'coffee'], { a: 'laza', f: 0.3, c: 'kávézás' }],
  [['ebed', 'ebedel', 'lunch'], { a: 'laza', f: 0.3, c: 'ebéd' }],
  [['barat', 'haver', 'csajok', 'srac', 'tesoval', 'tesommal', 'tarsasag', 'spanok', 'cimbor'], { a: 'laza', c: 'barátok' }],
  [['mozi', 'bowling', 'biliard', 'escape', 'kartingoz', 'csocso', 'darts', 'lezerharc', 'paintball'], { a: 'laza', f: -0.5, c: 'mozi / szórakozás' }],
  [['bevasarl', 'shopping', 'plaza', 'piac', 'boltba', 'mall$', 'outlet', 'ikea'], { a: 'laza', k: 1, f: -0.5, c: 'bevásárlás' }],
  [['ugyintez', 'posta', 'bank$', 'bankba', 'bankban', 'okmany', 'kormanyablak', 'hivatal', 'nav$'], { a: 'laza', f: 0, k: 0.5, c: 'ügyintézés' }],
  [['orvos', 'fogorvos', 'korhaz', 'rendelo', 'patika', 'gyogyszertar', 'kontroll', 'fodrasz', 'kozmetik', 'manikur'], { a: 'laza', f: -0.3, k: 1, c: 'orvos / szépségszalon' }],
  [['egyetem', 'egyetemre', 'suli', 'iskola', 'gimi', 'eloadas', 'zh$', 'szeminar', 'orara', 'konyvtar', 'tanul', 'koli$', 'kollegium', 'campusra', 'evfolyam'],
    { a: 'laza', f: 0, c: 'egyetem / suli' }],
  [['otthon', 'itthon', 'kanape', 'netflix', 'lakasban', 'pizsam'], { a: 'laza', f: -2, k: 2, c: 'otthon' }],
  [['hazimunka', 'takarit', 'lomtalan', 'koltoz', 'festes', 'meszel', 'barkacs', 'szerelni', 'autoszerel', 'kerteszked', 'fuvagas', 'funyir', 'favag', 'udvart',
    'piszkos munka'], { a: 'laza', f: -3, k: 2, st: { sportos: 1, laza: 1 }, ev: 'hazimunka', c: 'házimunka / barkácsolás' }],
  [['csalad', 'nagyi', 'nagymam', 'nagyszul', 'szulok', 'szuleim', 'apos', 'anyos', 'anyak napja', 'apak napja', 'rokon', 'unokatestv'],
    { a: 'program', f: 0.5, c: 'családi program' }],
  [['gyerekkel', 'gyerekekkel', 'gyerekem', 'gyerekeim', 'unokaval', 'unokam', 'babaval', 'kisbaba', 'ovi$', 'oviba', 'bolcsi', 'jatszoter', 'allatkert',
    'vidampark', 'kalandpark', 'babakocsi'], { a: 'laza', k: 2, f: -1, st: { laza: 1 }, c: 'program gyerekekkel' }],
  [['kutya', 'kutyus'], { a: 'laza', k: 1.5, f: -1.5, c: 'kutyasétáltatás' }],
  [['piknik', 'grill', 'bogracs', 'kerti', 'kert$', 'kertbe', 'bbq', 'szalonnasut'], { a: 'laza', f: -1, k: 1, ev: 'kerti', c: 'kerti program' }],
  [['spa$', 'wellness', 'szauna', 'termal', 'gyogyfurdo', 'masszazs'], { a: 'laza', f: -1, k: 2, c: 'wellness' }],
  [['strand', 'medence', 'vizpart', 'tengerpart', 'balaton', 'furdo', 'aquapark', 'napoz', 'beach', 'tenger$', 'tengerre', 'tengerhez', 'part$', 'partra'],
    { a: 'laza', ido: 'meleg', f: -1.5, ev: 'strand', c: 'strand' }],
  [['hajo', 'vitorl', 'yacht', 'jacht', 'setahajo', 'komp$'], { a: 'laza', st: { laza: 1.5 }, ev: 'hajo', c: 'hajózás' }],
  [['nyaral', 'szabadsag', 'vakacio', 'holiday', 'udul', 'all inclusive'], { a: 'laza', f: -1, st: { laza: 1 }, c: 'nyaralás' }],
  [['utaz', 'repulo', 'repter', 'repul', 'airport', 'fapados', 'vonat', 'buszoz', 'busszal', 'autoz', 'roadtrip', 'hosszu ut', 'citytrip', 'city break',
    'varoslatogat', 'kiruccan', 'travel'], { a: 'laza', k: 2, ev: 'utazas', c: 'utazás' }],
  [['fotoz', 'fotoshoot', 'photoshoot', 'instagram', 'insta$', 'tiktok', 'forgatas', 'portre'], { f: 0.8, st: { street: 1 }, c: 'fotózás' }],
  // --- napszak (a tagadás itt szinte mindig a mondat másik részére vonatkozik: „nem szeretnék ma este feketét”) ---
  [['este', 'esti', 'estere', 'ejszak', 'ejjel', 'ejfel', 'night'], { f: 0.5, arny: 'sotet', nt: true, c: 'este' }],
  [['reggel', 'delelott', 'napkozben', 'delutan', 'del$', 'delben'], { nt: true, c: 'napközben' }],
  // --- hangulat ---
  [['faradt', 'kimerult', 'lusta', 'nincs kedvem', 'nincs energiam', 'masnapos', 'beteg vagyok', 'megfaztam', 'rossz napom', 'szomoru', 'nyuzott', 'almos'],
    { k: 2, st: { laza: 2 }, f: -1, c: 'nyugis, kényelmes' }],
  [['nyugodt', 'nyugis', 'relax', 'meghitt', 'cozy', 'cosy', 'komfi', 'comfy', 'puha', 'otthonos', 'hygge', 'kuckoz'], { k: 1.5, st: { laza: 2 }, f: -0.5, c: 'nyugis, kényelmes' }],
  [['kreativ', 'muveszi', 'egyedi', 'kulonleges', 'izgalmas', 'kiserletez', 'jatekos', 'fun$'], { szin: 'szines', st: { street: 1 }, c: 'kreatív, egyedi' }],
  [['vidam', 'jokedv', 'boldog', 'napsugaras', 'pozitiv', 'happy'], { szin: 'szines', c: 'vidám' }],
  [['feltunesmentes', 'ne tunjek ki', 'beolvad', 'szerenyen', 'lowkey', 'low key', 'low-key', 'quiet luxury', 'csendes luxus', 'eszrevetlen'],
    { szin: 'semleges', f: 0.3, c: 'visszafogott' }],
  [['karcsusit', 'vekonyit', 'magasit', 'alakom', 'pocak', 'hasam', 'molett', 'teltebb', 'duci', 'alacsony vagyok'], { arny: 'sotet', szin: 'semleges', c: 'karcsúsító, nyújtó hatás' }],
  // --- kényelem ---
  [['kenyelmes', 'kenyelem', 'kenyelmeset', 'kenyelmesen', 'comfortable', 'praktikus', 'gyakorlatias'], { k: 2, st: { laza: 1.5 }, c: 'kényelmes' }],
  [['sokat setal', 'sokat gyalogol', 'egesz nap', 'talpon', 'rohangal', 'futkos', 'sok lepcso', 'allok egesz', 'orakig all', 'sokat all', 'allo munka', 'allni fogok', 'gyalog', 'kilometer', 'ne torje',
    'labfaj', 'fajos a labam', 'vizholyag', 'sorban all'], { k: 2.5, c: 'egész nap talpon' }],
  [['biciklivel megyek', 'bringaval megyek', 'rollerrel', 'kerekparral'], { k: 1.5, st: { sportos: 1 }, c: 'biciklivel mész' }],
  // --- stílusszavak ---
  [['laza', 'lazan', 'lazab', 'casual', 'egyszeru', 'hetkoznapi', 'atlagos', 'mindennap', 'sima$', 'normal', 'lezser', 'nyugi', 'relaxed'],
    { st: { laza: 3 }, f: -1, c: 'laza' }],
  [['sportos', 'sportosab', 'athleis', 'atleti', 'sporty', 'trening'], { st: { sportos: 3 }, c: 'sportos' }],
  [['utcai', 'street', 'streetwear', 'hip hop', 'hiphop', 'skate', 'oversize', 'baggy', 'hype', 'sneakerhead'], { st: { street: 3 }, c: 'utcai stílus' }],
  [['meno', 'trendi', 'divatos', 'vagany', 'cool$', 'kul$', 'modern', 'stylish', 'trendy'], { st: { street: 1.5 }, f: 0.3, c: 'trendi' }],
  [['klasszikus', 'idotallo', 'vintage', 'old money', 'tradicional', 'konzervativ', 'classic'], { st: { elegans: 1.5 }, f: 0.8, c: 'klasszikus' }],
  [['preppy', 'kollegis', 'ivy league', 'tenisz klub', 'yacht klub'], { st: { elegans: 2, laza: 0.5 }, f: 1, szin: 'semleges', c: 'preppy' }],
  [['retro', 'y2k', '90-e', '80-a', '2000-e', 'kilencvenes', 'nyolcvanas', 'oldschool', 'old school'], { st: { street: 2 }, c: 'retró' }],
  [['boho', 'bohem', 'hippi', 'etno', 'fesztivalos'], { st: { laza: 2 }, szin: 'szines', f: -0.5, paletta: STY_FOLD, c: 'boho' }],
  [['rocker', 'rock$', 'rockos', 'punk', 'grunge', 'metal$', 'metalos', 'emo$', 'goth', 'got$', 'gotik', 'edgy', 'bad boy'], { st: { street: 2 }, arny: 'sotet', c: 'rockos' }],
  [['techwear', 'gorpcore', 'outdoor', 'funkcionalis'], { st: { sportos: 2, street: 1 }, c: 'outdoor' }],
  [['minimal', 'letisztult', 'egyszeru szin', 'basic', 'skandinav', 'clean$', 'clean look', 'tiszta vonal'], { szin: 'semleges', c: 'letisztult' }],
  [['semleges', 'neutral', 'nem feltuno szin'], { szin: 'semleges', c: 'semleges színek' }],
  [['monokrom', 'egyszinu', 'tone on tone', 'total look', 'tetotol talpig'], { szin: 'semleges', c: 'monokróm' }],
  [['visszafogott', 'diszkret', 'szolid', 'visszafogottab', 'decens', 'illedelmes'], { szin: 'semleges', f: 0.5, c: 'visszafogott' }],
  [['feltuno', 'extravagans', 'meresz', 'elenk', 'szines', 'szinesebb', 'szinesen', 'kirivo', 'neon', 'harsany', 'bold$', 'colorful', 'statement'],
    { szin: 'szines', c: 'színes, feltűnő' }],
  [['sotet', 'sotetebb', 'sotetet', 'all black', 'csupa fekete', 'feketeben', 'total black', 'dark$'], { arny: 'sotet', c: 'sötét tónusok' }],
  [['vilagos', 'vilagosabb', 'feher szett', 'csupa feher', 'all white', 'light$'], { arny: 'vilagos', c: 'világos tónusok' }],
  // --- színpaletták ---
  [['pasztell', 'pastel', 'puderes'], { arny: 'vilagos', paletta: ['rózsaszín', 'világoskék', 'bézs', 'sárga', 'lila', 'türkiz'], c: 'pasztell' }],
  [['foldszin', 'termeszetes szin', 'natur szin', 'earth tone', 'earthy', 'naturszin'], { szin: 'semleges', paletta: STY_FOLD, c: 'földszínek' }],
  [['oszi szin', 'oszies', 'oszi hangulat', 'autumn'], { paletta: ['bordó', 'barna', 'narancs', 'olíva', 'sárga', 'khaki'], c: 'őszi színek' }],
  [['tavaszi szin', 'tavaszias', 'friss szin', 'udito'], { paletta: ['zöld', 'világoskék', 'rózsaszín', 'sárga', 'fehér', 'türkiz'], c: 'tavaszi színek' }],
  [['nyari szin', 'nyarias', 'summer vibe'], { arny: 'vilagos', paletta: ['fehér', 'világoskék', 'sárga', 'narancs', 'türkiz', 'bézs'], c: 'nyári színek' }],
  [['teli szin', 'telies', 'teli hangulat'], { paletta: ['bordó', 'sötétzöld', 'sötétkék', 'fekete', 'sötétszürke'], c: 'téli színek' }],
  [['tengeresz', 'matroz', 'navy look', 'nautical', 'kapitany'], { paletta: ['sötétkék', 'fehér', 'piros'], c: 'tengerész stílus' }],
  [['karacsonyi szin', 'unnepi szin'], { paletta: ['piros', 'bordó', 'sötétzöld', 'fehér'], c: 'ünnepi színek' }],
  // --- melyik darabokat vegye elő ---
  [['kedvenc', 'legjobb darab', 'imadott', 'favorit'], { kedvenc: 1, c: 'kedvenc darabok' }],
  [['regota nem', 'reg nem hordt', 'ritkan hordt', 'elfelejtett', 'porosod', 'nem hordott', 'hasznalatlan', 'elo sem vett', 'meg nem vettem fel'], { ritka: 1, c: 'rég hordott darabok' }],
  [['uj ruha', 'uj darab', 'ujonnan', 'most vettem', 'nemreg vett', 'frissen vett', 'ujdonsag', 'uj szerzemeny', 'uj cucc'], { uj: 1, c: 'új darabok' }],
  [['kiegeszit', 'accessor', 'ekszerrel', 'diszitve'], { kieg: true, c: 'kiegészítők' }],
  [['reteg', 'retegez', 'hagymaszer', 'layer'], { kabat: true, c: 'réteges öltözék' }],
  // --- időjárás ---
  [['eso', 'esos', 'esik', 'eshet', 'zapor', 'zivatar', 'vihar', 'ernyo', 'esernyo', 'sar$', 'saros', 'pocsolya', 'szital', 'zuhog', 'szakad az eso', 'csepereg',
    'jegeso', 'onos', 'rain', 'rainy', 'nedves'], { ido: 'eso', c: 'eső' }],
  [['azas', 'azni', 'azzak', 'azzunk', 'azom$', 'bazik'], { ido: 'eso', nt: true, c: 'eső' }],
  [['hideg', 'fagy$', 'fagyos', 'fagypont', 'fagyni', 'minusz', 'havaz', 'havas', 'ho$', 'hoeses', 'hoban', 'hovihar', 'telen', 'teli$', 'tel$',
    'dermeszt', 'csipos', 'jeges', 'jegpalya', 'farkasordit', 'zimankos', 'cold', 'freezing', 'hidegfront', 'sikos'], { ido: 'hideg', c: 'hideg' }],
  [['fazom', 'fazos', 'fazni', 'fazzak', 'fazzunk', 'fazok', 'fazekony', 'kihul'], { ido: 'hideg', nt: true, c: 'ne fázz' }],
  [['huvos', 'szeles ido', 'szeles van', 'szeles lesz', 'fuj a szel', 'szel$', 'szelben', 'nyirkos', 'osz$', 'oszi', 'osszel', 'tavasz', 'borult', 'borongos', 'felhos',
    'friss$', 'kodos', 'kod$', 'paras', 'lehul', 'chilly', 'windy'], { ido: 'huvos', c: 'hűvös' }],
  [['meleg$', 'melegben', 'melegre', 'meleg van', 'meleg lesz', 'melegunk', 'nyar$', 'nyari', 'nyaron', 'kanikul', 'hoseg', 'forro', 'napos', 'napsut', 'tuz a nap',
    'tikkaszt', 'fulled', 'tropikus', 'perzsel', 'hot$', 'warm$', 'sunny'], { ido: 'meleg', c: 'meleg' }],
  [['izzad', 'izzaszt', 'leolvad', 'megsulok'], { ido: 'meleg', nt: true, c: 'ne izzadj' }],
  [['enyhe$', 'enyhebb', 'kellemes ido', 'langyos', 'atmeneti', 'valtozekony', 'mild'], { ido: 'enyhe', c: 'enyhe idő' }],
  // hónapok: csak gyenge jel (ha az időről más nem szól)
  [['december', 'januar', 'februar'], { idoGy: 'hideg' }],
  [['marcius', 'november', 'oktober'], { idoGy: 'huvos' }],
  [['aprilis', 'majus', 'szeptember'], { idoGy: 'enyhe' }],
  [['junius', 'julius', 'augusztus'], { idoGy: 'meleg' }],
];

// ruhadarabok: amit kérhetsz vagy kizárhatsz (a saját ruhák szövegében keressük).
// Sorrend: a pontosabb előbb („farmerdzseki” ne legyen „farmer”); [szótövek, név, minta, kabát-e]
const STY_DARAB = [
  [['farmerdzsek', 'farmerkabat', 'farmer dzseki', 'farmer kabat', 'denim dzseki', 'denimdzseki', 'denim jacket'], 'farmerdzseki', 'farmerdzs|farmerkab|denim dzs|denim jacket', true],
  [['bordzsek', 'borkabat', 'bor dzseki', 'bor kabat', 'motoros dzseki', 'biker', 'leather jacket'], 'bőrdzseki', 'bordzs|borkab|bor dzs|bor kab|biker|motoros|leather', true],
  [['ballonkabat', 'ballon$', 'trencs', 'trench', 'esokabat', 'viharkabat'], 'ballonkabát', 'ballon|trencs|trench|esokab', true],
  [['pufi', 'puffer', 'steppelt', 'pehely', 'tollkabat', 'telikabat', 'teli kabat', 'sidzsek', 'anorak', 'parka'], 'télikabát',
    'puffer|pufi|steppelt|pehely|toll|telikab|teli kab|sidzs|anorak|parka', true],
  [['melleny', 'vest$'], 'mellény', 'melleny|vest'],
  [['kabat', 'dzseki', 'bomber', 'kabi$', 'kabit', 'kabim', 'jacket', 'coat$', 'felolto', 'szeldzsek', 'softshell'], 'kabát',
    'kabat|dzseki|parka|bomber|ballon|melleny|jacket|coat|softshell', true],
  [['oltony', 'suit$', 'szmoking', 'frakk', 'kosztum'], 'öltöny', 'oltony|szmoking|frakk|kosztum|suit'],
  [['zako', 'blezer', 'blazer'], 'zakó / blézer', 'zako|blezer|blazer'],
  [['ingruha', 'shirt dress'], 'ingruha', 'ingruha'],
  [['flanel', 'kockas ing', 'favagoing', 'favago ing'], 'flanelling', 'flanel|kockas ing'],
  [['farmering', 'denim ing'], 'farmering', 'farmering|denim ing'],
  [['galleros polo', 'pike', 'polo shirt', 'galleros'], 'galléros póló', 'galleros|pike|polo shirt'],
  [['ing$', 'inget', 'ingem', 'ingben', 'inggel', 'ingek', 'ingre', 'ingbe', 'ingh', 'shirt$', 'ingbluz'], 'ing', '\\bing|ingek|ingbluz|shirt'],
  [['crop', 'haspolo'], 'crop top', 'crop|haspolo'],
  [['triko', 'atleta', 'tank top', 'tanktop', 'ujjatlan', 'spagettipant', 'top$', 'topot', 'toppot', 'toppal', 'topban'], 'top / trikó', 'top\\b|triko|atleta|ujjatlan|spagetti|crop'],
  [['polo', 'polot', 'poloban', 'poloval', 'polcsi', 'tshirt', 't-shirt', 'tee$'], 'póló', 'polo|t-shirt|tshirt|top\\b|triko'],
  [['garbo', 'turtleneck'], 'garbó', 'garbo|turtleneck'],
  [['kardigan', 'cardigan'], 'kardigán', 'kardigan|cardigan'],
  [['hoodie', 'kapucnis', 'kapucnit', 'kapucnival'], 'kapucnis pulóver', 'hoodie|kapucn'],
  [['pulover', 'pulcsi', 'szvetter', 'sweater', 'jumper', 'sweatshirt'], 'pulóver', 'pulover|pulcsi|kardigan|szvetter|sweat|kotott'],
  [['bluz', 'blouse'], 'blúz', 'bluz|blouse'],
  [['tunika'], 'tunika', 'tunik'],
  [['body$', 'bodyt', 'bodyban', 'bodyval'], 'body', '\\bbody'],
  [['overal', 'jumpsuit', 'kezeslabas', 'kantaros'], 'overál', 'overal|jumpsuit|kantaros'],
  [['estelyi ruha', 'kisestelyi', 'koktelruha', 'alkalmi ruha', 'miniruha', 'maxiruha', 'midiruha', 'kotott ruha', 'puloverruha', 'garboruha', 'dress$', 'nyari ruhat',
    'ruhaban', 'ruhat veszek', 'ruhat vennek'], 'ruha', 'ruha\\b|ruhat\\b|dress|estelyi|koktelruha|miniruha|maxiruha|midiruha|puloverruha|garboruha'],
  [['farmer', 'jeans', 'denim', 'mom jeans', 'skinny'], 'farmer', 'farmer|jean|denim'],
  [['chino'], 'chino', 'chino'],
  [['cargo', 'oldalzsebes'], 'cargo nadrág', 'cargo'],
  [['kord'], 'kordbársony', 'kord'],
  [['szovetnadrag', 'elegans nadrag', 'pantalo', 'szovetnaci', 'vasalt nadrag'], 'szövetnadrág', 'szovet|pantalo|elegans nadrag'],
  [['leggings', 'leggins', 'cicanadrag', 'jogan'], 'leggings', 'legging|jogan'],
  [['melegito', 'jogger', 'szabadido', 'treningruha', 'treningnadrag', 'sweatpants', 'tracksuit'], 'melegítő', 'melegit|jogger|fleece|trening|sweatpant|tracksuit'],
  [['rovidnadrag', 'short$', 'shorts', 'sortot', 'sortban', 'rovidnaci', 'bermuda', 'rovid gatya'], 'rövidnadrág', 'rovidnadr|short|bermuda'],
  [['nadrag', 'naci', 'gatya', 'gatyo', 'pants', 'trousers'], 'nadrág', 'nadrag|farmer|chino|jogger|pant|cargo|legging|jean'],
  [['szoknya', 'szoknyat', 'szoknyaban', 'miniszokn', 'ceruzaszokn', 'pliszir', 'rakott szokn', 'skirt', 'szoknyi'], 'szoknya', 'szokny|skirt'],
  [['harisny', 'zokni', 'socks'], 'harisnya / zokni', 'harisny|zokni|sock'],
  [['futocip', 'futo cipo', 'running cip'], 'futócipő', 'futocip|running|pegasus|vomero|gel-|hoka|on running|ultraboost'],
  [['sneaker', 'tornacip', 'edzocip', 'sportcip', 'tornacsuk', 'sportcsuk', 'edzocsuk', 'csuka', 'csukat', 'csukam', 'csukaban', 'air force', 'af1', 'air max',
    'converse', 'vans$', 'new balance', 'samba', 'dunk', 'jordan', 'trainers'], 'sneaker',
  'sneaker|tornacip|edzocip|sportcip|futocip|air max|air force|dunk|samba|converse|vans|new balance|jordan|trainer'],
  [['gumicsizm', 'esocsizm', 'wellington'], 'gumicsizma', 'gumicsizm|esocsizm|wellington'],
  [['hotapos', 'hocsizm', 'ugg$', 'uggs'], 'hótaposó', 'hotapos|hocsizm|ugg'],
  [['turabakancs', 'turacip', 'bakancs', 'tura cipo', 'hiking boot'], 'bakancs', 'bakancs|turacip|tura|hiking'],
  [['terdcsizm', 'bokacsizm', 'csizma', 'csizmat', 'csizmaban', 'chelsea', 'boots', 'boot$', 'cowboy'], 'csizma', 'csizm|chelsea|boot|cowboy'],
  [['magassark', 'tusark', 'sarkas', 'sarkus', 'heels', 'high heels', 'platform', 'blokksark', 'eksark', 'magas sark', 'stiletto', 'pumps'], 'magassarkú',
    'magassark|tusark|blokksark|platform|eksark|heels|magas sark|stiletto|pumps'],
  [['balerin', 'lapos cipo', 'mary jane', 'slingback'], 'balerina', 'balerin|mary jane|slingback'],
  [['mokaszin', 'felcip', 'oxford', 'loafer', 'bor cipo', 'borcipo', 'derby', 'brogue', 'elegans cipo', 'alkalmi cipo', 'lakkcipo', 'lakk cipo', 'dress shoe'],
    'elegáns cipő', 'mokaszin|felcip|oxford|loafer|derby|brogue|lakk'],
  [['espadrill', 'vaszoncip', 'vaszon cipo', 'slip-on', 'slip on'], 'vászoncipő', 'espadrille|vaszon|slip'],
  [['szandal', 'papucs', 'strandpapucs', 'flip flop', 'flip-flop', 'crocs', 'birkenstock', 'klumpa'], 'szandál / papucs', 'szandal|papucs|crocs|birkenstock|klumpa|flip'],
  // általános cipő (főleg színnel hasznos: „barna cipő”)
  [['cipo', 'cipot', 'cipom', 'cipoben', 'cipovel', 'labbeli', 'shoes'], 'cipő', 'cip|sneaker|csizm|bakancs|mokaszin|loafer|szandal|papucs|balerin|boot|shoe|oxford|derby'],
  [['clutch', 'boritektask', 'estelyi taska', 'kistaska'], 'estélyi táska', 'clutch|boritek|estelyi taska'],
  [['hatizsak', 'hatitask', 'backpack'], 'hátizsák', 'hatizsak|hatitask|backpack'],
  [['ovtask', 'bum bag', 'crossbody', 'valltask', 'oldaltask'], 'övtáska / válltáska', 'ovtask|crossbody|valltask|oldaltask'],
  [['taska', 'tatyo', 'shopper', 'bag$', 'tote'], 'táska', 'taska|tatyo|bag|tote|shopper'],
  [['sapka', 'sapi', 'beanie', 'kotott sapka', 'telisapka', 'baseball', 'siltes', 'cap$', 'kalap', 'fedora', 'bucket hat'], 'sapka / kalap',
    'sapka|kalap|baseball|beanie|cap\\b|fedora|bucket'],
  [['kesztyu', 'gloves'], 'kesztyű', 'kesztyu|glove'],
  [['nyakkendo', 'csokornyakkendo', 'tie$', 'mandzsett'], 'nyakkendő', 'nyakkendo|csokornyakk|mandzsett|\\btie\\b'],
  [['ov$', 'ovet', 'ovvel', 'ovem', 'belt$'], 'öv', '\\bov\\b|bor ov|barna ov|fekete ov|belt'],
  [['karora', 'orat', 'oraval', 'okosora', 'smartwatch', 'watch'], 'óra', 'ora\\b|karora|watch|okosora'],
  [['sal$', 'salat$', 'sallal', 'salam$', 'scarf'], 'sál', '\\bsal\\b|scarf'],
  [['napszemuveg', 'szemuveg', 'sunglasses', 'napszemcsi'], 'napszemüveg', 'szemuveg|napszemcsi|sunglass'],
  [['ekszer', 'fulbeval', 'nyaklanc', 'karkoto', 'karperec', 'gyuru', 'medal', 'bross', 'bizsu', 'lanc$', 'lancot', 'jewel'], 'ékszer',
    'ekszer|fulbeval|nyaklanc|karkoto|karperec|gyuru|medal|bross|bizsu|jewel'],
  [['kendo', 'kendot', 'hajkendo', 'bandana'], 'kendő', 'kendo|bandana'],
  [['furdoruha', 'bikini', 'furdonadrag', 'fecske', 'swimsuit'], 'fürdőruha', 'furdoruh|bikini|furdonadr|fecske|swim'],
];

// színek (ékezet nélküli tő → a SZIN_LISTA neve); a „$” végű csak pontos szóra illik
const STY_SZINEK = [
  ['sotetszurke', 'sötétszürke'], ['vilagosszurke', 'világosszürke'], ['sotetzold', 'sötétzöld'], ['vilagoskek', 'világoskék'], ['sotetkek', 'sötétkék'],
  ['vilagoszold', 'zöld'], ['sotetbarna', 'barna'], ['vilagosbarna', 'bézs'], ['sotetpiros', 'bordó'], ['sotetlila', 'lila'], ['vilagoslila', 'lila'],
  ['tengereszkek', 'sötétkék'], ['navy', 'sötétkék'], ['farmerkek', 'farmerkék'], ['rozsaszin', 'rózsaszín'], ['pink', 'rózsaszín'], ['rozearany', 'rózsaszín'],
  ['tortfeh', 'fehér'], ['hofeh', 'fehér'], ['olivazold', 'olíva'], ['mohazold', 'olíva'], ['katonaizold', 'khaki'], ['military', 'khaki'], ['egikek', 'világoskék'],
  ['smaragd', 'sötétzöld'], ['fenyozold', 'sötétzöld'], ['uvegzold', 'zöld'], ['mentazold', 'türkiz'],
  ['egkek', 'világoskék'], ['babakek', 'világoskék'], ['azur', 'kék'], ['kiralykek', 'kék'], ['kobalt', 'kék'], ['indigo', 'sötétkék'], ['tengerkek', 'sötétkék'],
  ['petrol', 'türkiz'], ['teal$', 'türkiz'], ['aqua', 'türkiz'], ['grafit', 'sötétszürke'], ['antracit', 'sötétszürke'], ['ezust$', 'szürke'], ['ezustszin', 'szürke'],
  ['ezustos', 'szürke'], ['hamuszurke', 'világosszürke'], ['teveszin', 'bézs'], ['homokszin', 'bézs'], ['nude', 'bézs'], ['ekru', 'bézs'], ['csontszin', 'bézs'],
  ['vanilia', 'bézs'], ['csoki', 'barna'], ['konyak', 'barna'], ['karamell', 'barna'], ['mogyoro', 'barna'], ['gesztenye', 'barna'], ['rozsda', 'narancs'],
  ['terrakott', 'narancs'], ['barack', 'narancs'], ['korall', 'narancs'], ['puder', 'rózsaszín'], ['fuksz', 'rózsaszín'], ['magenta', 'rózsaszín'], ['meggy', 'bordó'],
  ['burgund', 'bordó'], ['borvoros', 'bordó'], ['szilva', 'lila'], ['levendula', 'lila'], ['lavender', 'lila'], ['padlizsan', 'lila'], ['orgona', 'lila'],
  ['ibolya', 'lila'], ['arany$', 'sárga'], ['aranyszin', 'sárga'], ['citrom', 'sárga'], ['skarlat', 'piros'], ['cseresznye', 'piros'], ['tuzpiros', 'piros'],
  ['fekete', 'fekete'], ['feher', 'fehér'], ['szurke', 'szürke'], ['bezs', 'bézs'], ['drapp', 'bézs'], ['krem', 'bézs'], ['barna', 'barna'],
  ['khaki', 'khaki'], ['oliv', 'olíva'], ['zold', 'zöld'], ['turkiz', 'türkiz'], ['menta', 'türkiz'], ['kek', 'kék'], ['lila', 'lila'],
  ['piros', 'piros'], ['voros', 'piros'], ['bordo', 'bordó'], ['narancs', 'narancs'], ['sarga', 'sárga'], ['mustar', 'sárga'],
  ['black$', 'fekete'], ['white$', 'fehér'], ['grey$', 'szürke'], ['gray$', 'szürke'], ['blue$', 'kék'], ['red$', 'piros'], ['green$', 'zöld'], ['beige$', 'bézs'],
  ['brown$', 'barna'], ['purple$', 'lila'], ['yellow$', 'sárga'], ['orange$', 'narancs'], ['cream$', 'bézs'],
];
const STY_SOTET = new Set(['fekete', 'sötétszürke', 'sötétkék', 'bordó', 'sötétzöld', 'barna', 'olíva']);
const STY_VILAGOS = new Set(['fehér', 'bézs', 'világosszürke', 'világoskék', 'rózsaszín', 'sárga']);
const styTo = (sz) => sz.length > 3 ? sz.slice(0, -1) : sz;
// két szóból álló színek egybeírva: „sötét kék” → „sotetkek”
const STY_KET_SZO = /\b(sotet|vilagos|tenger|katonai|tort|egi|kiraly|baba|tuz|hamu|bor) (kek|zold|szurke|barna|piros|lila|feher|voros)\b/g;
// egy szó színe (ha színt jelöl): a színtő-bejegyzés [tő, név]
const stySzinTo = (szo) => STY_SZINEK.find(([to]) => (to.endsWith('$') ? szo === to.slice(0, -1) : szo.startsWith(to))) || null;
const stySzinSzo = (szo) => { const x = stySzinTo(szo); return x ? x[1] : ''; };
// egy ruhadarab színe: a felismert színe, vagy a nevéből („fekete póló” → fekete)
const styDarabSzin = (d) => {
  if (d.szin) return d.szin;
  const sz = styNorm(d.label).replace(STY_KET_SZO, '$1$2').split(' ').map(stySzinSzo).find(Boolean);
  return sz || '';
};
const styDarabSzoveg = (d) => styNorm(d.label + ' ' + (d.cat || '') + ' ' + (d.marka || '') + ' ' + (d.tags || []).join(' ') + ' ' + (d.szin || ''));

// A teljes értelmezés: egy üzenetből kinyert kívánságok
const styErtelmez = (eredeti, ma) => {
  // a vessző, pont, felkiáltójel… tagmondat-határ marad (a tizedesjegyeket elhagyjuk: „2,5 fok” → 2)
  const elo = String(eredeti || '').replace(/(\d)[.,]\d+/g, '$1').replace(/[.,;:!?\n()]+|\s[-–]\s/g, ' ' + STY_VESSZO + ' ');
  const szoveg = ' ' + styNorm(elo).replace(STY_KET_SZO, '$1$2').replace(/\bt ?-?shirt\w*/g, 'polo') + ' ';
  const szavak = szoveg.trim().split(' ').filter(Boolean);
  const r = { a: {}, st: {}, f: 0, ido: '', k: 0, arny: '', ev: '', szin: '', szinek: [], szinNot: [], kell: [], kerul: [], kabat: undefined, kieg: undefined,
    paletta: null, ritka: 0, kedvenc: 0, uj: 0, nap: null, napNev: '', cimkek: [], fok: null, mindegy: false, tagadottStilus: [] };
  let idoGy = '';
  // tagadás: a szó előtti 4 szóban tagadószó (tagmondat-határig), vagy utána „nélkül / helyett / ne legyen”
  const tagadott = (i, hossz) => {
    for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
      const w = szavak[j];
      if (w === 'mint' && szavak.slice(Math.max(0, j - 6), j).includes('inkabb')) return true; // „inkább farmer, mint chino”
      if (STY_HATAR.has(w)) break;
      if (STY_TAGADO.has(w)) return true;
      if (w === 'le' && STY_LE_IGE.has(szavak[j - 1])) return true; // „vedd le a kabátot”
    }
    const n = i + (hossz || 1);
    const utana = szavak[n] || '';
    if (/^(nelkul|helyett|kivetel|kizarva|tilos|soha|semmikepp)/.test(utana)) return true;
    // „X ne legyen”, „a fehér inget ne, de…”
    if ((utana === 'ne' || utana === 'nem' || utana === 'se' || utana === 'sem') && (STY_UTO_IGE.has(szavak[n + 1] || '') || !szavak[n + 1] || STY_HATAR.has(szavak[n + 1]))) return true;
    if (STY_LE_IGE.has(utana) && szavak[n + 1] === 'le') return true;
    return false;
  };
  // erősítés: a kulcsszó előtti 1-2 szó („nagyon”, „egy kicsit”, „kevésbé”, „még”)
  const ero = (i) => {
    let m = 1;
    for (let j = i - 1; j >= Math.max(0, i - 2); j--) {
      const w = szavak[j];
      if (STY_ERO[w] !== undefined) m *= STY_ERO[w];
      else if (w === 'meg') m *= 1.3;
      else if (!['egy', 'nem', 'ne', 'legyen', 'is', 'kicsivel', 'joval'].includes(w)) break;
    }
    return m;
  };
  // hol fordul elő a szótő (szóindexekkel, a tagadás vizsgálatához)
  const talalat = (to) => {
    if (to.includes(' ')) {
      const p = szoveg.indexOf(' ' + to);
      if (p < 0) return [];
      return [{ i: szoveg.slice(0, p + 1).trim().split(' ').filter(Boolean).length, hossz: to.split(' ').length }];
    }
    const out = [];
    szavak.forEach((sz, i) => { if (styIllik(sz, to)) out.push({ i, hossz: 1 }); });
    return out;
  };
  const cimke = (c, neg, elotag) => {
    if (!c) return;
    const x = (neg ? 'nem ' : '') + (elotag || '') + c;
    if (!r.cimkek.includes(x)) r.cimkek.push(x);
  };

  STY_SZOTAR.forEach(([tovek, h]) => {
    let hit = null;
    for (const to of tovek) { const x = talalat(to); if (x.length) { hit = x[0]; break; } }
    if (!hit) return;
    const neg = !h.nt && tagadott(hit.i, hit.hossz);
    const e = ero(hit.i);
    // „ne legyen túl elegáns” = csak kicsit kevésbé; „kevésbé sötét” = az ellenkezője felé
    const szorzo = neg ? (e > 1 ? -0.5 : -1) : e;
    const fordit = szorzo < 0;
    if (h.a && !neg) r.a[h.a] = (r.a[h.a] || 0) + 1;
    if (h.st) Object.entries(h.st).forEach(([k, v]) => { r.st[k] = (r.st[k] || 0) + v * szorzo; if (fordit) r.tagadottStilus.push(k); });
    if (h.f) r.f += h.f * szorzo;
    if (h.ido && !neg) r.ido = r.ido === 'eso' ? 'eso' : h.ido; // az eső mindent visz
    if (h.ido && neg && !r.ido) r.ido = h.ido === 'hideg' ? 'enyhe' : h.ido === 'meleg' ? 'huvos' : ''; // „nincs hideg”, „nem lesz meleg”
    if (h.idoGy && !neg) idoGy = h.idoGy;
    if (h.k) r.k += h.k * szorzo;
    if (h.arny) r.arny = fordit ? (h.arny === 'sotet' ? 'vilagos' : 'sotet') : h.arny;
    if (h.ev && !neg) r.ev = h.ev;
    if (h.szin) r.szin = fordit ? (h.szin === 'szines' ? 'semleges' : 'szines') : h.szin;
    if (h.paletta && !fordit) r.paletta = h.paletta;
    if (h.kabat !== undefined) r.kabat = fordit ? !h.kabat : h.kabat;
    if (h.kieg !== undefined) r.kieg = fordit ? !h.kieg : h.kieg;
    ['ritka', 'kedvenc', 'uj'].forEach((k) => { if (h[k] && !neg) r[k] = h[k]; });
    cimke(h.c, neg, neg ? '' : e >= 1.4 ? 'nagyon ' : e < 0 ? 'kevésbé ' : e < 0.8 ? 'kicsit ' : '');
  });
  if (!r.ido && idoGy) r.ido = idoGy;

  // hőfok számmal vagy betűvel: „-3 fok”, „mínusz 5 fok”, „25°”, „15 c”, „huszonöt fokban” (de nem „egy fokkal melegebb”)
  szavak.forEach((sz, i) => {
    if (r.fok !== null) return;
    const tol = sz.match(/^(-?\d{1,2})-(\d{1,2})(°|fok\w*)?$/); // „20-25 fok”: a kettő átlaga
    if (tol && (tol[3] || /^(fok|°)/.test(szavak[i + 1] || ''))) { r.fok = Math.round((parseInt(tol[1], 10) + parseInt(tol[2], 10)) / 2); return; }
    const m = sz.match(/^(-?\d{1,2})(°|c|fok\w*)?$/);
    let szam = m ? parseInt(m[1], 10) : stySzam(sz);
    if (szam === null || isNaN(szam)) return;
    const jel = m && m[2];
    const kov = szavak[i + 1] || '';
    if (jel ? /^fokkal/.test(jel) : (!/^(fok|°|c$|celsius)/.test(kov) || /^fokkal/.test(kov))) return;
    if (szam > 0 && /^(minusz|minus|-)$/.test(szavak[i - 1] || '')) szam = -szam;
    r.fok = szam;
  });
  if (r.fok !== null) {
    if (r.ido !== 'eso') r.ido = r.fok < 8 ? 'hideg' : r.fok < 16 ? 'huvos' : r.fok > 24 ? 'meleg' : 'enyhe';
    cimke(r.fok + '°');
  }

  // melyik napra: „holnap”, „szombaton”, „hétvégén”
  const mai = ma || new Date();
  for (const [tovek, nev, cel] of STY_NAPOK) {
    if (!tovek.some((to) => talalat(to).length)) continue;
    r.napNev = nev;
    r.nap = typeof cel === 'number' ? cel
      : cel === 'hetvege' ? ([0, 6].includes(mai.getDay()) ? 0 : 6 - mai.getDay())
        : (STY_HET_NAP[cel] - mai.getDay() + 7) % 7;
    if (r.nap > 0) cimke(nev);
    break;
  }

  // színek, a tagadással együtt
  szavak.forEach((sz, i) => {
    const szin = stySzinSzo(sz);
    if (!szin) return;
    if (tagadott(i)) { if (!r.szinNot.includes(szin)) r.szinNot.push(szin); cimke(szin, true); }
    else if (!r.szinek.includes(szin)) { r.szinek.push(szin); cimke(szin); }
  });
  // ruhadarabok; „kék ing”, „fekete bőr dzseki” → színes darab. Egy szót csak egy darab foglalhat le.
  const foglalt = new Set();
  STY_DARAB.forEach(([tovek, nev, minta, kabatFele]) => {
    let hit = null;
    for (const to of tovek) {
      const x = talalat(to).filter((t) => {
        if (foglalt.has(t.i)) return false;
        const szt = t.hossz === 1 && stySzinTo(szavak[t.i]); // a „farmerkék” szín, nem farmer
        return !(szt && szt[0].replace('$', '').length > to.replace('$', '').length);
      });
      if (x.length) { hit = x[0]; break; }
    }
    if (!hit) return;
    for (let j = 0; j < hit.hossz; j++) foglalt.add(hit.i + j);
    let szin = '';
    let szinHely = -1;
    for (let j = hit.i - 1; j >= Math.max(0, hit.i - 2) && !szin; j--) {
      if (STY_HATAR.has(szavak[j])) break;
      szin = stySzinSzo(szavak[j]);
      if (szin) szinHely = j;
    }
    if (nev === 'cipő' && !szin) return; // a puszta „cipő” nem szűkít semmit („nem tetszik a cipő” = csere, nem tiltás)
    // „az új dzsekimet”, „a nemrég vett ingem”: az újabb darabokat vegye előre
    if (szavak.slice(Math.max(0, hit.i - 2), hit.i).some((w) => /^(uj|ujonnan|nemreg|friss|frissen)$/.test(w))) { r.uj = 1; cimke('új darabok'); }
    if (tagadott(hit.i, hit.hossz) || (szinHely >= 0 && tagadott(szinHely))) {
      if (kabatFele && nev === 'kabát') r.kabat = false;
      else r.kerul.push({ nev, minta, szin: szin || '' });
      cimke((szin ? szin + ' ' : '') + nev, true);
    } else {
      if (kabatFele) r.kabat = true;
      r.kell.push({ nev, minta, szin: szin || '' });
      cimke((szin ? szin + ' ' : '') + nev);
    }
  });
  if (r.szinek.length === 1 && !r.szin) r.szin = r.szinek[0];
  if (/\b(mindegy|barmi|barmit|nem tudom|dontsd el|te dontsd|lepj meg|meglepetes|valami jot|ajanlj|ajanlasz|otletet|otlet|whatever|surprise|rad bizom|te tudod)\b/.test(szoveg)) r.mindegy = true;
  return r;
};

// színtanácsok: mi illik egy színhez (a „mi illik a bordóhoz?” típusú kérdésekre)
const STY_SZIN_TANACS = {
  'fekete': 'szinte mindennel megy: fehérrel klasszikus, bordóval vagy sötétzölddel elegáns, egy élénk színnel (piros, sárga) feltűnő',
  'fehér': 'mindennel jól mutat: sötétkékkel friss, bézzsel és barnával nyugodt, feketével letisztult',
  'szürke': 'bordóval, sötétkékkel, rózsaszínnel és fehérrel nagyon jó, a sárga is szépen kiemeli',
  'sötétszürke': 'világoskékkel, fehérrel, bordóval és bézzsel elegáns',
  'világosszürke': 'sötétkékkel, feketével, pasztellekkel és bordóval jó',
  'bézs': 'fehérrel, barnával, olívával és sötétkékkel elegáns, a fekete is működik vele',
  'barna': 'bézzsel, krémmel, olívával, sötétkékkel és narancsos tónusokkal szép, a fekete mellé kevésbé',
  'khaki': 'fehérrel, sötétkékkel, barnával és fekete kiegészítőkkel jó',
  'olíva': 'bézzsel, barnával, fehérrel, feketével és mustárral szép',
  'farmerkék': 'fehérrel, szürkével, bézzsel, barnával és szinte bármilyen színnel megy',
  'sötétkék': 'fehérrel, bézzsel, szürkével, barnával és világoskékkel jó, pirossal tengerészes',
  'világoskék': 'sötétkékkel, fehérrel, szürkével, bézzsel és barnával szép',
  'kék': 'fehérrel, szürkével, bézzsel és sötétkékkel jó, egy narancs kiegészítővel merész',
  'piros': 'feketével, fehérrel, sötétkékkel és farmerrel jó, zölddel és rózsaszínnel ütheti egymást',
  'bordó': 'szürkével, bézzsel, sötétkékkel, feketével és olívával elegáns, naranccsal kevésbé',
  'rózsaszín': 'szürkével, fehérrel, sötétkékkel és farmerrel jó, pirossal és naranccsal ütheti egymást',
  'lila': 'szürkével, fehérrel, feketével és farmerrel jó, naranccsal nehezen megy',
  'zöld': 'fehérrel, bézzsel, barnával és sötétkékkel jó, pirossal karácsonyias lesz',
  'sötétzöld': 'bézzsel, barnával, fehérrel, feketével és bordóval elegáns',
  'türkiz': 'fehérrel, bézzsel, sötétkékkel és korallos tónusokkal nyárias',
  'narancs': 'sötétkékkel, fehérrel, bézzsel és barnával jó, rózsaszínnel és lilával nehezebb',
  'sárga': 'szürkével, sötétkékkel, fehérrel és farmerrel jó, rózsaszínnel kevésbé',
};

// FŐ KOMPONENS
class Component extends DCLogic {
  // Állapot: a DEMÓ-mezők (BASE-ből) + belépési űrlapok + a VALÓDI backend
  // adatai (categories/items/outfits/realUser), amik csak akkor töltődnek
  // fel, ha tényleg bejelentkeztél (nem a ?start=app előnézeti módban).
  state = { ...BASE, view: 'start', who: null, auth: null, lEmail: '', lPw: '', lShow: false, lErr: '', resetSent: '', suName: '', suEmail: '', suPw: '', suShow: false, suGender: '', suErr: '', sName: 'A neved', sEmail: 'te@email.com', rWeekly: true, rDaily: false, rIdle: true,
    // Valódi időjárás (server/index.js /api/weather); amíg nem érkezik meg, null
    weather: null,
    // Valódi backend adatai - üresen indul, a bejelentkezés/munkamenet-ellenőrzés tölti fel
    realUser: null, categories: [], items: [], outfits: [], lastGoneId: null,
    // Naptár: nap ("ÉÉÉÉ-HH-NN") -> outfit id; a mutatott hónap és a kijelölt nap
    calendarLog: {}, calMonth: dayKey(new Date()).slice(0, 7), calDay: dayKey(new Date()),
    // erre a napra naplózódik az összeállítóban mentett új outfit (alapból ma)
    bLogDay: '' };

  // "7 hónapja nem viselted" szövegből hónapok száma (a rendezéshez) - ezt a
  // demó ÉS a valódi mód is használja, mindkettő ugyanilyen formátumú jegyzetet ad
  monthsOf = (note) => {
    const m = /(\d+)\s*(hónap|év)/.exec(note || '');
    return m ? parseInt(m[1], 10) * (m[2] === 'év' ? 12 : 1) : 0;
  };

  // Ruhadarab kijelölése a demó szekrény nézetben (a jobb oldali panel ezt mutatja)
  select = (label, cat, note) => () => this.setState({ view: 'wardrobe', editOpen: false, sel: { label, cat, note: note || '' } });

  componentDidMount() {
    let savedTheme = null;
    try { savedTheme = localStorage.getItem(THEME_STORE_KEY); } catch (e) { /* nincs tároló */ }
    applyTheme(savedTheme);
    // a menücsoportok nyitva / csukva állapota ezen a gépen
    try { const nn = JSON.parse(localStorage.getItem('wardro-nav-nyit') || 'null'); if (nn) this.setState({ navNyit: nn }); } catch (e) { /* nincs tároló */ }
    this.fetchWeather();
    this.checkSession();
    // ha egy fotón megmértük, hol van a ruha, újrarajzolunk (több mérést egyszerre)
    kepKeretFrissit = () => {
      if (this._keretIdozito) return;
      this._keretIdozito = setTimeout(() => { this._keretIdozito = null; this.setState({ kepKeretVer: Date.now() }); }, 60);
    };
  }

  componentWillUnmount() {
    this.closeWs();
    if (this._pairTick) clearInterval(this._pairTick);
  }

  // lekéri az időjárást a "Mára ajánlott" részhez, a backend csinálja a
  // tényleges API hívást (server/index.js), mi csak a helyet küldjük el neki
  fetchWeather = async () => {
    let coords = null;
    const varos = this.wxVaros();
    if (varos) coords = { latitude: varos.lat, longitude: varos.lon };
    else try {
      if (navigator.geolocation) {
        coords = await new Promise((resolve) => {
          let done = false;
          const timer = setTimeout(() => { if (!done) { done = true; resolve(null); } }, 4000);
          navigator.geolocation.getCurrentPosition(
            (pos) => { if (!done) { done = true; clearTimeout(timer); resolve(pos.coords); } },
            () => { if (!done) { done = true; clearTimeout(timer); resolve(null); } },
          );
        });
      }
    } catch (e) {
      coords = null;
    }

    let qs = '';
    if (coords) qs = '?lat=' + coords.latitude + '&lon=' + coords.longitude;

    try {
      const r = await fetch('/api/weather' + qs);
      if (!r.ok) return;
      const data = await r.json();
      if (data.ok) this.setState({ weather: data });
    } catch (e) {
      // nincs internet vagy nem fut a backend, nem baj, megy tovább enélkül is
    }
  };

  closeWs = () => {
    if (this._ws) {
      try { this._ws.onmessage = null; this._ws.onclose = null; this._ws.close(); } catch { /* mindegy, úgyis eldobjuk */ }
      this._ws = null;
    }
  };

  // Új párosítási munkamenet indítása a backenden: token + QR-kép + élő kapcsolat.
  // Ez a telefonos fotóküldés, és a demó/valódi módtól teljesen független.
  startPair = async () => {
    this.setState({ pairOpen: true, pairToken: '', qrSvgUrl: '', pairError: '' });
    let data;
    try {
      const r = await fetch('/api/pair/start', { method: 'POST' });
      if (!r.ok) throw new Error('http ' + r.status);
      data = await r.json();
    } catch {
      this.setState({ pairError: 'Nem sikerült elérni a szervert. Ellenőrizd, hogy fut-e a helyi backend.' });
      return;
    }
    this.setState({
      pairToken: data.token,
      pairPhoneUrl: data.phoneUrl,
      pairExpiresAt: data.expiresAt,
      qrSvgUrl: '/api/pair/' + data.token + '/qr.svg',
    });
    this.connectWs(data.token);
    // A visszaszámláló szöveget percenként frissítjük, hogy ne fagyjon be a kijelzett érték.
    if (!this._pairTick) this._pairTick = setInterval(() => this.forceUpdate(), 15000);
  };

  connectWs = (token) => {
    this.closeWs();
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    // A VS Code Live Server (5500) csak a sima /api kéréseket továbbítja a
    // backendnek, a WebSocketet nem - ilyenkor közvetlenül a 8080-ra kapcsolódunk.
    const host = location.port === '5500' ? location.hostname + ':8080' : location.host;
    const ws = new WebSocket(proto + '://' + host + '/api/pair/' + token + '/socket');
    ws.onmessage = (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch { return; }
      if (msg.type === 'hello') {
        this.setState({ pairExpiresAt: msg.expiresAt });
        (msg.photos || []).forEach((p) => this.receivePhonePhoto(p));
      } else if (msg.type === 'photo') {
        this.receivePhonePhoto(msg);
      } else if (msg.type === 'expired') {
        this.setState({ pairError: 'Ez a kód lejárt.', qrSvgUrl: '' });
      }
    };
    // Ha a kapcsolat megszakad (alvó gép, Wi-Fi-zavar, szerver-újraindítás),
    // újracsatlakozunk; a "hello" úgyis újraküldi a közben érkezett fotókat.
    // Ha a munkamenet már nem létezik a szerveren, új kódot kérünk.
    ws.onclose = () => {
      if (this._ws !== ws) return;
      this._ws = null;
      setTimeout(async () => {
        if (this._ws || this.state.pairToken !== token) return;
        try {
          const r = await fetch('/api/pair/' + token + '/status');
          if (r.status === 404) {
            this.setState({ pairError: 'Ez a kód lejárt.', qrSvgUrl: '' });
            if (this.state.pairOpen) this.startPair();
            return;
          }
        } catch { /* a szerver épp nem elérhető, később újra próbáljuk */ }
        if (!this._ws && this.state.pairToken === token) this.connectWs(token);
      }, 2000);
    };
    this._ws = ws;
  };

  // Egy telefonról beérkezett fotó betolása a meglévő "drops" paklibe -
  // ez a pakli mindkét módban ugyanúgy létezik, csak a "Mentés" gomb
  // viselkedik máshogy (lásd lejjebb: saveDrops / realSaveDrops).
  receivePhonePhoto = (p) => {
    const s = this.state;
    // a fotó-azonosító minden munkamenetben 1-től indul, ezért a tokent is
    // beletesszük, különben egy új párosítás fotóit "már láttuk"-nak vennénk
    const file = 'phone-' + this.state.pairToken + '-' + p.id;
    if (s.drops.includes(file)) return; // pl. a "hello" újraküldené, amit már láttunk
    this.setState({
      drops: [...s.drops, file],
      phonePhotos: { ...s.phonePhotos, [file]: p.url },
      paired: true,
      phoneCount: (s.phoneCount || 0) + 1,
    });
    this.hatterFeldolgoz(file);
  };

  // --- Háttér-eltávolítás a még el nem mentett fotókon ---
  // hatter[file]: 'fut' | 'kesz' | 'eredeti' | 'hiba'; az eredeti fotó az origPhotos-ban marad
  hatterFeldolgoz = async (file) => {
    const forras = (this.state.origPhotos || {})[file] || this.state.phonePhotos[file];
    if (!forras) return;
    this.setState({ hatter: { ...(this.state.hatter || {}), [file]: 'fut' } });
    try {
      const blob = await (await fetch(forras)).blob();
      const kivagott = await hatterEltavolit(blob);
      const s = this.state;
      if (!s.drops.includes(file)) return; // közben elvetették
      this.setState({
        origPhotos: { ...(s.origPhotos || {}), [file]: forras },
        phonePhotos: { ...s.phonePhotos, [file]: URL.createObjectURL(kivagott) },
        hatter: { ...(s.hatter || {}), [file]: 'kesz' },
      });
    } catch (e) {
      console.error('Háttér-eltávolítás:', e);
      this.setState({ hatter: { ...(this.state.hatter || {}), [file]: 'hiba' } });
    }
  };

  // kivágott <-> eredeti fotó váltása egy még el nem mentett fotónál
  hatterValt = (file) => {
    const s = this.state;
    const allapot = (s.hatter || {})[file];
    const eredeti = (s.origPhotos || {})[file];
    if (allapot === 'kesz' && eredeti) {
      this.setState({
        kivagottPhotos: { ...(s.kivagottPhotos || {}), [file]: s.phonePhotos[file] },
        phonePhotos: { ...s.phonePhotos, [file]: eredeti },
        hatter: { ...(s.hatter || {}), [file]: 'eredeti' },
      });
    } else if (allapot === 'eredeti' && (s.kivagottPhotos || {})[file]) {
      this.setState({
        phonePhotos: { ...s.phonePhotos, [file]: s.kivagottPhotos[file] },
        hatter: { ...(s.hatter || {}), [file]: 'kesz' },
      });
    } else if (allapot !== 'fut') {
      this.hatterFeldolgoz(file);
    }
  };

  // --- Háttér-eltávolítás egy már elmentett ruha fotójáról (és visszaállítás) ---
  realHatterItem = async (item) => {
    if (!item || !item.photoUrl) return;
    this.setState({ selHatter: 'fut' });
    try {
      const blob = await (await fetch(item.photoUrl)).blob();
      const kivagott = await hatterEltavolit(blob);
      const up = await fetch('/api/photos', { method: 'POST', headers: { 'content-type': kivagott.type || 'image/webp' }, body: kivagott });
      if (!up.ok) throw new Error('feltöltés: ' + up.status);
      const ujUrl = (await up.json()).url;
      let szin = null;
      try { szin = await szinFelismer(URL.createObjectURL(kivagott)); } catch (e) { /* marad a régi szín */ }
      await fetch('/api/items/' + item.id, {
        method: 'PATCH', headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.assign({ photoUrl: ujUrl, origPhotoUrl: item.photoUrl }, szin ? { color: szin.nev, colorHex: szin.hex } : {})),
      });
      this.setState({ selHatter: '' });
      await this.reloadItems();
    } catch (e) {
      console.error('Háttér-eltávolítás:', e);
      this.setState({ selHatter: 'hiba' });
    }
  };

  // --- Háttér-eltávolítás az összes még hátteres fotóról (a próbababához) ---
  // Egymás után (a modell sok memóriát használ); minden kész darab után frissül a
  // szekrény, így a babán rögtön látszik. Az eredeti fotó megmarad (visszaállítható).
  realHatterMind = async () => {
    if (this.state.hatterMind) return;
    const lista = (this.state.items || []).filter((it) => it.photoUrl && !it.origPhotoUrl && !it.removedAt);
    if (!lista.length) return;
    let kesz = 0, hiba = 0;
    this.setState({ hatterMind: { kesz: 0, ossz: lista.length, hiba: 0 } });
    for (const item of lista) {
      try {
        const blob = await (await fetch(item.photoUrl)).blob();
        const kivagott = await hatterEltavolit(blob);
        const up = await fetch('/api/photos', { method: 'POST', headers: { 'content-type': kivagott.type || 'image/webp' }, body: kivagott });
        if (!up.ok) throw new Error('feltöltés: ' + up.status);
        const ujUrl = (await up.json()).url;
        let szin = null;
        try { szin = await szinFelismer(URL.createObjectURL(kivagott)); } catch (e) { /* marad a régi szín */ }
        await fetch('/api/items/' + item.id, {
          method: 'PATCH', headers: { 'content-type': 'application/json' },
          body: JSON.stringify(Object.assign({ photoUrl: ujUrl, origPhotoUrl: item.photoUrl }, szin ? { color: szin.nev, colorHex: szin.hex } : {})),
        });
        kesz++;
        await this.reloadItems();
      } catch (e) {
        console.error('Háttér-eltávolítás (' + item.label + '):', e);
        hiba++;
      }
      this.setState({ hatterMind: { kesz: kesz + hiba, ossz: lista.length, hiba } });
    }
    this.setState({
      hatterMind: null,
      hatterMindUzenet: hiba
        ? kesz + ' fotóról levettem a hátteret, ' + hiba + ' nem sikerült.'
        : kesz + ' fotóról levettem a hátteret – a babán most már csak maguk a ruhák látszanak.',
    });
  };

  // szennyesbe / kimosva, javításra vár / megjavítva
  realAllapot = async (id, patch) => {
    await fetch('/api/items/' + id, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(patch) });
    await this.reloadItems();
  };

  // Az összes olyan ruha színének felismerése, amelyiknek van fotója, de még nincs színe
  realSzinekFelismer = async () => {
    const kell = (this.state.items || []).filter((it) => !it.removedAt && it.photoUrl && !it.color);
    if (!kell.length || this.state.szinFut) return;
    this.setState({ szinFut: { kesz: 0, ossz: kell.length } });
    for (let i = 0; i < kell.length; i++) {
      try {
        const sz = await szinFelismer(kell[i].photoUrl);
        if (sz) await fetch('/api/items/' + kell[i].id, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ color: sz.nev, colorHex: sz.hex }) });
      } catch (e) { /* ennél a fotónál nem sikerült, megyünk tovább */ }
      this.setState({ szinFut: { kesz: i + 1, ossz: kell.length } });
    }
    this.setState({ szinFut: null });
    await this.reloadItems();
  };

  realEredetiItem = async (item) => {
    if (!item || !item.origPhotoUrl) return;
    await fetch('/api/items/' + item.id, {
      method: 'PATCH', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ photoUrl: item.origPhotoUrl, origPhotoUrl: null }),
    });
    await this.reloadItems();
  };

  // --- Hozzáadás a katalógusból ---
  // A kiválasztott termék a fotókkal közös "drops" listába kerül: kap egy
  // márkakártya-képet, nevet ("Nike Air Force 1 '07") és - ha kitalálható -
  // kategóriát. Mentéskor ugyanúgy jön létre a ruha, mint egy fotóból.
  // Ha már a listában van, a gomb újbóli megnyomása kiveszi onnan.
  katValt = async (t, kategoriak) => {
    const marVan = (this.state.katAdded || {})[t.key];
    if (marVan) {
      const s = this.state;
      const added = { ...(s.katAdded || {}) }; delete added[t.key];
      this.setState({ drops: s.drops.filter((f) => f !== marVan), katAdded: added });
      return;
    }
    // ha van termékfotó, az lesz a ruha képe; ha nincs, a márkakártya
    const kep = t.kep || await katKartya(t);
    const file = 'kat-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    const s = this.state; // a kép elkészülte után friss állapottal dolgozunk
    const kat = katKategoria(t.tipus, kategoriak);
    this.setState({
      dropBrands: { ...(s.dropBrands || {}), [file]: t.marka === 'eBay' || t.generikus ? null : t.marka },
      dropNoColor: t.kep ? (s.dropNoColor || {}) : { ...(s.dropNoColor || {}), [file]: true },
      drops: [...s.drops, file],
      phonePhotos: { ...s.phonePhotos, [file]: kep },
      dropNames: { ...(s.dropNames || {}), [file]: t.generikus ? t.nev : t.marka + ' ' + t.nev },
      dropCats: kat ? { ...s.dropCats, [file]: kat } : s.dropCats,
      katAdded: { ...(s.katAdded || {}), [t.key]: file },
    });
    // valódi termékfotónál a háttér is lekerül (a márkakártyánál nincs mit levágni)
    if (t.kep) this.hatterFeldolgoz(file);
  };

  // --- Fotók feltöltése a saját gépről ---
  // A kiválasztott vagy behúzott képeket ugyanabba a "drops" listába tesszük,
  // ahova a telefonos fotók is kerülnek. Előnézetnek a böngésző ad egy
  // ideiglenes "blob:" linket, és mentéskor ezt töltjük fel a szerverre
  // (ugyanúgy, mint a telefonos fotókat, lásd realSaveDrops).
  addLocalFiles = (fileList) => {
    const s = this.state;
    const drops = s.drops.slice();
    const photos = { ...s.phonePhotos };
    let skipped = 0;
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      // csak képeket fogadunk el
      if (!f.type || f.type.indexOf('image/') !== 0) {
        skipped = skipped + 1;
        continue;
      }
      // ha már van ilyen nevű fotó a listában, kap egy számot a végére
      let name = f.name;
      let n = 2;
      while (drops.indexOf(name) !== -1) {
        name = f.name + ' (' + n + ')';
        n = n + 1;
      }
      drops.push(name);
      photos[name] = URL.createObjectURL(f);
    }
    let msg = '';
    if (skipped > 0) msg = skipped + ' fájlt kihagytunk, mert nem kép.';
    const ujak = drops.filter((d) => !s.drops.includes(d));
    this.setState({ drops: drops, phonePhotos: photos, addErr: msg });
    // egymás után dolgozzuk fel őket (párhuzamosan túl sok memóriát venne)
    (async () => { for (const d of ujak) await this.hatterFeldolgoz(d); })();
  };

  // a rejtett <input type="file"> mezőt "megkattintjuk", így jön fel a tallózó ablak
  openFilePicker = () => {
    const input = document.getElementById('wardro-file-input');
    if (input) input.click();
  };

  onFilesChosen = (e) => {
    this.addLocalFiles(e.target.files);
    // kiürítjük, hogy ugyanazt a képet újra ki lehessen választani
    e.target.value = '';
  };

  // ez kell, különben a böngésző simán megnyitja a behúzott képet
  onFilesDragOver = (e) => {
    e.preventDefault();
  };

  onFilesDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files) {
      this.addLocalFiles(e.dataTransfer.files);
    }
  };

  disconnectPhone = () => {
    if (this.state.pairToken) fetch('/api/pair/' + this.state.pairToken + '/end', { method: 'POST' }).catch(() => {});
    this.closeWs();
    if (this._pairTick) { clearInterval(this._pairTick); this._pairTick = null; }
    this.setState({ paired: false, pairToken: '', qrSvgUrl: '', pairPhoneUrl: '', pairError: '', phoneCount: 0 });
  };

  // ==========================================================================
  // VALÓDI BACKEND: fiók, szekrény, kategóriák, outfitek
  // ==========================================================================
  // Minden itt lévő függvény a server/index.js API-ját hívja (ami a
  // ruhatar adatbázisba ír/olvas), nem a helyi state-et bütyköli közvetlenül
  // - utána mindig újratöltjük a friss listát a szerverről.

  // Oldal betöltésekor megnézzük, van-e már érvényes bejelentkezés (sütiből) -
  // így egy frissítés után sem esel vissza a bejelentkező képernyőre.
  // a megerősítő link után a szerver ide irányít vissza: ?verified=1 / expired / invalid
  verifyVisszajelzes() {
    let q = null;
    try { q = new URLSearchParams(location.search); } catch (e) { return; }
    const v = q.get('verified');
    if (!v) return;
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* nem baj */ }
    if (v === 'expired') this.setState({ auth: 'verify', verifyEmail: q.get('email') || '', verifyHiba: true, verifyMsg: 'Ez a megerősítő link már lejárt (24 óráig érvényes). Kérj újat az alábbi gombbal.' });
    else if (v === 'invalid') this.setState({ auth: 'login', lErr: 'Ez a megerősítő link érvénytelen vagy már felhasználták. Próbálj meg bejelentkezni.' });
    else if (v === '1') this.setState({ verifyKesz: true });
  }

  checkSession = async () => {
    this.verifyVisszajelzes();
    // jelszó-visszaállító link: előbb az új jelszó, a régi munkamenetet nem töltjük be
    if (this.resetLinkFigyel()) return;
    try {
      const r = await fetch('/api/auth/me');
      if (!r.ok) return;
      const data = await r.json();
      if (data.ok) await this.afterAuth(data.user);
    } catch (e) { /* nem fut a backend, vagy nincs munkamenet - marad a bejelentkező képernyő */ }
  };

  afterAuth = async (user) => {
    applyTheme(user.theme);
    this.setState({ realUser: user, auth: 'app', view: 'start', lErr: '', suErr: '', lPw: '', suPw: '' });
    await this.reloadAll();
  };

  reloadAll = async () => {
    await Promise.all([this.reloadCategories(), this.reloadItems(), this.reloadOutfits(), this.reloadCalendar()]);
  };
  reloadCategories = async () => {
    const r = await fetch('/api/categories');
    if (r.ok) { const d = await r.json(); this.setState({ categories: d.categories }); }
  };
  reloadItems = async () => {
    const r = await fetch('/api/items');
    if (r.ok) { const d = await r.json(); this.setState({ items: d.items }); }
  };
  reloadOutfits = async () => {
    const r = await fetch('/api/outfits');
    if (r.ok) { const d = await r.json(); this.setState({ outfits: d.outfits }); }
  };
  reloadCalendar = async () => {
    const r = await fetch('/api/calendar');
    if (!r.ok) return;
    const d = await r.json();
    const log = {};
    d.entries.forEach((e) => { log[e.day] = e.outfitId; });
    this.setState({ calendarLog: log });
  };

  realDoLogin = async () => {
    const s = this.state;
    if (!/.+@.+\..+/.test(s.lEmail.trim())) return this.setState({ lErr: 'Add meg az e-mail címed.' });
    if (!s.lPw) return this.setState({ lErr: 'Add meg a jelszavad.' });
    let r;
    try {
      r = await fetch('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: s.lEmail.trim(), password: s.lPw }) });
    } catch (e) {
      return this.setState({ lErr: 'Nem sikerült elérni a szervert. Ellenőrizd, hogy fut-e a helyi backend.' });
    }
    if (r.status === 403) {
      // a fiók még nincs megerősítve: újraküldés felajánlása
      return this.setState({ auth: 'verify', verifyEmail: s.lEmail.trim(), verifyMsg: 'A fiókod még nincs megerősítve. Kattints a regisztrációkor kapott e-mailben lévő linkre, vagy kérj újat.', verifyHiba: false, lPw: '' });
    }
    if (r.status === 429) {
      const j = await r.json().catch(() => ({}));
      return this.setState({ lErr: 'Túl sok sikertelen próbálkozás, ezért a belépést ideiglenesen zároltuk. Próbáld újra ' + percSzoveg(j.retryAfter) + ' múlva, vagy állíts be új jelszót az „Elfelejtett jelszó?” linkkel.', resetSent: '' });
    }
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      const marad = typeof j.attemptsLeft === 'number' ? j.attemptsLeft : null;
      return this.setState({ resetSent: '', lErr: 'Hibás e-mail cím vagy jelszó.' + (marad !== null && marad <= 2
        ? ' Még ' + marad + ' próbálkozásod van, utána 15 percre zároljuk a belépést.' : '') });
    }
    const data = await r.json();
    await this.afterAuth(data.user);
  };

  // --- Elfelejtett jelszó ---
  // 1) a bejelentkezésnél: visszaállító link kérése e-mailben
  realForgot = async () => {
    const s = this.state;
    const email = (s.lEmail || '').trim();
    if (!/.+@.+\..+/.test(email)) return this.setState({ lErr: 'Először add meg az e-mail címed, majd koppints az Elfelejtett jelszóra.', resetSent: '' });
    if (s.forgotKuld) return;
    this.setState({ forgotKuld: true, lErr: '', resetSent: '' });
    let r = null;
    try {
      r = await fetch('/api/auth/forgot', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) });
    } catch (e) { r = null; }
    if (!r) return this.setState({ forgotKuld: false, lErr: 'Nem sikerült elérni a szervert. Ellenőrizd, hogy fut-e a helyi backend.' });
    const j = await r.json().catch(() => ({}));
    if (r.status === 429) return this.setState({ forgotKuld: false, lErr: 'Túl sok kérés érkezett. Próbáld újra ' + percSzoveg(j.retryAfter) + ' múlva.' });
    if (!r.ok) return this.setState({ forgotKuld: false, lErr: 'Ez az e-mail cím nem tűnik helyesnek.' });
    this.setState({ forgotKuld: false, resetSent: email, resetNoMail: j.mailConfigured === false });
  };

  // 2) a levélben lévő link ide hoz vissza: /?reset=<token>
  resetLinkFigyel() {
    let q = null;
    try { q = new URLSearchParams(location.search); } catch (e) { return false; }
    const token = q.get('reset');
    if (!token) return false;
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* nem baj */ }
    this.setState({ auth: 'reset', rToken: token, rPw: '', rPw2: '', rErr: '', rAllapot: 'ellenoriz', rEmail: '' });
    fetch('/api/auth/reset?token=' + encodeURIComponent(token))
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (r.ok) this.setState({ rAllapot: 'urlap', rEmail: j.email || '' });
        else this.setState({ rAllapot: r.status === 410 ? 'lejart' : 'ervenytelen' });
      })
      .catch(() => this.setState({ rAllapot: 'urlap' }));
    return true;
  }

  // 3) az új jelszó elküldése: siker esetén rögtön belépünk
  realResetPassword = async () => {
    const s = this.state;
    if ((s.rPw || '').length < 8) return this.setState({ rErr: 'Az új jelszónak legalább 8 karakteresnek kell lennie.' });
    if (s.rPw !== s.rPw2) return this.setState({ rErr: 'A két jelszó nem egyezik.' });
    if (s.rKuld) return;
    this.setState({ rKuld: true, rErr: '' });
    let r = null;
    try {
      r = await fetch('/api/auth/reset', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: s.rToken, password: s.rPw }) });
    } catch (e) { r = null; }
    if (!r) return this.setState({ rKuld: false, rErr: 'Nem sikerült elérni a szervert. Ellenőrizd, hogy fut-e a helyi backend.' });
    const j = await r.json().catch(() => ({}));
    if (r.status === 410) return this.setState({ rKuld: false, rAllapot: 'lejart' });
    if (r.status === 404) return this.setState({ rKuld: false, rAllapot: 'ervenytelen' });
    if (!r.ok) return this.setState({ rKuld: false, rErr: 'Nem sikerült menteni az új jelszót.' });
    this.setState({ rKuld: false, rToken: '', rPw: '', rPw2: '' });
    await this.afterAuth(j.user);
  };

  // megerősítő e-mail újraküldése
  realResend = async () => {
    const s = this.state;
    if (!s.verifyEmail || s.verifyKuld) return;
    this.setState({ verifyKuld: true });
    let r = null;
    try {
      r = await fetch('/api/auth/resend', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: s.verifyEmail }) });
    } catch (e) { r = null; }
    if (!r) return this.setState({ verifyKuld: false, verifyHiba: true, verifyMsg: 'Nem sikerült elérni a szervert. Ellenőrizd, hogy fut-e a helyi backend.' });
    if (r.status === 429) return this.setState({ verifyKuld: false, verifyHiba: true, verifyMsg: 'Egy percen belül már küldtünk egyet – várj egy kicsit, mielőtt újat kérsz.' });
    const j = await r.json().catch(() => ({}));
    this.setState({
      verifyKuld: false, verifyHiba: false,
      verifyMsg: j.mailConfigured === false
        ? 'Új link készült. (Az e-mail-küldés még nincs beállítva a szerveren, ezért a link a szerver ablakában jelent meg.)'
        : 'Elküldtük az új megerősítő e-mailt. Nézd meg a beérkezett leveleid (és a spam mappát is).',
    });
  };

  realDoSignup = async () => {
    const s = this.state;
    if (!s.suName.trim()) return this.setState({ suErr: 'Add meg a neved.' });
    if (!/.+@.+\..+/.test(s.suEmail.trim())) return this.setState({ suErr: "Ez az e-mail cím nem tűnik helyesnek." });
    if (s.suPw.length < 8) return this.setState({ suErr: 'A jelszónak legalább 8 karakteresnek kell lennie.' });
    if (!s.suGender) return this.setState({ suErr: 'Válaszd a Férfit vagy a Nőt a folytatáshoz.' });
    let r;
    try {
      r = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: s.suName.trim(), email: s.suEmail.trim(), password: s.suPw, profile: s.suGender }),
      });
    } catch (e) {
      return this.setState({ suErr: 'Nem sikerült elérni a szervert. Ellenőrizd, hogy fut-e a helyi backend.' });
    }
    if (r.status === 409) return this.setState({ suErr: 'Ezzel az e-mail címmel már van fiók.' });
    if (!r.ok) return this.setState({ suErr: 'Nem sikerült a regisztráció.' });
    const data = await r.json();
    if (data.needsVerification) {
      // nem lépünk be: előbb a megerősítő e-mailben lévő linkre kell kattintani
      return this.setState({
        auth: 'verify', verifyEmail: data.email, suPw: '', suErr: '', verifyHiba: false,
        verifyMsg: data.mailConfigured === false
          ? 'Az e-mail-küldés még nincs beállítva a szerveren, ezért a megerősítő link a szerver ablakában jelent meg – nyisd meg onnan.'
          : (data.mailSent ? '' : 'A levelet most nem sikerült elküldeni. Próbáld újraküldeni egy perc múlva.'),
      });
    }
    await this.afterAuth(data.user);
  };

  realLogOut = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (e) { /* mindegy, helyben úgyis kijelentkeztetünk */ }
    this.setState({ realUser: null, categories: [], items: [], outfits: [], calendarLog: {}, auth: 'login', lEmail: '', lPw: '', sel: null, editOpen: false, view: 'start' });
  };

  realAddCategory = async () => {
    const name = (this.state.newCat || '').trim();
    if (!name) return;
    const r = await fetch('/api/categories', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name }) });
    if (r.ok) { this.setState({ newCat: '' }); await this.reloadCategories(); }
  };
  realRenameCategory = async (id, name) => {
    await fetch('/api/categories/' + id, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name }) });
    await this.reloadCategories();
  };
  realDeleteCategory = async (id) => {
    await fetch('/api/categories/' + id, { method: 'DELETE' });
    // a benne lévő ruhák category_id-ja NULL lesz a szerveren, ezért az items-et is frissítjük
    await Promise.all([this.reloadCategories(), this.reloadItems()]);
  };

  realSelectItem = (item) => () => this.setState({ view: 'wardrobe', editOpen: false, sel: { id: item.id } });

  realWearItem = async (id) => {
    await fetch('/api/items/' + id, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ wornToday: true }) });
    await this.reloadItems();
  };
  realRemoveItem = async (id) => {
    await fetch('/api/items/' + id + '/remove', { method: 'POST' });
    this.setState({ sel: null, lastGoneId: id });
    await this.reloadItems();
  };
  realRestoreItem = async (id) => {
    await fetch('/api/items/' + id + '/restore', { method: 'POST' });
    if (this.state.lastGoneId === id) this.setState({ lastGoneId: null });
    await this.reloadItems();
  };
  realPurgeAllRemoved = async () => {
    const removed = this.state.items.filter((it) => it.removedAt);
    for (let i = 0; i < removed.length; i++) {
      await fetch('/api/items/' + removed[i].id, { method: 'DELETE' });
    }
    await this.reloadItems();
  };
  realSaveItemEdit = async (id, patch) => {
    await fetch('/api/items/' + id, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(patch) });
    this.setState({ editOpen: false });
    await this.reloadItems();
  };

  // A "drops" (beejtett/telefonról küldött fotók) mentése valódi ruhaként.
  // Ha a fotó a telefonos QR-párosításból jött, az csak a párosítási
  // munkamenet alatt él a szerveren - ezért előbb letöltjük a böngészőben,
  // majd újra feltöltjük a tartós /api/photos tárba, hogy ne vesszen el.
  realSaveDrops = async () => {
    const s = this.state;
    // ezekhez még nincs kategória, ezeket nem mentjük, hanem itt hagyjuk a listában
    const leftover = [];
    for (let i = 0; i < s.drops.length; i++) {
      const file = s.drops[i];
      const catName = s.dropCats[file];
      if (!catName) {
        leftover.push(file);
        continue;
      }
      const cat = s.categories.find((c) => c.name === catName);
      const label = ((s.dropNames || {})[file] || '').trim() || 'darab';
      // fotó feltöltése a tartós tárba (a böngészőben lévő / telefonos kép átmásolása)
      const feltolt = async (url) => {
        try {
          const blob = await (await fetch(url)).blob();
          const upRes = await fetch('/api/photos', { method: 'POST', headers: { 'content-type': blob.type || 'image/jpeg' }, body: blob });
          if (upRes.ok) return (await upRes.json()).url;
        } catch (e) { /* ha nem sikerül, a darab fotó nélkül jön létre */ }
        return null;
      };
      const phoneUrl = s.phonePhotos[file];
      const photoUrl = phoneUrl ? await feltolt(phoneUrl) : null;
      // ha a háttér el lett távolítva, az eredetit is eltesszük (vissza lehet állítani)
      const eredeti = (s.hatter || {})[file] === 'kesz' && (s.origPhotos || {})[file];
      const origPhotoUrl = eredeti ? await feltolt(eredeti) : null;
      const ar = ((s.dropPrices || {})[file] || '').replace(/[^0-9]/g, '');
      // szín a fotóból (a márkakártyánál nem, mert az a márka színe, nem a ruháé)
      let szin = null;
      if (phoneUrl && !(s.dropNoColor || {})[file]) {
        try { szin = await szinFelismer(phoneUrl); } catch (e) { /* szín nélkül is mentjük */ }
      }
      await fetch('/api/items', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          label: label, categoryId: cat ? cat.id : null, photoUrl: photoUrl, origPhotoUrl: origPhotoUrl, price: ar ? Number(ar) : null,
          color: szin ? szin.nev : null, colorHex: szin ? szin.hex : null, brand: (s.dropBrands || {})[file] || null,
        }),
      });
    }

    if (leftover.length === 0) {
      // minden mentve, mehetünk a kezdőlapra
      this.setState({ dropNames: {}, view: 'home', drops: [], dropCats: {}, phonePhotos: {}, addErr: '', dropPrices: {}, hatter: {}, origPhotos: {}, kivagottPhotos: {} });
    } else {
      // a kategória nélküli fotók maradnak, hogy be lehessen sorolni őket
      const savedCount = s.drops.length - leftover.length;
      this.setState({
        drops: leftover,
        addErr: savedCount + ' darab elmentve. A többinek még válassz kategóriát.',
      });
    }
    await this.reloadItems();
  };

  realSaveOutfit = async () => {
    const s = this.state;
    const p = s.bPicks;
    if (!(p.top && p.bottom && p.shoes)) return;
    const itemIds = [p.top, p.bottom, p.shoes];
    if (p.extra) itemIds.push(p.extra);
    (s.bMore || []).forEach((k) => { if (p[k]) itemIds.push(p[k]); });
    await fetch('/api/outfits', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: s.bName.trim() || (s.bOcc || 'Új') + ' outfit',
        occasion: s.bOcc || 'Bármilyen alkalom',
        season: s.bSeason || 'Bármilyen évszak',
        itemIds: itemIds,
        // alapból a mai napra kerül a naptárba (vagy arra a napra, ahonnan
        // a naptárból indította az összeállítást)
        logDay: s.bLogDay || dayKey(new Date()),
      }),
    });
    const backToCalendar = !!s.bLogDay;
    this.setState({ view: backToCalendar ? 'calendar' : 'outfits', oi: 0, bSlot: '', bPicks: {}, bMore: [], bName: '', bOcc: '', bSeason: '', bLogDay: '' });
    await Promise.all([this.reloadOutfits(), this.reloadCalendar()]);
  };
  realDeleteOutfit = async (id) => {
    await fetch('/api/outfits/' + id, { method: 'DELETE' });
    this.setState({ oi: 0 });
    // a törölt outfit a naptárból is eltűnik (adatbázis: ON DELETE CASCADE)
    await Promise.all([this.reloadOutfits(), this.reloadCalendar()]);
  };
  realSetDayOutfit = async (day, outfitId) => {
    this.setState({ calendarLog: { ...this.state.calendarLog, [day]: outfitId } });
    await fetch('/api/calendar/' + day, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ outfitId }) });
    await this.reloadCalendar();
  };
  realClearDay = async (day) => {
    const log = { ...this.state.calendarLog };
    delete log[day];
    this.setState({ calendarLog: log });
    await fetch('/api/calendar/' + day, { method: 'DELETE' });
    await this.reloadCalendar();
  };
  realToggleFavOutfit = async (outfit) => {
    await fetch('/api/outfits/' + outfit.id, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ favourite: !outfit.favourite }) });
    await this.reloadOutfits();
  };
  realWearOutfit = async (id) => {
    await fetch('/api/outfits/' + id, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ wornToday: true }) });
    await this.realSetDayOutfit(dayKey(new Date()), id);
    await this.reloadOutfits();
  };

  realSaveSettings = async (patch) => {
    // a témát rögtön váltjuk, nem várjuk meg a szervert
    if (patch.theme) {
      applyTheme(patch.theme);
      this.setState({ realUser: { ...this.state.realUser, theme: patch.theme } });
    }
    const r = await fetch('/api/settings', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(patch) });
    if (r.ok) { const d = await r.json(); this.setState({ realUser: d.user }); }
  };

  // A név/e-mail mezőknek nincs külön "Mentés" gombjuk a sablonban (csak
  // onChange), ezért minden gépelés után csak egy rövid csendet követően
  // mentünk - különben minden leütésnél elküldenénk egy kérést a szervernek.
  debouncedSaveProfile = () => {
    clearTimeout(this._profileSaveTimer);
    this._profileSaveTimer = setTimeout(() => {
      const user = this.state.realUser;
      if (user) this.realSaveSettings({ name: user.name, email: user.email });
    }, 600);
  };

  // Ebből a jegyzetből sejteti a felület, mikor volt utoljára egy ruhán rajtad -
  // ugyanazt a szöveg-formátumot adja, mint a demó mintaadat, hogy a
  // monthsOf() és a "Legutóbb ... viselted" szöveg ugyanúgy működjön mindkét módban.
  noteFromLastWorn = (lastWornAt) => {
    if (!lastWornAt) return '';
    const months = Math.floor((Date.now() - lastWornAt) / (30 * 24 * 60 * 60 * 1000));
    if (months < 1) return '';
    if (months >= 12) return Math.round(months / 12) + ' éve nem viselted';
    return months + ' hónapja nem viselted';
  };

  // A sablon (.dc.html) összes változóját itt állítjuk elő az állapotból.
  // Két teljesen külön ág van: a DEMÓ (a ?start=app előnézet, kitalált
  // mintaadatokkal) és a VALÓDI (tényleges bejelentkezés, a backend
  // adatbázisából). A telefonos párosítás és az időjárás mindkettőben ugyanaz,
  // azt egy közös résszel egészítjük ki a végén.
  renderVals() {
    const s = this.state;
    const demoMode = !s.auth && (this.props.start === 'app' || this.props.start === 'firstLaunch');
    const base = demoMode ? this.renderDemoVals() : this.renderRealVals();
    // a naptár csak valódi fiókkal létezik - a demóban üres alapértékek kellenek,
    // hogy a sablon listái ne legyenek undefined-ok
    const calendarOff = { isCalendar: false, railCalendar: false, calWeekdays: [], calCells: [], calPickList: [], themeOptions: [],
      // fotófeltöltés: a demóban ezek nem csinálnak semmit
      onFilesChosen: () => {}, onFilesDragOver: (e) => e.preventDefault(), onFilesDrop: (e) => e.preventDefault(), addErr: '' };
    const all = Object.assign(calendarOff, base, this.renderSharedVals(), this.renderKatalogusVals(base), this.renderUjVals(base), this.renderOkosVals(base));
    Object.assign(all, this.renderStartVals(all));
    Object.assign(all, this.renderBuilderChipVals(all));
    if (!all.themeOptions || !all.themeOptions.length) {
      // demó: nincs fiók, ezért a téma csak ezen a gépen vált (a bejelentkezés után a fiókodhoz mentjük)
      const aktiv = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
      all.themeOptions = THEMES.map((t) => {
        const on = aktiv === t.key;
        return {
          label: t.label, hint: t.hint,
          swatches: t.swatches.map((c) => ({ color: c })),
          border: on ? '2px solid var(--m-accent)' : '1px solid var(--m-line-strong)',
          bg: on ? 'var(--c-f1eadd)' : 'var(--c-f6f1e7)',
          mark: on ? '✓' : '',
          on: () => { applyTheme(t.key); this.setState({ demoTheme: t.key }); },
        };
      });
    }
    Object.assign(all, this.renderStylistVals(all));
    Object.assign(all, this.renderWeatherVals(all));
    Object.assign(all, this.renderSzennyesVals(all));
    Object.assign(all, this.renderVasarlasVals(all));
    Object.assign(all, this.renderCareVals(all));
    // próbababa: női fióknál női sziluett (valódi fióknál a regisztrációkor választott profil, a demóban a Férfi/Nő választás)
    const nem = s.realUser ? s.realUser.profile : (s.who || this.props.profile || 'Male');
    // telefonon a jobb panel alsó lapként (bottom sheet) jön fel, ha éppen kell: kijelölt ruha
    // a Szekrényben, vagy az összeállítóban egy helyre koppintva a ruhaválasztó
    const mobLap = (s.view === 'wardrobe' && !!s.sel) || (s.view === 'builder' && !!s.bLap && !!s.bSlot);
    all.mobLapBezar = () => this.setState(s.view === 'builder' ? { bLap: false } : { sel: null, editOpen: false });
    all.gridMod = [all.gridMod || '', nem === 'Female' ? 'is-female' : '', mobLap ? 'is-mob-lap' : ''].filter(Boolean).join(' ');
    Object.assign(all, this.navCsoportok(all.navItems || []));
    return all;
  }

  // ==========================================================================
  // MENÜ: a fő pontok külön, a többi két nyitható csoportban; a Beállítások a
  // fogaskerékre került (az oldalsáv tetején, telefonon az alsó sávban).
  // Széles képernyőn a csoport lenyílik, telefonon egy kis panel nyílik fölötte.
  // A csoport magától nyitva van, ha benne van az épp nyitott oldal.
  // ==========================================================================
  navCsoportok(items) {
    const s = this.state;
    const beall = items.find((n) => n.icon === 'settings');
    const CSOP = [
      { key: 'okos', label: 'Okos eszközök', icon: 'sparkle', ikonok: ['stylist', 'bag', 'weather', 'okos'] },
      { key: 'rend', label: 'Rendszerezés', icon: 'layers', ikonok: ['calendar', 'laundry', 'untouched', 'removed'] },
    ];
    const nyit = s.navNyit || {};
    const telefon = () => { try { return window.matchMedia('(max-width: 760px)').matches; } catch (e) { return false; } };
    const allit = (key, ertek) => {
      const uj = { ...(this.state.navNyit || {}), [key]: ertek };
      try { localStorage.setItem('wardro-nav-nyit', JSON.stringify(uj)); } catch (e) { /* nincs tároló */ }
      this.setState({ navNyit: uj });
    };
    const kimarad = new Set(['settings']);
    CSOP.forEach((c) => c.ikonok.forEach((i) => kimarad.add(i)));
    const sima = (n) => ({ ...n, sima: true, csoport: false });
    // a fő pontok (Főoldal, Ma, Szekrény, Outfitek) után jönnek a csoportok
    const out = items.filter((n) => !kimarad.has(n.icon)).map(sima);
    const csoportok = CSOP.map((c) => {
      const elemek = c.ikonok.map((i) => items.find((n) => n.icon === i)).filter(Boolean);
      if (!elemek.length) return null;
      const aktiv = elemek.some((n) => /is-active/.test(n.cls || ''));
      const lenyitva = nyit[c.key] === true || (nyit[c.key] === undefined && aktiv);
      // telefonon a panel csak kifejezett koppintásra nyílik
      const panel = nyit[c.key] === true;
      return {
        sima: false, csoport: true, label: c.label, icon: c.icon,
        db: String(elemek.length),
        cls: [lenyitva ? 'is-nyitva' : '', panel ? 'is-panel' : '', aktiv ? 'is-benne' : ''].filter(Boolean).join(' '),
        fejCls: aktiv ? 'is-active-csop' : '',
        aktivNev: aktiv ? (elemek.find((n) => /is-active/.test(n.cls || '')) || {}).label : '',
        on: () => allit(c.key, telefon() ? !panel : !lenyitva),
        bezar: () => allit(c.key, undefined),
        elemek: elemek.map((n) => ({
          ...n,
          on: () => { if (telefon()) allit(c.key, undefined); n.on(); },
        })),
      };
    }).filter(Boolean);
    csoportok.forEach((c) => { c.cls += ' is-asztali'; });
    out.push(...csoportok);
    // telefonon a két csoport és a Beállítások egyetlen "Több" gombban (az alsó sáv kicsi)
    const tobbElemek = [...CSOP.flatMap((c) => c.ikonok.map((i) => items.find((n) => n.icon === i))), beall && { ...beall, icon: 'gear' }].filter(Boolean);
    if (tobbElemek.length) {
      const aktiv = tobbElemek.some((n) => /is-active/.test(n.cls || ''));
      const panel = nyit.tobb === true;
      out.push({
        sima: false, csoport: true, label: 'Több', icon: 'layers', db: String(tobbElemek.length),
        cls: ['is-mobil', panel ? 'is-panel' : ''].filter(Boolean).join(' '),
        fejCls: aktiv ? 'is-active-csop' : '',
        on: () => allit('tobb', !panel),
        bezar: () => allit('tobb', undefined),
        elemek: tobbElemek.map((n) => ({ ...n, on: () => { allit('tobb', undefined); n.on(); } })),
      });
    }
    return {
      navItems: out,
      settingsCls: beall && /is-active/.test(beall.cls || '') ? 'is-active' : '',
      toSettingsGear: beall ? beall.on : () => this.setState({ view: 'settings', sel: null, editOpen: false }),
    };
  }

  // ==========================================================================
  // OUTFIT-ÖSSZEÁLLÍTÓ: alkalom és évszak – nem kötött lista
  // Az alapértékek mellé beírhatsz sajátot is ("+ Saját"); ezeket megjegyezzük
  // (ezen a gépen), és a már elmentett outfitjeid alkalmait / évszakait is
  // felajánljuk. A saját opció × gombbal törölhető, a kijelölt újra kattintva levehető.
  // ==========================================================================
  builderSajat(kulcs) {
    try { const x = JSON.parse(localStorage.getItem('wardro.' + kulcs) || '[]'); return Array.isArray(x) ? x : []; } catch (e) { return []; }
  }

  builderSajatMent(kulcs, lista) {
    try { localStorage.setItem('wardro.' + kulcs, JSON.stringify(lista)); } catch (e) { /* privát mód: csak erre a munkamenetre marad meg */ }
  }

  renderBuilderChipVals(v) {
    const s = this.state;
    // a már elmentett outfitek alkalmai / évszakai (a "Munka · Hideg" alcímből)
    const hasznalt = (v.outfitList || []).map((o) => String(o.sub || '').split(' · '));
    const kisbetu = (x) => x.toLocaleLowerCase('hu-HU');
    const csoport = (kulcs, stateKey, alap, hasznaltIdx, maxHossz, placeholder) => {
      const sajat = s[kulcs] || this.builderSajat(kulcs);
      const korabbi = hasznalt.map((x) => x[hasznaltIdx]).filter((x) => x && !/^Bármilyen/.test(x));
      const opciok = [];
      [...alap, ...korabbi, ...sajat].forEach((x) => { if (x && !opciok.some((y) => kisbetu(y) === kisbetu(x))) opciok.push(x); });
      const aktiv = s[stateKey];
      if (aktiv && !opciok.some((y) => kisbetu(y) === kisbetu(aktiv))) opciok.push(aktiv);
      const zar = { [kulcs + 'Nyitva']: false, [kulcs + 'Input']: '' };
      const hozzaad = () => {
        const ertek = (this.state[kulcs + 'Input'] || '').trim().replace(/\s+/g, ' ').slice(0, maxHossz);
        if (!ertek) { this.setState(zar); return; }
        const meglevo = opciok.find((y) => kisbetu(y) === kisbetu(ertek));
        const ujLista = meglevo ? sajat : [...sajat, ertek];
        if (!meglevo) this.builderSajatMent(kulcs, ujLista);
        this.setState({ ...zar, [kulcs]: ujLista, [stateKey]: meglevo || ertek });
      };
      return {
        chips: opciok.map((x) => {
          const on = aktiv === x;
          return {
            label: x,
            bg: on ? 'var(--c-57462f)' : 'var(--c-f6f1e7)',
            fg: on ? 'var(--c-f6f1e7)' : 'var(--c-6b5940)',
            on: () => this.setState({ [stateKey]: on ? '' : x }),
            custom: sajat.includes(x) && !alap.includes(x),
            remove: (e) => {
              if (e && e.stopPropagation) e.stopPropagation();
              const ujLista = sajat.filter((y) => y !== x);
              this.builderSajatMent(kulcs, ujLista);
              this.setState({ [kulcs]: ujLista, [stateKey]: aktiv === x ? '' : aktiv });
            },
          };
        }),
        nyitva: !!s[kulcs + 'Nyitva'],
        bevitel: s[kulcs + 'Input'] || '',
        placeholder,
        maxHossz: String(maxHossz),
        nyit: () => {
          this.setState({ [kulcs + 'Nyitva']: true });
          setTimeout(() => { const el = document.querySelector('.we-b-add-field[data-k="' + kulcs + '"]'); if (el) el.focus(); }, 40);
        },
        onInput: (e) => this.setState({ [kulcs + 'Input']: e.target.value }),
        onKey: (e) => {
          if (e.key === 'Enter') { e.preventDefault(); hozzaad(); }
          if (e.key === 'Escape') this.setState(zar);
        },
        hozzaad,
        megse: () => this.setState(zar),
      };
    };
    const alk = csoport('bOccSajat', 'bOcc', ['Munka', 'Hétvége', 'Program'], 0, 40, 'pl. Esküvő, Randi, Edzés…');
    const evs = csoport('bSeasonSajat', 'bSeason', ['Meleg', 'Enyhe', 'Hideg'], 1, 20, 'pl. Esős, Tél, Nyár…');
    return {
      bOccasions: alk.chips, bOccNyitva: alk.nyitva, bOccZarva: !alk.nyitva, bOccInput: alk.bevitel, bOccPlaceholder: alk.placeholder, bOccMax: alk.maxHossz,
      openBOcc: alk.nyit, onBOccInput: alk.onInput, onBOccKey: alk.onKey, addBOcc: alk.hozzaad, cancelBOcc: alk.megse,
      bSeasons: evs.chips, bSeasonNyitva: evs.nyitva, bSeasonZarva: !evs.nyitva, bSeasonInput: evs.bevitel, bSeasonPlaceholder: evs.placeholder, bSeasonMax: evs.maxHossz,
      openBSeason: evs.nyit, onBSeasonInput: evs.onInput, onBSeasonKey: evs.onKey, addBSeason: evs.hozzaad, cancelBSeason: evs.megse,
    };
  }

  // ==========================================================================
  // STYLIST – AI-szerű beszélgetős outfit-összeállító
  // Helyben fut (nem kell hozzá külső szolgáltatás): a magyar szövegből
  // kiolvassa az alkalmat, a stílust, az időjárást és a színeket, a hiányzó
  // részletekre rákérdez, majd a SAJÁT ruháidból pontozással rak össze egy
  // outfitet. Utána finomítható ("elegánsabb", "cseréld a cipőt", "másikat"…).
  // ==========================================================================
  stylistKezdo() {
    return [{ from: 'bot', text: 'Szia! A Wardro stylistod vagyok. Mondd el, hova készülsz, vagy mit szeretnél ma felvenni – a saját ruháidból rakok össze neked egy outfitet.\n\nÍrj nyugodtan a saját szavaiddal, akár hosszan is – például: „esős időben megyek egy drága étterembe, de ne legyen fekete”, „egész nap a városban leszek, kényelmes legyen” vagy „állásinterjúm lesz, 5 fok van”.\n\nMondhatod azt is, melyik napra kell („holnap”, „szombaton” – megnézem az előrejelzést), kérdezhetsz színekről („mi illik a bordóhoz?”), és ha elakadsz, írd be: „mit tudsz?”.' }];
  }

  // pontozás: viselési előzmény + stílus + elegancia + időjárás + szín + kényelem + esemény + kért / kerülendő darabok
  stylistOsszerak(darabok, pref, mag, csere, tart) {
    const STILUS = {
      elegans: /\bing\b|ingek|bluz|blez|blaz|zako|oltony|chino|szovet|mokaszin|chelsea|csizm|\bbor\b|garbo|szokny|kosztum|felcip|oxford|loafer|derby|brogue|gyapju|kasmir|merino|karora|\bov\b|pliszir|ballon|trencs|ruha\b|nyakkend|mandzset|selyem|szaten|tweed|estelyi|koktel|magassark|tusark|blokksark|slingback|mary jane|balerin|gyongy|lakk|pantalo|galleros|pike|kabatruha|midi|clutch|boritek|peplum|organza|csipke/,
      laza: /polo|farmer|jean|denim|sneaker|pulover|pulcsi|hoodie|kapucn|tornacip|sportcip|rovidnadr|bermuda|vaszon|espadrille|converse|vans|szandal|taska|sapka|kord|top\b|triko|atleta|crop|tunika|kardigan|flanel|overal|kantaros|cargo|hatizsak/,
      sportos: /sport|melegit|futo|edzo|legging|fleece|jogger|trening|tornacip|sneaker|termo|kompresszio|softshell|szeldzs|nike|adidas|puma|asics|new balance|hoka|on running|reebok|under armour|salomon|north face|columbia|patagonia/,
      street: /hoodie|kapucn|cargo|sneaker|dunk|jordan|air max|air force|yeezy|oversize|bomber|sapka|beanie|puffer|varsity|corteiz|stussy|supreme|carhartt|palace|bape|off-white|baggy|grafika|feliratos|logo/,
    };
    const MELEG_JO = /polo|rovid|bermuda|szandal|papucs|espadrille|vaszon|\blen\b|top\b|triko|atleta|crop|ujjatlan|spagetti|muszlin|selyem|\bing\b|bluz/;
    const MELEG_ROSSZ = /pulover|pulcsi|garbo|gyapju|merino|moher|alpaka|kotott|csizm|bakancs|hotapos|kabat|puffer|steppelt|bunda|termo|fleece|kord|kasmir|hoodie/;
    const HIDEG_JO = /pulover|pulcsi|garbo|gyapju|merino|moher|alpaka|kotott|csizm|bakancs|hotapos|farmer|kord|fleece|termo|puffer|steppelt|bunda|kasmir|hoodie|chelsea|kesztyu|\bsal\b|sapka|beanie/;
    const HIDEG_ROSSZ = /rovid|bermuda|szandal|papucs|espadrille|balerin|top\b|triko|atleta|crop|ujjatlan|spagetti|muszlin|vaszon|\blen\b/;
    const ESO_JO = /csizm|bakancs|chelsea|boot|gumicsizm|vizallo|goretex|gore-tex/, ESO_ROSSZ = /vaszon|szandal|papucs|espadrille|balerin|feher sneaker|velur|szarvasbor|nubuk|selyem|szaten/;
    const ESO_KABAT = /vizallo|esokabat|ballon|trencs|softshell|parka|goretex|gore-tex|impregnal/;
    const KENYELMES = /sneaker|tornacip|sportcip|futocip|edzocip|air max|samba|new balance|hoka|on running|asics|ultraboost|vans|converse|birkenstock|crocs|slip/;
    const KENYELMETLEN = /mokaszin|felcip|oxford|magassark|tusark|platform|stiletto/;
    const rnd = prng(mag * 104729 + 7);
    const most = Date.now();
    const f = pref.f || 0;
    const stilus = pref.stilus && pref.stilus !== 'mindegy' ? pref.stilus
      : (f >= 2 ? 'elegans' : f <= -1.5 ? 'laza' : ({ munka: 'elegans', program: 'elegans', sport: 'sportos', buli: 'street', laza: 'laza' }[pref.alkalom] || ''));
    const kerul = new Set(csere || []);
    const marad = new Set(tart || []);
    const kell = (pref.kell || []).map((k) => ({ ...k, re: new RegExp(k.minta) }));
    const kerulDarab = (pref.kerul || []).map((k) => ({ ...k, re: new RegExp(k.minta) }));
    const szinNot = new Set(pref.szinNot || []);
    const paletta = new Set(pref.paletta || []);
    const komoly = ['interju', 'vizsga', 'temetes', 'templom', 'eskuvo'].includes(pref.ev);
    const pont = (d) => {
      const sz = styDarabSzoveg(d);
      const szin = styDarabSzin(d);
      const hely = helyDarab(d);
      const nap = d.lastWornAt ? (most - d.lastWornAt) / 864e5 : 45;
      let p = Math.min(nap, 90) * 0.35 + rnd() * 28 - (d.wornToday ? 40 : 0);
      if (stilus && STILUS[stilus] && STILUS[stilus].test(sz)) p += 45;
      if (stilus === 'elegans' && STILUS.sportos.test(sz) && !STILUS.elegans.test(sz)) p -= 35;
      if (stilus === 'sportos' && STILUS.elegans.test(sz)) p -= 35;
      // elegancia-szint: minél formálisabb az alkalom, annál többet ér az elegáns darab
      if (f >= 1) { if (STILUS.elegans.test(sz)) p += 12 * f; if (STILUS.sportos.test(sz) && !STILUS.elegans.test(sz)) p -= 10 * f; }
      if (f <= -1) { if (STILUS.laza.test(sz)) p += 8 * -f; if (STILUS.elegans.test(sz) && !STILUS.laza.test(sz)) p -= 8 * -f; }
      // időjárás
      if (pref.ido === 'meleg') { if (MELEG_JO.test(sz)) p += 20; if (MELEG_ROSSZ.test(sz)) p -= 30; }
      if (pref.ido === 'hideg' || pref.ido === 'eso') { if (HIDEG_JO.test(sz)) p += 20; if (HIDEG_ROSSZ.test(sz)) p -= 30; }
      if (pref.ido === 'eso' && hely === 'cipo') { if (ESO_JO.test(sz)) p += 40; if (ESO_ROSSZ.test(sz)) p -= 45; }
      if (pref.ido === 'eso' && hely === 'kabat') { if (ESO_KABAT.test(sz)) p += 35; if (/bunda|velur|szarvasbor|gyapju/.test(sz)) p -= 20; }
      // kényelem: sok séta, egész nap talpon
      if ((pref.k || 0) >= 1 && hely === 'cipo') { if (KENYELMES.test(sz)) p += 18 * pref.k; if (KENYELMETLEN.test(sz)) p -= 8 * pref.k; }
      // színek
      if (pref.arny === 'sotet') p += STY_SOTET.has(szin) ? 25 : (STY_VILAGOS.has(szin) ? -15 : 0);
      if (pref.arny === 'vilagos') p += STY_VILAGOS.has(szin) ? 25 : (STY_SOTET.has(szin) ? -15 : 0);
      if (pref.szin === 'semleges' && (!szin || SEMLEGES_SZIN.has(szin))) p += 15;
      if (pref.szin === 'szines' && szin && !SEMLEGES_SZIN.has(szin)) p += 25;
      if (pref.szin && SZIN_LISTA[pref.szin] && szin === pref.szin) p += 45;
      if (szin && paletta.has(szin)) p += 28;
      if (szin && szinNot.has(szin)) p -= 400;
      // melyik darabokat vegye elő: kedvencek, rég hordottak, újak
      if (pref.kedvenc) p += Math.min(d.wearCount || 0, 30) * 2.5;
      if (pref.ritka) p += Math.min(nap, 180) * 0.45 - Math.min(d.wearCount || 0, 20);
      if (pref.uj) { const kor = d.createdAt ? (most - d.createdAt) / 864e5 : 999; if (kor < 45) p += 60 - kor; if (!(d.wearCount > 0)) p += 15; }
      // különleges alkalmak
      if (pref.ev === 'temetes') p += (!szin || STY_SOTET.has(szin)) ? 40 : (SEMLEGES_SZIN.has(szin) ? 0 : -120);
      if (pref.ev === 'eskuvo' && szin === 'fehér') p -= 200; // vendégként nem viselünk fehéret
      if (pref.ev === 'eskuvo' && szin === 'fekete' && hely !== 'cipo' && hely !== 'kieg') p -= 30; // a csupa fekete inkább gyászos
      if (pref.ev === 'interju' || pref.ev === 'vizsga') { if (!szin || SEMLEGES_SZIN.has(szin)) p += 20; else p -= 30; if (STILUS.street.test(sz) || STILUS.sportos.test(sz)) p -= 40; }
      if (pref.ev === 'templom' && szin && !SEMLEGES_SZIN.has(szin)) p -= 25;
      if (pref.ev === 'templom' && /rovid|crop|ujjatlan|spagetti|mini/.test(sz)) p -= 40;
      if (pref.ev === 'temetes' && szin === 'fekete') p += 45;
      if (komoly && /csikos|mintas|kockas|virag|terepmint|grafika|feliratos|logo|flitter/.test(sz)) p -= 35; // komoly alkalomra egyszínű
      if (pref.ev === 'strand') { if (/rovid|bermuda|szandal|papucs|polo|top\b|triko|vaszon|furdo|bikini/.test(sz)) p += 30; if (MELEG_ROSSZ.test(sz)) p -= 40; }
      if (pref.ev === 'tura' && hely === 'cipo') { if (/bakancs|tura|sneaker|futocip|sportcip|salomon/.test(sz)) p += 40; if (/mokaszin|felcip|szandal|magassark|balerin/.test(sz)) p -= 40; }
      if (pref.ev === 'fesztival' && hely === 'cipo' && KENYELMES.test(sz)) p += 30;
      if (pref.ev === 'randi') { if (STILUS.elegans.test(sz)) p += 15; if (['piros', 'bordó', 'fekete', 'sötétkék'].includes(szin)) p += 12; if (STILUS.sportos.test(sz) && !STILUS.elegans.test(sz)) p -= 20; }
      if (pref.ev === 'karacsony') { if (['piros', 'bordó', 'sötétzöld', 'fehér'].includes(szin)) p += 25; if (/pulover|pulcsi|kotott|garbo|kardigan/.test(sz)) p += 15; }
      if (pref.ev === 'sieles') { if (hely === 'kabat' && /puffer|pufi|steppelt|pehely|toll|sidzs|anorak|parka|teli/.test(sz)) p += 40; if (hely === 'cipo') { if (/csizm|bakancs|hotapos/.test(sz)) p += 90; if (/sneaker|futocip|sportcip|vaszon|mokaszin|balerin|szandal/.test(sz)) p -= 40; } }
      if (pref.ev === 'kerti' && hely === 'cipo') { if (/tusark|magassark|stiletto/.test(sz)) p -= 45; if (KENYELMES.test(sz) || /szandal|vaszon|espadrille/.test(sz)) p += 20; }
      if (pref.ev === 'hajo' && hely === 'cipo') { if (/vaszon|mokaszin|loafer|espadrille|sneaker/.test(sz)) p += 25; if (/tusark|magassark|stiletto|csizm/.test(sz)) p -= 40; }
      if (pref.ev === 'hajo' && ['sötétkék', 'fehér'].includes(szin)) p += 15;
      if (pref.ev === 'hazimunka') { if (STILUS.elegans.test(sz) && !STILUS.laza.test(sz)) p -= 50; p += Math.min(nap, 120) * 0.2; }
      if (pref.ev === 'video') { if (hely === 'felso' && STILUS.elegans.test(sz)) p += 30; if (hely !== 'felso' && (STILUS.laza.test(sz) || KENYELMES.test(sz))) p += 15; }
      // kért és kerülendő darabok
      kell.forEach((k) => { if (k.re.test(sz)) p += (!k.szin || szin === k.szin) ? 300 : 110; });
      kerulDarab.forEach((k) => { if (k.re.test(sz) && (!k.szin || szin === k.szin)) p -= 500; });
      if ((pref.kellKulcs || []).includes(d.key)) p += 400;
      if (kerul.has(d.key)) p -= 500;
      if (marad.has(d.key)) p += 600; // a nem cserélt darabok a helyükön maradnak
      return p;
    };
    const valasztas = [];
    const legjobb = (h) => darabok.filter((d) => helyDarab(d) === h && !valasztas.includes(d))
      .map((d) => {
        const szin = styDarabSzin(d);
        const utkozik = szin && !SEMLEGES_SZIN.has(szin) && valasztas.some((x) => { const xs = styDarabSzin(x); return xs && !SEMLEGES_SZIN.has(xs) && xs !== szin; });
        return { d, p: pont(d) - (utkozik && pref.szin !== 'szines' && !paletta.has(szin) ? 40 : 0) };
      })
      .sort((a, b) => b.p - a.p)[0];
    const kellKabat = pref.ev !== 'strand' && (pref.kabat === true || pref.ev === 'sieles'
      || (pref.kabat !== false && (['hideg', 'eso', 'huvos'].includes(pref.ido) || (pref.ev === 'tura' && pref.ido !== 'meleg'))));
    const helyek = ['felso', 'also', 'cipo'];
    if (kellKabat) helyek.push('kabat');
    helyek.forEach((h) => { const x = legjobb(h); if (x) valasztas.push(x.d); });
    const kieg = legjobb('kieg');
    const kiegKell = kieg && kell.some((k) => k.re.test(styDarabSzoveg(kieg.d)));
    if (kieg && pref.kieg !== false && (kiegKell || pref.kieg === true || stilus === 'elegans' || marad.has(kieg.d.key) || (!marad.size && rnd() < 0.55)) && kieg.p > -100) valasztas.push(kieg.d);
    return { darabok: valasztas, stilus, kellKabat };
  }

  // a bot válasza egy felhasználói üzenetre
  stylistValasz(szoveg) {
    const s = this.state;
    const adat = this._sty || { darabok: [], valos: false };
    const darabok = adat.darabok.filter((d) => !d.inLaundry && !d.needsRepair);
    const tn = ' ' + styNorm(szoveg) + ' ';
    let pref = { ...(s.chatPref || {}) };
    let mag = s.chatMag || 1;
    const utolso = s.chatUtolso || null; // az utoljára ajánlott outfit darabjainak kulcsai
    const bot = (text, extra) => ({ from: 'bot', text, ...(extra || {}) });
    const ALAP_CHIPS = ['Valami laza a hétvégére', 'Esős időben megyek egy drága étterembe', 'Állásinterjúm lesz', 'Edzésre megyek'];

    if (/^\s*ruhak hozzaadasa\s*$/.test(tn)) {
      this.setState({ view: 'add', sel: null, editOpen: false });
      return null;
    }
    if (!darabok.length) {
      return { msgs: [bot('Még egy ruhát sem látok a szekrényedben, így nincs miből összeállítanom. Adj hozzá pár darabot (felsőt, alsót, cipőt), és utána szívesen segítek!')], chips: ['Ruhák hozzáadása'] };
    }
    if (/ elolrol | ujrakezd| kezdjuk ujra | uj beszelgetes | reset /.test(tn)) return { reset: true };

    const uj = styErtelmez(szoveg);
    const semmi = !Object.keys(uj.a).length && !Object.keys(uj.st).length && !uj.f && !uj.ido && !uj.k && !uj.arny && !uj.ev
      && !uj.szin && !uj.szinNot.length && !uj.kell.length && !uj.kerul.length && uj.kabat === undefined && uj.kieg === undefined
      && !uj.paletta && !uj.ritka && !uj.kedvenc && !uj.uj && !uj.nap && !uj.mindegy;

    // --- csevegés: köszönés, köszönet, hogylét, súgó ---
    if (semmi && /^ (szia|sziasztok|szius|hello|hellosztok|hali|halihoz|helo|szevasz|szeva|szervusz|csokolom|udv|udvozlet|jo napot|jo estet|jo reggelt|hey|hi|csa|csao|ciao|csumi|hahoo?) /.test(tn)) {
      return { msgs: [bot('Szia! 👋 Mesélj: hova mész ma, milyen idő van, és milyen hangulatban vagy? Minél többet írsz, annál pontosabb szettet rakok össze.')], chips: ALAP_CHIPS };
    }
    if (semmi && /(koszi|koszonom|kosz |kosszi|koszcsi|thx|thanks|thank you|koszike|koszke|halas vagyok)/.test(tn)) {
      return { msgs: [bot('Szívesen! Ha bármikor új szett kell, csak írj. 😊')], chips: utolso ? ['Másikat kérek', 'Kezdjük újra'] : ALAP_CHIPS };
    }
    if (semmi && /(hogy vagy|hogy vagytok|mi ujsag|mizu|hogy megy|how are you)/.test(tn)) {
      return { msgs: [bot('Köszönöm, remekül – épp a szekrényedet nézegetem. 😊 És te? Hova készülsz ma?')], chips: ALAP_CHIPS };
    }
    if (semmi && /(ki vagy|mi vagy|robot vagy|ember vagy|ai vagy|mesterseges)/.test(tn)) {
      return { msgs: [bot('A Wardro stylistja vagyok: a saját ruháidból rakok össze szetteket az alkalomhoz, az időjáráshoz és a hangulatodhoz. Semmit nem kell megvenned – abból dolgozom, ami már megvan.')], chips: ALAP_CHIPS };
    }
    if (/(mit tudsz|mire vagy kepes|hogyan mukodsz|hogy mukodik|segitseg| help |mit csinalsz|mit irjak|mit kerdezhetek)/.test(tn)) {
      return { msgs: [bot('Írd le a saját szavaiddal, mire készülsz – én kiszűröm belőle a lényeget:\n\n• hova mész (iroda, randi, esküvő, temetés, buli, koncert, edzés, túra, síelés, strand, utazás, videóhívás…)\n• mennyire elegáns („drága hely”, „black tie”, „smart casual”, „laza kocsma”)\n• stílus és hangulat („old money”, „boho”, „rockos”, „fáradt vagyok, valami nyugis”, „magabiztos akarok lenni”)\n• milyen az idő („esik”, „ne fázzak”, „huszonöt fok”) – vagy melyik napra kell („holnap”, „szombaton”), és megnézem az előrejelzést\n• színek („sötét”, „földszínek”, „pasztell”, „legyen benne bordó”, „fekete helyett kék”)\n• darabok („a kedvenc kék pulcsim”, „sapka nélkül”, „inkább farmer, mint chino”)\n• mennyire („nagyon elegáns”, „kicsit lazább”, „ne legyen túl színes”)\n• melyik ruhák („a régóta nem hordottak”, „az új darabjaim”)\n\nSzínekről is kérdezhetsz: „mi illik a bordóhoz?”, „a zöld és a piros összeillik?”\n\nUtána finomíthatsz is: „elegánsabb”, „melegebb”, „nem tetszik a cipő”, „vedd le a táskát”…')], chips: ALAP_CHIPS };
    }

    // --- színtanács: „mi illik a bordóhoz?”, „a zöld és a piros összeillik?” ---
    const szinKerdes = /(illik|illene|passzol|osszeill|osszepasszol|kombinal|mivel vegyem|mihez vegyem|mivel hordjam|mihez hordjam|megy hozza|mi megy|mivel megy|egyutt mehet|ossze lehet|osszevag|match)/.test(tn);
    let szinTipp = '';
    if (szinKerdes && uj.szinek.length) {
      const az = (x) => (/^[aáeéiíoóöőuúüű]/i.test(x) ? 'Az ' : 'A ') + x;
      const [a, b] = uj.szinek;
      if (b) {
        const v = vsSzinIllik(a, b);
        szinTipp = v === 1 ? az(a) + ' és a ' + b + ' jól megy együtt' + (SEMLEGES_SZIN.has(a) || SEMLEGES_SZIN.has(b) ? ' – a semleges szín mindent elvisz.' : '.')
          : v === 0 ? az(a) + ' és a ' + b + ' ütheti egymást. Ha mégis együtt hordod, tegyél melléjük sok semleges színt (fekete, fehér, szürke, bézs).'
            : az(a) + ' és a ' + b + ' merész páros, de működhet: legyen az egyik a fő szín, a másik csak kiegészítő.';
      } else if (STY_SZIN_TANACS[a]) {
        szinTipp = az(a) + ' ' + STY_SZIN_TANACS[a] + '.';
      }
      // csak szín, darab nélkül: tanács + a saját ruhák közül, ami illik hozzá
      if (szinTipp && !uj.kell.length) {
        const illok = darabok.filter((d) => { const sz = styDarabSzin(d); return sz && sz !== a && vsSzinIllik(a, sz) === 1 && (!b || vsSzinIllik(b, sz) === 1); })
          .sort((x, y) => (SEMLEGES_SZIN.has(styDarabSzin(x)) ? 1 : 0) - (SEMLEGES_SZIN.has(styDarabSzin(y)) ? 1 : 0) || (y.wearCount || 0) - (x.wearCount || 0))
          .slice(0, 4).map((d) => d.label);
        return {
          msgs: [bot(szinTipp + (illok.length ? '\n\nA szekrényedből ezek illenek hozzá: ' + illok.join(', ') + '.' : ''))],
          chips: ['Szettet kérek ' + a + ' színnel', ...(b ? ['Szettet kérek ' + b + ' színnel'] : []), 'Kezdjük újra'],
        };
      }
    }

    // --- műveletek egy már ajánlott outfiten ---
    const negativ = /(nem tetszik|nem jo|nem az igazi|nem bejon|nem jon be|nem tetszenek|ronda|csunya|uncsi|unalmas|szornyu|borzaszto|valami mas|mast|masikat|masik |ujat|kovetkezo|nem ez|mas otlet|van mas|mutass mast|dobj mast|nah |nope)/.test(tn);
    if (utolso && utolso.length && !negativ) {
      if (/(veszem fel|ezt veszem|tokeletes|jo lesz|felveszem|mehet|ez az | szuper |tetszik| imadom|pont jo|pont ilyen|megfelel|ez jo|ok |oke|okes|rendben|zsir|kiraly|telitalalat|bejon|bejott|ez lesz|ez kell|legyen ez|maradunk|csodas|gyonyoru|nagyon jo|faja|perfect)/.test(tn) && semmi) {
        return { msgs: [bot('Szuper választás! Naplóztam, hogy ma ezt viseled – így a viselésszámok is frissülnek. Jó napot benne! ✨')], chips: ['Mentsd el outfitként', 'Kezdjük újra'], muvelet: 'visel' };
      }
      if (/(ments|mentes|elment|outfitkent|tedd el)/.test(tn)) {
        return { msgs: [bot(adat.valos ? 'Elmentettem az Outfitek közé. Bármikor újra előveheted.' : 'A demóban nem tudok menteni – jelentkezz be a saját szekrényeddel, és ott elmentem.')], chips: ['Ezt veszem fel', 'Másikat kérek', 'Kezdjük újra'], muvelet: 'ment' };
      }
    }

    // --- finomítás egy meglévő ajánlaton ---
    let csere = [];
    let tart = [];
    if (utolso && utolso.length) {
      const HELY_SZO = [
        ['cipo', /cip|sneaker|csizm|bakancs|mokaszin|loafer|szandal|papucs|balerin|magassark|tusark|espadrill|csuk|labbeli|\blab/],
        ['felso', /felso|felul|polo|\bing|pulover|pulcsi|bluz|garbo|hoodie|kapucn|kardigan|top\b|triko|tunika|crop|body/],
        ['also', /also|alul|nadrag|naci|gatya|farmer|szokny|chino|kord|short|bermuda|leggings|melegito|jogger|cargo/],
        ['kabat', /kabat|kabi|dzseki|parka|ballon|trencs|melleny|puffer/],
        ['kieg', /kieg|taska|sapka|kalap|\bora|\bov\b|\bsal\b|ekszer|szemuveg|nyaklanc|fulbeval|kesztyu|nyakkendo/]];
      // hőérzet: "melegebb legyen" → kabát rá, "könnyebb" → kabát le (a többi darab marad)
      if (/(melegebb|fazom|fazni fogok|fazos vagyok|ne fazzak|hidegebb lett|lehult|vastagabb|tobb reteg|retegesebb)/.test(tn) && !/melegebb lett/.test(tn)) { uj.kabat = true; if (pref.ido !== 'eso') uj.ido = 'hideg'; }
      if (/(konnyebb|huvosebb|melegem van|melegebb lett|izzadok|ne izzadjak|szellosebb|vekonyabb|kevesebb reteg|nyariasabb)/.test(tn)) { uj.kabat = false; uj.ido = 'meleg'; }
      const cserelo = /(csereld|cserel|csere|mas |masik|helyett|nem tetszik|nem jo|ne ez|ne ezt|mast|massal|valtoztass|valts|uj |inkabb)/.test(tn);
      const levesz = /(vedd le|hagyd le|szedd le|vegyuk le|hagyjuk le| nelkul|nem kell)/.test(tn);
      const celzott = HELY_SZO.filter(([, re]) => re.test(tn)).map(([h]) => h).filter((h) => !(h === 'kabat' && uj.kabat !== undefined));
      // „vedd le a táskát”, „kiegészítő nélkül”: a kiegészítő hely üres marad
      if (levesz && celzott.includes('kieg')) { uj.kieg = false; uj.kerul = uj.kerul.filter((k) => k.szin); }
      // „nem tetszik a nadrág”: a hely darabját cseréljük, nem tiltjuk az összes nadrágot
      if (cserelo && celzott.length) uj.kerul = uj.kerul.filter((k) => k.szin);
      if (levesz && celzott.includes('kieg') && celzott.length === 1) {
        tart = utolso.filter((k) => { const d = darabok.find((x) => x.key === k); return d && helyDarab(d) !== 'kieg'; });
      } else if (cserelo && celzott.length) {
        csere = utolso.filter((k) => { const d = darabok.find((x) => x.key === k); return d && celzott.includes(helyDarab(d)); });
        tart = utolso.filter((k) => !csere.includes(k));
        mag += 1;
      } else if (negativ) {
        csere = utolso.slice();
        mag += 1;
      } else if (uj.kabat !== undefined && Object.keys(uj.st).length === 0 && !uj.f && !uj.arny && !uj.szin && !uj.kell.length) {
        tart = utolso.slice(); // csak kabátot tesz rá / vesz le, a többi marad
      } else {
        mag += 1;
      }
    }

    // --- az új információ beolvasztása ---
    const kerdezett = s.chatKerdes || '';
    const alk = Object.entries(uj.a).sort((a, b) => b[1] - a[1])[0];
    if (alk) pref.alkalom = alk[0];
    pref.f = Math.max(-3, Math.min(4, (pref.f || 0) + uj.f));
    const st = { ...(pref.st || {}) };
    Object.entries(uj.st).forEach(([k, v]) => { st[k] = (st[k] || 0) + v; });
    pref.st = st;
    const legjobbSt = Object.entries(st).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])[0];
    if (Object.keys(uj.st).length && legjobbSt && legjobbSt[1] >= 2) pref.stilus = legjobbSt[0];
    else if (!pref.stilus && Math.abs(pref.f) >= 2) pref.stilus = pref.f > 0 ? 'elegans' : 'laza';
    if (pref.stilus && uj.tagadottStilus.includes(pref.stilus)) pref.stilus = pref.f > 0.5 ? 'elegans' : 'laza';
    if (uj.ido) { pref.ido = uj.ido; pref.idoAuto = uj.fok !== null ? uj.fok + '°' : ''; pref.idoKezi = true; }
    if (uj.k) pref.k = Math.max(0, (pref.k || 0) + uj.k);
    if (uj.arny) pref.arny = uj.arny;
    if (uj.ev) pref.ev = uj.ev;
    if (uj.szin) pref.szin = uj.szin;
    pref.szinNot = [...new Set([...(pref.szinNot || []).filter((x) => !uj.szinek.includes(x)), ...uj.szinNot])];
    if (pref.szin && pref.szinNot.includes(pref.szin)) delete pref.szin;
    const kulcs = (x) => x.nev + '|' + x.szin;
    const ujKerul = new Set(uj.kerul.map(kulcs));
    const ujKell = new Set(uj.kell.map(kulcs));
    pref.kell = [...(pref.kell || []).filter((x) => !ujKerul.has(kulcs(x)) && !ujKell.has(kulcs(x))), ...uj.kell];
    pref.kerul = [...(pref.kerul || []).filter((x) => !ujKell.has(kulcs(x)) && !ujKerul.has(kulcs(x))), ...uj.kerul];
    if (uj.kabat !== undefined) pref.kabat = uj.kabat;
    if (uj.kieg !== undefined) pref.kieg = uj.kieg;
    if (uj.paletta) pref.paletta = uj.paletta;
    ['ritka', 'kedvenc', 'uj'].forEach((k) => { if (uj[k]) pref[k] = uj[k]; });
    // másik napra öltözöl: az időt annak a napnak az előrejelzéséből vesszük (ha nem mondtad meg magad)
    if (uj.nap !== null && uj.nap !== (pref.nap || 0)) {
      pref.nap = uj.nap;
      pref.napNev = uj.napNev;
      if (!uj.ido && !pref.idoKezi) { delete pref.ido; delete pref.idoAuto; }
    }
    pref.cimkek = [...new Set([...(pref.cimkek || []), ...uj.cimkek])].slice(-8);
    // saját ruhák név szerint: ha a szöveg egy darabod minden fontos szavát tartalmazza
    const szavak = tn.trim().split(' ');
    const kellKulcs = darabok.filter((d) => {
      const lw = styNorm(d.label).split(' ').filter((w) => w.length > 3);
      return lw.length && lw.every((w) => szavak.some((u) => styIllik(u, styTo(w))));
    }).map((d) => d.key);
    if (kellKulcs.length) pref.kellKulcs = kellKulcs;

    // ha a feltett kérdésre "mindegy" a válasz (vagy kétszer sem értettük), azt is elfogadjuk
    const megvan = {
      alkalom: () => !!pref.alkalom, stilus: () => !!pref.stilus, ido: () => !!pref.ido,
      szin: () => !!(pref.szin || pref.arny || pref.paletta || (pref.szinNot || []).length), k: () => pref.kValasz,
    };
    if (kerdezett === 'k') pref.kValasz = true; // a kényelmi kérdésre bármilyen válasz jó
    if (kerdezett && megvan[kerdezett] && !megvan[kerdezett]()) {
      if (uj.mindegy || (s.chatProba || 0) >= 1) pref[kerdezett === 'szin' ? 'szin' : kerdezett] = 'mindegy';
    } else if (uj.mindegy && !kerdezett) {
      ['alkalom', 'stilus', 'ido', 'szin'].forEach((k) => { if (!megvan[k]()) pref[k] = 'mindegy'; });
      pref.kValasz = true;
    }
    if (!pref.ido && pref.nap) {
      const napi = this.stylistNapIdo(pref.nap);
      if (napi) { pref.ido = napi.ido; pref.idoAuto = napi.auto; }
      else if (!s.wx && !s.wxLoad) this.fetchWeatherWeek(); // legközelebbre már meglesz
    }
    if (s.weather && typeof s.weather.tempC === 'number' && !pref.ido && !pref.nap) {
      const fk = s.weather.tempC;
      pref.ido = fk < 8 ? 'hideg' : fk < 16 ? 'huvos' : fk > 24 ? 'meleg' : 'enyhe';
      pref.idoAuto = Math.round(fk) + '°';
    }

    // --- célzott kérdések a hiányzó részletekre (optimalizálás) ---
    const formSzint = Math.abs(pref.f || 0);
    const KERDES = {
      alkalom: ['Hova készülsz? Így tudom, mennyire legyen elegáns.', ['Munka / iroda', 'Randi vagy vacsora', 'Hétvégi lazulás', 'Sport / edzés', 'Buli', 'Lepj meg!']],
      stilus: [pref.alkalom === 'program' ? 'Mennyire elegáns a hely?' : 'Milyen hangulatú legyen a szett?',
        pref.alkalom === 'program' ? ['Nagyon elegáns, puccos hely', 'Smart casual – félig elegáns', 'Laza hely', 'Mindegy, döntsd el']
          : ['Elegáns', 'Laza és kényelmes', 'Sportos', 'Utcai (streetwear)', 'Mindegy, döntsd el']],
      ido: [pref.nap ? 'Milyen idő lesz ' + pref.napNev + '? (Az előrejelzést most nem értem el.)' : 'Milyen idő van kint? (Nem sikerült lekérnem az időjárást.)',
        ['Hideg', 'Hűvös', 'Meleg', 'Esik az eső']],
      k: ['Sokat leszel talpon, vagy inkább ülős program lesz?', ['Sokat sétálok, kényelmes cipő kell', 'Inkább ülök', 'Mindegy']],
      szin: ['Van szín, amit szívesen viselnél – vagy amit inkább kerülnél?', ['Semleges', 'Legyen színes', 'Sötét tónusok', 'Ne legyen fekete', 'Mindegy']],
    };
    const kerdezve = pref.kerdezve || [];
    const reszletes = (pref.cimkek || []).length >= 4; // ha sokat elmondtál, kevesebbet kérdezek
    const sorrend = [
      ['alkalom', !pref.alkalom && !pref.stilus && formSzint < 1],
      ['stilus', !pref.stilus && ['buli', 'program', 'mindegy'].includes(pref.alkalom) && formSzint < 1.5],
      ['ido', !pref.ido],
      ['k', !pref.kValasz && !pref.k && ['laza', 'buli'].includes(pref.alkalom) && !reszletes && pref.ev !== 'strand'],
      ['szin', !megvan.szin() && !reszletes && !pref.ev],
    ];
    const kovetkezo = (sorrend.find(([k, kell]) => kell && (!kerdezve.includes(k) || k === kerdezett)) || [])[0];
    if (!utolso && kovetkezo && kerdezve.length < 3 + (kovetkezo === kerdezett ? 1 : 0)) {
      const ujra = kerdezett === kovetkezo;
      const nyugta = this.stylistNyugta(uj);
      return {
        pref: { ...pref, kerdezve: [...new Set([...kerdezve, kovetkezo])] }, mag, kerdes: kovetkezo, proba: ujra ? (s.chatProba || 0) + 1 : 0,
        msgs: [bot((ujra ? 'Ezt nem egészen értettem. ' : nyugta) + KERDES[kovetkezo][0])],
        chips: KERDES[kovetkezo][1],
      };
    }

    // --- összeállítás ---
    const res = this.stylistOsszerak(darabok, pref, mag, csere, tart);
    if (!res.darabok.length) {
      return { pref, mag, msgs: [bot('Ehhez most nem találtam illő darabot. Próbáld meg kicsit másképp – például „bármi kényelmes”.')], chips: ['Mindegy, döntsd el', 'Kezdjük újra'] };
    }
    const okok = [];
    const STILUS_NEV = { elegans: 'elegáns', laza: 'laza', sportos: 'sportos', street: 'utcai' };
    const EV_OK = {
      temetes: 'Temetésre sötét, visszafogott darabokat választottam.',
      eskuvo: 'Esküvőn vendégként kerülöm a fehéret – az a menyasszonyé.',
      interju: 'Állásinterjúra letisztult, semleges, megbízható összeállítás.',
      templom: 'Templomba visszafogott, elegáns darabokat választottam.',
      strand: 'Strandra könnyű, szellős darabok – kabát nélkül.',
      tura: 'Túrára kényelmes cipő és réteges öltözék.',
      fesztival: 'Fesztiválra kényelmes cipő, mert egész nap talpon leszel.',
      utazas: 'Utazáshoz kényelmes, gyűrődésre nem kényes darabok.',
      vizsga: 'Vizsgára letisztult, rendezett, semleges összeállítás.',
      randi: 'Randira csinos, de nem túlerőltetett szett – a sötét és a meleg tónusok jól állnak este.',
      karacsony: 'Karácsonyra ünnepi színek és puha, kötött darabok.',
      sieles: 'Síeléshez meleg, réteges öltözék, téli kabát és vastag talpú cipő.',
      kerti: 'Kerti programra kényelmes darabok – tűsarkút a fűbe nem választottam.',
      hajo: 'Hajóra csúszásmentes, lapos cipő és tengerészes színek.',
      hazimunka: 'Házimunkához olyan darabokat választottam, amiket nem baj, ha összekoszolsz.',
      video: 'Videóhíváshoz a felső számít: az rendezett, a többi lehet kényelmes.',
    };
    if (szinTipp) okok.push(szinTipp);
    if (pref.ev && EV_OK[pref.ev]) okok.push(EV_OK[pref.ev]);
    if (res.stilus) okok.push('Stílus: ' + STILUS_NEV[res.stilus] + ((pref.f || 0) >= 2 && res.stilus === 'elegans' ? ' – ez egy elegánsabb alkalom.' : (pref.alkalom && pref.alkalom !== 'mindegy' ? ' – illik az alkalomhoz.' : '.')));
    // a jövőbeli napra „lesz”, ma „van”
    const ige = pref.nap ? ' lesz' + (pref.napNev ? ' ' + pref.napNev : '') : ' van';
    if (res.kellKabat) okok.push(pref.kabat === true ? 'Kabátot kértél, rátettem.' : pref.ev === 'sieles' ? 'A síeléshez téli kabát kell.' : pref.ido === 'eso' ? (pref.nap ? 'Esőt mondanak' + (pref.napNev ? ' ' + pref.napNev : '') + (pref.idoAuto ? ' (' + pref.idoAuto + ')' : '') : 'Esik') + ', ezért kabátot tettem rá, és zárt cipőt választottam.' : (pref.ido === 'hideg' ? 'Hideg' : 'Hűvös') + ige + (pref.idoAuto ? ' (' + pref.idoAuto + ')' : '') + ', ezért kabát is került rá.');
    else if (pref.kabat === false) okok.push('Kabát nélkül, ahogy kérted.');
    else if (pref.ido === 'meleg') okok.push('Meleg' + ige + (pref.idoAuto ? ' (' + pref.idoAuto + ')' : '') + ', ezért könnyebb darabokat választottam.');
    else if (pref.nap && pref.idoAuto) okok.push((pref.napNev ? pref.napNev[0].toUpperCase() + pref.napNev.slice(1) + ' ' : '') + 'kellemes idő lesz (' + pref.idoAuto + ').');
    if ((pref.k || 0) >= 2 && pref.ev !== 'sieles') okok.push('Kényelmes cipőt választottam, mert sokat leszel talpon.');
    if (pref.arny) okok.push(pref.arny === 'sotet' ? 'Sötétebb tónusokat választottam.' : 'Világos tónusokat választottam.');
    if (pref.paletta) okok.push('A kért színvilágból (' + pref.paletta.slice(0, 4).join(', ') + ') választottam, amit lehetett.');
    if ((pref.szinNot || []).length) okok.push('Kerültem: ' + pref.szinNot.join(', ') + '.');
    if (pref.kedvenc) okok.push('A legtöbbet hordott, kedvenc darabjaidat vettem elő.');
    if (pref.ritka) okok.push('Olyan darabokat választottam, amiket rég nem viseltél.');
    if (pref.uj) okok.push('Az újabb darabjaidat vettem előre.');
    if (pref.kieg === false) okok.push('Kiegészítő nélkül, ahogy kérted.');
    (pref.kell || []).forEach((k) => {
      const re = new RegExp(k.minta);
      const van = res.darabok.some((d) => re.test(styDarabSzoveg(d)) && (!k.szin || styDarabSzin(d) === k.szin));
      okok.push(van ? 'Benne van, amit kértél: ' + (k.szin ? k.szin + ' ' : '') + k.nev + '.'
        : 'Nem találtam ' + (k.szin ? k.szin + ' ' : '') + k.nev + ' darabot a szekrényedben, ezért mást választottam.');
    });
    if ((pref.kerul || []).length) okok.push('Kihagytam: ' + pref.kerul.map((k) => (k.szin ? k.szin + ' ' : '') + k.nev).join(', ') + '.');
    const regi = res.darabok.find((d) => d.lastWornAt && Date.now() - d.lastWornAt > 60 * 864e5);
    if (regi) okok.push('A(z) ' + regi.label + ' régóta vár a szekrényben – ideje újra elővenni.');
    const harm = szinHarmonia(res.darabok.map((d) => ({ ...d, szin: styDarabSzin(d) })));
    if (harm.szoveg) okok.push(harm.szoveg);
    const hianyzik = ['felso', 'also', 'cipo'].filter((h) => !res.darabok.some((d) => helyDarab(d) === h));
    if (hianyzik.length) okok.push('Nincs ' + hianyzik.map((h) => BABA_HELY_NEV[h].toLowerCase()).join(', ') + ' a szekrényedben, ezért az kimaradt.');
    const ertett = (pref.cimkek || []).filter((c) => !/^nem /.test(c)).slice(-5);
    const bevezeto = utolso
      ? ['Rendben, módosítottam rajta:', 'Itt egy új változat:', 'Mit szólsz ehhez?'][mag % 3]
      : (ertett.length ? 'Értem: ' + ertett.join(' · ') + '. Ezt állítottam össze neked:' : 'Megvan! Ezt állítottam össze neked:');
    return {
      pref, mag, kerdes: '', proba: 0, utolso: res.darabok.map((d) => d.key),
      msgs: [bot(bevezeto, { outfit: res.darabok.map((d) => ({ key: d.key, label: d.label, hely: BABA_HELY_NEV[helyDarab(d)], photoUrl: d.photoUrl || '' })), okok })],
      chips: ['Ezt veszem fel', 'Mentsd el outfitként', 'Másikat kérek', 'Elegánsabb', 'Lazább', 'Nem tetszik a cipő', res.kellKabat ? 'Kabát nélkül' : 'Kabáttal', 'Sötétebb'],
      kovetes: 'Tetszik így? Írd meg nyugodtan a saját szavaiddal, mit változtassak – például „nem tetszik a cipő”, „legyen melegebb” vagy „ne legyen benne fekete”.',
    };
  }

  // egy későbbi nap időjárása az előrejelzésből (state.wx, Open-Meteo napi adatok): { ido, auto } vagy null
  stylistNapIdo(nap) {
    const d = this.state.wx && this.state.wx.daily;
    if (!d || !d.time) return null;
    const i = d.time.indexOf(dayKey(new Date(Date.now() + nap * 864e5)));
    if (i < 0) return null;
    const max = (d.temperature_2m_max || [])[i], min = (d.temperature_2m_min || [])[i];
    if (typeof max !== 'number' || typeof min !== 'number') return null;
    const eso = ((d.precipitation_probability_max || [])[i] || 0);
    const nappal = (max * 2 + min) / 3; // a nap nagy részében érzett hőmérséklet
    const ido = eso >= 60 ? 'eso' : nappal < 8 ? 'hideg' : nappal < 16 ? 'huvos' : nappal > 24 ? 'meleg' : 'enyhe';
    return { ido, auto: Math.round(min) + '–' + Math.round(max) + '°' + (eso >= 40 ? ', ' + Math.round(eso) + '% eső' : '') };
  }

  // rövid visszajelzés arról, amit a bot megértett (kérdés előtt)
  stylistNyugta(uj) {
    const c = uj.cimkek.filter(Boolean);
    if (!c.length) return '';
    return 'Értem: ' + c.slice(0, 5).join(' · ') + '. ';
  }

  stylistKuld(szoveg) {
    const text = (szoveg || '').trim();
    const s = this.state;
    if (!text || s.chatTyping) return;
    const msgs = (s.chatMsgs || this.stylistKezdo()).concat([{ from: 'me', text }]);
    this.setState({ chatMsgs: msgs, chatInput: '', chatChips: [], chatTyping: true });
    this.stylistGorget();
    const valasz = this.stylistValasz(text);
    if (!valasz) { this.setState({ chatTyping: false }); return; }
    setTimeout(async () => {
      if (valasz.reset) {
        this.setState({ chatMsgs: this.stylistKezdo(), chatPref: {}, chatMag: 1, chatKerdes: '', chatProba: 0, chatUtolso: null, chatTyping: false,
          chatChips: null });
        return;
      }
      const adat = this._sty || {};
      if (valasz.muvelet && this.state.chatUtolso) {
        const ids = this.state.chatUtolso;
        const pref = this.state.chatPref || {};
        if (valasz.muvelet === 'visel') {
          if (adat.valos) {
            await Promise.all(ids.map((id) => fetch('/api/items/' + id, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ wornToday: true }) })));
            await this.reloadItems();
          } else {
            const worn = { ...this.state.worn }; ids.forEach((k) => { worn[k] = true; });
            this.setState({ worn });
            this.demoSzennyesbe(ids);
          }
        }
        if (valasz.muvelet === 'ment' && adat.valos) {
          const ALK = { munka: 'Munka', program: 'Program', buli: 'Program', sport: 'Hétvége', laza: 'Hétvége' };
          const EVSZ = { hideg: 'Hideg', eso: 'Hideg', huvos: 'Enyhe', enyhe: 'Enyhe', meleg: 'Meleg' };
          const nev = 'Stylist · ' + new Date().toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
          await fetch('/api/outfits', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: nev, occasion: ALK[pref.alkalom] || 'Bármilyen alkalom', season: EVSZ[pref.ido] || 'Bármilyen évszak', itemIds: ids }),
          });
          await this.reloadOutfits();
        }
      }
      const most = this.state;
      const uj = (most.chatMsgs || []).concat(valasz.msgs || []);
      if (valasz.kovetes) uj.push({ from: 'bot', text: valasz.kovetes });
      const patch = { chatMsgs: uj, chatChips: valasz.chips || [], chatTyping: false };
      ['pref', 'mag', 'kerdes', 'proba', 'utolso'].forEach((k) => {
        if (valasz[k] !== undefined) patch['chat' + { pref: 'Pref', mag: 'Mag', kerdes: 'Kerdes', proba: 'Proba', utolso: 'Utolso' }[k]] = valasz[k];
      });
      this.setState(patch);
      this.stylistGorget();
    }, 650 + Math.random() * 500);
  }

  stylistGorget() {
    setTimeout(() => {
      const l = document.querySelector('.we-chat-list');
      if (l) l.scrollTo({ top: l.scrollHeight, behavior: 'smooth' });
    }, 40);
  }

  // ==========================================================================
  // IDŐJÁRÁS – az elmúlt 7 nap és a következő 7 nap
  // Adat: server/index.js /api/weather/week (Open-Meteo). Ha a szerver régebbi
  // és nincs ilyen végpontja, közvetlenül az Open-Meteótól kérjük le.
  // ==========================================================================
  fetchWeatherWeek = async () => {
    if (this.state.wxLoad) return;
    this.setState({ wxLoad: true, wxErr: '' });
    const varos = this.wxVaros();
    let coords = varos ? { latitude: varos.lat, longitude: varos.lon } : (this._wxCoords || null);
    if (!coords) {
      try {
        if (navigator.geolocation) {
          coords = await new Promise((resolve) => {
            let kesz = false;
            const ido = setTimeout(() => { if (!kesz) { kesz = true; resolve(null); } }, 4000);
            navigator.geolocation.getCurrentPosition(
              (pos) => { if (!kesz) { kesz = true; clearTimeout(ido); resolve(pos.coords); } },
              () => { if (!kesz) { kesz = true; clearTimeout(ido); resolve(null); } },
            );
          });
        }
      } catch (e) { coords = null; }
      if (coords) this._wxCoords = { latitude: coords.latitude, longitude: coords.longitude };
    }
    // saját helyzetnél kiderítjük, melyik városban vagy
    if (!varos && coords && !this.state.wxHelyNev) this.wxHelyNevLeker(coords.latitude, coords.longitude);
    const lat = coords ? coords.latitude : 47.4979;
    const lon = coords ? coords.longitude : 19.0402;
    let data = null;
    try {
      const r = await fetch('/api/weather/week' + (coords ? '?lat=' + lat + '&lon=' + lon : ''));
      if (r.ok) { const j = await r.json(); if (j.ok) data = j; }
    } catch (e) { /* nincs ilyen végpont vagy nem fut a szerver – jön a közvetlen lekérés */ }
    if (!data) {
      try {
        const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
          '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day' +
          '&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,' +
          'precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset' +
          '&hourly=temperature_2m,precipitation_probability,weather_code&timezone=auto&past_days=7&forecast_days=8');
        if (r.ok) { const j = await r.json(); data = { ok: true, usedDefaultLocation: !coords, ...j }; }
      } catch (e) { /* nincs internet */ }
    }
    if (data && data.daily) this.setState({ wx: data, wxAt: Date.now(), wxLoad: false, wxErr: '' });
    else this.setState({ wxLoad: false, wxErr: 'Most nem sikerült lekérni az időjárást. Ellenőrizd az internetkapcsolatot, és próbáld újra.' });
  };

  // --- város: választott (a böngésző megjegyzi), keresés, helynév ---
  wxVaros() {
    if (this.state.wxCity !== undefined) return this.state.wxCity;
    try { const c = JSON.parse(localStorage.getItem('wardro.wxCity') || 'null'); return c && typeof c.lat === 'number' ? c : null; } catch (e) { return null; }
  }

  wxVarosBeallit(c) {
    try { if (c) localStorage.setItem('wardro.wxCity', JSON.stringify(c)); else localStorage.removeItem('wardro.wxCity'); } catch (e) { /* privát mód */ }
    if (!c) this._wxCoords = null;
    this.setState({ wxCity: c, wx: null, wxAt: 0, wxErr: '', wxHelyNev: '', wxQ: '', wxTalalat: [], wxKeresNyitva: false, wxKeresFut: false, wxKeresVolt: false });
    setTimeout(() => { this.fetchWeatherWeek(); this.fetchWeather(); }, 0);
  }

  wxHelyNevLeker = async (lat, lon) => {
    let h = null;
    try {
      const r = await fetch('/api/geocode/reverse?lat=' + lat + '&lon=' + lon);
      if (r.ok) { const j = await r.json(); if (j.ok && j.name) h = j; }
    } catch (e) { /* régebbi szerver – közvetlenül kérdezzük */ }
    if (!h) {
      try {
        const r = await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&accept-language=hu&lat=' + lat + '&lon=' + lon);
        if (r.ok) { const j = await r.json(); const a = j.address || {}; h = { name: a.city || a.town || a.village || a.municipality || j.name || '', region: a.county || a.state || '', country: a.country || '' }; }
      } catch (e) { /* nincs internet */ }
    }
    if (h && h.name) this.setState({ wxHelyNev: h.name, wxHelySub: [h.region, h.country].filter(Boolean).join(', ') });
  };

  wxKeres = (q) => {
    clearTimeout(this._wxKeresT);
    const kerdes = (q || '').trim();
    if (kerdes.length < 2) { this.setState({ wxTalalat: [], wxKeresFut: false, wxKeresVolt: false }); return; }
    this.setState({ wxKeresFut: true });
    this._wxKeresT = setTimeout(async () => {
      let lista = [];
      try {
        const r = await fetch('https://geocoding-api.open-meteo.com/v1/search?count=8&language=hu&format=json&name=' + encodeURIComponent(kerdes));
        if (r.ok) { const j = await r.json(); lista = j.results || []; }
      } catch (e) { lista = []; }
      if ((this.state.wxQ || '').trim() !== kerdes) return; // közben tovább gépeltél
      this.setState({
        wxKeresFut: false, wxKeresVolt: true,
        // sorrend: a beírt szöveggel kezdődő név, a hazai (választott ország / Magyarország) város, majd a népesség
        wxTalalat: (() => {
          const nq = styNorm(kerdes);
          const otthon = (this.wxVaros() || {}).cc || 'HU';
          const pont = (x) => (styNorm(x.name).startsWith(nq) ? 3 : 0) + (styNorm(x.name) === nq ? 2 : 0)
            + (x.country_code === otthon ? 1.5 : 0) + (x.country_code === 'HU' ? 0.5 : 0) + Math.log10((x.population || 0) + 1) / 2;
          return lista.slice().sort((a, b) => pont(b) - pont(a));
        })().map((x) => ({ nev: x.name, admin: x.admin1 || '', orszag: x.country || '', cc: x.country_code || '', lat: x.latitude, lon: x.longitude, nep: x.population || 0 })),
      });
    }, 280);
  };

  renderWeatherVals(v) {
    const s = this.state;
    const isWeather = s.view === 'weather';
    const toWeather = () => this.setState({ view: 'weather', sel: null, editOpen: false });
    const out = { isWeather, toWeather };
    const valasztott = this.wxVaros();
    const varosNev = valasztott ? valasztott.nev : (s.wxHelyNev || '');
    if (varosNev && v.startWeather) out.startWeather = varosNev + ' · ' + v.startWeather;
    out.wxRailHely = varosNev ? ' · ' + varosNev : '';
    // menüpont a Stylist után
    const nav = (v.navItems || []).slice();
    const hol = nav.findIndex((n) => n.icon === 'stylist');
    nav.splice(hol < 0 ? 2 : hol + 1, 0, { label: 'Időjárás', icon: 'weather', cls: isWeather ? 'is-active' : '', on: toWeather });
    out.navItems = nav;
    if (!isWeather) return out;
    out.gridMod = 'is-norail';
    out.railDisplay = 'none';

    // betöltés: első belépéskor, és fél óránként frissítjük
    if (!s.wxLoad && !s.wxErr && (!s.wx || Date.now() - (s.wxAt || 0) > 30 * 60 * 1000)) setTimeout(() => this.fetchWeatherWeek(), 0);
    out.wxReload = () => { this.setState({ wxErr: '' }); setTimeout(() => this.fetchWeatherWeek(), 0); };
    // városkereső
    const varos = this.wxVaros();
    const NEPSZERU = [
      { nev: 'Budapest', admin: 'Budapest', orszag: 'Magyarország', cc: 'HU', lat: 47.4979, lon: 19.0402 },
      { nev: 'Debrecen', admin: 'Hajdú-Bihar vármegye', orszag: 'Magyarország', cc: 'HU', lat: 47.5317, lon: 21.6244 },
      { nev: 'Szeged', admin: 'Csongrád-Csanád vármegye', orszag: 'Magyarország', cc: 'HU', lat: 46.253, lon: 20.1414 },
      { nev: 'Pécs', admin: 'Baranya vármegye', orszag: 'Magyarország', cc: 'HU', lat: 46.0727, lon: 18.2323 },
      { nev: 'Győr', admin: 'Győr-Moson-Sopron vármegye', orszag: 'Magyarország', cc: 'HU', lat: 47.6875, lon: 17.6504 },
      { nev: 'Miskolc', admin: 'Borsod-Abaúj-Zemplén vármegye', orszag: 'Magyarország', cc: 'HU', lat: 48.1035, lon: 20.7784 },
    ];
    const talalat = (s.wxQ || '').trim().length >= 2 ? (s.wxTalalat || []) : NEPSZERU;
    out.wxKeresNyitva = !!s.wxKeresNyitva;
    out.wxKeresCls = s.wxKeresNyitva ? 'is-open' : '';
    out.wxKeresNyit = () => {
      this.setState({ wxKeresNyitva: !s.wxKeresNyitva });
      setTimeout(() => { const el = document.querySelector('.we-wx-search-field'); if (el) el.focus(); }, 40);
    };
    out.wxKeresZar = () => this.setState({ wxKeresNyitva: false, wxQ: '', wxTalalat: [], wxKeresVolt: false });
    out.wxQ = s.wxQ || '';
    out.onWxQ = (e) => { this.setState({ wxQ: e.target.value }); this.wxKeres(e.target.value); };
    out.onWxKey = (e) => {
      if (e.key === 'Escape') out.wxKeresZar();
      if (e.key === 'Enter' && talalat[0]) { e.preventDefault(); const x = talalat[0]; this.wxVarosBeallit({ nev: x.nev, admin: x.admin, orszag: x.orszag, cc: x.cc, lat: x.lat, lon: x.lon }); }
    };
    out.wxTalalatCim = (s.wxQ || '').trim().length >= 2 ? 'Találatok' : 'Népszerű városok';
    out.wxTalalat = talalat.map((x) => ({
      nev: x.nev,
      sub: [x.admin !== x.nev ? x.admin : '', x.orszag].filter(Boolean).join(', '),
      cc: x.cc,
      cls: varos && Math.abs(varos.lat - x.lat) < 0.01 && Math.abs(varos.lon - x.lon) < 0.01 ? 'is-active' : '',
      on: () => this.wxVarosBeallit({ nev: x.nev, admin: x.admin, orszag: x.orszag, cc: x.cc, lat: x.lat, lon: x.lon }),
    }));
    out.wxKeresFut = !!s.wxKeresFut;
    out.wxNincsTalalat = !!s.wxKeresVolt && !s.wxKeresFut && (s.wxQ || '').trim().length >= 2 && !(s.wxTalalat || []).length;
    out.wxSajatHely = () => this.wxVarosBeallit(null);
    out.wxSajatCls = varos ? '' : 'is-active';
    out.wxHely = varos ? varos.nev : (s.wxHelyNev || (s.wx && !s.wx.usedDefaultLocation ? 'A jelenlegi helyzeted' : 'Budapest'));
    out.wxHelySub = varos ? [varos.admin !== varos.nev ? varos.admin : '', varos.orszag].filter(Boolean).join(', ')
      : (s.wxHelyNev ? (s.wxHelySub || '') + ' · a helyzeted alapján' : (s.wx && s.wx.usedDefaultLocation ? 'alapértelmezett – válassz várost' : 'a helyzeted alapján'));
    out.wxLoading = !s.wx && !s.wxErr;
    out.wxHasErr = !s.wx && !!s.wxErr;
    out.wxErr = s.wxErr || '';
    out.wxReady = !!s.wx;
    if (!s.wx) return out;

    const W = s.wx;
    const d = W.daily;
    const cur = W.current || {};
    const ma = (cur.time || d.time[7] || '').slice(0, 10);
    const ti = Math.max(0, d.time.indexOf(ma));
    const NEV = { 0: 'Derült', 1: 'Többnyire derült', 2: 'Részben felhős', 3: 'Borult', 45: 'Köd', 48: 'Zúzmarás köd',
      51: 'Gyenge szitálás', 53: 'Szitálás', 55: 'Erős szitálás', 56: 'Fagyos szitálás', 57: 'Erős fagyos szitálás',
      61: 'Gyenge eső', 63: 'Eső', 65: 'Erős eső', 66: 'Fagyos eső', 67: 'Erős fagyos eső',
      71: 'Gyenge havazás', 73: 'Havazás', 75: 'Erős havazás', 77: 'Hószemcsék',
      80: 'Gyenge zápor', 81: 'Zápor', 82: 'Heves zápor', 85: 'Hózápor', 86: 'Erős hózápor',
      95: 'Zivatar', 96: 'Zivatar jégesővel', 99: 'Heves zivatar jégesővel' };
    const ikon = (k) => (k === 0 ? 'sun' : k <= 2 ? 'partly' : k === 3 ? 'cloud' : k <= 48 ? 'fog' : k <= 57 ? 'drizzle'
      : k <= 67 ? 'rain' : k <= 77 ? 'snow' : k <= 82 ? 'rain' : k <= 86 ? 'snow' : 'storm');
    const kerek = (x) => (x === null || x === undefined || Number.isNaN(x) ? '–' : Math.round(x));
    const datum = (iso) => { const [y, m, n] = iso.split('-').map(Number); return new Date(y, m - 1, n); };
    const napNev = (iso) => {
      const egy = 864e5, kul = Math.round((datum(iso) - datum(ma)) / egy);
      if (kul === 0) return 'Ma';
      if (kul === 1) return 'Holnap';
      if (kul === -1) return 'Tegnap';
      const x = datum(iso).toLocaleDateString('hu-HU', { weekday: 'long' });
      return x.charAt(0).toUpperCase() + x.slice(1);
    };
    const ora = (iso) => (iso || '').slice(11, 16);
    const osszMin = Math.min(...d.temperature_2m_min.filter((x) => x !== null));
    const osszMax = Math.max(...d.temperature_2m_max.filter((x) => x !== null));
    const tart = Math.max(1, osszMax - osszMin);
    const sel = s.wxSel && d.time.includes(s.wxSel) ? s.wxSel : ma;

    const napok = d.time.map((iso, i) => {
      const min = d.temperature_2m_min[i], max = d.temperature_2m_max[i];
      const multbeli = iso < ma;
      const k = d.weather_code[i];
      return {
        iso, i, multbeli,
        nev: napNev(iso),
        datum: datum(iso).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' }),
        ikon: ikon(k), leiras: NEV[k] || 'Változékony',
        max: kerek(max) + '°', min: kerek(min) + '°',
        savBal: ((min - osszMin) / tart * 100).toFixed(1) + '%',
        savSzel: Math.max(4, (max - min) / tart * 100).toFixed(1) + '%',
        eso: multbeli ? (d.precipitation_sum[i] ? (Math.round(d.precipitation_sum[i] * 10) / 10) + ' mm' : 'nem esett')
          : (d.precipitation_probability_max[i] !== null ? d.precipitation_probability_max[i] + '%' : '–'),
        esoCim: multbeli ? 'Csapadék' : 'Eső esélye',
        cls: [iso === ma ? 'is-today' : '', multbeli ? 'is-past' : '', iso === sel ? 'is-sel' : ''].filter(Boolean).join(' '),
        on: () => this.setState({ wxSel: iso }),
      };
    });

    // --- a kiválasztott nap részletei ---
    const si = d.time.indexOf(sel);
    const orak = W.hourly.time.map((t, j) => ({ t, j })).filter((x) => x.t.slice(0, 10) === sel);
    const ht = orak.map((x) => W.hourly.temperature_2m[x.j]);
    const hp = orak.map((x) => W.hourly.precipitation_probability[x.j]);
    const tMin = Math.min(...ht), tMax = Math.max(...ht);
    const lo = Math.floor(tMin - 2), hi = Math.ceil(tMax + 2);
    const VW = 720, VH = 200, PAD = 14;
    const xPos = (j) => PAD + (j / Math.max(1, orak.length - 1)) * (VW - PAD * 2);
    const yPos = (t) => VH - 18 - ((t - lo) / Math.max(1, hi - lo)) * (VH - 46);
    const pontok = ht.map((t, j) => [xPos(j), yPos(t)]);
    const vonal = pontok.map((p, j) => (j ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const terulet = pontok.length ? vonal + ' L' + pontok[pontok.length - 1][0].toFixed(1) + ' ' + (VH - 18) + ' L' + pontok[0][0].toFixed(1) + ' ' + (VH - 18) + ' Z' : '';
    const most = (cur.time || '').slice(0, 13);
    const oraLista = orak.map((x, j) => ({
      ora: x.t.slice(11, 13),
      cimke: j % 3 === 0 ? x.t.slice(11, 13) : '',
      temp: kerek(ht[j]) + '°',
      eso: (hp[j] === null || hp[j] === undefined ? '–' : hp[j]) + '%',
      bal: (xPos(j) / VW * 100).toFixed(2) + '%',
      pontFent: (yPos(ht[j]) / VH * 100).toFixed(2) + '%',
      esoMag: Math.max(2, hp[j] || 0) + '%',
      ikon: ikon(W.hourly.weather_code[x.j]),
      cls: x.t.slice(0, 13) === most ? 'is-now' : '',
    }));

    // öltözködési tipp a napra
    const nMax = d.temperature_2m_max[si], nMin = d.temperature_2m_min[si];
    const valoban = d.apparent_temperature_min ? d.apparent_temperature_min[si] : nMin;
    const esely = d.precipitation_probability_max[si] || 0;
    const szel = d.wind_speed_10m_max[si] || 0;
    const uv = d.uv_index_max ? d.uv_index_max[si] : 0;
    const kod = d.weather_code[si];
    const tippek = [];
    if (nMax < 5) tippek.push({ ikon: 'snow', t: 'Nagyon hideg lesz: meleg kabát, sál, sapka és vastag cipő.' });
    else if (nMax < 12) tippek.push({ ikon: 'cloud', t: 'Hideg nap: kabát és pulóver kell, zárt cipővel.' });
    else if (nMax < 18) tippek.push({ ikon: 'partly', t: 'Átmeneti idő: rétegezz – póló, pulóver vagy ing, és egy könnyű kabát.' });
    else if (nMax < 25) tippek.push({ ikon: 'sun', t: 'Kellemes idő: egy könnyű felső elég, estére vigyél egy vékony réteget.' });
    else tippek.push({ ikon: 'sun', t: 'Meleg lesz: szellős, világos darabok, könnyű cipő.' });
    if (nMax - nMin >= 9) tippek.push({ ikon: 'partly', t: 'Nagy a különbség reggel (' + kerek(nMin) + '°) és napközben (' + kerek(nMax) + '°) – a rétegek a legjobbak.' });
    if (esely >= 50 || (kod >= 51 && kod <= 82) || kod >= 95) tippek.push({ ikon: 'rain', t: 'Esőre ' + esely + '% az esély: vízálló kabát, zárt cipő, esernyő.' });
    else if (esely >= 25) tippek.push({ ikon: 'drizzle', t: 'Lehet egy kis eső (' + esely + '%) – egy esernyő nem árt.' });
    if (szel >= 30) tippek.push({ ikon: 'fog', t: 'Erős szél (' + kerek(szel) + ' km/h): szélálló kabát, a laza sálat hagyd otthon.' });
    if (uv >= 6) tippek.push({ ikon: 'sun', t: 'Erős UV (' + kerek(uv) + '): napszemüveg és sapka.' });
    if (valoban !== null && valoban < nMin - 3) tippek.push({ ikon: 'cloud', t: 'Hidegebbnek fogod érezni (' + kerek(valoban) + '°), mint amit a hőmérő mutat.' });

    const kerdes = (napNev(sel) === 'Ma' ? 'Ma' : napNev(sel) === 'Holnap' ? 'Holnap' : napNev(sel) + ' (' + datum(sel).toLocaleDateString('hu-HU', { month: 'long', day: 'numeric' }) + ')') +
      ' ' + kerek(nMin) + '–' + kerek(nMax) + ' fok lesz, ' + (NEV[kod] || '').toLowerCase() + (esely >= 40 ? ', eshet az eső' : '') + '. Mit vegyek fel?';

    Object.assign(out, {
      wxIdozona: W.timezone || '',
      wxMost: {
        temp: kerek(cur.temperature_2m) + '°',
        erzet: kerek(cur.apparent_temperature) + '°',
        para: kerek(cur.relative_humidity_2m) + '%',
        szel: kerek(cur.wind_speed_10m) + ' km/h',
        leiras: NEV[cur.weather_code] || '',
        ikon: ikon(cur.weather_code),
        maxmin: 'Ma ' + kerek(d.temperature_2m_max[ti]) + '° / ' + kerek(d.temperature_2m_min[ti]) + '°',
        nap: ora(d.sunrise[ti]) + ' – ' + ora(d.sunset[ti]),
      },
      wxElore: napok.filter((n) => !n.multbeli),
      wxVissza: napok.filter((n) => n.multbeli).reverse(),
      wxSel: {
        nev: napNev(sel),
        datum: datum(sel).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
        leiras: NEV[kod] || '',
        ikon: ikon(kod),
        max: kerek(nMax) + '°', min: kerek(nMin) + '°',
        eso: d.precipitation_sum[si] ? (Math.round(d.precipitation_sum[si] * 10) / 10) + ' mm' : '0 mm',
        esely: (d.precipitation_probability_max[si] === null ? '–' : d.precipitation_probability_max[si]) + '%',
        szel: kerek(szel) + ' km/h',
        uv: uv === null || uv === undefined ? '–' : String(Math.round(uv * 10) / 10),
        napkelte: ora(d.sunrise[si]), napnyugta: ora(d.sunset[si]),
        multbeli: sel < ma,
      },
      wxVonal: vonal,
      wxTerulet: terulet,
      wxOrak: oraLista,
      wxSkalaFent: hi + '°', wxSkalaLent: lo + '°',
      wxTippek: tippek,
      wxStylist: () => {
        this.setState({ view: 'stylist', sel: null, editOpen: false });
        setTimeout(() => this.stylistKuld(kerdes), 60);
      },
    });
    return out;
  }

  // ==========================================================================
  // SZENNYES – viselés után a mosható darabok ide kerülnek; színek szerint
  // csoportosítva (sötét / fehér-világos / színes), csoportonként egy gombnyomással
  // kivehetők. A cipő, a kabát és a kiegészítők nem kerülnek ide automatikusan.
  // ==========================================================================
  moshato(d) {
    const h = helyDarab(d);
    return h === 'felso' || h === 'also';
  }

  // demó: a viselt mosható darabok a szennyesbe (a valódi fióknál ezt a szerver intézi)
  demoSzennyesbe(kulcsok) {
    const darabok = this._demoDarabok || [];
    const uj = { ...(this.state.demoSzennyes || {}) };
    kulcsok.forEach((k) => { const d = darabok.find((x) => x.key === k); if (d && this.moshato(d)) uj[k] = true; });
    this.setState({ demoSzennyes: uj });
  }

  renderSzennyesVals(v) {
    const s = this.state;
    const valos = !!v.napiValos;
    if (!valos) this._demoDarabok = v.napiDarabok || [];
    const isSzennyes = s.view === 'laundry';
    const toSzennyes = () => this.setState({ view: 'laundry', sel: null, editOpen: false });
    const szennyes = (v.napiDarabok || []).filter((d) => d.inLaundry);
    const out = { isSzennyes, toSzennyes };
    // menüpont az Okos szekrény után, a darabszámmal
    const nav = (v.navItems || []).slice();
    const hol = nav.findIndex((n) => n.icon === 'okos');
    nav.splice(hol < 0 ? nav.length - 1 : hol + 1, 0, { label: szennyes.length ? 'Szennyes · ' + szennyes.length : 'Szennyes', icon: 'laundry', cls: isSzennyes ? 'is-active' : '', on: toSzennyes });
    out.navItems = nav;
    if (!isSzennyes) return out;
    out.gridMod = 'is-norail';
    out.railDisplay = 'none';

    // színcsoport: sötét / fehér és világos / színes
    const VILAGOS = new Set(['fehér', 'bézs', 'világosszürke', 'világoskék', 'rózsaszín', 'sárga']);
    const SOTET = new Set(['fekete', 'sötétszürke', 'szürke', 'sötétkék', 'farmerkék', 'bordó', 'sötétzöld', 'barna', 'olíva', 'khaki']);
    const csoport = (d) => {
      const szin = styDarabSzin(d);
      if (!szin) return { k: 'szines', szin: '' };
      if (VILAGOS.has(szin)) return { k: 'vilagos', szin };
      if (SOTET.has(szin)) return { k: 'sotet', szin };
      return { k: 'szines', szin };
    };
    const kivesz = async (lista) => {
      if (!lista.length) return;
      if (valos) {
        await Promise.all(lista.map((d) => fetch('/api/items/' + d.key, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ inLaundry: false }) })));
        await this.reloadItems();
      } else {
        const uj = { ...(this.state.demoSzennyes || {}) };
        lista.forEach((d) => { delete uj[d.key]; });
        this.setState({ demoSzennyes: uj });
      }
      this.setState({ szennyesUzenet: lista.length === 1 ? '„' + lista[0].label + '” kimosva, újra viselhető.' : lista.length + ' darab kimosva, újra viselhetők.' });
    };
    // mosási adatok: a címke alapján, vagy becsülve (lásd careDarab)
    const care = (d) => careDarab(d, valos ? d.care : (s.demoCare || {})[d.key]) || { mosas: '40', becsult: true };
    const HOFOK_SOR = ['kezi', '30', '40', '60', '90'];
    const hofokCsop = (d) => { const m = care(d).mosas; return m === '90' ? '60' : (m || '40'); };
    // egy adag tanácsa: a legkényesebb darab szabja meg a programot
    const tipp = (lista, szinSzerint) => {
      if (!lista.length) return '';
      const cs = lista.map(care);
      const sorok = [];
      if (szinSzerint) {
        const moshato = cs.filter((c) => c.mosas !== 'tilos');
        const min = moshato.map((c) => c.mosas).sort((a, b) => HOFOK_SOR.indexOf(a) - HOFOK_SOR.indexOf(b))[0];
        const becsult = cs.filter((c) => c.becsult).length;
        if (min) sorok.push('Program: ' + (min === 'kezi' ? 'kímélő / kézi mosás' : min + '°')
          + (becsult === cs.length ? ' (becsült)' : becsult ? ' (részben becsült)' : ''));
        const kezi = cs.filter((c) => c.mosas === 'kezi').length;
        if (kezi && kezi < moshato.length) sorok.push(kezi + ' darab csak kézzel mosható – azt vedd ki külön');
      } else {
        const szinek = lista.map((d) => csoport(d).k);
        if (szinek.includes('sotet') && szinek.includes('vilagos')) sorok.push('Sötét és világos is van benne – két adagban moss');
      }
      const tilos = cs.filter((c) => c.mosas === 'tilos').length;
      if (tilos) sorok.push(tilos + ' darab nem mosható – vegytisztítóba való');
      const szarito = cs.filter((c) => c.szarito === 'tilos').length;
      if (szarito) sorok.push(szarito + ' darab ne menjen szárítógépbe');
      return sorok.join(' · ');
    };
    const darabSor = (d) => {
      const cs = csoport(d);
      const c = care(d);
      return {
        label: d.label, cat: d.cat || '', photoUrl: d.photoUrl || '',
        szin: cs.szin ? cs.szin : 'nincs felismert szín',
        pont: cs.szin ? (SZIN_LISTA[cs.szin] || '') : '',
        pontCls: cs.szin ? '' : 'is-ures',
        fotoCls: d.photoUrl ? 'has-photo' : '',
        mosas: (c.becsult ? '~' : '') + (CARE_MOSAS_NEV[c.mosas] || '') + (c.szarito === 'tilos' ? ' · ne szárítsd gépben' : ''),
        mosasCls: c.becsult ? 'is-becsult' : '',
        mosasCim: c.becsult ? 'Becsült érték – a darabnál fotózd le a címkét a pontos adatokért' : 'A mosási címke alapján',
        kimos: () => kivesz([d]),
      };
    };
    const hofokMod = s.szMod === 'hofok';
    out.szModok = [['szin', 'Szín szerint'], ['hofok', 'Hőfok szerint']].map(([k, label]) => ({
      label, cls: (hofokMod ? 'hofok' : 'szin') === k ? 'is-active' : '', on: () => this.setState({ szMod: k }),
    }));
    const CSOP = hofokMod ? [
      { k: 'kezi', cim: 'Kézi és kímélő', alcim: 'Gyapjú, selyem és más kényes anyagok', gomb: 'Kézi adag kimosva', jel: 'Kézi' },
      { k: '30', cim: '30°-os adag', alcim: 'Farmer, sportruha, viszkóz, élénk színek', gomb: '30°-os adag kimosva', jel: '30°' },
      { k: '40', cim: '40°-os adag', alcim: 'Hétköznapi pamut és vegyes anyagok', gomb: '40°-os adag kimosva', jel: '40°' },
      { k: '60', cim: '60° és felette', alcim: 'Fehér pamut, zokni, alsónemű', gomb: '60°-os adag kimosva', jel: '60°' },
      { k: 'tilos', cim: 'Nem mosható', alcim: 'Vegytisztítóba vagy szellőztetés', gomb: 'Vegytisztítóból vissza', jel: '✕' },
    ].filter((c) => c.k === '30' || c.k === '40' || szennyes.some((d) => hofokCsop(d) === c.k)) : [
      { k: 'sotet', cim: 'Sötétek', alcim: 'Fekete, sötétkék, szürke, farmer, barna…', gomb: 'Sötétek kimosva', jel: '' },
      { k: 'vilagos', cim: 'Fehérek és világosak', alcim: 'Fehér, bézs, világos árnyalatok', gomb: 'Fehérek kimosva', jel: '' },
      { k: 'szines', cim: 'Színesek és egyéb', alcim: 'Élénk színek, mintás vagy felismeretlen színű darabok', gomb: 'Színesek kimosva', jel: '' },
    ];
    out.szCsoportok = CSOP.map((c) => {
      const lista = szennyes.filter((d) => (hofokMod ? hofokCsop(d) : csoport(d).k) === c.k);
      const t = tipp(lista, !hofokMod);
      return {
        cim: c.cim, alcim: c.alcim, jel: c.jel,
        cls: (hofokMod ? 'is-h is-h-' : 'is-') + c.k + (lista.length ? '' : ' is-ures'),
        db: lista.length + ' darab',
        ures: lista.length === 0,
        uresSzoveg: hofokMod ? 'Nincs ilyen hőfokú darab a szennyesben.' : 'Nincs ilyen színű darab a szennyesben.',
        van: lista.length > 0,
        tipp: t,
        vanTipp: !!t,
        gomb: c.gomb + (lista.length ? ' (' + lista.length + ')' : ''),
        kimos: () => kivesz(lista),
        darabok: lista.map(darabSor),
      };
    });
    out.szOssz = szennyes.length;
    out.szOsszSzoveg = szennyes.length ? szennyes.length + ' darab vár mosásra' : 'Üres a szennyes – minden ruhád tiszta';
    out.szVan = szennyes.length > 0;
    out.szUres = szennyes.length === 0;
    out.szMind = () => kivesz(szennyes);
    out.szUzenet = s.szennyesUzenet || '';
    out.szVanUzenet = !!s.szennyesUzenet;
    return out;
  }

  // ==========================================================================
  // MOSÁSI CÍMKE – a kijelölt darab paneljén (fotó → szövegfelismerés → űrlap)
  // ==========================================================================
  careKijelolt(v) {
    const s = this.state;
    const darabok = v.napiDarabok || [];
    if (!s.sel) return null;
    if (v.napiValos) return darabok.find((d) => d.key === s.sel.id) || null;
    return darabok.find((d) => d.label === s.sel.label && (!s.sel.cat || d.cat === s.sel.cat)) || null;
  }

  careFotoz = async (d, valos, sajat) => {
    const file = await fajlValaszt(true);
    if (!file) return;
    const elonezet = URL.createObjectURL(file);
    this.setState({
      careEdit: { key: d.key, care: { ...(sajat || {}) }, elonezet },
      careOlvas: true, careHiba: false,
      careUzenet: 'Címke beolvasása… (első alkalommal a szövegfelismerő letöltése fél percig is eltarthat)',
    });
    // a címke fotója a darabhoz mentve (később is meg lehet nézni)
    let kep = '';
    if (valos) {
      try {
        const c = await kepCanvas(file, 1400, false);
        const blob = await new Promise((ok) => c.toBlob(ok, 'image/jpeg', 0.85));
        const up = await fetch('/api/photos', { method: 'POST', headers: { 'content-type': 'image/jpeg' }, body: blob });
        if (up.ok) kep = (await up.json()).url || '';
      } catch (e) { /* a fotó nélkül is mehet tovább */ }
    }
    let eredm = { care: {}, talalt: [] };
    let hiba = false;
    try {
      const T = await tesseractBetolt();
      const c = await kepCanvas(file, 1800, true);
      const r = await Promise.race([
        T.recognize(c, 'eng+hun'),
        new Promise((_, rossz) => setTimeout(() => rossz(new Error('időtúllépés')), 90000)),
      ]);
      eredm = careOcrErtelmez(r && r.data ? r.data.text : '');
    } catch (e) { hiba = true; }
    const ed = this.state.careEdit;
    if (!ed || ed.key !== d.key) return; // közben bezárta vagy másik darabra kattintott
    const care = { ...ed.care, ...eredm.care };
    if (kep) care.kep = kep;
    else if (!valos) care.kep = elonezet;
    this.setState({
      careEdit: { ...ed, care }, careOlvas: false, careHiba: hiba || !eredm.talalt.length,
      careUzenet: hiba
        ? 'A szövegfelismerő most nem érhető el (nincs internet?). Koppints a címkén látható jelekre – a fotót elmentjük a darabhoz.'
        : eredm.talalt.length
          ? 'Felismertem: ' + eredm.talalt.join(', ') + '. Ellenőrizd a jeleket, aztán mentsd.'
          : 'Nem találtam olvasható szöveget a címkén (a jeleket a gép nem tudja kiolvasni). Koppints a címkén látható jelekre.',
    });
  };

  careMentes = async (d, valos, care) => {
    const tiszta = {};
    Object.keys(care || {}).forEach((k) => { if (care[k]) tiszta[k] = care[k]; });
    const ertek = Object.keys(tiszta).length ? tiszta : null;
    if (valos) {
      try {
        await fetch('/api/items/' + d.key, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ care: ertek }) });
        await this.reloadItems();
      } catch (e) { return this.setState({ careHiba: true, careUzenet: 'Nem sikerült menteni. Ellenőrizd, hogy fut-e a szerver.' }); }
    } else {
      this.setState({ demoCare: { ...(this.state.demoCare || {}), [d.key]: ertek } });
    }
    const ed = this.state.careEdit;
    if (valos && ed && ed.elonezet) URL.revokeObjectURL(ed.elonezet);
    this.setState({ careEdit: null, careOlvas: false, careUzenet: '', careHiba: false });
  };

  renderCareVals(v) {
    const s = this.state;
    const valos = !!v.napiValos;
    const d = this.careKijelolt(v);
    const out = { selCareVan: !!d, careEditOpen: false, selCareChipek: [], careSorok: [] };
    if (!d) return out;
    const sajat = valos ? d.care : (s.demoCare || {})[d.key];
    const eff = careDarab(d, sajat);
    const ed = s.careEdit && s.careEdit.key === d.key ? s.careEdit : null;
    out.selCareChipek = careChipek(eff);
    out.selCareAllapot = !eff ? 'Cipőnél, kiegészítőnél nincs mosási javaslat' : eff.becsult ? 'Becsült – fotózd le a címkét a pontos adatokért' : 'A mosási címke alapján';
    out.selCareAllapotCls = eff && !eff.becsult ? 'is-pontos' : 'is-becsult';
    out.selCareKep = (sajat && sajat.kep) || '';
    out.selCareKepVan = !!out.selCareKep;
    out.careFotoz = () => this.careFotoz(d, valos, sajat);
    out.careSzerk = () => this.setState({ careEdit: { key: d.key, care: { ...(sajat || {}) } }, careUzenet: '', careHiba: false, careOlvas: false });
    out.careFotoLabel = sajat && sajat.mosas ? 'Új címkefotó' : 'Címke fotózása';
    out.careEditOpen = !!ed;
    if (!ed) return out;
    const allit = (k, val) => this.setState({ careEdit: { ...ed, care: { ...ed.care, [k]: val } } });
    out.careSorok = CARE_SOROK.map((r) => ({
      cim: r.cim,
      opts: r.opts.map(([val, label]) => ({
        label, cls: ed.care[r.k] === val ? 'is-active' : '',
        on: () => allit(r.k, ed.care[r.k] === val ? '' : val),
      })),
    }));
    out.careAnyag = ed.care.anyag || '';
    out.onCareAnyag = (e) => allit('anyag', e.target.value);
    out.careElonezet = ed.elonezet || ed.care.kep || '';
    out.careElonezetVan = !!out.careElonezet;
    out.careOlvas = !!s.careOlvas;
    out.careUzenet = s.careUzenet || '';
    out.careUzenetVan = !!s.careUzenet;
    out.careUzenetCls = s.careOlvas ? 'is-olvas' : (s.careHiba ? 'is-hiba' : '');
    out.careMentLabel = s.careOlvas ? 'Beolvasás…' : 'Mentés';
    out.careMent = () => { if (!s.careOlvas) this.careMentes(d, valos, ed.care); };
    out.careTorol = () => this.careMentes(d, valos, null);
    out.careMegse = () => {
      if (valos && ed.elonezet) URL.revokeObjectURL(ed.elonezet);
      this.setState({ careEdit: null, careOlvas: false, careUzenet: '', careHiba: false });
    };
    return out;
  }

  // ==========================================================================
  // "MEGVEGYEM?" – vásárlási segéd (lásd a VS_* állandókat fent)
  // ==========================================================================
  vsFotoValaszt = async () => {
    const file = await fajlValaszt(true);
    if (!file) return;
    const s = this.state;
    if (s.vsFoto) URL.revokeObjectURL(s.vsFoto);
    const url = URL.createObjectURL(file);
    this.setState({ vsFoto: url, vsFile: file, vsSzinOlvas: true });
    try {
      const sz = await szinFelismer(url);
      if (this.state.vsFoto === url) this.setState({ vsSzin: sz ? sz.nev : this.state.vsSzin, vsSzinHex: sz ? sz.hex : '', vsSzinAuto: !!sz, vsSzinOlvas: false });
    } catch (e) { this.setState({ vsSzinOlvas: false }); }
  };

  // az elemzés: tiszta függvény a darabokra (a sablontól független, könnyű tesztelni)
  vsElemez(darabok, uj) {
    const most = Date.now();
    const aktiv = darabok.filter((d) => d && d.label);
    const helyOfD = (d) => helyDarab(d);
    const parok = VS_PAROK[uj.hely] || [];
    // 1) mihez illik: a kiegészítő helyek darabjai, színharmóniával súlyozva
    const illok = aktiv.filter((d) => parok.includes(helyOfD(d)))
      .map((d) => ({ d, p: vsSzinIllik(uj.szin, styDarabSzin(d)) }))
      .filter((x) => x.p >= 0.5)
      .sort((a, b) => b.p - a.p || (b.d.wearCount || 0) - (a.d.wearCount || 0));
    const helyenkent = {};
    illok.forEach((x) => { const h = helyOfD(x.d); helyenkent[h] = (helyenkent[h] || 0) + 1; });
    // 2) hány új outfit jön ki belőle (felső × alsó × cipő jellegű kombinációk)
    const fo = parok.filter((h) => h !== 'kabat');
    let kombi = fo.reduce((acc, h) => acc * Math.max(1, helyenkent[h] || 0), 1);
    if (!fo.some((h) => helyenkent[h])) kombi = 0;
    // 3) hasonló darab, ami már megvan (ugyanaz a hely és nagyon hasonló szín)
    const hasonlo = aktiv.filter((d) => helyOfD(d) === uj.hely).filter((d) => {
      const sz = styDarabSzin(d);
      return (uj.szin && sz === uj.szin) || hexTav(uj.hex, d.szinHex) < 70;
    });
    const parlagon = hasonlo.filter((d) => !d.wearCount || (d.lastWornAt && most - d.lastWornAt > 90 * 864e5));
    // 4) becsült viselések egy évben a saját szokásaid alapján (ugyanilyen helyű darabok)
    const sajat = aktiv.filter((d) => helyOfD(d) === uj.hely && d.createdAt && d.wearCount);
    let evente = VS_ALAP_VISELES[uj.hely] || 30;
    if (sajat.length >= 2) {
      const rata = sajat.map((d) => d.wearCount / Math.max(0.25, (most - d.createdAt) / (365 * 864e5)));
      evente = Math.round(Math.min(150, Math.max(4, rata.reduce((a, b) => a + b, 0) / rata.length)));
    }
    const verseny = Math.max(1, aktiv.filter((d) => helyOfD(d) === uj.hely).length / 6);
    evente = Math.max(3, Math.round(evente / Math.sqrt(verseny) / (1 + hasonlo.length * 0.35)));
    const cpw = uj.ar > 0 ? uj.ar / evente : null;
    // 5) pontszám és indoklás
    let pont = 40;
    const okok = [];
    const illDb = illok.length;
    pont += Math.min(illDb, 10) * 3;
    if (illDb >= 6) okok.push({ jo: true, t: illDb + ' meglévő darabodhoz illik – sokoldalú vétel.' });
    else if (illDb >= 1) okok.push({ jo: illDb >= 3, t: 'Csak ' + illDb + ' meglévő darabodhoz illik igazán.' });
    else okok.push({ jo: false, t: 'Egyik meglévő darabodhoz sem illik jól – külön szett kellene hozzá.' });
    const helyDb = aktiv.filter((d) => helyOfD(d) === uj.hely).length;
    const helyNev = (VS_HELYEK.find(([k]) => k === uj.hely) || [, 'darab'])[1].toLowerCase();
    if (helyDb < 3) { pont += 10; okok.push({ jo: true, t: 'Kevés ' + helyNev + ' van a szekrényedben (' + helyDb + ') – hiánypótló.' }); }
    if (!hasonlo.length) { pont += 12; okok.push({ jo: true, t: 'Nincs még hasonló darabod – új színt / formát hoz.' }); }
    else { pont -= Math.min(30, hasonlo.length * 10); okok.push({ jo: false, t: 'Már van ' + hasonlo.length + ' hasonló: ' + hasonlo.slice(0, 2).map((d) => '„' + d.label + '”').join(', ') + (hasonlo.length > 2 ? '…' : '') + '.' }); }
    if (parlagon.length) { pont -= Math.min(20, parlagon.length * 8); okok.push({ jo: false, t: parlagon.length + ' hasonló darabod régóta (vagy soha) nem volt rajtad.' }); }
    if (uj.szin && SEMLEGES_SZIN.has(uj.szin)) { pont += 5; okok.push({ jo: true, t: 'Semleges szín (' + uj.szin + ') – szinte mindennel megy.' }); }
    else if (uj.szin) {
      // élénk szín: csak a semleges darabjaidhoz megy igazán
      const utkozo = illok.length ? 0 : 1;
      pont -= 5 + utkozo * 5;
      okok.push({ jo: false, t: 'Élénk szín (' + uj.szin + ') – főleg a semleges darabjaiddal tudod párosítani.' });
    }
    if (cpw !== null) {
      if (cpw <= 300) { pont += 10; okok.push({ jo: true, t: 'Egy viselése kb. ' + ftForma(cpw) + ' lenne – jó ár/érték.' }); }
      else if (cpw > 3000) { pont -= 20; okok.push({ jo: false, t: 'Egy viselése kb. ' + ftForma(cpw) + ' lenne – drága ahhoz képest, milyen gyakran hordanád.' }); }
      else if (cpw > 1200) { pont -= 8; okok.push({ jo: false, t: 'Egy viselése kb. ' + ftForma(cpw) + ' lenne – közepesen drága.' }); }
      else okok.push({ jo: true, t: 'Egy viselése kb. ' + ftForma(cpw) + ' lenne.' });
    }
    pont = Math.max(0, Math.min(100, Math.round(pont)));
    return { illok: illok.map((x) => x.d), kombi, hasonlo, parlagon, evente, cpw, pont, okok };
  }

  renderVasarlasVals(v) {
    const s = this.state;
    const isVasarlas = s.view === 'shop';
    const toVasarlas = () => this.setState({ view: 'shop', sel: null, editOpen: false });
    const out = { isVasarlas, toVasarlas };
    const nav = (v.navItems || []).slice();
    const hol = nav.findIndex((n) => n.icon === 'stylist');
    nav.splice(hol < 0 ? 1 : hol + 1, 0, { label: 'Megvegyem?', icon: 'bag', cls: isVasarlas ? 'is-active' : '', on: toVasarlas });
    out.navItems = nav;
    if (!isVasarlas) return out;
    out.gridMod = 'is-norail';
    out.railDisplay = 'none';

    const darabok = v.napiDarabok || [];
    // a hely: amit kiválasztott, vagy a beírt névből kitalált
    const nevHely = (() => {
      const n = s.vsNev || '';
      if (!n.trim()) return '';
      const x = HELY_MINTA.find(([, re]) => re.test(n));
      return x ? x[0] : '';
    })();
    const hely = s.vsHely || nevHely || 'felso';
    // szín: a fotóról felismert, a kézzel választott, vagy a névből
    const nevSzin = styNorm(s.vsNev || '').split(' ').map(stySzinSzo).find(Boolean) || '';
    const szin = s.vsSzin || nevSzin || '';
    const ar = parseInt(String(s.vsAr || '').replace(/\D/g, ''), 10) || 0;
    const kesz = !!(s.vsFoto || (s.vsNev || '').trim() || s.vsSzin);

    out.vsFoto = s.vsFoto || '';
    out.vsVanFoto = !!s.vsFoto;
    out.vsNincsFoto = !s.vsFoto;
    out.vsFotoValaszt = () => this.vsFotoValaszt();
    out.vsNev = s.vsNev || '';
    out.onVsNev = (e) => this.setState({ vsNev: e.target.value });
    out.vsAr = s.vsAr || '';
    out.onVsAr = (e) => this.setState({ vsAr: e.target.value.replace(/[^\d ]/g, '') });
    out.vsHelyek = VS_HELYEK.map(([k, label]) => ({
      label, cls: hely === k ? 'is-active' : '',
      on: () => this.setState({ vsHely: k }),
    }));
    out.vsHelyTipp = !s.vsHely && nevHely ? 'A névből: ' + (VS_HELYEK.find(([k]) => k === nevHely) || ['', ''])[1] : '';
    out.vsSzinek = Object.keys(SZIN_LISTA).map((nev) => ({
      label: nev, dot: SZIN_LISTA[nev], cls: szin === nev ? 'is-active' : '',
      on: () => this.setState({ vsSzin: szin === nev ? '' : nev, vsSzinAuto: false, vsSzinHex: '' }),
    }));
    out.vsSzinCim = s.vsSzinOlvas ? 'Szín felismerése…' : (szin ? (s.vsSzinAuto ? 'Felismert szín: ' + szin : 'Szín: ' + szin) : 'Válaszd ki a színét');
    out.vsSzinDot = szin ? (s.vsSzinHex || SZIN_LISTA[szin] || '') : '';
    out.vsUjra = () => {
      if (s.vsFoto) URL.revokeObjectURL(s.vsFoto);
      this.setState({ vsFoto: '', vsFile: null, vsNev: '', vsAr: '', vsHely: '', vsSzin: '', vsSzinHex: '', vsSzinAuto: false });
    };
    out.vsKesz = kesz;
    out.vsUres = !kesz;
    out.vsKevesDarab = darabok.length < 3;
    if (!kesz) return out;

    const e = this.vsElemez(darabok, { hely, szin, hex: s.vsSzinHex || '', ar });
    const itelet = e.pont >= 70 ? ['Megéri', 'is-jo', 'Jól illik a szekrényedhez – ezt tényleg hordanád.']
      : e.pont >= 45 ? ['Gondold át', 'is-kozep', 'Van mellette és ellene is érv. Aludj rá egyet.']
        : ['Inkább hagyd ki', 'is-rossz', 'Valószínűleg a szekrényben maradna. Keress jobban illőt.'];
    out.vsPont = String(e.pont);
    out.vsGyuruBg = 'conic-gradient(var(--vs-szin) 0 ' + Math.round(e.pont * 3.6) + 'deg, var(--vs-ures) 0)';
    out.vsItelet = itelet[0];
    out.vsIteletCls = itelet[1];
    out.vsIteletSzoveg = itelet[2];
    out.vsOkok = e.okok.map((o) => ({ t: o.t, cls: o.jo ? 'is-jo' : 'is-rossz', jel: o.jo ? '+' : '–' }));
    const kombiSzoveg = e.kombi > 99 ? '99+' : String(e.kombi);
    out.vsStatok = [
      { szam: String(e.illok.length), cim: 'darabodhoz illik' },
      { szam: kombiSzoveg, cim: 'új outfit-lehetőség' },
      { szam: String(e.hasonlo.length), cim: 'hasonló már megvan' },
      { szam: e.cpw !== null ? ftForma(e.cpw) : '—', cim: e.cpw !== null ? 'egy viselés (~' + e.evente + ' viselés / év)' : 'add meg az árát a viselésenkénti árhoz' },
    ];
    const kartya = (d) => ({
      label: d.label, sub: [styDarabSzin(d), d.cat].filter(Boolean).join(' · '),
      photoUrl: d.photoUrl || '', cls: d.photoUrl ? 'has-photo' : '',
      viseles: d.wearCount ? d.wearCount + '× viselted' : 'még nem viselted',
    });
    out.vsIllok = e.illok.slice(0, 12).map(kartya);
    out.vsVanIllo = e.illok.length > 0;
    out.vsHasonlok = e.hasonlo.slice(0, 8).map(kartya);
    out.vsVanHasonlo = e.hasonlo.length > 0;
    // megvette: átvisszük a feltöltéshez (fotó, név, ár előtöltve)
    out.vsVanMegvett = !!s.vsFile;
    out.vsMegvettem = () => {
      if (s.vsFile) this.vsAtad(s.vsFile, (s.vsNev || '').trim() || (szin ? szin + ' ' : '') + (VS_HELYEK.find(([k]) => k === hely) || ['', 'darab'])[1].toLowerCase(), ar ? String(ar) : '');
    };
    return out;
  }

  // a megvett darab a "Hozzáadás" feltöltőbe kerül: fotó, név és ár előtöltve, a háttér is lekerül
  vsAtad(file, nev, ar) {
    const s = this.state;
    const kulcs = 'vasarlas-' + Date.now();
    this.setState({
      drops: [...s.drops, kulcs],
      phonePhotos: { ...s.phonePhotos, [kulcs]: URL.createObjectURL(file) },
      dropNames: { ...(s.dropNames || {}), [kulcs]: nev },
      dropPrices: { ...(s.dropPrices || {}), [kulcs]: ar },
      view: 'add', addMode: 'foto', sel: null, editOpen: false,
    });
    this.hatterFeldolgoz(kulcs);
  }

  renderStylistVals(v) {
    const s = this.state;
    this._sty = { darabok: v.napiDarabok || [], valos: !!v.napiValos };
    const msgs = s.chatMsgs || this.stylistKezdo();
    const pref = s.chatPref || {};
    const chips = s.chatChips || ['Esős időben megyek egy drága étterembe', 'Valami laza a hétvégére', 'Állásinterjúm lesz', 'Edzésre megyek', 'Lepj meg!'];
    const N = {
      alkalom: { munka: 'Munka', program: 'Program / vacsora', buli: 'Buli', sport: 'Sport', laza: 'Laza nap', mindegy: 'Mindegy' },
      stilus: { elegans: 'Elegáns', laza: 'Laza', sportos: 'Sportos', street: 'Utcai', mindegy: 'Mindegy' },
      ido: { hideg: 'Hideg', huvos: 'Hűvös', enyhe: 'Enyhe', meleg: 'Meleg', eso: 'Esős', mindegy: 'Mindegy' },
    };
    const szinNev = (x) => (!x ? '' : x === 'semleges' ? 'Semleges' : x === 'szines' ? 'Színes' : x === 'mindegy' ? 'Mindegy' : x[0].toUpperCase() + x.slice(1));
    const sor = (label, ertek, ico) => ({ label, value: ertek || 'Még nem tudom', cls: ertek ? 'is-set' : '', icon: ico });
    const isStylist = s.view === 'stylist';
    const out = {
      isStylist,
      toStylist: () => this.setState({ view: 'stylist', sel: null, editOpen: false }),
      chatMsgs: msgs.map((m, i) => ({
        cls: m.from === 'bot' ? 'is-bot' : 'is-me',
        isBot: m.from === 'bot',
        text: m.text,
        hasOutfit: !!(m.outfit && m.outfit.length),
        outfit: (m.outfit || []).map((d) => ({ ...d, cls: d.photoUrl ? 'has-photo' : '' })),
        okok: (m.okok || []).map((t) => ({ t })),
        hasOkok: !!(m.okok && m.okok.length),
      })),
      chatChips: chips.map((c) => ({ label: c, on: () => this.stylistKuld(c) })),
      chatHasChips: chips.length > 0 && !s.chatTyping,
      chatTyping: !!s.chatTyping,
      chatInput: s.chatInput || '',
      onChatInput: (e) => this.setState({ chatInput: e.target.value }),
      onChatKey: (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.stylistKuld(e.target.value); } },
      chatSend: () => this.stylistKuld(s.chatInput),
      chatSendCls: (s.chatInput || '').trim() ? 'is-ready' : '',
      chatReset: () => this.setState({ chatMsgs: this.stylistKezdo(), chatPref: {}, chatMag: 1, chatKerdes: '', chatProba: 0, chatUtolso: null, chatTyping: false, chatChips: null, chatInput: '' }),
      chatPrefs: [
        sor('Alkalom', N.alkalom[pref.alkalom], 'calendar'),
        sor('Stílus', N.stilus[pref.stilus], 'sparkle'),
        sor('Időjárás', N.ido[pref.ido] ? N.ido[pref.ido] + (pref.idoAuto ? ' · ' + pref.idoAuto : '') : '', 'sun'),
        sor('Szín', [szinNev(pref.szin), pref.arny === 'sotet' ? 'Sötét tónusok' : pref.arny === 'vilagos' ? 'Világos tónusok' : ''].filter(Boolean).join(' · '), 'palette'),
        sor('Részletek', (pref.cimkek || []).filter((c) => !/^nem /.test(c)).slice(-4).join(' · '), 'tag'),
        sor('Kerülöm', [...(pref.szinNot || []), ...(pref.kerul || []).map((k) => (k.szin ? k.szin + ' ' : '') + k.nev), ...(pref.kabat === false ? ['kabát'] : [])].join(', '), 'close'),
      ],
      chatItemCount: String((v.napiDarabok || []).length),
    };
    // menüpont a Főoldal / Ma után
    const nav = (v.navItems || []).slice();
    const hol = nav.findIndex((n) => n.icon === 'home');
    nav.splice(hol < 0 ? 1 : hol + 1, 0, { label: 'Stylist', icon: 'stylist', cls: isStylist ? 'is-active' : '', on: out.toStylist });
    out.navItems = nav;
    if (isStylist) { out.gridMod = 'is-norail'; out.railDisplay = 'none'; }
    return out;
  }

  // FŐOLDAL (nyitóoldal) – ide érkezel belépés után: üdvözlés, gyors műveletek
  // és csúsztatható kártyasorok (kategóriák, outfitek, inspiráció a katalógusból).
  // A demó és a valódi mód kész értékeiből dolgozik, ezért mindkettőben működik.
  renderStartVals(v) {
    const s = this.state;
    const isStart = s.view === 'start';
    const num = (x) => parseInt(x, 10) || 0;
    const tiles = v.homeTiles || [];
    const outfits = v.outfitList || [];
    const idle = v.idleItems || [];
    const total = tiles.reduce((a, t) => a + num(t.count), 0);
    // a sáv nyilai: a kártyasor egy "képernyőnyit" görget
    const slide = (dir) => (e) => {
      const sec = e.currentTarget.closest('.we-start-sec');
      const track = sec && sec.querySelector('.we-start-track');
      if (track) track.scrollBy({ left: dir * Math.max(240, track.clientWidth * 0.8), behavior: 'smooth' });
    };
    // inspiráció: a katalógus termékei eBay-fotóval (márkánként egy), a futószalaghoz kétszer egymás után
    if (isStart) this.ebayKepekBetolt();
    const kepek = s.ebayKepek || {};
    const inspo = KATALOGUS.filter((t) => !t.generikus && kepek[t.key]).filter((t, i, arr) => arr.findIndex((x) => x.marka === t.marka) === i).slice(0, 14)
      .map((t) => ({
        brand: t.marka, name: t.nev, kind: t.tipus,
        photoUrl: kepek[t.key], credit: 'Fotó: eBay',
        on: () => this.setState({ view: 'add', addMode: 'kat', katBrand: t.marka, katKind: '', katQ: '', sel: null, editOpen: false }),
      }));
    const go = (view, extra) => () => this.setState({ view, sel: null, editOpen: false, ...(extra || {}) });
    const features = [
      { title: 'Okos statisztika', line: 'Kategóriák, színek és a szekrényed értéke egy helyen.', icon: 'chart', tag: 'Elemzés', on: go('okos', { okosTab: 'stat' }) },
      { title: 'Kapszulagardrób', line: 'Kevés darab, sok kombináció. Nézd meg, mi hiányzik.', icon: 'outfits', tag: 'Stílus', on: go('okos', { okosTab: 'kapszula' }) },
      { title: 'Bőröndpakoló', line: 'Napokra bontott csomaglista az időjárás alapján.', icon: 'calendar', tag: 'Utazás', on: go('okos', { okosTab: 'utazas' }) },
      { title: 'Kihasználatlan', line: idle.length ? idle.length + ' darab vár arra, hogy újra felvedd.' : 'Minden darabodat hordod mostanában.', icon: 'untouched', tag: 'Rendrakás', on: go('untouched') },
    ];
    const nav = (v.navItems || []).map((n) => (n.icon === 'home' ? { ...n, label: 'Ma' } : n));
    const startNav = { label: 'Főoldal', icon: 'start', cls: isStart ? 'is-active' : '', on: go('start') };
    const hour = new Date().getHours();
    const out = {
      isStart,
      navItems: [startNav, ...nav],
      toHome: go('start'),
      startGreeting: (hour < 10 ? 'Jó reggelt' : hour < 18 ? 'Szia' : 'Szép estét') + ', ' + (v.firstName || 'Barátom') + '!',
      startDate: new Date().toLocaleDateString('hu-HU', { weekday: 'long', month: 'long', day: 'numeric' }),
      startWeather: (v.weatherTemp || '') + (v.weatherLine ? ' · ' + v.weatherLine : ''),
      startStats: [
        { value: String(total), label: 'darab' },
        { value: String(tiles.length), label: 'kategória' },
        { value: String(outfits.length), label: 'outfit' },
        { value: String(idle.length), label: 'kihasználatlan' },
      ],
      startToToday: go('home'),
      startToAdd: v.toAdd,
      startToBuilder: v.toBuilder,
      startToWardrobe: v.viewAll,
      startToOutfits: go('outfits'),
      startCats: tiles.map((t, i) => ({ ...t, idx: String(i + 1).padStart(2, '0') })),
      startCatsEmpty: tiles.length === 0,
      startOutfits: outfits.map((o) => ({ name: o.name, sub: o.sub, thumbs: o.thumbs, mark: o.mark, on: o.on })),
      startOutfitsEmpty: outfits.length === 0,
      startInspo: inspo.concat(inspo),
      startHasInspo: inspo.length > 0,
      startFeatures: features,
      startPrev: slide(-1),
      startNext: slide(1),
    };
    if (isStart) { out.gridMod = 'is-norail'; out.railDisplay = 'none'; }
    return out;
  }

  // Egy még el nem mentett fotó extra mezői: háttér-eltávolítás állapota és ár
  dropExtra(file) {
    const s = this.state;
    const allapot = (s.hatter || {})[file] || '';
    const vanFoto = !!s.phonePhotos[file];
    const szoveg = {
      fut: 'Háttér eltávolítása…', kesz: 'Háttér eltávolítva · eredeti', eredeti: 'Eredeti fotó · háttér levágása', hiba: 'Nem sikerült · újra',
    }[allapot] || 'Háttér eltávolítása';
    return {
      hatterVan: vanFoto,
      hatterLabel: szoveg,
      hatterCls: allapot ? 'is-' + allapot : '',
      hatterIcon: allapot === 'kesz' ? 'undo' : (allapot === 'fut' ? 'refresh' : 'image'),
      hatterValt: () => this.hatterValt(file),
      boxCls: allapot === 'kesz' ? 'is-kivagott' : '',
      price: (s.dropPrices || {})[file] || '',
      onPrice: (e) => this.setState({ dropPrices: { ...(s.dropPrices || {}), [file]: e.target.value.replace(/[^0-9]/g, '') } }),
    };
  }

  // Viselésenkénti ár egy ruhára: ár / viselések száma, és hogy mennyi lesz pár viselés múlva
  cpwVals(item) {
    const ures = { selCpwVan: false, selCpwFo: '', selCpwSor: '', selCpwHint: '' };
    if (!item) return ures;
    if (item.price === null || item.price === undefined) {
      return { ...ures, selCpwHint: 'Add meg az árát a „Szerkesztés”-ben, és kiszámolom, mennyibe kerül egy viselése.' };
    }
    const db = item.wearCount || 0;
    if (!db) {
      return { selCpwVan: true, selCpwFo: ftForma(item.price), selCpwSor: 'Ár · még egyszer sem viselted',
        selCpwHint: 'Minden viseléssel csökken, mennyibe került egy alkalom.' };
    }
    const cel = db < 10 ? 10 : (db < 30 ? 30 : db + 20);
    return {
      selCpwVan: true,
      selCpwFo: ftForma(item.price / db) + ' / viselés',
      selCpwSor: ftForma(item.price) + ' · ' + db + ' viselés',
      selCpwHint: (cel - db) + ' viselés múlva már csak ' + ftForma(item.price / cel) + ' lesz.',
    };
  }

  // "Mit vegyek fel ma?" és a próbababák (kezdőlap, outfit-nézet, összeállító).
  // A két mód (demó / valódi) a base-ben adja át a darabokat egységes formában:
  // { key, label, cat, photoUrl, lastWornAt, wornToday, kivagott }
  renderUjVals(base) {
    const s = this.state;
    const darabok = (base.napiDarabok || []).filter((d) => !d.inLaundry && !d.needsRepair);
    const mag = s.napiMag || maiMag();
    const napi = napiOutfit(darabok, s.weather, mag);
    const fok = napi.fok;
    const regi = napi.darabok
      .filter((d) => d.lastWornAt && Date.now() - d.lastWornAt > 60 * 864e5)
      .map((d) => d.label)[0];
    let ok = fok === null ? 'Az időjárást nem sikerült lekérni, ezért kabát nélkül állítottam össze.'
      : Math.round(fok) + '° ' + (s.weather && s.weather.description ? '(' + s.weather.description.toLowerCase() + ')' : '') +
        (fok < 16 ? ': kabát is kell.' : ': kabát nélkül is jó.');
    if (regi) ok += ' A(z) ' + regi + ' régóta vár a szekrényben.';
    const hianyzik = ['felso', 'also', 'cipo'].filter((h) => !napi.darabok.some((d) => helyDarab(d) === h));
    const ids = napi.darabok.map((d) => d.key);
    const maiNev = 'Napi outfit · ' + new Date().toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
    // hány fotón van még háttér (valódi fióknál): ezekről egy gombbal levehető
    const hatteres = base.napiValos ? (s.items || []).filter((it) => it.photoUrl && !it.origPhotoUrl && !it.removedAt).length : 0;
    const hm = s.hatterMind;
    return {
      babaHatterVan: !!(hm || hatteres || s.hatterMindUzenet),
      babaHatterFut: !!hm,
      babaHatterSzoveg: hm
        ? 'Háttér eltávolítása: ' + hm.kesz + ' / ' + hm.ossz + ' kész…'
        : hatteres
          ? hatteres + ' fotódon még látszik a háttér. Háttér nélkül a ruha egészben, pontosan illeszkedik a babára.'
          : (s.hatterMindUzenet || ''),
      babaHatterGomb: hatteres && !hm,
      babaHatterGombLabel: 'Háttér eltávolítása mind (' + hatteres + ')',
      babaHatterSzazalek: hm ? Math.round(hm.kesz / hm.ossz * 100) + '%' : '0%',
      babaHatterInditas: () => this.realHatterMind(),
      napiVan: darabok.length > 0,
      napiBaba: babaAdat(napi.darabok),
      napiOk: ok,
      napiHiany: hianyzik.length
        ? 'Még nincs ' + hianyzik.map((h) => BABA_HELY_NEV[h].toLowerCase()).join(', ') + ' a szekrényedben, ezért az kimaradt.'
        : '',
      napiLista: napi.darabok.map((d) => ({ label: d.label, hely: BABA_HELY_NEV[helyDarab(d)], photoUrl: d.photoUrl || '' })),
      napiUzenet: s.napiUzenet || '',
      napiMasik: () => this.setState({ napiMag: mag + 1, napiUzenet: '' }),
      napiViselem: async () => {
        if (!ids.length) return;
        if (base.napiValos) {
          await Promise.all(ids.map((id) => fetch('/api/items/' + id, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ wornToday: true }) })));
          await this.reloadItems();
        } else {
          const worn = { ...s.worn }; ids.forEach((k) => { worn[k] = true; });
          this.setState({ worn });
          this.demoSzennyesbe(ids);
        }
        this.setState({ napiUzenet: 'Naplózva: ma ezt viseled. A mosható darabok a szennyesbe kerültek.' });
      },
      napiMent: async () => {
        if (!ids.length) return;
        if (base.napiValos) {
          await fetch('/api/outfits', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: maiNev, occasion: 'Bármilyen alkalom', season: 'Bármilyen évszak', itemIds: ids }),
          });
          await this.reloadOutfits();
          this.setState({ napiUzenet: 'Elmentve az Outfitek közé „' + maiNev + '” néven.' });
        } else {
          this.setState({ napiUzenet: 'A demóban nem lehet menteni - jelentkezz be a saját szekrényeddel.' });
        }
      },
      outfitBaba: babaAdat(base.outfitDarabok || []),
      builderBaba: babaAdat(base.builderDarabok || []),
      napiHarmonia: szinHarmonia(napi.darabok),
      outfitHarmonia: szinHarmonia(base.outfitDarabok || []),
      builderHarmonia: szinHarmonia(base.builderDarabok || []),
    };
  }

  // ==========================================================================
  // OKOS SZEKRÉNY: statisztika, kapszulagardrób, bőröndpakoló, mosás/állapot
  // A darabok ugyanabban a formában jönnek, mint a napi ajánlathoz (base.napiDarabok).
  // ==========================================================================
  renderOkosVals(base) {
    const s = this.state;
    const darabok = base.napiDarabok || [];
    const valos = !!base.napiValos;
    const tab = s.okosTab || 'stat';
    const fulek = [['stat', 'Statisztika', 'chart'], ['kapszula', 'Kapszulagardrób', 'outfits'], ['utazas', 'Bőröndpakoló', 'calendar'], ['mosas', 'Mosás és állapot', 'refresh']]
      .map(([k, l, i]) => ({ label: l, icon: i, cls: tab === k ? 'is-active' : '', on: () => this.setState({ okosTab: k }) }));
    const hely = (d) => helyDarab(d);
    const db = (h) => darabok.filter((d) => hely(d) === h).length;
    const szazalek = (n, ossz) => (ossz ? Math.round((n / ossz) * 100) : 0) + '%';

    // --- Statisztika ---
    const arasak = darabok.filter((d) => d.price);
    const ertek = arasak.reduce((a, d) => a + d.price, 0);
    const viselesek = arasak.reduce((a, d) => a + Math.max(1, d.wearCount || 0), 0);
    const kpi = [
      { label: 'Darab', value: String(darabok.length) },
      { label: 'A szekrény értéke', value: arasak.length ? ftForma(ertek) : '—' },
      { label: 'Átlag / viselés', value: arasak.length ? ftForma(ertek / viselesek) : '—' },
      { label: 'Szennyesben', value: String(darabok.filter((d) => d.inLaundry).length) },
    ];
    const katSzam = {};
    darabok.forEach((d) => { const k = d.cat || 'Kategória nélkül'; katSzam[k] = (katSzam[k] || 0) + 1; });
    const katMax = Math.max(1, ...Object.values(katSzam));
    const katSorok = Object.entries(katSzam).sort((a, b) => b[1] - a[1])
      .map(([nev, n]) => ({ nev, db: n + ' db', szel: Math.round((n / katMax) * 100) + '%' }));
    const szinSzam = {};
    darabok.forEach((d) => { if (d.szin) szinSzam[d.szin] = (szinSzam[d.szin] || 0) + 1; });
    const szinOssz = Object.values(szinSzam).reduce((a, b) => a + b, 0);
    const szinSav = Object.entries(szinSzam).sort((a, b) => b[1] - a[1])
      .map(([nev, n]) => ({ nev, hex: SZIN_LISTA[nev] || '#888', szel: szazalek(n, szinOssz), db: n + ' db' }));
    const markaSzam = {};
    darabok.forEach((d) => {
      const m = d.marka || KAT_MARKAK.find((x) => katNormal(d.label).indexOf(katNormal(x) + ' ') === 0);
      if (m) markaSzam[m] = (markaSzam[m] || 0) + 1;
    });
    const markaMax = Math.max(1, ...Object.values(markaSzam));
    const markaSorok = Object.entries(markaSzam).sort((a, b) => b[1] - a[1]).slice(0, 8)
      .map(([nev, n]) => ({ nev, db: n + ' db', szel: Math.round((n / markaMax) * 100) + '%' }));
    const legtobb = darabok.filter((d) => d.wearCount > 0).sort((a, b) => b.wearCount - a.wearCount).slice(0, 5)
      .map((d) => ({ label: d.label, sub: d.wearCount + ' viselés', photoUrl: d.photoUrl || '' }));
    const legjobbVetel = darabok.filter((d) => d.price && d.wearCount > 0)
      .sort((a, b) => a.price / a.wearCount - b.price / b.wearCount).slice(0, 3)
      .map((d) => ({ label: d.label, sub: ftForma(d.price / d.wearCount) + ' / viselés', photoUrl: d.photoUrl || '' }));
    // tanácsok a szekrény egyensúlyáról
    const tanacsok = [];
    const F = db('felso'), A = db('also'), C = db('cipo'), K = db('kabat');
    if (darabok.length) {
      if (!A) tanacsok.push('Még nincs alsód (nadrág, szoknya) a szekrényben, így nem tudok teljes outfitet összerakni.');
      else if (F >= A * 3) tanacsok.push(F + ' felsőhöz csak ' + A + ' alsó tartozik: egy új nadrág rengeteg új outfitet nyitna.');
      if (A && A >= F * 3) tanacsok.push(A + ' alsóhoz csak ' + F + ' felső tartozik: érdemes pár felsővel bővíteni.');
      if (!C) tanacsok.push('Még nincs cipő a szekrényedben: adj hozzá egyet, és teljesek lesznek az outfitek.');
      if (!K) tanacsok.push('Nincs kabátod a szekrényben: hűvös napokon nem tudok kabátot ajánlani.');
      const elenk = Object.keys(szinSzam).filter((x) => !SEMLEGES_SZIN.has(x)).reduce((a, x) => a + szinSzam[x], 0);
      if (szinOssz >= 6 && elenk / szinOssz > 0.6) tanacsok.push('A ruháid több mint fele élénk színű: néhány semleges darab (fekete, fehér, bézs) sokkal több kombinációt adna.');
      const nemViselt = darabok.filter((d) => !d.wearCount).length;
      if (valos && darabok.length >= 5 && nemViselt / darabok.length > 0.4) tanacsok.push(nemViselt + ' darabot még egyszer sem jelöltél viseltnek. Használd az „Ezt veszem fel” gombot, és pontosabb lesz a statisztika.');
      if (!tanacsok.length) tanacsok.push('Kiegyensúlyozott a szekrényed, minden kategóriából jut darab az outfitekhez.');
    }
    const szinNelkul = valos ? (s.items || []).filter((it) => !it.removedAt && it.photoUrl && !it.color).length : 0;

    // --- Kapszulagardrób ---
    const kapszula = s.kapszula || {};
    const kivalasztott = darabok.filter((d) => kapszula[d.key]);
    const kH = (h) => kivalasztott.filter((d) => hely(d) === h);
    const kombi = kH('felso').length * kH('also').length * kH('cipo').length * (kH('kabat').length + 1);
    const hianyK = ['felso', 'also', 'cipo'].filter((h) => !kH(h).length).map((h) => BABA_HELY_NEV[h].toLowerCase());
    const peldak = [];
    if (!hianyK.length) {
      const rnd = prng(42 + kivalasztott.length);
      const lattuk = {};
      for (let p = 0; p < 60 && peldak.length < 4; p++) {
        const v = (lista) => lista[Math.floor(rnd() * lista.length)];
        const csomag = [v(kH('felso')), v(kH('also')), v(kH('cipo'))];
        if (kH('kabat').length && rnd() < 0.5) csomag.unshift(v(kH('kabat')));
        const kulcs = csomag.map((d) => d.key).sort().join('|');
        if (lattuk[kulcs]) continue;
        lattuk[kulcs] = true;
        peldak.push({ baba: babaAdat(csomag), nevek: csomag.map((d) => d.label).join(' · '), harmonia: szinHarmonia(csomag) });
      }
    }
    const kapszulaAjanl = () => {
      // sokoldalú alapkapszula: semleges színek és a legtöbbet hordott darabok előnyben
      const pont = (d) => (d.wearCount || 0) * 3 + (d.szin && SEMLEGES_SZIN.has(d.szin) ? 10 : 0) + (d.inLaundry ? -100 : 0);
      const valaszt = {};
      [['felso', 4], ['also', 3], ['cipo', 2], ['kabat', 1]].forEach(([h, n]) => {
        darabok.filter((d) => hely(d) === h).sort((a, b) => pont(b) - pont(a)).slice(0, n).forEach((d) => { valaszt[d.key] = true; });
      });
      this.setState({ kapszula: valaszt });
    };

    // --- Bőröndpakoló ---
    const ut = s.utazas || {};
    const utEredmeny = ut.eredmeny;
    let napTerv = [], csomag = [];
    const tippek = [];
    if (utEredmeny) {
      const elerheto = darabok.filter((d) => !d.inLaundry && !d.needsRepair);
      const hasznalt = {}; // kulcs -> hány napon kerül elő
      napTerv = utEredmeny.napok.map((n, i) => {
        // a már becsomagolt felsőket "frissen viseltnek" vesszük, így változatos lesz;
        // az alsók és a cipők szívesebben ismétlődnek (kevesebb csomag)
        const lista = elerheto.map((d) => {
          if (!hasznalt[d.key]) return hely(d) === 'felso' ? d : { ...d, lastWornAt: Date.now() - 200 * 864e5 };
          return { ...d, lastWornAt: Date.now() - (hely(d) === 'felso' ? 0 : 400) * 864e5 };
        });
        const terv = napiOutfit(lista, { tempC: (n.max + n.min) / 2 + 2 }, 100 + i * 31);
        terv.darabok.forEach((d) => { hasznalt[d.key] = (hasznalt[d.key] || 0) + 1; });
        const datum = new Date(n.datum + 'T12:00:00');
        return {
          cim: datum.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric', weekday: 'short' }),
          ido: Math.round(n.max) + '° / ' + Math.round(n.min) + '° · ' + n.leiras + (n.eso !== null && n.eso !== undefined ? ' · ' + n.eso + '% eső' : ''),
          baba: babaAdat(terv.darabok),
          nevek: terv.darabok.map((d) => d.label).join(' · ') || 'Nincs elég ruha egy outfithez',
        };
      });
      const pipa = ut.pipa || {};
      csomag = BABA_HELYEK.map((h) => ({
        cim: BABA_HELY_NEV[h],
        darabok: elerheto.filter((d) => hasznalt[d.key] && hely(d) === h).map((d) => ({
          label: d.label, photoUrl: d.photoUrl || '', sub: hasznalt[d.key] + ' napra',
          cls: pipa[d.key] ? 'is-pipa' : '',
          on: () => this.setState({ utazas: { ...this.state.utazas, pipa: { ...pipa, [d.key]: !pipa[d.key] } } }),
        })),
      })).filter((g) => g.darabok.length);
      const n = utEredmeny.napok;
      if (n.some((x) => (x.eso || 0) >= 50 || [61, 63, 65, 80, 81, 82, 95, 96, 99].includes(x.kod))) tippek.push('Esős napok is lesznek: vigyél esernyőt vagy vízálló kabátot.');
      if (n.some((x) => x.max - x.min >= 10)) tippek.push('Nagy lesz a különbség a nappali és az éjszakai hőmérséklet között: öltözz rétegesen.');
      if (n.some((x) => x.kod <= 1 && x.max >= 20)) tippek.push('Napos idő várható: napszemüveget is tegyél be.');
      if (n.some((x) => x.min <= 3)) tippek.push('Fagyos éjszakák jönnek: sapka, sál és meleg kabát is kell.');
      if (utEredmeny.becsult) tippek.push('Az utazás 16 napnál messzebb van, ezért az időjárás csak becslés. Az indulás előtt nézd meg újra.');
    }
    const utKeres = async () => {
      const most = this.state.utazas || {};
      const hova = (most.hely || '').trim();
      if (!hova) { this.setState({ utazas: { ...most, hiba: 'Írd be, hová utazol.' } }); return; }
      this.setState({ utazas: { ...most, fut: true, hiba: '' } });
      try {
        const q = new URLSearchParams({ hely: hova, napok: String(most.napok || 3) });
        if (most.indulas) q.set('indulas', most.indulas);
        const j = await (await fetch('/api/utazas?' + q.toString())).json();
        if (!j.ok) {
          this.setState({ utazas: { ...this.state.utazas, fut: false, hiba: j.error === 'place_not_found'
            ? 'Nem találom ezt a helyet. Próbáld meg másképp írni (pl. „Barcelona”, „London”).'
            : 'Az előrejelzés most nem érhető el, próbáld újra később.' } });
          return;
        }
        this.setState({ utazas: { ...this.state.utazas, fut: false, eredmeny: j, pipa: {} } });
      } catch (e) {
        this.setState({ utazas: { ...this.state.utazas, fut: false, hiba: 'Az előrejelzés most nem érhető el (nincs internet?).' } });
      }
    };

    // --- Mosás és állapot ---
    const allapotSor = (d, mezo, gombFelirat) => ({
      label: d.label, photoUrl: d.photoUrl || '', sub: d.cat || '', gomb: gombFelirat,
      on: () => (valos ? this.realAllapot(d.key, { [mezo]: false }) : null),
    });
    const szennyes = darabok.filter((d) => d.inLaundry);
    const javitas = darabok.filter((d) => d.needsRepair);

    return {
      isOkos: s.view === 'okos',
      okosFulek: fulek,
      okosStat: tab === 'stat', okosKapszula: tab === 'kapszula', okosUtazas: tab === 'utazas', okosMosas: tab === 'mosas',
      okosKpi: kpi,
      okosKatSorok: katSorok,
      okosSzinVan: szinSav.length > 0,
      okosSzinSav: szinSav,
      okosSzinHiany: szinNelkul ? szinNelkul + ' fotós ruhádnak még nincs felismert színe.' : '',
      okosSzinGomb: s.szinFut ? 'Színek felismerése… ' + s.szinFut.kesz + ' / ' + s.szinFut.ossz : 'Színek felismerése a fotókból',
      okosSzinIndit: () => this.realSzinekFelismer(),
      okosMarkaVan: markaSorok.length > 0,
      okosMarkaSorok: markaSorok,
      okosLegtobbVan: legtobb.length > 0,
      okosLegtobb: legtobb,
      okosVetelVan: legjobbVetel.length > 0,
      okosVetel: legjobbVetel,
      okosTanacsok: tanacsok.map((t) => ({ szoveg: t })),
      // kapszula
      kapszulaDarabok: darabok.map((d) => ({
        label: d.label, photoUrl: d.photoUrl || '', hely: BABA_HELY_NEV[hely(d)], cls: kapszula[d.key] ? 'is-valasztva' : '',
        on: () => this.setState({ kapszula: { ...(this.state.kapszula || {}), [d.key]: !kapszula[d.key] } }),
      })),
      kapszulaDb: kivalasztott.length + ' darab kiválasztva',
      kapszulaSzam: String(kombi),
      kapszulaSzoveg: hianyK.length
        ? 'Válassz legalább egy ' + hianyK.join(', ') + ' darabot is, és kiszámolom, hány outfit jön ki belőlük.'
        : 'különböző outfit jön ki ebből a ' + kivalasztott.length + ' darabból' + (kH('kabat').length ? ' (kabáttal és anélkül)' : '') + '.',
      kapszulaPeldak: peldak,
      kapszulaVanPelda: peldak.length > 0,
      kapszulaAjanl,
      kapszulaTorol: () => this.setState({ kapszula: {} }),
      // utazás
      utHely: ut.hely || '',
      onUtHely: (e) => this.setState({ utazas: { ...(this.state.utazas || {}), hely: e.target.value } }),
      utIndulas: ut.indulas || '',
      onUtIndulas: (e) => this.setState({ utazas: { ...(this.state.utazas || {}), indulas: e.target.value } }),
      utNapok: [2, 3, 4, 5, 7, 10, 14].map((n) => ({
        label: n + ' nap', cls: (ut.napok || 3) === n ? 'is-active' : '',
        on: () => this.setState({ utazas: { ...(this.state.utazas || {}), napok: n } }),
      })),
      utKeres,
      utGomb: ut.fut ? 'Előrejelzés lekérése…' : 'Bőrönd összeállítása',
      utHiba: ut.hiba || '',
      utVan: !!utEredmeny,
      utCim: utEredmeny ? utEredmeny.hely + ' · ' + utEredmeny.napok.length + ' nap' : '',
      utNapTerv: napTerv,
      utCsomag: csomag,
      utTippek: tippek.map((t) => ({ szoveg: t })),
      utTippVan: tippek.length > 0,
      // mosás
      mosasSzennyes: szennyes.map((d) => allapotSor(d, 'inLaundry', 'Kimostam')),
      mosasJavitas: javitas.map((d) => allapotSor(d, 'needsRepair', 'Megjavítva')),
      mosasSzennyesUres: szennyes.length === 0,
      mosasJavitasUres: javitas.length === 0,
      mosasMindVan: szennyes.length > 1,
      mosasMind: async () => {
        if (!valos || !szennyes.length) return;
        await Promise.all(szennyes.map((d) => fetch('/api/items/' + d.key, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ inLaundry: false }) })));
        await this.reloadItems();
      },
    };
  }

  // "Ruhák hozzáadása" oldal: fül-váltó (fotó / katalógus) és a katalógus-keresés.
  // `base.katCats` a felhasználó kategórianevei (demóban és valódi módban is).
  // ==========================================================================
  // EBAY – termékfotók a katalógushoz és szabad keresés (csak bejelentkezve;
  // a kulcs a szerveren van, lásd server/ebay.js)
  // ==========================================================================
  ebayAllapotKer = async () => {
    if (this._ebayAllapotKert) return;
    this._ebayAllapotKert = true;
    try {
      const r = await fetch('/api/ebay/status');
      const j = await r.json();
      this.setState({ ebayStatus: j.ebay || null });
    } catch (e) { this.setState({ ebayStatus: { configured: false, ok: false, error: 'offline' } }); }
  };

  // a szerver által már letöltött összes katalóguskép (bejelentkezés nélkül is; legfeljebb percenként frissítve,
  // mert a szerver a háttérben folyamatosan tölti le a többit)
  ebayKepekBetolt() {
    if (this._ebayKepekIdo && Date.now() - this._ebayKepekIdo < 60 * 1000) return;
    this._ebayKepekIdo = Date.now();
    setTimeout(async () => {
      try {
        const r = await fetch('/api/ebay/katalogus-kepek');
        if (!r.ok) return;
        const j = await r.json();
        const uj = {};
        Object.keys(j.kepek || {}).forEach((k) => { uj[k] = '/api/ebay/kep?u=' + encodeURIComponent(j.alap + j.kepek[k]); });
        this.setState({ ebayKepek: { ...uj, ...(this.state.ebayKepek || {}) } });
      } catch (e) { /* nem fut a szerver: a márkakártyák látszanak */ }
    }, 0);
  }

  // a látható, még kép nélküli katalógustermékek képe (egyszerre kérve, megjegyezve)
  ebayKatalogusKer(termekek) {
    if (!this._ebayKert) this._ebayKert = new Set();
    const uj = termekek.filter((t) => !this._ebayKert.has(t.key));
    if (!uj.length) return;
    uj.forEach((t) => this._ebayKert.add(t.key));
    setTimeout(async () => {
      try {
        const r = await fetch('/api/ebay/katalogus', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ items: uj.map((t) => ({ key: t.key, q: (t.generikus ? 'női ' + t.nev : t.marka + ' ' + t.nev) })) }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) {
          // nem működik a kulcs: legközelebb újra próbáljuk (pl. aktiválás után)
          uj.forEach((t) => this._ebayKert.delete(t.key));
          this._ebayAllapotKert = false;
          return;
        }
        this.setState({ ebayKepek: { ...(this.state.ebayKepek || {}), ...(j.kepek || {}) } });
      } catch (e) { uj.forEach((t) => this._ebayKert.delete(t.key)); }
    }, 0);
  }

  // szabad keresés az eBay-en (gépelés után fél másodperccel)
  ebayKeresIdozit(q) {
    clearTimeout(this._ebayKeresIdo);
    const k = (q || '').trim();
    if (k.length < 3) { this.setState({ ebayTalalat: null }); return; }
    this._ebayKeresIdo = setTimeout(async () => {
      this.setState({ ebayTalalat: { q: k, items: (this.state.ebayTalalat || {}).items || [], betolt: true } });
      try {
        const r = await fetch('/api/ebay/kereses?q=' + encodeURIComponent(k));
        const j = await r.json().catch(() => ({}));
        if ((this.state.katQ || '').trim() !== k) return; // közben tovább gépelt
        this.setState({ ebayTalalat: { q: k, items: r.ok ? (j.items || []) : [], betolt: false, hiba: !r.ok } });
      } catch (e) { this.setState({ ebayTalalat: { q: k, items: [], betolt: false, hiba: true } }); }
    }, 500);
  }

  renderKatalogusVals(base) {
    const s = this.state;
    const kategoriak = base.katCats || [];
    const kat = s.addMode === 'kat';
    const q = katNormal(s.katQ).trim();
    const szavak = q ? q.split(/\s+/) : [];
    // férfi fióknál a női típusokat kihagyjuk (valódi fióknál a regisztrációkor választott profil, a demóban a Férfi/Nő választás)
    const ferfi = (s.realUser ? s.realUser.profile : (s.who || this.props.profile || 'Male')) !== 'Female';
    const kinalat = ferfi ? KATALOGUS.filter((t) => !t.generikus && !KAT_NOI_TIPUSOK.has(t.tipus)) : KATALOGUS;
    const markak = ferfi ? KAT_MARKAK.filter((m) => kinalat.some((t) => t.marka === m)) : KAT_MARKAK;
    const csoportok = KAT_CSOPORTOK.filter((k) => kinalat.some((t) => KAT_CSOPORT[t.tipus] === k));
    const talalatok = kinalat.filter((t) => {
      if (s.katBrand && t.marka !== s.katBrand) return false;
      if (s.katKind && KAT_CSOPORT[t.tipus] !== s.katKind) return false;
      if (!szavak.length) return true;
      const hol = katNormal(t.marka + ' ' + t.nev + ' ' + t.tipus + ' ' + (KAT_CSOPORT[t.tipus] || ''));
      return szavak.every((sz) => hol.indexOf(sz) > -1);
    });
    const limit = s.katLimit || 48;
    const added = s.katAdded || {};
    const lathato = talalatok.slice(0, limit);
    const kartya = (t) => ({
      // a márka nélküli női alapdaraboknál a kártyán a darab színe áll (az illik a kártya színéhez)
      brand: t.generikus ? t.nev.split(' ')[0] : t.marka, name: t.nev, kind: t.tipus, bg: t.bg, fg: t.fg,
      // a márka a címkén áll; alatta a típus (a női alapdaraboknál ez jelzi, hogy márka nélküli)
      brandSub: t.generikus ? 'Női alapdarab · ' + t.tipus : t.tipus,
      photoUrl: t.kep || '',
      credit: t.credit || '',
      thumbCls: t.kep ? 'has-photo' : '',
      cls: bennVan(t) ? 'is-added' : '',
      icon: bennVan(t) ? 'check' : 'plus',
      addLabel: bennVan(t) ? 'Hozzáadva' : 'Hozzáadás',
      add: () => this.katValt(t, kategoriak),
    });
    // csak azokat jelöljük "hozzáadva"-nak, amik még tényleg a listában vannak (mentés/elvetés után már nem)
    const bennVan = (t) => added[t.key] && s.drops.includes(added[t.key]);

    // --- eBay: fotók a látható termékekhez és szabad keresés (csak valódi fiókkal) ---
    const ebayVan = kat && !!s.realUser;
    // a termékfotók az eBay-ről jönnek: a szerver által már letöltöttek mindenkinek, a hiányzókat
    // bejelentkezve azonnal lekérjük (a többit a szerver a háttérben tölti le)
    const ebayKepek = s.ebayKepek || {};
    if (kat) this.ebayKepekBetolt();
    const est = s.ebayStatus;
    if (ebayVan && !est) setTimeout(() => this.ebayAllapotKer(), 0);
    if (ebayVan && est && est.ok) this.ebayKatalogusKer(lathato.filter((t) => !ebayKepek[t.key]));
    const et = s.ebayTalalat;
    const ebayKartya = (i) => {
      const cim = i.title.replace(/\s+/g, ' ').trim();
      const marka = KAT_MARKAK.find((m) => m !== 'eBay' && new RegExp('\\b' + m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(cim)) || 'eBay';
      const t = {
        key: 'ebay|' + i.id, marka, generikus: false, tipus: ebayTipus(cim),
        nev: (marka !== 'eBay' ? cim.replace(new RegExp(marka.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '').trim() : cim).slice(0, 70),
        // a felismert márka saját színei a címkén (ismeretlen márkánál az eBay színe)
        ...(() => { const b = (window.WARDRO_KATALOGUS || []).find((x) => x.marka === marka); return b ? { bg: b.bg, fg: b.fg } : { bg: '#0064D2', fg: '#FFFFFF' }; })(),
        kep: i.image,
        credit: 'Fotó: eBay' + (i.condition ? ' · ' + i.condition : ''),
      };
      return { ...kartya(t), brandSub: (i.price !== null ? i.price.toLocaleString('hu-HU') + ' ' + i.currency + ' · ' : '') + t.tipus };
    };
    const ebayVals = {
      ebayFigy: ebayVan && est && !est.ok
        ? (est.error === 'not_configured'
          ? 'Az eBay-képekhez add meg a kulcsokat a server/ebay.config.json fájlban.'
          : est.error === 'invalid_client'
            ? 'Az eBay elutasította a kulcsot (invalid_client). Aktiváld a Production kulcspárt a developer.ebay.com oldalon – addig a márkakártyák látszanak.'
            : 'Az eBay most nem érhető el – a márkakártyák látszanak.')
        : '',
      ebayBlokk: ebayVan && !!et,
      ebayCim: et ? (et.betolt ? 'Keresés az eBay-en…' : et.hiba ? 'Az eBay-keresés most nem sikerült.' : et.items.length ? 'Az eBay-en is: ' + et.items.length + ' találat erre: „' + et.q + '”' : 'Az eBay-en sincs találat erre: „' + et.q + '”') : '',
      ebayVanTalalat: !!(et && et.items.length),
      ebayTalalatok: et ? et.items.map(ebayKartya) : [],
    };
    const chip = (label, on, aktiv) => ({ label, on, cls: aktiv ? 'is-active' : '' });
    return {
      isKatalogus: kat,
      isFotoMod: !kat,
      showNoDrops: !kat && !!base.noDrops,
      addTabFotoCls: kat ? '' : 'is-active',
      addTabKatCls: kat ? 'is-active' : '',
      toAddFoto: () => this.setState({ addMode: 'foto' }),
      toAddKat: () => this.setState({ addMode: 'kat' }),
      katQ: s.katQ || '',
      onKatQ: (e) => { this.setState({ katQ: e.target.value, katLimit: 48 }); if (ebayVan) this.ebayKeresIdozit(e.target.value); },
      katHasQ: !!(s.katQ || '').trim(),
      clearKatQ: () => this.setState({ katQ: '', katLimit: 48, ebayTalalat: null }),
      ...ebayVals,
      katBrands: [chip('Összes márka', () => this.setState({ katBrand: '', katLimit: 48 }), !s.katBrand)]
        .concat(markak.map((m) => chip(m, () => this.setState({ katBrand: s.katBrand === m ? '' : m, katLimit: 48 }), s.katBrand === m))),
      katKinds: [chip('Minden típus', () => this.setState({ katKind: '', katLimit: 48 }), !s.katKind)]
        .concat(csoportok.map((k) => chip(k, () => this.setState({ katKind: s.katKind === k ? '' : k, katLimit: 48 }), s.katKind === k))),
      katLine: talalatok.length
        ? talalatok.length + ' termék'
        : 'Nincs találat. Próbálj rövidebb keresést, vagy válassz másik márkát.',
      katEmpty: talalatok.length === 0,
      katResults: lathato.map((t) => kartya({ ...t, kep: ebayKepek[t.key] || '', credit: ebayKepek[t.key] ? 'Fotó: eBay' : '' })),
      katHasSel: kat && s.drops.length > 0,
      katSelLine: s.drops.length + ' termék kiválasztva',
      katToSel: () => {
        const el = document.querySelector('.we-has-drops-grid1');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      katMore: talalatok.length > limit,
      katMoreLabel: 'Továbbiak (' + (talalatok.length - limit) + ')',
      katShowMore: () => this.setState({ katLimit: limit + 48 }),
    };
  }

  // Naptár nézet + a jobb oldali "kijelölt nap" panel értékei (valódi mód).
  // `list` a renderRealVals-ban összerakott outfit-lista.
  renderCalendarVals(list) {
    const s = this.state;
    const log = s.calendarLog || {};
    const today = dayKey(new Date());
    const [y, m] = s.calMonth.split('-').map(Number);
    const outfitById = (id) => list.find((o) => o.key === id) || null;

    // hétfővel kezdődő hetek; az előző/következő hónap napjai halványan kitöltik a rácsot
    const offset = (new Date(y, m - 1, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(y, m, 0).getDate();
    const weeks = Math.ceil((offset + daysInMonth) / 7);
    const calCells = [];
    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(y, m - 1, 1 - offset + i);
      const key = dayKey(d);
      const inMonth = d.getMonth() === m - 1;
      const o = outfitById(log[key]);
      const selected = key === s.calDay;
      calCells.push({
        num: String(d.getDate()),
        outfit: o ? o.name : '',
        hasOutfit: !!o,
        todayMark: key === today ? 'Ma' : '',
        bg: selected ? 'var(--c-57462f)' : (o ? 'var(--c-dcd8ce)' : 'var(--c-f6f1e7)'),
        fg: selected ? 'var(--c-f6f1e7)' : 'var(--c-57462f)',
        subFg: selected ? 'var(--c-e4d9c6)' : 'var(--c-6b5940)',
        border: key === today && !selected ? '1.5px solid var(--c-57462f)' : '1px solid rgba(var(--c-57462f-rgb),.12)',
        opacity: inMonth ? '1' : '.4',
        on: () => this.setState({ calDay: key, calMonth: key.slice(0, 7) }),
      });
    }
    const loggedThisMonth = Object.keys(log).filter((k) => k.slice(0, 7) === s.calMonth && outfitById(log[k])).length;

    const shiftMonth = (delta) => {
      const d = new Date(y, m - 1 + delta, 1);
      this.setState({ calMonth: dayKey(d).slice(0, 7) });
    };

    const sel = new Date(s.calDay + 'T00:00:00');
    const selOutfit = outfitById(log[s.calDay]);
    return {
      isCalendar: s.view === 'calendar',
      railCalendar: s.view === 'calendar',
      calTitle: y + '. ' + MONTH_NAMES[m - 1],
      calSub: loggedThisMonth ? loggedThisMonth + ' nap naplózva ebben a hónapban' : 'Ebben a hónapban még nincs naplózott outfit',
      calPrev: () => shiftMonth(-1),
      calNext: () => shiftMonth(1),
      calToday: () => this.setState({ calMonth: today.slice(0, 7), calDay: today }),
      calWeekdays: WEEKDAY_SHORT.map((label) => ({ label })),
      calCells,

      calDayTitle: MONTH_NAMES[sel.getMonth()] + ' ' + sel.getDate() + '.',
      calDaySub: sel.getFullYear() + ', ' + WEEKDAY_NAMES[sel.getDay()] + (s.calDay === today ? ' · ma' : ''),
      calDayHas: !!selOutfit,
      calDayEmpty: !selOutfit,
      calDayOutfit: selOutfit ? selOutfit.name : '',
      calDayPieces: selOutfit ? (selOutfit.pieces || selOutfit.occasion + ' · ' + selOutfit.season) : '',
      calClearDay: () => this.realClearDay(s.calDay),
      calPickTitle: selOutfit ? 'Csere másikra' : 'Mit viseltél aznap?',
      calNoOutfits: list.length === 0,
      calPickList: list.map((o) => {
        const on = selOutfit && selOutfit.key === o.key;
        return {
          name: o.name,
          sub: o.occasion + ' · ' + o.season,
          bg: on ? 'var(--c-dcd8ce)' : 'var(--c-ebe2d2)',
          border: on ? '1.5px solid var(--c-57462f)' : '1px solid transparent',
          mark: on ? '✓' : '',
          on: () => { if (!on) this.realSetDayOutfit(s.calDay, o.key); },
        };
      }),
      calNewOutfit: () => this.setState({ view: 'builder', sel: null, bName: '', bOcc: '', bSeason: '', bPicks: {}, bMore: [], bSlot: 'top', bLogDay: s.calDay }),
    };
  }

  // Telefonos párosítás + időjárás - ezek a mezők mindkét módban ugyanúgy
  // néznek ki, csak a `s.pairOpen`/`s.weather` állapottól függenek.
  renderSharedVals() {
    const s = this.state;
    const qrReady = !!s.qrSvgUrl && !s.pairError;
    const pairMinutesLeft = s.pairExpiresAt ? Math.max(0, Math.ceil((s.pairExpiresAt - Date.now()) / 60000)) : 0;
    const pairStatusLine = s.pairError
      ? s.pairError
      : (qrReady ? 'Várakozás a telefonodra · a kód ' + pairMinutesLeft + ' perc múlva lejár' : 'A kód elkészítése…');
    return {
      pairOpen: !!s.pairOpen,
      openPair: () => (s.pairToken && !s.pairError ? this.setState({ pairOpen: true }) : this.startPair()),
      closePair: () => this.setState({ pairOpen: false }),
      qrSvgUrl: s.qrSvgUrl,
      qrReady,
      qrFallbackDisplay: qrReady ? 'none' : 'flex',
      qrImgDisplay: qrReady ? 'block' : 'none',
      pairStatusLine,
      pairDotColor: s.pairError ? 'var(--c-b8433a)' : (qrReady ? 'var(--c-7a9a52)' : 'var(--c-b8a78a)'),
      pairPhoneUrl: s.pairPhoneUrl,
      pairUrlDisplay: s.pairPhoneUrl && !s.pairError ? 'block' : 'none',
      retryPair: () => this.startPair(),
      pairErrorDisplay: s.pairError ? 'block' : 'none',
      weatherTemp: s.weather ? Math.round(s.weather.tempC) + '°' : '—°',
      weatherLine: s.weather
        ? s.weather.description + ' · ' + Math.round(s.weather.eveningC) + '° este'
        : 'Időjárás betöltése…',
      phoneDot: s.paired ? 'var(--c-7a9a52)' : 'var(--c-b8a78a)',
      phoneLine: s.paired ? 'Telefon csatlakoztatva' : 'Nincs telefon csatlakoztatva',
      phoneSub: s.paired ? s.phoneCount + ' fotó érkezett ebben a munkamenetben' : 'Olvass be egy kódot, hogy fotókat küldhess a telefonodról',
      phoneBtnLabel: s.paired ? 'Lecsatlakozás' : 'Telefon csatlakoztatása',
      phoneBtnBg: s.paired ? 'var(--c-ebe2d2)' : 'var(--c-57462f)',
      phoneBtnFg: s.paired ? 'var(--c-57462f)' : 'var(--c-f6f1e7)',
      phoneAction: () => {
        if (s.paired) return this.disconnectPhone();
        if (s.pairToken && !s.pairError) return this.setState({ pairOpen: true });
        return this.startPair();
      },
      finishPair: () => this.setState({ pairOpen: false, view: 'add' }),
    };
  }

  // ==========================================================================
  // DEMÓ MÓD - a ?start=app / firstLaunch előnézet, kitalált mintaadatokkal.
  // Ez a korábbi, bejelentkezés nélküli demó-logika, változatlanul.
  // ==========================================================================
  renderDemoVals() {
    const s = this.state;
    // A "Male"/"Female" belső azonosító marad angol (ez köti össze az adatokat
    // és a design-eszköz beállításait); a felületen mindig a lefordított
    // "Férfi"/"Nő" felirat látszik (ld. whoLabel, genderTile, profileTabs).
    const who = s.who || this.props.profile || 'Male';
    const whoLabel = who === 'Female' ? 'Nő' : 'Férfi';
    const W = who === 'Female' ? FEMALE : MALE;
    const rawNames = Object.keys(W);
    // Átnevezett kategórianév (ha a felhasználó átírta), különben az eredeti
    const label = (n) => s.catNames[n] || n;
    const gone = s.hidden;
    const nameOf = (x) => s.names[x] || x;
    // Design-beállítások: sűrűség és a "nem viselt" jelzők ki/be
    const compact = (this.props.density || 'Comfortable') === 'Compact';
    const flags = this.props.showUnwornFlags === undefined ? true : this.props.showUnwornFlags;

    // --- Belépési mód; "fresh" = első indítás, még üres szekrény ---
    const authMode = s.auth || this.props.start || 'login';
    const fresh = s.auth ? !!s.fresh : authMode === 'firstLaunch';
    // --- Ruhák és kategóriák összeállítása ---
    // rawAll: alap + saját kategóriák; allItems: minden látható ruha
    // (áthelyezésekkel, az elrejtett / végleg törölt nélkül); inCat(n): egy kategória ruhái
    const rawAll = rawNames.concat(s.addedCats || []);
    const own = (s.added || []).map((x) => ({ label: x.label, base: x.cat, cat: s.moved[x.label] || x.cat, note: '' }));
    const allItems = (fresh ? [] : rawNames).flatMap((n) => W[n].items.map((it, i) => ({
      label: it, base: n, cat: s.moved[it] || n, note: W[n].notes[i] || '',
    }))).concat(own).filter((x) => !gone.includes(x.label) && !(s.purged || []).includes(x.label));
    const inCat = (n) => allItems.filter((x) => x.cat === n);
    const total = allItems.length;

    // Régen nem viselt ruhák (legrégebben nem viselt elöl)
    const idleAll = allItems
      .filter((x) => x.note && !s.worn[x.label])
      .sort((a, b) => this.monthsOf(b.note) - this.monthsOf(a.note));

    // --- Szekrény lista: keresés és szűrők ("Rég nem viselt" / "Nemrég viselt") ---
    const query = s.q.trim().toLowerCase();
    let pieces = (s.cat === 'All' ? allItems : inCat(s.cat)).map((x) => {
      const isWorn = !!s.worn[x.label];
      return {
        label: nameOf(x.label), cat: x.cat, note: x.note, key: x.label,
        sub: isWorn ? 'Ma viselve' : (flags && x.note ? x.note : label(x.cat)),
        noteFg: isWorn ? 'var(--c-6b5940)' : (flags && x.note ? 'var(--c-8a5a22)' : 'var(--c-6b5940)'),
        border: s.sel && s.sel.label === x.label ? '2px solid var(--c-57462f)' : '2px solid transparent',
        on: this.select(x.label, x.cat, x.note),
        cls: s.sel && s.sel.label === x.label ? 'is-sel' : '',
        subCls: !isWorn && flags && x.note ? 'is-regi' : '',
        marka: '', markaVan: false, markaBg: '', markaFg: '',
        // a demó darabjainak nincs valódi fotója, ott a csíkozott helyőrző marad
        photoUrl: '', imgDisplay: 'none', placeholderDisplay: 'block',
      };
    });
    if (s.filter === 'Rég nem viselt') pieces = pieces.filter((p) => p.note && !s.worn[p.key]);
    if (s.filter === 'Nemrég viselt') pieces = pieces.filter((p) => s.worn[p.key]);
    if (query) pieces = pieces.filter((p) => p.label.toLowerCase().indexOf(query) > -1);

    // --- Outfitek: saját + előre elkészített, a törölt nélkül; cur = a kiválasztott ---
    // A saját outfitek nemenként külön listában élnek, hogy profilváltáskor
    // a másik nem outfitjei ne keveredjenek ide (és visszaváltáskor visszajöjjenek).
    const made = s.madeByGender[who] || [];
    const list = [...made, ...(fresh ? [] : OUTFITS[who])].filter((o) => !s.deleted.includes(o.name));
    const cur = list[Math.min(s.oi, list.length - 1)] || OUTFITS[who][0];
    // "Mára ajánlott": ami illik a mostani időjáráshoz, azt előrébb tesszük
    let weatherSeason = null;
    if (s.weather) weatherSeason = s.weather.season;
    function seasonMatchScore(o) {
      if (!weatherSeason) return 0;
      if (o.season === weatherSeason) return 0;
      if (o.season === 'Bármilyen évszak') return 1;
      return 2;
    }
    const suggestionPicks = list
      .map((o, i) => ({ o, i }))
      .sort((a, b) => seasonMatchScore(a.o) - seasonMatchScore(b.o))
      .slice(0, 3);
    // Kijelölt ruha adatai a jobb oldali panelhez
    const selKey = s.sel ? s.sel.label : '';
    const selIsWorn = !!s.worn[selKey];
    const selNote = s.sel ? s.sel.note : '';
    const baseWears = selNote ? 3 : 14;

    // --- Outfit-összeállító helyek: felső, alsó, cipő, extra (+ tetszőleges további extrák) ---
    const bSlots = [
      { key: 'top', role: 'Felső', cat: rawNames[0], empty: 'Válassz felsőt' },
      { key: 'bottom', role: 'Alsó', cat: who === 'Female' ? 'Nadrágok és szoknyák' : 'Nadrágok', empty: 'Válassz alsót' },
      { key: 'shoes', role: 'Cipő', cat: 'Cipők', empty: 'Válassz cipőt' },
      { key: 'extra', role: 'Extra', cat: 'Kiegészítők', empty: 'Opcionális' },
    ].concat((s.bMore || []).map((k, i) => ({ key: k, role: 'Extra ' + (i + 2), cat: '*', empty: 'Válassz bármilyen darabot', removable: true })));
    const slotItems = (sl) => slotSzur(sl.key, allItems).darabok;
    const slot = bSlots.find((x) => x.key === s.bSlot);
    const bReady = s.bPicks.top && s.bPicks.bottom && s.bPicks.shoes;

    // Segédfüggvények a sablon elemeihez: oldalsáv-gomb (nav), kategória-sor (catRow), szűrő-chip (chipOf)
    // A kinézetet (aktív állapot, ikon) a CSS adja: `cls` és `icon` osztálynevek.
    const nav = (text, view) => ({
      label: text, icon: view,
      cls: s.view === view ? 'is-active' : '',
      on: () => this.setState(view === 'wardrobe'
        ? { view, cat: 'All', filter: 'Összes', q: '', editOpen: false }
        : { view, editOpen: false, sel: null }),
    });
    const catRow = (text, key, count) => ({
      label: text, count: String(count),
      cls: s.cat === key && s.view === 'wardrobe' ? 'is-active' : '',
      on: () => this.setState({ view: 'wardrobe', cat: key, filter: 'Összes', editOpen: false }),
    });
    const chipOf = (text, key, active) => ({
      label: text,
      bg: active ? 'var(--c-57462f)' : 'var(--c-f6f1e7)',
      fg: active ? 'var(--c-f6f1e7)' : 'var(--c-6b5940)',
      on: () => this.setState({ [key]: text }),
    });
    // Feltöltött fotók: hány van már kategóriába sorolva
    const assigned = s.drops.filter((f) => s.dropCats[f]).length;
    const dropsReady = s.drops.length > 0 && assigned === s.drops.length;

    const idleBase = rawNames.flatMap((n) => W[n].items.filter((it, i) => W[n].notes[i]));
    const dealt = idleBase.filter((x) => s.worn[x] || gone.includes(x) || (s.purged || []).includes(x)).length;
    const assignedQ = s.drops.filter((f) => s.dropCats[f]).length;
    // Egyszerű e-mail ellenőrzés
    const validEmail = (v) => /.+@.+\..+/.test(v.trim());
    // Nem választó csempe a regisztrációnál. A `g` a belső azonosító (Male/Female,
    // ez megy a state-be és ez választja ki a MALE/FEMALE adatkészletet),
    // a `displayLabel` a ténylegesen megjelenő magyar felirat.
    const genderTile = (g, displayLabel, hint) => {
      const on = s.suGender === g;
      return {
        label: displayLabel, hint,
        bg: on ? 'var(--c-57462f)' : 'var(--c-f6f1e7)',
        border: on ? '1.5px solid var(--c-57462f)' : '1px solid rgba(var(--c-57462f-rgb),.18)',
        fg: on ? 'var(--c-f6f1e7)' : 'var(--c-57462f)',
        sub: on ? 'var(--c-e4d9c6)' : 'var(--c-6b5940)',
        on: () => this.setState({ suGender: g, suErr: '' }),
      };
    };

    return {
      // Bejelentkezés / regisztráció
      isAuth: authMode === 'login' || authMode === 'signup' || authMode === 'verify',
      isLogin: authMode === 'login',
      isSignup: authMode === 'signup',
      isVerify: authMode === 'verify',
      verifyEmail: s.verifyEmail || '',
      verifyMsg: s.verifyMsg || '',
      verifyVanMsg: !!s.verifyMsg,
      verifyMsgCls: s.verifyHiba ? 'is-hiba' : '',
      verifyResendLabel: s.verifyKuld ? 'Küldés…' : 'Megerősítő e-mail újraküldése',
      doResend: () => this.realResend(),
      verifyToLogin: () => this.setState({ auth: 'login', lEmail: s.verifyEmail || s.lEmail, verifyMsg: '', lErr: '' }),
      toSignup: () => this.setState({ auth: 'signup', lErr: '', resetSent: '' }),
      toLogin: () => this.setState({ auth: 'login', suErr: '' }),
      lEmail: s.lEmail,
      lPw: s.lPw,
      onLEmail: (e) => this.setState({ lEmail: e.target.value, lErr: '' }),
      onLPw: (e) => this.setState({ lPw: e.target.value, lErr: '' }),
      lPwType: s.lShow ? 'text' : 'password',
      lShowLabel: s.lShow ? 'Elrejtés' : 'Mutat',
      toggleLShow: () => this.setState({ lShow: !s.lShow }),
      lErr: s.lErr,
      resetLine: s.resetSent ? 'Visszaállító linket küldtünk ide: ' + s.resetSent + '. Nézd meg a postaládád.' : '',
      forgot: () => {
        if (!validEmail(s.lEmail)) return this.setState({ lErr: 'Először add meg az e-mail címed, majd koppints az Elfelejtett jelszóra.', resetSent: '' });
        this.setState({ resetSent: s.lEmail.trim(), lErr: '' });
      },
      doLogin: () => {
        if (!validEmail(s.lEmail)) return this.setState({ lErr: 'Add meg a regisztrációkor használt e-mail címet.', resetSent: '' });
        if (!s.lPw) return this.setState({ lErr: 'Add meg a jelszavad.', resetSent: '' });
        this.setState({ ...BASE, auth: 'app', view: 'start', fresh: true, sEmail: s.lEmail.trim(), lPw: '', lErr: '', resetSent: '' });
      },
      appleLogin: () => this.setState({ ...BASE, auth: 'app', view: 'start', fresh: true, lErr: '', resetSent: '' }),
      suName: s.suName,
      suEmail: s.suEmail,
      suPw: s.suPw,
      onSuName: (e) => this.setState({ suName: e.target.value, suErr: '' }),
      onSuEmail: (e) => this.setState({ suEmail: e.target.value, suErr: '' }),
      onSuPw: (e) => this.setState({ suPw: e.target.value, suErr: '' }),
      suPwType: s.suShow ? 'text' : 'password',
      suShowLabel: s.suShow ? 'Elrejtés' : 'Mutat',
      toggleSuShow: () => this.setState({ suShow: !s.suShow }),
      genders: [genderTile('Male', 'Férfi', 'Férfi szabás és méretek'), genderTile('Female', 'Nő', 'Női szabás és méretek')],
      suErr: s.suErr,
      suCtaLabel: s.suGender ? 'Fiók létrehozása' : 'Válassz egyet a folytatáshoz',
      suCtaBg: s.suGender ? 'var(--c-57462f)' : 'var(--c-d8d1c1)',
      suCtaFg: s.suGender ? 'var(--c-f6f1e7)' : 'var(--c-6b5940)',
      doSignup: () => {
        if (!s.suName.trim()) return this.setState({ suErr: 'Add meg a neved.' });
        if (!validEmail(s.suEmail)) return this.setState({ suErr: "Ez az e-mail cím nem tűnik helyesnek." });
        if (s.suPw.length < 8) return this.setState({ suErr: 'A jelszónak legalább 8 karakteresnek kell lennie.' });
        if (!s.suGender) return this.setState({ suErr: 'Válaszd a Férfit vagy a Nőt a folytatáshoz.' });
        this.setState({
          ...BASE, view: 'start', auth: 'app', fresh: true,
          who: s.suGender, sName: s.suName.trim(), sEmail: s.suEmail.trim(),
          suPw: '', suErr: '',
        });
      },
      logOut: () => this.setState({ auth: 'login', lEmail: s.sEmail, lPw: '', lErr: '', resetSent: '', sel: null, editOpen: false }),

      // Nézetek és navigáció (melyik képernyő látszik)
      isWardrobe: s.view === 'wardrobe',
      isOutfits: s.view === 'outfits',
      isOutfitsFilled: s.view === 'outfits' && list.length > 0,
      outfitsEmpty: s.view === 'outfits' && list.length === 0,
      outfitsEmptyLine: total ? 'Válassz egy felsőt, egy alsót és cipőt a hozzáadott ruháid közül, majd nevezd el.' : 'Először adj hozzá pár darabot a szekrényedhez. Utána itt tudod összeállítani az első outfitedet.',
      outfitsEmptyCta: total ? 'Első outfit összeállítása' : 'Ruhák hozzáadása',
      outfitsEmptyGo: total
        ? () => this.setState({ view: 'builder', sel: null, bName: '', bOcc: '', bSeason: '', bPicks: {}, bMore: [], bSlot: 'top', bLogDay: '' })
        : () => this.setState({ view: 'add', sel: null, editOpen: false }),
      homeEmpty: total === 0,
      homeFilled: total > 0,
      firstName: (s.sName && s.sName !== 'A neved' ? s.sName : '').split(' ')[0] || 'Barátom',
      firstSteps: [
        { n: '01', title: 'Fotózd le', line: 'Egy darab, egy fotó, kiterítve vagy vállfán.' },
        { n: '02', title: 'Rendszerezd', line: 'Tedd minden fotót egy kategóriába, például ' + label(rawNames[0]) + ' vagy Cipők közé.' },
        { n: '03', title: 'Állíts össze', line: 'Rakj össze outfiteket a ruháidból, és jegyezd fel, mit viseltél.' },
      ],
      noSuggestions: list.length === 0,
      isBuilder: s.view === 'builder',
      isUntouched: s.view === 'untouched',
      isSettings: s.view === 'settings',
      isAdd: s.view === 'add',
      navItems: [nav('Kezdőlap', 'home'), nav('Szekrény', 'wardrobe'), nav('Outfitek', 'outfits'), nav('Okos szekrény', 'okos'), nav('Kihasználatlan', 'untouched'), nav('Eltávolított', 'removed'), nav('Beállítások', 'settings')],
      // Eltávolított ruhák (30 napig várnak a végleges törlésig)
      isRemoved: s.view === 'removed',
      toRemoved: () => this.setState({ view: 'removed', sel: null, editOpen: false }),
      removedLine: gone.length
        ? gone.length + ' darab vár · 30 nap után törlődik'
        : 'Még nincs eltávolított darab',
      removedEmpty: gone.length === 0,
      removedList: gone.map((label2) => ({
        label: nameOf(label2),
        hint: 'Ma távolítva el · 30 nap van hátra',
        restore: () => this.setState({ hidden: gone.filter((x) => x !== label2) }),
      })),
      purgeAll: () => this.setState({ hidden: [] }),
      // Kezdőlap: javaslatok és kategória-csempék
      isHome: s.view === 'home',
      homeTotal: total + ' darab, ' + rawAll.length + ' kategóriában',
      viewAll: () => this.setState({ view: 'wardrobe', cat: 'All', filter: 'Összes', q: '', sel: null, editOpen: false }),
      suggestions: suggestionPicks.map(({ o, i }) => ({
        name: o.name,
        sub: o.pieces,
        on: () => this.setState({ view: 'outfits', oi: i, sel: null, editOpen: false }),
      })),
      homeTiles: rawAll.map((n, i) => {
        const items = inCat(n);
        const idle = items.filter((x) => x.note && !s.worn[x.label]).length;
        return {
          name: label(n),
          count: items.length + ' darab',
          idle: fresh ? (items.length ? 'most hozzáadva' : 'üres') : (idle ? idle + ' kihasználatlan' : 'mind viselve nemrég'),
          bg: ['var(--c-cfcbc1)', 'var(--c-c6c2b8)', 'var(--c-d2cec4)', 'var(--c-cbc7bd)', 'var(--c-d6d2c8)'][i % 5],
          span: i === 0 ? 'span 2' : 'span 1',
          on: () => this.setState({ view: 'wardrobe', cat: n, filter: 'Összes', q: '', sel: null, editOpen: false }),
        };
      }),
      // Oldalsáv: kategóriák listája darabszámmal
      catNav: rawAll.map((n) => catRow(label(n), n, inCat(n).length)),
      katCats: rawAll, // a katalógusból hozzáadott termékek kategória-felismeréséhez
      // "Mit vegyek fel ma?" és próbababák - a demó kitalált ruháiból (fotó nélkül)
      ...(() => {
        const most = Date.now();
        const demoDarab = (x) => ({
          key: x.label, label: nameOf(x.label), cat: x.cat, photoUrl: '', wornToday: !!s.worn[x.label],
          inLaundry: !!(s.demoSzennyes || {})[x.label],
          lastWornAt: x.note ? most - this.monthsOf(x.note) * 30 * 864e5 : most - 4 * 864e5,
        });
        const cimkek = (cur.items || [cur.top, cur.bottom, cur.shoes, cur.extra]).filter((x) => x && x !== 'nincs extra');
        const keres = (l) => allItems.find((x) => x.label === l || nameOf(x.label) === l);
        return {
          napiDarabok: allItems.map(demoDarab),
          outfitDarabok: cimkek.map((l) => keres(l) || { label: l, cat: '', note: '' }).map(demoDarab),
          builderDarabok: Object.values(s.bPicks || {}).map(keres).filter(Boolean).map(demoDarab),
        };
      })(),
      accountName: s.sName || 'A szekrényed',
      accountInitial: ((s.sName || 'W').trim()[0] || 'W').toUpperCase(),
      profileLine: whoLabel + ' · ' + total + ' darab',
      toHome: () => this.setState({ view: 'home', cat: 'All', filter: 'Összes', q: '', sel: null, editOpen: false }),
      toAdd: () => this.setState({ view: 'add', sel: null, editOpen: false }),
      toSettings: () => this.setState({ view: 'settings', sel: null, editOpen: false }),
      toUntouched: () => this.setState({ view: 'untouched', sel: null, editOpen: false }),

      // Szekrény: fejléc, keresés, szűrők, ruha-rács
      headTitle: s.cat === 'All' ? 'Mindegyik' : label(s.cat),
      headCount: pieces.length === total ? total + ' darab' : pieces.length + ' / ' + total + ' darab látható',
      q: s.q,
      hasQuery: s.q.length > 0,
      onQuery: (e) => this.setState({ q: e.target.value }),
      clearQuery: () => this.setState({ q: '' }),
      filters: [
        chipOf('Összes', 'filter', s.filter === 'Összes'),
        chipOf('Rég nem viselt', 'filter', s.filter === 'Rég nem viselt'),
        chipOf('Nemrég viselt', 'filter', s.filter === 'Nemrég viselt'),
      ],
      pieces,
      noPieces: pieces.length === 0,
      emptyLine: query
        ? 'Nincs találat erre: "' + s.q.trim() + '".'
        : (s.filter === 'Nemrég viselt' ? 'Még nincs naplózva viselés.' : 'Minden darabot nemrég viseltél.'),
      cardMin: compact ? '132px' : '176px',
      cardH: compact ? '160px' : '212px',

      // Outfitek: kiválasztott outfit, kedvencek, viselés
      outfit: cur,
      outfitTiles: (cur.items || [cur.top, cur.bottom, cur.shoes, cur.extra]).filter((x) => x && x !== 'nincs extra').map((x, i) => ({ label: x, bg: ['var(--c-dcd8ce)', 'var(--c-d4d0c6)', 'var(--c-d8d4ca)', 'var(--c-cdc9bf)'][i % 4] })),
      outfitCols: (cur.items || []).length > 4 ? 3 : 2,
      outfitMeta: cur.occasion + ' · ' + cur.season + ' · ' + cur.worn,
      outfitCount: list.length + ' mentve',
      favMark: s.favs.includes(cur.name) ? '★' : '☆',
      favLabel: s.favs.includes(cur.name) ? 'Kedvenc' : 'Hozzáadás a kedvencekhez',
      favBg: s.favs.includes(cur.name) ? 'var(--c-dcd8ce)' : 'var(--c-f6f1e7)',
      toggleFav: () => {
        const on = s.favs.includes(cur.name);
        this.setState({ favs: on ? s.favs.filter((k) => k !== cur.name) : [...s.favs, cur.name] });
      },
      deleteOutfit: () => this.setState({
        deleted: [...s.deleted, cur.name],
        madeByGender: { ...s.madeByGender, [who]: made.filter((o) => o.name !== cur.name) },
        favs: s.favs.filter((k) => k !== cur.name),
        oi: 0,
      }),
      outfitWearLabel: s.worn[cur.name] ? 'Mára naplózva' : 'Viselem ma',
      outfitWearBg: s.worn[cur.name] ? 'var(--c-dcd8ce)' : 'var(--c-57462f)',
      outfitWearFg: s.worn[cur.name] ? 'var(--c-57462f)' : 'var(--c-f6f1e7)',
      wearOutfit: () => {
        this.setState({ worn: { ...s.worn, [cur.name]: true } });
        // az outfit darabjai is a szennyesbe kerülnek (a mosható darabok)
        const cimkek = (cur.items || [cur.top, cur.bottom, cur.shoes, cur.extra]).filter((x) => x && x !== 'nincs extra');
        this.demoSzennyesbe(cimkek.map((l) => (allItems.find((x) => x.label === l || nameOf(x.label) === l) || {}).label).filter(Boolean));
      },
      outfitList: list.map((o, n) => ({
        name: o.name, sub: o.occasion + ' · ' + o.season,
        bg: o.name === cur.name ? 'var(--c-dcd8ce)' : 'var(--c-ebe2d2)',
        border: o.name === cur.name ? '1.5px solid var(--c-57462f)' : '1px solid transparent',
        mark: s.favs.includes(o.name) ? '★' : '☆',
        markFg: s.favs.includes(o.name) ? 'var(--c-57462f)' : 'var(--c-8a7a62)',
        markBg: s.favs.includes(o.name) ? 'var(--c-f6f1e7)' : 'transparent',
        thumbs: [{}, {}, {}, {}], // a demóban nincs fotó, csak helyőrzők
        on: () => this.setState({ view: 'outfits', oi: n, sel: null }),
        star: () => {
          const on = s.favs.includes(o.name);
          this.setState({ favs: on ? s.favs.filter((k) => k !== o.name) : [...s.favs, o.name] });
        },
      })),

      // Outfit-összeállító
      toBuilder: () => this.setState({ view: 'builder', sel: null, bName: '', bOcc: '', bSeason: '', bPicks: {}, bMore: [], bSlot: 'top', bLogDay: '' }),
      cancelBuilder: () => this.setState({ view: s.bLogDay ? 'calendar' : 'outfits', bSlot: '', bLogDay: '' }),
      bName: s.bName,
      onBName: (e) => this.setState({ bName: e.target.value }),
      bNamePlaceholder: (s.bOcc || 'Új') + ' outfit',
      bSlots: bSlots.map((x) => ({
        role: x.role,
        label: s.bPicks[x.key] ? nameOf(s.bPicks[x.key]) : x.empty,
        bg: s.bPicks[x.key] ? 'var(--c-dcd8ce)' : 'var(--c-f6f1e7)',
        border: s.bSlot === x.key ? '2px solid var(--c-57462f)' : (s.bPicks[x.key] ? '2px solid rgba(var(--c-57462f-rgb),.35)' : '1.5px dashed rgba(var(--c-57462f-rgb),.35)'),
        on: () => this.setState({ bSlot: x.key, bLap: true }),
        removable: !!x.removable,
        remove: (e) => {
          e.stopPropagation();
          const picks = { ...s.bPicks }; delete picks[x.key];
          this.setState({ bMore: (s.bMore || []).filter((k) => k !== x.key), bPicks: picks, bSlot: s.bSlot === x.key ? '' : s.bSlot });
        },
      })),
      addSlot: () => {
        const k = 'more' + Date.now();
        this.setState({ bMore: [...(s.bMore || []), k], bSlot: k });
      },
      bOccasions: ['Munka', 'Hétvége', 'Program'].map((o) => chipOf(o, 'bOcc', s.bOcc === o)),
      bSeasons: ['Meleg', 'Enyhe', 'Hideg'].map((x) => chipOf(x, 'bSeason', s.bSeason === x)),
      bCtaLabel: bReady ? 'Outfit mentése' : 'Válassz felsőt, alsót és cipőt',
      bCtaBg: bReady ? 'var(--c-57462f)' : 'var(--c-d8d1c1)',
      bCtaFg: bReady ? 'var(--c-f6f1e7)' : 'var(--c-6b5940)',
      saveOutfit: () => {
        if (!bReady) return;
        const p = s.bPicks;
        const parts = bSlots.map((x) => p[x.key]).filter(Boolean).map(nameOf);
        this.setState({
          madeByGender: {
            ...s.madeByGender,
            [who]: [{
              name: s.bName.trim() || (s.bOcc || 'Új') + ' outfit',
              occasion: s.bOcc || 'Bármilyen alkalom',
              season: s.bSeason || 'Bármilyen évszak',
              top: nameOf(p.top), bottom: nameOf(p.bottom), shoes: nameOf(p.shoes), extra: p.extra ? nameOf(p.extra) : 'nincs extra',
              pieces: parts.join(' · '),
              items: parts,
              worn: 'új, még nem viselt',
            }, ...made],
          },
          view: 'outfits', oi: 0, bSlot: '', bPicks: {}, bMore: [], bName: '', bOcc: '', bSeason: '',
        });
      },
      // Jobb panel: ruhaválasztó az összeállítóhoz
      railPicker: s.view === 'builder',
      pickerIdle: !slot,
      pickerTitle: slot ? (SLOT_CIM[slot.key] && !slotSzur(slot.key, allItems).mind ? SLOT_CIM[slot.key] : 'Bármilyen darab') : 'Darabok',
      pickerCount: slot ? slotItems(slot).length + ' db' : '',
      pickerItems: slot
        ? slotItems(slot).map((x) => ({
            label: nameOf(x.label),
            border: s.bPicks[slot.key] === x.label ? '2px solid var(--c-57462f)' : '2px solid transparent',
            on: () => this.setState({ bPicks: { ...s.bPicks, [slot.key]: x.label }, bLap: false }),
          }))
        : [],

      // Kihasználatlan ruhák ("Untouched")
      idleLine: idleAll.length ? idleAll.length + ' darab, a legrégebbi elöl' : 'Nincs kihasználatlan darab',
      idleEmpty: idleAll.length === 0,
      idleItems: idleAll.map((x) => ({
        label: nameOf(x.label), cat: label(x.cat), note: x.note,
        open: this.select(x.label, x.cat, x.note),
        wear: () => { this.setState({ worn: { ...s.worn, [x.label]: true } }); this.demoSzennyesbe([x.label]); },
        remove: () => this.setState({ hidden: [...gone, x.label], sel: null, lastGone: x.label }),
      })),
      undoVisible: !!s.lastGone && gone.indexOf(s.lastGone) > -1,
      undoLine: nameOf(s.lastGone || '') + ' áthelyezve az Eltávolítottak közé',
      undoGone: () => this.setState({ hidden: gone.filter((x) => x !== s.lastGone), lastGone: '' }),
      dismissUndo: () => this.setState({ lastGone: '' }),

      // Beállítások: profil, kategóriák szerkesztése, emlékeztetők
      sName: s.sName,
      sEmail: s.sEmail,
      onSName: (e) => this.setState({ sName: e.target.value }),
      onSEmail: (e) => this.setState({ sEmail: e.target.value }),
      // A belső "who" state Male/Female marad, csak a felirat magyar (Férfi/Nő).
      profileTabs: [['Male', 'Férfi'], ['Female', 'Nő']].map(([p, disp]) => ({
        label: disp,
        bg: who === p ? 'var(--c-57462f)' : 'var(--c-ebe2d2)',
        fg: who === p ? 'var(--c-f6f1e7)' : 'var(--c-57462f)',
        on: () => this.setState({ who: p, cat: 'All', sel: null, oi: 0, favs: [], deleted: [], bPicks: {} }),
      })),
      // Kategóriák átnevezése / új kategória felvétele / törlése
      catEditRows: rawAll.map((n) => ({
        value: label(n),
        count: inCat(n).length + ' darab',
        onChange: (e) => this.setState({ catNames: { ...s.catNames, [n]: e.target.value } }),
        removable: (s.addedCats || []).indexOf(n) > -1,
        remove: () => this.setState({ addedCats: (s.addedCats || []).filter((x) => x !== n), cat: s.cat === n ? 'All' : s.cat }),
      })),
      newCat: s.newCat || '',
      onNewCat: (e) => this.setState({ newCat: e.target.value }),
      addCatLabel: (s.newCat || '').trim() ? 'Kategória hozzáadása' : 'Először nevezd el',
      addCatBg: (s.newCat || '').trim() ? 'var(--c-57462f)' : 'var(--c-d8d1c1)',
      addCatFg: (s.newCat || '').trim() ? 'var(--c-f6f1e7)' : 'var(--c-6b5940)',
      addCategory: () => {
        const v = (s.newCat || '').trim();
        if (!v || rawAll.indexOf(v) > -1) return;
        this.setState({ addedCats: [...(s.addedCats || []), v], newCat: '' });
      },
      // Emlékeztető-kapcsolók
      reminders: [
        { label: 'Heti áttekintés', hint: 'Vasárnap, 19:00', bg: s.rWeekly ? 'var(--c-57462f)' : 'var(--c-d8d1c1)', knob: s.rWeekly ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rWeekly: !s.rWeekly }) },
        { label: 'Naplózd, mit viseltél', hint: 'Naponta, 21:00', bg: s.rDaily ? 'var(--c-57462f)' : 'var(--c-d8d1c1)', knob: s.rDaily ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rDaily: !s.rDaily }) },
        { label: 'Kihasználatlan darabok', hint: 'Ha valami elér 6 hónapot', bg: s.rIdle ? 'var(--c-57462f)' : 'var(--c-d8d1c1)', knob: s.rIdle ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rIdle: !s.rIdle }) },
      ],
      resetAll: () => this.setState({ ...BASE }),

      // Ruha hozzáadása: fotók feldolgozása és kategóriába sorolás
      addLine: s.drops.length ? assigned + ' / ' + s.drops.length + ' besorolva' : 'A hátteret automatikusan eltávolítjuk, utána te sorolod be',
      noDrops: s.drops.length === 0,
      hasDrops: s.drops.length > 0,
      // a demóban nincs valódi feltöltés, csak mintafotókat tesz be
      pickFiles: () => this.setState({ drops: DROP_FILES.slice(), dropCats: {} }),
      drops: s.drops.map((file) => ({
        file,
        drop: () => this.setState({ drops: s.drops.filter((f) => f !== file) }),
        // Ha ez a telefonról érkezett valódi fotó, itt a bélyegkép URL-je; a sablon
        // ilyenkor a nyers kép-URL-t mutatja a helyőrző csíkozott minta helyett.
        photoUrl: s.phonePhotos[file] || '',
        imgDisplay: s.phonePhotos[file] ? 'block' : 'none',
        placeholderDisplay: s.phonePhotos[file] ? 'none' : 'block',
        name: (s.dropNames || {})[file] || '',
        onName: (e) => this.setState({ dropNames: { ...(s.dropNames || {}), [file]: e.target.value } }),
        options: rawAll.map((n) => ({
          label: label(n),
          bg: s.dropCats[file] === n ? 'var(--c-57462f)' : 'var(--c-ebe2d2)',
          fg: s.dropCats[file] === n ? 'var(--c-f6f1e7)' : 'var(--c-57462f)',
          on: () => this.setState({ dropCats: { ...s.dropCats, [file]: n } }),
        })),
      })),
      saveLabel: dropsReady ? 'Mentés (' + s.drops.length + ' darab)' : 'Adj kategóriát minden fotóhoz',
      saveBg: dropsReady ? 'var(--c-57462f)' : 'var(--c-d8d1c1)',
      saveFg: dropsReady ? 'var(--c-f6f1e7)' : 'var(--c-6b5940)',
      saveDrops: () => {
        if (!dropsReady) return;
        const base = (s.added || []).length;
        const added = s.drops.map((f, i) => ({ label: ((s.dropNames || {})[f] || '').trim() || 'darab ' + (base + i + 1), cat: s.dropCats[f] }));
        this.setState({ dropNames: {}, view: 'home', added: [...(s.added || []), ...added], savedCount: s.savedCount + s.drops.length, drops: [], dropCats: {} });
      },
      clearDrops: () => this.setState({ drops: [], dropCats: {}, dropNames: {} }),

      // Jobb oldali panel: melyik tartalom látszik (ruha, szerkesztés, outfitek, stb.)
      railItem: !!s.sel && s.view === 'wardrobe' && !s.editOpen,
      railEdit: !!s.sel && s.view === 'wardrobe' && s.editOpen,
      railOutfits: s.view === 'outfits',
      railSummary: s.view === 'wardrobe' && !s.sel,
      railHome: s.view === 'home',
      railUntouched: s.view === 'untouched',
      railAdd: s.view === 'add',
      railRemoved: s.view === 'removed',
      railDisplay: s.view === 'settings' || s.view === 'okos' ? 'none' : 'flex',
      // az oszlopszélességeket a CSS adja (képernyőmérettől függően), itt csak azt jelezzük, ha nincs jobb panel
      gridMod: s.view === 'settings' || s.view === 'okos' ? 'is-norail' : '',
      dealtLine: dealt + ' / ' + idleBase.length + ' elintézve',
      dealtPct: (idleBase.length ? Math.round((dealt / idleBase.length) * 100) : 100) + '%',
      hasOldest: idleAll.length > 0,
      oldestLabel: idleAll[0] ? nameOf(idleAll[0].label) : '',
      oldestSub: idleAll[0] ? label(idleAll[0].cat) + ' · ' + idleAll[0].note : '',
      openOldest: () => { if (idleAll[0]) this.select(idleAll[0].label, idleAll[0].cat, idleAll[0].note)(); },
      removedCount: gone.length === 1 ? '1 darab vár' : gone.length + ' darab vár',
      removedHas: gone.length > 0,
      deleteAllNow: () => this.setState({ purged: [...(s.purged || []), ...gone], hidden: [], lastGone: '' }),
      // Kijelölt ruhadarab adatai (név, kategória, viselési statisztika)
      selLabel: nameOf(selKey),
      selPhotoUrl: '', selImgDisplay: 'none', selPlaceholderDisplay: 'block',
      selCat: label(s.sel ? (s.moved[selKey] || s.sel.cat) : ''),
      selWorn: selIsWorn
        ? 'Ma viselted · összesen ' + (baseWears + 1) + '-szer'
        : (selNote
            // selNote pl. "7 hónapja nem viselted" -> "Utoljára 7 hónapja viselted"
            ? 'Utoljára ' + selNote.replace(/ nem viselted$/, '') + ' viselted · összesen ' + baseWears + '-szer'
            : 'Utoljára 3 hete viselted · összesen ' + baseWears + '-szer'),
      selWearLabel: selIsWorn ? 'Mára naplózva' : 'Viselem ma',
      selWearBg: selIsWorn ? 'var(--c-dcd8ce)' : 'var(--c-57462f)',
      selWearFg: selIsWorn ? 'var(--c-57462f)' : 'var(--c-f6f1e7)',
      wearSel: () => { if (selKey) { this.setState({ worn: { ...s.worn, [selKey]: true } }); this.demoSzennyesbe([selKey]); } },
      selTags: (s.tags[selKey] || DEFAULT_TAGS).map((t) => ({ label: t })),
      selOutfits: list.slice(0, 2).map((o, n) => ({
        name: o.name, sub: o.occasion + ' · ' + o.season,
        on: () => this.setState({ view: 'outfits', oi: n, sel: null }),
      })),
      removeSel: () => { if (selKey) this.setState({ hidden: [...gone, selKey], sel: null, editOpen: false, lastGone: selKey }); },
      clearSel: () => this.setState({ sel: null, editOpen: false }),

      // Kijelölt ruha szerkesztése (név, kategória, címkék)
      openEdit: () => this.setState({
        editOpen: true,
        editName: nameOf(selKey),
        editTags: s.tags[selKey] || DEFAULT_TAGS,
        editCat: s.moved[selKey] || (s.sel ? s.sel.cat : ''),
      }),
      cancelEdit: () => this.setState({ editOpen: false }),
      editName: s.editName,
      onEditName: (e) => this.setState({ editName: e.target.value }),
      editCats: rawAll.map((n) => ({
        label: label(n),
        bg: s.editCat === n ? 'var(--c-57462f)' : 'var(--c-ebe2d2)',
        fg: s.editCat === n ? 'var(--c-f6f1e7)' : 'var(--c-57462f)',
        on: () => this.setState({ editCat: n }),
      })),
      editTagOptions: TAG_OPTIONS.map((t) => {
        const on = s.editTags.indexOf(t) > -1;
        return {
          label: t,
          bg: on ? 'var(--c-57462f)' : 'var(--c-ebe2d2)',
          fg: on ? 'var(--c-f6f1e7)' : 'var(--c-57462f)',
          on: () => this.setState({ editTags: on ? s.editTags.filter((x) => x !== t) : [...s.editTags, t] }),
        };
      }),
      saveEdit: () => {
        if (!selKey) return;
        const v = s.editName.trim();
        this.setState({
          editOpen: false,
          names: v ? { ...s.names, [selKey]: v } : s.names,
          tags: { ...s.tags, [selKey]: s.editTags },
          moved: s.editCat ? { ...s.moved, [selKey]: s.editCat } : s.moved,
        });
      },

      // Összegző panel: statisztikák és legtöbbet viselt ruhák
      summaryTitle: s.view === 'settings' ? 'A szekrényed' : 'Ez a szekrény',
      stats: [
        { label: 'Darab', value: String(total) },
        { label: 'Outfit', value: String(list.length) },
        { label: 'Viselve e hónapban', value: String(23 + Object.keys(s.worn).length) },
        { label: 'Kihasználatlan', value: String(idleAll.length) },
      ],
      idleHeadline: idleAll.length ? idleAll.length + ' darabot hónapok óta nem viseltél' : 'Mindent nemrég viseltél',
      idleBody: idleAll.length
        ? 'Viselj fel egyet ezen a héten, vagy engedd el — az eltávolított darabok 30 napig várnak törlés előtt.'
        : 'Semmi sem hever kihasználatlanul. Naplózd, mit viselsz, és ez így is marad.',
      // Ez a 3 darab csak kitalált mintaadat a beépített (nem "fresh") demó-szekrényhez –
      // nincs valódi viselési előzményünk, ezért a felhasználó saját (fresh) szekrényénél
      // nem mutatunk semmit itt, nehogy nemlétező ruhák jelenjenek meg.
      hasMostWorn: total > 0 && !fresh,
      mostWorn: (total === 0 || fresh) ? [] : (who === 'Female'
        ? [{ label: 'fehér sportcipő', cat: 'Cipők', n: '31 alkalom' }, { label: 'kék farmer', cat: 'Nadrágok', n: '28 alkalom' }, { label: 'csíkos póló', cat: 'Felsők', n: '22 alkalom' }]
        : [{ label: 'fehér sneaker', cat: 'Cipők', n: '31 alkalom' }, { label: 'kék farmer', cat: 'Nadrágok', n: '28 alkalom' }, { label: 'szürke póló', cat: 'Pólók', n: '22 alkalom' }]
      ).map((m) => ({ label: nameOf(m.label), n: m.n, on: this.select(m.label, m.cat, '') })),
    };
  }

  // ==========================================================================
  // VALÓDI MÓD - tényleges bejelentkezés, a backend adatbázisából.
  // Minden fiók a sajátját látja, nincs Férfi/Nő "kettős szekrény" trükk:
  // a profil (Férfi/Nő) csak a regisztrációkori alap-kategóriákat adja,
  // utána a kategóriák, ruhák és outfitek teljesen a sajátjaid.
  // ==========================================================================
  renderRealVals() {
    const s = this.state;
    const user = s.realUser;
    const authMode = s.auth || this.props.start || 'login';
    const compact = (this.props.density || 'Comfortable') === 'Compact';
    const flags = this.props.showUnwornFlags === undefined ? true : this.props.showUnwornFlags;
    const validEmail = (v) => /.+@.+\..+/.test(v.trim());

    // Kategóriák: a backend tényleges kategóriái, a felhasználó bármikor
    // átnevezheti vagy törölheti - nincs "alap vs. saját" megkülönböztetés.
    const categories = s.categories || [];
    const rawAll = categories.map((c) => c.name);
    const catIdByName = {};
    categories.forEach((c) => { catIdByName[c.name] = c.id; });
    const catNameById = (id) => {
      const c = categories.find((x) => x.id === id);
      return c ? c.name : '';
    };
    const label = (n) => n; // a kategórianév már maga a valódi, tárolt érték

    // Ruhák: a backend tényleges darabjai, eltávolítva-jelzéssel szűrve
    const allRaw = (s.items || []).filter((it) => !it.removedAt);
    const allItems = allRaw.map((it) => ({
      key: it.id, label: it.label, cat: catNameById(it.categoryId),
      note: it.wornToday ? '' : this.noteFromLastWorn(it.lastWornAt),
      wornToday: it.wornToday, photoUrl: it.photoUrl, tags: it.tags || [],
      lastWornAt: it.lastWornAt, price: it.price, wearCount: it.wearCount || 0, kivagott: !!it.origPhotoUrl,
      szin: it.color || '', szinHex: it.colorHex || '', marka: it.brand || '', inLaundry: !!it.inLaundry, needsRepair: !!it.needsRepair,
      care: it.care || null, createdAt: it.createdAt || null,
    }));
    const inCat = (n) => allItems.filter((x) => x.cat === n);
    const total = allItems.length;
    const darabAdat = (id) => allItems.find((x) => x.key === id);
    const itemById = (id) => (s.items || []).find((it) => it.id === id);
    const nameOfItem = (id) => { const it = itemById(id); return it ? it.label : ''; };
    // Fotók a sablonhoz: ha nincs, üres szöveg - ilyenkor a csíkozott helyőrző látszik
    const photoOfItem = (id) => { const it = itemById(id); return (it && it.photoUrl) || ''; };
    const outfitPhoto = (o) => {
      const ids = (o && o.raw && o.raw.itemIds) || [];
      for (let i = 0; i < ids.length; i++) { if (photoOfItem(ids[i])) return photoOfItem(ids[i]); }
      return '';
    };

    const idleAll = allItems
      .filter((x) => x.note && !x.wornToday)
      .sort((a, b) => this.monthsOf(b.note) - this.monthsOf(a.note));

    const query = (s.q || '').trim().toLowerCase();
    let pieces = (s.cat === 'All' ? allItems : inCat(s.cat)).map((x) => ({
      label: x.label, cat: x.cat, note: x.note, key: x.key,
      sub: x.wornToday ? 'Ma viselve' : (flags && x.note ? x.note : label(x.cat)),
      noteFg: x.wornToday ? 'var(--c-6b5940)' : (flags && x.note ? 'var(--c-8a5a22)' : 'var(--c-6b5940)'),
      border: s.sel && s.sel.id === x.key ? '2px solid var(--c-57462f)' : '2px solid transparent',
      on: this.realSelectItem({ id: x.key }),
      // kártya: kijelölve, rég nem viselt (a felirat kiemelve), márka a saját színeivel
      cls: s.sel && s.sel.id === x.key ? 'is-sel' : '',
      subCls: !x.wornToday && flags && x.note ? 'is-regi' : '',
      marka: x.marka || '', markaVan: !!x.marka,
      markaBg: markaSzin(x.marka).bg, markaFg: markaSzin(x.marka).fg,
      boxCls: x.kivagott ? 'is-kivagott' : '',
      szinNev: x.szin, szinDot: szinPont(x.szin, x.szinHex),
      allapot: x.inLaundry ? 'Szennyesben' : (x.needsRepair ? 'Javításra vár' : ''),
      photoUrl: x.photoUrl || '',
      imgDisplay: x.photoUrl ? 'block' : 'none',
      placeholderDisplay: x.photoUrl ? 'none' : 'block',
    }));
    if (s.filter === 'Rég nem viselt') pieces = pieces.filter((p) => p.note);
    if (s.filter === 'Nemrég viselt') pieces = pieces.filter((p) => !p.note && p.sub === 'Ma viselve');
    if (query) pieces = pieces.filter((p) => p.label.toLowerCase().indexOf(query) > -1);
    if (s.szinSzuro) pieces = pieces.filter((p) => p.szinNev === s.szinSzuro);
    // a szekrényben előforduló színek (szűrő-chipekhez)
    const szinSzamlalo = {};
    allItems.forEach((x) => { if (x.szin) szinSzamlalo[x.szin] = (szinSzamlalo[x.szin] || 0) + 1; });

    // Outfitek
    const outfitItemLabels = (o) => (o.itemIds || []).map(nameOfItem).filter(Boolean);
    const list = (s.outfits || []).map((o) => ({
      key: o.id, name: o.name, occasion: o.occasion || 'Bármilyen alkalom', season: o.season || 'Bármilyen évszak',
      items: outfitItemLabels(o), pieces: outfitItemLabels(o).join(' · '),
      worn: o.wornToday ? 'Ma viselve' : 'Még nem viselve',
      favourite: !!o.favourite, wornToday: !!o.wornToday, raw: o,
    }));
    const cur = list[Math.min(s.oi, list.length - 1)] || { key: null, name: '', occasion: '', season: '', items: [], pieces: '', worn: '', favourite: false, wornToday: false, raw: null };

    let weatherSeason = null;
    if (s.weather) weatherSeason = s.weather.season;
    function seasonMatchScore(o) {
      if (!weatherSeason) return 0;
      if (o.season === weatherSeason) return 0;
      if (o.season === 'Bármilyen évszak') return 1;
      return 2;
    }
    const suggestionPicks = list
      .map((o, i) => ({ o, i }))
      .sort((a, b) => seasonMatchScore(a.o) - seasonMatchScore(b.o))
      .slice(0, 3);

    const selId = s.sel ? s.sel.id : null;
    const selItem = selId !== null && selId !== undefined ? itemById(selId) : null;
    const selIsWorn = !!(selItem && selItem.wornToday);
    const selNote = selItem && !selItem.wornToday ? this.noteFromLastWorn(selItem.lastWornAt) : '';
    const baseWears = selNote ? 3 : 14;

    // Outfit-összeállító: itt NEM kötjük egy-egy helyet fix kategóriához
    // (nálad teljesen más kategórianevek is lehetnek, mint másnál), helyette
    // minden hely bármelyik saját darabodból választhat.
    const bSlots = [
      { key: 'top', role: 'Felső', cat: '*', empty: 'Válassz felsőt' },
      { key: 'bottom', role: 'Alsó', cat: '*', empty: 'Válassz alsót' },
      { key: 'shoes', role: 'Cipő', cat: '*', empty: 'Válassz cipőt' },
      { key: 'extra', role: 'Extra', cat: '*', empty: 'Opcionális' },
    ].concat((s.bMore || []).map((k, i) => ({ key: k, role: 'Extra ' + (i + 2), cat: '*', empty: 'Válassz bármilyen darabot', removable: true })));
    const slot = bSlots.find((x) => x.key === s.bSlot);
    const bReady = s.bPicks.top && s.bPicks.bottom && s.bPicks.shoes;

    // A kinézetet (aktív állapot, ikon) a CSS adja: `cls` és `icon` osztálynevek.
    const nav = (text, view) => ({
      label: text, icon: view,
      cls: s.view === view ? 'is-active' : '',
      on: () => this.setState(view === 'wardrobe'
        ? { view, cat: 'All', filter: 'Összes', q: '', editOpen: false }
        : { view, editOpen: false, sel: null }),
    });
    const catRow = (text, key, count) => ({
      label: text, count: String(count),
      cls: s.cat === key && s.view === 'wardrobe' ? 'is-active' : '',
      on: () => this.setState({ view: 'wardrobe', cat: key, filter: 'Összes', editOpen: false }),
    });
    const chipOf = (text, key, active) => ({
      label: text, bg: active ? 'var(--c-57462f)' : 'var(--c-f6f1e7)', fg: active ? 'var(--c-f6f1e7)' : 'var(--c-6b5940)',
      on: () => this.setState({ [key]: text }),
    });

    const assigned = s.drops.filter((f) => s.dropCats[f]).length;
    const removedItems = (s.items || []).filter((it) => it.removedAt);
    // a "Mentés" gomb felirata
    let saveLabelReal = 'Válassz kategóriát a fotóknak';
    if (assigned > 0 && assigned === s.drops.length) {
      saveLabelReal = 'Mentés (' + assigned + ' darab)';
    } else if (assigned > 0) {
      saveLabelReal = 'Mentés (' + assigned + ' / ' + s.drops.length + ' darab)';
    }
    const dealt = total; // valódi módban nincs külön "kihasználatlan feldolgozó" folyamat, ez a mező itt nem releváns
    const idleBase = allRaw.filter((it) => this.noteFromLastWorn(it.lastWornAt));

    const genderTile = (g, displayLabel, hint) => ({
      label: displayLabel, hint,
      bg: s.suGender === g ? 'var(--c-57462f)' : 'var(--c-f6f1e7)',
      border: s.suGender === g ? '1.5px solid var(--c-57462f)' : '1px solid rgba(var(--c-57462f-rgb),.18)',
      fg: s.suGender === g ? 'var(--c-f6f1e7)' : 'var(--c-57462f)',
      sub: s.suGender === g ? 'var(--c-e4d9c6)' : 'var(--c-6b5940)',
      on: () => this.setState({ suGender: g, suErr: '' }),
    });

    const profile = user ? user.profile : 'Male';
    const profileLabel = profile === 'Female' ? 'Nő' : 'Férfi';
    const density = user ? user.density : 'Comfortable';
    const showUnwornFlags = user ? user.showUnwornFlags : true;
    const reminders = user ? user.reminders : { weekly: true, daily: false, idle: true };

    return {
      // Bejelentkezés / regisztráció - valódi backend-hívások
      isAuth: authMode === 'login' || authMode === 'signup' || authMode === 'verify' || authMode === 'reset',
      isLogin: authMode === 'login',
      isSignup: authMode === 'signup',
      isVerify: authMode === 'verify',
      verifyEmail: s.verifyEmail || '',
      verifyMsg: s.verifyMsg || '',
      verifyVanMsg: !!s.verifyMsg,
      verifyMsgCls: s.verifyHiba ? 'is-hiba' : '',
      verifyResendLabel: s.verifyKuld ? 'Küldés…' : 'Megerősítő e-mail újraküldése',
      doResend: () => this.realResend(),
      // új jelszó beállítása (a visszaállító e-mail linkjéből)
      isReset: authMode === 'reset',
      rUrlap: s.rAllapot === 'urlap',
      rEllenoriz: s.rAllapot === 'ellenoriz',
      rRossz: s.rAllapot === 'lejart' || s.rAllapot === 'ervenytelen',
      rRosszSzoveg: s.rAllapot === 'lejart'
        ? 'Ez a link már lejárt (1 óráig érvényes). Kérj újat a bejelentkezésnél az „Elfelejtett jelszó?” linkkel.'
        : 'Ez a link érvénytelen, vagy már felhasználták. Kérj újat a bejelentkezésnél az „Elfelejtett jelszó?” linkkel.',
      rEmail: s.rEmail || '',
      rPw: s.rPw || '',
      rPw2: s.rPw2 || '',
      onRPw: (e) => this.setState({ rPw: e.target.value, rErr: '' }),
      onRPw2: (e) => this.setState({ rPw2: e.target.value, rErr: '' }),
      rPwType: s.rShow ? 'text' : 'password',
      rShowLabel: s.rShow ? 'Elrejtés' : 'Mutat',
      toggleRShow: () => this.setState({ rShow: !s.rShow }),
      rErr: s.rErr || '',
      rErosseg: jelszoErosseg(s.rPw || ''),
      rMentLabel: s.rKuld ? 'Mentés…' : 'Új jelszó mentése',
      doReset: () => this.realResetPassword(),
      resetToLogin: () => this.setState({ auth: 'login', lEmail: s.rEmail || s.lEmail, rAllapot: '', rErr: '', rToken: '' }),
      verifyToLogin: () => this.setState({ auth: 'login', lEmail: s.verifyEmail || s.lEmail, verifyMsg: '', lErr: '' }),
      toSignup: () => this.setState({ auth: 'signup', lErr: '', resetSent: '' }),
      toLogin: () => this.setState({ auth: 'login', suErr: '' }),
      lEmail: s.lEmail,
      lPw: s.lPw,
      onLEmail: (e) => this.setState({ lEmail: e.target.value, lErr: '' }),
      onLPw: (e) => this.setState({ lPw: e.target.value, lErr: '' }),
      lPwType: s.lShow ? 'text' : 'password',
      lShowLabel: s.lShow ? 'Elrejtés' : 'Mutat',
      toggleLShow: () => this.setState({ lShow: !s.lShow }),
      lErr: s.lErr,
      // elfelejtett jelszó: visszaállító link e-mailben (nem áruljuk el, létezik-e a fiók)
      resetLine: !s.resetSent ? '' : s.resetNoMail
        ? 'A visszaállító link a szerver ablakában jelent meg (az e-mail-küldés nincs beállítva).'
        : 'Ha van fiók ezzel a címmel (' + s.resetSent + '), pár percen belül megérkezik a visszaállító link. Nézd meg a spam mappát is.',
      forgot: () => this.realForgot(),
      doLogin: () => this.realDoLogin(),
      appleLogin: () => {},
      suName: s.suName,
      suEmail: s.suEmail,
      suPw: s.suPw,
      onSuName: (e) => this.setState({ suName: e.target.value, suErr: '' }),
      onSuEmail: (e) => this.setState({ suEmail: e.target.value, suErr: '' }),
      onSuPw: (e) => this.setState({ suPw: e.target.value, suErr: '' }),
      suPwType: s.suShow ? 'text' : 'password',
      suShowLabel: s.suShow ? 'Elrejtés' : 'Mutat',
      toggleSuShow: () => this.setState({ suShow: !s.suShow }),
      genders: [genderTile('Male', 'Férfi', 'Férfi szabás és méretek'), genderTile('Female', 'Nő', 'Női szabás és méretek')],
      suErr: s.suErr,
      suCtaLabel: s.suGender ? 'Fiók létrehozása' : 'Válassz egyet a folytatáshoz',
      suCtaBg: s.suGender ? 'var(--c-57462f)' : 'var(--c-d8d1c1)',
      suCtaFg: s.suGender ? 'var(--c-f6f1e7)' : 'var(--c-6b5940)',
      doSignup: () => this.realDoSignup(),
      logOut: () => this.realLogOut(),

      // Nézetek és navigáció
      isWardrobe: s.view === 'wardrobe',
      isOutfits: s.view === 'outfits',
      isOutfitsFilled: s.view === 'outfits' && list.length > 0,
      outfitsEmpty: s.view === 'outfits' && list.length === 0,
      outfitsEmptyLine: total ? 'Válassz egy felsőt, egy alsót és cipőt a hozzáadott ruháid közül, majd nevezd el.' : 'Először adj hozzá pár darabot a szekrényedhez. Utána itt tudod összeállítani az első outfitedet.',
      outfitsEmptyCta: total ? 'Első outfit összeállítása' : 'Ruhák hozzáadása',
      outfitsEmptyGo: total
        ? () => this.setState({ view: 'builder', sel: null, bName: '', bOcc: '', bSeason: '', bPicks: {}, bMore: [], bSlot: 'top', bLogDay: '' })
        : () => this.setState({ view: 'add', sel: null, editOpen: false }),
      homeEmpty: total === 0,
      homeFilled: total > 0,
      firstName: (user && user.name ? user.name : '').split(' ')[0] || 'Barátom',
      firstSteps: [
        { n: '01', title: 'Fotózd le', line: 'Egy darab, egy fotó, kiterítve vagy vállfán.' },
        { n: '02', title: 'Rendszerezd', line: 'Tedd minden fotót egy kategóriába, például ' + (rawAll[0] || 'egy kategóriába') + ' vagy Cipők közé.' },
        { n: '03', title: 'Állíts össze', line: 'Rakj össze outfiteket a ruháidból, és jegyezd fel, mit viseltél.' },
      ],
      noSuggestions: list.length === 0,
      isBuilder: s.view === 'builder',
      isUntouched: s.view === 'untouched',
      isSettings: s.view === 'settings',
      isAdd: s.view === 'add',
      navItems: [nav('Kezdőlap', 'home'), nav('Szekrény', 'wardrobe'), nav('Outfitek', 'outfits'), nav('Naptár', 'calendar'), nav('Okos szekrény', 'okos'), nav('Kihasználatlan', 'untouched'), nav('Eltávolított', 'removed'), nav('Beállítások', 'settings')],
      ...this.renderCalendarVals(list),

      isRemoved: s.view === 'removed',
      toRemoved: () => this.setState({ view: 'removed', sel: null, editOpen: false }),
      removedLine: removedItems.length
        ? removedItems.length + ' darab vár · 30 nap után törlődik'
        : 'Még nincs eltávolított darab',
      removedEmpty: removedItems.length === 0,
      removedList: removedItems.map((it) => ({
        label: it.label,
        hint: 'Eltávolítva · 30 nap belül törlődik',
        photoUrl: it.photoUrl || '',
        restore: () => this.realRestoreItem(it.id),
      })),
      purgeAll: () => this.realPurgeAllRemoved(),

      isHome: s.view === 'home',
      homeTotal: total + ' darab, ' + rawAll.length + ' kategóriában',
      viewAll: () => this.setState({ view: 'wardrobe', cat: 'All', filter: 'Összes', q: '', sel: null, editOpen: false }),
      suggestions: suggestionPicks.map(({ o, i }) => ({
        name: o.name, sub: o.pieces, photoUrl: outfitPhoto(o),
        on: () => this.setState({ view: 'outfits', oi: i, sel: null, editOpen: false }),
      })),
      homeTiles: rawAll.map((n, i) => {
        const items = inCat(n);
        const idle = items.filter((x) => x.note).length;
        const cover = items.find((x) => x.photoUrl);
        return {
          name: n, count: items.length + ' darab',
          photoUrl: cover ? cover.photoUrl : '',
          idle: items.length === 0 ? 'üres' : (idle ? idle + ' kihasználatlan' : 'mind viselve nemrég'),
          bg: ['var(--c-cfcbc1)', 'var(--c-c6c2b8)', 'var(--c-d2cec4)', 'var(--c-cbc7bd)', 'var(--c-d6d2c8)'][i % 5],
          span: i === 0 ? 'span 2' : 'span 1',
          on: () => this.setState({ view: 'wardrobe', cat: n, filter: 'Összes', q: '', sel: null, editOpen: false }),
        };
      }),
      catNav: rawAll.map((n) => catRow(n, n, inCat(n).length)),
      katCats: rawAll, // a katalógusból hozzáadott termékek kategória-felismeréséhez
      accountName: (user && user.name) || 'A szekrényed',
      accountInitial: (((user && user.name) || 'W').trim()[0] || 'W').toUpperCase(),
      profileLine: profileLabel + ' · ' + total + ' darab',
      toHome: () => this.setState({ view: 'home', cat: 'All', filter: 'Összes', q: '', sel: null, editOpen: false }),
      toAdd: () => this.setState({ view: 'add', sel: null, editOpen: false }),
      toSettings: () => this.setState({ view: 'settings', sel: null, editOpen: false }),
      toUntouched: () => this.setState({ view: 'untouched', sel: null, editOpen: false }),

      headTitle: s.cat === 'All' ? 'Mindegyik' : label(s.cat),
      headCount: pieces.length === total ? total + ' darab' : pieces.length + ' / ' + total + ' darab látható',
      q: s.q,
      hasQuery: (s.q || '').length > 0,
      onQuery: (e) => this.setState({ q: e.target.value }),
      clearQuery: () => this.setState({ q: '' }),
      filters: [
        chipOf('Összes', 'filter', s.filter === 'Összes'),
        chipOf('Rég nem viselt', 'filter', s.filter === 'Rég nem viselt'),
        chipOf('Nemrég viselt', 'filter', s.filter === 'Nemrég viselt'),
      ],
      pieces,
      noPieces: pieces.length === 0,
      emptyLine: query
        ? 'Nincs találat erre: "' + s.q.trim() + '".'
        : (s.filter === 'Nemrég viselt' ? 'Még nincs naplózva viselés.' : 'Minden darabot nemrég viseltél.'),
      cardMin: compact ? '132px' : '176px',
      cardH: compact ? '160px' : '212px',

      outfit: cur,
      outfitTiles: ((cur.raw && cur.raw.itemIds) || []).filter((id) => nameOfItem(id)).map((id, i) => ({
        label: nameOfItem(id), photoUrl: photoOfItem(id),
        bg: ['var(--c-dcd8ce)', 'var(--c-d4d0c6)', 'var(--c-d8d4ca)', 'var(--c-cdc9bf)'][i % 4],
      })),
      outfitCols: cur.items.length > 4 ? 3 : 2,
      outfitMeta: cur.occasion + ' · ' + cur.season + ' · ' + cur.worn,
      outfitCount: list.length + ' mentve',
      favMark: cur.favourite ? '★' : '☆',
      favLabel: cur.favourite ? 'Kedvenc' : 'Hozzáadás a kedvencekhez',
      favBg: cur.favourite ? 'var(--c-dcd8ce)' : 'var(--c-f6f1e7)',
      toggleFav: () => { if (cur.raw) this.realToggleFavOutfit(cur.raw); },
      deleteOutfit: () => { if (cur.key !== null) this.realDeleteOutfit(cur.key); },
      outfitWearLabel: cur.wornToday ? 'Mára naplózva' : 'Viselem ma',
      outfitWearBg: cur.wornToday ? 'var(--c-dcd8ce)' : 'var(--c-57462f)',
      outfitWearFg: cur.wornToday ? 'var(--c-57462f)' : 'var(--c-f6f1e7)',
      wearOutfit: () => { if (cur.key !== null) this.realWearOutfit(cur.key); },
      outfitList: list.map((o, n) => ({
        name: o.name, sub: o.occasion + ' · ' + o.season,
        bg: o.key === cur.key ? 'var(--c-dcd8ce)' : 'var(--c-ebe2d2)',
        border: o.key === cur.key ? '1.5px solid var(--c-57462f)' : '1px solid transparent',
        mark: o.favourite ? '★' : '☆',
        markFg: o.favourite ? 'var(--c-57462f)' : 'var(--c-8a7a62)',
        markBg: o.favourite ? 'var(--c-f6f1e7)' : 'transparent',
        // négy kis bélyegkép az outfit darabjaiból (ami hiányzik, az helyőrző marad)
        thumbs: [0, 1, 2, 3].map((k) => ({ photoUrl: photoOfItem(((o.raw && o.raw.itemIds) || [])[k]) })),
        on: () => this.setState({ view: 'outfits', oi: n, sel: null }),
        star: () => this.realToggleFavOutfit(o.raw),
      })),

      toBuilder: () => this.setState({ view: 'builder', sel: null, bName: '', bOcc: '', bSeason: '', bPicks: {}, bMore: [], bSlot: 'top', bLogDay: '' }),
      cancelBuilder: () => this.setState({ view: s.bLogDay ? 'calendar' : 'outfits', bSlot: '', bLogDay: '' }),
      bName: s.bName,
      onBName: (e) => this.setState({ bName: e.target.value }),
      bNamePlaceholder: (s.bOcc || 'Új') + ' outfit',
      bSlots: bSlots.map((x) => ({
        role: x.role,
        label: s.bPicks[x.key] ? nameOfItem(s.bPicks[x.key]) : x.empty,
        photoUrl: s.bPicks[x.key] ? photoOfItem(s.bPicks[x.key]) : '',
        bg: s.bPicks[x.key] ? 'var(--c-dcd8ce)' : 'var(--c-f6f1e7)',
        border: s.bSlot === x.key ? '2px solid var(--c-57462f)' : (s.bPicks[x.key] ? '2px solid rgba(var(--c-57462f-rgb),.35)' : '1.5px dashed rgba(var(--c-57462f-rgb),.35)'),
        on: () => this.setState({ bSlot: x.key, bLap: true }),
        removable: !!x.removable,
        remove: (e) => {
          e.stopPropagation();
          const picks = { ...s.bPicks }; delete picks[x.key];
          this.setState({ bMore: (s.bMore || []).filter((k) => k !== x.key), bPicks: picks, bSlot: s.bSlot === x.key ? '' : s.bSlot });
        },
      })),
      addSlot: () => {
        const k = 'more' + Date.now();
        this.setState({ bMore: [...(s.bMore || []), k], bSlot: k });
      },
      bOccasions: ['Munka', 'Hétvége', 'Program'].map((o) => chipOf(o, 'bOcc', s.bOcc === o)),
      bSeasons: ['Meleg', 'Enyhe', 'Hideg'].map((x) => chipOf(x, 'bSeason', s.bSeason === x)),
      bCtaLabel: bReady ? 'Outfit mentése' : 'Válassz felsőt, alsót és cipőt',
      bCtaBg: bReady ? 'var(--c-57462f)' : 'var(--c-d8d1c1)',
      bCtaFg: bReady ? 'var(--c-f6f1e7)' : 'var(--c-6b5940)',
      saveOutfit: () => this.realSaveOutfit(),

      railPicker: s.view === 'builder',
      pickerIdle: !slot,
      pickerTitle: slot ? (SLOT_CIM[slot.key] && !slotSzur(slot.key, allItems).mind ? SLOT_CIM[slot.key] : 'Bármilyen darab') : 'Darabok',
      pickerCount: slot ? slotSzur(slot.key, allItems).darabok.length + ' db' : '',
      pickerItems: slot
        ? slotSzur(slot.key, allItems).darabok.map((x) => ({
            label: x.label,
            photoUrl: x.photoUrl || '',
            border: s.bPicks[slot.key] === x.key ? '2px solid var(--c-57462f)' : '2px solid transparent',
            on: () => this.setState({ bPicks: { ...s.bPicks, [slot.key]: x.key }, bLap: false }),
          }))
        : [],

      idleLine: idleAll.length ? idleAll.length + ' darab, a legrégebbi elöl' : 'Nincs kihasználatlan darab',
      idleEmpty: idleAll.length === 0,
      idleItems: idleAll.map((x) => ({
        label: x.label, cat: label(x.cat), note: x.note,
        photoUrl: x.photoUrl || '',
        open: this.realSelectItem({ id: x.key }),
        wear: () => this.realWearItem(x.key),
        remove: () => this.realRemoveItem(x.key),
      })),
      undoVisible: !!s.lastGoneId && removedItems.some((it) => it.id === s.lastGoneId),
      undoLine: (itemById(s.lastGoneId) ? itemById(s.lastGoneId).label : '') + ' áthelyezve az Eltávolítottak közé',
      undoGone: () => { if (s.lastGoneId) this.realRestoreItem(s.lastGoneId); },
      dismissUndo: () => this.setState({ lastGoneId: null }),

      sName: (user && user.name) || '',
      sEmail: (user && user.email) || '',
      onSName: (e) => { this.setState({ realUser: { ...user, name: e.target.value } }); this.debouncedSaveProfile(); },
      onSEmail: (e) => { this.setState({ realUser: { ...user, email: e.target.value } }); this.debouncedSaveProfile(); },
      profileTabs: [['Male', 'Férfi'], ['Female', 'Nő']].map(([p, disp]) => ({
        label: disp,
        bg: profile === p ? 'var(--c-57462f)' : 'var(--c-ebe2d2)',
        fg: profile === p ? 'var(--c-f6f1e7)' : 'var(--c-57462f)',
        // Ez csak egy beállítás, NEM cseréli le a szekrényedet - a ruháid, a
        // kategóriáid és az outfitjeid a tieid maradnak, bármelyiket választod.
        on: () => this.realSaveSettings({ profile: p }),
      })),
      catEditRows: categories.map((c) => ({
        value: c.name,
        count: inCat(c.name).length + ' darab',
        onChange: (e) => this.realRenameCategory(c.id, e.target.value),
        removable: true,
        remove: () => this.realDeleteCategory(c.id),
      })),
      newCat: s.newCat || '',
      onNewCat: (e) => this.setState({ newCat: e.target.value }),
      addCatLabel: (s.newCat || '').trim() ? 'Kategória hozzáadása' : 'Először nevezd el',
      addCatBg: (s.newCat || '').trim() ? 'var(--c-57462f)' : 'var(--c-d8d1c1)',
      addCatFg: (s.newCat || '').trim() ? 'var(--c-f6f1e7)' : 'var(--c-6b5940)',
      addCategory: () => this.realAddCategory(),

      reminders: [
        { label: 'Kihasználatlan darabok', hint: 'Ha valami elér 6 hónapot', bg: reminders.idle ? 'var(--c-57462f)' : 'var(--c-d8d1c1)', knob: reminders.idle ? 'flex-end' : 'flex-start', toggle: () => this.realSaveSettings({ reminders: { ...reminders, idle: !reminders.idle } }) },
      ],
      themeOptions: THEMES.map((t) => {
        const on = ((user && user.theme) || DEFAULT_THEME) === t.key;
        return {
          label: t.label,
          hint: t.hint,
          swatches: t.swatches.map((c) => ({ color: c })),
          border: on ? '2px solid var(--m-accent)' : '1px solid var(--m-line-strong)',
          bg: on ? 'var(--c-f1eadd)' : 'var(--c-f6f1e7)',
          mark: on ? '✓' : '',
          on: () => { if (!on) this.realSaveSettings({ theme: t.key }); },
        };
      }),
      resetAll: () => this.realLogOut(),

      addLine: s.drops.length ? assigned + ' / ' + s.drops.length + ' besorolva' : 'Húzd ide a fotóidat, vagy kattints és válaszd ki őket',
      noDrops: s.drops.length === 0,
      hasDrops: s.drops.length > 0,
      // valódi feltöltés a gépről: kattintásra tallózás, vagy behúzás
      pickFiles: () => this.openFilePicker(),
      onFilesChosen: (e) => this.onFilesChosen(e),
      onFilesDragOver: (e) => this.onFilesDragOver(e),
      onFilesDrop: (e) => this.onFilesDrop(e),
      addErr: s.addErr || '',
      drops: s.drops.map((file) => ({
        file,
        missing: !s.dropCats[file],
        drop: () => this.setState({ drops: s.drops.filter((f) => f !== file) }),
        photoUrl: s.phonePhotos[file] || '',
        imgDisplay: s.phonePhotos[file] ? 'block' : 'none',
        placeholderDisplay: s.phonePhotos[file] ? 'none' : 'block',
        name: (s.dropNames || {})[file] || '',
        onName: (e) => this.setState({ dropNames: { ...(s.dropNames || {}), [file]: e.target.value } }),
        ...this.dropExtra(file),
        options: rawAll.map((n) => ({
          label: n,
          bg: s.dropCats[file] === n ? 'var(--c-57462f)' : 'var(--c-ebe2d2)',
          fg: s.dropCats[file] === n ? 'var(--c-f6f1e7)' : 'var(--c-57462f)',
          on: () => this.setState({ dropCats: { ...s.dropCats, [file]: n } }),
        })),
      })),
      // Mentés: már akkor is lehet, ha csak néhány fotónak van kategóriája -
      // azokat elmenti, a többi itt marad a listában
      saveLabel: saveLabelReal,
      saveBg: assigned > 0 ? 'var(--c-57462f)' : 'var(--c-d8d1c1)',
      saveFg: assigned > 0 ? 'var(--c-f6f1e7)' : 'var(--c-6b5940)',
      saveDrops: () => {
        if (assigned > 0) {
          this.realSaveDrops();
        } else {
          this.setState({ addErr: 'Először válassz kategóriát legalább egy fotónak.' });
        }
      },
      clearDrops: () => this.setState({ drops: [], dropCats: {}, dropNames: {}, addErr: '' }),
      // jobb panel: a még el nem mentett fotók listája
      queueLine: s.drops.length ? s.drops.length + ' fotó' : '',
      queueEmpty: s.drops.length === 0,
      queueRows: s.drops.map((file) => ({
        file: ((s.dropNames || {})[file] || '').trim() || (file.indexOf('phone-') === 0 ? 'Telefonról érkezett fotó' : file),
        photoUrl: s.phonePhotos[file] || '',
        status: s.dropCats[file] ? s.dropCats[file] : 'Kategóriára vár',
        fg: s.dropCats[file] ? 'var(--c-7a9a52)' : 'var(--c-8a5a22)',
      })),

      railItem: !!s.sel && s.view === 'wardrobe' && !s.editOpen,
      railEdit: !!s.sel && s.view === 'wardrobe' && s.editOpen,
      railOutfits: s.view === 'outfits',
      railSummary: s.view === 'wardrobe' && !s.sel,
      railHome: s.view === 'home',
      railUntouched: s.view === 'untouched',
      railAdd: s.view === 'add',
      railRemoved: s.view === 'removed',
      railDisplay: s.view === 'settings' || s.view === 'okos' ? 'none' : 'flex',
      // az oszlopszélességeket a CSS adja (képernyőmérettől függően), itt csak azt jelezzük, ha nincs jobb panel
      gridMod: s.view === 'settings' || s.view === 'okos' ? 'is-norail' : '',
      dealtLine: idleBase.length ? (idleBase.length - idleAll.length) + ' / ' + idleBase.length + ' elintézve' : 'Nincs mit elintézni',
      dealtPct: (idleBase.length ? Math.round(((idleBase.length - idleAll.length) / idleBase.length) * 100) : 100) + '%',
      hasOldest: idleAll.length > 0,
      oldestLabel: idleAll[0] ? idleAll[0].label : '',
      oldestPhotoUrl: idleAll[0] ? idleAll[0].photoUrl || '' : '',
      oldestSub: idleAll[0] ? label(idleAll[0].cat) + ' · ' + idleAll[0].note : '',
      openOldest: () => { if (idleAll[0]) this.realSelectItem({ id: idleAll[0].key })(); },

      removedCount: removedItems.length === 1 ? '1 darab vár' : removedItems.length + ' darab vár',
      removedHas: removedItems.length > 0,
      deleteAllNow: () => this.realPurgeAllRemoved(),

      selLabel: selItem ? selItem.label : '',
      selPhotoUrl: selItem && selItem.photoUrl ? selItem.photoUrl : '',
      selImgDisplay: selItem && selItem.photoUrl ? 'block' : 'none',
      selPlaceholderDisplay: selItem && selItem.photoUrl ? 'none' : 'block',
      selCat: selItem ? label(catNameById(selItem.categoryId)) : '',
      selWorn: (() => {
        const db = selItem ? selItem.wearCount || 0 : 0;
        const ossz = db ? ' · összesen ' + db + ' alkalommal' : '';
        if (selIsWorn) return 'Ma viselted' + ossz;
        if (selNote) return 'Utoljára ' + selNote.replace(/ nem viselted$/, '') + ' viselted' + ossz;
        return db ? 'Viselve ' + db + ' alkalommal' : 'Még nincs naplózva, hogy viselted-e';
      })(),
      ...this.cpwVals(selItem),
      selKivagott: !!(selItem && selItem.origPhotoUrl),
      selBoxCls: selItem && selItem.origPhotoUrl ? 'is-kivagott' : '',
      selHatterVan: !!(selItem && selItem.photoUrl),
      selHatterLabel: s.selHatter === 'fut' ? 'Háttér eltávolítása… (első alkalommal kb. fél perc)'
        : (s.selHatter === 'hiba' ? 'Nem sikerült – próbáld újra'
          : (selItem && selItem.origPhotoUrl ? 'Eredeti fotó visszaállítása' : 'Háttér eltávolítása a fotóról')),
      selHatterIcon: selItem && selItem.origPhotoUrl ? 'undo' : 'image',
      selHatter: () => {
        if (!selItem || s.selHatter === 'fut') return;
        if (selItem.origPhotoUrl) this.realEredetiItem(selItem); else this.realHatterItem(selItem);
      },
      selWearLabel: selIsWorn ? 'Mára naplózva' : 'Viselem ma',
      selWearBg: selIsWorn ? 'var(--c-dcd8ce)' : 'var(--c-57462f)',
      selWearFg: selIsWorn ? 'var(--c-57462f)' : 'var(--c-f6f1e7)',
      wearSel: () => { if (selId !== null) this.realWearItem(selId); },
      selTags: (selItem && selItem.tags && selItem.tags.length ? selItem.tags : DEFAULT_TAGS).map((t) => ({ label: t })),
      selOutfits: list.filter((o) => selId !== null && o.raw && (o.raw.itemIds || []).includes(selId)).slice(0, 2).map((o, n) => ({
        name: o.name, sub: o.occasion + ' · ' + o.season, photoUrl: outfitPhoto(o),
        on: () => this.setState({ view: 'outfits', oi: n, sel: null }),
      })),
      removeSel: () => { if (selId !== null) this.realRemoveItem(selId); },
      clearSel: () => this.setState({ sel: null, editOpen: false }),

      openEdit: () => this.setState({
        editOpen: true,
        editName: selItem ? selItem.label : '',
        editTags: selItem && selItem.tags && selItem.tags.length ? selItem.tags : DEFAULT_TAGS,
        editCat: selItem ? (catIdByName[catNameById(selItem.categoryId)] || '') : '',
        editPrice: selItem && selItem.price !== null && selItem.price !== undefined ? String(selItem.price) : '',
        editSzin: selItem && selItem.color ? selItem.color : '',
      }),
      cancelEdit: () => this.setState({ editOpen: false }),
      editPrice: s.editPrice || '',
      onEditPrice: (e) => this.setState({ editPrice: e.target.value.replace(/[^0-9]/g, '') }),
      editName: s.editName,
      onEditName: (e) => this.setState({ editName: e.target.value }),
      editCats: categories.map((c) => ({
        label: c.name,
        bg: s.editCat === c.id ? 'var(--c-57462f)' : 'var(--c-ebe2d2)',
        fg: s.editCat === c.id ? 'var(--c-f6f1e7)' : 'var(--c-57462f)',
        on: () => this.setState({ editCat: c.id }),
      })),
      editTagOptions: TAG_OPTIONS.map((t) => {
        const on = s.editTags.indexOf(t) > -1;
        return {
          label: t,
          bg: on ? 'var(--c-57462f)' : 'var(--c-ebe2d2)',
          fg: on ? 'var(--c-f6f1e7)' : 'var(--c-57462f)',
          on: () => this.setState({ editTags: on ? s.editTags.filter((x) => x !== t) : [...s.editTags, t] }),
        };
      }),
      saveEdit: () => {
        if (selId === null || selId === undefined) return;
        const v = s.editName.trim();
        const patch = { tags: s.editTags };
        if (v) patch.label = v;
        if (s.editCat) patch.categoryId = s.editCat;
        patch.price = (s.editPrice || '') === '' ? null : Number(s.editPrice);
        // ha kézzel más színt választott, a színkód a lista szerinti lesz
        if ((s.editSzin || '') !== ((selItem && selItem.color) || '')) {
          patch.color = s.editSzin || null;
          patch.colorHex = s.editSzin ? SZIN_LISTA[s.editSzin] : null;
        }
        this.realSaveItemEdit(selId, patch);
      },

      summaryTitle: s.view === 'settings' ? 'A szekrényed' : 'Ez a szekrény',
      stats: [
        { label: 'Darab', value: String(total) },
        { label: 'Outfit', value: String(list.length) },
        { label: 'Viselve ma', value: String(allItems.filter((x) => x.wornToday).length + list.filter((o) => o.wornToday).length) },
        { label: 'Kihasználatlan', value: String(idleAll.length) },
      ].concat((() => {
        const arasak = allItems.filter((x) => x.price);
        if (!arasak.length) return [];
        const ertek = arasak.reduce((a, x) => a + x.price, 0);
        const viselesek = arasak.reduce((a, x) => a + Math.max(1, x.wearCount), 0);
        return [
          { label: 'A szekrény értéke', value: ftForma(ertek) },
          { label: 'Átlag / viselés', value: ftForma(ertek / viselesek) },
        ];
      })()),
      idleHeadline: idleAll.length ? idleAll.length + ' darabot hónapok óta nem viseltél' : 'Mindent nemrég viseltél',
      idleBody: idleAll.length
        ? 'Viselj fel egyet ezen a héten, vagy engedd el — az eltávolított darabok 30 napig várnak törlés előtt.'
        : 'Semmi sem hever kihasználatlanul. Naplózd, mit viselsz, és ez így is marad.',
      // szín szerinti szűrés a szekrényben (csak a ténylegesen előforduló színek)
      szinVan: Object.keys(szinSzamlalo).length > 0,
      szinChipek: [{ label: 'Minden szín', dot: 'conic-gradient(#d0302f,#e8c52a,#3f9a4f,#2f6fd0,#7a4fb0,#d0302f)', cls: s.szinSzuro ? '' : 'is-active', on: () => this.setState({ szinSzuro: '' }) }]
        .concat(Object.keys(szinSzamlalo).sort((a, b) => szinSzamlalo[b] - szinSzamlalo[a]).map((nev) => ({
          label: nev + ' (' + szinSzamlalo[nev] + ')', dot: SZIN_LISTA[nev] || '', cls: s.szinSzuro === nev ? 'is-active' : '',
          on: () => this.setState({ szinSzuro: s.szinSzuro === nev ? '' : nev }),
        }))),
      // kijelölt ruha: szín, mosás, javítás
      selSzinVan: !!(selItem && selItem.color),
      selSzinNev: selItem && selItem.color ? selItem.color : '',
      selSzinDot: selItem ? szinPont(selItem.color, selItem.colorHex) : '',
      selSzennyesLabel: selItem && selItem.inLaundry ? 'Kimostam' : 'Szennyesbe',
      selSzennyesCls: selItem && selItem.inLaundry ? 'is-aktiv' : '',
      selSzennyes: () => { if (selItem) this.realAllapot(selItem.id, { inLaundry: !selItem.inLaundry }); },
      selJavitasLabel: selItem && selItem.needsRepair ? 'Megjavítva' : 'Javításra vár',
      selJavitasCls: selItem && selItem.needsRepair ? 'is-aktiv' : '',
      selJavitas: () => { if (selItem) this.realAllapot(selItem.id, { needsRepair: !selItem.needsRepair }); },
      // szerkesztés: szín kézi megadása / javítása
      editSzinek: Object.keys(SZIN_LISTA).map((nev) => ({
        label: nev, dot: SZIN_LISTA[nev], cls: s.editSzin === nev ? 'is-active' : '',
        on: () => this.setState({ editSzin: s.editSzin === nev ? '' : nev }),
      })),
      // próbababák és "Mit vegyek fel ma?" (lásd renderUjVals)
      napiValos: true,
      napiDarabok: allItems,
      outfitDarabok: ((cur.raw && cur.raw.itemIds) || []).map(darabAdat).filter(Boolean),
      builderDarabok: Object.values(s.bPicks || {}).map(darabAdat).filter(Boolean),
      // Valódi fiókkal nincs kitalált "legtöbbet viselt" lista - csak akkor
      // mutatunk valamit, ha tényleg van legalább egy megjelölt viselés.
      hasMostWorn: false,
      mostWorn: [],
    };
  }
}

return Component;
};
