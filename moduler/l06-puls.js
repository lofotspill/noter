/* Leksjon 6 – Puls og slag */
Leksjoner.registrer({
  nr: 6, del: 2,
  tittel: 'Puls og slag',
  kort: 'Den jevne pulsen som all musikk hviler på – og hvordan du trykker i takt',
  min: 10,

  bygg: function (c) {
    const G = Oppgaver.Gen;
    function blandet(lister) { return Oppgaver.blande([].concat.apply([], lister)); }

    function raskest() {
      const par = Oppgaver.velg([[60, 100], [72, 120], [50, 90], [80, 140]]);
      const aFor = Math.random() < 0.5;
      const a = aFor ? par[1] : par[0], b = aFor ? par[0] : par[1];
      return {
        type: 'valg', spm: 'Hør de to klikkrekkene. Hvilken har raskest tempo?',
        visuell: { type: 'klikkspor', spor: [{ tittel: 'Spor A', bpm: a, antall: 8 }, { tittel: 'Spor B', bpm: b, antall: 8 }] },
        valg: ['Spor A', 'Spor B'], riktig: aFor ? 0 : 1, bland: false,
        hint: 'Raskest tempo = klikkene kommer tettest.', forklaring: 'Raskere tempo betyr flere slag i minuttet.'
      };
    }
    function tellSlag() {
      const n = Oppgaver.rnd(3, 7);
      const alle = [n - 1, n, n + 1, n + 2];
      return {
        type: 'valg', spm: 'Hvor mange slag hører du?',
        visuell: { type: 'klikkspor', spor: [{ tittel: 'Spill klikkene', bpm: 90, antall: n }] },
        valg: alle.map(String), riktig: 1, bland: false,
        hint: 'Telle høyt i hodet: «1, 2, 3 …». Du kan spille igjen.', forklaring: 'Det var ' + n + ' slag.'
      };
    }
    function hva() {
      return {
        type: 'valg', spm: 'Hva er <b>pulsen</b> i musikk?',
        valg: ['Det jevne slaget man kan trampe eller nikke i takt til', 'Hvor høy en tone er', 'Hvor sterkt man spiller', 'Navnet på en nøkkel'], riktig: 0,
        hint: 'Tenk på hjerteslag, eller når du går i jevnt tempo.', forklaring: 'Pulsen er det jevne grunnslaget. Rytmen legges oppå pulsen.'
      };
    }
    function bpm() {
      return {
        type: 'valg', spm: 'Hva betyr «tempo 120»?',
        valg: ['120 slag i minuttet', '120 toner i alt', '120 takter', 'Spill 120 ganger'], riktig: 0, bland: false,
        hint: 'BPM står for «beats per minute».', forklaring: 'Tempo oppgis i slag per minutt. 120 er dobbelt så raskt som 60.'
      };
    }
    function sterkt() {
      return {
        type: 'valg', spm: 'I en 4-deling («1 2 3 4») – hvilket slag er vanligvis sterkest?',
        valg: ['Slag 1', 'Slag 2', 'Slag 3', 'Slag 4'], riktig: 0, bland: false,
        hint: 'Det første slaget i hver takt får trykk.', forklaring: 'Slag 1 er sterkest. Det gjør at vi hører hvor hver takt begynner.'
      };
    }

    return {
      steg: [
        {
          type: 'info', tittel: 'Pulsen',
          html:
            '<p>Før vi ser på hvordan rytme skrives, skal du kjenne <span class="begrep">pulsen</span>. Pulsen er det jevne grunnslaget i musikken – det du tramper eller nikker i takt til. Hjerteslag og skritt når du går er en puls.</p>' +
            '<p>Notene i korpset forteller når du skal spille <i>i forhold til</i> pulsen. Skal du spille i takt med de andre, må du kjenne den.</p>' +
            '<p>Trykk «Start» og følg med på slagene. Skyv i glideren og hør hvordan tempoet endrer seg.</p>',
          visuelle: [{ type: 'metronom', bpm: 72, sterk: true }],
          etter: '<div class="merk rosa"><b>Prøv:</b> trampe eller nikk i takt med metronomen. Hvis du klarer å holde jevnt i 30 sekunder, har du pulsen.</div>'
        },
        {
          type: 'info', tittel: 'Tempo og slag',
          html:
            '<p>Hastigheten på pulsen kalles <span class="begrep">tempo</span>. Det regnes i <b>slag per minutt</b> (BPM). 60 betyr ett slag i sekundet. 120 er dobbelt så raskt.</p>' +
            '<p>Slagene regnes ofte i grupper: «<b>1</b> 2 3 4, <b>1</b> 2 3 4». Det første slaget i hver gruppe er litt sterkere. Gruppene kalles <span class="begrep">takter</span> – mer om det i leksjon 9.</p>',
          visuelle: [{ type: 'klikkspor', spor: [{ tittel: 'Sakte (60)', bpm: 60, antall: 8, sterk: true }, { tittel: 'Moderat (90)', bpm: 90, antall: 8, sterk: true }, { tittel: 'Raskt (130)', bpm: 130, antall: 8, sterk: true }] }]
        },
        {
          type: 'eksempel', tittel: 'Slik trykker du i takt',
          trinn: [
            { tekst: '<p>I rytmeoppgavene ser du rytmen som en linje med noter. Under hver note står tallet på slaget den faller på.</p>',
              visuell: { type: 'rytme', elementer: Rytme.fra('q q q q'), takt: [4, 4], tell: true, bredde: 460, spill: false } },
            { tekst: '<p>Du trykker på «Start». Metronomen teller inn én takt («1 – 2 – 3 – 4»), og så trykker du på knappen – eller mellomromstasten – hver gang det står en note.</p><p>Her er det en kvartnote på hvert slag, altså fire like trykk per takt.</p>',
              visuell: { type: 'rytme', elementer: Rytme.fra('q q q q'), takt: [4, 4], tell: true, bredde: 460, bpm: 66 } },
            { tekst: '<p>Du får tilbakemelding på hvilke slag du traff (grønt) og hvilke du bommet på (rødt). Du trenger ikke være millimeterpresis – vi ser etter at du <b>trykker på riktig slag</b>.</p>',
              visuell: { type: 'rytme', elementer: [{ v: 'q', tilstand: 'ok' }, { v: 'q', tilstand: 'ok' }, { v: 'q', tilstand: 'bad' }, { v: 'q', tilstand: 'ok' }], takt: [4, 4], tell: true, bredde: 460, spill: false } }
          ]
        },
        {
          type: 'ovelse', modus: 'veiledet', tittel: 'Lytt og trykk',
          intro: '<p>Først litt lytting, så din første trykkoppgave. Lyd må være på.</p>',
          oppgaver: [hva(), raskest(), tellSlag()].concat(G.tapp(2, { takter: 1, bpm: 60, tillat: ['q'], takt: [4, 4] }))
        },
        {
          type: 'ovelse', modus: 'selvstendig', tittel: 'Alene nå',
          intro: '<p>Uten hint. Hold pulsen jevn og tell høyt om du vil.</p>',
          oppgaver: blandet([[raskest(), tellSlag(), bpm(), sterkt()], G.tapp(2, { takter: 2, bpm: 72, tillat: ['q'] })])
        },
        {
          type: 'test', tittel: 'Mini-test: puls og slag', bestaatt: 0.75,
          oppgaver: blandet([[raskest(), tellSlag(), bpm(), sterkt()], G.tapp(2, { takter: 2, bpm: 76, tillat: ['q'] })])
        }
      ]
    };
  },

  teori: function () {
    return '<ul>' +
      '<li><b>Puls</b> = det jevne grunnslaget i musikk.</li>' +
      '<li><b>Tempo</b> = hvor raskt pulsen går, målt i slag per minutt (BPM).</li>' +
      '<li>Slag regnes i grupper (<b>takter</b>): «1 2 3 4». Slag 1 er sterkest.</li>' +
      '<li>Notene sier når du skal spille i forhold til pulsen.</li>' +
      '</ul>';
  },

  repetisjon: function (c, n) {
    const G = Oppgaver.Gen;
    const ut = [];
    for (let i = 0; i < n; i++) ut.push(G.tapp(1, { takter: 1, bpm: 70, tillat: ['q'] })[0]);
    return ut;
  }
});
