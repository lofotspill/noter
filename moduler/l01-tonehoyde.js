/* Leksjon 1 – Høye og lave toner */
Leksjoner.registrer({
  nr: 1, del: 1,
  tittel: 'Høye og lave toner',
  kort: 'Hvordan noter viser hvor høyt eller lavt en tone er',
  min: 8,

  bygg: function (c) {
    const G = Oppgaver.Gen;
    const opp = [0, 1, 2, 3, 4, 5, 6].map(function (p) { return { pos: p }; });
    const ned = [7, 6, 5, 4, 3, 2, 1].map(function (p) { return { pos: p }; });

    function blandet(lister) {
      // legger oppgavene etter hverandre, men blander typene litt
      const alle = [].concat.apply([], lister);
      return Oppgaver.blande(alle);
    }

    return {
      steg: [
        {
          type: 'info', tittel: 'Hva noter egentlig forteller deg',
          html:
            '<p>Noter er et skriftspråk for musikk. Hver note forteller deg to ting: <b>hvilken tone</b> du skal spille, og <b>hvor lenge</b>. I denne leksjonen ser vi bare på det første – og aller først bare på én side av det: hvor <span class="begrep">høy</span> eller <span class="begrep">lav</span> tonen er. Dette kalles <span class="begrep">tonehøyde</span>. Rytmen kommer i del 2.</p>' +
            '<p>Trykk på trinnene under og hør forskjellen. Trinnene til venstre klinger dypt og mørkt, de til høyre lyst. På barytonen endrer du tonehøyde med leppespenning og luft, og med ventilene: hver ventil gjør røret lengre, og tonen blir lavere.</p>' +
            '<div class="merk rosa"><b>Prøv på instrumentet:</b> ta gjerne frem barytonen og spill en lav tone og så en høy tone. Kjenn hva som skjer med leppene og luften.</div>',
          visuelle: [{ type: 'trapp', toner: [0, 1, 2, 3, 4, 5, 6, 7].map(function (p) { return Noter.posMidi(p, c.clef); }), lavhoy: true }]
        },
        {
          type: 'info', tittel: 'Notesystemet er som en stige',
          html:
            '<p>Notene skrives i et system av linjer, og her er hele prinsippet: <b>jo høyere opp en note står, desto høyere er tonen.</b> Hører du en tone som går opp, går notene opp i systemet.</p>' +
            '<p>Trykk «Spill av» og følg med på notene mens de klinger. Under ser du først en rekke som stiger, så en som faller.</p>',
          visuelle: [
            { type: 'flere', liste: [
              { type: 'noter', tittel: 'Stigende', noter: opp, spill: true, bredde: 400, gap: 44, skala: 0.95 },
              { type: 'noter', tittel: 'Fallende', noter: ned, spill: true, bredde: 400, gap: 44, skala: 0.95 }
            ] }
          ],
          etter:
            '<div class="merk"><b>Det du ser først er retning:</b> opp eller ned. Hvilken tone det er, lærer du i leksjon 4. Nå handler det om å <i>se</i> og <i>høre</i> at de henger sammen.</div>' +
            '<p class="dempet">Tegnet helt til venstre på linjene kalles en <b>nøkkel</b>. Den forklarer vi i leksjon 3 – foreløpig kan du la den være.</p>'
        },
        {
          type: 'eksempel', tittel: 'Slik leser du retning',
          trinn: [
            { tekst: '<p>Vi starter enkelt. To noter – hvilken klinger høyest?</p><p>Sammenlign hvor høyt oppe <b>notehodene</b> sitter. Notehodet er den runde, fylte delen av noten.</p>',
              visuell: { type: 'noter', noter: [{ pos: 2 }, { pos: 5 }], spill: true, bredde: 260 } },
            { tekst: '<p>Den <b>andre</b> noten sitter høyere opp enn den første, så den andre tonen er høyere. Hør etter.</p><p>Størrelse, farge eller halsen på noten har ingenting å si. Det er bare høyden på notehodet som teller.</p>',
              visuell: { type: 'noter', noter: [{ pos: 2 }, { pos: 5, tilstand: 'hl' }], spill: true, bredde: 260 } },
            { tekst: '<p>Les alltid fra <b>venstre mot høyre</b>, som en tekst. Her går melodien først opp (1 → 2), så ned igjen (2 → 3).</p>',
              visuell: { type: 'noter', noter: [{ pos: 3 }, { pos: 6 }, { pos: 1 }], spill: true, bredde: 340 } },
            { tekst: '<p>Står to noter <b>like høyt</b>, er det samme tone. Går de mange plasser opp, er det et stort sprang; én plass er et lite steg. Her: samme tone to ganger, så et lite steg opp, så et stort sprang opp.</p>',
              visuell: { type: 'noter', noter: [{ pos: 2 }, { pos: 2 }, { pos: 3 }, { pos: 7 }], spill: true, bredde: 420 } }
          ]
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Lytt og se',
          intro: '<p>Nå prøver du selv. Hvis du bommer, får du et hint og et nytt forsøk. Du kan spille av tonene så mange ganger du vil.</p>',
          oppgaver: [].concat(G.lytt(1, true), G.velgnote(1), G.monster(1), G.lytt(1, true), G.velgnote(1))
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Alene nå',
          intro: '<p>Samme type oppgaver, men uten hint. Stol på det du hører og ser.</p>',
          oppgaver: blandet([G.lytt(2, false), G.velgnote(2, 4), G.monster(2)])
        },
        {
          type: 'test', tittel: 'Mini-test: høye og lave toner', bestaatt: 0.75,
          oppgaver: blandet([G.lytt(3, false), G.velgnote(3, 4), G.monster(2)])
        }
      ]
    };
  },

  teori: function () {
    return '<ul>' +
      '<li><b>Tonehøyde</b> = hvor høy eller lav en tone er.</li>' +
      '<li>Jo <b>høyere</b> opp en note står i notesystemet, desto <b>høyere</b> er tonen.</li>' +
      '<li>Noter på <b>samme høyde</b> er samme tone.</li>' +
      '<li>Les alltid fra <b>venstre mot høyre</b>.</li>' +
      '<li>Det er bare notehodets plassering som sier noe om tonehøyde – ikke størrelse eller hals.</li>' +
      '</ul>';
  },

  repetisjon: function (c, n) {
    const G = Oppgaver.Gen;
    const ut = [];
    for (let i = 0; i < n; i++) ut.push(Oppgaver.velg([function () { return G.lytt(1, false)[0]; }, function () { return G.velgnote(1, 4)[0]; }, function () { return G.monster(1)[0]; }])());
    return ut;
  }
});
