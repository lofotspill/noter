/* Leksjon 11 – Rytmelek */
Leksjoner.registrer({
  nr: 11, del: 2,
  tittel: 'Rytmelek',
  kort: 'Alt fra del 2 samlet: lese, høre og trykke rytmer',
  min: 14,

  bygg: function (c) {
    const G = Oppgaver.Gen;
    function blandet(lister) { return Oppgaver.blande([].concat.apply([], lister)); }

    return {
      steg: [
        {
          type: 'info', tittel: 'Nå samler vi trådene',
          html:
            '<p>Du kan nå lese de viktigste rytmetegnene: <b>noteverdier</b>, <b>pauser</b>, <b>taktart</b>, <b>punkt</b> og <b>bindebue</b>. I denne leksjonen skal du bruke alt sammen, slik du gjør når du leser en melodi: se på rytmen, tell, og spill (her: trykk) til metronomen.</p>' +
            '<p>Fremgangsmåte som fungerer:</p>' +
            '<ol><li>Se på taktarten: hvor mange slag i takten?</li><li>Gå gjennom hver takt og tell slagene for deg selv («1 og 2 og …»).</li><li>Merk deg pauser og bindebuer.</li><li>Så spiller du, uten å stoppe, selv om du gjør en feil. Følg pulsen.</li></ol>',
          etter: '<div class="merk rosa"><b>Hovedregelen i korps:</b> pulsen stopper aldri. Bommer du på en note, hopper du inn igjen på neste slag. Det er verre å miste pulsen enn å spille én gal tone.</div>'
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Rytmelek: oppvarming',
          intro: '<p>Rytmer med noteverdier og pauser. Du får hint hvis det trengs.</p>',
          oppgaver: [].concat(G.hoerRytme(2, { tillat: ['q', 'h', 'e'], pauser: 0.3, takter: 1 }), G.tapp(2, { takter: 2, bpm: 62, tillat: ['q', 'h', 'e'], pauser: 0.3 }))
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Rytmelek: 3/4 og punkt',
          intro: '<p>Uten hint. Nå i flere taktarter.</p>',
          oppgaver: blandet([G.tapp(2, { takter: 2, bpm: 66, tillat: ['q', 'h', 'e'], pauser: 0.25, takt: [3, 4], punkt: true }), G.tapp(2, { takter: 2, bpm: 66, tillat: ['q', 'h', 'e'], pauser: 0.25, takt: [4, 4], punkt: true }), G.hoerRytme(2, { tillat: ['q', 'h', 'e'], punkt: true, takter: 1 }), G.taktFull(1)])
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Rytmelek: lengre',
          intro: '<p>Lengre rytmer, litt raskere tempo.</p>',
          oppgaver: blandet([G.tapp(3, { takter: 3, bpm: 72, tillat: ['q', 'h', 'e'], pauser: 0.25, takt: [4, 4], punkt: true }), G.hoerRytme(1, { tillat: ['q', 'h', 'e'], takter: 2, pauser: 0.2 })])
        },
        {
          type: 'test', tittel: 'Del 2: rytmeprøve', bestaatt: 0.75,
          oppgaver: blandet([G.hoerRytme(2, { tillat: ['q', 'h', 'e'], pauser: 0.25, takter: 1 }), G.tapp(3, { takter: 2, bpm: 68, tillat: ['q', 'h', 'e'], pauser: 0.25, takt: [4, 4], punkt: true }), G.tapp(1, { takter: 2, bpm: 68, tillat: ['q', 'h'], takt: [3, 4] }), G.fyllTakt(1, { takt: [4, 4], punkt: true }), G.antallITakt(1)])
        }
      ]
    };
  },

  teori: function () {
    return '<ul>' +
      '<li>Se først på <b>taktarten</b>, så tell slagene i hver takt.</li>' +
      '<li>Pauser og bindebuer telles med.</li>' +
      '<li><b>Pulsen stopper aldri.</b> Bommer du, kom inn igjen på neste slag.</li>' +
      '</ul>';
  },

  repetisjon: function (c, n) {
    const G = Oppgaver.Gen;
    const ut = [];
    for (let i = 0; i < n; i++) ut.push(Oppgaver.velg([function () { return G.tapp(1, { takter: 2, tillat: ['q', 'h', 'e'], pauser: 0.25, punkt: true })[0]; }, function () { return G.hoerRytme(1, { tillat: ['q', 'h', 'e'], takter: 1 })[0]; }])());
    return ut;
  }
});
