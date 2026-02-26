const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinksWrap = document.querySelector('.nav-links');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = Array.from(document.querySelectorAll('[data-nav]'));
const revealNodes = Array.from(document.querySelectorAll('.reveal'));

function setScrolledState() {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 12);
}

function closeMobileMenu() {
  if (!navToggle || !navLinksWrap) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navLinksWrap.classList.remove('is-open');
}

if (navToggle && navLinksWrap) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navLinksWrap.classList.toggle('is-open', !isOpen);
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    const clickedInsideNav = target.closest('.nav');
    if (!clickedInsideNav) {
      closeMobileMenu();
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      const delay = node.getAttribute('data-delay');
      if (delay) {
        node.style.transitionDelay = `${Number(delay)}ms`;
      }
      node.classList.add('is-visible');
      observer.unobserve(node);
    });
  },
  {
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px'
  }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const sectionId = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('is-active', href === `#${sectionId}`);
      });
    });
  },
  {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  }
);

sections.forEach((section) => navObserver.observe(section));

window.addEventListener('scroll', setScrolledState, { passive: true });
setScrolledState();
