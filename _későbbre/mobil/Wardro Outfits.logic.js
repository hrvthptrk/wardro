/* Logic for "Wardro Outfits.dc.html" — extracted from its inline <script data-dc-script>.
 *
 * Loaded as a plain classic script. It registers a factory under
 * window.__dcLogic; the one-line stub left in the .dc.html calls that factory
 * and assigns the result to `Component`, which is what the dc runtime
 * (support.js -> evalDcLogic) looks for.
 *
 * DCLogic / StreamableLogic / React are supplied by the runtime, exactly as
 * they were when this code lived inline. */
window.__dcLogic = window.__dcLogic || {};
window.__dcLogic["Wardro Outfits"] = function (DCLogic, StreamableLogic, React) {

// ==========================================================================
// ADATOK (mintaadatok)
// ==========================================================================
// Kategóriák és a bennük lévő ruhák (a ruhaválasztó ebből dolgozik)
const ITEMS = {
  'T-shirts': ['grey tee', 'white tee', 'navy tee', 'striped tee', 'black tee', 'linen tee'],
  'Trousers': ['blue jeans', 'grey joggers', 'chinos', 'black jeans', 'cords', 'shorts'],
  'Shoes': ['white sneakers', 'suede boots', 'runners', 'loafers', 'sandals', 'chelsea boots'],
  'Accessories': ['leather watch', 'brown belt', 'sunglasses', 'wallet', 'beanie', 'tote bag'],
};

// Előre elkészített outfitek (alkalom, évszak, ruhadarabok, viselési infó)
const OUTFITS = [
  { name: 'Monday office', occasion: 'Work', season: 'Cold', top: 'white oxford shirt', bottom: 'chinos', shoes: 'loafers', extra: 'brown belt', pieces: 'White oxford · Chinos · Loafers · Brown belt', worn: 'Worn 6× · last Monday', shots: [1, 2, 3] },
  { name: 'Saturday walk', occasion: 'Weekend', season: 'Mild', top: 'grey tee', bottom: 'blue jeans', shoes: 'white sneakers', extra: 'leather watch', pieces: 'Grey tee · Blue jeans · White sneakers · Watch', worn: 'Worn 11× · last Saturday', shots: [1, 2] },
  { name: 'Dinner out', occasion: 'Going out', season: 'Cold', top: 'black tee', bottom: 'black jeans', shoes: 'chelsea boots', extra: 'wool coat', pieces: 'Black tee · Black jeans · Chelsea boots · Wool coat', worn: 'Worn twice · last month', shots: [1] },
];

// Outfit-összeállító "helyek": felső, alsó, cipő, extra – és melyik kategóriából választható hozzájuk ruha
const SLOTS = [
  { key: 'top', role: 'Top', cat: 'T-shirts', empty: '+ Pick a top' },
  { key: 'bottom', role: 'Bottom', cat: 'Trousers', empty: '+ Pick a bottom' },
  { key: 'shoes', role: 'Shoes', cat: 'Shoes', empty: '+ Pick shoes' },
  { key: 'extra', role: 'Extra', cat: 'Accessories', empty: '+ Optional' },
];

// ==========================================================================
// FŐ KOMPONENS
// ==========================================================================
class Component extends DCLogic {
  // Állapot: nézet, kiválasztott outfit indexe (i), választások (picks), alkalom/évszak, menük, kedvencek…
  state = { view: null, i: 0, picks: {}, picker: '', occasion: '', season: '', sheet: false, extraShots: 0, newShot: false, made: [], menu: '', hidden: [], deleted: '', edits: {}, renameText: '', editingKey: '', builderName: '', favs: [], viewingKey: '' };

  // Választó-chip (alkalom / évszak) a sablonhoz
  chip = (label, active, key) => ({
    label,
    bg: active ? '#57462F' : '#F6F1E7',
    fg: active ? '#F6F1E7' : '#57462F',
    on: () => this.setState({ [key]: label }),
  });

  // Outfit mentése: szerkesztésnél a meglévőt módosítja, különben újat vesz fel
  saveOutfit = () => {
    const s = this.state;
    const p = s.picks;
    if (s.editingKey) {
      const pieces = [p.top, p.bottom, p.shoes, p.extra].filter(Boolean);
      const named = s.builderName.trim();
      return this.setState({
        edits: { ...s.edits, [s.editingKey]: { ...(s.edits[s.editingKey] || {}), top: p.top, bottom: p.bottom, shoes: p.shoes, extra: p.extra || 'no extra', pieces: pieces.join(' · '), ...(named ? { name: named } : {}) } },
        view: 'deck', editingKey: '', picks: {}, occasion: '', season: '', newShot: false, builderName: '',
      });
    }
    const pieces = [p.top, p.bottom, p.shoes, p.extra].filter(Boolean);
    const fresh = {
      name: s.builderName.trim() || (s.occasion || 'New') + ' outfit',
      occasion: s.occasion || 'Any occasion',
      season: s.season || 'Any season',
      top: p.top, bottom: p.bottom, shoes: p.shoes, extra: p.extra || 'no extra',
      pieces: pieces.join(' · '),
      worn: s.newShot ? 'New · photographed today' : 'New · not worn yet',
      shots: s.newShot ? [1] : [],
      hero: !!s.newShot,
    };
    this.setState({
      made: [fresh, ...s.made], view: 'deck', i: 0,
      picks: {}, occasion: '', season: '', newShot: false, builderName: '',
    });
  };

  // A sablon (.dc.html) összes változóját itt állítjuk elő az állapotból
  renderVals() {
    const s = this.state;
    // Minden outfit (saját + előre elkészített, a törölt nélkül), esetleges átnevezésekkel
    const all = [...s.made, ...OUTFITS]
      .filter((o) => !s.hidden.includes(o.name))
      .map((o) => ({ ...o, ...(s.edits[o.name] || {}), key: o.name }));
    // Kedvencek: ha van kedvenc, a pakli csak azokat mutatja
    const pinned = s.viewingKey && !s.favs.includes(s.viewingKey);
    const favOn = s.favs.length > 0 && !pinned;
    const deck = favOn ? all.filter((o) => s.favs.includes(o.key)) : all;
    const cur = deck[Math.min(s.i, deck.length - 1)] || all[0];
    // Melyik képernyő látszik; picks = összeállítás közben kiválasztott ruhák
    const view = s.view || this.props.start || 'deck';
    const picks = s.picks;
    const ready = picks.top && picks.bottom && picks.shoes;
    const slot = SLOTS.find((x) => x.key === s.picker);
    // ======================================================================
    // A sablonnak visszaadott értékek, témakörönként
    // ======================================================================
    return {
      // ===== Képernyők (melyik látszik) =====
      isEmpty: view === 'empty',
      isDeck: view === 'deck',
      isBuilder: view === 'builder',
      isWearShot: view === 'wearShot',
      isWearSaved: view === 'wearSaved',
      // ===== Viselés naplózása (alulról felcsúszó lap, fotó) =====
      wornSheet: s.sheet,
      wear: () => this.setState({ sheet: true }),
      dismissSheet: () => this.setState({ sheet: false }),
      toWearShot: () => this.setState({ view: 'wearShot', sheet: false }),
      shootWear: () => this.setState({ view: 'wearSaved', extraShots: s.extraShots + 1 }),
      // ===== Húzós outfit-pakli: aktuális outfit, lapozás =====
      outfit: { ...cur, savedCount: cur.shots.length + s.extraShots },
      hasHero: !!cur.hero,
      hasCollage: !cur.hero,
      dots: deck.map((_, n) => ({ bg: n === s.i ? '#F6F1E7' : 'rgba(246,241,231,.35)' })),
      prev: () => this.setState({ i: (s.i + deck.length - 1) % deck.length }),
      next: () => this.setState({ i: (s.i + 1) % deck.length }),
      isBrowse: view === 'browse',
      toBrowse: () => this.setState({ view: 'browse', menu: '', viewingKey: '' }),
      deckLabel: favOn ? 'Favourites · ' + deck.length + ' of ' + all.length : 'All outfits · ' + all.length,
      clearPin: () => this.setState({ viewingKey: '', i: 0 }),
      // ===== Kedvencek (csillag) =====
      favMark: s.favs.includes(cur.key) ? '★' : '☆',
      favBg: s.favs.includes(cur.key) ? '#F6F1E7' : 'rgba(38,29,18,.5)',
      favFg: s.favs.includes(cur.key) ? '#57462F' : '#F6F1E7',
      toggleFav: () => {
        const on = s.favs.includes(cur.key);
        const favs = on ? s.favs.filter((k) => k !== cur.key) : [...s.favs, cur.key];
        const list = favs.length && favs.includes(cur.key) ? all.filter((x) => favs.includes(x.key)) : all;
        const idx = list.findIndex((x) => x.key === cur.key);
        this.setState({ favs, viewingKey: cur.key, i: idx < 0 ? 0 : idx });
      },
      // ===== Böngészés: az összes outfit listája =====
      browseCount: all.length + ' outfits' + (favOn ? ' · ' + s.favs.length + ' favourite' : ''),
      browseHint: favOn
        ? 'Only favourites show on the outfit card. Tap a star to change that.'
        : 'Star the ones you reach for. Only those then show on the outfit card.',
      browseList: all.map((o, n) => ({
        name: o.name, occasion: o.occasion, season: o.season, pieces: o.pieces,
        mark: s.favs.includes(o.key) ? '★' : '☆',
        markFg: s.favs.includes(o.key) ? '#57462F' : '#8A7A62',
        markBg: s.favs.includes(o.key) ? '#EBE2D2' : 'transparent',
        on: () => {
          const list = s.favs.includes(o.key) ? all.filter((x) => s.favs.includes(x.key)) : all;
          const idx = list.findIndex((x) => x.key === o.key);
          this.setState({ view: 'deck', viewingKey: o.key, i: idx < 0 ? 0 : idx });
        },
        star: () => {
          const on = s.favs.includes(o.key);
          this.setState({ favs: on ? s.favs.filter((k) => k !== o.key) : [...s.favs, o.key], i: 0 });
        },
      })),
      // ===== Új fotó készítése az outfithez =====
      newShotTaken: !!s.newShot,
      newShotEmpty: !s.newShot,
      isNewShot: view === 'newShot',
      toNewShot: () => this.setState({ view: 'newShot' }),
      shootNew: () => this.setState({ view: 'builder', newShot: true }),
      clearNewShot: () => this.setState({ newShot: false }),
      toBuilderBack: () => this.setState({ view: 'builder' }),
      toBuilder: () => this.setState({ view: 'builder' }),
      // ===== Üres állapot: még nincs outfit =====
      emptySlots: [
        { role: 'Top', hint: 'Pick a top' },
        { role: 'Bottom', hint: 'Pick a bottom' },
        { role: 'Shoes', hint: 'Pick shoes' },
        { role: 'Extra', hint: 'Optional' },
      ],
      toDeck: () => this.setState({ view: 'deck', picker: '', sheet: false }),
      // ===== Outfit menü: átnevezés, törlés, darabok szerkesztése =====
      outfitMenu: s.menu === 'menu',
      outfitConfirm: s.menu === 'confirm',
      openMenu: () => this.setState({ menu: 'menu' }),
      closeMenu: () => this.setState({ menu: '' }),
      askDelete: () => this.setState({ menu: 'confirm' }),
      renaming: s.menu === 'rename',
      renameText: s.renameText,
      renameEmpty: !s.renameText.trim(),
      onRenameInput: (e) => this.setState({ renameText: e.target.value }),
      startRename: () => this.setState({ menu: 'rename', renameText: cur.name }),
      saveRename: () => {
        if (!s.renameText.trim()) return;
        this.setState({ edits: { ...s.edits, [cur.key]: { ...(s.edits[cur.key] || {}), name: s.renameText.trim() } }, menu: '' });
      },
      editPieces: () => this.setState({
        view: 'builder', menu: '', editingKey: cur.key, builderName: cur.name,
        picks: { top: cur.top, bottom: cur.bottom, shoes: cur.shoes, extra: cur.extra === 'no extra' ? '' : cur.extra },
        occasion: cur.occasion, season: cur.season,
      }),
      builderTitle: s.editingKey ? 'Edit outfit' : 'New outfit',
      builderName: s.builderName,
      onBuilderName: (e) => this.setState({ builderName: e.target.value }),
      namePlaceholder: (s.occasion || 'New') + ' outfit',
      confirmDelete: () => {
        const rest = all.filter((o) => o.key !== cur.key);
        this.setState({
          made: s.made.filter((o) => o.name !== cur.key),
          hidden: [...s.hidden, cur.key],
          favs: s.favs.filter((k) => k !== cur.key),
          menu: '', deleted: cur.name,
          i: Math.min(s.i, Math.max(rest.length - 1, 0)),
        });
      },
      deletedName: s.deleted,
      showDeleted: !!s.deleted,
      undoDelete: () => this.setState({ deleted: '', hidden: s.hidden.slice(0, -1) }),
      // ===== Összeállító: ruha-helyek, alkalom, évszak, ruhaválasztó, mentés =====
      slots: SLOTS.map((x) => ({
        role: x.role,
        label: picks[x.key] || x.empty,
        bg: picks[x.key] ? '#DCD8CE' : '#F6F1E7',
        border: picks[x.key] ? '1.5px solid #57462F' : '1px dashed rgba(87,70,47,.35)',
        on: () => this.setState({ picker: x.key }),
      })),
      occasions: ['Work', 'Weekend', 'Going out'].map((o) => this.chip(o, s.occasion === o, 'occasion')),
      seasons: ['Warm', 'Mild', 'Cold'].map((x) => this.chip(x, s.season === x, 'season')),
      pickerOpen: !!slot,
      pickerTitle: slot ? slot.cat : '',
      pickerItems: slot ? ITEMS[slot.cat].map((label) => ({
        label,
        on: () => this.setState({ picks: { ...this.state.picks, [slot.key]: label }, picker: '' }),
      })) : [],
      closePicker: () => this.setState({ picker: '' }),
      ctaLabel: ready ? (s.editingKey ? 'Save changes' : 'Save outfit') : 'Pick a top, bottom and shoes',
      ctaBg: ready ? '#57462F' : '#D8D1C1',
      ctaFg: ready ? '#F6F1E7' : '#6B5940',
      ctaShadow: ready ? '0 8px 20px rgba(87,70,47,.26)' : 'none',
      save: () => { if (ready) this.saveOutfit(); },
    };
  }
}

return Component;
};
