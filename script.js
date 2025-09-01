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

  // Dynamic data hydration from profile.json
  fetch('/data/profile.json')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(data => {
      // Hero metrics
      const metricsWrap = qs('#heroMetrics');
      if (metricsWrap && Array.isArray(data.metrics)) {
        metricsWrap.innerHTML = data.metrics.map(m => `<span class="badge" title="${m.desc||''}">${m.value}${m.suffix||''} ${m.label}</span>`).join('');
      }
      // About
      const aboutEl = qs('#aboutContent');
      if (aboutEl && data.about?.narrative) {
        aboutEl.innerHTML = `<p class="text-neutral-700 dark:text-neutral-300 leading-relaxed">${data.about.narrative}</p>`;
      }
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
              <ul class="card-list">${(item.bullets||[]).map(b=>`<li>${b}</li>`).join('')}</ul>
              <div class="stack-row">${(item.stack||[]).map(s=>`<span>${s}</span>`).join('')}</div>
            </div>
          </li>`).join('');
      }
      // Projects with filters & modal
      const projGrid = qs('#projectsGrid');
      const filterBar = qs('#projectFilters');
      if (projGrid && Array.isArray(data.projects)) {
        const allTags = Array.from(new Set(data.projects.flatMap(p=>p.tags||[])));
        if (filterBar) {
          filterBar.innerHTML = ['All', ...allTags].map(t=>`<button class="filter-chip" data-tag="${t}" aria-pressed="${t==='All'}">${t}</button>`).join('');
        }
        const renderProjects = (tag='All') => {
          projGrid.innerHTML = data.projects.filter(p => tag==='All' || (p.tags||[]).includes(tag)).map(p => `
          <article class="project-card" data-project="${p.name}">
            <header>
              <h3 class="project-title">${p.name}</h3>
              <div class="metric-badges">${(p.impact||[]).map(im=>`<span class=\"metric\">${im}</span>`).join('')}${(p.tags||[]).slice(0,2).map(t=>`<span class=\"metric\">${t}</span>`).join('')}</div>
            </header>
            <p class="project-problem"><strong>Summary:</strong> ${p.summary||''}</p>
            <div class="project-links">${p.links?.code?`<a href="${p.links.code}" class="text-primary hover:underline" aria-label="View code ${p.name}">Code</a>`:''}${p.links?.case?`<a href="${p.links.case}" class="text-primary hover:underline" aria-label="Read case study ${p.name}">Case</a>`:''}</div>
          </article>`).join('');
        };
        renderProjects();
        filterBar?.addEventListener('click', e => {
          const btn = e.target.closest('button.filter-chip');
          if (!btn) return;
          qsa('button.filter-chip', filterBar).forEach(b=>b.setAttribute('aria-pressed','false'));
          btn.setAttribute('aria-pressed','true');
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
          const proj = data.projects.find(p=>p.name===projName);
          if (!proj) return;
          lastFocus = document.activeElement;
          modalTitle.textContent = proj.name;
          modalSummary.textContent = proj.summary||'';
          modalBody.innerHTML = `<p><strong>Tags:</strong> ${(proj.tags||[]).join(', ')}</p>`;
          modalLinks.innerHTML = '';
          if (proj.links?.code) modalLinks.innerHTML += `<a class="text-primary underline" href="${proj.links.code}" target="_blank" rel="noopener">Code ↗</a>`;
          if (proj.links?.case) modalLinks.innerHTML += `<a class="text-primary underline" href="${proj.links.case}" target="_blank" rel="noopener">Case Study ↗</a>`;
          modal.classList.add('active');
          modal.classList.remove('hidden');
          modal.setAttribute('aria-hidden','false');
          modalClose.focus();
          drawSpark(modalSpark, generateSparkData());
          trapFocus(modal);
        };
        const closeModal = () => {
          modal.classList.remove('active');
          modal.setAttribute('aria-hidden','true');
          setTimeout(()=>modal.classList.add('hidden'),250);
          if (lastFocus) lastFocus.focus();
          releaseFocus();
        };
        projGrid.addEventListener('click', e => {
          const card = e.target.closest('.project-card');
          if (card) openModal(card.getAttribute('data-project'));
        });
        modalClose?.addEventListener('click', closeModal);
        modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key==='Escape' && modal.classList.contains('active')) closeModal(); });
      }
      // Skills
      const skillsContainer = qs('#skillsContainer');
      if (skillsContainer && data.skills && typeof data.skills === 'object') {
        skillsContainer.innerHTML = Object.entries(data.skills).map(([group, list]) => `
          <div class="skill-block"><h3>${group}</h3><div class="chip-row">${(list||[]).map(s=>`<span class=\"chip\">${s}</span>`).join('')}</div></div>`).join('');
      }
      // Certifications
      const certList = qs('#certList');
      if (certList && Array.isArray(data.certs)) {
        certList.innerHTML = data.certs.map(c => `<li class="cert-item"><span class="cert-title">${c}</span></li>`).join('');
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
    })
    .catch(()=>{});

  // Sparkline helper functions
  function generateSparkData(n=40){return Array.from({length:n},(_,i)=>({x:i,y:Math.random()}));}
  function drawSpark(canvas,data){
    if(!canvas) return; const dpr = window.devicePixelRatio||1; const width = canvas.clientWidth; const height = canvas.height; canvas.width = width*dpr; canvas.height = height*dpr; const ctx=canvas.getContext('2d'); ctx.scale(dpr,dpr); ctx.clearRect(0,0,width,height); ctx.lineWidth=1.5; ctx.strokeStyle='#0e6e55'; ctx.beginPath(); data.forEach((p,i)=>{const x = (i/(data.length-1))* (width-4) +2; const y = (1-p.y)*(height-4)+2; i?ctx.lineTo(x,y):ctx.moveTo(x,y);}); ctx.stroke(); }
  // Focus trap
  let focusTrapHandler=null; let focusablesCached=[];
  function trapFocus(root){
    focusablesCached = qsa('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])',root).filter(el=>!el.hasAttribute('disabled'));
    focusTrapHandler = (e)=>{
      if(e.key!=='Tab') return; const first=focusablesCached[0]; const last=focusablesCached[focusablesCached.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault(); last.focus();}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault(); first.focus();}
    };
    document.addEventListener('keydown', focusTrapHandler);
  }
  function releaseFocus(){ if(focusTrapHandler){document.removeEventListener('keydown',focusTrapHandler); focusTrapHandler=null;}}
});
