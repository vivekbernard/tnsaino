/* ============================================================
   TNSAINO TALENT SOLUTIONS — Interactions
   ============================================================ */

(function () {
  'use strict';

  // ---------- THEME TOGGLE ----------
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  function getPreferredTheme() {
    const stored = localStorage.getItem('tnsaino-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('tnsaino-theme', theme);
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  themeToggle.addEventListener('click', function () {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Respect system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('tnsaino-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ---------- NAVIGATION ----------
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const navHamburger = document.getElementById('navHamburger');
  const allNavLinks = document.querySelectorAll('.nav__link');

  // Scroll shadow
  function handleNavScroll() {
    if (window.scrollY > 10) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile menu toggle
  navHamburger.addEventListener('click', function () {
    navLinks.classList.toggle('nav__links--open');
    navHamburger.classList.toggle('nav__hamburger--open');
  });

  // Close mobile menu on link click
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('nav__links--open');
      navHamburger.classList.remove('nav__hamburger--open');
    });
  });

  // Active link tracking on scroll
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    var scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        allNavLinks.forEach(function (link) {
          link.classList.remove('nav__link--active');
          var href = link.getAttribute('href');
          if (href === '#' + id || (id === 'hero' && href === '#hero')) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // ---------- SCROLL REVEAL ----------
  var revealElements = document.querySelectorAll('[data-reveal]');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // Also reveal why-us cards
  document.querySelectorAll('.why-us__card').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ---------- CONTACT FORM ----------
  var contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = contactForm.querySelector('button[type="submit"]');
    var originalText = btn.innerHTML;

    btn.innerHTML = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Simulate form submission (replace with actual endpoint)
    setTimeout(function () {
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8l3 3 5-5"/></svg> Message Sent';
      btn.style.opacity = '1';
      btn.style.background = '#22C55E';

      setTimeout(function () {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 2500);
    }, 1200);
  });
})();
