/* Leksjon 7 – Noteverdier */
Leksjoner.registrer({
  nr: 7, del: 2,
  tittel: 'Noteverdier',
  kort: 'Hel, halv, kvart og åttedels note – hvor lenge en tone varer',
  min: 12,

  bygg: function (c) {
    const G = Oppgaver.Gen;
    function blandet(lister) { return Oppgaver.blande([].concat.apply([], lister)); }
    const R = Rytme.fra.bind(Rytme);

    return {
      steg: [
        {
          type: 'info', tittel: 'Hvor lenge varer tonen?',
          html:
            '<p>Utseendet på en note forteller <b>hvor lenge</b> tonen skal vare. Lengden måles i slag, altså i forhold til pulsen du kjenner fra forrige leksjon.</p>' +
            '<p>Vi tar utgangspunkt i <span class="begrep">kvartnoten</span> som ett slag. De andre er hele eller deler av den:</p>' +
            '<ul><li><b>Helnote</b>: 4 slag. Åpent hode, ingen hals.</li><li><b>Halvnote</b>: 2 slag. Åpent hode, med hals.</li><li><b>Kvartnote</b>: 1 slag. Fylt hode, med hals.</li><li><b>Åttedelsnote</b>: ½ slag. Fylt hode, hals og flagg (eller bjelke når flere står sammen).</li></ul>',
          visuelle: [{ type: 'verdibar' }]
        },
        {
          type: 'info', tittel: 'Å telle noter',
          html:
            '<p>Når du leser rytme, teller du slagene høyt eller i hodet. Under hver note står hvilket slag den begynner på. En halvnote varer to slag – du teller «1 – 2» mens du holder tonen.</p>' +
            '<p>Åttedelsnoter deler slaget i to og telles «<b>1</b> og <b>2</b> og …». Tallet er på slaget, «og» er midt mellom.</p>',
          visuelle: [{ type: 'flere', liste: [
            { type: 'rytme', tittel: 'Kvart og halv', elementer: R('q q h'), takt: [4, 4], tell: true, bredde: 480 },
            { type: 'rytme', tittel: 'Åttedeler', elementer: R('q e e e e q'), takt: [4, 4], tell: true, bredde: 480 }
          ] }]
        },
        {
          type: 'eksempel', tittel: 'Slik leser du en rytme',
          trinn: [
            { tekst: '<p>Vi skal klappe denne rytmen. Først: hva slags noter er det?</p>',
              visuell: { type: 'rytme', elementer: R('q q h w'), takt: [4, 4], spill: false, bredde: 480 } },
            { tekst: '<p>Kvartnote, kvartnote og halvnote – de tre fyller sammen <b>4 slag</b>. Det er en hel takt.</p>',
              visuell: { type: 'rytme', elementer: R('q q h'), takt: [4, 4], tell: true, spill: false, bredde: 480 } },
            { tekst: '<p>Du teller: <b>1</b> (kvart), <b>2</b> (kvart), <b>3 – 4</b> (halvnoten varer to slag). Spill av for å høre rytmen med puls.</p>',
              visuell: { type: 'rytme', elementer: R('q q h'), takt: [4, 4], tell: true, bredde: 480 } },
            { tekst: '<p>I neste takt står en helnote. Den begynner på slag 1 og holdes i alle 4 slag.</p>',
              visuell: { type: 'rytme', elementer: R('q q h w'), takt: [4, 4], tell: true, bredde: 480 } }
          ]
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Noteverdier: veiledet',
          intro: '<p>Du får hint hvis du bommer, og ett forsøk til.</p>',
          oppgaver: [].concat(G.noteNavn(3), G.verdi(3), G.sum(2), G.hoerRytme(1, { tillat: ['q', 'h'] }), G.tapp(1, { takter: 1, bpm: 60, tillat: ['q', 'h'] }))
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Noteverdier: alene',
          intro: '<p>Uten hint. Husk å legge sammen slagene.</p>',
          oppgaver: blandet([G.noteNavn(2), G.verdi(2), G.sum(2), G.hoerRytme(2, { tillat: ['q', 'h', 'w'], takter: 1 }), G.tapp(2, { takter: 2, bpm: 66, tillat: ['q', 'h'] })])
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Med åttedeler',
          intro: '<p>Nå kommer også åttedelsnotene inn.</p>',
          oppgaver: blandet([G.verdi(2, { verdier: ['e', 'q'] }), G.hoerRytme(2, { tillat: ['q', 'e'], takter: 1 }), G.tapp(2, { takter: 1, bpm: 60, tillat: ['q', 'h', 'e'] })])
        },
        {
          type: 'test', tittel: 'Mini-test: noteverdier', bestaatt: 0.75,
          oppgaver: blandet([G.noteNavn(2), G.verdi(2), G.sum(1), G.hoerRytme(2, { tillat: ['q', 'h', 'e'], takter: 1 }), G.tapp(2, { takter: 2, bpm: 66, tillat: ['q', 'h', 'e'] })])
        }
      ]
    };
  },

  teori: function () {
    return '<ul>' +
      '<li><b>Helnote</b> = 4 slag, <b>halvnote</b> = 2 slag, <b>kvartnote</b> = 1 slag, <b>åttedelsnote</b> = ½ slag.</li>' +
      '<li>Åpent hode uten hals = hel. Åpent hode med hals = halv. Fylt hode med hals = kvart. Med flagg eller bjelke = åttedel.</li>' +
      '<li>Hver verdi er <b>halvparten</b> av den før: 4 – 2 – 1 – ½.</li>' +
      '<li>Åttedeler telles «1 og 2 og …».</li>' +
      '</ul>';
  },
  teoriVisuelle: function () { return [{ type: 'verdibar' }]; },

  repetisjon: function (c, n) {
    const G = Oppgaver.Gen;
    const ut = [];
    for (let i = 0; i < n; i++) ut.push(Oppgaver.velg([
      function () { return G.noteNavn(1)[0]; }, function () { return G.verdi(1)[0]; }, function () { return G.sum(1)[0]; },
      function () { return G.hoerRytme(1, { tillat: ['q', 'h', 'e'] })[0]; }, function () { return G.tapp(1, { takter: 1, tillat: ['q', 'h', 'e'] })[0]; }
    ])());
    return ut;
  }
});
