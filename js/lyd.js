/* Lyd: enkle, myke toner med WebAudio (ingen lydfiler nødvendig) */
const Lyd = (function () {
  let ctx = null;
  let paa = true;
  let offset = 0;          // halvtoner som legges til toner fra notesystemet
  let aktive = [];

  function init() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function frekv(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function tone(m, t0, dur, vol) {
    const c = ctx;
    const g = c.createGain();
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 2600;
    const o1 = c.createOscillator();
    const o2 = c.createOscillator();
    const g2 = c.createGain();
    o1.type = 'triangle';
    o2.type = 'sine';
    o1.frequency.value = frekv(m);
    o2.frequency.value = frekv(m) * 2;
    g2.gain.value = 0.28;
    o1.connect(g);
    o2.connect(g2);
    g2.connect(g);
    g.connect(f);
    f.connect(c.destination);
    const v = vol == null ? 0.28 : vol;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(v, t0 + 0.03);
    g.gain.setValueAtTime(v * 0.85, t0 + Math.max(0.05, dur - 0.18));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o1.start(t0);
    o2.start(t0);
    o1.stop(t0 + dur + 0.05);
    o2.stop(t0 + dur + 0.05);
    aktive.push(o1, o2);
    o1.onended = function () { aktive = aktive.filter(function (x) { return x !== o1 && x !== o2; }); };
  }

  const api = {
    sett(opts) {
      if (opts.paa != null) paa = !!opts.paa;
      if (opts.offset != null) offset = opts.offset;
    },
    klar() { return !!ctx; },
    /* midi: tonehøyde. opts.notesystem=true → legg til transponering. */
    spill(midi, opts) {
      opts = opts || {};
      if (!paa) return 0;
      if (!init()) return 0;
      const m = midi + (opts.notesystem ? offset : 0);
      const dur = opts.dur || 0.9;
      tone(m, ctx.currentTime + 0.02, dur, opts.vol);
      return dur;
    },
    /* Spiller en rekke toner. Returnerer total varighet i sekunder. */
    rekke(midier, opts) {
      opts = opts || {};
      if (!paa) return 0;
      if (!init()) return 0;
      const steg = opts.steg || 0.6;
      const dur = opts.dur || steg * 0.95;
      const t0 = ctx.currentTime + 0.05;
      midier.forEach(function (m, i) {
        tone(m + (opts.notesystem ? offset : 0), t0 + i * steg, dur, opts.vol);
        if (opts.paaTone) setTimeout(function () { opts.paaTone(i); }, 50 + i * steg * 1000);
      });
      return midier.length * steg;
    },
    klikk() {
      if (!paa || !init()) return;
      const t = ctx.currentTime;
      tone(96, t, 0.06, 0.05);
    },
    riktig() {
      if (!paa || !init()) return;
      const t = ctx.currentTime + 0.01;
      tone(84, t, 0.18, 0.12);
      tone(91, t + 0.12, 0.35, 0.12);
    },
    feil() {
      if (!paa || !init()) return;
      const t = ctx.currentTime + 0.01;
      tone(57, t, 0.22, 0.12);
      tone(55, t + 0.14, 0.3, 0.1);
    },
    stopp() {
      aktive.forEach(function (o) { try { o.stop(); } catch (e) { /* ok */ } });
      aktive = [];
    },
    /* Metronom-klikk (til rytmeleksjoner senere) */
    metronom(tid, sterk) {
      if (!paa || !init()) return;
      const t = tid == null ? ctx.currentTime : tid;
      tone(sterk ? 100 : 93, t, 0.05, sterk ? 0.14 : 0.09);
    },
    /* Planlegger toner med presis timing. items: [{t (sek fra start), midi, dur, vol}].
       Returnerer {perf: tidspunkt for t=0 i performance.now()-tid} eller null om lyd er av. */
    planlegg(items) {
      if (!paa || !init()) return null;
      const t0 = ctx.currentTime + 0.12;
      items.forEach(function (it) { tone(it.midi, t0 + it.t, it.dur || 0.15, it.vol); });
      return { perf: performance.now() + (t0 - ctx.currentTime) * 1000 };
    },
    erPaa() { return paa; },
    tid() { return init() ? ctx.currentTime : 0; }
  };
  return api;
})();
