/* Logic for "Wardro Home.dc.html" — extracted from its inline <script data-dc-script>.
 *
 * Loaded as a plain classic script. It registers a factory under
 * window.__dcLogic; the one-line stub left in the .dc.html calls that factory
 * and assigns the result to `Component`, which is what the dc runtime
 * (support.js -> evalDcLogic) looks for.
 *
 * DCLogic / StreamableLogic / React are supplied by the runtime, exactly as
 * they were when this code lived inline. */
window.__dcLogic = window.__dcLogic || {};
window.__dcLogic["Wardro Home"] = function (DCLogic, StreamableLogic, React) {

// ==========================================================================
// ADATOK (mintaadatok)
// ==========================================================================
// Férfi kategóriák: kategórianév -> { count: darabszám a csempén, hint: a csempe képének leírása,
//   items: a kategória ruhái, notes: { ruha indexe: "utoljára viselve" megjegyzés } }
const MALE = {
  'T-shirts': { count: 24, hint: '3 t-shirt cut-outs, stacked', items: ['grey tee', 'white tee', 'navy tee', 'striped tee', 'black tee', 'linen tee', 'olive tee', 'rust tee'], notes: { 3: 'not worn in 7 months', 6: 'not worn in 4 months' } },
  'Shoes': { count: 9, hint: 'shoe pair cut-out', items: ['white sneakers', 'suede boots', 'runners', 'loafers', 'sandals', 'chelsea boots'], notes: { 3: 'not worn in 6 months' } },
  'Jackets': { count: 7, hint: 'jacket cut-out', items: ['olive bomber', 'denim jacket', 'wool coat', 'rain shell', 'blazer', 'gilet'], notes: { 4: 'not worn in 1 year' } },
  'Accessories': { count: 16, hint: 'watch, belt, wallet', items: ['leather watch', 'brown belt', 'sunglasses', 'wallet', 'beanie', 'tote bag'], notes: {} },
  'Trousers': { count: 11, hint: 'jeans + joggers cut-out', items: ['blue jeans', 'grey joggers', 'chinos', 'black jeans', 'cords', 'shorts'], notes: { 4: 'not worn in 9 months' } },
};

// Női kategóriák (ugyanaz a szerkezet, mint a férfiaknál)
const FEMALE = {
  'Tops': { count: 26, hint: '3 top cut-outs, stacked', items: ['white blouse', 'silk cami', 'striped tee', 'knit jumper', 'cropped tee', 'linen shirt', 'black turtleneck', 'cardigan'], notes: { 3: 'not worn in 7 months', 6: 'not worn in 4 months' } },
  'Shoes': { count: 12, hint: 'heels + flats cut-out', items: ['white trainers', 'ankle boots', 'ballet flats', 'block heels', 'sandals', 'loafers'], notes: { 3: 'not worn in 6 months' } },
  'Dresses': { count: 9, hint: 'dress cut-out', items: ['black slip dress', 'floral midi', 'linen sundress', 'knit dress', 'wrap dress', 'shirt dress'], notes: { 4: 'not worn in 1 year' } },
  'Accessories': { count: 18, hint: 'bag, scarf, jewellery', items: ['gold hoops', 'silk scarf', 'tote bag', 'leather belt', 'sunglasses', 'beret'], notes: {} },
  'Bottoms': { count: 14, hint: 'skirt + jeans cut-out', items: ['blue jeans', 'pleated skirt', 'wide trousers', 'denim skirt', 'leggings', 'tailored shorts'], notes: { 4: 'not worn in 9 months' } },
};

// ==========================================================================
// FŐ KOMPONENS
// ==========================================================================
class Component extends DCLogic {
  // Állapot: screen = éppen látható képernyő; cat / filter = kategória-nézet;
  // addStep / addCat = ruha hozzáadása; oXxx = outfit-mezők; who = Férfi / Női
  state = { screen: 'home', cat: '', addStep: 1, filter: 'All', addCat: '', who: 'Male', item: null, wornToday: false, menu: '', removed: '', hiddenItems: [], oi: 0, oFavs: [], oMade: [], oPicks: {}, oPicker: '', oOcc: '', oSeason: '', oName: '', oShot: false, itemNames: {}, worn: {}, removedSeed: null, movedTo: '', editName: '', tags: ['Cotton', 'Neutral', 'All year'], rWeekly: true, rDaily: false, rIdle: true, rSeason: false };

  // Navigáció-segédek: ruha megnyitása, képernyőváltás, kategória megnyitása
  openItem = (label, cat, note) => () => this.setState({ screen: 'item', item: { label, cat, note: note || '' }, wornToday: false, menu: '', movedTo: '' });

  go = (screen) => () => this.setState({ screen, addStep: 1 });
  openCat = (cat) => () => this.setState({ screen: 'category', cat, filter: 'All' });

  // A sablon (.dc.html) összes változóját itt állítjuk elő az állapotból
  renderVals() {
    const s = this.state;
    // --- Kategóriák és darabszámok (Férfi / Női készlet, az elrejtett ruhák levonva) ---
    const WARDROBE = s.who === 'Female' ? FEMALE : MALE;
    const names = Object.keys(WARDROBE);
    const cat = WARDROBE[s.cat] ? s.cat : names[0];
    const addCat = WARDROBE[s.addCat] ? s.addCat : names[0];
    const entry = WARDROBE[cat];
    const gone = s.hiddenItems;
    const goneIn = (n) => WARDROBE[n].items.filter((x) => gone.includes(x)).length;
    const countOf = (n) => WARDROBE[n].count - goneIn(n);
    // Kategória-csempe a kezdőképernyőhöz (név, darabszám, kép-leírás, megnyitás)
    const tile = (n) => ({
      name: names[n],
      count: String(countOf(names[n])),
      hint: WARDROBE[names[n]].hint,
      on: this.openCat(names[n]),
    });
    const total = names.reduce((a, n) => a + countOf(n), 0);
    // --- Outfitek (nemenként) és a húzós pakli (ALL = saját + előre elkészített) ---
    const OUTFITS = s.who === 'Female'
      ? [
          { name: 'Monday office', occasion: 'Work', season: 'Cold', top: 'white blouse', bottom: 'wide trousers', shoes: 'loafers', extra: 'leather belt', pieces: 'White blouse · Wide trousers · Loafers · Belt', worn: 'Worn 6× · last Monday' },
          { name: 'Saturday walk', occasion: 'Weekend', season: 'Mild', top: 'striped tee', bottom: 'denim skirt', shoes: 'white trainers', extra: 'tote bag', pieces: 'Striped tee · Denim skirt · Trainers · Tote', worn: 'Worn 11× · last Saturday' },
          { name: 'Dinner out', occasion: 'Going out', season: 'Cold', top: 'black turtleneck', bottom: 'pleated skirt', shoes: 'ankle boots', extra: 'gold hoops', pieces: 'Turtleneck · Pleated skirt · Ankle boots · Hoops', worn: 'Worn twice · last month' },
        ]
      : [
          { name: 'Monday office', occasion: 'Work', season: 'Cold', top: 'linen shirt', bottom: 'chinos', shoes: 'loafers', extra: 'brown belt', pieces: 'Linen shirt · Chinos · Loafers · Brown belt', worn: 'Worn 6× · last Monday' },
          { name: 'Saturday walk', occasion: 'Weekend', season: 'Mild', top: 'grey tee', bottom: 'blue jeans', shoes: 'white sneakers', extra: 'leather watch', pieces: 'Grey tee · Blue jeans · White sneakers · Watch', worn: 'Worn 11× · last Saturday' },
          { name: 'Dinner out', occasion: 'Going out', season: 'Cold', top: 'black tee', bottom: 'black jeans', shoes: 'chelsea boots', extra: 'wool coat', pieces: 'Black tee · Black jeans · Chelsea boots · Coat', worn: 'Worn twice · last month' },
        ];
    const ALL = [...s.oMade, ...OUTFITS];
    const oFavOn = s.oFavs.length > 0;
    const oDeck = oFavOn ? ALL.filter((o) => s.oFavs.includes(o.name)) : ALL;
    const oCur = oDeck[Math.min(s.oi, oDeck.length - 1)] || ALL[0];
    const topCat = names[0];
    const botCat = s.who === 'Female' ? 'Bottoms' : 'Trousers';
    // Outfit-összeállító helyek: felső, alsó, cipő, extra
    const oSlots = [
      { key: 'top', role: 'Top', cat: topCat, empty: '+ Pick a top' },
      { key: 'bottom', role: 'Bottom', cat: botCat, empty: '+ Pick a bottom' },
      { key: 'shoes', role: 'Shoes', cat: 'Shoes', empty: '+ Pick shoes' },
      { key: 'extra', role: 'Extra', cat: 'Accessories', empty: '+ Optional' },
    ];
    const oSlot = oSlots.find((x) => x.key === s.oPicker);
    const oReady = s.oPicks.top && s.oPicks.bottom && s.oPicks.shoes;
    // Férfi / Női váltó gomb
    const who = (label) => ({
      label,
      bg: s.who === label ? '#57462F' : 'transparent',
      fg: s.who === label ? '#F6F1E7' : '#57462F',
      on: () => this.setState({ who: label, screen: 'home', cat: '', addCat: '' }),
    });
    // Keresési találatok mintaadata ("white" keresésre)
    const SEARCH = {
      Male: [
        { label: 'white tee', cat: 'T-shirts' },
        { label: 'white sneakers', cat: 'Shoes' },
        { label: 'linen tee', cat: 'T-shirts' },
        { label: 'rain shell', cat: 'Jackets' },
      ],
      Female: [
        { label: 'white blouse', cat: 'Tops' },
        { label: 'white trainers', cat: 'Shoes' },
        { label: 'linen sundress', cat: 'Dresses' },
        { label: 'silk cami', cat: 'Tops' },
      ],
    };
    // Szűrő-chip a kategória nézetben
    const chip = (label, active) => ({
      label, bg: active ? '#57462F' : '#F6F1E7', fg: active ? '#F6F1E7' : '#6B5940',
      on: () => this.setState({ filter: label }),
    });
    // Eltávolított ruhák alapadata (mintaadat)
    const defaultSeed = s.who === 'Female'
      ? [{ label: 'block heels', hint: 'Removed 4 days ago · 26 days left' }, { label: 'old cardigan', hint: 'Removed 2 weeks ago · 16 days left' }]
      : [{ label: 'grey joggers', hint: 'Removed 4 days ago · 26 days left' }, { label: 'old blazer', hint: 'Removed 2 weeks ago · 16 days left' }];
    const seed = s.removedSeed === null ? defaultSeed : s.removedSeed;
    const wornMap = s.worn;
    // Megnyitott ruhadarab: viselési statisztika
    const itemKey = (s.item && s.item.label) || '';
    const itemIsWorn = !!wornMap[itemKey];
    const itemNote = (s.item && s.item.note) || '';
    const itemBaseWears = itemNote.indexOf('not worn in') === 0 ? 3 : 14;
    const monthsOf = (note) => {
      const m = /(\d+)\s*(month|year)/.exec(note || '');
      if (!m) return 0;
      return parseInt(m[1], 10) * (m[2] === 'year' ? 12 : 1);
    };
    // Régen nem viselt ruhák az összes kategóriából (legrégebbi elöl)
    const idleAll = names
      .flatMap((n) => WARDROBE[n].items.map((label, i) => ({ label, cat: n, note: WARDROBE[n].notes[i] || '' })))
      .filter((x) => x.note && !gone.includes(x.label) && !wornMap[x.label])
      .sort((a, b) => monthsOf(b.note) - monthsOf(a.note));
    const wornCount = Object.keys(wornMap).length;
    // Egy kategória listája szűrőkkel ("Not worn lately" / "Recently added")
    let catList = entry.items
      .map((label, i) => ({
        label,
        note: s.worn[label] ? 'Worn today' : entry.notes[i] || '',
        noteFg: s.worn[label] ? '#6B5940' : '#8A5A22',
        on: this.openItem(label, cat, entry.notes[i] || ''),
      }))
      .filter((x) => !gone.includes(x.label));
    if (s.filter === 'Not worn lately') catList = catList.filter((x) => x.note && x.note !== 'Worn today');
    if (s.filter === 'Recently added') catList = catList.slice(0, 3).map((x) => ({ ...x, note: 'Added this week', noteFg: '#6B5940' }));
    // ======================================================================
    // A sablonnak visszaadott értékek, témakörönként
    // ======================================================================
    return {
      // ===== Képernyők (melyik látszik) és design-beállítás =====
      showCounts: this.props.showCounts ?? true,
      isHome: s.screen === 'home',
      isBrowse: s.screen === 'browse',
      isCat: s.screen === 'category',
      isSearch: s.screen === 'search',
      isAdd: s.screen === 'add',
      addShoot: s.screen === 'add' && s.addStep === 1,
      addSort: s.screen === 'add' && s.addStep === 2,
      addDone: s.screen === 'add' && s.addStep === 3,
      // Kategória-csempék (t1..t5) és Férfi / Női váltó
      t1: tile(0), t2: tile(1), t3: tile(2), t4: tile(3), t5: tile(4),
      whoTabs: [who('Male'), who('Female')],
      // ===== Kezdőlap: időjárás és javaslatok =====
      weatherTemp: '14°',
      weatherLine: 'Light rain later · 9° tonight',
      suggestions: s.who === 'Female'
        ? [{ name: 'Knit dress + boots' }, { name: 'Blouse + wide trousers' }, { name: 'Cardigan + jeans' }]
        : [{ name: 'Wool coat + chinos' }, { name: 'Denim jacket + jeans' }, { name: 'Knit + cords' }],
      // ===== Keresés =====
      searchResults: SEARCH[s.who]
        .filter((r) => !gone.includes(r.label))
        .map((r) => ({ ...r, on: this.openItem(r.label, r.cat, '') })),
      searchSummary: SEARCH[s.who].filter((r) => !gone.includes(r.label)).length + ' pieces match "white"',
      // ===== Kategória nézet =====
      totalLine: names.length + ' categories · ' + total + ' pieces',
      totalCount: total + ' pieces',
      catName: cat,
      catCount: countOf(cat) + ' pieces',
      catItems: catList,
      catHasItems: catList.length > 0,
      catNoItems: catList.length === 0,
      catEmptyLine: s.filter === 'Not worn lately'
        ? 'Everything here has been worn recently.'
        : 'Nothing added this week.',
      // ===== Egy ruhadarab: részletek, viselés naplózása =====
      isItem: s.screen === 'item',
      isEmpty: s.screen === 'empty',
      item: s.item
        ? { label: s.itemNames[s.item.label] || s.item.label, cat: s.movedTo || s.item.cat }
        : { label: '', cat: '' },
      itemWorn: itemIsWorn
        ? 'Worn today · ' + (itemBaseWears + 1) + ' times in total'
        : (itemNote
            ? (itemNote.indexOf('not worn in') === 0
                ? 'Last worn ' + itemNote.slice(12) + ' ago · ' + itemBaseWears + ' times in total'
                : itemNote)
            : 'Last worn 3 weeks ago · ' + itemBaseWears + ' times in total'),
      wearBtnLabel: itemIsWorn ? 'Logged for today' : 'Worn today',
      wearBtnBg: itemIsWorn ? '#DCD8CE' : '#57462F',
      wearBtnFg: itemIsWorn ? '#57462F' : '#F6F1E7',
      logWear: () => {
        const k = (s.item && s.item.label) || '';
        if (!k) return;
        this.setState({ worn: { ...s.worn, [k]: true } });
      },
      itemOutfits: s.who === 'Female'
        ? [{ name: 'Monday office', pieces: 'with wide trousers, loafers' }, { name: 'Saturday walk', pieces: 'with denim skirt, trainers' }]
        : [{ name: 'Monday office', pieces: 'with chinos, loafers' }, { name: 'Saturday walk', pieces: 'with blue jeans, sneakers' }],
      itemTagList: s.tags.map((t) => ({ label: t })),
      // ===== Ruha szerkesztése (név, címkék) és áthelyezése másik kategóriába =====
      itemEdit: s.menu === 'edit',
      itemMove: s.menu === 'move',
      openEdit: () => this.setState({ menu: 'edit', editName: (s.item && (s.itemNames[s.item.label] || s.item.label)) || '' }),
      openMove: () => this.setState({ menu: 'move' }),
      editName: s.editName,
      onEditName: (e) => this.setState({ editName: e.target.value }),
      tagOptions: ['Cotton', 'Wool', 'Linen', 'Neutral', 'Bright', 'Cold months', 'Warm months', 'All year'].map((t) => {
        const on = s.tags.includes(t);
        return {
          label: t,
          bg: on ? '#57462F' : '#F6F1E7',
          fg: on ? '#F6F1E7' : '#57462F',
          on: () => this.setState({ tags: on ? s.tags.filter((x) => x !== t) : [...s.tags, t] }),
        };
      }),
      saveEdit: () => {
        const key = (s.item && s.item.label) || '';
        const v = s.editName.trim();
        this.setState({ menu: '', itemNames: v ? { ...s.itemNames, [key]: v } : s.itemNames });
      },
      moveCats: names
        .filter((n) => n !== (s.movedTo || (s.item && s.item.cat)))
        .map((n) => ({ name: n, count: countOf(n) + ' pieces', on: () => this.setState({ menu: '', movedTo: n }) })),
      showMoved: !!s.movedTo,
      movedLine: 'Moved to ' + s.movedTo,
      dismissMoved: () => this.setState({ movedTo: '' }),
      // ===== Átnézés: régen nem viselt ruhák =====
      isReview: s.screen === 'review',
      toReview: () => this.setState({ screen: 'review' }),
      reviewEmpty: idleAll.length === 0,
      reviewItems: idleAll
        .map((x) => ({
          label: x.label, cat: x.cat, note: x.note,
          open: this.openItem(x.label, x.cat, x.note),
          remove: () => this.setState({ hiddenItems: [...gone, x.label], removed: x.label }),
        })),
      // ===== Outfit-összeállító =====
      isOutfitBuilder: s.screen === 'outfitBuilder',
      toOutfitBuilder: () => this.setState({ screen: 'outfitBuilder', oPicks: {}, oName: '', oOcc: '', oSeason: '', oShot: false, oPicker: '' }),
      cancelBuilder: () => this.setState({ screen: 'outfits', oPicker: '' }),
      oBuilderSlots: oSlots.map((x) => ({
        role: x.role,
        label: s.oPicks[x.key] || x.empty,
        bg: s.oPicks[x.key] ? '#DCD8CE' : '#F6F1E7',
        border: s.oPicks[x.key] ? '1.5px solid #57462F' : '1px dashed rgba(87,70,47,.35)',
        on: () => this.setState({ oPicker: x.key }),
      })),
      oPickerOpen: !!oSlot,
      oPickerTitle: oSlot ? oSlot.cat : '',
      oPickerItems: oSlot
        ? (WARDROBE[oSlot.cat] ? WARDROBE[oSlot.cat].items : [])
            .filter((x) => !gone.includes(x))
            .map((label) => ({ label, on: () => this.setState({ oPicks: { ...s.oPicks, [oSlot.key]: label }, oPicker: '' }) }))
        : [],
      oClosePicker: () => this.setState({ oPicker: '' }),
      oNameVal: s.oName,
      onOName: (e) => this.setState({ oName: e.target.value }),
      oNamePlaceholder: (s.oOcc || 'New') + ' outfit',
      oOccasions: ['Work', 'Weekend', 'Going out'].map((o) => ({
        label: o,
        bg: s.oOcc === o ? '#57462F' : '#F6F1E7',
        fg: s.oOcc === o ? '#F6F1E7' : '#57462F',
        on: () => this.setState({ oOcc: o }),
      })),
      oSeasons: ['Warm', 'Mild', 'Cold'].map((x) => ({
        label: x,
        bg: s.oSeason === x ? '#57462F' : '#F6F1E7',
        fg: s.oSeason === x ? '#F6F1E7' : '#57462F',
        on: () => this.setState({ oSeason: x }),
      })),
      oShotTaken: s.oShot,
      oShotEmpty: !s.oShot,
      oTakeShot: () => this.setState({ oShot: true }),
      oClearShot: () => this.setState({ oShot: false }),
      oCtaLabel: oReady ? 'Save outfit' : 'Pick a top, bottom and shoes',
      oCtaBg: oReady ? '#57462F' : '#D8D1C1',
      oCtaFg: oReady ? '#F6F1E7' : '#6B5940',
      oSaveOutfit: () => {
        if (!oReady) return;
        const p = s.oPicks;
        const pieces = [p.top, p.bottom, p.shoes, p.extra].filter(Boolean);
        this.setState({
          oMade: [{
            name: s.oName.trim() || (s.oOcc || 'New') + ' outfit',
            occasion: s.oOcc || 'Any occasion',
            season: s.oSeason || 'Any season',
            top: p.top, bottom: p.bottom, shoes: p.shoes, extra: p.extra || 'no extra',
            pieces: pieces.join(' · '),
            worn: s.oShot ? 'New · photographed today' : 'New · not worn yet',
          }, ...s.oMade],
          screen: 'outfits', oi: 0, oPicks: {}, oName: '', oOcc: '', oSeason: '', oShot: false,
        });
      },
      // ===== Regisztráció után: üres szekrény, ruha menü és eltávolítás =====
      showAuth: () => this.setState({ screen: 'auth' }),
      authDisplay: s.screen === 'auth' ? 'block' : 'none',
      phoneDisplay: s.screen === 'auth' ? 'none' : 'block',
      onAccountCreated: (g) => this.setState({ who: g === 'Female' ? 'Female' : 'Male', screen: 'empty', cat: '', addCat: '', item: null }),
      emptyCats: names.map((n) => ({ name: n })),
      backToCat: () => this.setState({ screen: 'category' }),
      itemMenu: s.menu === 'menu',
      itemConfirm: s.menu === 'confirm',
      openMenu: () => this.setState({ menu: 'menu' }),
      closeMenu: () => this.setState({ menu: '' }),
      askRemove: () => this.setState({ menu: 'confirm' }),
      confirmRemove: () => {
        const label = (s.item && s.item.label) || '';
        this.setState({ menu: '', screen: 'category', removed: label, hiddenItems: [...s.hiddenItems, label] });
      },
      removedName: s.removed,
      showRemoved: !!s.removed,
      undoRemove: () => this.setState({ removed: '', hiddenItems: s.hiddenItems.slice(0, -1) }),
      showEmpty: () => this.setState({ screen: 'empty' }),
      // ===== Alsó fülek (Szekrény / Outfitek / Te) =====
      tab: {
        wardrobe: () => this.setState({ screen: 'home', menu: '' }),
        outfits: () => this.setState({ screen: 'outfits', menu: '' }),
        you: () => this.setState({ screen: 'you', menu: '' }),
      },
      // ===== Outfitek fül: húzós pakli, kedvencek, böngészés =====
      isYou: s.screen === 'you',
      isOutfitsTab: s.screen === 'outfits',
      isOutfitsBrowse: s.screen === 'outfitsBrowse',
      outfit: oCur,
      oDots: oDeck.map((_, n) => ({ bg: n === s.oi ? '#F6F1E7' : 'rgba(246,241,231,.35)' })),
      oPrev: () => this.setState({ oi: (s.oi + oDeck.length - 1) % oDeck.length }),
      oNext: () => this.setState({ oi: (s.oi + 1) % oDeck.length }),
      oDeckLabel: oFavOn ? 'Favourites · ' + oDeck.length + ' of ' + ALL.length : 'All outfits · ' + ALL.length,
      oFavMark: s.oFavs.includes(oCur.name) ? '★' : '☆',
      oFavBg: s.oFavs.includes(oCur.name) ? '#F6F1E7' : 'rgba(38,29,18,.5)',
      oFavFg: s.oFavs.includes(oCur.name) ? '#57462F' : '#F6F1E7',
      oToggleFav: () => {
        const on = s.oFavs.includes(oCur.name);
        this.setState({ oFavs: on ? s.oFavs.filter((k) => k !== oCur.name) : [...s.oFavs, oCur.name], oi: 0 });
      },
      toOutfitsBrowse: () => this.setState({ screen: 'outfitsBrowse' }),
      backToOutfits: () => this.setState({ screen: 'outfits', oi: 0 }),
      oBrowseCount: ALL.length + ' outfits' + (oFavOn ? ' · ' + s.oFavs.length + ' favourite' : ''),
      oBrowseHint: oFavOn
        ? 'Only favourites show on the outfit card. Tap a star to change that.'
        : 'Star the ones you reach for. Only those then show on the outfit card.',
      oBrowseList: ALL.map((o) => ({
        name: o.name, occasion: o.occasion, season: o.season, pieces: o.pieces,
        mark: s.oFavs.includes(o.name) ? '★' : '☆',
        markFg: s.oFavs.includes(o.name) ? '#57462F' : '#8A7A62',
        markBg: s.oFavs.includes(o.name) ? '#EBE2D2' : 'transparent',
        on: () => {
          const list = s.oFavs.includes(o.name) ? ALL.filter((x) => s.oFavs.includes(x.name)) : ALL;
          const idx = list.findIndex((x) => x.name === o.name);
          this.setState({ screen: 'outfits', oi: idx < 0 ? 0 : idx });
        },
        star: () => {
          const on = s.oFavs.includes(o.name);
          this.setState({ oFavs: on ? s.oFavs.filter((k) => k !== o.name) : [...s.oFavs, o.name], oi: 0 });
        },
      })),
      // ===== "Te" képernyő: statisztikák, legtöbbet viselt, kihasználatlan =====
      youStats: [
        { label: 'Pieces', value: String(total) },
        { label: 'Outfits', value: String(ALL.length) },
        { label: 'Worn this month', value: String(23 + wornCount) },
      ],
      youMost: s.who === 'Female'
        ? [{ label: 'white trainers', n: '31 wears' }, { label: 'blue jeans', n: '28 wears' }, { label: 'striped tee', n: '22 wears' }]
        : [{ label: 'white sneakers', n: '31 wears' }, { label: 'blue jeans', n: '28 wears' }, { label: 'grey tee', n: '22 wears' }],
      youIdle: idleAll.slice(0, 3).map((x) => ({ label: x.label, n: x.note.slice(12) })),
      youIdleEmpty: idleAll.length === 0,
      idleHeadline: idleAll.length
        ? idleAll.length + " pieces you haven't worn in months"
        : 'Everything has been worn recently',
      idleBody: idleAll.length
        ? 'Wear one this week, or decide to let it go. Either way the list gets shorter.'
        : 'Nothing has been sitting untouched. Log what you wear and this stays honest.',
      youProfile: s.who === 'Female' ? 'Female · 5 categories' : 'Male · 5 categories',
      // ===== "Te" almenük: kategóriák, emlékeztetők, eltávolítottak, export =====
      youRows: [
        { label: 'Categories', hint: 'Rename or add your own', on: () => this.setState({ screen: 'youCategories' }) },
        { label: 'Reminders', hint: 'Weekly, Sunday evening', on: () => this.setState({ screen: 'youReminders' }) },
        { label: 'Removed items', hint: 'Kept for 30 days', on: () => this.setState({ screen: 'youRemoved' }) },
        { label: 'Export wardrobe', hint: 'Photos and item list', on: () => this.setState({ screen: 'youExport' }) },
      ],
      isYouCategories: s.screen === 'youCategories',
      isYouReminders: s.screen === 'youReminders',
      isYouRemoved: s.screen === 'youRemoved',
      isYouExport: s.screen === 'youExport',
      backToYou: () => this.setState({ screen: 'you' }),
      // Kategóriák szerkesztése (sorok)
      catRows: names.map((n) => ({ name: n, count: countOf(n) + ' pieces' })),
      // Emlékeztető-kapcsolók
      reminderToggles: [
        { label: 'Weekly review', hint: 'Sunday, 19:00', on: s.rWeekly, bg: s.rWeekly ? '#57462F' : '#D8D1C1', knob: s.rWeekly ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rWeekly: !s.rWeekly }) },
        { label: 'Log what you wore', hint: 'Daily, 21:00', on: s.rDaily, bg: s.rDaily ? '#57462F' : '#D8D1C1', knob: s.rDaily ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rDaily: !s.rDaily }) },
        { label: 'Untouched pieces', hint: 'When something passes 6 months', on: s.rIdle, bg: s.rIdle ? '#57462F' : '#D8D1C1', knob: s.rIdle ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rIdle: !s.rIdle }) },
        { label: 'Season change', hint: 'Twice a year', on: s.rSeason, bg: s.rSeason ? '#57462F' : '#D8D1C1', knob: s.rSeason ? 'flex-end' : 'flex-start', toggle: () => this.setState({ rSeason: !s.rSeason }) },
      ],
      // Eltávolított ruhák (30 nap után törlődnek)
      removedItems: [
        ...s.hiddenItems.map((label) => ({
          label, hint: 'Removed today · 30 days left',
          restore: () => this.setState({ hiddenItems: s.hiddenItems.filter((x) => x !== label), removed: '' }),
        })),
        ...seed.map((x) => ({
          label: x.label, hint: x.hint,
          restore: () => this.setState({ removedSeed: seed.filter((y) => y.label !== x.label) }),
        })),
      ],
      removedEmpty: s.hiddenItems.length === 0 && seed.length === 0,
      // Exportálás
      exportRows: [
        { label: 'Item list', hint: 'CSV · names, categories, wear counts' },
        { label: 'All photos', hint: 'ZIP · ' + total + ' cut-outs, full size' },
        { label: 'Outfits', hint: 'PDF · one page per outfit' },
      ],
      exportSize: '148 MB',
      // ===== Böngészés: polcok kategóriánként, szűrők =====
      shelves: names.map((name) => ({
        name, count: String(countOf(name)),
        preview: WARDROBE[name].items.filter((x) => !gone.includes(x)).slice(0, 3),
        more: '+' + (countOf(name) - 3),
        on: this.openCat(name),
      })),
      filters: ['All', 'Not worn lately', 'Recently added'].map((f) => chip(f, s.filter === f)),
      // ===== Ruha hozzáadása: kategória-választó és lépések (fényképezés -> sorolás -> kész) =====
      addCats: names.map((name) => ({
        name,
        bg: addCat === name ? '#57462F' : '#F6F1E7',
        fg: addCat === name ? '#F6F1E7' : '#57462F',
        on: () => this.setState({ addCat: name }),
      })),
      addCatName: addCat,
      go: { home: this.go('home'), browse: this.go('browse'), search: this.go('search'), add: this.go('add') },

      shoot: () => this.setState({ addStep: 2 }),
      save: () => this.setState({ addStep: 3 }),
      finish: () => this.setState({ screen: 'category', cat: addCat, addStep: 1 }),
    };
  }
}

return Component;
};
