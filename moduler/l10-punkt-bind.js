/* Leksjon 10 – Punktert note og bindebue */
Leksjoner.registrer({
  nr: 10, del: 2,
  tittel: 'Punktert note og bindebue',
  kort: 'To måter å gjøre en tone lengre',
  min: 10,

  bygg: function (c) {
    const G = Oppgaver.Gen;
    function blandet(lister) { return Oppgaver.blande([].concat.apply([], lister)); }
    const R = Rytme.fra.bind(Rytme);

    return {
      steg: [
        {
          type: 'info', tittel: 'Punktet gjør tonen lengre',
          html:
            '<p>En liten prikk rett etter notehodet kalles et <span class="begrep">punkt</span>. Det gjør tonen <b>halvparten så lang til</b>.</p>' +
            '<ul><li><b>Punktert halvnote</b>: 2 + 1 = <b>3 slag</b>.</li><li><b>Punktert kvartnote</b>: 1 + ½ = <b>1½ slag</b>. Ofte etterfulgt av en åttedelsnote.</li></ul>' +
            '<p>Punktert halvnote er vanlig i 3/4 – den fyller en hel takt alene.</p>',
          visuelle: [{ type: 'flere', liste: [
            { type: 'rytme', tittel: 'Punktert halvnote (3 slag) i 3/4', elementer: R('h. | q q q'), takt: [3, 4], tell: true, bredde: 380 },
            { type: 'rytme', tittel: 'Punktert kvart + åttedel (2 slag)', elementer: R('q. e h'), takt: [4, 4], tell: true, bredde: 380 }
          ] }]
        },
        {
          type: 'info', tittel: 'Bindebuen',
          html:
            '<p>En bue mellom to noter på <b>samme tonehøyde</b> kalles en <span class="begrep">bindebue</span>. Den sier: «<i>spill den første tonen, og hold den gjennom den neste – ikke begynn på nytt</i>». Lengdene legges sammen.</p>' +
            '<p>Bindebuen brukes særlig for å lage lengder som ikke går an å skrive med én note, eller for å holde en tone <b>over taktstreken</b>.</p>',
          visuelle: [{ type: 'rytme', elementer: R('q q h~ | h q q'), takt: [4, 4], tell: true, bredde: 560 }],
          etter: '<div class="merk">Her er halvnoten på slag 3–4 bundet til halvnoten i neste takt: <b>2 + 2 = 4 slag</b> med én tone. Du blåser bare én gang.</div>'
        },
        {
          type: 'eksempel', tittel: 'Slik leser du punkt og binding',
          trinn: [
            { tekst: '<p>Vi skal telle denne takten i 4/4.</p>',
              visuell: { type: 'rytme', elementer: R('q. e h'), takt: [4, 4], spill: false, bredde: 380 } },
            { tekst: '<p>Punktert kvartnote = 1½ slag. Åttedelsnoten = ½ slag. Til sammen 2 slag, og halvnoten tar de siste to: <b>1½ + ½ + 2 = 4</b>.</p>',
              visuell: { type: 'rytme', elementer: R('q. e h'), takt: [4, 4], tell: true, bredde: 380 } },
            { tekst: '<p>Du teller «<b>1</b> – 2 – <b>og</b>»: første tone varer fra 1 til midt mellom 2 og 3, åttedelen begynner der, og halvnoten begynner på slag 3.</p>',
              visuell: { type: 'rytme', elementer: R('q. e h'), takt: [4, 4], tell: true, bredde: 380 } },
            { tekst: '<p>Med en bindebue: kvartnote bundet til kvartnote = 1 + 1 = <b>2 slag</b>, én lang tone. Bare den første trykkes (eller blåses).</p>',
              visuell: { type: 'rytme', elementer: [{ v: 'q', bind: true, tilstand: 'hl' }, { v: 'q', tilstand: 'hl' }, { v: 'h' }], takt: [4, 4], tell: true, bredde: 380 } }
          ]
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Punkt og binding: veiledet',
          intro: '<p>Hvor lang er tonen? Og hvordan høres det ut?</p>',
          oppgaver: [].concat(G.punktSlag(2), G.bindSlag(2), G.hoerRytme(1, { tillat: ['q', 'h'], punkt: true, takter: 1 }), G.tapp(1, { elementer: [R('q q h~ | h q q'), R('h. q | q q h~ | h q q')], bpm: 60, takt: [4, 4] }))
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Punkt og binding: alene',
          intro: '<p>Uten hint.</p>',
          oppgaver: blandet([G.punktSlag(2), G.bindSlag(2), G.fyllTakt(2, { takt: [4, 4], punkt: true }), G.hoerRytme(2, { tillat: ['q', 'h'], punkt: true, takter: 1 }),
            G.tapp(2, { elementer: [R('q q h~ | h q q'), R('h. q | q q h~ | h q q'), R('q. e h | h h')], bpm: 62, takt: [4, 4] })])
        },
        {
          type: 'test', tittel: 'Mini-test: punkt og binding', bestaatt: 0.75,
          oppgaver: blandet([G.punktSlag(2), G.bindSlag(2), G.fyllTakt(1, { takt: [4, 4], punkt: true }), G.hoerRytme(2, { tillat: ['q', 'h'], punkt: true, takter: 1 }),
            G.tapp(2, { elementer: [R('q q h~ | h q q'), R('q. e q q | h q q'), R('h h~ | h q q')], bpm: 62, takt: [4, 4] })])
        }
      ]
    };
  },

  teori: function () {
    return '<ul>' +
      '<li><b>Punkt</b> bak en note gir halvparten av notens verdi i tillegg: punktert halv = 3 slag, punktert kvart = 1½ slag.</li>' +
      '<li><b>Bindebue</b> mellom to noter på samme tonehøyde: spill én lang tone med lengdene lagt sammen.</li>' +
      '<li>Bindebue kan holde en tone over taktstreken.</li>' +
      '</ul>';
  },

  repetisjon: function (c, n) {
    const G = Oppgaver.Gen;
    const ut = [];
    for (let i = 0; i < n; i++) ut.push(Oppgaver.velg([function () { return G.punktSlag(1)[0]; }, function () { return G.bindSlag(1)[0]; }, function () { return G.fyllTakt(1, { takt: [4, 4], punkt: true })[0]; }])());
    return ut;
  }
});
