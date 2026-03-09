/**
 * Portfolio runtime (static, no build)
 * - Loads profile/certification JSON
 * - Normalizes project schema to avoid empty-project regressions
 * - Renders EN/FR UI copy
 */

const I18N = {
  en: {
    sectionExperience: 'Experience',
    sectionProjects: 'Featured Projects',
    sectionSkills: 'Technical Skills',
    sectionCerts: 'Licenses & Certifications',
    sectionContact: 'Let\'s Connect',
    sectionImpact: 'Selected Impact',
    sectionBuilding: "What I'm Building Now",
    heroCv: 'Download CV',
    heroContact: 'Contact Me',
    heroHeadline: 'EQD Trading Analyst, Data Scientist, and AI Systems Builder',
    heroSubline: 'I design data products and decision systems for trading operations, quantitative finance, and applied AI.',
    heroIntro:
      'EQD Trading Analyst and Data Scientist with experience in quantitative finance, analytics products, and AI systems design. I build production-oriented workflows for trading operations, risk visibility, and decision support.',
    projectSearch: 'Search projects...',
    projectFilterAll: 'All',
    projectViewDetails: 'View Details',
    projectProblem: 'Problem',
    projectApproach: 'Approach',
    projectImpact: 'Impact',
    projectStack: 'Stack',
    projectsEmptyTitle: 'No projects found',
    projectsEmptyBody: 'Try adjusting your filters or search query.',
    projectsNote:
      'Some projects were delivered in regulated or internal environments, so selected case studies are presented in anonymized form with emphasis on system design, controls, and measurable business value.',
    verifyCredential: 'Verify credential',
    impactRoleTitle: 'Current Role',
    impactRoleBody: 'EQD Trading Analyst - Societe Generale ATS',
    impactPrevTitle: 'Previous Experience',
    impactPrevBody: 'Data science internships in finance and sustainability',
    impactFounderTitle: 'Founder',
    impactFounderBody: 'SkyFarms',
    impactDomainTitle: 'Core Domains',
    impactDomainBody: 'Quant Finance, AI Systems, Data Engineering',
    buildingOne: 'Production-control workflows for index rebalancing',
    buildingTwo: 'AI investment decision systems',
    buildingThree: 'Startup experimentation in agritech and automation',
    modalCode: 'View Code',
  },
  fr: {
    sectionExperience: 'Experience',
    sectionProjects: 'Projets phares',
    sectionSkills: 'Competences techniques',
    sectionCerts: 'Certifications',
    sectionContact: 'Contact',
    sectionImpact: 'Impact selectionne',
    sectionBuilding: 'Ce que je construis actuellement',
    heroCv: 'Telecharger CV',
    heroContact: 'Me contacter',
    heroHeadline: 'Analyste Trading EQD, Data Scientist et builder de systemes IA',
    heroSubline: "Je conÃƒÆ’Ã‚Â§ois des produits data et des systemes d'aide a la decision pour les operations de trading, la finance quantitative et l'IA appliquee.",
    heroIntro:
      "Analyste Trading EQD et Data Scientist avec une experience en finance quantitative, produits analytiques et conception de systemes IA. Je construis des workflows orientes production pour les operations de trading, la visibilite risque et l'aide a la decision.",
    projectSearch: 'Rechercher des projets...',
    projectFilterAll: 'Tous',
    projectViewDetails: 'Voir les details',
    projectProblem: 'Probleme',
    projectApproach: 'Approche',
    projectImpact: 'Impact',
    projectStack: 'Stack',
    projectsEmptyTitle: 'Aucun projet trouve',
    projectsEmptyBody: 'Ajustez les filtres ou la recherche.',
    projectsNote:
      "Certains projets ont ete realises dans des environnements internes ou reglementes ; les etudes de cas sont presentees de maniere anonymisee, en mettant l'accent sur l'architecture systeme, les controles et la valeur metier mesurable.",
    verifyCredential: 'Verifier le certificat',
    impactRoleTitle: 'Role actuel',
    impactRoleBody: 'Analyste Trading EQD - Societe Generale ATS',
    impactPrevTitle: 'Experience precedente',
    impactPrevBody: 'Stages data science en finance et durabilite',
    impactFounderTitle: 'Fondateur',
    impactFounderBody: 'SkyFarms',
    impactDomainTitle: 'Domaines cles',
    impactDomainBody: 'Finance quantitative, systemes IA, data engineering',
    buildingOne: "Workflows de controle de production pour les rebalancements d'indices",
    buildingTwo: "Systemes IA d'aide a la decision d'investissement",
    buildingThree: 'Experimentations startup en agritech et automatisation',
    modalCode: 'Voir le code',
  },
};

