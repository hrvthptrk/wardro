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
  'T-shirts': { items: ['grey tee', 'white tee', 'navy tee', 'striped tee', 'black tee', 'linen tee', 'olive tee', 'rust tee'], notes: { 3: 'not worn in 7 months', 6: 'not worn in 4 months' } },
  'Shoes': { items: ['white sneakers', 'suede boots', 'runners', 'loafers', 'sandals', 'chelsea boots'], notes: { 3: 'not worn in 6 months' } },
  'Jackets': { items: ['olive bomber', 'denim jacket', 'wool coat', 'rain shell', 'blazer', 'gilet'], notes: { 4: 'not worn in 1 year' } },
  'Accessories': { items: ['leather watch', 'brown belt', 'sunglasses', 'wallet', 'beanie', 'tote bag'], notes: {} },
  'Trousers': { items: ['blue jeans', 'grey joggers', 'chinos', 'black jeans', 'cords', 'shorts'], notes: { 4: 'not worn in 9 months' } },
};

// Női kategóriák (ugyanaz a szerkezet, mint a férfiaknál)
const FEMALE = {
  'Tops': { items: ['white blouse', 'silk cami', 'striped tee', 'knit jumper', 'cropped tee', 'linen shirt', 'black turtleneck', 'cardigan'], notes: { 3: 'not worn in 7 months', 6: 'not worn in 4 months' } },
  'Shoes': { items: ['white trainers', 'ankle boots', 'ballet flats', 'block heels', 'sandals', 'loafers'], notes: { 3: 'not worn in 6 months' } },
  'Dresses': { items: ['black slip dress', 'floral midi', 'linen sundress', 'knit dress', 'wrap dress', 'shirt dress'], notes: { 4: 'not worn in 1 year' } },
  'Accessories': { items: ['gold hoops', 'silk scarf', 'tote bag', 'leather belt', 'sunglasses', 'beret'], notes: {} },
  'Bottoms': { items: ['blue jeans', 'pleated skirt', 'wide trousers', 'denim skirt', 'leggings', 'tailored shorts'], notes: { 4: 'not worn in 9 months' } },
};

// Előre elkészített outfitek nemenként (alkalom, évszak, ruhadarabok, viselési infó)
const OUTFITS = {
  Male: [
    { name: 'Monday office', occasion: 'Work', season: 'Cold', top: 'linen shirt', bottom: 'chinos', shoes: 'loafers', extra: 'brown belt', pieces: 'Linen shirt · Chinos · Loafers · Brown belt', worn: 'worn 6×, last Monday' },
    { name: 'Saturday walk', occasion: 'Weekend', season: 'Mild', top: 'grey tee', bottom: 'blue jeans', shoes: 'white sneakers', extra: 'leather watch', pieces: 'Grey tee · Blue jeans · White sneakers · Watch', worn: 'worn 11×, last Saturday' },
    { name: 'Dinner out', occasion: 'Going out', season: 'Cold', top: 'black tee', bottom: 'black jeans', shoes: 'chelsea boots', extra: 'wool coat', pieces: 'Black tee · Black jeans · Chelsea boots · Coat', worn: 'worn twice, last month' },
  ],
  Female: [
    { name: 'Monday office', occasion: 'Work', season: 'Cold', top: 'white blouse', bottom: 'wide trousers', shoes: 'loafers', extra: 'leather belt', pieces: 'White blouse · Wide trousers · Loafers · Belt', worn: 'worn 6×, last Monday' },
    { name: 'Saturday walk', occasion: 'Weekend', season: 'Mild', top: 'striped tee', bottom: 'denim skirt', shoes: 'white trainers', extra: 'tote bag', pieces: 'Striped tee · Denim skirt · Trainers · Tote', worn: 'worn 11×, last Saturday' },
    { name: 'Dinner out', occasion: 'Going out', season: 'Cold', top: 'black turtleneck', bottom: 'pleated skirt', shoes: 'ankle boots', extra: 'gold hoops', pieces: 'Turtleneck · Pleated skirt · Ankle boots · Hoops', worn: 'worn twice, last month' },
  ],
};

// Minta fotófájlok a "Hozzáadás" képernyő beejtés-szimulációjához
const DROP_FILES = ['IMG_4192.HEIC', 'IMG_4193.HEIC', 'IMG_4194.HEIC', 'IMG_4195.HEIC', 'IMG_4196.HEIC', 'IMG_4197.HEIC'];

