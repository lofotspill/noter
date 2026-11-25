/* Leksjon 5 – Hjelpelinjer og utvidet register */
Leksjoner.registrer({
  nr: 5, del: 1,
  tittel: 'Hjelpelinjer og utvidet register',
  kort: 'Toner over og under notesystemet, og midtre C',
  min: 12,

  bygg: function (c) {
    const G = Oppgaver.Gen;
    function blandet(lister) { return Oppgaver.blande([].concat.apply([], lister)); }
    function bokst(p) { return Noter.bokstav(p, c.clef); }
    const utenfor = [-4, -3, -2, -1, 9, 10, 11, 12];
    const naer = [-2, -1, 9, 10];   // første hjelpelinje og mellomrommet før
    function navnUtenfor(n) { return G.navnPos(Oppgaver.blande(utenfor).slice(0, n), c.clef); }
    function navnNaer(n) { return G.navnPos(Oppgaver.blande(naer).slice(0, n), c.clef); }
    function midtreC() {
      const p = Noter.toneTilPos('C', 4, c.clef);
      return {
        type: 'klikk', spm: 'Sett en note på <b>midtre C</b> (C mellom de to nøklene).', mal: [p], omraade: [-4, 12], bredde: 440,
        hint: c.clef === 'G' ? 'Midtre C står på første hjelpelinje <b>under</b> notesystemet i G-nøkkel.' : 'Midtre C står på første hjelpelinje <b>over</b> notesystemet i F-nøkkel.',
        forklaring: 'Midtre C står på første hjelpelinje ' + (c.clef === 'G' ? 'under' : 'over') + ' notesystemet i ' + Noter.nokkelNavn(c.clef) + '.'
      };
    }

    const alleUtenfor = [-4, -3, -2, -1, 9, 10, 11, 12].map(function (p) { return { pos: p, label: bokst(p) }; });
    const nedenfor = alleUtenfor.filter(function (x) { return x.pos < 0 && x.pos >= -2; });
    const ovenfor = alleUtenfor.filter(function (x) { return x.pos > 8 && x.pos <= 10; });

    // eksempel: over systemet
    const vei1 = [8, 9, 10].map(function (p) { return { pos: p, label: bokst(p), tilstand: p === 10 ? 'ok' : 'normal' }; });
    const vei2 = [0, -1, -2, -3].map(function (p) { return { pos: p, label: bokst(p), tilstand: p === -3 ? 'ok' : 'normal' }; });

    return {
      steg: [
        {
          type: 'info', tittel: 'Når notesystemet ikke rekker',
          html:
            '<p>Notesystemet har bare ni plasser. Barytonen går både høyere og lavere enn det, så systemet forlenges med korte linjer: <span class="begrep">hjelpelinjer</span>. De ser ut som små linjestumper over eller under notehodet.</p>' +
            '<p>Du teller akkurat som før – ett trinn i alfabetet for hver linje og hvert mellomrom, bare lenger opp eller ned. Under ser du de to første plassene under og over systemet med navn i din nøkkel (' + Noter.nokkelNavn(c.clef) + '). Lenger ut kommer vi tilbake til.</p>',
          visuelle: [{ type: 'flere', liste: [
            { type: 'noter', tittel: 'Under systemet', noter: nedenfor, spill: true, bredde: 380, gap: 56, skala: 0.95 },
            { type: 'noter', tittel: 'Over systemet', noter: ovenfor, spill: true, bredde: 380, gap: 56, skala: 0.95 }
          ] }]
        },
        {
          type: 'info', tittel: 'Midtre C',
          html:
            '<p>Et viktig holdepunkt er <b>midtre C</b>. Den står på første hjelpelinje <b>under</b> G-nøkkelens system, og på første hjelpelinje <b>over</b> F-nøkkelens system. Det er samme tone – midt mellom de to nøklene, som om systemene møtes i C.</p>',
          visuelle: [{ type: 'flere', liste: [
            { type: 'noter', tittel: 'G-nøkkel', nokkel: 'G', noter: [{ pos: -2, label: 'C' }], spill: true, bredde: 300 },
            { type: 'noter', tittel: 'F-nøkkel', nokkel: 'F', noter: [{ pos: 10, label: 'C' }], spill: true, bredde: 300 }
          ] }],
          etter: '<p class="dempet">Navnene i dette kurset er alltid de <b>skrevne</b> navnene – det du leser i notene.</p>'
        },
        {
          type: 'eksempel', tittel: 'Over og under systemet',
          trinn: [
            { tekst: '<p>Vi skal finne ut hva denne noten heter.</p>',
              visuell: { type: 'noter', noter: [{ pos: 10 }], bredde: 300 } },
            { tekst: '<p><b>Start ved øverste linje</b>, som heter <b>' + bokst(8) + '</b>. Fortsett oppover ett trinn av gangen: mellomrommet over er <b>' + bokst(9) + '</b>, og første hjelpelinje er <b>' + bokst(10) + '</b>.</p>',
              visuell: { type: 'noter', noter: vei1, bredde: 330, spill: true } },
            { tekst: '<p>Samme metode nedover. <b>Start ved nederste linje</b> (<b>' + bokst(0) + '</b>) og tell nedover: mellomrommet under er <b>' + bokst(-1) + '</b>, første hjelpelinje <b>' + bokst(-2) + '</b>, mellomrommet under den <b>' + bokst(-3) + '</b>.</p>',
              visuell: { type: 'noter', noter: vei2, bredde: 380, spill: true } },
            { tekst: '<p>Tommelregel: <b>hjelpelinjene er bare en forlengelse</b> av notesystemet. Ingenting nytt skjer – rekken C D E F G A H fortsetter.</p>',
              visuell: { type: 'noter', noter: alleUtenfor, bredde: 640, gap: 56, skala: 1.0 } }
          ]
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Hjelpelinjer: veiledet',
          intro: '<p>Først bare første hjelpelinje og plassene ved siden av. Du får hint som viser veien fra nærmeste fastpunkt.</p>',
          oppgaver: [].concat(navnNaer(3), [midtreC()], G.plasser(1, c.clef, -2, 10))
        },
        {
          type: 'info', tittel: 'Enda lenger ut',
          html:
            '<p>Noen ganger går melodien enda lenger – to eller flere hjelpelinjer. Metoden er den samme: tell videre fra siste plass du kjenner. Under ser du hele rekken utenfor systemet i din nøkkel.</p>' +
            '<p>Hjelpelinjer du ikke bruker ofte, trenger du ikke kunne utenat. Du kan alltid telle deg frem.</p>',
          visuelle: [{ type: 'noter', noter: alleUtenfor, spill: true, bredde: 640, gap: 56, skala: 1.0, steg: 0.4 }]
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Hjelpelinjer: lenger ut',
          intro: '<p>Nå også de ytterste plassene. Du får fortsatt hint.</p>',
          oppgaver: [].concat(G.hjelpelinjer(1), navnUtenfor(3), G.plasser(2, c.clef, -4, 12))
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Hjelpelinjer: alene',
          intro: '<p>Uten hint. Telle fra øverste eller nederste linje om du må.</p>',
          oppgaver: blandet([navnUtenfor(4), G.plasser(3, c.clef, -4, 12), [midtreC()]])
        },
        {
          type: 'test', tittel: 'Mini-test: hjelpelinjer', bestaatt: 0.75,
          oppgaver: blandet([navnUtenfor(5), G.plasser(3, c.clef, -4, 12), G.hjelpelinjer(1), [midtreC()]])
        }
      ]
    };
  },

  teori: function (c) {
    return '<ul>' +
      '<li><b>Hjelpelinjer</b> forlenger notesystemet for toner over og under de fem linjene.</li>' +
      '<li>Du teller på samme måte: ett trinn i alfabetet for hver linje og hvert mellomrom.</li>' +
      '<li><b>Midtre C</b> står på første hjelpelinje <b>under</b> systemet i G-nøkkel og <b>over</b> i F-nøkkel.</li>' +
      '<li>I din nøkkel (' + Noter.nokkelNavn(c.clef) + ') står midtre C ' + (c.clef === 'G' ? 'under' : 'over') + ' systemet.</li>' +
      '</ul>';
  },
  teoriVisuelle: function (c) {
    const g = [-4, -3, -2, -1, 9, 10, 11, 12].map(function (p) { return { pos: p, label: Noter.bokstav(p, c.clef) }; });
    return [{ type: 'noter', noter: g, bredde: 640, gap: 56, skala: 1.0 }];
  },

  repetisjon: function (c, n) {
    const G = Oppgaver.Gen;
    const ut = [];
    const utenfor = [-4, -3, -2, -1, 9, 10, 11, 12];
    for (let i = 0; i < n; i++) ut.push(Oppgaver.velg([
      function () { return G.navnPos([Oppgaver.velg(utenfor)], c.clef)[0]; },
      function () { return G.navnPos([Oppgaver.velg(utenfor)], c.clef)[0]; },
      function () { return G.plasser(1, c.clef, -4, 12)[0]; },
      function () { return G.hjelpelinjer(1)[0]; }
    ])());
    return ut;
  }
});
