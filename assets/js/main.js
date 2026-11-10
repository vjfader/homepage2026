/* Fader homepage — small, dependency-free enhancements. */
(function () {
  'use strict';

  /* Header: solid background once the page is scrolled */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile navigation */
  var toggle = document.querySelector('[data-nav-toggle]');
  if (toggle) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      document.documentElement.classList.toggle('nav-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setOpen(false); } });
  }

  /* Click-to-play YouTube: nothing loads from YouTube until clicked */
  document.querySelectorAll('[data-yt]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(link.dataset.yt) + '?autoplay=1&rel=0&modestbranding=1';
      iframe.title = link.dataset.title || 'YouTube video';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      var wrap = document.createElement('div');
      wrap.className = 'video is-playing';
      wrap.appendChild(iframe);
      link.replaceWith(wrap);
      iframe.focus();
    });
  });

  /* Lightbox for the work grid (native <dialog>) */
  var dialog = document.querySelector('[data-lightbox-dialog]');
  if (dialog && typeof dialog.showModal === 'function') {
    var img = dialog.querySelector('[data-lightbox-img]');
    var cap = dialog.querySelector('[data-lightbox-caption]');
    document.querySelectorAll('[data-lightbox]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var thumb = a.querySelector('img');
        img.src = a.href;
        img.alt = thumb ? thumb.alt : '';
        cap.textContent = a.dataset.caption || '';
        dialog.showModal();
      });
    });
    dialog.querySelector('[data-lightbox-close]').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) { dialog.close(); } });
    dialog.addEventListener('close', function () { img.removeAttribute('src'); });
  }

  /* Contact form: require the Netlify reCAPTCHA before sending */
  document.querySelectorAll('form[name="contact"]').forEach(function (form) {
    var warning = form.querySelector('[data-contact-form-warning]');
    form.addEventListener('submit', function (e) {
      var r = form.querySelector('textarea[name="g-recaptcha-response"]');
      if (r && r.value.trim().length === 0) {
        e.preventDefault();
        if (warning) { warning.hidden = false; }
      }
    });
    form.addEventListener('input', function () { if (warning) { warning.hidden = true; } });
  });

  /* Offline page support */
  if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
  }
})();
