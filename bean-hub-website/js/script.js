// Bean Hub — shared site behavior
(function () {
  var html = document.documentElement;

  function getUrlLang() {
    var params = new URLSearchParams(window.location.search);
    var l = params.get('lang');
    return (l === 'ar' || l === 'en') ? l : null;
  }

  function currentLang() {
    // Priority: URL param (works even when localStorage can't persist
    // across pages, e.g. when opening the site as local files) > saved
    // preference > default English.
    return getUrlLang() || localStorage.getItem('beanhub-lang') || 'en';
  }

  function updateInternalLinks(lang) {
    // Carry the language forward on every same-site link so switching
    // to Arabic stays "connected" as you move between pages.
    var links = document.querySelectorAll('a[href]');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      // Skip external links, mailto/tel, whatsapp, anchors, etc.
      if (/^([a-z]+:)?\/\//i.test(href) || href.indexOf('mailto:') === 0 ||
          href.indexOf('tel:') === 0 || href.indexOf('#') === 0) {
        return;
      }
      if (href.indexOf('.html') === -1) return;
      var base = href.split('?')[0];
      a.setAttribute('href', base + '?lang=' + lang);
    });
  }

  function applyLang(lang) {
    html.setAttribute('data-lang', lang);
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    var btn = document.querySelector('.lang-toggle');
    if (btn) btn.textContent = lang === 'ar' ? 'English' : 'العربية';
    localStorage.setItem('beanhub-lang', lang);
    updateInternalLinks(lang);

    // The browser tab title isn't wrapped like body text, so on an RTL
    // page a plain English title gets visually reordered (e.g. "Beans Hub"
    // shows as "Hub Beans"). Fix: swap in the matching localized title
    // whenever the language changes.
    var titleAttr = lang === 'ar' ? 'data-title-ar' : 'data-title-en';
    var title = html.getAttribute(titleAttr);
    if (title) document.title = title;

    // Keep the URL in sync so refreshing or sharing the link preserves it.
    var url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(currentLang());

    var toggle = document.querySelector('.lang-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = html.getAttribute('data-lang') || 'en';
        applyLang(current === 'en' ? 'ar' : 'en');
      });
    }

    var menuToggle = document.querySelector('.menu-toggle');
    var navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('open');
      });
    }
  });
})();