const SECTIONS = [
  { id: 'hero', title: 'Introduction', hint: 'Overview and positioning' },
  { id: 'impact', title: 'Impact', hint: 'Current positioning and domains' },
  { id: 'experience', title: 'Experience', hint: 'Career impact highlights' },
  { id: 'projects', title: 'Projects', hint: 'Search and filter case studies' },
  { id: 'building', title: 'Building', hint: 'Current initiatives' },
  { id: 'skills', title: 'Skills', hint: 'Technical capabilities' },
  { id: 'certifications', title: 'Credentials', hint: 'Verified certifications' },
  { id: 'contact', title: 'Contact', hint: 'Reach out directly' },
];

const state = {
  lang: 'en',
  profile: null,
  certifications: [],
  activeFilter: 'all',
  query: '',
  currentSectionIndex: 0,
  guidedMode: true,
  visited: new Set(['hero']),
};

function qs(id) {
  return document.getElementById(id);
}

function sanitize(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function loadJson(path, fallback) {
  try {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) return fallback;
    return await response.json();
  } catch {
    return fallback;
  }
}

function normalizeProfile(profile) {
  const source = profile || {};
  const projects = (source.projects || []).map((project, index) => {
    const name = project.name || project.title || `Project ${index + 1}`;
    const summary = project.summary || project.problem || '';
    const impact = Array.isArray(project.impact)
      ? project.impact
      : Array.isArray(project.metrics)
      ? project.metrics
      : project.impact
      ? [project.impact]
      : [];

    return {
      id: project.id || slugify(name),
      name,
      summary,
      problem: project.problem || summary,
      approach: project.approach || '',
      impact,
      tags: project.tags || [],
      stack: project.stack || [],
      links: project.links || {},
    };
  });

  return {
    ...source,
    projects,
  };
}

function getProjects() {
  return state.profile?.projects || [];
}

function applyI18n() {
  const t = I18N[state.lang];

  const mapping = [
    ['section.experience', t.sectionExperience],
    ['section.projects', t.sectionProjects],
    ['section.skills', t.sectionSkills],
    ['section.certifications', t.sectionCerts],
    ['section.contact', t.sectionContact],
    ['section.impact', t.sectionImpact],
    ['section.building', t.sectionBuilding],
    ['hero.cv', t.heroCv],
    ['hero.contact', t.heroContact],
    ['projects.note', t.projectsNote],
    ['projects.emptyTitle', t.projectsEmptyTitle],
    ['projects.emptyBody', t.projectsEmptyBody],
  ];

  mapping.forEach(([key, value]) => {
    document.querySelectorAll(`[data-i18n="${key}"]`).forEach((el) => {
      el.textContent = value;
    });
  });

  const projectSearch = qs('projectSearch');
  if (projectSearch) projectSearch.placeholder = t.projectSearch;

  const cmdSearch = qs('cmdProjectSearch');
  if (cmdSearch) cmdSearch.placeholder = t.projectSearch;

  const langBtn = qs('langToggle');
  if (langBtn) langBtn.textContent = state.lang.toUpperCase();
}

