/* Logic for "Wardro Web.dc.html" — extracted from its inline <script data-dc-script>.
 *
 * Loaded as a plain classic script. It registers a factory under
 * window.__dcLogic; the one-line stub left in the .dc.html calls that factory
 * and assigns the result to `Component`, which is what the dc runtime
 * (support.js -> evalDcLogic) looks for.
 *
 * DCLogic / StreamableLogic / React are supplied by the runtime, exactly as
 * they were when this code lived inline. */
window.__dcLogic = window.__dcLogic || {};
window.__dcLogic["Wardro Web"] = function (DCLogic, StreamableLogic, React) {

// ==========================================================================
// ADATOK (mintaadatok)
// ==========================================================================
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
  'Felsők': { items: ['fehér blúz', 'selyem top', 'csíkos póló', 'kötött pulóver', 'rövidített póló', 'vászoning', 'fekete garbó', 'kardigán'], notes: { 3: '7 hónapja nem viselted', 6: '4 hónapja nem viselted' } },
  'Cipők': { items: ['fehér sportcipő', 'bokacsizma', 'balerinacipő', 'blokksarkú cipő', 'szandál', 'mokaszin'], notes: { 3: '6 hónapja nem viselted' } },
  'Ruhák': { items: ['fekete kombiné ruha', 'virágos midi ruha', 'vászon nyári ruha', 'kötött ruha', 'csavart ruha', 'ingruha'], notes: { 4: '1 éve nem viselted' } },
  'Kiegészítők': { items: ['arany karika fülbevaló', 'selyemsál', 'füles táska', 'bőröv', 'napszemüveg', 'barett sapka'], notes: {} },
  'Aljak': { items: ['kék farmer', 'pliszírozott szoknya', 'széles szárú nadrág', 'farmerszoknya', 'leggings', 'szabott rövidnadrág'], notes: { 4: '9 hónapja nem viselted' } },
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

// Ruhához választható címkék (anyag, szín, évszak)
const TAG_OPTIONS = ['Pamut', 'Gyapjú', 'Vászon', 'Semleges', 'Élénk', 'Hideg hónapok', 'Meleg hónapok', 'Egész évben'];
// Alapértelmezett címkék (új ruháknál / ha még nincs beállítva)
const DEFAULT_TAGS = ['Pamut', 'Semleges', 'Egész évben'];

// Alapállapot: ezt állítja vissza a bejelentkezés / "Reset all".
// (nézet, kijelölés, kategória, szűrő, keresés, outfit-összeállító mezői, eltávolítottak stb.)
const BASE = { view: 'wardrobe', cat: 'All', sel: null, worn: {}, hidden: [], favs: [], oi: 0, filter: 'Összes', q: '', drops: [], dropCats: {}, made: [], deleted: [], names: {}, tags: {}, moved: {}, catNames: {}, editOpen: false, editName: '', editTags: [], editCat: '', added: [], fresh: false, bName: '', bOcc: '', bSeason: '', bPicks: {}, bSlot: '', exportState: 'idle', savedCount: 0, addedCats: [], newCat: '', lastGone: '', pairOpen: false, paired: false, phoneCount: 0, purged: [],
  // Telefonos párosítás (QR-kódos fotóküldés) – a backend session állapota tükröződik ide
  pairToken: '', qrSvgUrl: '', pairPhoneUrl: '', pairExpiresAt: 0, pairError: '', phonePhotos: {} };

// ==========================================================================
// FŐ KOMPONENS
// ==========================================================================
class Component extends DCLogic {
  // Állapot: a BASE + belépési űrlapok (login / regisztráció), profil és emlékeztető-kapcsolók
  state = { ...BASE, view: 'home', who: null, auth: null, lEmail: '', lPw: '', lShow: false, lErr: '', resetSent: '', suName: '', suEmail: '', suPw: '', suShow: false, suGender: '', suErr: '', sName: 'A neved', sEmail: 'te@email.com', rWeekly: true, rDaily: false, rIdle: true,
    // Valódi időjárás (server/index.js /api/weather); amíg nem érkezik meg, null
    weather: null };

  // "7 hónapja nem viselted" szövegből hónapok száma (a rendezéshez)
  monthsOf = (note) => {
    const m = /(\d+)\s*(hónap|év)/.exec(note || '');
    return m ? parseInt(m[1], 10) * (m[2] === 'év' ? 12 : 1) : 0;
  };

  // Ruhadarab kijelölése a szekrény nézetben (a jobb oldali panel ezt mutatja)
  select = (label, cat, note) => () => this.setState({ view: 'wardrobe', editOpen: false, sel: { label, cat, note: note || '' } });

  // ==========================================================================
  // TELEFONOS PÁROSÍTÁS (QR-kódos fotóküldés)
  // ==========================================================================
  // A tényleges munkamenetet és a fotókat a helyi backend (server/index.js)
  // kezeli; itt csak a kapcsolatot tartjuk és a beérkező fotókat vesszük át
  // a meglévő "drops" paklibe, amit az Add képernyő már úgyis feldolgoz.

  // Élő WebSocket-kapcsolat a backendhez – NEM állapot, mert nem szerializálható,
  // és nem szabad, hogy egy renderVals()-hívás újra létrehozza.
  _ws = null;

  componentDidMount() {
    this.fetchWeather();
  }

  componentWillUnmount() {
    this.closeWs();
    if (this._pairTick) clearInterval(this._pairTick);
  }

  // ==========================================================================
  // IDŐJÁRÁS (a "Mára ajánlott" outfit-javaslathoz)
  // ==========================================================================
  // Megpróbáljuk a böngésző helymeghatározását (röviden, ha nem válaszol vagy
  // nincs rá engedély, egyszerűen továbblépünk); a tényleges lekérdezést és a
  // WMO-kód -> szöveg fordítást a backend végzi (server/index.js /api/weather),
  // Budapestre esve vissza, ha nincs koordinátánk.
  fetchWeather = async () => {
    const getPosition = () => new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      const timer = setTimeout(() => resolve(null), 4000);
      navigator.geolocation.getCurrentPosition(
        (pos) => { clearTimeout(timer); resolve(pos.coords); },
        () => { clearTimeout(timer); resolve(null); },
        { timeout: 4000, maximumAge: 10 * 60 * 1000 },
      );
    });
    const coords = await getPosition();
    const qs = coords ? ('?lat=' + coords.latitude + '&lon=' + coords.longitude) : '';
    try {
      const r = await fetch('/api/weather' + qs);
      if (!r.ok) return;
      const data = await r.json();
      if (data.ok) this.setState({ weather: data });
    } catch { /* nincs internet vagy nem fut a backend – a felület enélkül is működik */ }
  };

  closeWs = () => {
    if (this._ws) {
      try { this._ws.onmessage = null; this._ws.onclose = null; this._ws.close(); } catch { /* mindegy, úgyis eldobjuk */ }
      this._ws = null;
    }
  };

  // Új párosítási munkamenet indítása a backenden: token + QR-kép + élő kapcsolat.
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
    const ws = new WebSocket(proto + '://' + location.host + '/api/pair/' + token + '/socket');
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
    ws.onclose = () => { if (this._ws === ws) this._ws = null; };
    this._ws = ws;
  };

  // Egy telefonról beérkezett fotó betolása a meglévő "drops" paklibe.
  receivePhonePhoto = (p) => {
    const s = this.state;
    const file = 'phone-' + p.id;
    if (s.drops.includes(file)) return; // pl. a "hello" újraküldené, amit már láttunk
    this.setState({
      drops: [...s.drops, file],
      phonePhotos: { ...s.phonePhotos, [file]: p.url },
      paired: true,
      phoneCount: (s.phoneCount || 0) + 1,
    });
  };

  disconnectPhone = () => {
    if (this.state.pairToken) fetch('/api/pair/' + this.state.pairToken + '/end', { method: 'POST' }).catch(() => {});
    this.closeWs();
    if (this._pairTick) { clearInterval(this._pairTick); this._pairTick = null; }
    this.setState({ paired: false, pairToken: '', qrSvgUrl: '', pairPhoneUrl: '', pairError: '', phoneCount: 0 });
  };

  // A sablon (.dc.html) összes változóját itt állítjuk elő az állapotból
  renderVals() {
    const s = this.state;
    // --- Profil és kategória-készlet (Férfi / Női) ---
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
    const flags = this.props.showUnwornFlags ?? true;

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
        noteFg: isWorn ? '#6B5940' : (flags && x.note ? '#8A5A22' : '#6B5940'),
        border: s.sel && s.sel.label === x.label ? '2px solid #57462F' : '2px solid transparent',
        on: this.select(x.label, x.cat, x.note),
      };
    });
    if (s.filter === 'Rég nem viselt') pieces = pieces.filter((p) => p.note && !s.worn[p.key]);
    if (s.filter === 'Nemrég viselt') pieces = pieces.filter((p) => s.worn[p.key]);
    if (query) pieces = pieces.filter((p) => p.label.toLowerCase().indexOf(query) > -1);

    // --- Outfitek: saját + előre elkészített, a törölt nélkül; cur = a kiválasztott ---
    const list = [...s.made, ...(fresh ? [] : OUTFITS[who])].filter((o) => !s.deleted.includes(o.name));
    const cur = list[Math.min(s.oi, list.length - 1)] || OUTFITS[who][0];
    // "Mára ajánlott": az aktuális időjárás évszak-kategóriájához illő outfitek előrébb kerülnek
    // (pontos találat < "Bármilyen évszak" < nem illő), a sorrend stabil marad, ha nincs még időjárás-adat.
    const weatherSeason = s.weather ? s.weather.season : null;
    const seasonMatchScore = (o) => (!weatherSeason ? 0 : o.season === weatherSeason ? 0 : (o.season === 'Bármilyen évszak' ? 1 : 2));
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
      { key: 'bottom', role: 'Alsó', cat: who === 'Female' ? 'Aljak' : 'Nadrágok', empty: 'Válassz alsót' },
      { key: 'shoes', role: 'Cipő', cat: 'Cipők', empty: 'Válassz cipőt' },
      { key: 'extra', role: 'Extra', cat: 'Kiegészítők', empty: 'Opcionális' },
    ].concat((s.bMore || []).map((k, i) => ({ key: k, role: 'Extra ' + (i + 2), cat: '*', empty: 'Válassz bármilyen darabot', removable: true })));
    const slotItems = (sl) => (sl.cat === '*' ? allItems : inCat(sl.cat));
    const slot = bSlots.find((x) => x.key === s.bSlot);
    const bReady = s.bPicks.top && s.bPicks.bottom && s.bPicks.shoes;

    // Segédfüggvények a sablon elemeihez: oldalsáv-gomb (nav), kategória-sor (catRow), szűrő-chip (chipOf)
    const nav = (text, view) => ({
      label: text,
      bg: s.view === view ? '#6E5B41' : 'transparent',
      fg: s.view === view ? '#F6F1E7' : '#D8C9AE',
      on: () => this.setState({ view, editOpen: false, sel: view === 'wardrobe' ? s.sel : null }),
    });
    const catRow = (text, key, count) => ({
      label: text, count: String(count),
      bg: s.cat === key && s.view === 'wardrobe' ? '#6E5B41' : 'transparent',
      fg: s.cat === key && s.view === 'wardrobe' ? '#F6F1E7' : '#D8C9AE',
      countFg: s.cat === key && s.view === 'wardrobe' ? '#E4D9C6' : '#C9B99E',
      on: () => this.setState({ view: 'wardrobe', cat: key, filter: 'Összes', editOpen: false }),
    });
    const chipOf = (text, key, active) => ({
      label: text,
      bg: active ? '#57462F' : '#F6F1E7',
      fg: active ? '#F6F1E7' : '#6B5940',
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
        bg: on ? '#57462F' : '#F6F1E7',
        border: on ? '1.5px solid #57462F' : '1px solid rgba(87,70,47,.18)',
        fg: on ? '#F6F1E7' : '#57462F',
        sub: on ? '#E4D9C6' : '#6B5940',
        on: () => this.setState({ suGender: g, suErr: '' }),
      };
    };

    // --- Telefonos párosítás: visszaszámláló szöveg és állapotjelző szín ---
    const qrReady = !!s.qrSvgUrl && !s.pairError;
    const pairMinutesLeft = s.pairExpiresAt ? Math.max(0, Math.ceil((s.pairExpiresAt - Date.now()) / 60000)) : 0;
    const pairStatusLine = s.pairError
      ? s.pairError
      : (qrReady ? 'Várakozás a telefonodra · a kód ' + pairMinutesLeft + ' perc múlva lejár' : 'A kód elkészítése…');

    // ======================================================================
    // A sablonnak visszaadott értékek, témakörönként
    // ======================================================================
    return {
      // ===== Bejelentkezés / regisztráció =====
      isAuth: authMode === 'login' || authMode === 'signup',
      isLogin: authMode === 'login',
      isSignup: authMode === 'signup',
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
        this.setState({ ...BASE, auth: 'app', view: 'home', fresh: true, sEmail: s.lEmail.trim(), lPw: '', lErr: '', resetSent: '' });
      },
      appleLogin: () => this.setState({ ...BASE, auth: 'app', view: 'home', fresh: true, lErr: '', resetSent: '' }),
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
      suCtaBg: s.suGender ? '#57462F' : '#D8D1C1',
      suCtaFg: s.suGender ? '#F6F1E7' : '#6B5940',
      doSignup: () => {
        if (!s.suName.trim()) return this.setState({ suErr: 'Add meg a neved.' });
        if (!validEmail(s.suEmail)) return this.setState({ suErr: 'Ez az e-mail cím nem tűnik helyesnek.' });
        if (s.suPw.length < 8) return this.setState({ suErr: 'A jelszónak legalább 8 karakteresnek kell lennie.' });
        if (!s.suGender) return this.setState({ suErr: 'Válaszd a Férfit vagy a Nőt a folytatáshoz.' });
        this.setState({
          ...BASE, view: 'home', auth: 'app', fresh: true,
          who: s.suGender, sName: s.suName.trim(), sEmail: s.suEmail.trim(),
          suPw: '', suErr: '',
        });
      },
      logOut: () => this.setState({ auth: 'login', lEmail: s.sEmail, lPw: '', lErr: '', resetSent: '', sel: null, editOpen: false }),

      // ===== Nézetek és navigáció (melyik képernyő látszik) =====
      isWardrobe: s.view === 'wardrobe',
      isOutfits: s.view === 'outfits',
      isOutfitsFilled: s.view === 'outfits' && list.length > 0,
      outfitsEmpty: s.view === 'outfits' && list.length === 0,
      outfitsEmptyLine: total ? 'Válassz egy felsőt, egy alsót és cipőt a hozzáadott ruháid közül, majd nevezd el.' : 'Először adj hozzá pár darabot a szekrényedhez. Utána itt tudod összeállítani az első outfitedet.',
      outfitsEmptyCta: total ? 'Első outfit összeállítása' : 'Fotók hozzáadása',
      outfitsEmptyGo: total
        ? () => this.setState({ view: 'builder', sel: null, bName: '', bOcc: '', bSeason: '', bPicks: {}, bMore: [], bSlot: 'top' })
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
      navItems: [nav('Outfitek', 'outfits'), nav('Kihasználatlan', 'untouched'), nav('Eltávolított', 'removed'), nav('Beállítások', 'settings')],
      // ===== Eltávolított ruhák (30 napig várnak a végleges törlésig) =====
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
      // ===== Telefon párosítása =====
      pairOpen: !!s.pairOpen,
      // Ha már fut egy párosítás, csak újra megnyitjuk a panelt (nem kérünk új kódot);
      // különben most indítjuk el a backenden a munkamenetet.
      openPair: () => (s.pairToken && !s.pairError ? this.setState({ pairOpen: true }) : this.startPair()),
      closePair: () => this.setState({ pairOpen: false }),
      qrSvgUrl: s.qrSvgUrl,
      qrReady,
      qrFallbackDisplay: qrReady ? 'none' : 'flex',
      qrImgDisplay: qrReady ? 'block' : 'none',
      pairStatusLine,
      pairDotColor: s.pairError ? '#B8433A' : (qrReady ? '#7A9A52' : '#B8A78A'),
      pairPhoneUrl: s.pairPhoneUrl,
      pairUrlDisplay: s.pairPhoneUrl && !s.pairError ? 'block' : 'none',
      retryPair: () => this.startPair(),
      pairErrorDisplay: s.pairError ? 'block' : 'none',
      // ===== Kezdőlap: javaslatok és kategória-csempék =====
      isHome: s.view === 'home',
      homeTotal: total + ' darab, ' + rawAll.length + ' kategóriában',
      viewAll: () => this.setState({ view: 'wardrobe', cat: 'All', filter: 'Összes', q: '', sel: null, editOpen: false }),
      weatherTemp: s.weather ? Math.round(s.weather.tempC) + '°' : '—°',
      weatherLine: s.weather
        ? s.weather.description + ' · ' + Math.round(s.weather.eveningC) + '° este'
        : 'Időjárás betöltése…',
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
          bg: ['#CFCBC1', '#C6C2B8', '#D2CEC4', '#CBC7BD', '#D6D2C8'][i % 5],
          span: i === 0 ? 'span 2' : 'span 1',
          on: () => this.setState({ view: 'wardrobe', cat: n, filter: 'Összes', q: '', sel: null, editOpen: false }),
        };
      }),
      // Oldalsáv: kategóriák listája darabszámmal
      catNav: [catRow('Összes', 'All', total)].concat(rawAll.map((n) => catRow(label(n), n, inCat(n).length))),
      accountName: s.sName || 'A szekrényed',
      profileLine: whoLabel + ' · ' + total + ' darab',
      toHome: () => this.setState({ view: 'home', cat: 'All', filter: 'Összes', q: '', sel: null, editOpen: false }),
      toAdd: () => this.setState({ view: 'add', sel: null, editOpen: false }),
      toSettings: () => this.setState({ view: 'settings', sel: null, editOpen: false }),
      toUntouched: () => this.setState({ view: 'untouched', sel: null, editOpen: false }),

      // ===== Szekrény: fejléc, keresés, szűrők, ruha-rács =====
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

      // ===== Outfitek: kiválasztott outfit, kedvencek, viselés =====
      outfit: cur,
      outfitTiles: (cur.items || [cur.top, cur.bottom, cur.shoes, cur.extra]).filter((x) => x && x !== 'nincs extra').map((x, i) => ({ label: x, bg: ['#DCD8CE', '#D4D0C6', '#D8D4CA', '#CDC9BF'][i % 4] })),
      outfitCols: (cur.items || []).length > 4 ? 3 : 2,
      outfitMeta: cur.occasion + ' · ' + cur.season + ' · ' + cur.worn,
      outfitCount: list.length + ' mentve',
      favMark: s.favs.includes(cur.name) ? '★' : '☆',
      favLabel: s.favs.includes(cur.name) ? 'Kedvenc' : 'Hozzáadás a kedvencekhez',
      favBg: s.favs.includes(cur.name) ? '#DCD8CE' : '#F6F1E7',
      toggleFav: () => {
        const on = s.favs.includes(cur.name);
        this.setState({ favs: on ? s.favs.filter((k) => k !== cur.name) : [...s.favs, cur.name] });
      },
      deleteOutfit: () => this.setState({
        deleted: [...s.deleted, cur.name],
        made: s.made.filter((o) => o.name !== cur.name),
        favs: s.favs.filter((k) => k !== cur.name),
        oi: 0,
      }),
      outfitWearLabel: s.worn[cur.name] ? 'Mára naplózva' : 'Viselem ma',
      outfitWearBg: s.worn[cur.name] ? '#DCD8CE' : '#57462F',
      outfitWearFg: s.worn[cur.name] ? '#57462F' : '#F6F1E7',
      wearOutfit: () => this.setState({ worn: { ...s.worn, [cur.name]: true } }),
      outfitList: list.map((o, n) => ({
        name: o.name, sub: o.occasion + ' · ' + o.season,
        bg: o.name === cur.name ? '#DCD8CE' : '#EBE2D2',
        border: o.name === cur.name ? '1.5px solid #57462F' : '1px solid transparent',
        mark: s.favs.includes(o.name) ? '★' : '☆',
        markFg: s.favs.includes(o.name) ? '#57462F' : '#8A7A62',
        markBg: s.favs.includes(o.name) ? '#F6F1E7' : 'transparent',
        on: () => this.setState({ view: 'outfits', oi: n, sel: null }),
        star: () => {
          const on = s.favs.includes(o.name);
          this.setState({ favs: on ? s.favs.filter((k) => k !== o.name) : [...s.favs, o.name] });
        },
      })),

      // ===== Outfit-összeállító =====
      toBuilder: () => this.setState({ view: 'builder', sel: null, bName: '', bOcc: '', bSeason: '', bPicks: {}, bMore: [], bSlot: 'top' }),
      cancelBuilder: () => this.setState({ view: 'outfits', bSlot: '' }),
      bName: s.bName,
      onBName: (e) => this.setState({ bName: e.target.value }),
      bNamePlaceholder: (s.bOcc || 'Új') + ' outfit',
      bSlots: bSlots.map((x) => ({
        role: x.role,
        label: s.bPicks[x.key] ? nameOf(s.bPicks[x.key]) : x.empty,
        bg: s.bPicks[x.key] ? '#DCD8CE' : '#F6F1E7',
        border: s.bSlot === x.key ? '2px solid #57462F' : (s.bPicks[x.key] ? '2px solid rgba(87,70,47,.35)' : '1.5px dashed rgba(87,70,47,.35)'),
        on: () => this.setState({ bSlot: x.key }),
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
      bCtaBg: bReady ? '#57462F' : '#D8D1C1',
      bCtaFg: bReady ? '#F6F1E7' : '#6B5940',
      saveOutfit: () => {
        if (!bReady) return;
        const p = s.bPicks;
        const parts = bSlots.map((x) => p[x.key]).filter(Boolean).map(nameOf);
        this.setState({
          made: [{
            name: s.bName.trim() || (s.bOcc || 'Új') + ' outfit',
            occasion: s.bOcc || 'Bármilyen alkalom',
            season: s.bSeason || 'Bármilyen évszak',
            top: nameOf(p.top), bottom: nameOf(p.bottom), shoes: nameOf(p.shoes), extra: p.extra ? nameOf(p.extra) : 'nincs extra',
            pieces: parts.join(' · '),
            items: parts,
            worn: 'új, még nem viselt',
          }, ...s.made],
          view: 'outfits', oi: 0, bSlot: '', bPicks: {}, bMore: [], bName: '', bOcc: '', bSeason: '',
        });
      },
      // Jobb panel: ruhaválasztó az összeállítóhoz
      railPicker: s.view === 'builder',
      pickerIdle: !slot,
      pickerTitle: slot ? (slot.cat === '*' ? 'Bármilyen darab' : label(slot.cat)) : 'Darabok',
      pickerCount: slot ? slotItems(slot).length + ' db' : '',
      pickerItems: slot
        ? slotItems(slot).map((x) => ({
            label: nameOf(x.label),
            border: s.bPicks[slot.key] === x.label ? '2px solid #57462F' : '2px solid transparent',
            on: () => this.setState({ bPicks: { ...s.bPicks, [slot.key]: x.label } }),
          }))
        : [],

      // ===== Kihasználatlan ruhák ("Untouched") =====
      idleLine: idleAll.length ? idleAll.length + ' darab, a legrégebbi elöl' : 'Nincs kihasználatlan darab',
      idleEmpty: idleAll.length === 0,
      idleItems: idleAll.map((x) => ({
        label: nameOf(x.label), cat: label(x.cat), note: x.note,
        open: this.select(x.label, x.cat, x.note),
        wear: () => this.setState({ worn: { ...s.worn, [x.label]: true } }),
        remove: () => this.setState({ hidden: [...gone, x.label], sel: null, lastGone: x.label }),
      })),
      undoVisible: !!s.lastGone && gone.indexOf(s.lastGone) > -1,
      undoLine: nameOf(s.lastGone || '') + ' áthelyezve az Eltávolítottak közé',
      undoGone: () => this.setState({ hidden: gone.filter((x) => x !== s.lastGone), lastGone: '' }),
      dismissUndo: () => this.setState({ lastGone: '' }),

      // ===== Beállítások: profil, kategóriák szerkesztése, emlékeztetők, export =====
      sName: s.sName,
      sEmail: s.sEmail,
      onSName: (e) => this.setState({ sName: e.target.value }),
      onSEmail: (e) => this.setState({ sEmail: e.target.value }),
      // A belső "who" state Male/Female marad, csak a felirat magyar (Férfi/Nő).
      profileTabs: [['Male', 'Férfi'], ['Female', 'Nő']].map(([p, disp]) => ({
        label: disp,
        bg: who === p ? '#57462F' : '#EBE2D2',
        fg: who === p ? '#F6F1E7' : '#57462F',
        on: () => this.setState({ who: p, cat: 'All', sel: null, oi: 0, favs: [], made: [], deleted: [], bPicks: {} }),
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
      addCatBg: (s.newCat || '').trim() ? '#57462F' : '#D8D1C1',
      addCatFg: (s.newCat || '').trim() ? '#F6F1E7' : '#6B5940',
      addCategory: () => {
        const v = (s.newCat || '').trim();
        if (!v || rawAll.indexOf(v) > -1) return;
        this.setState({ addedCats: [...(s.addedCats || []), v], newCat: '' });
      },
      // Emlékeztető-kapcsolók
      reminders: [
        { label: 'Heti áttekintés', hint: 'Vasárnap, 19:00', bg: s.rWeekly ? '#57462F' : '#D8D1C1', knob: s.rWeekly ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rWeekly: !s.rWeekly }) },
        { label: 'Naplózd, mit viseltél', hint: 'Naponta, 21:00', bg: s.rDaily ? '#57462F' : '#D8D1C1', knob: s.rDaily ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rDaily: !s.rDaily }) },
        { label: 'Kihasználatlan darabok', hint: 'Ha valami elér 6 hónapot', bg: s.rIdle ? '#57462F' : '#D8D1C1', knob: s.rIdle ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rIdle: !s.rIdle }) },
      ],
      // Adatok exportálása (letöltés-szimuláció)
      exportLabel: s.exportState === 'working' ? 'Előkészítés…' : (s.exportState === 'done' ? 'Újra letöltöm' : 'Letöltés'),
      exportBg: s.exportState === 'working' ? '#D8D1C1' : '#57462F',
      exportFg: s.exportState === 'working' ? '#6B5940' : '#F6F1E7',
      exportHint: s.exportState === 'done'
        ? 'Elmentve a letöltések közé · 148 MB'
        : 'Ruhalista, fotók és outfitek · 148 MB',
      startExport: () => {
        if (s.exportState === 'working') return;
        this.setState({ exportState: 'working' });
        setTimeout(() => this.setState({ exportState: 'done' }), 900);
      },
      resetAll: () => this.setState({ ...BASE }),

      // ===== Ruha hozzáadása: fotók feldolgozása és kategóriába sorolás =====
      addLine: s.drops.length ? assigned + ' / ' + s.drops.length + ' besorolva' : 'A hátteret automatikusan eltávolítjuk, utána te sorolod be',
      noDrops: s.drops.length === 0,
      hasDrops: s.drops.length > 0,
      simulateDrop: () => this.setState({ drops: DROP_FILES.slice(), dropCats: {} }),
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
          bg: s.dropCats[file] === n ? '#57462F' : '#EBE2D2',
          fg: s.dropCats[file] === n ? '#F6F1E7' : '#57462F',
          on: () => this.setState({ dropCats: { ...s.dropCats, [file]: n } }),
        })),
      })),
      saveLabel: dropsReady ? 'Mentés (' + s.drops.length + ' darab)' : 'Adj kategóriát minden fotóhoz',
      saveBg: dropsReady ? '#57462F' : '#D8D1C1',
      saveFg: dropsReady ? '#F6F1E7' : '#6B5940',
      saveDrops: () => {
        if (!dropsReady) return;
        const base = (s.added || []).length;
        const added = s.drops.map((f, i) => ({ label: ((s.dropNames || {})[f] || '').trim() || 'darab ' + (base + i + 1), cat: s.dropCats[f] }));
        this.setState({ dropNames: {}, view: 'home', added: [...(s.added || []), ...added], savedCount: s.savedCount + s.drops.length, drops: [], dropCats: {} });
      },
      clearDrops: () => this.setState({ drops: [], dropCats: {}, dropNames: {} }),

      // ===== Jobb oldali panel: melyik tartalom látszik (ruha, szerkesztés, outfitek, stb.) =====
      railItem: !!s.sel && s.view === 'wardrobe' && !s.editOpen,
      railEdit: !!s.sel && s.view === 'wardrobe' && s.editOpen,
      railOutfits: s.view === 'outfits',
      railSummary: s.view === 'wardrobe' && !s.sel,
      railHome: s.view === 'home',
      railUntouched: s.view === 'untouched',
      railAdd: s.view === 'add',
      railRemoved: s.view === 'removed',
      railDisplay: s.view === 'settings' ? 'none' : 'flex',
      gridCols: s.view === 'settings' ? '216px minmax(0,1fr)' : '216px minmax(0,1fr) 336px',
      dealtLine: dealt + ' / ' + idleBase.length + ' elintézve',
      dealtPct: (idleBase.length ? Math.round((dealt / idleBase.length) * 100) : 100) + '%',
      hasOldest: idleAll.length > 0,
      oldestLabel: idleAll[0] ? nameOf(idleAll[0].label) : '',
      oldestSub: idleAll[0] ? label(idleAll[0].cat) + ' · ' + idleAll[0].note : '',
      openOldest: () => { if (idleAll[0]) this.select(idleAll[0].label, idleAll[0].cat, idleAll[0].note)(); },
      // Telefon állapota és a feldolgozandó fotók sora
      phoneDot: s.paired ? '#7A9A52' : '#B8A78A',
      phoneLine: s.paired ? 'Telefon csatlakoztatva' : 'Nincs telefon csatlakoztatva',
      phoneSub: s.paired ? s.phoneCount + ' fotó érkezett ebben a munkamenetben' : 'Olvass be egy kódot, hogy fotókat küldhess a telefonodról',
      phoneBtnLabel: s.paired ? 'Lecsatlakozás' : 'Telefon csatlakoztatása',
      phoneBtnBg: s.paired ? '#EBE2D2' : '#57462F',
      phoneBtnFg: s.paired ? '#57462F' : '#F6F1E7',
      // Ha már párosítva van, lekapcsol; ha csak nyitva van a párosítás panelje, azt hozza vissza;
      // különben új kódot kér a backendtől.
      phoneAction: () => {
        if (s.paired) return this.disconnectPhone();
        if (s.pairToken && !s.pairError) return this.setState({ pairOpen: true });
        return this.startPair();
      },
      // A fotók automatikusan, a telefonos feltöltéssel egy időben érkeznek –
      // ez a gomb csak bezárja a panelt, és átvált az Add képernyőre.
      finishPair: () => this.setState({ pairOpen: false, view: 'add' }),
      queueLine: s.drops.length ? assignedQ + ' / ' + s.drops.length + ' besorolva' : 'Üres',
      queueEmpty: s.drops.length === 0,
      queueRows: s.drops.map((f) => ({
        file: f,
        status: s.dropCats[f] ? 'Besorolva ide: ' + label(s.dropCats[f]) : 'Kategóriát vár',
        fg: s.dropCats[f] ? '#6B5940' : '#8A5A22',
      })),
      removedCount: gone.length === 1 ? '1 darab vár' : gone.length + ' darab vár',
      removedHas: gone.length > 0,
      deleteAllNow: () => this.setState({ purged: [...(s.purged || []), ...gone], hidden: [], lastGone: '' }),
      // Kijelölt ruhadarab adatai (név, kategória, viselési statisztika)
      selLabel: nameOf(selKey),
      selCat: label(s.sel ? (s.moved[selKey] || s.sel.cat) : ''),
      selWorn: selIsWorn
        ? 'Ma viselted · összesen ' + (baseWears + 1) + '-szer'
        : (selNote
            // selNote pl. "7 hónapja nem viselted" -> "Utoljára 7 hónapja viselted"
            ? 'Utoljára ' + selNote.replace(/ nem viselted$/, '') + ' viselted · összesen ' + baseWears + '-szer'
            : 'Utoljára 3 hete viselted · összesen ' + baseWears + '-szer'),
      selWearLabel: selIsWorn ? 'Mára naplózva' : 'Viselem ma',
      selWearBg: selIsWorn ? '#DCD8CE' : '#57462F',
      selWearFg: selIsWorn ? '#57462F' : '#F6F1E7',
      wearSel: () => { if (selKey) this.setState({ worn: { ...s.worn, [selKey]: true } }); },
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
        bg: s.editCat === n ? '#57462F' : '#EBE2D2',
        fg: s.editCat === n ? '#F6F1E7' : '#57462F',
        on: () => this.setState({ editCat: n }),
      })),
      editTagOptions: TAG_OPTIONS.map((t) => {
        const on = s.editTags.indexOf(t) > -1;
        return {
          label: t,
          bg: on ? '#57462F' : '#EBE2D2',
          fg: on ? '#F6F1E7' : '#57462F',
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

      // ===== Összegző panel: statisztikák és legtöbbet viselt ruhák =====
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
      // Csak akkor mutatunk mintaadatot, ha tényleg van a szekrényben ruha –
      // korábban ez a 3 kitalált darab üres/friss szekrénynél is megjelent.
      hasMostWorn: total > 0,
      mostWorn: total === 0 ? [] : (who === 'Female'
        ? [{ label: 'fehér sportcipő', cat: 'Cipők', n: '31 alkalom' }, { label: 'kék farmer', cat: 'Aljak', n: '28 alkalom' }, { label: 'csíkos póló', cat: 'Felsők', n: '22 alkalom' }]
        : [{ label: 'fehér sneaker', cat: 'Cipők', n: '31 alkalom' }, { label: 'kék farmer', cat: 'Nadrágok', n: '28 alkalom' }, { label: 'szürke póló', cat: 'Pólók', n: '22 alkalom' }]
      ).map((m) => ({ label: nameOf(m.label), n: m.n, on: this.select(m.label, m.cat, '') })),
    };
  }
}

return Component;
};
