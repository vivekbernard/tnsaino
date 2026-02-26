/* ============================================================
   TNSAINO — Revamped Website Scripts
   Smooth interactions, scroll reveals, mobile menu
   ============================================================ */

(function () {
  'use strict';

  /* ─── Dynamic Year ─── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── Navigation Scroll State ─── */
  const nav = document.querySelector('.nav');

  function refreshNavStyle() {
    if (!nav) return;
    if (window.scrollY > 32) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', refreshNavStyle, { passive: true });
  refreshNavStyle();

  /* ─── Active Link Tracking ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ─── Mobile Menu Toggle ─── */
  const toggle = document.querySelector('.nav-toggle');
  const linksList = document.querySelector('.nav-links');

  if (toggle && linksList) {
    toggle.addEventListener('click', function () {
      const isOpen = linksList.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    linksList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        linksList.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on resize past breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        linksList.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }, { passive: true });
  }

  /* ─── Scroll-Triggered Reveal ─── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px'
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