// Ruhához választható címkék (anyag, szín, évszak)
const TAG_OPTIONS = ['Cotton', 'Wool', 'Linen', 'Neutral', 'Bright', 'Cold months', 'Warm months', 'All year'];

// Alapállapot: ezt állítja vissza a bejelentkezés / "Reset all".
// (nézet, kijelölés, kategória, szűrő, keresés, outfit-összeállító mezői, eltávolítottak stb.)
const BASE = { view: 'wardrobe', cat: 'All', sel: null, worn: {}, hidden: [], favs: [], oi: 0, filter: 'All', q: '', drops: [], dropCats: {}, made: [], deleted: [], names: {}, tags: {}, moved: {}, catNames: {}, editOpen: false, editName: '', editTags: [], editCat: '', added: [], fresh: false, bName: '', bOcc: '', bSeason: '', bPicks: {}, bSlot: '', exportState: 'idle', savedCount: 0, addedCats: [], newCat: '', lastGone: '', pairOpen: false, paired: false, phoneCount: 0, purged: [] };

// ==========================================================================
// FŐ KOMPONENS
// ==========================================================================
class Component extends DCLogic {
  // Állapot: a BASE + belépési űrlapok (login / regisztráció), profil és emlékeztető-kapcsolók
  state = { ...BASE, view: 'home', who: null, auth: null, lEmail: '', lPw: '', lShow: false, lErr: '', resetSent: '', suName: '', suEmail: '', suPw: '', suShow: false, suGender: '', suErr: '', sName: 'Your name', sEmail: 'you@email.com', rWeekly: true, rDaily: false, rIdle: true };

  // "not worn in 7 months" szövegből hónapok száma (a rendezéshez)
  monthsOf = (note) => {
    const m = /(\d+)\s*(month|year)/.exec(note || '');
    return m ? parseInt(m[1], 10) * (m[2] === 'year' ? 12 : 1) : 0;
  };

  // Ruhadarab kijelölése a szekrény nézetben (a jobb oldali panel ezt mutatja)
  select = (label, cat, note) => () => this.setState({ view: 'wardrobe', editOpen: false, sel: { label, cat, note: note || '' } });