function renderHero() {
  const root = qs('hero-target');
  if (!root || !state.profile) return;

  const t = I18N[state.lang];
  const profile = state.profile;
  const hero = profile.hero || {};
  const name = sanitize((hero.headline || 'Hicham Alaoui').split('-')[0].trim() || 'Hicham Alaoui');
  const cv = sanitize(hero.cv_url || 'CV/CV_2025_DS_AI.pdf');

  const stats = (profile.metrics || []).slice(0, 3).map((metric) => {
    const value = Number(metric.value) || 0;
    const suffix = sanitize(metric.suffix || '');
    return `
      <div class="reveal-hidden rounded-xl border border-border/70 bg-surface/70 p-4 backdrop-blur-sm">
        <div class="text-3xl font-extrabold text-primary font-mono count-up" data-val="${value}" data-suffix="${suffix}">0${suffix}</div>
        <p class="mt-1 text-xs uppercase tracking-wider text-[var(--text-muted)]">${sanitize(metric.label)}</p>
      </div>
    `;
  }).join('');

  root.innerHTML = `
    <div class="order-2 lg:order-1 reveal-hidden space-y-6">
      <span class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
        <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        EQD + Data + AI
      </span>

      <h1 class="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">${sanitize(t.heroHeadline)}</h1>
      <p class="max-w-2xl text-xl leading-relaxed text-[var(--text-muted)]">${sanitize(t.heroSubline)}</p>
      <p class="max-w-3xl text-base leading-relaxed text-[var(--text-muted)]">${sanitize(t.heroIntro)}</p>

      <div class="flex flex-wrap gap-4">
        <a href="${cv}" target="_blank" class="btn px-7 py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg hover:bg-primary-hover transition-all" data-i18n="hero.cv">Download CV</a>
        <a href="#contact" class="btn px-7 py-3.5 rounded-xl border border-border bg-surface font-bold hover:border-primary transition-all" data-i18n="hero.contact">Contact Me</a>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">${stats}</div>
    </div>

    <div class="order-1 lg:order-2 reveal-hidden flex justify-center">
      <div class="relative h-72 w-72 rounded-[2rem] border border-border/70 bg-gradient-to-br from-surface to-bg p-2 shadow-2xl sm:h-80 sm:w-80 lg:h-96 lg:w-96">
        <img src="assets/images/profile/profile-gen.jpg" alt="${name}" class="h-full w-full rounded-[1.6rem] object-cover" onerror="this.src='assets/images/hero-bg.jpg'" />
        <div class="absolute -bottom-5 -right-5 rounded-xl border border-border bg-surface px-4 py-3 shadow-xl">
          <p class="text-xs uppercase tracking-wider text-[var(--text-muted)]">Focus</p>
          <p class="text-sm font-bold text-primary">Quant Risk + AI Systems</p>
        </div>
      </div>
    </div>
  `;
}

function renderImpact() {
  const root = qs('impact-target');
  if (!root) return;

  const t = I18N[state.lang];
  const items = [
    { title: t.impactRoleTitle, body: t.impactRoleBody },
    { title: t.impactPrevTitle, body: t.impactPrevBody },
    { title: t.impactFounderTitle, body: t.impactFounderBody },
    { title: t.impactDomainTitle, body: t.impactDomainBody },
  ];

  root.innerHTML = items.map((item, index) => `
    <article class="reveal-hidden rounded-xl border border-border bg-surface p-5 shadow-sm" style="transition-delay:${index * 70}ms">
      <p class="text-xs uppercase tracking-wider text-[var(--text-muted)]">${sanitize(item.title)}</p>
      <h3 class="mt-2 text-base font-bold leading-snug">${sanitize(item.body)}</h3>
    </article>
  `).join('');
}

