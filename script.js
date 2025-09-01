/* Core interaction + i18n + theming */
document.addEventListener('DOMContentLoaded', () => {
  const qs = (sel, ctx=document) => ctx.querySelector(sel);
  const qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  const navToggle = qs('#navToggle');
  const navMenu = qs('#navMenu');
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('hidden');
  });

  // Back to top button
  const backBtn = qs('#backToTop');
  const toggleBackBtn = () => {
    if (window.scrollY > 480) {
      backBtn.classList.remove('hidden');
      backBtn.classList.add('show');
    } else {
      backBtn.classList.add('hidden');
      backBtn.classList.remove('show');
    }
  };
  backBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', toggleBackBtn, { passive: true });
  toggleBackBtn();

  // Year
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle
  const themeToggle = qs('#themeToggle');
  const root = document.documentElement;
  const applyTheme = (t) => {
    if (t === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme', t);
    themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
  };
  const userPref = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(userPref);
  themeToggle?.addEventListener('click', () => applyTheme(root.classList.contains('dark') ? 'light' : 'dark'));

  // Lazy load images (simple)
  const lazyImgs = qsa('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target; // Already has src; could swap data-src pattern if needed
          io.unobserve(img);
        }
      });
    }, { rootMargin: '150px' });
    lazyImgs.forEach(img => io.observe(img));
  }

  // i18n dictionaries (minimal: headings & CTAs)
  const dict = {
    en: {
      'experience': 'Experience',
      'projects': 'Featured Projects',
      'skills': 'Skills',
      'certifications': 'Certifications',
      'languages': 'Languages',
      'contact': 'Contact',
      'hero.role': 'Data Scientist & Econometrics-driven problem solver for markets and sustainability.',
      'hero.tagline': 'I build quantifiable, resilient data & ML systems: EVT pre-trade risk calibration, CO₂ emission forecasting, algorithmic trading, and applied econometrics.',
      'cta.download': 'Download CV',
      'cta.email': 'Email me',
      'cta.send': 'Send',
      'badge.role': 'Data Scientist',
      'skip.to.content': 'Skip to content'
    },
    fr: {
      'experience': 'Expérience',
      'projects': 'Projets phares',
      'skills': 'Compétences',
      'certifications': 'Certifications',
      'languages': 'Langues',
      'contact': 'Contact',
      'hero.role': 'Data Scientist & résolveur de problèmes économétriques pour marchés et durabilité.',
      'hero.tagline': 'Je conçois des systèmes data & ML robustes : calibration risque pré-trade EVT, prévision émissions CO₂, trading algorithmique, économétrie appliquée.',
      'cta.download': 'Télécharger CV',
      'cta.email': 'M’écrire',
      'cta.send': 'Envoyer',
      'badge.role': 'Data Scientist',
      'skip.to.content': 'Aller au contenu'
    }
  };

  const langToggle = qs('#langToggle');
  const applyLang = (lang) => {
    const entries = qsa('[data-i18n]');
    entries.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[lang][key]) el.textContent = dict[lang][key];
    });
    localStorage.setItem('lang', lang);
    langToggle.textContent = lang === 'en' ? 'FR' : 'EN';
    document.documentElement.lang = lang;
  };
  const browserLang = (navigator.language || 'en').slice(0,2).toLowerCase();
  const initialLang = localStorage.getItem('lang') || (browserLang === 'fr' ? 'fr' : 'en');
  applyLang(initialLang);
  langToggle?.addEventListener('click', () => applyLang(document.documentElement.lang === 'en' ? 'fr' : 'en'));

  // Smooth scroll for nav links
  qsa('a.nav-link').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href')||'';
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = qs(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!navMenu.classList.contains('hidden')) { // mobile
          navMenu.classList.add('hidden');
          navToggle.setAttribute('aria-expanded','false');
        }
      }
    });
  });

  // Contact form progressive enhancement
  const contactForm = qs('#contactForm');
  const formStatus = qs('#formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      if (!contactForm.action.includes('formspree')) return; // user to replace id
      e.preventDefault();
      formStatus.textContent = 'Sending…';
      try {
        const fd = new FormData(contactForm);
        const res = await fetch(contactForm.action, { method:'POST', body: fd, headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          formStatus.textContent = document.documentElement.lang === 'fr' ? 'Message envoyé.' : 'Message sent.';
          contactForm.reset();
        } else throw new Error('Network');
      } catch(err) {
        formStatus.textContent = document.documentElement.lang === 'fr' ? 'Erreur – réessayez.' : 'Error – retry.';
      }
    });
  }

  // Service worker registration (PWA basic)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(()=>{});
  }
});
