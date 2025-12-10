/* Core interaction + i18n + theming */
document.addEventListener('DOMContentLoaded', () => {
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

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
      'certifications': 'Education & Certifications',
      'languages': 'Languages',
      'contact': 'Contact',
      'see.all': 'See all',
      'hero.role': 'EQD Trading Analyst & Data Scientist',
      'hero.tagline': 'Building pre-trade controls, EVT-based dynamic limits, and ML analytics for equity markets.',
      'cta.download': 'Download CV',
      'cta.email': 'Email me',
      'cta.send': 'Send',
      'badge.role': 'EQD Trading Analyst · Data Scientist',
      'skip.to.content': 'Skip to content'
    },
    fr: {
      'experience': 'Expérience',
      'projects': 'Projets phares',
      'skills': 'Compétences',
      'certifications': 'Éducation & certifications',
      'languages': 'Langues',
      'contact': 'Contact',
      'see.all': 'Voir tout',
      'hero.role': 'Analyste EQD Trading & Data Scientist',
      'hero.tagline': 'Conçoit des contrôles pré-trade, des limites dynamiques basées sur l’EVT et des analyses ML pour les marchés actions.',
      'cta.download': 'Télécharger le CV',
      'cta.email': 'M’écrire',
      'cta.send': 'Envoyer',
      'badge.role': 'Analyste EQD Trading · Data Scientist',
      'skip.to.content': 'Aller au contenu'
    }
  };

  // Extended i18n keys (education & form labels)
  Object.assign(dict.en, {
    'education': 'Education',
    'label.name': 'Name',
    'label.email': 'Email',
    'label.message': 'Message',
    'label.direct': 'Direct:'
  });

  Object.assign(dict.fr, {
    'education': 'Éducation',
    'label.name': 'Nom',
    'label.email': 'Email',
    'label.message': 'Message',
    'label.direct': 'Direct :'
  });

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
  const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  const initialLang = localStorage.getItem('lang') || (browserLang === 'fr' ? 'fr' : 'en');
  applyLang(initialLang);
  langToggle?.addEventListener('click', () => applyLang(document.documentElement.lang === 'en' ? 'fr' : 'en'));

  // Smooth scroll for nav links
  qsa('a.nav-link').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = qs(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!navMenu.classList.contains('hidden')) { // mobile
          navMenu.classList.add('hidden');
          navToggle.setAttribute('aria-expanded', 'false');
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
        const res = await fetch(contactForm.action, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          formStatus.textContent = document.documentElement.lang === 'fr' ? 'Message envoyé.' : 'Message sent.';
          contactForm.reset();
        } else throw new Error('Network');
      } catch (err) {
        formStatus.textContent = document.documentElement.lang === 'fr' ? 'Erreur – réessayez.' : 'Error – retry.';
      }
    });
  }

  // Service worker registration (PWA basic)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => { });
  }

  // Dynamic data hydration from profile.json
  fetch('./data/profile.json')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(data => {
      // (Hero KPI row now static—metrics hydration removed)
      // Experience timeline
      const expList = qs('#experienceList');
      if (expList && Array.isArray(data.experience)) {
        expList.innerHTML = data.experience.map(item => `
          <li class="timeline-card">
            <div class="timeline-point" aria-hidden="true"></div>
            <div class="timeline-content">
              <header class="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 class="card-title">${item.company}</h3>
                <span class="date-chip">${item.dates}</span>
              </header>
              <p class="role">${item.role}</p>
              <ul class="card-list">${(item.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
              <div class="stack-row">${(item.stack || []).map(s => `<span>${s}</span>`).join('')}</div>
            </div>
          </li>`).join('');
      }
      // Projects with filters & modal
      const projGrid = qs('#projectsGrid');
      const filterBar = qs('#projectFilters');
      if (projGrid && Array.isArray(data.projects)) {
        const allTags = Array.from(new Set(data.projects.flatMap(p => p.tags || [])));
        if (filterBar) {
          filterBar.innerHTML = ['All', ...allTags].map(t => `<button class="filter-chip" data-tag="${t}" aria-pressed="${t === 'All'}">${t}</button>`).join('');
        }
        const renderProjects = (tag = 'All') => {
          projGrid.innerHTML = data.projects.filter(p => tag === 'All' || (p.tags || []).includes(tag)).map(p => `
          <article class="project-card" data-project="${p.name}">
            <header>
              <h3 class="project-title">${p.name}</h3>
              <div class="metric-badges">${(p.impact || []).map(im => `<span class=\"metric\">${im}</span>`).join('')}${(p.tags || []).slice(0, 2).map(t => `<span class=\"metric\">${t}</span>`).join('')}</div>
            </header>
            <p class="project-problem"><strong>${document.documentElement.lang === 'fr' ? 'Résumé' : 'Summary'}:</strong> ${p.summary || ''}</p>
            <div class="project-links">${p.links?.code ? `<a href="${p.links.code}" class="text-primary hover:underline" aria-label="View code ${p.name}">Code</a>` : ''}${p.links?.case ? `<a href="${p.links.case}" class="text-primary hover:underline" aria-label="Read case study ${p.name}">Case</a>` : ''}</div>
          </article>`).join('');
        };
        renderProjects();
        filterBar?.addEventListener('click', e => {
          const btn = e.target.closest('button.filter-chip');
          if (!btn) return;
          qsa('button.filter-chip', filterBar).forEach(b => b.setAttribute('aria-pressed', 'false'));
          btn.setAttribute('aria-pressed', 'true');
          renderProjects(btn.dataset.tag);
        });
        // Modal logic
        const modal = qs('#projectModal');
        const modalClose = qs('#modalClose');
        const modalTitle = qs('#modalTitle');
        const modalSummary = qs('#modalSummary');
        const modalBody = qs('#modalBody');
        const modalLinks = qs('#modalLinks');
        const modalSpark = qs('#modalSpark');
        let lastFocus = null;
        const openModal = (projName) => {
          const proj = data.projects.find(p => p.name === projName);
          if (!proj) return;
          lastFocus = document.activeElement;
          modalTitle.textContent = proj.name;
          modalSummary.textContent = proj.summary || '';
          modalBody.innerHTML = `<p><strong>Tags:</strong> ${(proj.tags || []).join(', ')}</p>`;
          modalLinks.innerHTML = '';
          if (proj.links?.code) modalLinks.innerHTML += `<a class="text-primary underline" href="${proj.links.code}" target="_blank" rel="noopener">Code ↗</a>`;
          if (proj.links?.case) modalLinks.innerHTML += `<a class="text-primary underline" href="${proj.links.case}" target="_blank" rel="noopener">Case Study ↗</a>`;
          modal.classList.add('active');
          modal.classList.remove('hidden');
          modal.setAttribute('aria-hidden', 'false');
          modalClose.focus();
          drawSpark(modalSpark, generateSparkData());
          trapFocus(modal);
        };
        const closeModal = () => {
          modal.classList.remove('active');
          modal.setAttribute('aria-hidden', 'true');
          setTimeout(() => modal.classList.add('hidden'), 250);
          if (lastFocus) lastFocus.focus();
          releaseFocus();
        };
        projGrid.addEventListener('click', e => {
          const card = e.target.closest('.project-card');
          if (card) openModal(card.getAttribute('data-project'));
        });
        modalClose?.addEventListener('click', closeModal);
        modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
      }
      // Skills
      const skillsContainer = qs('#skillsContainer');
      if (skillsContainer && data.skills && typeof data.skills === 'object') {
        const entries = Object.entries(data.skills);
        const collapsed = entries.slice(0, 3);
        const hidden = entries.slice(3);
        skillsContainer.innerHTML = collapsed.map(([group, list]) => `
          <div class="skill-block" data-reveal><h3>${group}</h3><div class="chip-row">${(list || []).map(s => `<span class=\"chip\">${s}</span>`).join('')}</div></div>`).join('') + (hidden.length ? `<div id="skillsDrawer" class="skills-drawer hidden">${hidden.map(([group, list]) => `<div class=\"skill-block\"><h3>${group}</h3><div class=\"chip-row\">${list.map(s => `<span class=\"chip\">${s}</span>`).join('')}</div></div>`).join('')}</div><button id="skillsToggle" class="btn-secondary mt-4" data-i18n="see.all">See all</button>` : '');
      }
      // Education
      const eduList = qs('#eduList');
      if (eduList && Array.isArray(data.education)) {
        eduList.innerHTML = data.education.map(ed => `<li class="cert-item"><span class="cert-title">${ed.institution}</span><span class="cert-org">${ed.program} · ${ed.years}</span></li>`).join('');
      }
      // Languages
      const langList = qs('#languagesList');
      if (langList && Array.isArray(data.languages)) {
        langList.innerHTML = data.languages.map(l => `<li class="chip">${l}</li>`).join('');
      }

      // initCounters removed (replaced by KPI animation)
      // After profile load, load certifications list
      hydrateCertifications();
    })
    .catch(() => { });

  // Count-up metrics
  function initCounters() {
    const counters = qsa('.metric-counter');
    if (!counters.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target; io.unobserve(el);
          const target = +el.getAttribute('data-target'); const suffix = el.getAttribute('data-suffix') || '';
          const startTs = performance.now(); const dur = 1100;
          const start = 0;
          const step = (ts) => { const p = Math.min(1, (ts - startTs) / dur); const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p; const val = Math.round(start + (target - start) * eased); el.firstChild.textContent = val + suffix + ' '; if (p < 1) requestAnimationFrame(step); };
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => io.observe(c));
  }

  // Intersection reveal
  const revealEls = qsa('[data-reveal]');
  if (revealEls.length) {
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      revealEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; });
      const rIO = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { animateReveal(e.target); rIO.unobserve(e.target); } });
      }, { threshold: 0.15 });
      revealEls.forEach(el => rIO.observe(el));
    }
  }
  function animateReveal(el) {
    el.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, easing: 'cubic-bezier(.4,.7,.1,1)', fill: 'forwards' });
  }

  // Magnetic buttons
  const magneticBtns = qsa('.magnetic');
  magneticBtns.forEach(btn => {
    const strength = 18;
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect(); const x = e.clientX - r.left - r.width / 2; const y = e.clientY - r.top - r.height / 2; btn.style.transform = `translate(${x / strength}px,${y / strength}px)`;
    });
    btn.addEventListener('pointerleave', () => btn.style.transform = 'translate(0,0)');
  });

  // Parallax hero (only if a .parallax-bg exists)
  const parallax = qs('.parallax-bg');
  if (parallax) {
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY * 0.25; parallax.style.transform = `translateY(${y}px)`;
      }, { passive: true });
    }
  }

  // Skills drawer toggle (after i18n application potential)
  document.addEventListener('click', e => {
    const t = e.target;
    if (t && t.id === 'skillsToggle') {
      const drawer = qs('#skillsDrawer');
      if (drawer) { const hidden = drawer.classList.toggle('hidden'); t.textContent = hidden ? (document.documentElement.lang === 'fr' ? 'Voir tout' : 'See all') : (document.documentElement.lang === 'fr' ? 'Réduire' : 'Collapse'); }
    }
  });

  // Sparkline helper functions
  function generateSparkData(n = 40) { return Array.from({ length: n }, (_, i) => ({ x: i, y: Math.random() })); }
  function drawSpark(canvas, data) {
    if (!canvas) return; const dpr = window.devicePixelRatio || 1; const width = canvas.clientWidth; const height = canvas.height; canvas.width = width * dpr; canvas.height = height * dpr; const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, width, height); ctx.lineWidth = 1.5; ctx.strokeStyle = '#0e6e55'; ctx.beginPath(); data.forEach((p, i) => { const x = (i / (data.length - 1)) * (width - 4) + 2; const y = (1 - p.y) * (height - 4) + 2; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
  }
  // Focus trap
  let focusTrapHandler = null; let focusablesCached = [];
  function trapFocus(root) {
    focusablesCached = qsa('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])', root).filter(el => !el.hasAttribute('disabled'));
    focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return; const first = focusablesCached[0]; const last = focusablesCached[focusablesCached.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', focusTrapHandler);
  }
  function releaseFocus() { if (focusTrapHandler) { document.removeEventListener('keydown', focusTrapHandler); focusTrapHandler = null; } }
});

