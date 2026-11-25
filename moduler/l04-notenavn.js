/* Leksjon 4 – Notenavn */
Leksjoner.registrer({
  nr: 4, del: 1,
  tittel: 'Notenavn',
  kort: 'C D E F G A H – og hvordan du leser navnet på en note',
  min: 12,

  bygg: function (c) {
    const G = Oppgaver.Gen;
    const ref = Noter.referansePos(c.clef);
    const refB = Noter.referanseBokstav(c.clef);
    const navn = Noter.nokkelNavn(c.clef);
    function blandet(lister) { return Oppgaver.blande([].concat.apply([], lister)); }

    // alle ni plasser med navn, for den valgte nøkkelen
    const alle = [];
    for (let p = 0; p <= 8; p++) alle.push({ pos: p, label: Noter.bokstav(p, c.clef) });

    // rekke C–C i din nøkkel (til tonetrappen) og to C-er med en oktav imellom
    const baseOkt = c.clef === 'G' ? 4 : 3;
    const rekkeMidi = ['C', 'D', 'E', 'F', 'G', 'A', 'H', 'C'].map(function (l, i) { return Noter.midi({ l: l, o: i === 7 ? baseOkt + 1 : baseOkt }); });
    const cLav = Noter.toneTilPos('C', baseOkt, c.clef);
    const cHoy = Noter.toneTilPos('C', baseOkt + 1, c.clef);

    // fem plasser rundt fastpunktet: første steg før alle ni
    const lo = Math.max(0, ref - 2), hi = Math.min(8, ref + 2);
    const naboer = [];
    for (let p = lo; p <= hi; p++) naboer.push({ pos: p, label: Noter.bokstav(p, c.clef), tilstand: p === ref ? 'ok' : 'normal' });

    const huskeregel = c.clef === 'G'
      ? '<p><b>Linjene</b> (nedenfra): <b>E – G – H – D – F</b>. Forslag til huskesetning: «<i>Ei Gammel Havørn Dykker Fort</i>».</p>' +
        '<p><b>Mellomrommene</b> (nedenfra): <b>F – A – C – E</b> – det blir ordet «face».</p>'
      : '<p><b>Linjene</b> (nedenfra): <b>G – H – D – F – A</b>. Forslag til huskesetning: «<i>Gamle Havørner Dykker Fort Alltid</i>».</p>' +
        '<p><b>Mellomrommene</b> (nedenfra): <b>A – C – E – G</b>. Forslag: «<i>Alle Caféer Er Gode</i>».</p>';

    // eksempel: finn C i din nøkkel – telle fra fastpunktet
    const mal = c.clef === 'G' ? ref + 3 : ref - 3;
    const retn = mal > ref ? 1 : -1;
    const veien = [];
    for (let p = ref; p !== mal + retn; p += retn) veien.push({ pos: p, label: Noter.bokstav(p, c.clef), tilstand: p === mal ? 'ok' : 'normal' });
    const veiTekst = veien.map(function (v) { return v.label; }).join(' → ');

    return {
      steg: [
        {
          type: 'info', tittel: 'De sju tonenavnene',
          html:
            '<p>Det finnes sju tonenavn: <b>C D E F G A H</b>. Etter H begynner rekken på nytt med C, én <span class="begrep">oktav</span> høyere (åtte trinn opp). Alle toner du spiller har ett av disse navnene – noen får i tillegg et fortegn, men det tar vi i del 3.</p>' +
            '<p>Trykk på trinnene og hør hvordan tonene stiger, og se at rekken stopper på C igjen – med samme navn, men høyere.</p>',
          visuelle: [{ type: 'trapp', toner: rekkeMidi, etiketter: ['C', 'D', 'E', 'F', 'G', 'A', 'H', 'C'], hoydesteg: 12 }],
          etter: '<div class="merk rosa"><b>Obs: H, ikke B.</b> På norsk heter tonen som på engelsk heter «B», <b>H</b>. Vi har også en tone som heter B, men den er en <i>annen</i> tone (H senket en halv tone). Den kommer i del 3.</div>'
        },
        {
          type: 'info', tittel: 'Oktaver: samme navn, høyere tone',
          html:
            '<p>Når rekken starter på nytt, har tonen <b>samme navn</b> – men klinger en <span class="begrep">oktav</span> høyere. Du hører at de er «samme tone» i to høyder. I notesystemet er det åtte trinn mellom dem. Under ser du to C-er med en oktav imellom. Trykk «Spill av».</p>' +
            '<p>På messinginstrumenter som barytonen kan flere toner med samme navn og ulik høyde ofte spilles med <b>samme ventilgrep</b> – det er leppespenning og luft som avgjør hvilken som kommer ut. Det kommer vi tilbake til i del 4.</p>',
          visuelle: [{ type: 'noter', noter: [{ pos: cLav, label: 'C' }, { pos: cHoy, label: 'C' }], spill: true, bredde: 340, steg: 0.9 }]
        },
        {
          type: 'info', tittel: 'Start med fastpunktet og naboene',
          html:
            '<p>Du trenger ikke å lære ni plasser på én gang. Vi begynner smått: fastpunktet fra nøkkelen (<b>' + refB + '</b>) og plassene som ligger nærmest.</p>' +
            '<p>Plassene følger tonerekken <b>C D E F G A H</b>: ett trinn videre i rekken for hver plass oppover (linje, mellomrom, linje …). Under ser du fem plasser rundt fastpunktet. Den grønne er ' + refB + '. Trykk «Spill av» og hør dem stige.</p>',
          visuelle: [{ type: 'noter', noter: naboer, spill: true, bredde: 460, gap: 62, skala: 1.0, steg: 0.5 }],
          etter: '<div class="merk">Øv først på bare disse fem plassene. Resten legger vi til etterpå.</div>'
        },
        {
          type: 'eksempel', tittel: 'Slik leser du navnet på en note',
          trinn: [
            { tekst: '<p>Vi skal finne ut hva denne noten heter.</p>',
              visuell: { type: 'noter', noter: [{ pos: mal }], bredde: 300 } },
            { tekst: '<p><b>1. Finn fastpunktet.</b> ' + navn + 'en markerer ' + Noter.posNavn(ref) + ', som er tonen <b>' + refB + '</b>.</p>',
              visuell: { type: 'noter', noter: [{ pos: mal }], markerLinjer: [{ pos: ref, tekst: refB, farge: '#e0708f' }], bredde: 300 } },
            { tekst: '<p><b>2. Tell ' + (retn > 0 ? 'oppover' : 'nedover') + ' i alfabetet</b>, ett trinn for hver linje og hvert mellomrom, til du er framme: <b>' + veiTekst + '</b>.</p>',
              visuell: { type: 'noter', noter: veien, bredde: 150 + veien.length * 70, spill: true } },
            { tekst: '<p><b>3. Svaret:</b> noten heter <b>' + Noter.bokstav(mal, c.clef) + '</b>. Etter litt trening trenger du ikke telle lenger – du gjenkjenner plassene, som ord du leser uten å stave.</p>',
              visuell: { type: 'noter', noter: [{ pos: mal, label: Noter.bokstav(mal, c.clef), tilstand: 'ok' }], bredde: 300, spill: true } }
          ]
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Tonenavn: nær fastpunktet',
          intro: '<p>Først bare plassene rundt fastpunktet ' + refB + '. Du får hint som viser veien.</p>',
          oppgaver: [].concat(G.alfabet(2), G.velgNavn(2, c.clef, lo, hi), G.navn(3, c.clef, lo, hi))
        },
        {
          type: 'info', tittel: 'Alle ni plasser',
          html:
            '<p>Nå legger vi til resten. Samme regel hele veien: ett trinn videre i rekken for hver plass. Under ser du alle ni plassene med navn i din nøkkel (' + navn + ').</p>',
          visuelle: [{ type: 'noter', noter: alle, spill: true, bredde: 640, gap: 58, skala: 1.0, steg: 0.5 }],
          etter: '<div class="merk">' + huskeregel + '<p class="dempet">Lag gjerne din egen huskesetning – den du lager selv, sitter best.</p></div>'
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Tonenavn: hele systemet',
          intro: '<p>Nå med alle ni plasser. Fortsatt med hint om du bommer.</p>',
          oppgaver: [].concat(G.velgNavn(2, c.clef, 0, 8), G.navn(3, c.clef, 0, 8))
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Tonenavn: alene',
          intro: '<p>Uten hint. Tell fra fastpunktet om du må – det er helt lov.</p>',
          oppgaver: blandet([G.velgNavn(2, c.clef, 0, 8), G.navn(4, c.clef, 0, 8), G.plasser(3, c.clef, 0, 8)])
        },
        {
          type: 'test', tittel: 'Mini-test: notenavn', bestaatt: 0.75,
          oppgaver: blandet([G.alfabet(2), G.navn(5, c.clef, 0, 8), G.plasser(3, c.clef, 0, 8)])
        }
      ]
    };
  },

  teori: function (c) {
    const g = c.clef === 'G';
    return '<ul>' +
      '<li>Sju tonenavn: <b>C D E F G A H</b> – deretter C igjen (en <b>oktav</b> høyere).</li>' +
      '<li>På norsk heter tonen som på engelsk heter «B», <b>H</b>.</li>' +
      '<li>Samme navn en oktav høyere (åtte trinn) er «samme tone» i ny høyde.</li>' +
      '<li>I notesystemet: ett trinn i alfabetet for hver plass oppover (linje, mellomrom, linje …).</li>' +
      '<li>Finn alltid fastpunktet først: ' + Noter.nokkelNavn(c.clef) + ' markerer ' + Noter.posNavn(Noter.referansePos(c.clef)) + ' = <b>' + Noter.referanseBokstav(c.clef) + '</b>.</li>' +
      '<li>' + (g ? 'Linjer: E G H D F. Mellomrom: F A C E.' : 'Linjer: G H D F A. Mellomrom: A C E G.') + '</li>' +
      '</ul>';
  },
  teoriVisuelle: function (c) {
    const alle = [];
    for (let p = 0; p <= 8; p++) alle.push({ pos: p, label: Noter.bokstav(p, c.clef) });
    return [{ type: 'noter', noter: alle, spill: true, bredde: 640, gap: 58, skala: 1.0, steg: 0.5 }];
  },

  repetisjon: function (c, n) {
    const G = Oppgaver.Gen;
    const ut = [];
    for (let i = 0; i < n; i++) ut.push(Oppgaver.velg([
      function () { return G.navn(1, c.clef, 0, 8)[0]; }, function () { return G.navn(1, c.clef, 0, 8)[0]; },
      function () { return G.plasser(1, c.clef, 0, 8)[0]; }, function () { return G.alfabet(1)[0]; },
      function () { return G.velgNavn(1, c.clef, 0, 8)[0]; }
    ])());
    return ut;
  }
});
