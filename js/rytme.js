/* Rytme: rytmelinje (én linje), avspilling med metronom, «trykk i takt»-oppgaver og generatorer.
   Element: { v: 'w'|'h'|'q'|'e', pause: bool, punkt: bool, bind: bool (bundet til neste), tilstand }
   Slag regnes i fjerdedeler (kvartnote = 1 slag). */
const Rytme = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  const SP = 20;
  const FARGE = { ok: '#2f8f6b', bad: '#c9496f', hl: '#2e6577', normal: '#2a2f3a', dempet: '#8a96a3' };
  const VERDI = { w: 4, h: 2, q: 1, e: 0.5 };
  const NAVN = { w: 'hel', h: 'halv', q: 'kvart', e: 'åttedels' };
  const $ = Oppgaver.$;

  function el(navn, attr, forelder) {
    const e = document.createElementNS(NS, navn);
    if (attr) for (const k in attr) e.setAttribute(k, attr[k]);
    if (forelder) forelder.appendChild(e);
    return e;
  }
  function slag(x) { return VERDI[x.v] * (x.punkt ? 1.5 : 1); }
  function navn(x) { return (x.punkt ? 'punktert ' : '') + NAVN[x.v] + (x.pause ? 'pause' : 'note'); }
  function sum(liste) { return liste.reduce(function (a, x) { return a + slag(x); }, 0); }
  function slagPerTakt(takt) { return takt ? takt[0] * 4 / takt[1] : 4; }

  /* Kort skrivemåte: 'q q h~ | h. q' – bokstav = verdi, '.' = punktert, '~' = bundet til neste, r foran = pause */
  function fra(tekst) {
    const ut = [];
    tekst.split(/\s+/).forEach(function (tok) {
      if (!tok || tok === '|') return;
      let pause = false;
      if (tok[0] === 'r') { pause = true; tok = tok.slice(1); }
      const x = { v: tok[0], pause: pause };
      if (tok.indexOf('.') > 0) x.punkt = true;
      if (tok.indexOf('~') > 0) x.bind = true;
      ut.push(x);
    });
    return ut;
  }
  function kopi(liste) { return liste.map(function (x) { return Object.assign({}, x); }); }

  /* ---------------- Tegning ---------------- */
  function tegnHode(g, cx, cy, v) {
    if (v === 'w') {
      el('ellipse', { cx: cx, cy: cy, rx: 13, ry: 9, fill: 'currentColor' }, g);
      el('ellipse', { cx: cx, cy: cy, rx: 4.8, ry: 7.2, fill: '#fff', transform: 'rotate(-35 ' + cx + ' ' + cy + ')' }, g);
      return;
    }
    const h = el('ellipse', { cx: cx, cy: cy, rx: 11.2, ry: 8.1, transform: 'rotate(-18 ' + cx + ' ' + cy + ')' }, g);
    if (v === 'h') { h.setAttribute('fill', '#fff'); h.setAttribute('stroke', 'currentColor'); h.setAttribute('stroke-width', 2.6); }
    else h.setAttribute('fill', 'currentColor');
  }
  function tegnPause(g, cx, cy, v) {
    const k = SP / GLYFER.SP;
    if (v === 'w') { el('rect', { x: cx - 11, y: cy, width: 22, height: 9, fill: 'currentColor' }, g); return; }
    if (v === 'h') { el('rect', { x: cx - 11, y: cy - 9, width: 22, height: 9, fill: 'currentColor' }, g); return; }
    const gl = GLYFER[v === 'q' ? 'pause_fire' : 'pause_atte'];
    const b = gl.b;
    const s = k * 0.95;
    const mx = (b[0] + b[2]) / 2, my = (b[1] + b[3]) / 2;
    el('path', { d: gl.d, fill: 'currentColor', transform: 'translate(' + (cx - mx * s) + ',' + (cy + my * s) + ') scale(' + s + ',' + (-s) + ')' }, g);
  }

  function render(o) {
    o = o || {};
    const elem = o.elementer || [];
    const takt = o.takt || null;
    const bpt = slagPerTakt(takt);
    const visTegn = takt && o.visTaktTegn !== false;
    const medBarlinjer = !!takt;
    const kompakt = !!o.kompakt;
    const startX = visTegn ? 62 : (kompakt ? 4 : 24);
    const items = [];
    const barX = [];
    let x = startX, pos = 0, barSlutt = false;
    elem.forEach(function (e, i) {
      const b = slag(e);
      const w = 34 + 26 * b;
      items.push({ i: i, cx: kompakt ? x + w / 2 : x + 18, pos: pos, b: b });
      x += w; pos += b;
      if (medBarlinjer && Math.abs(pos / bpt - Math.round(pos / bpt)) < 1e-6) {
        barX.push(x - 6); barSlutt = i === elem.length - 1;
        x += 12;
      }
    });
    const W = x + (kompakt ? 6 : 14);
    const yL = kompakt ? 70 : 84, H = o.tell ? 150 : (kompakt ? 100 : 130);
    const skala = o.skala || 1;
    const bredde = o.bredde ? Math.min(o.bredde, W * skala) : W * skala;
    const vy = kompakt ? 14 : 0, vh = kompakt ? 80 : H;
    const svg = el('svg', { viewBox: '0 ' + vy + ' ' + W + ' ' + vh, width: bredde, height: bredde * vh / W, role: 'img', 'aria-label': o.alt || 'Rytme', class: 'rytmelinje' });
    svg.style.maxWidth = '100%';
    // linje
    el('line', { x1: kompakt ? 0 : 8, x2: kompakt ? W : W - 6, y1: yL, y2: yL, stroke: '#44505f', 'stroke-width': 1.6 }, svg);
    // taktstreker
    barX.forEach(function (bx, n) {
      const siste = n === barX.length - 1;
      el('line', { x1: bx, x2: bx, y1: yL - 22, y2: yL + 22, stroke: '#2a2f3a', 'stroke-width': 1.8 }, svg);
      if (siste && barSlutt && o.sluttstrek !== false) el('line', { x1: bx + 5, x2: bx + 5, y1: yL - 22, y2: yL + 22, stroke: '#2a2f3a', 'stroke-width': 5 }, svg);
    });
    // taktart
    if (visTegn) {
      [takt[0], takt[1]].forEach(function (tall, n) {
        const t = el('text', { x: 30, y: yL + (n === 0 ? -4 : 25), 'text-anchor': 'middle', 'font-family': 'Georgia, serif', 'font-weight': 'bold', 'font-size': 33, fill: '#2a2f3a' }, svg);
        t.textContent = tall;
      });
    }
    const grupper = [];
    // bjelker for åttedeler
    const bjelke = {};
    for (let i = 0; i < elem.length - 1; i++) {
      const a = elem[i], b2 = elem[i + 1];
      if (a.v === 'e' && b2.v === 'e' && !a.pause && !b2.pause && Math.abs(items[i].pos - Math.round(items[i].pos)) < 1e-6 && !bjelke[i - 1]) {
        bjelke[i] = true;
      }
    }
    elem.forEach(function (e, i) {
      const it = items[i];
      const g = el('g', { class: 'rnote', 'data-i': i }, svg);
      g.style.color = FARGE[e.tilstand] || FARGE.normal;
      const cx = it.cx;
      if (e.pause) {
        tegnPause(g, cx, yL, e.v);
      } else {
        tegnHode(g, cx, yL, e.v);
        if (e.v !== 'w') {
          const sx = cx + 10.2, topp = yL - 54;
          el('line', { x1: sx, x2: sx, y1: yL - 2, y2: topp, stroke: 'currentColor', 'stroke-width': 2 }, g);
          if (e.v === 'e') {
            if (bjelke[i]) {
              const nx = items[i + 1].cx + 10.2;
              el('line', { x1: sx - 1, x2: nx + 1, y1: topp + 2, y2: topp + 2, stroke: 'currentColor', 'stroke-width': 6 }, g);
            } else if (!(i > 0 && bjelke[i - 1])) {
              el('path', { d: 'M' + sx + ',' + topp + ' c0,14 16,16 13,36 c-1,-12 -8,-16 -13,-18 z', fill: 'currentColor' }, g);
            }
          }
        }
      }
      if (e.punkt) el('circle', { cx: cx + (e.v === 'w' ? 20 : 19), cy: yL - 6, r: 2.8, fill: 'currentColor' }, g);
      // bindebue til neste note
      if (e.bind && items[i + 1]) {
        const x1 = cx + 5, x2 = items[i + 1].cx - 5;
        el('path', { d: 'M' + x1 + ',' + (yL + 14) + ' Q' + ((x1 + x2) / 2) + ',' + (yL + 34) + ' ' + x2 + ',' + (yL + 14), fill: 'none', stroke: 'currentColor', 'stroke-width': 2.2 }, g);
      }
      grupper.push(g);
    });
    // tellestreker
    if (o.tell) {
      elem.forEach(function (e, i) {
        const it = items[i];
        const innen = takt ? it.pos - Math.floor(it.pos / bpt + 1e-9) * bpt : it.pos;
        const hel = Math.abs(innen - Math.round(innen)) < 1e-6;
        const t = el('text', { x: it.cx, y: H - 8, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, fill: hel ? '#2e6577' : '#c9496f' }, svg);
        t.textContent = hel ? String(Math.round(innen) + 1) : 'og';
      });
    }
    return {
      el: svg, items: items,
      sett: function (i, tilstand) { if (grupper[i]) grupper[i].style.color = FARGE[tilstand] || FARGE.normal; }
    };
  }

  /* Liten enkeltnote/pause (til kort og søyler) */
  function mini(v, pause, hoyde) {
    const r = render({ elementer: [{ v: v, pause: !!pause }], kompakt: true, sluttstrek: false });
    return r.el;
  }

  /* ---------------- Avspilling ---------------- */
  function planlegg(elem, opt) {
    const bpm = opt.bpm || 72;
    const s = 60 / bpm;
    const bpt = slagPerTakt(opt.takt);
    const inn = opt.innlegg ? bpt : 0;
    const ons = [];
    const lyd = [];
    let pos = 0;
    elem.forEach(function (e, i) {
      const fort = i > 0 && elem[i - 1].bind;
      if (!e.pause && !fort) {
        let len = slag(e), j = i;
        while (elem[j].bind && elem[j + 1]) { j++; len += slag(elem[j]); }
        ons.push({ i: i, beat: pos, len: len });
      }
      pos += slag(e);
    });
    const total = pos;
    if (opt.noter !== false) {
      ons.forEach(function (o) {
        lyd.push({ t: (inn + o.beat) * s, midi: 76, dur: Math.min(1.2, Math.max(0.12, o.len * s * 0.9)), vol: 0.22 });
      });
    }
    if (opt.metronom !== false) {
      const antall = Math.ceil(total + inn - 1e-9) + (opt.etterslag || 0);
      for (let k = 0; k < antall; k++) {
        const sterk = bpt > 0 && (k % bpt === 0);
        lyd.push({ t: k * s, midi: sterk ? 100 : 93, dur: 0.05, vol: sterk ? 0.14 : 0.09 });
      }
    }
    return { s: s, bpt: bpt, inn: inn, ons: ons, total: total, lyd: lyd, bpm: bpm };
  }

  let timere = [];
  function stopp() { timere.forEach(clearTimeout); timere = []; Lyd.stopp(); }
  function etter(ms, f) { timere.push(setTimeout(f, Math.max(0, ms))); }

  /* Spiller rytmen. opt: bpm, takt, innlegg, metronom, noter, paaNote(i), paaSlag(k, sterk), ferdig() */
  function spill(elem, opt) {
    opt = opt || {};
    stopp();
    const p = planlegg(elem, opt);
    const start = Lyd.planlegg(p.lyd);
    const perf = start ? start.perf : performance.now() + 120;
    const naa = performance.now();
    p.ons.forEach(function (o) {
      etter(perf - naa + (p.inn + o.beat) * p.s * 1000, function () { if (opt.paaNote) opt.paaNote(o.i); });
    });
    const antall = Math.ceil(p.total + p.inn - 1e-9);
    for (let k = 0; k < antall; k++) {
      etter(perf - naa + k * p.s * 1000, function () { if (opt.paaSlag) opt.paaSlag(k, p.bpt > 0 && k % p.bpt === 0, k < p.inn); });
    }
    etter(perf - naa + (p.inn + p.total) * p.s * 1000 + 250, function () { if (opt.ferdig) opt.ferdig(); });
    p.perf = perf;
    return p;
  }

  /* ---------------- Visuelle typer ---------------- */
  Oppgaver.Vis.rytme = function (spec, boks) {
    const r = render({ elementer: kopi(spec.elementer), takt: spec.takt, tell: spec.tell, bredde: spec.bredde, skala: spec.skala, visTaktTegn: spec.visTaktTegn, alt: spec.alt });
    boks.appendChild(r.el);
    if (spec.spill !== false) {
      const k = $('button', 'liten spill', '▶ Hør rytmen');
      k.onclick = function () {
        spill(spec.elementer, {
          bpm: spec.bpm || 72, takt: spec.takt, innlegg: spec.innlegg !== false,
          paaNote: function (i) { r.sett(i, 'hl'); setTimeout(function () { r.sett(i, spec.elementer[i].tilstand || 'normal'); }, 260); }
        });
      };
      boks.appendChild(k);
    }
  };

  /* Klikkspor: knapper som spiller jevne klikk i ulikt tempo */
  Oppgaver.Vis.klikkspor = function (spec, boks) {
    const rad = $('div', 'klikkrad');
    spec.spor.forEach(function (sp) {
      const k = $('button', 'liten spill', '▶ ' + sp.tittel);
      k.onclick = function () {
        stopp();
        const s = 60 / sp.bpm, items = [];
        for (let i = 0; i < sp.antall; i++) items.push({ t: i * s, midi: i % (sp.takt || 4) === 0 && sp.sterk ? 100 : 93, dur: 0.05, vol: 0.14 });
        Lyd.planlegg(items);
      };
      rad.appendChild(k);
    });
    boks.appendChild(rad);
  };

  /* Metronom: pulserende slag, justerbart tempo */
  Oppgaver.Vis.metronom = function (spec, boks) {
    const vis = $('div', 'puls-boks');
    const prikker = $('div', 'puls-prikker');
    const bpt = spec.slagPerTakt || 4;
    for (let i = 0; i < bpt; i++) prikker.appendChild($('span', 'puls-prikk' + (i === 0 && spec.sterk ? ' sterk' : ''), String(i + 1)));
    vis.appendChild(prikker);
    let bpm = spec.bpm || 72, gaar = false, teller = 0, tim = null;
    const tekst = $('div', 'puls-tekst', '');
    const glider = $('input'); glider.type = 'range'; glider.min = 40; glider.max = 160; glider.value = bpm; glider.setAttribute('aria-label', 'Tempo');
    const knapp = $('button', 'liten spill', '▶ Start');
    function oppdater() {
      const ord = bpm < 60 ? 'langsomt' : bpm < 90 ? 'rolig' : bpm < 120 ? 'moderat' : 'raskt';
      tekst.innerHTML = '<b>' + bpm + '</b> slag i minuttet <span class="dempet">(' + ord + ')</span>';
    }
    function tikk() {
      if (!gaar) return;
      if (!boks.isConnected) { gaar = false; return; }
      const k = teller % bpt;
      Lyd.metronom(null, k === 0);
      prikker.querySelectorAll('.puls-prikk').forEach(function (p, i) { p.classList.toggle('paa', i === k); });
      teller++;
      tim = setTimeout(tikk, 60000 / bpm);
    }
    knapp.onclick = function () {
      gaar = !gaar;
      knapp.textContent = gaar ? '■ Stopp' : '▶ Start';
      clearTimeout(tim);
      prikker.querySelectorAll('.puls-prikk').forEach(function (p) { p.classList.remove('paa'); });
      if (gaar) { teller = 0; Lyd.metronom(); tikk(); }
    };
    glider.oninput = function () { bpm = +glider.value; oppdater(); };
    oppdater();
    boks.appendChild(vis);
    boks.appendChild(tekst);
    if (!spec.fast) boks.appendChild(glider);
    boks.appendChild(knapp);
  };

  /* Verdibar: hvordan noteverdiene deler en hel takt */
  Oppgaver.Vis.verdibar = function (spec, boks) {
    const rader = spec.rader || [{ v: 'w', n: 1 }, { v: 'h', n: 2 }, { v: 'q', n: 4 }, { v: 'e', n: 8 }];
    const tab = $('div', 'verdibar');
    rader.forEach(function (r) {
      const rad = $('div', 'vb-rad');
      rad.appendChild($('div', 'vb-navn', (r.pause ? '' : '') + NAVN[r.v] + (r.pause ? 'pause' : 'note') + '<small>' + (VERDI[r.v] === 0.5 ? '½' : VERDI[r.v]) + ' slag</small>'));
      const rekke = $('div', 'vb-rekke');
      for (let i = 0; i < r.n; i++) {
        const c = $('button', 'vb-celle');
        c.style.flex = '1';
        c.appendChild(mini(r.v, r.pause, 70));
        c.setAttribute('aria-label', navn({ v: r.v, pause: r.pause }));
        c.onclick = function () {
          Lyd.spill(76, { dur: Math.min(1.0, VERDI[r.v] * 0.5), vol: 0.22 });
          c.classList.add('spiller'); setTimeout(function () { c.classList.remove('spiller'); }, 250);
        };
        rekke.appendChild(c);
      }
      rad.appendChild(rekke);
      tab.appendChild(rad);
    });
    boks.appendChild(tab);
    boks.appendChild($('div', 'smaa', 'Hver rad er like lang: én hel takt (4 slag). Trykk på en rute for å høre.'));
  };

  /* ---------------- Oppgavetyper ---------------- */
  function resultatTekst(treff, mangler, ekstra) {
    const d = [];
    d.push('Du traff ' + treff + ' av ' + (treff + mangler) + ' slag.');
    if (ekstra > 0) d.push('Du trykket ' + (ekstra === 1 ? 'én gang' : ekstra + ' ganger') + ' der det ikke skulle være et slag (for eksempel på en pause eller midt i en lang note).');
    return d.join(' ');
  }

  /* tapp: trykk i takt */
  Oppgaver.Typer.tapp = function (t, k, api) {
    const elem = kopi(t.elementer);
    const bpm = t.bpm || 72;
    const r = render({ elementer: elem, takt: t.takt, tell: t.tell !== false, bredde: t.bredde || 560 });
    k.appendChild(r.el);
    const plan = planlegg(elem, { bpm: bpm, takt: t.takt, innlegg: true, noter: false, metronom: true });
    const status = $('div', 'tapp-status', 'Trykk «Start». Du får en takt inntelling, så trykker du på hvert slag.');
    const hor = $('button', 'liten spill', '▶ Hør først');
    hor.onclick = function () {
      if (aktiv) return;
      spill(elem, {
        bpm: bpm, takt: t.takt, innlegg: true,
        paaNote: function (i) { r.sett(i, 'hl'); setTimeout(function () { r.sett(i, 'normal'); }, 240); }
      });
    };
    const start = $('button', 'primaer', 'Start');
    const pad = $('button', 'tapp-pad', 'Trykk her');
    pad.disabled = true;
    const rad = $('div', 'knapperad');
    rad.appendChild(hor); rad.appendChild(start);
    k.appendChild(rad);
    k.appendChild(status);
    k.appendChild($('div', 'smaa', 'Du kan også bruke mellomromstasten.'));
    k.appendChild(pad);

    let aktiv = false, ferdig = false, taps = [], perf0 = 0;

    function trykk(tid) {
      if (!aktiv) return;
      taps.push(tid);
      Lyd.spill(81, { dur: 0.1, vol: 0.2 });
      pad.classList.add('treff'); setTimeout(function () { pad.classList.remove('treff'); }, 90);
    }
    pad.addEventListener('pointerdown', function (e) { e.preventDefault(); trykk(performance.now()); });
    function tast(e) {
      if (!k.isConnected) { document.removeEventListener('keydown', tast); return; }
      if (e.code === 'Space' && aktiv) { e.preventDefault(); if (!e.repeat) trykk(performance.now()); }
    }
    document.addEventListener('keydown', tast);

    function vurder(tapListe) {
      aktiv = false; ferdig = true;
      document.removeEventListener('keydown', tast);
      pad.disabled = true; start.disabled = true; hor.disabled = true;
      const s = plan.s;
      const tol = Math.max(0.24, 0.4 * s) * 1000;
      const brukt = tapListe.map(function () { return false; });
      let treff = 0;
      plan.ons.forEach(function (o) {
        const mal = perf0 + (plan.inn + o.beat) * s * 1000;
        let best = -1, bd = 1e9;
        tapListe.forEach(function (tp, j) { const d = Math.abs(tp - mal); if (!brukt[j] && d <= tol && d < bd) { bd = d; best = j; } });
        if (best >= 0) { brukt[best] = true; treff++; r.sett(o.i, 'ok'); } else r.sett(o.i, 'bad');
      });
      const mangler = plan.ons.length - treff;
      const ekstra = brukt.filter(function (b, j) { return !b && tapListe[j] > perf0 + (plan.inn - 0.5) * s * 1000; }).length;
      const store = plan.ons.length >= 6;
      const ok = mangler <= (store ? 1 : 0) && ekstra <= (store ? 1 : 0);
      status.textContent = '';
      api.svar(ok, resultatTekst(treff, mangler, ekstra) + (ok ? '' : ' Prøv å telle høyt: «1 – 2 – 3 – 4».'));
    }

    start.onclick = function () {
      if (aktiv || ferdig) return;
      stopp();
      aktiv = true; taps = [];
      start.disabled = true; hor.disabled = true; pad.disabled = false;
      const p = spill(elem, {
        bpm: bpm, takt: t.takt, innlegg: true, noter: false, metronom: true,
        paaSlag: function (kk, sterk, innt) {
          if (innt) status.innerHTML = 'Tell inn: <b>' + (kk + 1) + '</b>';
          else status.innerHTML = 'Nå! <span class="dempet">(slag ' + (kk - plan.inn + 1) + ')</span>';
          pad.classList.toggle('sterk', sterk);
        },
        ferdig: function () { vurder(taps.slice()); }
      });
      perf0 = p.perf;
    };

    if (window.__NOTER_TEST) {
      window.__tappSim = function (ok) {
        perf0 = performance.now();
        aktiv = true;
        const liste = [];
        plan.ons.forEach(function (o, n) {
          if (!ok && n === 0) return;
          liste.push(perf0 + (plan.inn + o.beat) * plan.s * 1000 + 10);
        });
        vurder(liste);
      };
    }
  };

  /* velgrytme: hør en rytme, velg riktig notasjon */
  Oppgaver.Typer.velgrytme = function (t, k, api) {
    const rett = t.alternativer[t.riktig];
    const spillAv = function () { spill(rett, { bpm: t.bpm || 72, takt: t.takt, innlegg: true }); };
    const knapp = $('button', 'liten spill', '▶ Spill av rytmen');
    knapp.onclick = spillAv;
    k.appendChild(knapp);
    setTimeout(function () { if (Lyd.klar() && k.isConnected) spillAv(); }, 300);
    const rad = $('div', 'monsterrad rytmerad');
    let ferdig = false;
    t.alternativer.forEach(function (alt, i) {
      const kort = $('button', 'monster');
      kort.appendChild(render({ elementer: kopi(alt), takt: t.takt, bredde: 380, sluttstrek: false }).el);
      kort.onclick = function () {
        if (ferdig) return;
        ferdig = true;
        const ok = i === t.riktig;
        kort.classList.add(ok ? 'ok' : 'bad');
        if (!ok && api.visFasit()) rad.children[t.riktig].classList.add('ok');
        api.svar(ok, t.forklaring);
      };
      rad.appendChild(kort);
    });
    k.appendChild(rad);
  };

  /* ---------------- Generatorer ---------------- */
  const rnd = Oppgaver.rnd, velg = Oppgaver.velg, blande = Oppgaver.blande;

  /* Lager én takt som fyller bpt slag. o: tillat (['q','h','w','e']), pauser (0..1), punkt (bool) */
  function lagTakt(bpt, o) {
    o = o || {};
    const tillat = o.tillat || ['q', 'h'];
    const ut = [];
    let rest = bpt, pos = 0, forsok = 0;
    while (rest > 1e-9 && forsok++ < 50) {
      const val = [];
      if (tillat.indexOf('w') >= 0 && pos === 0 && rest === 4) val.push({ g: [{ v: 'w' }], vekt: 1 });
      if (tillat.indexOf('h') >= 0 && rest >= 2 && (bpt === 4 ? pos % 2 === 0 : pos % 1 === 0)) val.push({ g: [{ v: 'h' }], vekt: 2 });
      if (tillat.indexOf('q') >= 0 && rest >= 1) val.push({ g: [{ v: 'q' }], vekt: 4 });
      if (tillat.indexOf('e') >= 0 && rest >= 1 && pos % 1 === 0) val.push({ g: [{ v: 'e' }, { v: 'e' }], vekt: 3 });
      if (o.punkt && rest >= 3 && pos === 0 && bpt >= 3) val.push({ g: [{ v: 'h', punkt: true }], vekt: 2 });
      if (o.punkt && rest >= 2 && pos % 1 === 0) val.push({ g: [{ v: 'q', punkt: true }, { v: 'e' }], vekt: 2 });
      if (!val.length) break;
      const sum2 = val.reduce(function (a, v) { return a + v.vekt; }, 0);
      let x = Math.random() * sum2, valgt = val[0];
      for (let i = 0; i < val.length; i++) { x -= val[i].vekt; if (x <= 0) { valgt = val[i]; break; } }
      const g = valgt.g.map(function (e) { return Object.assign({}, e); });
      if (o.pauser && g.length === 1 && Math.random() < o.pauser && g[0].v !== 'w' && ut.length + 1 > 0) g[0].pause = true;
      g.forEach(function (e) { ut.push(e); rest -= slag(e); pos += slag(e); });
    }
    if (ut.every(function (e) { return e.pause; })) ut[0].pause = false;
    return ut;
  }
  function lagRytme(antallTakter, bpt, o) {
    let ut = [];
    for (let i = 0; i < antallTakter; i++) ut = ut.concat(lagTakt(bpt, o));
    return ut;
  }
  function nøkkel(elem) { return elem.map(function (e) { return e.v + (e.pause ? 'r' : '') + (e.punkt ? '.' : '') + (e.bind ? '~' : ''); }).join(' '); }
  // hørbar signatur (pauser og noter høres likt ut når bare tidspunkt teller)
  function lyd(elem) {
    const p = planlegg(elem, { bpm: 60, metronom: false });
    return p.ons.map(function (o) { return o.beat + ':' + o.len; }).join(',');
  }

  const G = Oppgaver.Gen;

  G.tapp = function (n, o) {
    o = o || {};
    const ut = [];
    const taktart = o.takt || [4, 4];
    const bpt = slagPerTakt(taktart);
    for (let i = 0; i < n; i++) {
      ut.push({
        type: 'tapp', spm: o.spm || 'Trykk rytmen i takt', takt: taktart, bpm: o.bpm || 66, tell: o.tell !== false,
        elementer: o.elementer ? kopi(velg(o.elementer)) : lagRytme(o.takter || 2, bpt, o),
        hint: o.hint || 'Tell høyt sammen med metronomen. Trykk akkurat når en note begynner – og ikke på pausene.',
        forklaring: o.forklaring || ''
      });
    }
    return ut;
  };

  /* Hør en rytme og velg riktig notasjon. */
  G.hoerRytme = function (n, o) {
    o = o || {};
    const taktart = o.takt || [4, 4], bpt = slagPerTakt(taktart);
    const ut = [];
    let sikring = 0;
    while (ut.length < n && sikring++ < 200) {
      const alt = [];
      const sett = {};
      let f = 0;
      while (alt.length < 3 && f++ < 100) {
        const r = lagRytme(o.takter || 1, bpt, o);
        const kn = lyd(r);
        if (!sett[kn]) { sett[kn] = true; alt.push(r); }
      }
      if (alt.length < 3) continue;
      ut.push({
        type: 'velgrytme', spm: 'Hvilken rytme hører du?', takt: taktart, bpm: o.bpm || 72, alternativer: alt, riktig: rnd(0, 2),
        hint: 'Hør etter hvor mange toner du får på hvert slag – og hvor det er stille.',
        forklaring: 'Lyden er laget av noter og pauser; sammenlign med notasjonen slag for slag.'
      });
      // plasser det riktige alternativet på tilfeldig plass uten å endre listen
    }
    return ut;
  };

  function valgOppg(spm, visuell, valg, riktig, hint, forklaring) {
    return { type: 'valg', spm: spm, visuell: visuell, valg: valg, riktig: riktig, bland: false, hint: hint, forklaring: forklaring };
  }
  function slagTekst(b) {
    if (b === 0.5) return 'Et halvt slag';
    if (b === 1) return '1 slag';
    return (b % 1 ? String(b).replace('.', ',') : b) + ' slag';
  }
  G.verdi = function (n, o) {
    o = o || {};
    const verdier = blande(o.verdier || ['w', 'h', 'q', 'e']);
    const ut = [];
    for (let i = 0; i < n; i++) {
      const v = verdier[i % verdier.length];
      const pause = !!o.pause;
      const alle = [0.5, 1, 2, 4];
      ut.push(valgOppg(
        'Hvor mange slag varer ' + (pause ? 'denne pausen' : 'denne noten') + '?',
        { type: 'rytme', elementer: [{ v: v, pause: pause }], spill: false, bredde: 120 },
        alle.map(slagTekst), alle.indexOf(VERDI[v]),
        'Husk: kvartnoten (fylt hode, hals) er ett slag. Hel er fire, halv er to.',
        'En ' + navn({ v: v, pause: pause }) + ' varer ' + slagTekst(VERDI[v]).toLowerCase() + '.'));
    }
    return ut;
  };
  G.noteNavn = function (n, o) {
    o = o || {};
    const pause = !!o.pause;
    const verdier = blande(['w', 'h', 'q', 'e']);
    const ut = [];
    for (let i = 0; i < n; i++) {
      const v = verdier[i % 4];
      const valg = ['w', 'h', 'q', 'e'].map(function (x) { return navn({ v: x, pause: pause }); });
      ut.push(valgOppg('Hva heter ' + (pause ? 'denne pausen' : 'denne noten') + '?', { type: 'rytme', elementer: [{ v: v, pause: pause }], spill: false, bredde: 120 },
        valg, ['w', 'h', 'q', 'e'].indexOf(v),
        pause ? 'Helpausen henger under linjen, halvpausen sitter oppå linjen.' : 'Hel: åpent hode uten hals. Halv: åpent hode med hals. Kvart: fylt hode med hals. Åttedel: fylt hode med hals og flagg.',
        'Dette er en ' + navn({ v: v, pause: pause }) + '.'));
    }
    return ut;
  };
  G.sum = function (n, o) {
    o = o || {};
    const ut = [];
    for (let i = 0; i < n; i++) {
      let elem, s2, f = 0;
      do {
        elem = [];
        const antall = rnd(2, 3);
        for (let j = 0; j < antall; j++) elem.push({ v: velg(o.verdier || ['h', 'q', 'q', 'w']), pause: o.pause ? Math.random() < 0.5 : false });
        s2 = sum(elem);
      } while ((s2 > 7 || s2 < 2) && f++ < 50);
      const alle = [s2 - 1, s2, s2 + 1, s2 + 2].filter(function (x) { return x >= 1; });
      const uniq = alle.slice(0, 4);
      ut.push(valgOppg('Hvor mange slag varer disse til sammen?', { type: 'rytme', elementer: elem, spill: false, bredde: 360 },
        uniq.map(slagTekst), uniq.indexOf(s2), 'Legg sammen: ' + elem.map(function (e) { return slag(e); }).join(' + ') + '.',
        elem.map(function (e) { return slag(e); }).join(' + ') + ' = ' + s2 + ' slag.'));
    }
    return ut;
  };
  G.fyllTakt = function (n, o) {
    o = o || {};
    const takt = o.takt || [4, 4], bpt = slagPerTakt(takt);
    const ut = [];
    for (let i = 0; i < n; i++) {
      let elem, rest, f = 0;
      do {
        elem = lagTakt(bpt, { tillat: ['q', 'h'], pauser: o.pauser || 0 });
        // fjern siste element(er) slik at resten er 1, 2 eller 3 slag
        const fjern = rnd(1, Math.min(2, elem.length - 1));
        elem = elem.slice(0, elem.length - fjern);
        rest = bpt - sum(elem);
      } while ((rest < 1 || rest > 3 || (rest === 3 && !o.punkt)) && f++ < 60);
      const pause = !!o.pause || Math.random() < (o.pauser || 0) / 2;
      const kand = o.punkt ? [{ v: 'q' }, { v: 'h' }, { v: 'h', punkt: true }, { v: 'w' }] : [{ v: 'q' }, { v: 'h' }, { v: 'w' }];
      const rettIndeks = rest === 1 ? 0 : rest === 2 ? 1 : 2;
      const valg = kand.map(function (x) { return navn({ v: x.v, punkt: x.punkt, pause: pause }); });
      ut.push(valgOppg('Hva mangler på slutten av takten?',
        { type: 'rytme', elementer: elem, takt: takt, spill: false, bredde: 460, sluttstrek: false },
        valg, rettIndeks, 'Telle slagene som er brukt: ' + sum(elem) + ' av ' + bpt + '. Hvor mange slag er igjen?',
        'Det er brukt ' + sum(elem) + ' slag og takten har ' + bpt + ', så det mangler ' + slagTekst(rest).toLowerCase() + ': ' + valg[rettIndeks] + '.'));
    }
    return ut;
  };
  G.antallITakt = function (n) {
    const ut = [];
    const alle = [[2, 4], [3, 4], [4, 4]];
    for (let i = 0; i < n; i++) {
      const t = alle[i % 3];
      const elem = lagRytme(2, slagPerTakt(t), { tillat: ['q', 'h'] });
      ut.push(valgOppg('Hvor mange slag er det i hver takt?', { type: 'rytme', elementer: elem, takt: t, spill: false, bredde: 520 },
        ['2 slag', '3 slag', '4 slag'], t[0] - 2, 'Se på det øverste tallet i taktarten.',
        'Det øverste tallet (' + t[0] + ') sier hvor mange slag det er i hver takt.'));
    }
    return blande(ut);
  };
  G.taktart = function (n) {
    const ut = [];
    const alle = [[2, 4], [3, 4], [4, 4]];
    for (let i = 0; i < n; i++) {
      const t = alle[i % 3];
      const elem = lagRytme(2, slagPerTakt(t), { tillat: ['q', 'h'] });
      ut.push(valgOppg('Hvilken taktart passer? (Tell slagene mellom taktstrekene.)',
        { type: 'rytme', elementer: elem, takt: t, visTaktTegn: false, spill: false, bredde: 520 },
        ['2/4', '3/4', '4/4'], t[0] - 2, 'Tell hvor mange slag det er mellom to taktstreker.', 'Det er ' + t[0] + ' slag i hver takt – altså ' + t[0] + '/4.'));
    }
    return blande(ut);
  };
  G.taktFull = function (n) {
    const ut = [];
    for (let i = 0; i < n; i++) {
      const takt = velg([[3, 4], [4, 4]]);
      const bpt = slagPerTakt(takt);
      const mode = i % 3; // 0 riktig, 1 for få, 2 for mange
      let elem = lagTakt(bpt, { tillat: ['q', 'h'] });
      if (mode === 1) { elem = elem.slice(0, elem.length - 1); if (sum(elem) === bpt) elem.pop(); }
      if (mode === 2) elem = elem.concat([{ v: 'q' }]);
      const s2 = sum(elem);
      const rettIdx = s2 === bpt ? 1 : s2 < bpt ? 0 : 2;
      // tegn uten automatiske taktstreker: én takt som ser ut til å være hele
      const tegn = { type: 'rytme', elementer: elem, takt: [20, 4], visTaktTegn: false, spill: false, bredde: 420, sluttstrek: false };
      ut.push(valgOppg('Taktarten er <b>' + takt[0] + '/4</b>. Stemmer antall slag i denne takten?',
        { type: 'flere', liste: [{ type: 'html', html: '<div class="takt-merk">Taktart ' + takt[0] + '/4 – ' + takt[0] + ' slag i takten</div>' }, tegn] },
        ['For få slag', 'Riktig', 'For mange slag'], rettIdx, 'Legg sammen slagene i takten og sammenlign med ' + takt[0] + '.',
        'Takten har ' + s2 + ' slag; den skal ha ' + takt[0] + '.'));
    }
    return blande(ut);
  };
  G.punktSlag = function (n) {
    const ut = [];
    const v = [{ v: 'h', punkt: true }, { v: 'q', punkt: true }];
    for (let i = 0; i < n; i++) {
      const x = v[i % 2];
      const s2 = slag(x);
      const alle = [1, 1.5, 2, 3];
      ut.push(valgOppg('Hvor mange slag varer denne noten?', { type: 'rytme', elementer: [x], spill: false, bredde: 130 },
        alle.map(slagTekst), alle.indexOf(s2), 'Punktet gir noten halvparten av sin egen verdi til.',
        'Punktet legger til halvparten: ' + VERDI[x.v] + ' + ' + VERDI[x.v] / 2 + ' = ' + String(s2).replace('.', ',') + ' slag.'));
    }
    return blande(ut);
  };
  G.bindSlag = function (n) {
    const pool = [
      ['q q h~ | h q q', 4], ['q q q q~ | h q q', 3], ['h q q~ | q q h', 2],
      ['q q h~ | q h q', 3], ['w~ | q q h', 5], ['q q h~ | h h', 4]
    ];
    const ut = [];
    const valg = blande(pool).slice(0, n);
    valg.forEach(function (p) {
      const elem = fra(p[0]);
      // finn første bundne par: bind-lengde
      let i = 0; while (!elem[i].bind) i++;
      let len = slag(elem[i]), j = i;
      while (elem[j].bind && elem[j + 1]) { j++; len += slag(elem[j]); }
      const sett = [2, 3, 4, 5].filter(function (x) { return x !== len; }).slice(0, 3).concat([len]).sort();
      elem.forEach(function (e, ix) { if (ix >= i && ix <= j) e.tilstand = 'hl'; });
      ut.push(valgOppg('Hvor mange slag varer den bundne tonen (de merkede notene)?',
        { type: 'rytme', elementer: elem, takt: [4, 4], spill: false, bredde: 560 },
        sett.map(slagTekst), sett.indexOf(len), 'Bindebuen sier: spill én lang tone. Legg sammen verdiene.',
        'Legg sammen: ' + len + ' slag, spilt som én tone uten å starte på nytt.'));
    });
    return ut;
  };
  G.pauseHva = function (n) {
    const ut = [];
    for (let i = 0; i < n; i++) {
      const r = lagRytme(1, 4, { tillat: ['q', 'h'], pauser: 0.6 });
      if (!r.some(function (e) { return e.pause; })) r[r.length - 1].pause = true;
      const stille = r.filter(function (e) { return e.pause; }).reduce(function (a, e) { return a + slag(e); }, 0);
      const alle = [1, 2, 3, 4];
      ut.push(valgOppg('Hvor mange slag er det <b>stille</b> i denne takten?', { type: 'rytme', elementer: r, takt: [4, 4], spill: false, bredde: 420, tell: true },
        alle.map(slagTekst), alle.indexOf(stille), 'Legg sammen verdiene på pausene – ikke på notene.', 'Pausene varer til sammen ' + slagTekst(stille).toLowerCase() + '.'));
    }
    return ut;
  };

  return { render: render, mini: mini, spill: spill, stopp: stopp, fra: fra, lagTakt: lagTakt, lagRytme: lagRytme, slag: slag, navn: navn, planlegg: planlegg, kopi: kopi, VERDI: VERDI };
})();
