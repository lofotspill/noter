/* Leksjon 8 – Pauser */
Leksjoner.registrer({
  nr: 8, del: 2,
  tittel: 'Pauser',
  kort: 'Stillhet som også skal telles',
  min: 10,

  bygg: function (c) {
    const G = Oppgaver.Gen;
    function blandet(lister) { return Oppgaver.blande([].concat.apply([], lister)); }
    const R = Rytme.fra.bind(Rytme);

    return {
      steg: [
        {
          type: 'info', tittel: 'Stillhet også har lengde',
          html:
            '<p>Av og til skal du <b>ikke</b> spille. Det vises med en <span class="begrep">pause</span>. Hver notelengde har sin egen pause med samme varighet:</p>' +
            '<ul><li><b>Helpause</b>: 4 slag. En liten blokk som henger under linjen.</li><li><b>Halvpause</b>: 2 slag. En blokk som sitter på linjen.</li><li><b>Kvartpause</b>: 1 slag. En krøllete strek.</li><li><b>Åttedelspause</b>: ½ slag. Ser ut som en liten 7-er.</li></ul>' +
            '<p>Pausen skal <b>telles</b> akkurat som en note. Pulsen stopper ikke selv om du ikke spiller.</p>',
          visuelle: [{ type: 'verdibar', rader: [{ v: 'w', n: 1, pause: true }, { v: 'h', n: 2, pause: true }, { v: 'q', n: 4, pause: true }, { v: 'e', n: 8, pause: true }] }],
          etter: '<div class="merk"><b>Husk:</b> Helpausen henger <i>under</i> linja («den har det tungt»), halvpausen sitter <i>oppå</i> linja («som en hatt»).</div>'
        },
        {
          type: 'info', tittel: 'Pauser i en rytme',
          html:
            '<p>Pauser står blant notene og får samme tellemåte. Under spiller du slag 1, holder pause på slag 2, og spiller igjen på 3 og 4.</p>' +
            '<p>På barytonen betyr en pause at du slutter å blåse, men at du <b>fortsetter å telle</b> og er klar til å komme inn igjen på riktig slag.</p>',
          visuelle: [{ type: 'rytme', elementer: R('q rq q q | rh h'), takt: [4, 4], tell: true, bredde: 560 }],
          etter: '<p class="dempet">Hører du at det er stille på slag 2 i første takt, og på slag 1–2 i andre?</p>'
        },
        {
          type: 'eksempel', tittel: 'Slik leser du pauser',
          trinn: [
            { tekst: '<p>Her er en takt med en pause i. Hva slags pause er det?</p>',
              visuell: { type: 'rytme', elementer: R('q rh q'), takt: [4, 4], tell: true, spill: false, bredde: 480 } },
            { tekst: '<p>En blokk som sitter <b>på linjen</b> er en <b>halvpause</b> – 2 slag. Takten blir: kvart (1) + halvpause (2) + kvart (1) = 4 slag.</p>',
              visuell: { type: 'rytme', elementer: [{ v: 'q' }, { v: 'h', pause: true, tilstand: 'hl' }, { v: 'q' }], takt: [4, 4], tell: true, spill: false, bredde: 480 } },
            { tekst: '<p>Du spiller på slag <b>1</b>, er stille på <b>2 og 3</b>, og spiller på slag <b>4</b>. Hør rytmen og tell med.</p>',
              visuell: { type: 'rytme', elementer: R('q rh q'), takt: [4, 4], tell: true, bredde: 480 } }
          ]
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Pauser: veiledet',
          intro: '<p>Først kjenner du igjen pausene. Så trykker du rytmer med pauser: trykk bare på notene.</p>',
          oppgaver: [].concat(G.noteNavn(2, { pause: true }), G.verdi(2, { pause: true }), G.pauseHva(1), G.tapp(2, { takter: 1, bpm: 60, tillat: ['q', 'h'], pauser: 0.35 }))
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Pauser: alene',
          intro: '<p>Uten hint. Tell også gjennom pausene.</p>',
          oppgaver: blandet([G.noteNavn(2, { pause: true }), G.pauseHva(2), G.hoerRytme(2, { tillat: ['q', 'h'], pauser: 0.5 }), G.tapp(3, { takter: 2, bpm: 66, tillat: ['q', 'h', 'e'], pauser: 0.4 })])
        },
        {
          type: 'test', tittel: 'Mini-test: pauser', bestaatt: 0.75,
          oppgaver: blandet([G.noteNavn(2, { pause: true }), G.verdi(1, { pause: true }), G.pauseHva(2), G.hoerRytme(2, { tillat: ['q', 'h'], pauser: 0.5 }), G.tapp(2, { takter: 2, bpm: 66, tillat: ['q', 'h'], pauser: 0.4 })])
        }
      ]
    };
  },

  teori: function () {
    return '<ul>' +
      '<li>Pause = stillhet med en bestemt lengde. <b>Pauser telles</b> som noter.</li>' +
      '<li>Helpause: 4 slag (henger under linja). Halvpause: 2 slag (sitter på linja).</li>' +
      '<li>Kvartpause: 1 slag. Åttedelspause: ½ slag.</li>' +
      '<li>På instrumentet: stopp luften, men tell videre.</li>' +
      '</ul>';
  },
  teoriVisuelle: function () {
    return [{ type: 'verdibar', rader: [{ v: 'w', n: 1, pause: true }, { v: 'h', n: 2, pause: true }, { v: 'q', n: 4, pause: true }, { v: 'e', n: 8, pause: true }] }];
  },

  repetisjon: function (c, n) {
    const G = Oppgaver.Gen;
    const ut = [];
    for (let i = 0; i < n; i++) ut.push(Oppgaver.velg([
      function () { return G.noteNavn(1, { pause: true })[0]; }, function () { return G.pauseHva(1)[0]; },
      function () { return G.tapp(1, { takter: 1, tillat: ['q', 'h'], pauser: 0.4 })[0]; }
    ])());
    return ut;
  }
});