// Load & render certifications grid + JSON-LD
function hydrateCertifications() {
  fetch('./data/certifications.json')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(list => {
      const grid = document.getElementById('certGrid');
      if (!grid) return;
      grid.innerHTML = list.map(cert => certCardHTML(cert)).join('');
      injectCredJsonLD(list);
      window.mergeLinkedInCerts = (extra) => mergeLinkedInCerts(extra, list);
    }).catch(() => { });
}

function certCardHTML(c) {
  const safeTitle = escapeHTML(c.title); const safeIssuer = escapeHTML(c.issuer);
  const date = c.displayDate || (c.date ? new Date(c.date).toLocaleDateString(document.documentElement.lang || 'en', { year: 'numeric', month: 'short' }) : '');
  return `<li class="cert-card" tabindex="-1">
    <div class="cert-top">
      <img loading="lazy" src="${c.logo}" alt="${safeIssuer} logo" class="cert-logo" width="40" height="40" />
      <div class="flex flex-col">
        <span class="cert-title">${safeTitle}</span>
        <span class="cert-issuer">${safeIssuer}</span>
      </div>
    </div>
    <span class="cert-date">${date}</span>
    <a href="${c.verifyUrl}" class="btn-verify" target="_blank" rel="noopener noreferrer" aria-label="Verify ${safeTitle} credential">Verify</a>
  </li>`;
}

