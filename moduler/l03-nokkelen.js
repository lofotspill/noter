/* Leksjon 3 – Nøkkelen */
Leksjoner.registrer({
  nr: 3, del: 1,
  tittel: 'Nøkkelen',
  kort: 'Tegnet først på linjene – og hvorfor du ikke kan lese noter uten det',
  min: 10,

  bygg: function (c) {
    const G = Oppgaver.Gen;
    const ref = Noter.referansePos(c.clef);
    const refB = Noter.referanseBokstav(c.clef);
    const navn = Noter.nokkelNavn(c.clef);
    const refTekst = c.clef === 'G'
      ? 'Krøllen i midten sirkler rundt <b>2. linje</b>'
      : 'De to prikkene ligger på hver side av <b>4. linje</b>';
    function blandet(lister) { return Oppgaver.blande([].concat.apply([], lister)); }

    /* --- oppgavegenerator for denne leksjonen --- */
    function annenNokkel(k) { return k === 'G' ? 'F' : 'G'; }
    function velgNokkel() { return Math.random() < 0.85 ? c.clef : annenNokkel(c.clef); }

    function hvilkenNokkel() {
      const k = velgNokkel();
      return {
        type: 'valg', spm: 'Hva slags nøkkel står først på disse linjene?', visuell: { type: 'noter', nokkel: k, noter: [], bredde: 200 },
        valg: ['G-nøkkel', 'F-nøkkel'], riktig: k === 'G' ? 0 : 1, bland: false,
        hint: 'G-nøkkelen har en krøll som sirkler rundt en linje. F-nøkkelen ser ut som en 9-er med to prikker.',
        forklaring: k === 'G' ? 'Krøllen viser at dette er G-nøkkel.' : 'De to prikkene viser at dette er F-nøkkel.'
      };
    }
    function hvilkenTone() {
      const k = velgNokkel(); const b = Noter.referanseBokstav(k);
      const alt = ['C', 'D', 'E', 'F', 'G', 'A', 'H'].filter(function (x) { return x !== b; });
      return {
        type: 'valg', spm: 'Hvilken tone har linja som denne nøkkelen markerer?',
        visuell: { type: 'noter', nokkel: k, noter: [], bredde: 200 },
        valg: [b].concat(Oppgaver.blande(alt).slice(0, 3)), riktig: 0,
        hint: 'G-nøkkelen er oppkalt etter tonen den markerer. F-nøkkelen likeså.',
        forklaring: Noter.nokkelNavn(k) + ' markerer tonen <b>' + b + '</b>.'
      };
    }
    function hvilkenLinje() {
      const k = velgNokkel(); const p = Noter.referansePos(k);
      const alle = ['1. linje', '2. linje', '3. linje', '4. linje', '5. linje'];
      return {
        type: 'valg', spm: 'Hvilken linje markerer <b>' + Noter.nokkelNavn(k) + 'en</b>?',
        valg: alle, riktig: p / 2, bland: false,
        hint: k === 'G' ? 'Krøllen sirkler rundt linja – tell nedenfra.' : 'De to prikkene ligger på hver side av linja – tell nedenfra.',
        forklaring: Noter.nokkelNavn(k) + ' markerer ' + Noter.posNavn(p) + ' (tonen ' + Noter.referanseBokstav(k) + ').'
      };
    }
    function trykkLinja() {
      const k = velgNokkel(); const p = Noter.referansePos(k);
      return {
        type: 'klikk', nokkel: k, mal: [p], omraade: [0, 8],
        spm: 'Trykk på linja som <b>' + Noter.nokkelNavn(k) + 'en</b> markerer.',
        hint: k === 'G' ? 'Se hvor krøllen i nøkkelen sirkler inn en linje.' : 'Se hvilken linje de to prikkene ligger rundt.',
        forklaring: Noter.nokkelNavn(k) + ' markerer ' + Noter.posNavn(p) + '.'
      };
    }
    function hvorforNokkel() {
      return {
        type: 'valg', spm: 'Hva forteller nøkkelen deg?',
        valg: ['Hvilken tone én bestemt linje har', 'Hvor fort du skal spille', 'Hvor mange slag det er i takten', 'Hvor sterkt du skal spille'],
        riktig: 0, hint: 'Nøkkelen er et fastpunkt du kan telle fra.',
        forklaring: 'Nøkkelen gir én linje et navn. Derfra teller du deg til alle de andre.'
      };
    }
    function sammePlass() {
      return {
        type: 'valg', spm: 'En note står på 3. linje. Er det alltid den samme tonen?',
        valg: ['Ja, 3. linje er alltid H', 'Nei – det avhenger av nøkkelen'], riktig: 1, bland: false,
        forklaring: 'Plasseringen betyr ulike toner i G-nøkkel og F-nøkkel. Se alltid på nøkkelen først.'
      };
    }

    return {
      steg: [
        {
          type: 'info', tittel: 'Hvorfor trenger vi en nøkkel?',
          html:
            '<p>Linjene i notesystemet forteller bare om <i>høyere</i> og <i>lavere</i>. For å vite <b>hvilke toner</b> det er, trenger vi et fastpunkt – og det gir <span class="begrep">nøkkelen</span>, tegnet helt til venstre på hver linje.</p>' +
            '<p>Nøkkelen sier: «<i>denne linjen heter G</i>» (eller F). Når du vet navnet på én linje, finner du resten ved å telle. Uten nøkkel kan ikke notene leses.</p>' +
            '<p>Tenk på det som et kart: nøkkelen er «du er her»-merket. Resten av kartet finner du ved å gå ut fra det.</p>' +
            '<p>Under ser du din nøkkel (<b>' + navn + '</b>). Den rosa linjen er linja nøkkelen markerer.</p>',
          visuelle: [{ type: 'noter', noter: [], markerLinjer: [{ pos: ref, tekst: refB + '-linja', farge: '#e0708f' }], bredde: 360 }]
        },
        {
          type: 'info', tittel: 'To nøkler',
          html:
            '<p>Det finnes to nøkler du kan møte som baryton-spiller. Begge er egentlig en pyntet bokstav – nøkkelen <i>er</i> bokstaven den navngir:</p>' +
            '<ul><li><b>G-nøkkelen</b> (også kalt diskantnøkkel): krøllen sirkler rundt <b>2. linje</b>. Linja heter <b>G</b>.</li>' +
            '<li><b>F-nøkkelen</b> (også kalt bassnøkkel): de to prikkene ligger på hver side av <b>4. linje</b>. Linja heter <b>F</b>.</li></ul>',
          visuelle: [{ type: 'flere', liste: [
            { type: 'noter', tittel: 'G-nøkkel', nokkel: 'G', noter: [], markerLinjer: [{ pos: 2, tekst: 'G', farge: '#e0708f' }], bredde: 280 },
            { type: 'noter', tittel: 'F-nøkkel', nokkel: 'F', noter: [], markerLinjer: [{ pos: 6, tekst: 'F', farge: '#e0708f' }], bredde: 280 }
          ] }],
          etter:
            '<div class="merk rosa"><b>Finn nøkkelen i din egen notebok:</b> åpne heftet fra korpset og se på første linje. Står det en krøll (G-nøkkel) eller en 9-er med to prikker (F-nøkkel)? Mange korps skriver baryton i <b>G-nøkkel</b>, andre i <b>F-nøkkel</b>. Du har valgt <b>' + navn + '</b>. Stemmer det ikke med heftet ditt, bytter du under Innstillinger – da endrer alt i spillet seg.</div>'
        },
        {
          type: 'info', tittel: 'Samme plass, ulik tone',
          html:
            '<p>Plasseringen betyr ulike toner i de to nøklene. Midtlinja (3. linje) er <b>H</b> i G-nøkkel, men <b>D</b> i F-nøkkel. Derfor ser du <b>alltid på nøkkelen først</b>, selv om du etter hvert gjør det uten å tenke.</p>',
          visuelle: [{ type: 'flere', liste: [
            { type: 'noter', tittel: 'G-nøkkel', nokkel: 'G', noter: [{ pos: 4, label: 'H' }], bredde: 280 },
            { type: 'noter', tittel: 'F-nøkkel', nokkel: 'F', noter: [{ pos: 4, label: 'D' }], bredde: 280 }
          ] }],
          etter: '<p class="dempet">Du trenger bare å kunne <b>din egen</b> nøkkel godt. Men det er nyttig å vite at begge finnes – for eksempel når du ser i noter til andre instrumenter.</p>'
        },
        {
          type: 'eksempel', tittel: 'Finn fastpunktet',
          trinn: [
            { tekst: '<p>Alltid først: se på nøkkelen. Hos deg står det en <b>' + navn + '</b>.</p>',
              visuell: { type: 'noter', noter: [], bredde: 360 } },
            { tekst: '<p>' + refTekst + '. Den linja er tonen <b>' + refB + '</b>.</p>',
              visuell: { type: 'noter', noter: [], markerLinjer: [{ pos: ref, tekst: refB + '-linja', farge: '#e0708f' }], bredde: 360 } },
            { tekst: '<p>En note som står på denne linja heter altså <b>' + refB + '</b>. Fra den kan du telle deg til resten – det gjør vi i leksjon 4.</p>',
              visuell: { type: 'noter', noter: [{ pos: ref, label: refB, tilstand: 'ok' }], bredde: 360, spill: true } }
          ]
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Kjenn igjen nøklene',
          intro: '<p>Nå øver du på å kjenne igjen nøklene og fastpunktene deres.</p>',
          oppgaver: [
            { type: 'valg', spm: 'Hva slags nøkkel står først på disse linjene?', visuell: { type: 'noter', nokkel: 'G', noter: [], bredde: 200 }, valg: ['G-nøkkel', 'F-nøkkel'], riktig: 0, bland: false, hint: 'G-nøkkelen har en krøll som sirkler rundt en linje.', forklaring: 'Krøllen viser at dette er G-nøkkel.' },
            { type: 'valg', spm: 'Hva slags nøkkel står først på disse linjene?', visuell: { type: 'noter', nokkel: 'F', noter: [], bredde: 200 }, valg: ['G-nøkkel', 'F-nøkkel'], riktig: 1, bland: false, hint: 'F-nøkkelen ser ut som en 9-er med to prikker.', forklaring: 'De to prikkene viser at dette er F-nøkkel.' },
            hvilkenLinje(), trykkLinja(), hvorforNokkel()
          ]
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Alene nå',
          intro: '<p>Uten hint. Se på nøkkelen først – hver gang.</p>',
          oppgaver: blandet([[hvilkenNokkel(), hvilkenTone(), hvilkenLinje(), trykkLinja(), trykkLinja(), sammePlass()]])
        },
        {
          type: 'test', tittel: 'Mini-test: nøkkelen', bestaatt: 0.75,
          oppgaver: blandet([[hvilkenNokkel(), hvilkenNokkel(), hvilkenTone(), hvilkenTone(), hvilkenLinje(), trykkLinja(), trykkLinja(), sammePlass()]])
        }
      ]
    };
  },

  teori: function (c) {
    return '<ul>' +
      '<li>Nøkkelen står først på hver linje og sier <b>hvilken tone én bestemt linje har</b>.</li>' +
      '<li><b>G-nøkkel</b> (diskant): krøllen sirkler rundt <b>2. linje</b> = <b>G</b>.</li>' +
      '<li><b>F-nøkkel</b> (bass): de to prikkene ligger rundt <b>4. linje</b> = <b>F</b>.</li>' +
      '<li>Samme plass betyr ulike toner i de to nøklene (3. linje er H i G-nøkkel, D i F-nøkkel).</li>' +
      '<li>Du har valgt <b>' + Noter.nokkelNavn(c.clef) + '</b>.</li>' +
      '</ul>';
  },
  teoriVisuelle: function () {
    return [{ type: 'flere', liste: [
      { type: 'noter', tittel: 'G-nøkkel', nokkel: 'G', noter: [], markerLinjer: [{ pos: 2, tekst: 'G', farge: '#e0708f' }], bredde: 260 },
      { type: 'noter', tittel: 'F-nøkkel', nokkel: 'F', noter: [], markerLinjer: [{ pos: 6, tekst: 'F', farge: '#e0708f' }], bredde: 260 }
    ] }];
  },

  repetisjon: function (c, n) {
    // gjenbruker generatorer ved å bygge en leksjon og hente en tilfeldig oppgave fra testen
    const ut = [];
    for (let i = 0; i < n; i++) {
      const test = Leksjoner.hent('03').bygg(c).steg.filter(function (s) { return s.type === 'test'; })[0];
      ut.push(test.oppgaver[Math.floor(Math.random() * test.oppgaver.length)]);
    }
    return ut;
  }
});
