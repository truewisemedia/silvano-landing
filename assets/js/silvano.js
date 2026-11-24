/* Silvano landing pages: reveals, sticky booking button, booking clicks. */
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero film: never autoplay when reduced motion is on.
  var film = document.querySelector('.hero video');
  // Wide screens: swap to the landscape-friendly film when the page offers one.
  if (film && film.dataset.wideSrc && window.matchMedia('(min-width: 1024px)').matches) {
    film.poster = film.dataset.widePoster;
    film.src = film.dataset.wideSrc;
    var still = document.querySelector('.hero .hero-still');
    if (still) still.src = film.dataset.widePoster;
  }
  if (film) {
    if (reduce) { film.removeAttribute('autoplay'); film.pause(); }
    else { var p = film.play(); if (p && p.catch) p.catch(function () {}); }
  }

  // Quiet reveals.
  var items = document.querySelectorAll('.reveal, .push');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Sticky "Book Your Consult" after the hero, hidden once the booking section is on screen.
  var sticky = document.querySelector('.sticky-book');
  var hero = document.querySelector('.hero');
  var book = document.getElementById('book');
  if (sticky && hero && 'IntersectionObserver' in window) {
    var heroOut = false, bookIn = false;
    var update = function () { sticky.classList.toggle('is-visible', heroOut && !bookIn); };
    new IntersectionObserver(function (e) { heroOut = !e[0].isIntersecting; update(); }, { threshold: 0.05 }).observe(hero);
    if (book) new IntersectionObserver(function (e) { bookIn = e[0].isIntersecting; update(); }, { threshold: 0.05 }).observe(book);
  }

  // Booking clicks: Meta "Lead" when the pixel is installed.
  document.querySelectorAll('[data-book]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: document.body.dataset.story || 'consult' });
    });
  });
})();
