/* Lagring: fremdrift i nettleseren + valgfri innsending til Google Skjema */
const Lagring = (function () {
  const NOKKEL = 'noterSpill.v1';

  function standard() {
    return {
      profil: { navn: '', nokkel: null, klingende: false, ventiler: 3, lyd: true, laasOpp: false },
      fremdrift: {},   // id -> {ferdig, stjerner, beste, forsok, tid, sist}
      svake: {},       // id -> antall feil i repetisjon/øving
      ko: [],          // innsendinger som ikke kom frem
      repetisjoner: 0
    };
  }
  function slaaSammen(a, b) {
    const ut = standard();
    ['profil', 'fremdrift', 'svake'].forEach(function (k) { ut[k] = Object.assign(ut[k], (b && b[k]) || {}); });
    ut.ko = (b && b.ko) || [];
    ut.repetisjoner = (b && b.repetisjoner) || 0;
    return ut;
  }
  let d;
  try { d = slaaSammen(standard(), JSON.parse(localStorage.getItem(NOKKEL))); } catch (e) { d = standard(); }

  function lagre() { try { localStorage.setItem(NOKKEL, JSON.stringify(d)); } catch (e) { /* privat modus */ } }

  function bygdSkjemaBody(post) {
    const f = (window.KONFIG && KONFIG.skjema && KONFIG.skjema.felt) || {};
    const p = new URLSearchParams();
    Object.keys(post).forEach(function (k) { if (f[k]) p.append(f[k], post[k]); });
    return p;
  }
  function skjemaKlart() { return !!(window.KONFIG && KONFIG.skjema && KONFIG.skjema.url); }

  function sendEn(post) {
    return fetch(KONFIG.skjema.url, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bygdSkjemaBody(post)
    });
  }
  function toemKo() {
    if (!skjemaKlart() || !d.ko.length) return;
    const ko = d.ko.slice();
    d.ko = [];
    lagre();
    ko.forEach(function (post) {
      sendEn(post).catch(function () { d.ko.push(post); lagre(); });
    });
  }

  const api = {
    profil: function () { return d.profil; },
    settProfil: function (o) { Object.assign(d.profil, o); lagre(); },
    fremdrift: function (id) { return d.fremdrift[id] || null; },
    alleFremdrift: function () { return d.fremdrift; },
    svake: function () { return d.svake; },
    repetisjoner: function () { return d.repetisjoner; },
    skjemaKlart: skjemaKlart,

    lagreLeksjon: function (id, r) {
      const gml = d.fremdrift[id] || { forsok: 0, beste: 0, stjerner: 0, tid: 0, ferdig: false };
      const ny = {
        ferdig: gml.ferdig || r.bestatt,
        stjerner: Math.max(gml.stjerner || 0, r.bestatt ? r.stjerner : 0),
        beste: Math.max(gml.beste || 0, r.prosent),
        forsok: (gml.forsok || 0) + 1,
        tid: (gml.tid || 0) + r.tid,
        sist: new Date().toISOString()
      };
      d.fremdrift[id] = ny;
      lagre();
      return ny;
    },
    registrerFeil: function (id, antall) {
      d.svake[id] = (d.svake[id] || 0) + antall;
      lagre();
    },
    registrerRepetisjon: function () { d.repetisjoner++; lagre(); },

    /* Sender til Google Skjema (hvis satt opp) – feiler stille */
    send: function (post) {
      post = Object.assign({
        navn: d.profil.navn || '(uten navn)',
        nokkel: d.profil.nokkel || '',
        tidspunkt: new Date().toISOString()
      }, post);
      if (!skjemaKlart()) return;
      sendEn(post).catch(function () { d.ko.push(post); lagre(); });
      toemKo();
    },
    toemKo: toemKo,

    eksporter: function () {
      const s = JSON.stringify(d);
      return btoa(unescape(encodeURIComponent(s)));
    },
    importer: function (kode) {
      try {
        const s = decodeURIComponent(escape(atob(kode.trim())));
        d = slaaSammen(standard(), JSON.parse(s));
        lagre();
        return true;
      } catch (e) { return false; }
    },
    nullstill: function () { d = standard(); lagre(); }
  };
  toemKo();
  return api;
})();
