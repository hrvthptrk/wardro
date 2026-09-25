/* Logic for "Wardro Auth.dc.html" — extracted from its inline <script data-dc-script>.
 *
 * Loaded as a plain classic script. It registers a factory under
 * window.__dcLogic; the one-line stub left in the .dc.html calls that factory
 * and assigns the result to `Component`, which is what the dc runtime
 * (support.js -> evalDcLogic) looks for.
 *
 * DCLogic / StreamableLogic / React are supplied by the runtime, exactly as
 * they were when this code lived inline. */
window.__dcLogic = window.__dcLogic || {};
window.__dcLogic["Wardro Auth"] = function (DCLogic, StreamableLogic, React) {

// ==========================================================================
// FŐ KOMPONENS: bejelentkezés / regisztráció
// ==========================================================================
class Component extends DCLogic {
  // mode: "login" vagy "signup" (null = a start prop dönt); gender: a választott nem
  state = { mode: null, gender: '' };

  // A sablon változói: melyik képernyő látszik, nem választó csempék, gomb állapota
  renderVals() {
    const mode = this.state.mode || this.props.start || 'login';
    const picked = this.state.gender;
    // Nem választó csempe (Férfi / Női); kiválasztva sötét háttér
    const tile = (label, hint) => {
      const on = picked === label;
      return {
        label, hint,
        bg: on ? '#57462F' : '#F6F1E7',
        border: on ? '1.5px solid #57462F' : '1px solid rgba(87,70,47,.16)',
        fg: on ? '#F6F1E7' : '#57462F',
        sub: on ? '#E4D9C6' : '#6B5940',
        on: () => this.setState({ gender: label }),
      };
    };
    return {
      isLogin: mode === 'login',
      isSignup: mode === 'signup',
      genders: [tile('Male', "Men's cuts and sizes"), tile('Female', "Women's cuts and sizes")],
      ctaLabel: picked ? 'Create account' : 'Pick one to continue',
      ctaBg: picked ? '#57462F' : '#D8D1C1',
      ctaFg: picked ? '#F6F1E7' : '#6B5940',
      ctaShadow: picked ? '0 8px 20px rgba(87,70,47,.26)' : 'none',
      // "Create account": csak kiválasztott nemmel enged tovább, és értesíti a szülőt (onCreated)
      create: () => {
        if (!picked) return;
        if (typeof this.props.onCreated === 'function') this.props.onCreated(picked);
      },
      toSignup: () => this.setState({ mode: 'signup' }),
      toLogin: () => this.setState({ mode: 'login' }),
    };
  }
}

return Component;
};