function injectCredJsonLD(list) {
  if (!Array.isArray(list)) return; const payload = list.map(c => ({
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    'name': c.title,
    'recognizedBy': { '@type': 'Organization', 'name': c.issuer },
    'url': c.verifyUrl
  }));
  const existing = document.getElementById('cred-jsonld'); if (existing) existing.remove();
  const script = document.createElement('script'); script.type = 'application/ld+json'; script.id = 'cred-jsonld'; script.textContent = JSON.stringify(payload); document.head.appendChild(script);
}

function mergeLinkedInCerts(extra, current) {
  if (!Array.isArray(extra)) return; const grid = document.getElementById('certGrid'); if (!grid) return;
  const map = new Map(current.map(c => [c.title + '|' + c.issuer, c]));
  extra.forEach(c => { const key = c.title + '|' + c.issuer; if (!map.has(key)) map.set(key, c); });
  const merged = Array.from(map.values()).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  grid.innerHTML = merged.map(certCardHTML).join('');
  injectCredJsonLD(merged);
}

function escapeHTML(str) { return String(str).replace(/[&<>'"]/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" }[s])); }

/* ================= Hero Background (Option A: Particle Field) ================= */
// Toggle to true later if implementing Option B (low-poly WebGL) initLowPoly()
const enableThreeHero = false;
document.addEventListener('DOMContentLoaded', initHeroBackground);
function initHeroBackground() {
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (enableThreeHero) { /* initLowPoly(); */ return; }
  initParticles({ staticOnly: prefersReduced });
  initRoleRotator(prefersReduced);
  initSpotlightCards();
  initStaggeredScroll(prefersReduced);
}

// ================= Creative: Spotlight Effect on Cards =================
function initSpotlightCards() {
  const cards = document.querySelectorAll('.project-card, .timeline-content, .cert-card, .skill-block');
  if (!cards.length) return;

  document.addEventListener('mousemove', e => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // If mouse is near/inside card, show spotlight
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ================= Creative: Staggered Scroll Reveal =================
function initStaggeredScroll(prefersReduced) {
  if (prefersReduced) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const staggerGroups = [
    document.querySelectorAll('.timeline-card'),
    document.querySelectorAll('.project-card'),
    document.querySelectorAll('.cert-card'),
    document.querySelectorAll('.skill-block') // skill-block is usually in a grid
  ];

  staggerGroups.forEach(group => {
    group.forEach((el, index) => {
      el.classList.add('stagger-item');
      el.style.setProperty('--delay', `${index * 100}ms`);
      observer.observe(el);
    });
  });
}

function initParticles({ staticOnly = false } = {}) {
  const canvas = document.getElementById('hero-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const COLORS = ['#0e6e55', '#a16f0b', '#e2e8f0'];
  const COUNT = 80; // tune for perf
  const LINK_DIST = 120;
  const MAGNET_DIST = 140;
  const MAGNET_FORCE = 0.08;
  let w = 0, h = 0, particles = [], running = true;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (!particles.length) {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - .5) * 0.55,
        vy: (Math.random() - .5) * 0.55,
        r: 1.2 + Math.random() * 2.2,
        c: COLORS[(Math.random() * COLORS.length) | 0]
      }));
    }
    if (staticOnly) { drawFrame(); }
  }

  function update() {
    for (const p of particles) {
      // magnet effect
      const dx = p.x - mouse.x, dy = p.y - mouse.y; const d2 = dx * dx + dy * dy;
      if (d2 < MAGNET_DIST * MAGNET_DIST) {
        const d = Math.sqrt(d2) || 1; const f = (1 - d / MAGNET_DIST) * MAGNET_FORCE * 2; // Stronger magnet
        // Repel instead of attract for "interactive" feel
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * f;
        p.vy -= Math.sin(angle) * f;
      }
      // Add drift
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.96; p.vy *= 0.96; // Friction
      p.vx += (Math.random() - .5) * 0.01; p.vy += (Math.random() - .5) * 0.01;
      if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, w, h);
    // soft radial glow
    const grd = ctx.createRadialGradient(w * 0.5, h * 0.35, 20, w * 0.5, h * 0.35, Math.max(w, h) * 0.6);
    grd.addColorStop(0, 'rgba(14,110,85,0.10)');
    grd.addColorStop(1, 'rgba(11,15,20,0)');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);
    // links
    ctx.lineWidth = 1; ctx.globalAlpha = .55;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j]; const dx = a.x - b.x, dy = a.y - b.y; const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST) {
          const o = 1 - Math.sqrt(d2) / LINK_DIST;
          ctx.strokeStyle = `rgba(14,110,85,${o * 0.3})`; // Emerald links
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    for (const p of particles) {
      ctx.fillStyle = p.c;
      ctx.beginPath();
      // Pulse size
      const r = p.r + Math.sin(Date.now() * 0.005 + p.x) * 0.3;
      ctx.arc(p.x, p.y, Math.max(0, r), 0, 6.283);
      ctx.fill();
    }
  }

  function loop() { if (!running) return; update(); drawFrame(); requestAnimationFrame(loop); }

  // events
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  document.addEventListener('visibilitychange', () => { running = !staticOnly && document.visibilityState === 'visible'; if (running) requestAnimationFrame(loop); });

  resize();
  if (!staticOnly) { requestAnimationFrame(loop); }
}

