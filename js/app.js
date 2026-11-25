/* App: visninger, leksjonsspiller, repetisjon, fremdrift og innstillinger */
(function () {
  const $ = Oppgaver.$;
  const app = document.getElementById('app');
  const navKnapper = {};

  /* ---------- Lunde (lundefugl) ---------- */
  window.lundeSvg = function (s) {
    s = s || 64;
    return '<svg viewBox="0 0 100 100" width="' + s + '" height="' + s + '" role="img" aria-label="Lunde, lundefuglen">' +
      '<ellipse cx="50" cy="96" rx="26" ry="3" fill="#00000012"/>' +
      '<path d="M30 89 q-1 7 -10 7 q4 -3 5 -7z M30 89 q4 7 10 7 q-4 -4 -4 -7z M70 89 q1 7 10 7 q-4 -3 -5 -7z M70 89 q-4 7 -10 7 q4 -4 4 -7z" fill="#f0883e"/>' +
      '<ellipse cx="50" cy="70" rx="28" ry="23" fill="#1f2a37"/>' +
      '<ellipse cx="50" cy="76" rx="17" ry="17" fill="#fffaf3"/>' +
      '<path d="M23 62 q-8 14 3 26 q5 -12 4 -24z M77 62 q8 14 -3 26 q-5 -12 -4 -24z" fill="#171f29"/>' +
      '<circle cx="50" cy="42" r="27" fill="#1f2a37"/>' +
      '<ellipse cx="50" cy="45" rx="22" ry="17" fill="#f6f1ea"/>' +
      '<path d="M30 40 l-6 -2 l2 8z M70 40 l6 -2 l-2 8z" fill="#8f98a3"/>' +
      '<circle cx="39" cy="40" r="5" fill="#ee5a36"/><circle cx="61" cy="40" r="5" fill="#ee5a36"/>' +
      '<circle cx="39" cy="40" r="2.6" fill="#1f2a37"/><circle cx="61" cy="40" r="2.6" fill="#1f2a37"/>' +
      '<path d="M30 47 Q50 36 70 47 L65 55 Q50 47 35 55 Z" fill="#8fb0c4"/>' +
      '<path d="M35 55 Q50 47 65 55 L58 66 Q50 61 42 66 Z" fill="#f6c744"/>' +
      '<path d="M42 66 Q50 61 58 66 L50 77 Z" fill="#ee5a36"/>' +
      '</svg>';
  };

  /* ---------- Hjelpere ---------- */
  function profil() { return Lagring.profil(); }
  function clef() { return profil().nokkel || 'G'; }
  function ctx() { return { clef: clef(), profil: profil() }; }
  function brukLyd() {
    Lyd.sett({ paa: profil().lyd !== false, offset: (profil().klingende && clef() === 'G') ? -14 : 0 });
  }
  function fornavn() { return (profil().navn || '').split(' ')[0]; }
  function stjernerHtml(n) {
    let s = '';
    for (let i = 1; i <= 3; i++) s += i <= n ? '★' : '<span class="tom">★</span>';
    return s;
  }
  function tid(sek) {
    sek = Math.round(sek);
    if (sek < 60) return sek + ' s';
    return Math.floor(sek / 60) + ' min ' + (sek % 60) + ' s';
  }
  function rydd() { app.innerHTML = ''; window.scrollTo(0, 0); Lyd.stopp(); }
  function settNav(navn) {
    Object.keys(navKnapper).forEach(function (k) { navKnapper[k].classList.toggle('aktiv', k === navn); });
  }
  function laast(l) {
    if (profil().laasOpp) return false;
    const alle = Leksjoner.alle();
    const i = alle.indexOf(l);
    if (i <= 0) return false;
    const fr = Lagring.fremdrift(alle[i - 1].id);
    return !(fr && fr.ferdig);
  }
  function nesteLeksjon() {
    const alle = Leksjoner.alle();
    for (let i = 0; i < alle.length; i++) {
      const fr = Lagring.fremdrift(alle[i].id);
      if (!(fr && fr.ferdig) && !laast(alle[i])) return alle[i];
    }
    return null;
  }

  /* ---------- Toppfelt ---------- */
  function byggTopp() {
    const topp = document.getElementById('topp');
    topp.innerHTML = '';
    const inn = $('div', 'topp-inn');
    const logo = $('button', 'logo', window.lundeSvg(30) + '<span>' + KONFIG.appNavn + '</span>');
    logo.onclick = visHjem;
    inn.appendChild(logo);
    const nav = $('div', 'nav');
    [['hjem', 'Hjem', visHjem], ['rep', 'Repetisjon', startRepetisjon], ['teori', 'Teori', visTeori],
     ['fremdrift', 'Fremdrift', visFremdrift], ['innst', 'Innstillinger', function () { visInnstillinger(false); }]].forEach(function (n) {
      const b = $('button', '', n[1]);
      b.onclick = n[2];
      navKnapper[n[0]] = b;
      nav.appendChild(b);
    });
    inn.appendChild(nav);
    topp.appendChild(inn);
  }

  /* ---------- Hjem ---------- */
  function visHjem() {
    rydd(); settNav('hjem'); brukLyd();
    const p = profil();
    const alle = Leksjoner.alle();
    const ferdigeAntall = alle.filter(function (l) { const f = Lagring.fremdrift(l.id); return f && f.ferdig; }).length;
    const neste = nesteLeksjon();

    const hilsen = $('div', 'kort rosa hilsen');
    hilsen.innerHTML = window.lundeSvg(84);
    const tekst = $('div');
    const nytt = ferdigeAntall === 0;
    tekst.innerHTML = '<h1>' + (p.navn ? 'Hei, ' + fornavn() + '!' : 'Hei!') + '</h1>' +
      '<p>' + (nytt
        ? 'Her lærer du å lese noter fra grunnen av. Hver leksjon tar 8–12 minutter: først en forklaring, så et gjennomgått eksempel, så øving med hint, og til slutt en liten test.'
        : 'Du har fullført <b>' + ferdigeAntall + ' av ' + alle.length + '</b> tilgjengelige leksjoner. Gode små økter hver dag er mer effektive enn én lang.') + '</p>';
    if (neste) {
      const b = $('button', 'primaer', (nytt ? 'Start leksjon ' : 'Fortsett med leksjon ') + neste.nr + ': ' + neste.tittel);
      b.onclick = function () { startLeksjon(neste); };
      tekst.appendChild(b);
    }
    hilsen.appendChild(tekst);
    app.appendChild(hilsen);

    if (ferdigeAntall > 0) {
      const rep = $('div', 'kort hav');
      rep.innerHTML = '<h3>Daglig repetisjon</h3><p>Åtte spørsmål fra det du har lært – de du har slitt mest med kommer oftest. Det er repetisjon over tid som gjør at det sitter.</p>';
      const b = $('button', 'sekundaer', 'Start repetisjon');
      b.onclick = startRepetisjon;
      rep.appendChild(b);
      app.appendChild(rep);
    }

    Leksjoner.deler.forEach(function (del) {
      const t = $('div', 'del-tittel');
      t.innerHTML = '<h2>Del ' + del.nr + ': ' + del.tittel + '</h2><small>' + del.tekst + '</small>';
      app.appendChild(t);
      Leksjoner.plan.filter(function (x) { return x.del === del.nr; }).forEach(function (pl) {
        const l = Leksjoner.alle().filter(function (x) { return x.nr === pl.nr; })[0];
        const knapp = $('button', 'lekt');
        if (!l) {
          knapp.classList.add('snart');
          knapp.innerHTML = '<div class="nr">' + pl.nr + '</div><div class="tekst"><b>' + pl.tittel + '</b><span>Kommer snart</span></div><span class="merke">snart</span>';
          knapp.disabled = true;
        } else {
          const fr = Lagring.fremdrift(l.id);
          const erLaast = laast(l);
          if (fr && fr.ferdig) knapp.classList.add('ferdig');
          if (erLaast) knapp.classList.add('last');
          knapp.innerHTML = '<div class="nr">' + (fr && fr.ferdig ? '✓' : l.nr) + '</div><div class="tekst"><b>' + l.tittel + '</b><span>' + l.kort + ' · ca. ' + l.min + ' min</span></div>' +
            (erLaast ? '<span class="merke">låst</span>' : (fr && fr.ferdig ? '<span class="stjerner">' + stjernerHtml(fr.stjerner) + '</span>' : '<span class="merke ny">åpen</span>'));
          knapp.onclick = function () { if (!erLaast) startLeksjon(l); };
          if (erLaast) knapp.title = 'Fullfør forrige leksjon først (eller lås opp alt under Innstillinger)';
        }
        app.appendChild(knapp);
      });
    });
  }

  /* ---------- Første gangs oppsett / innstillinger ---------- */
  function radioGruppe(navn, valg, verdi, paaEndring) {
    const rad = $('div', 'valgrad');
    valg.forEach(function (v) {
      const lab = $('label', 'radio' + (v.verdi === verdi ? ' valgt' : ''));
      lab.style.margin = '0';
      const inp = $('input'); inp.type = 'radio'; inp.name = navn; inp.value = v.verdi; inp.checked = v.verdi === verdi;
      lab.appendChild(inp);
      const sp = $('span', '', v.tekst);
      lab.appendChild(sp);
      if (v.forhaand) { const fb = $('div'); fb.style.textAlign = 'center'; fb.appendChild(v.forhaand()); lab.appendChild(fb); }
      inp.onchange = function () {
        rad.querySelectorAll('.radio').forEach(function (r) { r.classList.remove('valgt'); });
        lab.classList.add('valgt');
        paaEndring(v.verdi);
      };
      rad.appendChild(lab);
    });
    return rad;
  }

  function visInnstillinger(forste) {
    rydd(); settNav(forste ? '' : 'innst');
    const p = Object.assign({}, profil());
    if (!p.nokkel) p.nokkel = 'G';
    const kort = $('div', 'kort');
    kort.innerHTML = '<h2>' + (forste ? 'Velkommen! Først noen få valg' : 'Innstillinger') + '</h2>' +
      (forste ? '<p>Dette tar ett minutt. Alt kan endres senere.</p>' : '');

    kort.appendChild($('label', '', 'Navn (brukes når fremdriften sendes inn)'));
    const navn = $('input'); navn.type = 'text'; navn.value = p.navn || ''; navn.placeholder = 'Fornavn og etternavn';
    kort.appendChild(navn);

    kort.appendChild($('label', '', 'Hvilken nøkkel står barytonnotene dine i?'));
    kort.appendChild(radioGruppe('nokkel', [
      { verdi: 'G', tekst: '<b>G-nøkkel</b><small>«Krøllen». Vanlig for baryton i korps (B-stemt, notert som trompet).</small>', forhaand: function () { return Noter.renderStaff({ clef: 'G', width: 120, skala: 0.8, gap: 10 }).el; } },
      { verdi: 'F', tekst: '<b>F-nøkkel</b><small>Ser ut som en 9-er med to prikker. Brukes når notene står i C (bassnøkkel).</small>', forhaand: function () { return Noter.renderStaff({ clef: 'F', width: 120, skala: 0.8, gap: 10 }).el; } }
    ], p.nokkel, function (v) { p.nokkel = v; }));
    kort.appendChild($('div', 'smaa', 'Usikker? Velg G-nøkkel og sjekk notene dine eller spør dirigenten – du kan bytte når som helst.'));

    kort.appendChild($('label', '', 'Antall ventiler på barytonen'));
    kort.appendChild(radioGruppe('ventiler', [
      { verdi: 3, tekst: '<b>Tre ventiler</b>' }, { verdi: 4, tekst: '<b>Fire ventiler</b>' }
    ], p.ventiler, function (v) { p.ventiler = +v; }));

    const lydLab = $('label', 'radio' + (p.lyd !== false ? ' valgt' : ''));
    lydLab.style.marginTop = '16px';
    const lyd = $('input'); lyd.type = 'checkbox'; lyd.checked = p.lyd !== false;
    lydLab.appendChild(lyd); lydLab.appendChild($('span', '', '<b>Lyd på</b><small>Toner og små lydeffekter.</small>'));
    lyd.onchange = function () { lydLab.classList.toggle('valgt', lyd.checked); };
    kort.appendChild(lydLab);

    const klLab = $('label', 'radio' + (p.klingende ? ' valgt' : ''));
    klLab.style.marginTop = '10px';
    const kl = $('input'); kl.type = 'checkbox'; kl.checked = !!p.klingende;
    klLab.appendChild(kl);
    klLab.appendChild($('span', '', '<b>Spill av klingende tone</b><small>Gjelder G-nøkkel: en B-stemt baryton klinger en none (14 halvtoner) lavere enn notene står. Slått av spilles tonen slik den står skrevet – enklest å begynne med.</small>'));
    kl.onchange = function () { klLab.classList.toggle('valgt', kl.checked); };
    kort.appendChild(klLab);

    let laasOpp = null;
    if (!forste) {
      const lLab = $('label', 'radio' + (p.laasOpp ? ' valgt' : ''));
      lLab.style.marginTop = '10px';
      laasOpp = $('input'); laasOpp.type = 'checkbox'; laasOpp.checked = !!p.laasOpp;
      lLab.appendChild(laasOpp);
      lLab.appendChild($('span', '', '<b>Lås opp alle leksjoner</b><small>Hvis du kan noe fra før og vil hoppe fritt mellom leksjonene.</small>'));
      laasOpp.onchange = function () { lLab.classList.toggle('valgt', laasOpp.checked); };
      kort.appendChild(lLab);
    }

    const rad = $('div', 'knapperad');
    const lagre = $('button', 'primaer', forste ? 'Start' : 'Lagre');
    lagre.onclick = function () {
      Lagring.settProfil({
        navn: navn.value.trim(), nokkel: p.nokkel, ventiler: p.ventiler, lyd: lyd.checked, klingende: kl.checked,
        laasOpp: laasOpp ? laasOpp.checked : profil().laasOpp
      });
      brukLyd();
      Lyd.klikk();
      visHjem();
    };
    rad.appendChild(lagre);
    const prov = $('button', 'sekundaer', '▶ Test lyden');
    prov.onclick = function () {
      Lyd.sett({ paa: lyd.checked, offset: (kl.checked && p.nokkel === 'G') ? -14 : 0 });
      Lyd.rekke([Noter.posMidi(0, p.nokkel), Noter.posMidi(2, p.nokkel), Noter.posMidi(4, p.nokkel)], { steg: 0.5, notesystem: true });
    };
    rad.appendChild(prov);
    kort.appendChild(rad);
    app.appendChild(kort);

    if (!forste) {
      const farlig = $('div', 'kort');
      farlig.innerHTML = '<h3>Fremdriftskode</h3><p class="dempet">Fremdriften lagres i denne nettleseren. Vil du flytte den til en annen enhet, kopier koden og lim den inn der.</p>';
      const ta = $('textarea'); ta.value = Lagring.eksporter(); ta.readOnly = false;
      farlig.appendChild(ta);
      const r2 = $('div', 'knapperad');
      const kopier = $('button', 'sekundaer', 'Kopier');
      kopier.onclick = function () { ta.select(); try { navigator.clipboard.writeText(ta.value); } catch (e) { document.execCommand('copy'); } };
      const last = $('button', 'sekundaer', 'Last inn kode');
      last.onclick = function () {
        if (Lagring.importer(ta.value)) { brukLyd(); visHjem(); } else alert('Koden kunne ikke leses.');
      };
      const nullst = $('button', 'sekundaer', 'Slett all fremdrift');
      nullst.onclick = function () {
        if (confirm('Dette sletter all fremdrift i denne nettleseren. Er du sikker?')) { Lagring.nullstill(); visInnstillinger(true); }
      };
      r2.appendChild(kopier); r2.appendChild(last); r2.appendChild($('div', 'avstand')); r2.appendChild(nullst);
      farlig.appendChild(r2);
      app.appendChild(farlig);
    }
  }

  /* ---------- Leksjonsspiller ---------- */
  function startLeksjon(l, fraSteg) {
    brukLyd();
    const c = ctx();
    let bygd = l.bygg(c);
    let steg = bygd.steg;
    let i = fraSteg || 0;
    let t0 = Date.now();
    const sider = steg.map(function () { return false; });

    function rammeverk(stegEtikett) {
      rydd(); settNav('');
      const topp = $('div', 'lekt-topp');
      const tilbake = $('button', 'sekundaer liten', '← Oversikt');
      tilbake.onclick = visHjem;
      topp.appendChild(tilbake);
      topp.appendChild($('h2', '', 'Leksjon ' + l.nr + ': ' + l.tittel));
      const prikker = $('div', 'prikker');
      steg.forEach(function (s, j) { prikker.appendChild($('span', 'prikk' + (j === i ? ' na' : (j < i ? ' ferdig' : '')))); });
      topp.appendChild(prikker);
      app.appendChild(topp);
    }
    function knapperad(kort, tilbakeOk, fortsettTekst, fortsett, fortsettDeaktivert) {
      const rad = $('div', 'knapperad');
      if (tilbakeOk) {
        const t = $('button', 'sekundaer', '← Tilbake');
        t.onclick = function () { i--; vis(); };
        rad.appendChild(t);
      }
      rad.appendChild($('div', 'avstand'));
      const f = $('button', 'primaer', fortsettTekst || 'Fortsett →');
      f.onclick = fortsett || function () { i++; vis(); };
      if (fortsettDeaktivert) f.disabled = true;
      rad.appendChild(f);
      kort.appendChild(rad);
      f.focus();
    }
    function leggTilVisuelle(boks, liste) {
      (liste || []).forEach(function (v) { boks.appendChild(Oppgaver.visuell(v, c)); });
    }

    function vis() {
      const s = steg[i];
      rammeverk();
      if (s.type === 'info') visInfo(s);
      else if (s.type === 'eksempel') visEksempel(s, 0);
      else if (s.type === 'ovelse') visOvelseIntro(s);
      else if (s.type === 'test') visTestIntro(s);
    }

    function visInfo(s) {
      const kort = $('div', 'kort');
      kort.appendChild($('div', 'steg-etikett', s.etikett || 'Forklaring'));
      kort.appendChild($('h2', '', s.tittel));
      kort.appendChild($('div', 'tekstblokk', s.html));
      leggTilVisuelle(kort, s.visuelle);
      if (s.etter) kort.appendChild($('div', 'tekstblokk', s.etter));
      knapperad(kort, i > 0);
      app.appendChild(kort);
    }

    function visEksempel(s, j) {
      rydd(); rammeverk();
      const kort = $('div', 'kort');
      kort.appendChild($('div', 'steg-etikett', 'Gjennomgått eksempel'));
      kort.appendChild($('h2', '', s.tittel));
      const tr = s.trinn[j];
      kort.appendChild($('div', 'eks-trinn', 'Trinn ' + (j + 1) + ' av ' + s.trinn.length));
      kort.appendChild($('div', 'tekstblokk', tr.tekst));
      if (tr.visuell) kort.appendChild(Oppgaver.visuell(tr.visuell, c));
      const rad = $('div', 'knapperad');
      const tilb = $('button', 'sekundaer', '← Forrige');
      tilb.onclick = function () { if (j > 0) visEksempel(s, j - 1); else { i--; vis(); } };
      rad.appendChild(tilb);
      rad.appendChild($('div', 'avstand'));
      const siste = j === s.trinn.length - 1;
      const f = $('button', 'primaer', siste ? 'Videre til øving →' : 'Neste trinn →');
      f.onclick = function () { if (siste) { i++; vis(); } else visEksempel(s, j + 1); };
      rad.appendChild(f);
      kort.appendChild(rad);
      f.focus();
      app.appendChild(kort);
    }

    function visOvelseIntro(s) {
      const kort = $('div', 'kort');
      kort.appendChild($('div', 'steg-etikett', s.modus === 'veiledet' ? 'Veiledet øving' : 'Selvstendig øving'));
      kort.appendChild($('h2', '', s.tittel));
      kort.appendChild($('div', 'tekstblokk', s.intro));
      kort.appendChild($('p', 'dempet', s.oppgaver.length + ' oppgaver. ' + (s.modus === 'veiledet'
        ? 'Du får hint, og et nytt forsøk hvis du bommer.'
        : 'Ingen hint denne gangen. Oppgaver du bommer på kommer tilbake på slutten.')));
      knapperad(kort, i > 0, 'Start øvingen →', function () { kjorOvelse(s); });
      app.appendChild(kort);
    }

    function kjorOvelse(s) {
      rammeverk();
      const boks = $('div');
      app.appendChild(boks);
      Oppgaver.kjor(boks, s.oppgaver, {
        modus: s.modus, clef: c.clef,
        onFerdig: function (res) {
          if (s.modus !== 'veiledet') Lagring.registrerFeil(l.id, res.feil);
          rydd(); rammeverk();
          const kort = $('div', 'kort resultat');
          kort.innerHTML = '<div style="display:flex;justify-content:center">' + window.lundeSvg(70) + '</div>' +
            '<h2>Øvingen er ferdig</h2><p>Du hadde <b>' + res.riktig + ' av ' + res.svart + '</b> riktig på første forsøk.' +
            (res.riktig === res.svart ? ' Ingen feil – flott!' : ' De du bommet på er de som lønner seg å se på igjen.') + '</p>';
          const rad = $('div', 'knapperad'); rad.style.justifyContent = 'center';
          const mer = $('button', 'sekundaer', 'Øv litt mer');
          mer.onclick = function () { const ny = l.bygg(c).steg[i]; steg[i] = ny; kjorOvelse(ny); };
          const videre = $('button', 'primaer', 'Fortsett →');
          videre.onclick = function () { i++; vis(); };
          rad.appendChild(mer); rad.appendChild(videre);
          kort.appendChild(rad);
          app.appendChild(kort);
          videre.focus();
        }
      });
    }

    function visTestIntro(s) {
      const kort = $('div', 'kort');
      kort.appendChild($('div', 'steg-etikett', 'Mini-test'));
      kort.appendChild($('h2', '', s.tittel || 'Er du klar for neste leksjon?'));
      kort.appendChild($('div', 'tekstblokk', '<p>' + s.oppgaver.length + ' oppgaver, uten hint. Du må ha minst ' + Math.round((s.bestaatt || 0.75) * 100) + ' % riktig. Stjernene dine viser hvor sikkert du kan stoffet: ★ for bestått, ★★ for gode resultater og ★★★ for full pott.</p>'));
      knapperad(kort, i > 0, 'Start testen →', function () { kjorTest(s); });
      app.appendChild(kort);
    }

    function kjorTest(s) {
      rammeverk();
      const boks = $('div');
      app.appendChild(boks);
      Oppgaver.kjor(boks, s.oppgaver, {
        modus: 'test', clef: c.clef,
        onFerdig: function (res) { ferdigTest(s, res); }
      });
    }

    function ferdigTest(s, res) {
      const total = s.oppgaver.length;
      const prosent = res.riktig / total;
      const bestatt = prosent >= (s.bestaatt || 0.75);
      const stjerner = prosent >= 0.999 ? 3 : (prosent >= 0.85 ? 2 : 1);
      const sek = Math.min(3 * 3600, (Date.now() - t0) / 1000);
      const ny = Lagring.lagreLeksjon(l.id, { prosent: prosent, bestatt: bestatt, stjerner: stjerner, tid: sek });
      Lagring.registrerFeil(l.id, res.feil);
      Lagring.send({
        leksjon: l.nr + ' ' + l.tittel, type: 'leksjon', resultat: Math.round(prosent * 100),
        stjerner: bestatt ? stjerner : 0, forsok: ny.forsok, tid: Math.round(sek)
      });
      t0 = Date.now();
      rydd(); rammeverk();
      const kort = $('div', 'kort resultat');
      if (bestatt) {
        Lyd.riktig();
        kort.innerHTML = '<div style="display:flex;justify-content:center">' + window.lundeSvg(90) + '</div>' +
          '<h2>Leksjonen er fullført!</h2><div class="stor">' + stjernerHtml(stjerner) + '</div>' +
          '<p><span class="tall">' + Math.round(prosent * 100) + ' %</span><br>' + res.riktig + ' av ' + total + ' riktig</p>' +
          '<p class="dempet">' + (stjerner === 3 ? 'Full pott. Dette sitter.' : 'Du kan ta testen på nytt senere hvis du vil ha flere stjerner.') + '</p>';
        const rad = $('div', 'knapperad'); rad.style.justifyContent = 'center';
        const nl = nesteLeksjon();
        const oversikt = $('button', 'sekundaer', 'Til oversikten'); oversikt.onclick = visHjem;
        rad.appendChild(oversikt);
        if (nl && nl.id !== l.id) {
          const n = $('button', 'primaer', 'Neste: ' + nl.tittel + ' →'); n.onclick = function () { startLeksjon(nl); };
          rad.appendChild(n);
        }
        kort.appendChild(rad);
      } else {
        kort.innerHTML = '<div style="display:flex;justify-content:center">' + window.lundeSvg(80) + '</div>' +
          '<h2>Nesten – ikke helt i mål ennå</h2><p><span class="tall">' + Math.round(prosent * 100) + ' %</span><br>' + res.riktig + ' av ' + total + ' riktig. Du trenger ' + Math.round((s.bestaatt || 0.75) * 100) + ' %.</p>' +
          '<p class="dempet">Det er helt normalt å måtte ta en runde til. Gå gjerne gjennom forklaringen en gang til først.</p>';
        const rad = $('div', 'knapperad'); rad.style.justifyContent = 'center';
        const igjen = $('button', 'sekundaer', 'Les leksjonen på nytt'); igjen.onclick = function () { i = 0; vis(); };
        const ny2 = $('button', 'primaer', 'Prøv testen på nytt');
        ny2.onclick = function () { const nyTest = l.bygg(c).steg[i]; steg[i] = nyTest; kjorTest(nyTest); };
        rad.appendChild(igjen); rad.appendChild(ny2);
        kort.appendChild(rad);
      }
      app.appendChild(kort);
    }

    vis();
  }

  /* ---------- Repetisjon ---------- */
  function startRepetisjon() {
    brukLyd();
    rydd(); settNav('rep');
    const ferdige = Leksjoner.alle().filter(function (l) { const f = Lagring.fremdrift(l.id); return f && f.ferdig; });
    if (!ferdige.length) {
      const k = $('div', 'kort');
      k.innerHTML = '<h2>Repetisjon</h2><p>Her dukker spørsmål fra leksjonene du har fullført opp. Fullfør første leksjon, så er den i gang.</p>';
      app.appendChild(k);
      return;
    }
    const c = ctx();
    const svake = Lagring.svake();
    const vekter = ferdige.map(function (l) {
      const f = Lagring.fremdrift(l.id);
      return 1 + (3 - (f.stjerner || 1)) + Math.min(svake[l.id] || 0, 6) / 2;
    });
    const sum = vekter.reduce(function (a, b) { return a + b; }, 0);
    function trekk() {
      let r = Math.random() * sum;
      for (let j = 0; j < ferdige.length; j++) { r -= vekter[j]; if (r <= 0) return ferdige[j]; }
      return ferdige[ferdige.length - 1];
    }
    const oppgaver = [];
    for (let j = 0; j < 8; j++) {
      const l = trekk();
      const t = l.repetisjon(c, 1)[0];
      t.kilde = l.id;
      oppgaver.push(t);
    }
    const topp = $('div', 'lekt-topp');
    topp.appendChild($('h2', '', 'Daglig repetisjon'));
    app.appendChild(topp);
    const boks = $('div');
    app.appendChild(boks);
    const feilPer = {};
    const t0 = Date.now();
    Oppgaver.kjor(boks, oppgaver, {
      modus: 'selvstendig', clef: c.clef,
      paaSvar: function (t, ok) { if (!ok) feilPer[t.kilde] = (feilPer[t.kilde] || 0) + 1; },
      onFerdig: function (res) {
        Object.keys(feilPer).forEach(function (id) { Lagring.registrerFeil(id, feilPer[id]); });
        Lagring.registrerRepetisjon();
        const prosent = res.svart ? res.riktig / res.svart : 0;
        Lagring.send({ leksjon: 'Repetisjon', type: 'repetisjon', resultat: Math.round(prosent * 100), stjerner: 0, forsok: Lagring.repetisjoner(), tid: Math.round((Date.now() - t0) / 1000) });
        rydd(); settNav('rep');
        const k = $('div', 'kort resultat');
        k.innerHTML = '<div style="display:flex;justify-content:center">' + window.lundeSvg(80) + '</div><h2>Repetisjonen er ferdig</h2>' +
          '<p><span class="tall">' + res.riktig + ' av ' + res.svart + '</span><br>riktig på første forsøk</p>';
        const rad = $('div', 'knapperad'); rad.style.justifyContent = 'center';
        const igjen = $('button', 'sekundaer', 'Ta en til'); igjen.onclick = startRepetisjon;
        const hjem = $('button', 'primaer', 'Til oversikten'); hjem.onclick = visHjem;
        rad.appendChild(igjen); rad.appendChild(hjem);
        k.appendChild(rad);
        app.appendChild(k);
      }
    });
  }

  /* ---------- Teori ---------- */
  const ORDLISTE = [
    ['Notesystem', 'Fem linjer og fire mellomrom som noter skrives på. Du teller alltid nedenfra.'],
    ['Notehode', 'Den runde delen av en note. Plasseringen i notesystemet viser tonehøyden.'],
    ['Notehals', 'Strekene som går opp eller ned fra notehodet.'],
    ['Tonehøyde', 'Hvor høyt eller lavt en tone klinger. Høyere opp i notesystemet = høyere tone.'],
    ['Nøkkel', 'Tegnet helt til venstre som sier hvilken tone en bestemt linje har. G-nøkkel og F-nøkkel er vanligst.'],
    ['Hjelpelinje', 'Kort linje over eller under notesystemet for toner som ligger utenfor de fem linjene.'],
    ['Oktav', 'Avstanden fra en tone til neste tone med samme navn – åtte trinn i rekken C D E F G A H C.'],
    ['Midtre C', 'C-en som ligger midt mellom de to nøklene. Den står på hjelpelinje under G-nøkkelen og over F-nøkkelen.']
  ];
  function visTeori() {
    rydd(); settNav('teori');
    const c = ctx();
    const kort = $('div', 'kort');
    kort.innerHTML = '<h2>Teori – oppslag</h2><p class="dempet">Kort oppsummering av hver leksjon. Greit å ha åpen under korpsøvelsen.</p>';
    app.appendChild(kort);
    Leksjoner.alle().forEach(function (l) {
      const d = $('details');
      d.appendChild($('summary', '', l.nr + '. ' + l.tittel));
      const t = $('div', 'tekstblokk', l.teori(c));
      d.appendChild(t);
      if (l.teoriVisuelle) l.teoriVisuelle(c).forEach(function (v) { d.appendChild(Oppgaver.visuell(v, c)); });
      app.appendChild(d);
    });
    const ord = $('div', 'kort');
    ord.innerHTML = '<h3>Ordliste</h3>';
    const dl = $('dl', 'ordliste');
    ORDLISTE.forEach(function (o) { dl.appendChild($('dt', '', o[0])); dl.appendChild($('dd', '', o[1])); });
    ord.appendChild(dl);
    app.appendChild(ord);
  }

  /* ---------- Fremdrift ---------- */
  function visFremdrift() {
    rydd(); settNav('fremdrift');
    const alle = Leksjoner.alle();
    let ferdige = 0, sumTid = 0, stjerner = 0;
    alle.forEach(function (l) {
      const f = Lagring.fremdrift(l.id);
      if (f) { sumTid += f.tid || 0; if (f.ferdig) { ferdige++; stjerner += f.stjerner || 0; } }
    });
    const oppsum = $('div', 'kort');
    oppsum.innerHTML = '<h2>Fremdrift</h2>' +
      '<div style="display:flex;gap:28px;flex-wrap:wrap;margin:8px 0">' +
      '<div><div class="tall">' + ferdige + '/' + alle.length + '</div><div class="dempet">leksjoner</div></div>' +
      '<div><div class="tall">' + stjerner + ' ★</div><div class="dempet">stjerner</div></div>' +
      '<div><div class="tall">' + tid(sumTid) + '</div><div class="dempet">øvingstid</div></div>' +
      '<div><div class="tall">' + Lagring.repetisjoner() + '</div><div class="dempet">repetisjoner</div></div></div>' +
      '<p class="smaa">' + (Lagring.skjemaKlart()
        ? 'Resultatene dine sendes automatisk til Google Skjema når du fullfører en leksjon eller repetisjon.'
        : 'Google Skjema er ikke koblet til ennå (se README). Fremdriften lagres bare i denne nettleseren.') + '</p>';
    app.appendChild(oppsum);

    const tabell = $('div', 'kort');
    let html = '<table><tr><th>Leksjon</th><th>Status</th><th>Beste</th><th>Forsøk</th><th>Tid</th></tr>';
    alle.forEach(function (l) {
      const f = Lagring.fremdrift(l.id);
      html += '<tr><td>' + l.nr + '. ' + l.tittel + '</td><td>' + (f && f.ferdig ? '<span class="stjerner">' + stjernerHtml(f.stjerner) + '</span>' : (f ? 'påbegynt' : '–')) +
        '</td><td>' + (f ? Math.round(f.beste * 100) + ' %' : '–') + '</td><td>' + (f ? f.forsok : '–') + '</td><td>' + (f ? tid(f.tid) : '–') + '</td></tr>';
    });
    html += '</table>';
    tabell.innerHTML = html;
    app.appendChild(tabell);
  }

  /* ---------- Start ---------- */
  byggTopp();
  if (!profil().nokkel) visInnstillinger(true);
  else visHjem();
})();
