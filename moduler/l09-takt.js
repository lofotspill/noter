/* Leksjon 9 – Takt og taktart */
Leksjoner.registrer({
  nr: 9, del: 2,
  tittel: 'Takt og taktart',
  kort: 'Taktstreker, taktart og hvordan slagene deles i grupper',
  min: 12,

  bygg: function (c) {
    const G = Oppgaver.Gen;
    function blandet(lister) { return Oppgaver.blande([].concat.apply([], lister)); }
    const R = Rytme.fra.bind(Rytme);

    return {
      steg: [
        {
          type: 'info', tittel: 'Takt og taktstrek',
          html:
            '<p>For å gjøre det lettere å lese deles notene opp i <span class="begrep">takter</span>. En takt er en gruppe slag, og mellom takter står det en loddrett <span class="begrep">taktstrek</span>. Slutten på et stykke markeres med en tykk dobbeltstrek.</p>' +
            '<p>Hver takt har like mange slag. Det er derfor «1 2 3 4» begynner på nytt i hver takt.</p>',
          visuelle: [{ type: 'rytme', elementer: R('q q h | h q q | w'), takt: [4, 4], tell: true, bredde: 560 }]
        },
        {
          type: 'info', tittel: 'Taktart',
          html:
            '<p>Helt i starten av linjen står <span class="begrep">taktarten</span>, to tall over hverandre. Foreløpig trenger du bare det <b>øverste</b> tallet: det sier <b>hvor mange slag</b> det er i hver takt. Det nederste tallet (4) betyr at hvert slag er en kvartnote.</p>' +
            '<ul><li><b>4/4</b>: 4 slag i takten. Den vanligste. Kalles også «firetakt».</li><li><b>3/4</b>: 3 slag. Marsj og vals: «1 2 3».</li><li><b>2/4</b>: 2 slag. Typisk marsj: «1 2».</li></ul>',
          visuelle: [{ type: 'flere', liste: [
            { type: 'rytme', tittel: '4/4', elementer: R('q q q q'), takt: [4, 4], tell: true, bredde: 340 },
            { type: 'rytme', tittel: '3/4', elementer: R('q q q q q q'), takt: [3, 4], tell: true, bredde: 340 },
            { type: 'rytme', tittel: '2/4', elementer: R('q q q q'), takt: [2, 4], tell: true, bredde: 340 }
          ] }],
          etter: '<div class="merk">Du møter også andre taktarter (for eksempel 6/8 og 2/2 som er vanlig i marsjer), men disse tre er en god start. Samme prinsipp: summen av notene i takten skal stemme.</div>'
        },
        {
          type: 'eksempel', tittel: 'Slik sjekker du en takt',
          trinn: [
            { tekst: '<p>Her er en takt i 4/4 – men stemmer den? Vi legger sammen slagene.</p>',
              visuell: { type: 'rytme', elementer: R('q h q'), takt: [4, 4], spill: false, bredde: 460 } },
            { tekst: '<p>Kvartnote (1) + halvnote (2) + kvartnote (1) = <b>4 slag</b>. Det stemmer med 4/4.</p>',
              visuell: { type: 'rytme', elementer: R('q h q'), takt: [4, 4], tell: true, bredde: 460 } },
            { tekst: '<p>I 3/4 skal hver takt ha <b>3 slag</b>. Denne har kvart + halv = 3 slag, og er riktig.</p>',
              visuell: { type: 'rytme', elementer: R('q h'), takt: [3, 4], tell: true, bredde: 360 } },
            { tekst: '<p>Mangler det noe? Da kan du regne ut hva som må til: 4/4 med kvart + kvart gir 2 slag, og du trenger en <b>halvnote eller halvpause</b> (2 slag) for å fylle takten.</p>',
              visuell: { type: 'rytme', elementer: R('q q'), takt: [4, 4], spill: false, bredde: 360 } }
          ]
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Takt og taktart: veiledet',
          intro: '<p>Telle slag, lese taktart og fylle takter.</p>',
          oppgaver: [].concat(G.antallITakt(2), G.taktart(1), G.fyllTakt(2, { takt: [4, 4] }), G.tapp(1, { takter: 2, bpm: 66, tillat: ['q', 'h'], takt: [3, 4] }))
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Takt og taktart: alene',
          intro: '<p>Uten hint.</p>',
          oppgaver: blandet([G.antallITakt(2), G.taktart(2), G.taktFull(2), G.fyllTakt(2, { takt: [4, 4], pauser: 0.4 }), G.tapp(2, { takter: 2, bpm: 66, tillat: ['q', 'h'], takt: [3, 4] }), G.tapp(1, { takter: 2, bpm: 70, tillat: ['q', 'h'], takt: [2, 4] })])
        },
        {
          type: 'test', tittel: 'Mini-test: takt og taktart', bestaatt: 0.75,
          oppgaver: blandet([G.antallITakt(2), G.taktart(2), G.taktFull(2), G.fyllTakt(1, { takt: [4, 4] }), G.tapp(2, { takter: 2, bpm: 66, tillat: ['q', 'h'], takt: [3, 4], pauser: 0.2 })])
        }
      ]
    };
  },

  teori: function () {
    return '<ul>' +
      '<li><b>Takt</b> = en gruppe slag. <b>Taktstrek</b> = loddrett strek mellom takter.</li>' +
      '<li><b>Taktart</b> = to tall: det øverste sier hvor mange slag i hver takt; det nederste (4) at slaget er en kvartnote.</li>' +
      '<li>4/4 = 4 slag, 3/4 = 3 slag, 2/4 = 2 slag.</li>' +
      '<li>Summen av noter og pauser i en takt skal alltid stemme med taktarten.</li>' +
      '</ul>';
  },

  repetisjon: function (c, n) {
    const G = Oppgaver.Gen;
    const ut = [];
    for (let i = 0; i < n; i++) ut.push(Oppgaver.velg([
      function () { return G.antallITakt(1)[0]; }, function () { return G.taktart(1)[0]; }, function () { return G.taktFull(1)[0]; },
      function () { return G.fyllTakt(1, { takt: [4, 4] })[0]; }, function () { return G.tapp(1, { takter: 2, tillat: ['q', 'h'], takt: [3, 4] })[0]; }
    ])());
    return ut;
  }
});