// Placeholder for Option B
function initLowPoly() { /* future: lazy-load tiny WebGL/three implementation */ }

// ================= Hero Role Rotator =================
function initRoleRotator(prefersReduced) {
  const el = document.getElementById('roleRotator');
  if (!el) return;
  const roles = [
    { en: 'Data Scientist', fr: 'Data Scientist' },
    { en: 'Data Analyst', fr: 'Data Analyste' },
    { en: 'Econometrician', fr: 'Économètre' },
    { en: 'Trading Analyst', fr: 'Analyste Trading' }
  ];
  let idx = 0; let currentLang = document.documentElement.lang || 'en';
  const interval = prefersReduced ? null : setInterval(() => {
    currentLang = document.documentElement.lang || 'en';
    idx = (idx + 1) % roles.length;
    swapText(roles[idx][currentLang] || roles[idx].en);
  }, 2600);
  function swapText(txt) {
    if (prefersReduced) { el.textContent = txt; return; }
    const old = el;
    const fadeOut = old.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 260, easing: 'ease', fill: 'forwards' });
    fadeOut.onfinish = () => {
      old.textContent = txt;
      old.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 320, easing: 'cubic-bezier(.4,.7,.1,1)', fill: 'forwards' });
    };
  }
  // initial
  el.textContent = roles[0][currentLang] || roles[0].en;
}

// ================= KPI Count Up =================
(function animateKPIs() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const els = document.querySelectorAll('.kpi-value[data-target]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return; const el = e.target; io.unobserve(el);
      const raw = el.getAttribute('data-target') || el.textContent.trim();
      const plus = /\+$/.test(raw); const end = Number(raw.replace(/[^\d.]/g, '')) || 0;
      const dur = 800; const t0 = performance.now();
      (function tick(now) {
        const p = Math.min(1, (now - t0) / dur); el.textContent = Math.round(end * p) + (plus ? '+' : '');
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: .6 });
  els.forEach(el => io.observe(el));
})();