function renderExperience() {
  const root = qs('experience-target');
  if (!root || !state.profile) return;

  const items = state.profile.experience || [];
  root.innerHTML = items.map((item, index) => `
    <article class="relative pl-8 md:pl-12 pb-10 reveal-hidden" style="transition-delay:${index * 80}ms">
      <span class="absolute left-[-6px] top-6 h-3.5 w-3.5 rounded-full border-4 border-bg bg-primary shadow-[0_0_0_6px_rgba(var(--primary-rgb),0.15)]"></span>
      <div class="rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-lg hover:border-primary/40 transition-colors">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-xl md:text-2xl font-bold">${sanitize(item.role)}</h3>
            <p class="text-[var(--text-muted)] font-medium">${sanitize(item.company)}</p>
          </div>
          <span class="rounded-full border border-border px-3 py-1 text-xs font-mono text-[var(--text-muted)]">${sanitize(item.dates)}</span>
        </div>
        <ul class="mt-5 space-y-3 text-[var(--text-muted)]">
          ${(item.bullets || []).map((bullet) => `
            <li class="flex items-start gap-3">
              <span class="mt-1 h-2 w-2 rounded-full bg-primary"></span>
              <span>${sanitize(bullet)}</span>
            </li>`).join('')}
        </ul>
        <div class="mt-5 flex flex-wrap gap-2">
          ${(item.stack || []).map((tool) => `<span class="rounded-md border border-border px-2.5 py-1 text-xs text-[var(--text-muted)]">${sanitize(tool)}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');
}

function renderFilters() {
  const root = qs('projectFilters');
  if (!root) return;

  const t = I18N[state.lang];
  const tags = new Set();
  getProjects().forEach((project) => (project.tags || []).forEach((tag) => tags.add(tag)));
  const all = ['all', ...Array.from(tags).sort((a, b) => a.localeCompare(b))];

  root.innerHTML = all.map((tag) => {
    const active = state.activeFilter === tag ? 'active' : '';
    const label = tag === 'all' ? t.projectFilterAll : sanitize(tag);
    return `<button class="filter-chip ${active} px-4 py-1.5 rounded-full border border-border bg-surface text-sm font-medium" data-filter="${sanitize(tag)}">${label}</button>`;
  }).join('');
}

function getFilteredProjects() {
  const query = state.query.trim().toLowerCase();
  return getProjects().filter((project) => {
    const inFilter = state.activeFilter === 'all' || (project.tags || []).includes(state.activeFilter);
    const blob = `${project.name || ''} ${project.summary || ''} ${project.problem || ''} ${project.approach || ''} ${(project.tags || []).join(' ')} ${(project.impact || []).join(' ')} ${(project.stack || []).join(' ')}`.toLowerCase();
    const inSearch = !query || blob.includes(query);
    return inFilter && inSearch;
  });
}

function renderProjects() {
  const root = qs('projects-target');
  const empty = qs('projectsEmpty');
  if (!root || !empty) return;

  const t = I18N[state.lang];
  const projects = getFilteredProjects();

  if (!projects.length) {
    root.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  root.innerHTML = projects.map((project, index) => {
    const id = project.id || slugify(project.name || `project-${index}`);
    const badges = (project.impact || []).slice(0, 4);

    return `
      <article class="project-card group reveal-hidden flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl" style="transition-delay:${index * 60}ms">
        <div class="flex-1 p-6 md:p-7 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <span class="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">${sanitize(project.tags?.[0] || 'Project')}</span>
            <span class="text-xs text-[var(--text-muted)]">${sanitize(project.name)}</span>
          </div>

          <h3 class="text-xl font-bold group-hover:text-primary transition-colors">${sanitize(project.name)}</h3>

          <div class="space-y-3 text-sm text-[var(--text-muted)]">
            <p><strong class="text-[var(--text)]">${t.projectProblem}:</strong> ${sanitize(project.problem || project.summary || '')}</p>
            <p><strong class="text-[var(--text)]">${t.projectApproach}:</strong> ${sanitize(project.approach || '')}</p>
            <p><strong class="text-[var(--text)]">${t.projectImpact}:</strong> ${sanitize((project.impact || []).join(' | '))}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            ${(badges).map((badge) => `<span class="rounded-md border border-border px-2.5 py-1 text-xs text-[var(--text-muted)]">${sanitize(badge)}</span>`).join('')}
          </div>

          <div class="pt-1 flex flex-wrap gap-2">
            ${(project.stack || []).map((tool) => `<span class="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">${sanitize(tool)}</span>`).join('')}
          </div>
        </div>

        <button class="project-open-btn w-full border-t border-border bg-surface px-6 py-4 text-left text-sm font-bold hover:bg-primary hover:text-white transition-colors" data-project-id="${sanitize(id)}">${t.projectViewDetails}</button>
      </article>
    `;
  }).join('');

  root.querySelectorAll('.project-open-btn').forEach((button) => {
    button.addEventListener('click', () => openModal(button.getAttribute('data-project-id')));
  });
}

function renderBuildingNow() {
  const root = qs('building-target');
  if (!root) return;

  const t = I18N[state.lang];
  const items = [t.buildingOne, t.buildingTwo, t.buildingThree];

  root.innerHTML = items.map((item, index) => `
    <article class="reveal-hidden rounded-xl border border-border bg-surface p-6 shadow-sm" style="transition-delay:${index * 80}ms">
      <p class="text-sm uppercase tracking-wider text-[var(--text-muted)]">Now</p>
      <h3 class="mt-3 text-lg font-semibold leading-snug">${sanitize(item)}</h3>
    </article>
  `).join('');
}

function renderSkills() {
  const root = qs('skills-target');
  if (!root || !state.profile) return;

  const skills = state.profile.skills || {};
  const groups = Object.entries(skills);

  root.innerHTML = groups.map(([group, values], index) => `
    <article class="reveal-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm" style="transition-delay:${index * 70}ms">
      <h3 class="text-lg font-bold">${sanitize(group)}</h3>
      <div class="mt-4 flex flex-wrap gap-2">
        ${(values || []).map((value) => `<span class="rounded-md border border-border px-2.5 py-1 text-xs text-[var(--text-muted)]">${sanitize(value)}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderCertifications() {
  const root = qs('certs-target');
  if (!root) return;

  const t = I18N[state.lang];
  root.innerHTML = state.certifications.map((cert, index) => `
    <article class="reveal-hidden flex h-full flex-col rounded-xl border border-border bg-surface p-5 shadow-sm" style="transition-delay:${index * 60}ms">
      <div class="mb-4 flex items-start justify-between gap-3">
        <img src="${sanitize(cert.logo)}" alt="${sanitize(cert.issuer)}" class="h-10 w-10 object-contain" loading="lazy" />
        <span class="rounded bg-bg px-2 py-1 text-xs font-mono text-[var(--text-muted)]">${sanitize(cert.displayDate || cert.date || '')}</span>
      </div>
      <h3 class="text-base font-bold">${sanitize(cert.title)}</h3>
      <p class="mt-1 text-sm text-[var(--text-muted)]">${sanitize(cert.issuer)}</p>
      <a href="${sanitize(cert.verifyUrl)}" target="_blank" rel="noreferrer" class="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">${t.verifyCredential}</a>
    </article>
  `).join('');
}

function bindFilterAndSearch() {
  const filterRoot = qs('projectFilters');
  const search = qs('projectSearch');
  const cmdSearch = qs('cmdProjectSearch');

  if (filterRoot) {
    filterRoot.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.classList.contains('filter-chip')) return;
      state.activeFilter = target.dataset.filter || 'all';
      renderFilters();
      renderProjects();
      refreshRevealObserver();
    });
  }

  const onSearch = (value) => {
    state.query = value;
    if (search && search.value !== value) search.value = value;
    if (cmdSearch && cmdSearch.value !== value) cmdSearch.value = value;
    renderProjects();
    refreshRevealObserver();
  };

  if (search) search.addEventListener('input', (event) => onSearch(event.target.value || ''));
  if (cmdSearch) cmdSearch.addEventListener('input', (event) => onSearch(event.target.value || ''));
}

function openModal(projectId) {
  const modal = qs('projectModal');
  if (!modal) return;

  const project = getProjects().find((item) => (item.id || slugify(item.name)) === projectId);
  if (!project) return;

  const t = I18N[state.lang];
  qs('modalTitle').textContent = project.name || 'Project';
  qs('modalProblem').textContent = project.problem || project.summary || '';
  qs('modalApproach').textContent = project.approach || '';
  qs('modalResults').textContent = (project.impact || []).join(' | ');
  qs('modalTags').innerHTML = (project.tags || []).map((tag) => `<span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">${sanitize(tag)}</span>`).join('');
  qs('modalMetrics').innerHTML = (project.impact || []).map((metric) => `<li class="flex items-start gap-2 text-sm"><span class="mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span><span>${sanitize(metric)}</span></li>`).join('');

  const codeLink = qs('modalCodeLink');
  codeLink.textContent = t.modalCode;
  if (project.links?.code && project.links.code !== '#') {
    codeLink.href = project.links.code;
    codeLink.parentElement.classList.remove('hidden');
  } else {
    codeLink.parentElement.classList.add('hidden');
  }

  modal.showModal();
}

function bindModal() {
  const modal = qs('projectModal');
  const closeBtn = qs('closeModalBtn');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
}

function bindContactLinks() {
  const email = qs('contactEmail');
  const linkedin = qs('contactLinkedin');
  const profile = state.profile || {};
  const mail = profile.contact?.email || 'halaoui@insea.ac.ma';
  const linked = profile.contact?.linkedin || 'https://linkedin.com/in/hicham-alaoui-08ba35206';

  if (email) email.href = `mailto:${mail}`;
  if (linkedin) linkedin.href = linked;
}

function initTheme() {
  const html = document.documentElement;
  const stored = localStorage.getItem('theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  html.setAttribute('data-theme', stored || system);

  const toggle = qs('themeToggleFixed');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

function initScrollUX() {
  const progress = qs('scrollProgress');
  const backToTop = qs('backToTop');

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;

    if (progress) {
      progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
      progress.style.opacity = ratio < 0.02 ? '0' : '1';
    }

    if (backToTop) {
      if (window.scrollY > window.innerHeight * 0.25) {
        backToTop.classList.remove('translate-y-20', 'opacity-0');
      } else {
        backToTop.classList.add('translate-y-20', 'opacity-0');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

let revealObserver = null;

function animateCounter(el) {
  const end = Number(el.dataset.val || 0);
  const suffix = el.dataset.suffix || '';
  const duration = 1000;
  const start = performance.now();
  el.dataset.animated = 'true';

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = `${Math.round(end * eased)}${suffix}`;
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function refreshRevealObserver() {
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.replace('reveal-hidden', 'reveal-visible');
      const counter = entry.target.querySelector('.count-up');
      if (counter && !counter.dataset.animated) animateCounter(counter);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-hidden').forEach((el) => revealObserver.observe(el));
}

function initCommandBar() {
  const title = qs('cmdSectionTitle');
  const hint = qs('cmdBarHint');
  const current = qs('cmdProgressCurrent');
  const progress = qs('cmdProgressBar');
  const total = qs('cmdProgressTotal');
  const nextBtn = qs('cmdNextBtn');
  const backBtn = qs('cmdBackBtn');
  const guideBtn = qs('cmdGuideToggle');
  const search = qs('cmdProjectSearch');

  const setSection = (index) => {
    state.currentSectionIndex = index;
    const item = SECTIONS[index];

    if (title) title.textContent = item.title;
    if (current) current.textContent = String(index + 1);
    if (total) total.textContent = String(SECTIONS.length);
    if (progress) progress.style.width = `${((index + 1) / SECTIONS.length) * 100}%`;

    if (hint && search) {
      if (item.id === 'projects') {
        hint.classList.add('hidden');
        search.classList.remove('hidden');
      } else {
        search.classList.add('hidden');
        hint.classList.remove('hidden');
        hint.textContent = item.hint;
      }
    }

    if (backBtn) backBtn.disabled = index === 0;
    if (nextBtn) {
      const locked = state.guidedMode && !state.visited.has(item.id);
      nextBtn.disabled = index >= SECTIONS.length - 1 || locked;
    }
  };

  if (guideBtn) {
    guideBtn.addEventListener('click', () => {
      state.guidedMode = !state.guidedMode;
      guideBtn.classList.toggle('active', state.guidedMode);
      setSection(state.currentSectionIndex);
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      const next = Math.max(0, state.currentSectionIndex - 1);
      qs(SECTIONS[next].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (nextBtn.disabled) return;
      const next = Math.min(SECTIONS.length - 1, state.currentSectionIndex + 1);
      qs(SECTIONS[next].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = SECTIONS.findIndex((section) => section.id === entry.target.id);
      if (index !== -1) {
        state.visited.add(entry.target.id);
        setSection(index);
      }
    });
  }, { threshold: 0.45 });

  SECTIONS.forEach((section) => {
    const el = qs(section.id);
    if (el) observer.observe(el);
  });

  setSection(0);
}

function renderAll() {
  renderHero();
  renderImpact();
  renderExperience();
  renderFilters();
  renderProjects();
  renderBuildingNow();
  renderSkills();
  renderCertifications();
  applyI18n();
  refreshRevealObserver();
}

async function init() {
  initTheme();

  const [profile, certifications] = await Promise.all([
    loadJson('data/profile.json', {}),
    loadJson('data/certifications.json', []),
  ]);

  state.profile = normalizeProfile(profile);
  state.certifications = certifications;

  renderAll();
  bindFilterAndSearch();
  bindModal();
  bindContactLinks();
  initScrollUX();
  initCommandBar();

  const year = qs('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const langToggle = qs('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      state.lang = state.lang === 'en' ? 'fr' : 'en';
      renderAll();
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    });
  }
}

document.addEventListener('DOMContentLoaded', init);


