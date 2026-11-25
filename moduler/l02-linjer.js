/* Leksjon 2 – Notelinjer og mellomrom */
Leksjoner.registrer({
  nr: 2, del: 1,
  tittel: 'Notelinjer og mellomrom',
  kort: 'Fem linjer, fire mellomrom – og hvordan du teller dem',
  min: 9,

  bygg: function (c) {
    const G = Oppgaver.Gen;
    function blandet(lister) { return Oppgaver.blande([].concat.apply([], lister)); }

    return {
      steg: [
        {
          type: 'info', tittel: 'Notesystemet',
          html:
            '<p>Noter skrives på et <span class="begrep">notesystem</span>: <b>fem linjer</b> med <b>fire mellomrom</b> mellom dem. Både linjene og mellomrommene er plasser en note kan stå – til sammen ni plasser.</p>' +
            '<p>Vi teller alltid <b>nedenfra og opp</b>: den nederste linjen er <b>1. linje</b>, mellomrommet over den er <b>1. mellomrom</b>, så kommer 2. linje, og så videre. Du ser alle ni plassene med navn under.</p>' +
            '<p class="dempet">Tegnet helt til venstre er nøkkelen. Den forklarer vi i neste leksjon – foreløpig teller vi bare plasser.</p>',
          visuelle: [{ type: 'noter', noter: [], posEtiketter: true, bredde: 500, klav: true, skala: 1.2 }],
          etter: '<p class="dempet">Husk: <b>nedenfra og opp</b>. Det er det mest vanlige feilsteget i begynnelsen.</p>'
        },
        {
          type: 'info', tittel: 'På en linje eller i et mellomrom?',
          html:
            '<p>En note står enten <b>på en linje</b> – da går linjen rett gjennom notehodet – eller <b>i et mellomrom</b>, der notehodet ligger mellom to linjer.</p>',
          visuelle: [
            { type: 'flere', liste: [
              { type: 'noter', tittel: 'På en linje', noter: [{ pos: 4, label: 'på 3. linje' }], bredde: 280 },
              { type: 'noter', tittel: 'I et mellomrom', noter: [{ pos: 5, label: 'i 3. mellomrom' }], bredde: 280 }
            ] }
          ],
          etter: '<div class="merk">Når noten har hals (den lille streken), er det <b>notehodet</b> som bestemmer plassen – ikke halsen.</div>'
        },
        {
          type: 'eksempel', tittel: 'Slik finner du plassen til en note',
          trinn: [
            { tekst: '<p>Vi skal finne ut hvor denne noten står.</p>',
              visuell: { type: 'noter', noter: [{ pos: 6 }], bredde: 260 } },
            { tekst: '<p><b>Først:</b> linje eller mellomrom? En linje går rett gjennom notehodet – så noten står <b>på en linje</b>.</p>',
              visuell: { type: 'noter', noter: [{ pos: 6, tilstand: 'hl' }], markerLinjer: [{ pos: 6, farge: '#e0708f' }], bredde: 260 } },
            { tekst: '<p><b>Så:</b> tell nedenfra, ett trinn for hver linje og hvert mellomrom: 1. linje, 1. mellomrom, 2. linje, 2. mellomrom, 3. linje, 3. mellomrom, <b>4. linje</b>. Noten står på 4. linje.</p>',
              visuell: { type: 'noter', noter: [{ pos: 6, tilstand: 'hl' }], posEtiketter: true, bredde: 500, skala: 1.2 } },
            { tekst: '<p>Samme metode med en annen note. <b>Først:</b> notehodet ligger mellom to linjer – et <b>mellomrom</b>.</p><p><b>Så:</b> det første mellomrommet er mellom 1. og 2. linje, det andre mellom 2. og 3. linje. Dette er <b>2. mellomrom</b>.</p>',
              visuell: { type: 'noter', noter: [{ pos: 3, tilstand: 'hl' }], posEtiketter: true, bredde: 500, skala: 1.2 } }
          ]
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Tell og trykk',
          intro: '<p>Nå øver du på å finne plassene. Hvis du bommer, får du et nytt forsøk.</p>',
          oppgaver: [].concat(G.klikkPos(2, c.clef), G.linjeEllerMellomrom(1), G.identifiser(2, c.clef), G.klikkPos(1, c.clef))
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Alene nå',
          intro: '<p>Uten hint. Husk å telle nedenfra.</p>',
          oppgaver: blandet([G.klikkPos(4, c.clef), G.identifiser(3, c.clef)])
        },
        {
          type: 'test', tittel: 'Mini-test: linjer og mellomrom', bestaatt: 0.75,
          oppgaver: blandet([G.klikkPos(4, c.clef), G.identifiser(4, c.clef)])
        }
      ]
    };
  },

  teori: function () {
    return '<ul>' +
      '<li>Notesystemet har <b>5 linjer</b> og <b>4 mellomrom</b> – til sammen 9 plasser.</li>' +
      '<li>Du teller alltid <b>nedenfra og opp</b>: 1. linje, 1. mellomrom, 2. linje, 2. mellomrom …</li>' +
      '<li>En note står enten <b>på en linje</b> (linjen går gjennom notehodet) eller <b>i et mellomrom</b>.</li>' +
      '<li>Notehodet avgjør plassen – ikke halsen.</li>' +
      '</ul>';
  },
  teoriVisuelle: function () {
    return [{ type: 'noter', noter: [], posEtiketter: true, bredde: 500, skala: 1.1 }];
  },

  repetisjon: function (c, n) {
    const G = Oppgaver.Gen;
    const ut = [];
    for (let i = 0; i < n; i++) ut.push(Oppgaver.velg([function () { return G.klikkPos(1, c.clef)[0]; }, function () { return G.identifiser(1, c.clef)[0]; }, function () { return G.linjeEllerMellomrom(1)[0]; }])());
    return ut;
  }
});
