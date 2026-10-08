// VKU Oberbaselbiet, Entwurf. Steuert Dunkelmodus, Terminauswahl, Formular und das Auto nach oben.
(function () {
  var site = document.querySelector('.site');
  var themeBtn = document.querySelector('[data-action="theme"]');

  function setTheme(dark) {
    site.classList.toggle('dark', dark);
    if (themeBtn) themeBtn.textContent = dark ? 'Hell' : 'Dunkel';
    try { localStorage.setItem('vku-theme', dark ? 'dark' : 'light'); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('vku-theme'); } catch (e) {}
  if (saved === 'dark') setTheme(true);

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  var gewaehlt = document.getElementById('gewaehlt');
  var zuTerminen = document.getElementById('zu-terminen');
  var aendern = document.getElementById('aendern');
  var formular = document.getElementById('formular');
  var danke = document.getElementById('danke');
  var hp = document.getElementById('hp');

  function setChoice(text) {
    if (!gewaehlt) return;
    gewaehlt.textContent = text || 'Bitte oben bei einem Lokal einen Termin wählen';
    if (zuTerminen) zuTerminen.hidden = !!text;
    if (aendern) aendern.hidden = !text;
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    var a = t.getAttribute('data-action');
    if (a === 'theme') setTheme(!site.classList.contains('dark'));
    else if (a === 'lokale') scrollToId('lokale');
    else if (a === 'pick') {
      setChoice(t.getAttribute('data-kurs'));
      if (formular) formular.hidden = false;
      if (danke) danke.hidden = true;
      scrollToId('anmeldung');
    } else if (a === 'send') {
      // Spamschutz: Bots füllen das unsichtbare Feld aus. Im Entwurf wird ohnehin nichts verschickt.
      if (hp && hp.value) { /* still verwerfen */ }
      if (formular) formular.hidden = true;
      if (danke) danke.hidden = false;
    } else if (a === 'reset') {
      setChoice('');
      if (formular) formular.hidden = false;
      if (danke) danke.hidden = true;
    }
  });

  // Auto unten rechts: erscheint nach etwas Scrollen, raucht kurz und fährt dann nach oben.
  var car = document.getElementById('topcar');
  var smoke = document.getElementById('smoke');
  var phase = 'idle';
  function onScroll() {
    if (!car || phase !== 'idle') return;
    car.classList.toggle('show', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (car) car.addEventListener('click', function () {
    if (phase !== 'idle') return;
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function go() {
      phase = 'drive';
      car.classList.remove('burn');
      car.classList.add('show', 'drive');
      if (smoke) smoke.classList.add('fade');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(function () {
        phase = 'idle';
        car.classList.remove('drive', 'show');
        if (smoke) smoke.classList.remove('on', 'fade');
      }, 1000);
    }
    if (calm) { go(); return; }
    phase = 'burn';
    car.classList.add('burn');
    if (smoke) smoke.classList.add('on');
    setTimeout(go, 900);
  });
})();
