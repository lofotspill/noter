/* Oppgaver: visuelle elementer, oppgavetyper, kjøreren og generatorer */
const Oppgaver = (function () {
  const Typer = {};
  const Gen = {};

  function $(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function blande(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = b[i]; b[i] = b[j]; b[j] = t;
    }
    return b;
  }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function velg(a) { return a[Math.floor(Math.random() * a.length)]; }
  function unike(n, lav, hoy, unntatt) {
    const alle = [];
    for (let i = lav; i <= hoy; i++) if (!unntatt || unntatt.indexOf(i) < 0) alle.push(i);
    return blande(alle).slice(0, n);
  }

  /* ---------- Visuelle elementer (brukes i info, eksempler og oppgaver) ---------- */
  function visuell(spec, ctx) {
    const clef = spec.nokkel || (ctx && ctx.clef) || 'G';
    const boks = $('div', 'visuell');
    if (spec.type === 'noter') {
      const noter = (spec.noter || []).map(function (n) { return Object.assign({}, n); });
      const st = Noter.renderStaff({
        clef: clef, notes: noter, markerLinjer: spec.markerLinjer, posEtiketter: spec.posEtiketter,
        klav: spec.klav, width: spec.bredde, skala: spec.skala, gap: spec.gap, range: spec.omraade, alt: spec.alt
      });
      boks.appendChild(st.el);
      if (spec.spill && noter.length) {
        const knapp = $('button', 'liten spill', '▶ Spill av');
        knapp.onclick = function () {
          const midier = noter.map(function (n) { return Noter.posMidi(n.pos, clef); });
          Lyd.rekke(midier, {
            steg: spec.steg || 0.55, notesystem: true,
            paaTone: function (i) {
              st.settNote(i, 'hl');
              setTimeout(function () { st.settNote(i, noter[i].tilstand || 'normal'); }, (spec.steg || 0.55) * 900);
            }
          });
        };
        boks.appendChild(knapp);
      }
    } else if (spec.type === 'trapp') {
      const rad = $('div', 'trapp');
      const blink = function (e) { e.classList.add('spiller'); setTimeout(function () { e.classList.remove('spiller'); }, 380); };
      spec.toner.forEach(function (m, i) {
        const trinn = $('button', 'trinn', spec.etiketter ? spec.etiketter[i] : '');
        trinn.style.height = (46 + i * (spec.hoydesteg || 14)) + 'px';
        trinn.setAttribute('aria-label', 'Spill tone ' + (i + 1) + ' av ' + spec.toner.length);
        trinn.onclick = function () { Lyd.spill(m, { notesystem: true, dur: 0.9 }); blink(trinn); };
        rad.appendChild(trinn);
      });
      boks.appendChild(rad);
      if (spec.lavhoy) boks.appendChild($('div', 'trapp-akse', '<span>← lavere</span><span>høyere →</span>'));
      const knapp = $('button', 'liten spill', '▶ Spill oppover');
      knapp.onclick = function () {
        Lyd.rekke(spec.toner, { steg: 0.5, notesystem: true, paaTone: function (i) { blink(rad.children[i]); } });
      };
      boks.appendChild(knapp);
    } else if (spec.type === 'flere') {
      boks.classList.add('flere');
      spec.liste.forEach(function (s) {
        const rad = $('div', 'flere-rad');
        if (s.tittel) rad.appendChild($('div', 'flere-tittel', s.tittel));
        rad.appendChild(visuell(s, ctx));
        boks.appendChild(rad);
      });
    } else if (spec.type === 'html') {
      boks.innerHTML = spec.html;
    }
    return boks;
  }

  /* ---------- Oppgavetyper ---------- */
  function bokstavKnapper(k, harSvar, hvaSomHelst) {
    const rad = $('div', 'bokstaver');
    Noter.NAVN.forEach(function (l) {
      const b = $('button', 'bokstav', l);
      b.onclick = function () { hvaSomHelst(l, b, rad); };
      rad.appendChild(b);
    });
    k.appendChild(rad);
    return rad;
  }
  function merkRiktigBokstav(rad, l) {
    rad.querySelectorAll('button').forEach(function (b) { if (b.textContent === l) b.classList.add('ok'); });
  }

  Typer.valg = function (t, k, api) {
    if (t.visuell) k.appendChild(visuell(t.visuell, api));
    if (t.spill) {
      const spill = function () { Lyd.rekke(t.spill, { steg: t.steg || 0.8, dur: 0.7 }); };
      const knapp = $('button', 'liten spill', '▶ Spill av');
      knapp.onclick = spill;
      k.appendChild(knapp);
      setTimeout(function () { if (Lyd.klar()) spill(); }, 300);
    }
    const liste = $('div', 'valgliste');
    let valg = t.valg.map(function (tekst, i) { return { tekst: tekst, i: i }; });
    if (t.bland !== false) valg = blande(valg);
    const riktige = [].concat(t.riktig);
    valg.forEach(function (v) {
      const b = $('button', 'valg', v.tekst);
      b.dataset.i = v.i;
      b.onclick = function () {
        const ok = riktige.indexOf(v.i) >= 0;
        liste.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
        b.classList.add(ok ? 'ok' : 'bad');
        if (!ok && api.visFasit()) {
          liste.querySelectorAll('button').forEach(function (x) { if (riktige.indexOf(+x.dataset.i) >= 0) x.classList.add('ok'); });
        }
        api.svar(ok, t.forklaring);
      };
      liste.appendChild(b);
    });
    k.appendChild(liste);
  };
  Typer.lytt = Typer.valg;

  Typer.navn = function (t, k, api) {
    const clef = t.nokkel || api.clef;
    const st = Noter.renderStaff({ clef: clef, notes: [{ pos: t.pos }], width: 300, skala: 1.25, alt: 'En note i notesystemet' });
    k.appendChild(st.el);
    const hor = $('button', 'liten spill', '▶ Hør tonen');
    hor.onclick = function () { Lyd.spill(Noter.posMidi(t.pos, clef), { notesystem: true }); };
    k.appendChild(hor);
    const riktig = Noter.bokstav(t.pos, clef);
    const rad = bokstavKnapper(k, false, function (l, b) {
      const ok = l === riktig;
      rad.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
      b.classList.add(ok ? 'ok' : 'bad');
      st.settNote(0, ok ? 'ok' : 'bad');
      if (!ok && api.visFasit()) merkRiktigBokstav(rad, riktig);
      if (ok) Lyd.spill(Noter.posMidi(t.pos, clef), { notesystem: true });
      api.svar(ok, t.forklaring || ('Noten står på ' + Noter.posNavn(t.pos) + ' i ' + Noter.nokkelNavn(clef) + ' – det er <b>' + riktig + '</b>.'));
    });
  };

  Typer.klikk = function (t, k, api) {
    const clef = t.nokkel || api.clef;
    const omr = t.omraade || [0, 8];
    let mal = t.mal;
    if (!mal && t.bokstav) {
      mal = [];
      for (let p = omr[0]; p <= omr[1]; p++) if (Noter.bokstav(p, clef) === t.bokstav) mal.push(p);
    }
    const st = Noter.renderStaff({
      clef: clef, notes: [], range: omr, width: t.bredde || 420, skala: 1.3, markerLinjer: t.markerLinjer,
      alt: 'Tomt notesystem – trykk der noten skal stå',
      klikk: {
        omraade: omr,
        paa: function (p) {
          const ok = mal.indexOf(p) >= 0;
          st.el.classList.add('laast');
          st.plasser(p, ok ? 'ok' : 'bad');
          if (!ok && api.visFasit()) st.fasit(mal[0]);
          if (ok) Lyd.spill(Noter.posMidi(p, clef), { notesystem: true });
          api.svar(ok, t.forklaring || (t.bokstav
            ? ('Tonen <b>' + t.bokstav + '</b> finnes her på ' + mal.map(function (p2) { return Noter.posNavn(p2); }).join(' og ') + '.')
            : null));
        }
      }
    });
    k.appendChild(st.el);
    k.appendChild($('div', 'smaa', 'Trykk på linjen eller mellomrommet der noten skal stå.'));
  };

  Typer.velgnote = function (t, k, api) {
    const clef = t.nokkel || api.clef;
    let ferdig = false;
    const st = Noter.renderStaff({
      clef: clef, notes: t.posisjoner.map(function (p) { return { pos: p }; }), gap: 96, skala: 1.2,
      alt: 'Noter å velge mellom',
      velg: function (i) {
        if (ferdig) return;
        ferdig = true;
        const ok = i === t.riktig;
        st.settNote(i, ok ? 'ok' : 'bad');
        if (!ok && api.visFasit()) st.settNote(t.riktig, 'ok');
        api.svar(ok, t.forklaring);
      }
    });
    k.appendChild(st.el);
    k.appendChild($('div', 'smaa', 'Trykk på noten du mener er riktig.'));
  };

  Typer.velgmonster = function (t, k, api) {
    const clef = t.nokkel || api.clef;
    const midier = t.monstre[t.riktig].map(function (p) { return Noter.posMidi(p, clef); });
    const spill = function () { Lyd.rekke(midier, { steg: 0.75, dur: 0.65, notesystem: true }); };
    const knapp = $('button', 'liten spill', '▶ Spill av melodien');
    knapp.onclick = spill;
    k.appendChild(knapp);
    setTimeout(function () { if (Lyd.klar()) spill(); }, 300);
    const rad = $('div', 'monsterrad');
    let ferdig = false;
    t.monstre.forEach(function (m, i) {
      const kort = $('button', 'monster');
      const st = Noter.renderStaff({ clef: clef, notes: m.map(function (p) { return { pos: p }; }), gap: 46, skala: 0.95, alt: 'Alternativ ' + (i + 1) });
      kort.appendChild(st.el);
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

  /* ---------- Kjøreren ---------- */
  const OK_LINJER = ['Riktig!', 'Det stemmer.', 'Bra jobbet.', 'Akkurat.', 'Ja – den satt.'];
  const FEIL_LINJER = ['Ikke helt.', 'Nesten.', 'Der snublet du litt – det gjør alle.', 'Ikke den denne gangen.'];

  function kjor(container, oppgaver, opt) {
    const modus = opt.modus || 'selvstendig';           // veiledet | selvstendig | test
    const ko = oppgaver.map(function (o) { return Object.assign({}, o); });
    const res = { riktig: 0, svart: 0, forsok: 0, feil: 0 };
    let idx = 0;

    function nesteOppgave() {
      if (idx >= ko.length) { opt.onFerdig(res); return; }
      vis(ko[idx]);
    }

    function vis(t) {
      container.innerHTML = '';
      if (window.__NOTER_TEST) window.__oppgave = { t: t, clef: opt.clef };
      const kort = $('div', 'oppgavekort modus-' + modus);
      const total = ko.length;
      const topp = $('div', 'oppg-topp');
      topp.appendChild($('span', 'oppg-teller', 'Oppgave ' + (idx + 1) + ' av ' + total + (t.gjentatt ? ' · en gang til' : '')));
      const bar = $('div', 'bar'); const fyll = $('div', 'bar-fyll'); fyll.style.width = (idx / total * 100) + '%'; bar.appendChild(fyll);
      topp.appendChild(bar);
      kort.appendChild(topp);
      kort.appendChild($('h3', 'spm', t.spm || ''));
      const kropp = $('div', 'oppg-kropp');
      const hintBoks = $('div', 'hintboks');
      const tilb = $('div', 'tilbakemelding');
      const knapper = $('div', 'knapper');
      kort.appendChild(kropp);
      kort.appendChild(hintBoks);
      kort.appendChild(tilb);
      kort.appendChild(knapper);
      container.appendChild(kort);

      let forsokHer = 0;
      let ferdigMedDenne = false;

      const api = {
        clef: opt.clef,
        modus: modus,
        visFasit: function () { return modus !== 'veiledet' || forsokHer >= 1; },
        svar: function (ok, forklaring) {
          if (ferdigMedDenne) return;
          forsokHer++;
          res.forsok++;
          knapper.innerHTML = '';
          tilb.innerHTML = '';
          const boks = $('div', 'tilb ' + (ok ? 'tilb-ok' : 'tilb-feil'));
          const tekst = ok ? velg(OK_LINJER) : velg(FEIL_LINJER);
          boks.innerHTML = '<div class="tilb-lunde">' + (window.lundeSvg ? window.lundeSvg(40) : '') + '</div><div><b>' + tekst + '</b> ' + (forklaring || '') + '</div>';
          if (ok) Lyd.riktig(); else Lyd.feil();
          tilb.appendChild(boks);

          const erForste = !t.gjentatt && forsokHer === 1;
          if (modus === 'veiledet' && !ok && forsokHer < 2) {
            // gi ett forsøk til
            const igjen = $('button', 'primaer', 'Prøv igjen');
            igjen.onclick = function () { tilb.innerHTML = ''; knapper.innerHTML = ''; bygg(); visHint(true); };
            knapper.appendChild(igjen);
            igjen.focus();
            return;
          }
          ferdigMedDenne = true;
          if (erForste) {
            res.svart++;
            if (ok) res.riktig++; else res.feil++;
            if (opt.paaSvar) opt.paaSvar(t, ok);
          }
          if (modus === 'selvstendig' && !ok && !t.gjentatt) {
            ko.push(Object.assign({}, t, { gjentatt: true }));
          }
          const neste = $('button', 'primaer', idx + 1 >= ko.length ? 'Se resultat →' : 'Neste →');
          neste.onclick = function () { idx++; nesteOppgave(); };
          knapper.appendChild(neste);
          neste.focus();
        }
      };

      function bygg() {
        kropp.innerHTML = '';
        Typer[t.type](t, kropp, api);
      }
      function visHint(automatisk) {
        if (!t.hint || modus === 'test') return;
        hintBoks.innerHTML = '<div class="hint"><b>Hint:</b> ' + t.hint + '</div>';
        if (automatisk) hintBoks.firstChild.classList.add('hint-auto');
      }
      bygg();
      if (t.hint && modus === 'veiledet') {
        const hintKnapp = $('button', 'sekundaer liten', 'Vis hint');
        hintKnapp.onclick = function () { visHint(false); hintKnapp.remove(); };
        hintBoks.appendChild(hintKnapp);
      }
      kort.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    nesteOppgave();
  }

  /* ---------- Generatorer ---------- */
  Gen.lytt = function (n, lett) {
    const ut = [];
    for (let i = 0; i < n; i++) {
      let a, b;
      do { a = rnd(52, 76); b = rnd(52, 76); } while (Math.abs(a - b) < (lett ? 6 : 3));
      const hoyest = Math.random() < 0.6;
      const riktig = hoyest ? (b > a ? 1 : 0) : (b < a ? 1 : 0);
      ut.push({
        type: 'lytt', spm: 'Hvilken tone klinger <b>' + (hoyest ? 'høyest' : 'lavest') + '</b>?',
        spill: [a, b], steg: 0.9, valg: ['Den første', 'Den andre'], riktig: riktig, bland: false,
        hint: 'Høye toner klinger lyse og tynne, lave toner mørke og tykke. Trykk «Spill av» så mange ganger du vil.',
        forklaring: 'Den ' + (b > a ? 'andre' : 'første') + ' tonen var høyest.'
      });
    }
    return ut;
  };

  Gen.velgnote = function (n, antall) {
    const ut = [];
    for (let i = 0; i < n; i++) {
      const pos = unike(antall || 3, 0, 8);
      const p = pos;
      const hoyest = Math.random() < 0.5;
      const m = hoyest ? Math.max.apply(null, p) : Math.min.apply(null, p);
      ut.push({
        type: 'velgnote', spm: 'Trykk på den <b>' + (hoyest ? 'høyeste' : 'laveste') + '</b> noten.',
        posisjoner: p, riktig: p.indexOf(m),
        hint: 'Sammenlign hvor høyt oppe notehodene sitter. Det er plasseringen som teller – ikke fargen eller størrelsen.',
        forklaring: 'Den ' + (hoyest ? 'høyeste' : 'laveste') + ' noten er den som sitter ' + (hoyest ? 'høyest opp' : 'lavest ned') + '.'
      });
    }
    return ut;
  };

  Gen.monster = function (n) {
    const konturer = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
    function lag(kontur) {
      for (let forsok = 0; forsok < 50; forsok++) {
        const start = rnd(1, 7);
        const s1 = kontur[0] * rnd(1, 3), s2 = kontur[1] * rnd(1, 3);
        const p = [start, start + s1, start + s1 + s2];
        if (p.every(function (x) { return x >= 0 && x <= 8; })) return p;
      }
      return kontur[0] > 0 ? [2, 4, kontur[1] > 0 ? 6 : 3] : [6, 4, kontur[1] > 0 ? 6 : 2];
    }
    const ut = [];
    for (let i = 0; i < n; i++) {
      const valgte = blande(konturer).slice(0, 3);
      const monstre = valgte.map(lag);
      const riktig = rnd(0, 2);
      ut.push({
        type: 'velgmonster', spm: 'Hør melodien. Hvilket notebilde passer?', monstre: monstre, riktig: riktig,
        hint: 'Lytt etter om tonen går opp eller ned mellom hver note, og se på hvordan notene stiger og faller.',
        forklaring: 'Melodien beveger seg i samme retning som notene: høyere opp i systemet = høyere tone.'
      });
    }
    return ut;
  };

  Gen.klikkPos = function (n, clef, lav, hoy) {
    const ut = [];
    const pos = unike(n, lav == null ? 0 : lav, hoy == null ? 8 : hoy);
    pos.forEach(function (p) {
      ut.push({
        type: 'klikk', spm: 'Trykk på <b>' + Noter.posNavn(p) + '</b>.', mal: [p],
        hint: 'Tell alltid nedenfra: nederste linje er 1. linje, mellomrommet over den er 1. mellomrom, så 2. linje, og så videre.',
        forklaring: 'Slik teller du: nedenfra og opp – linje, mellomrom, linje, mellomrom …'
      });
    });
    return ut;
  };

  Gen.identifiser = function (n, clef) {
    const ut = [];
    unike(n, 0, 8).forEach(function (p) {
      const alle = [];
      for (let q = 0; q <= 8; q++) if (q !== p) alle.push(q);
      const feil = blande(alle).slice(0, 3);
      const valg = [Noter.posNavn(p)].concat(feil.map(Noter.posNavn));
      ut.push({
        type: 'valg', spm: 'Hvor står denne noten?', visuell: { type: 'noter', noter: [{ pos: p }], bredde: 260 },
        valg: valg, riktig: 0,
        hint: 'Se først om notehodet har linje gjennom seg (linje) eller ligger mellom to linjer (mellomrom). Tell så nedenfra.',
        forklaring: 'Noten står på <b>' + Noter.posNavn(p) + '</b>.'
      });
    });
    return ut;
  };

  Gen.linjeEllerMellomrom = function (n) {
    const ut = [];
    unike(n, 0, 8).forEach(function (p) {
      ut.push({
        type: 'valg', spm: 'Står noten <b>på en linje</b> eller <b>i et mellomrom</b>?',
        visuell: { type: 'noter', noter: [{ pos: p }], bredde: 260 }, valg: ['På en linje', 'I et mellomrom'],
        riktig: Noter.erLinje(p) ? 0 : 1, bland: false,
        hint: 'Går det en linje rett gjennom notehodet, står noten på linjen.',
        forklaring: Noter.erLinje(p) ? 'Linjen går gjennom notehodet – da står noten på en linje.' : 'Notehodet ligger mellom to linjer – da står noten i et mellomrom.'
      });
    });
    return ut;
  };

  function sti(fra, til, clef) {
    const bokst = [];
    const retn = til >= fra ? 1 : -1;
    for (let p = fra; p !== til + retn; p += retn) bokst.push(Noter.bokstav(p, clef));
    return { tekst: bokst.join(' → '), opp: retn > 0 };
  }
  function navnHint(pos, clef) {
    const ref = Noter.referansePos(clef);
    const s = sti(ref, pos, clef);
    if (pos === ref) return 'Dette er linja nøkkelen din markerer: <b>' + Noter.referanseBokstav(clef) + '</b>.';
    return 'Utgangspunkt: ' + Noter.nokkelNavn(clef) + ' markerer ' + Noter.posNavn(ref) + ' = tonen <b>' + Noter.referanseBokstav(clef) +
      '</b>. Tell ' + (s.opp ? 'oppover' : 'nedover') + ' i alfabetet, ett trinn for hver linje og hvert mellomrom: ' + s.tekst + '.';
  }
  Gen.navn = function (n, clef, lav, hoy, medHint) {
    const ut = [];
    unike(n, lav, hoy).forEach(function (p) {
      ut.push({
        type: 'navn', pos: p, spm: 'Hva heter denne tonen?',
        hint: navnHint(p, clef)
      });
    });
    return ut;
  };

  Gen.navnPos = function (posListe, clef) {
    return posListe.map(function (p) {
      return { type: 'navn', pos: p, spm: 'Hva heter denne tonen?', hint: navnHint(p, clef) };
    });
  };

  Gen.plasser = function (n, clef, lav, hoy) {
    const ut = [];
    const kandidater = [];
    for (let p = lav; p <= hoy; p++) kandidater.push(p);
    blande(kandidater).slice(0, n).forEach(function (p) {
      const l = Noter.bokstav(p, clef);
      const antall = kandidater.filter(function (q) { return Noter.bokstav(q, clef) === l; }).length;
      ut.push({
        type: 'klikk', bokstav: l, omraade: [lav, hoy], bredde: 440,
        spm: 'Sett en note på tonen <b>' + l + '</b>.' + (antall > 1 ? ' <span class="smaa">Det finnes flere riktige steder – velg ett.</span>' : ''),
        hint: navnHint(p, clef)
      });
    });
    return ut;
  };

  Gen.alfabet = function (n) {
    const N = Noter.NAVN;
    const ut = [];
    for (let i = 0; i < n; i++) {
      const t = i % 3;
      const a = rnd(0, 6);
      let spm, fasit, forkl;
      if (t === 0) { spm = 'Hvilken tone kommer <b>etter</b> ' + N[a] + '?'; fasit = N[(a + 1) % 7]; forkl = 'Rekken er C D E F G A H – og så C igjen. Etter ' + N[a] + ' kommer ' + fasit + '.'; }
      else if (t === 1) { spm = 'Hvilken tone kommer <b>rett før</b> ' + N[a] + '?'; fasit = N[(a + 6) % 7]; forkl = 'Rekken er C D E F G A H – og så C igjen. Rett før ' + N[a] + ' kommer ' + fasit + '.'; }
      else { spm = 'Hvilken tone ligger <b>mellom</b> ' + N[a] + ' og ' + N[(a + 2) % 7] + '?'; fasit = N[(a + 1) % 7]; forkl = 'Mellom ' + N[a] + ' og ' + N[(a + 2) % 7] + ' ligger ' + fasit + '.'; }
      const valg = [fasit];
      blande(N.filter(function (x) { return x !== fasit; })).slice(0, 3).forEach(function (x) { valg.push(x); });
      ut.push({ type: 'valg', spm: spm, valg: valg, riktig: 0, forklaring: forkl, hint: 'Si rekken for deg selv: C D E F G A H C D E …' });
    }
    return ut;
  };

  /* «Trykk på tonen X» – velg riktig note blant fire, kun med notesystemet */
  Gen.velgNavn = function (n, clef, lav, hoy) {
    const ut = [];
    for (let i = 0; i < n; i++) {
      const alle = [];
      for (let p = lav; p <= hoy; p++) alle.push(p);
      const valgte = [];
      const sett = {};
      blande(alle).forEach(function (p) {
        const l = Noter.bokstav(p, clef);
        if (valgte.length < 4 && !sett[l]) { sett[l] = true; valgte.push(p); }
      });
      valgte.sort(function (a, b) { return a - b; });
      const idx = rnd(0, valgte.length - 1);
      const mal = valgte[idx];
      const l = Noter.bokstav(mal, clef);
      ut.push({
        type: 'velgnote', posisjoner: valgte, riktig: idx,
        spm: 'Trykk på tonen <b>' + l + '</b>.',
        hint: navnHint(mal, clef),
        forklaring: '<b>' + l + '</b> står på ' + Noter.posNavn(mal) + ' i ' + Noter.nokkelNavn(clef) + '.'
      });
    }
    return ut;
  };

  Gen.hjelpelinjer = function (n) {
    const ut = [];
    const posisjoner = [-4, -3, -2, -1, 9, 10, 11, 12];
    blande(posisjoner).slice(0, n).forEach(function (p) {
      const a = Noter.antallHjelpelinjer(p);
      ut.push({
        type: 'valg', spm: 'Hvor mange <b>hjelpelinjer</b> trenger denne noten?',
        visuell: { type: 'noter', noter: [{ pos: p }], bredde: 260 }, valg: ['Ingen', 'En', 'To'], riktig: a, bland: false,
        hint: 'Hjelpelinjene fortsetter systemets linjer utover, og trengs bare for å komme fram til noten.',
        forklaring: a === 0 ? 'Noten ligger i mellomrommet like utenfor systemet – ingen hjelpelinje trengs.' : 'Noten trenger ' + (a === 1 ? 'én hjelpelinje' : 'to hjelpelinjer') + ' for å nå fram.'
      });
    });
    return ut;
  };

  return { Typer: Typer, Gen: Gen, navnHint: navnHint, sti: sti, kjor: kjor, visuell: visuell, blande: blande, rnd: rnd, velg: velg, unike: unike, $: $ };
})();