  // A sablon (.dc.html) összes változóját itt állítjuk elő az állapotból
  renderVals() {
    const s = this.state;
    // --- Profil és kategória-készlet (Férfi / Női) ---
    const who = s.who || this.props.profile || 'Male';
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

    // --- Szekrény lista: keresés és szűrők ("Not worn lately" / "Worn recently") ---
    const query = s.q.trim().toLowerCase();
    let pieces = (s.cat === 'All' ? allItems : inCat(s.cat)).map((x) => {
      const isWorn = !!s.worn[x.label];
      return {
        label: nameOf(x.label), cat: x.cat, note: x.note, key: x.label,
        sub: isWorn ? 'Worn today' : (flags && x.note ? x.note : label(x.cat)),
        noteFg: isWorn ? '#6B5940' : (flags && x.note ? '#8A5A22' : '#6B5940'),
        border: s.sel && s.sel.label === x.label ? '2px solid #57462F' : '2px solid transparent',
        on: this.select(x.label, x.cat, x.note),
      };
    });
    if (s.filter === 'Not worn lately') pieces = pieces.filter((p) => p.note && !s.worn[p.key]);
    if (s.filter === 'Worn recently') pieces = pieces.filter((p) => s.worn[p.key]);
    if (query) pieces = pieces.filter((p) => p.label.toLowerCase().indexOf(query) > -1);

    // --- Outfitek: saját + előre elkészített, a törölt nélkül; cur = a kiválasztott ---
    const list = [...s.made, ...(fresh ? [] : OUTFITS[who])].filter((o) => !s.deleted.includes(o.name));
    const cur = list[Math.min(s.oi, list.length - 1)] || OUTFITS[who][0];
    // Kijelölt ruha adatai a jobb oldali panelhez
    const selKey = s.sel ? s.sel.label : '';
    const selIsWorn = !!s.worn[selKey];
    const selNote = s.sel ? s.sel.note : '';
    const baseWears = selNote ? 3 : 14;

    // --- Outfit-összeállító helyek: felső, alsó, cipő, extra (+ tetszőleges további extrák) ---
    const bSlots = [
      { key: 'top', role: 'Top', cat: rawNames[0], empty: 'Pick a top' },
      { key: 'bottom', role: 'Bottom', cat: who === 'Female' ? 'Bottoms' : 'Trousers', empty: 'Pick a bottom' },
      { key: 'shoes', role: 'Shoes', cat: 'Shoes', empty: 'Pick shoes' },
      { key: 'extra', role: 'Extra', cat: 'Accessories', empty: 'Optional' },
    ].concat((s.bMore || []).map((k, i) => ({ key: k, role: 'Extra ' + (i + 2), cat: '*', empty: 'Pick any piece', removable: true })));
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
      on: () => this.setState({ view: 'wardrobe', cat: key, filter: 'All', editOpen: false }),
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
    // Nem választó csempe a regisztrációnál (Male / Female)
    const genderTile = (g, hint) => {
      const on = s.suGender === g;
      return {
        label: g, hint,
        bg: on ? '#57462F' : '#F6F1E7',
        border: on ? '1.5px solid #57462F' : '1px solid rgba(87,70,47,.18)',
        fg: on ? '#F6F1E7' : '#57462F',
        sub: on ? '#E4D9C6' : '#6B5940',
        on: () => this.setState({ suGender: g, suErr: '' }),
      };
    };

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
      lShowLabel: s.lShow ? 'Hide' : 'Show',
      toggleLShow: () => this.setState({ lShow: !s.lShow }),
      lErr: s.lErr,
      resetLine: s.resetSent ? 'Reset link sent to ' + s.resetSent + '. Check your inbox.' : '',
      forgot: () => {
        if (!validEmail(s.lEmail)) return this.setState({ lErr: 'Enter your email first, then tap Forgot password.', resetSent: '' });
        this.setState({ resetSent: s.lEmail.trim(), lErr: '' });
      },
      doLogin: () => {
        if (!validEmail(s.lEmail)) return this.setState({ lErr: 'Enter the email you signed up with.', resetSent: '' });
        if (!s.lPw) return this.setState({ lErr: 'Enter your password.', resetSent: '' });
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
      suShowLabel: s.suShow ? 'Hide' : 'Show',
      toggleSuShow: () => this.setState({ suShow: !s.suShow }),
      genders: [genderTile('Male', "Men's cuts and sizes"), genderTile('Female', "Women's cuts and sizes")],
      suErr: s.suErr,
      suCtaLabel: s.suGender ? 'Create account' : 'Pick one to continue',
      suCtaBg: s.suGender ? '#57462F' : '#D8D1C1',
      suCtaFg: s.suGender ? '#F6F1E7' : '#6B5940',
      doSignup: () => {
        if (!s.suName.trim()) return this.setState({ suErr: 'Add your name.' });
        if (!validEmail(s.suEmail)) return this.setState({ suErr: "That email doesn't look right." });
        if (s.suPw.length < 8) return this.setState({ suErr: 'Password needs at least 8 characters.' });
        if (!s.suGender) return this.setState({ suErr: 'Pick Male or Female to continue.' });
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
      outfitsEmptyLine: total ? 'Pick a top, a bottom and shoes from the pieces you have added, then give it a name.' : 'Add a few pieces to your wardrobe first. Then you can put your first outfit together here.',
      outfitsEmptyCta: total ? 'Build your first outfit' : 'Add photos',
      outfitsEmptyGo: total
        ? () => this.setState({ view: 'builder', sel: null, bName: '', bOcc: '', bSeason: '', bPicks: {}, bMore: [], bSlot: 'top' })
        : () => this.setState({ view: 'add', sel: null, editOpen: false }),
      homeEmpty: total === 0,
      homeFilled: total > 0,
      firstName: (s.sName && s.sName !== 'Your name' ? s.sName : '').split(' ')[0] || 'there',
      firstSteps: [
        { n: '01', title: 'Photograph', line: 'One piece per photo, laid flat or on a hanger.' },
        { n: '02', title: 'Sort', line: 'Drop each photo into a category like ' + label(rawNames[0]) + ' or Shoes.' },
        { n: '03', title: 'Build', line: 'Put pieces together into outfits and log what you wear.' },
      ],
      noSuggestions: list.length === 0,
      isBuilder: s.view === 'builder',
      isUntouched: s.view === 'untouched',
      isSettings: s.view === 'settings',
      isAdd: s.view === 'add',
      navItems: [nav('Outfits', 'outfits'), nav('Untouched', 'untouched'), nav('Removed', 'removed'), nav('Settings', 'settings')],
      // ===== Eltávolított ruhák (30 napig várnak a végleges törlésig) =====
      isRemoved: s.view === 'removed',
      toRemoved: () => this.setState({ view: 'removed', sel: null, editOpen: false }),
      removedLine: gone.length
        ? gone.length + ' waiting · deleted after 30 days'
        : 'Nothing removed yet',
      removedEmpty: gone.length === 0,
      removedList: gone.map((label2) => ({
        label: nameOf(label2),
        hint: 'Removed today · 30 days left',
        restore: () => this.setState({ hidden: gone.filter((x) => x !== label2) }),
      })),
      purgeAll: () => this.setState({ hidden: [] }),
      // ===== Telefon párosítása =====
      pairOpen: !!s.pairOpen,
      openPair: () => this.setState({ pairOpen: true }),
      closePair: () => this.setState({ pairOpen: false }),
      // ===== Kezdőlap: javaslatok és kategória-csempék =====
      isHome: s.view === 'home',
      homeTotal: total + ' pieces across ' + rawAll.length + ' categories',
      viewAll: () => this.setState({ view: 'wardrobe', cat: 'All', filter: 'All', q: '', sel: null, editOpen: false }),
      weatherTemp: '14°',
      weatherLine: 'Light rain later · 9° tonight',
      suggestions: list.slice(0, 3).map((o, n) => ({
        name: o.name,
        sub: o.pieces,
        on: () => this.setState({ view: 'outfits', oi: n, sel: null, editOpen: false }),
      })),
      homeTiles: rawAll.map((n, i) => {
        const items = inCat(n);
        const idle = items.filter((x) => x.note && !s.worn[x.label]).length;
        return {
          name: label(n),
          count: items.length + ' pieces',
          idle: fresh ? (items.length ? 'just added' : 'empty') : (idle ? idle + ' untouched' : 'all worn recently'),
          bg: ['#CFCBC1', '#C6C2B8', '#D2CEC4', '#CBC7BD', '#D6D2C8'][i % 5],
          span: i === 0 ? 'span 2' : 'span 1',
          on: () => this.setState({ view: 'wardrobe', cat: n, filter: 'All', q: '', sel: null, editOpen: false }),
        };
      }),
      // Oldalsáv: kategóriák listája darabszámmal
      catNav: [catRow('All', 'All', total)].concat(rawAll.map((n) => catRow(label(n), n, inCat(n).length))),
      accountName: s.sName || 'Your wardrobe',
      profileLine: who + ' · ' + total + ' pieces',
      toHome: () => this.setState({ view: 'home', cat: 'All', filter: 'All', q: '', sel: null, editOpen: false }),
      toAdd: () => this.setState({ view: 'add', sel: null, editOpen: false }),
      toSettings: () => this.setState({ view: 'settings', sel: null, editOpen: false }),
      toUntouched: () => this.setState({ view: 'untouched', sel: null, editOpen: false }),

      // ===== Szekrény: fejléc, keresés, szűrők, ruha-rács =====
      headTitle: s.cat === 'All' ? 'Everything' : label(s.cat),
      headCount: pieces.length === total ? total + ' pieces' : pieces.length + ' of ' + total + ' pieces shown',
      q: s.q,
      hasQuery: s.q.length > 0,
      onQuery: (e) => this.setState({ q: e.target.value }),
      clearQuery: () => this.setState({ q: '' }),
      filters: [
        chipOf('All', 'filter', s.filter === 'All'),
        chipOf('Not worn lately', 'filter', s.filter === 'Not worn lately'),
        chipOf('Worn recently', 'filter', s.filter === 'Worn recently'),
      ],
      pieces,
      noPieces: pieces.length === 0,
      emptyLine: query
        ? 'Nothing matches "' + s.q.trim() + '".'
        : (s.filter === 'Worn recently' ? 'Nothing logged as worn yet.' : 'Everything here has been worn recently.'),
      cardMin: compact ? '132px' : '176px',
      cardH: compact ? '160px' : '212px',

      // ===== Outfitek: kiválasztott outfit, kedvencek, viselés =====
      outfit: cur,
      outfitTiles: (cur.items || [cur.top, cur.bottom, cur.shoes, cur.extra]).filter((x) => x && x !== 'no extra').map((x, i) => ({ label: x, bg: ['#DCD8CE', '#D4D0C6', '#D8D4CA', '#CDC9BF'][i % 4] })),
      outfitCols: (cur.items || []).length > 4 ? 3 : 2,
      outfitMeta: cur.occasion + ' · ' + cur.season + ' · ' + cur.worn,
      outfitCount: list.length + ' saved',
      favMark: s.favs.includes(cur.name) ? '★' : '☆',
      favLabel: s.favs.includes(cur.name) ? 'Favourite' : 'Add to favourites',
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
      outfitWearLabel: s.worn[cur.name] ? 'Logged for today' : 'Wear today',
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
      bNamePlaceholder: (s.bOcc || 'New') + ' outfit',
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
      bOccasions: ['Work', 'Weekend', 'Going out'].map((o) => chipOf(o, 'bOcc', s.bOcc === o)),
      bSeasons: ['Warm', 'Mild', 'Cold'].map((x) => chipOf(x, 'bSeason', s.bSeason === x)),
      bCtaLabel: bReady ? 'Save outfit' : 'Pick a top, bottom and shoes',
      bCtaBg: bReady ? '#57462F' : '#D8D1C1',
      bCtaFg: bReady ? '#F6F1E7' : '#6B5940',
      saveOutfit: () => {
        if (!bReady) return;
        const p = s.bPicks;
        const parts = bSlots.map((x) => p[x.key]).filter(Boolean).map(nameOf);
        this.setState({
          made: [{
            name: s.bName.trim() || (s.bOcc || 'New') + ' outfit',
            occasion: s.bOcc || 'Any occasion',
            season: s.bSeason || 'Any season',
            top: nameOf(p.top), bottom: nameOf(p.bottom), shoes: nameOf(p.shoes), extra: p.extra ? nameOf(p.extra) : 'no extra',
            pieces: parts.join(' · '),
            items: parts,
            worn: 'new, not worn yet',
          }, ...s.made],
          view: 'outfits', oi: 0, bSlot: '', bPicks: {}, bMore: [], bName: '', bOcc: '', bSeason: '',
        });
      },
      // Jobb panel: ruhaválasztó az összeállítóhoz
      railPicker: s.view === 'builder',
      pickerIdle: !slot,
      pickerTitle: slot ? (slot.cat === '*' ? 'Any piece' : label(slot.cat)) : 'Pieces',
      pickerCount: slot ? slotItems(slot).length + ' owned' : '',
      pickerItems: slot
        ? slotItems(slot).map((x) => ({
            label: nameOf(x.label),
            border: s.bPicks[slot.key] === x.label ? '2px solid #57462F' : '2px solid transparent',
            on: () => this.setState({ bPicks: { ...s.bPicks, [slot.key]: x.label } }),
          }))
        : [],

      // ===== Kihasználatlan ruhák ("Untouched") =====
      idleLine: idleAll.length ? idleAll.length + ' pieces, longest first' : 'Nothing sitting untouched',
      idleEmpty: idleAll.length === 0,
      idleItems: idleAll.map((x) => ({
        label: nameOf(x.label), cat: label(x.cat), note: x.note,
        open: this.select(x.label, x.cat, x.note),
        wear: () => this.setState({ worn: { ...s.worn, [x.label]: true } }),
        remove: () => this.setState({ hidden: [...gone, x.label], sel: null, lastGone: x.label }),
      })),
      undoVisible: !!s.lastGone && gone.indexOf(s.lastGone) > -1,
      undoLine: nameOf(s.lastGone || '') + ' moved to Removed',
      undoGone: () => this.setState({ hidden: gone.filter((x) => x !== s.lastGone), lastGone: '' }),
      dismissUndo: () => this.setState({ lastGone: '' }),

      // ===== Beállítások: profil, kategóriák szerkesztése, emlékeztetők, export =====
      sName: s.sName,
      sEmail: s.sEmail,
      onSName: (e) => this.setState({ sName: e.target.value }),
      onSEmail: (e) => this.setState({ sEmail: e.target.value }),
      profileTabs: ['Male', 'Female'].map((p) => ({
        label: p,
        bg: who === p ? '#57462F' : '#EBE2D2',
        fg: who === p ? '#F6F1E7' : '#57462F',
        on: () => this.setState({ who: p, cat: 'All', sel: null, oi: 0, favs: [], made: [], deleted: [], bPicks: {} }),
      })),
      // Kategóriák átnevezése / új kategória felvétele / törlése
      catEditRows: rawAll.map((n) => ({
        value: label(n),
        count: inCat(n).length + ' pieces',
        onChange: (e) => this.setState({ catNames: { ...s.catNames, [n]: e.target.value } }),
        removable: (s.addedCats || []).indexOf(n) > -1,
        remove: () => this.setState({ addedCats: (s.addedCats || []).filter((x) => x !== n), cat: s.cat === n ? 'All' : s.cat }),
      })),
      newCat: s.newCat || '',
      onNewCat: (e) => this.setState({ newCat: e.target.value }),
      addCatLabel: (s.newCat || '').trim() ? 'Add category' : 'Name it first',
      addCatBg: (s.newCat || '').trim() ? '#57462F' : '#D8D1C1',
      addCatFg: (s.newCat || '').trim() ? '#F6F1E7' : '#6B5940',
      addCategory: () => {
        const v = (s.newCat || '').trim();
        if (!v || rawAll.indexOf(v) > -1) return;
        this.setState({ addedCats: [...(s.addedCats || []), v], newCat: '' });
      },
      // Emlékeztető-kapcsolók
      reminders: [
        { label: 'Weekly review', hint: 'Sunday, 19:00', bg: s.rWeekly ? '#57462F' : '#D8D1C1', knob: s.rWeekly ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rWeekly: !s.rWeekly }) },
        { label: 'Log what you wore', hint: 'Daily, 21:00', bg: s.rDaily ? '#57462F' : '#D8D1C1', knob: s.rDaily ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rDaily: !s.rDaily }) },
        { label: 'Untouched pieces', hint: 'When something passes 6 months', bg: s.rIdle ? '#57462F' : '#D8D1C1', knob: s.rIdle ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rIdle: !s.rIdle }) },
      ],
      // Adatok exportálása (letöltés-szimuláció)
      exportLabel: s.exportState === 'working' ? 'Preparing…' : (s.exportState === 'done' ? 'Download again' : 'Download'),
      exportBg: s.exportState === 'working' ? '#D8D1C1' : '#57462F',
      exportFg: s.exportState === 'working' ? '#6B5940' : '#F6F1E7',
      exportHint: s.exportState === 'done'
        ? 'Saved to your downloads · 148 MB'
        : 'Item list, photos and outfits · 148 MB',
      startExport: () => {
        if (s.exportState === 'working') return;
        this.setState({ exportState: 'working' });
        setTimeout(() => this.setState({ exportState: 'done' }), 900);
      },
      resetAll: () => this.setState({ ...BASE }),

      // ===== Ruha hozzáadása: fotók feldolgozása és kategóriába sorolás =====
      addLine: s.drops.length ? assigned + ' of ' + s.drops.length + ' sorted' : 'Backgrounds come off automatically, then you sort',
      noDrops: s.drops.length === 0,
      hasDrops: s.drops.length > 0,
      simulateDrop: () => this.setState({ drops: DROP_FILES.slice(), dropCats: {} }),
      drops: s.drops.map((file) => ({
        file,
        drop: () => this.setState({ drops: s.drops.filter((f) => f !== file) }),
        name: (s.dropNames || {})[file] || '',
        onName: (e) => this.setState({ dropNames: { ...(s.dropNames || {}), [file]: e.target.value } }),
        options: rawAll.map((n) => ({
          label: label(n),
          bg: s.dropCats[file] === n ? '#57462F' : '#EBE2D2',
          fg: s.dropCats[file] === n ? '#F6F1E7' : '#57462F',
          on: () => this.setState({ dropCats: { ...s.dropCats, [file]: n } }),
        })),
      })),
      saveLabel: dropsReady ? 'Save ' + s.drops.length + ' pieces' : 'Give each photo a category',
      saveBg: dropsReady ? '#57462F' : '#D8D1C1',
      saveFg: dropsReady ? '#F6F1E7' : '#6B5940',
      saveDrops: () => {
        if (!dropsReady) return;
        const base = (s.added || []).length;
        const added = s.drops.map((f, i) => ({ label: ((s.dropNames || {})[f] || '').trim() || 'piece ' + (base + i + 1), cat: s.dropCats[f] }));
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
      dealtLine: dealt + ' of ' + idleBase.length + ' dealt with',
      dealtPct: (idleBase.length ? Math.round((dealt / idleBase.length) * 100) : 100) + '%',
      hasOldest: idleAll.length > 0,
      oldestLabel: idleAll[0] ? nameOf(idleAll[0].label) : '',
      oldestSub: idleAll[0] ? label(idleAll[0].cat) + ' · ' + idleAll[0].note : '',
      openOldest: () => { if (idleAll[0]) this.select(idleAll[0].label, idleAll[0].cat, idleAll[0].note)(); },
      // Telefon állapota és a feldolgozandó fotók sora
      phoneDot: s.paired ? '#7A9A52' : '#B8A78A',
      phoneLine: s.paired ? 'iPhone connected' : 'No phone connected',
      phoneSub: s.paired ? s.phoneCount + ' photos received this session' : 'Scan a code to send photos from your phone',
      phoneBtnLabel: s.paired ? 'Disconnect' : 'Connect phone',
      phoneBtnBg: s.paired ? '#EBE2D2' : '#57462F',
      phoneBtnFg: s.paired ? '#57462F' : '#F6F1E7',
      phoneAction: () => (s.paired ? this.setState({ paired: false }) : this.setState({ pairOpen: true })),
      finishPair: () => this.setState({
        pairOpen: false, paired: true, view: 'add',
        phoneCount: (s.phoneCount || 0) + 2,
        drops: [...s.drops, 'iPhone_0921.HEIC', 'iPhone_0922.HEIC'],
      }),
      queueLine: s.drops.length ? assignedQ + ' of ' + s.drops.length + ' sorted' : 'Empty',
      queueEmpty: s.drops.length === 0,
      queueRows: s.drops.map((f) => ({
        file: f,
        status: s.dropCats[f] ? 'Sorted into ' + label(s.dropCats[f]) : 'Needs a category',
        fg: s.dropCats[f] ? '#6B5940' : '#8A5A22',
      })),
      removedCount: gone.length === 1 ? '1 piece waiting' : gone.length + ' pieces waiting',
      removedHas: gone.length > 0,
      deleteAllNow: () => this.setState({ purged: [...(s.purged || []), ...gone], hidden: [], lastGone: '' }),
      // Kijelölt ruhadarab adatai (név, kategória, viselési statisztika)
      selLabel: nameOf(selKey),
      selCat: label(s.sel ? (s.moved[selKey] || s.sel.cat) : ''),
      selWorn: selIsWorn
        ? 'Worn today · ' + (baseWears + 1) + ' times in total'
        : (selNote
            ? 'Last worn ' + selNote.slice(12) + ' ago · ' + baseWears + ' times in total'
            : 'Last worn 3 weeks ago · ' + baseWears + ' times in total'),
      selWearLabel: selIsWorn ? 'Logged for today' : 'Worn today',
      selWearBg: selIsWorn ? '#DCD8CE' : '#57462F',
      selWearFg: selIsWorn ? '#57462F' : '#F6F1E7',
      wearSel: () => { if (selKey) this.setState({ worn: { ...s.worn, [selKey]: true } }); },
      selTags: (s.tags[selKey] || ['Cotton', 'Neutral', 'All year']).map((t) => ({ label: t })),
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
        editTags: s.tags[selKey] || ['Cotton', 'Neutral', 'All year'],
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
      summaryTitle: s.view === 'settings' ? 'Your wardrobe' : 'This wardrobe',
      stats: [
        { label: 'Pieces', value: String(total) },
        { label: 'Outfits', value: String(list.length) },
        { label: 'Worn this month', value: String(23 + Object.keys(s.worn).length) },
        { label: 'Untouched', value: String(idleAll.length) },
      ],
      idleHeadline: idleAll.length ? idleAll.length + " pieces you haven't worn in months" : 'Everything has been worn recently',
      idleBody: idleAll.length
        ? 'Wear one this week, or let it go — removed pieces wait 30 days before deletion.'
        : 'Nothing has been sitting untouched. Log what you wear and this stays honest.',
      mostWorn: (who === 'Female'
        ? [{ label: 'white trainers', cat: 'Shoes', n: '31 wears' }, { label: 'blue jeans', cat: 'Bottoms', n: '28 wears' }, { label: 'striped tee', cat: 'Tops', n: '22 wears' }]
        : [{ label: 'white sneakers', cat: 'Shoes', n: '31 wears' }, { label: 'blue jeans', cat: 'Trousers', n: '28 wears' }, { label: 'grey tee', cat: 'T-shirts', n: '22 wears' }]
      ).map((m) => ({ label: nameOf(m.label), n: m.n, on: this.select(m.label, m.cat, '') })),
    };
  }
}

return Component;
};
