/* Register over leksjoner. Hver leksjon ligger i sin egen fil i mappen moduler/ og melder seg her. */
const Leksjoner = (function () {
  const liste = [];

  const deler = [
    { nr: 1, tittel: 'Grunnlaget', tekst: 'Tonehøyde, notelinjer, nøkkelen og notenavn' },
    { nr: 2, tittel: 'Rytme', tekst: 'Puls, noteverdier, pauser og taktarter' },
    { nr: 3, tittel: 'Toner og fortegn', tekst: 'Hele og halve toner, kryss og b, toneart' },
    { nr: 4, tittel: 'Instrumentet ditt', tekst: 'Ventilgrep og barytonens omfang' },
    { nr: 5, tittel: 'Korpsspråk og lesing', tekst: 'Gjentakelser, dynamikk, tempo og lesing av melodier' }
  ];

  /* Hele planen – også leksjoner som ikke er bygget ennå (vises som «kommer») */
  const plan = [
    [1, 1, 'Høye og lave toner'], [2, 1, 'Notelinjer og mellomrom'], [3, 1, 'Nøkkelen'],
    [4, 1, 'Notenavn'], [5, 1, 'Hjelpelinjer og utvidet register'],
    [6, 2, 'Puls og slag'], [7, 2, 'Noteverdier'], [8, 2, 'Pauser'], [9, 2, 'Takt og taktart'],
    [10, 2, 'Punktert note og bindebue'], [11, 2, 'Rytmelek'],
    [12, 3, 'Hele og halve toner'], [13, 3, 'Fortegn'], [14, 3, 'Toneart og forhåndstegn'],
    [15, 4, 'Ventilgrep på barytonen'], [16, 4, 'Barytonens omfang'],
    [17, 5, 'Repetisjoner og hopptegn'], [18, 5, 'Dynamikk, tempo og artikulasjon'],
    [19, 5, 'Lese korte melodier'], [20, 5, 'Avsluttende prøve']
  ].map(function (p) { return { nr: p[0], del: p[1], tittel: p[2] }; });

  return {
    deler: deler,
    plan: plan,
    registrer: function (l) {
      l.id = ('0' + l.nr).slice(-2);
      liste.push(l);
      liste.sort(function (a, b) { return a.nr - b.nr; });
    },
    alle: function () { return liste; },
    hent: function (id) { return liste.filter(function (l) { return l.id === id; })[0]; }
  };
})();
