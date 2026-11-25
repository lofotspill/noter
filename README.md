# Noter for baryton

Et interaktivt læringsspill for deg som skal lære å lese noter fra grunnen av. Hver leksjon har forklaring, gjennomgått eksempel, veiledet øving, selvstendig øving og en liten test. Fremdriften lagres i nettleseren og kan i tillegg sendes til et Google Skjema.

Dette er en ren statisk nettside – ingen byggesteg, ingen server, ingen avhengigheter.

## Status

Del 1 (leksjon 1–5) er ferdig: tonehøyde, notelinjer og mellomrom, nøkkelen, notenavn, hjelpelinjer.
Del 2–5 (rytme, fortegn, ventilgrep, korpsspråk og melodilesing) står på oversikten som «kommer snart» og bygges på samme motor.

## Prøve lokalt

Pakk ut mappen og dobbeltklikk `index.html`. Det fungerer rett fra filen i vanlige nettlesere.

## Legge ut på GitHub (GitHub Pages)

1. Lag et nytt repo på GitHub, for eksempel `noter-spillet`.
2. Last opp **innholdet** i denne mappen (`index.html`, `css/`, `js/`, `moduler/`, `README.md`) til rotmappen i repoet.
3. Gå til *Settings → Pages*. Under *Build and deployment* velger du *Deploy from a branch*, branch `main` og mappe `/ (root)`. Lagre.
4. Etter et minutt er siden tilgjengelig på `https://<brukernavn>.github.io/noter-spillet/`.

Fremdriften lagres per nettleser. Under *Innstillinger* finnes en «fremdriftskode» du kan kopiere for å flytte fremdriften til en annen enhet.

## Koble til Google Skjema (valgfritt)

Når du fullfører en leksjon eller en repetisjon, sendes ett svar til skjemaet ditt i bakgrunnen (uten at du forlater siden).

1. Lag et nytt Google Skjema. Legg til **ni spørsmål av typen «Kort svar»**, med disse titlene: `Navn`, `Leksjon`, `Type`, `Resultat`, `Stjerner`, `Forsøk`, `Tid`, `Nøkkel`, `Tidspunkt`. Ingen av dem skal være obligatoriske, og skjemaet må ikke kreve innlogging eller begrense til ett svar per person.
2. Trykk på de tre prikkene (⋮) øverst til høyre og velg **Hent forhåndsutfylt lenke**. Skriv `a` i første felt, `b` i andre, `c` i tredje og så videre, og trykk **Hent lenke**. Kopier lenken.
3. I lenken ser du `entry.123456789=a`, `entry.987654321=b` osv. Tallene etter `entry.` er ID-ene til feltene, i samme rekkefølge som spørsmålene dine.
4. Åpne `js/config.js` og fyll inn:
   - `url`: skjemalenken (den som starter med `https://docs.google.com/forms/d/e/…`), men med `viewform` byttet ut med `formResponse` på slutten.
   - `felt`: entry-ID-ene, for eksempel `navn: 'entry.123456789'`.
5. Last opp den endrede `config.js` til GitHub.

Hvert svar inneholder: navn, leksjon, type (`leksjon` eller `repetisjon`), resultat i prosent, stjerner, antall forsøk, tid i sekunder, valgt nøkkel og tidspunkt. Du kan se alt i fanen *Svar* i skjemaet, eller koble det til et regneark.

Er `url` tom, lagres fremdriften bare lokalt. Hvis nettverket svikter, prøves innsendingen på nytt neste gang siden åpnes.

## Struktur

```
index.html             Startside. Her listes leksjonsfilene.
css/stil.css           Utseende
js/config.js           Google Skjema-oppsett
js/glyfer.js           Nøkler og fortegn som SVG-stier
js/lyd.js              Toner og lydeffekter (WebAudio, ingen lydfiler)
js/notasjon.js         Tegner notesystemet
js/oppgaver.js         Oppgavetyper, kjøreren og oppgavegeneratorer
js/lagring.js          Fremdrift i nettleseren og innsending til skjema
js/leksjoner.js        Leksjonsregister og oversikt over hele planen
js/app.js              Visninger: hjem, leksjon, repetisjon, teori, fremdrift, innstillinger
moduler/l01-…l05-…     Én fil per leksjon
```

## Legge til en ny leksjon

1. Kopier en eksisterende fil i `moduler/` og endre `nr`, `del`, `tittel` og innholdet.
2. Legg til en `<script>`-linje for den nye filen i `index.html`, før `js/app.js`.
3. Planen i `js/leksjoner.js` har allerede plass til alle 20 leksjonene.

Hver leksjon er et JavaScript-objekt med `bygg(ctx)` som returnerer trinnene (`info`, `eksempel`, `ovelse`, `test`), `teori()` til oppslagssiden og `repetisjon()` som gir oppgaver til daglig repetisjon.

### Oppgavetyper

`valg` (flervalg, med valgfritt notebilde), `lytt` (hør og velg), `navn` (hva heter noten), `klikk` (trykk eller plasser en note), `velgnote` (trykk på riktig note), `velgmonster` (hør melodi, velg notebilde). Visningen `trapp` er en tonetrapp du kan trykke på for å høre toner.

## Om nøkkel og lyd

- Du velger G-nøkkel eller F-nøkkel første gang du åpner spillet (kan endres under *Innstillinger*). Alle leksjoner tilpasser seg valget.
- Navnene i kurset er alltid de **skrevne** navnene, det du leser i notene.
- Under *Innstillinger* kan du la tonene klinge som en B-stemt baryton i G-nøkkel (14 halvtoner lavere enn skrevet). Som standard spilles tonen slik den står skrevet.

## Lisenser

Nøkkelsymbolene er hentet fra fonten Noto Music (SIL Open Font License 1.1).
