/* =====================================================================
   Innstillinger for Google Skjema (valgfritt)
   Se README.md for hvordan du finner verdiene.
   Er "url" tom, lagres fremdriften bare lokalt i nettleseren.
   ===================================================================== */
window.KONFIG = {
  appNavn: 'Noter for baryton',
  versjon: '1.0',
  skjema: {
    // Lenke som slutter på /formResponse, f.eks.
    // 'https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxx/formResponse'
    url: '',
    // entry-ID for hvert felt i skjemaet, f.eks. 'entry.123456789'
    felt: {
      navn: '',
      leksjon: '',
      type: '',        // "leksjon" eller "repetisjon"
      resultat: '',    // prosent riktig
      stjerner: '',
      forsok: '',
      tid: '',         // sekunder
      nokkel: '',      // G eller F
      tidspunkt: ''
    }
  }
};
