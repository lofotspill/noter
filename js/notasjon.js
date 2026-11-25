/* Notasjon: notesystem som SVG.
   Posisjon (pos): 0 = nederste notelinje, 1 = første mellomrom, 2 = 2. linje, … 8 = øverste linje.
   Negative tall ligger under systemet, tall over 8 ligger over. */
const Noter = (function () {
  const NAVN = ['C', 'D', 'E', 'F', 'G', 'A', 'H'];
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, H: 11 };
  const BASE = { G: 30, F: 18 };           // trinn for nederste linje: E4 (G-nøkkel), G2 (F-nøkkel)
  const NS = 'http://www.w3.org/2000/svg';
  const SP = 20;                            // avstand mellom linjer
  const H = SP / 2;
  const FARGE = { ok: '#2f8f6b', bad: '#c9496f', hl: '#2e6577', ghost: '#9aa5b1', normal: '#2a2f3a' };

  function el(navn, attr, forelder) {
    const e = document.createElementNS(NS, navn);
    if (attr) for (const k in attr) e.setAttribute(k, attr[k]);
    if (forelder) forelder.appendChild(e);
    return e;
  }

  function mod(a, n) { return ((a % n) + n) % n; }
  function posTilTone(pos, clef) {
    const s = BASE[clef] + pos;
    return { l: NAVN[mod(s, 7)], o: Math.floor(s / 7) };
  }
  function toneTilPos(l, o, clef) { return o * 7 + NAVN.indexOf(l) - BASE[clef]; }
  function midi(t) { return 12 * (t.o + 1) + SEMI[t.l]; }
  function posMidi(pos, clef) { return midi(posTilTone(pos, clef)); }
  function bokstav(pos, clef) { return posTilTone(pos, clef).l; }
  function erLinje(pos) { return mod(pos, 2) === 0; }
  function posNavn(pos) {
    if (pos >= 0 && pos <= 8) {
      return erLinje(pos) ? (pos / 2 + 1) + '. linje' : ((pos + 1) / 2) + '. mellomrom';
    }
    return erLinje(pos) ? 'en hjelpelinje' : 'et mellomrom ved hjelpelinjene';
  }
  function antallHjelpelinjer(pos) {
    let n = 0;
    if (pos <= -2) { for (let p = -2; p >= pos; p -= 2) n++; }
    if (pos >= 10) { for (let p = 10; p <= pos; p += 2) n++; }
    return n;
  }
  function nokkelNavn(clef) { return clef === 'F' ? 'F-nøkkel' : 'G-nøkkel'; }
  function referansePos(clef) { return clef === 'F' ? 6 : 2; }   // linja nøkkelen markerer
  function referanseBokstav(clef) { return clef === 'F' ? 'F' : 'G'; }

  /* ---------------- Notesystem ---------------- */
  function renderStaff(o) {
    o = o || {};
    const clef = o.clef || 'G';
    const notes = o.notes || [];
    let minP = 0, maxP = 8;
    if (o.range) { minP = Math.min(minP, o.range[0]); maxP = Math.max(maxP, o.range[1]); }
    notes.forEach(function (n) {
      minP = Math.min(minP, n.pos - 1);
      maxP = Math.max(maxP, n.pos + 1);
      if ((n.dur || 'q') !== 'w') {
        if (n.pos < 4) maxP = Math.max(maxP, n.pos + 7); else minP = Math.min(minP, n.pos - 7);
      }
    });
    const visKlav = o.klav !== false;
    if (visKlav && clef === 'G') { minP = Math.min(minP, -3.3); maxP = Math.max(maxP, 11.4); }
    minP -= 1; maxP += 1;
    const x0 = visKlav ? 112 : 36;
    const gap = o.gap || 62;
    const n = notes.length;
    const W = Math.max(o.width || 0, x0 + Math.max(n, 1) * gap + 16);
    const harEtikett = notes.some(function (x) { return x.label; });
    const etikettH = harEtikett ? 32 : 0;
    const Ht = (maxP - minP) * H + etikettH;
    const y = function (p) { return (maxP - p) * H; };

    const svg = el('svg', { viewBox: '0 0 ' + W + ' ' + Ht, class: 'staff', role: 'img' });
    svg.style.width = Math.min(W * (o.skala || 1.15), 760) + 'px';
    svg.style.maxWidth = '100%';
    svg.style.height = 'auto';
    if (o.alt) svg.setAttribute('aria-label', o.alt);

    // linjer
    const gLinjer = el('g', { class: 'linjer' }, svg);
    for (let p = 0; p <= 8; p += 2) {
      el('line', { x1: 6, x2: W - 6, y1: y(p), y2: y(p), stroke: '#44505f', 'stroke-width': 1.4 }, gLinjer);
    }
    // markerte linjer (f.eks. G-linja)
    (o.markerLinjer || []).forEach(function (m) {
      el('line', { x1: 6, x2: W - 6, y1: y(m.pos), y2: y(m.pos), stroke: m.farge || '#e0708f', 'stroke-width': 3.2, 'stroke-linecap': 'round', opacity: 0.9 }, svg);
      if (m.tekst) {
        const t = el('text', { x: W - 10, y: y(m.pos) - 5, 'text-anchor': 'end', class: 'staff-merke' }, svg);
        t.textContent = m.tekst;
        t.setAttribute('fill', m.farge || '#e0708f');
      }
    });
    // etiketter for linjer/mellomrom
    if (o.posEtiketter) {
      for (let p = 0; p <= 8; p++) {
        const t = el('text', { 'text-anchor': 'end', class: 'staff-etikett' }, svg);
        if (erLinje(p)) { t.setAttribute('x', W - 10); t.setAttribute('y', y(p) - 4); t.setAttribute('fill', '#2e6577'); }
        else { t.setAttribute('x', W - 140); t.setAttribute('y', y(p) + 4); t.setAttribute('fill', '#c9496f'); }
        t.textContent = posNavn(p);
      }
    }
    // nøkkel
    if (visKlav) {
      const k = SP / GLYFER.SP;
      if (clef === 'G') {
        const s = k * 0.9;
        el('path', { d: GLYFER.gklav.d, fill: '#2a2f3a', transform: 'translate(' + (14 - 50 * s) + ',' + y(2) + ') scale(' + s + ',' + (-s) + ') translate(0,' + (-GLYFER.SP) + ')' }, svg);
      } else {
        el('path', { d: GLYFER.fklav.d, fill: '#2a2f3a', transform: 'translate(' + (14 - 50 * k) + ',' + y(0) + ') scale(' + k + ',' + (-k) + ')' }, svg);
      }
    }

    function xAv(i) { return x0 + (i + 0.5) * (W - x0 - 10) / Math.max(n, 1); }

    function tegnNote(g, x, pos, dur, farge, medHjelpelinjer) {
      g.style.color = farge || FARGE.normal;
      if (medHjelpelinjer !== false) {
        for (let p = -2; p >= pos; p -= 2) el('line', { x1: x - 19, x2: x + 19, y1: y(p), y2: y(p), stroke: '#44505f', 'stroke-width': 1.4 }, g);
        for (let p = 10; p <= pos; p += 2) el('line', { x1: x - 19, x2: x + 19, y1: y(p), y2: y(p), stroke: '#44505f', 'stroke-width': 1.4 }, g);
      }
      const cy = y(pos);
      if (dur === 'w') {
        el('ellipse', { cx: x, cy: cy, rx: 12.5, ry: 8.4, fill: 'none', stroke: 'currentColor', 'stroke-width': 3.2 }, g);
        el('ellipse', { cx: x, cy: cy, rx: 4.6, ry: 7.4, fill: 'currentColor', transform: 'rotate(-35 ' + x + ' ' + cy + ')' }, g);
        return;
      }
      const open = dur === 'h';
      const hode = el('ellipse', { cx: x, cy: cy, rx: 11.2, ry: 8.1, transform: 'rotate(-18 ' + x + ' ' + cy + ')', class: 'hode' }, g);
      if (open) { hode.setAttribute('fill', '#fff'); hode.setAttribute('stroke', 'currentColor'); hode.setAttribute('stroke-width', 2.6); }
      else { hode.setAttribute('fill', 'currentColor'); }
      const opp = pos < 4;
      const sx = opp ? x + 10.2 : x - 10.2;
      const sy2 = opp ? cy - 3.5 * SP : cy + 3.5 * SP;
      el('line', { x1: sx, x2: sx, y1: cy, y2: sy2, stroke: 'currentColor', 'stroke-width': 2 }, g);
      if (dur === 'e') {
        const d = opp
          ? 'M' + sx + ',' + sy2 + ' c0,14 16,16 13,36 c-1,-12 -8,-16 -13,-18 z'
          : 'M' + sx + ',' + sy2 + ' c0,-14 -16,-16 -13,-36 c1,12 8,16 13,18 z';
        el('path', { d: d, fill: 'currentColor' }, g);
      }
    }

    const noteGrupper = [];
    notes.forEach(function (nt, i) {
      const g = el('g', { class: 'note', 'data-i': i }, svg);
      const x = xAv(i);
      tegnNote(g, x, nt.pos, nt.dur || 'q', FARGE[nt.tilstand] || FARGE.normal);
      if (nt.label) {
        const t = el('text', { x: x, y: Ht - 8, 'text-anchor': 'middle', class: 'staff-notenavn' }, svg);
        t.textContent = nt.label;
      }
      if (o.velg) {
        const hit = el('rect', { x: x - 26, y: y(nt.pos) - 20, width: 52, height: 40, fill: 'transparent', style: 'cursor:pointer' }, g);
        hit.addEventListener('click', function () { o.velg(i, nt); });
        g.classList.add('valgbar');
      }
      noteGrupper.push({ g: g, x: x, nt: nt });
    });

    // klikkbare posisjoner (plasser/trykk)
    const api = {
      el: svg,
      posY: y,
      settNote: function (i, tilstand) {
        const gr = noteGrupper[i];
        if (!gr) return;
        gr.g.style.color = FARGE[tilstand] || FARGE.normal;
        gr.g.setAttribute('data-tilstand', tilstand);
      },
      plasser: function (pos, tilstand, dur) {
        api.fjernPlassert();
        const g = el('g', { class: 'plassert' }, svg);
        const x = x0 + (W - x0) / 2;
        tegnNote(g, x, pos, dur || 'q', FARGE[tilstand] || FARGE.hl);
      },
      fasit: function (pos) {
        const g = el('g', { class: 'plassert fasit', opacity: 0.65 }, svg);
        tegnNote(g, x0 + (W - x0) / 2 + 70, pos, 'q', FARGE.ok);
      },
      fjernPlassert: function () {
        svg.querySelectorAll('.plassert').forEach(function (e) { e.remove(); });
      }
    };

    if (o.klikk) {
      const r = o.klikk.omraade || [0, 8];
      const ghost = el('g', { class: 'ghost', opacity: 0.55 }, svg);
      const xMid = x0 + (W - x0) / 2;
      for (let p = r[0]; p <= r[1]; p++) {
        const rect = el('rect', { x: x0 - 20, y: y(p) - H / 2, width: W - x0 + 14, height: H, fill: 'transparent', class: 'sone', 'data-pos': p, style: 'cursor:pointer' }, svg);
        rect.addEventListener('pointerenter', function () {
          if (svg.classList.contains('laast')) return;
          ghost.innerHTML = '';
          tegnNote(ghost, xMid, p, 'q', FARGE.ghost);
        });
        rect.addEventListener('pointerleave', function () { ghost.innerHTML = ''; });
        rect.addEventListener('click', function () {
          if (svg.classList.contains('laast')) return;
          ghost.innerHTML = '';
          o.klikk.paa(p);
        });
      }
    }
    return api;
  }

  return {
    NAVN: NAVN, SEMI: SEMI, FARGE: FARGE,
    posTilTone: posTilTone, toneTilPos: toneTilPos, midi: midi, posMidi: posMidi,
    bokstav: bokstav, erLinje: erLinje, posNavn: posNavn, antallHjelpelinjer: antallHjelpelinjer,
    nokkelNavn: nokkelNavn, referansePos: referansePos, referanseBokstav: referanseBokstav,
    renderStaff: renderStaff, el: el
  };
})();
