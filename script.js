/**
 * Modern Portfolio - Logic
 * Fetches JSON, Renders UI, Handles Interactions
 */

// I18n Dictionary for UI Labels
const I18N = {
  en: {
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.certifications': 'Credentials',
    'nav.contact': 'Contact',
    'section.experience': 'Experience',
    'section.projects': 'Featured Projects',
    'section.skills': 'Technical Skills',
    'section.certifications': 'Licenses & Certifications',
    'section.contact': 'Get In Touch',
    'hero.cv': 'Download CV',
    'hero.contact': 'Email Me',
    'search.placeholder': 'Search projects (e.g. "trading", "quant")...'
  },
  fr: {
    'nav.experience': 'Expérience',
    'nav.projects': 'Projets',
    'nav.skills': 'Compétences',
    'nav.certifications': 'Certifications',
    'nav.contact': 'Contact',
    'section.experience': 'Expérience',
    'section.projects': 'Projets Phares',
    'section.skills': 'Compétences Techniques',
    'section.certifications': 'Certifications',
    'section.contact': 'Contactez-moi',
    'hero.cv': 'Télécharger CV',
    'hero.contact': 'M\'écrire',
    'search.placeholder': 'Rechercher (ex: "trading", "quant")...'
  }
};

let currentLang = 'en';
let portfolioData = null;
let activeProjects = [];

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initMobileMenu();
  await loadData();
  if (portfolioData) {
    renderAll();
    initAnimations();
    initScrollSpy();
    initSearchAndFilter();
    initModal();
  }
  document.getElementById('year').textContent = new Date().getFullYear();

  // Lang Toggle
  document.getElementById('langToggle').addEventListener('click', toggleLang);
});

/* ================= Data Loading ================= */
async function loadData() {
  try {
    const response = await fetch('./data/portfolio.json');
    if (!response.ok) throw new Error('Failed to load data');
    portfolioData = await response.json();
    activeProjects = portfolioData.projects; // Init with all
  } catch (err) {
    console.error(err);
    document.body.innerHTML = `<div class="p-10 text-center text-red-500">Error loading portfolio data. Please check console.</div>`;
  }
}

/* ================= Rendering ================= */
function renderAll() {
  renderHero();
  renderExperience();
  renderSkills();
  renderCerts();
  renderProjects(portfolioData.projects); // Initial render
  renderFilters();
  updateTextContent(); // Translate UI labels
}

function renderHero() {
  const t = document.getElementById('hero-target');
  const p = portfolioData.profile;

  // Stats HTML
  const statsHtml = p.stats.map((s, i) => `
        <div class="p-6 bg-surface/50 border border-border rounded-xl backdrop-blur-sm reveal-hidden" style="transition-delay: ${i * 100}ms">
            <div class="text-3xl font-bold font-mono text-primary count-up" data-val="${s.value}">${0}</div>
            <div class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mt-1">${s.label}</div>
            ${s.suffix ? `<div class="hidden">${s.suffix}</div>` : ''} <!-- Hidden suffix storage for js -->
        </div>
    `).join('');

  t.innerHTML = `
        <div class="order-2 lg:order-1 space-y-6 reveal-hidden">
            <div class="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-mono font-medium rounded-full mb-4">
                ${p.role}
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance leading-tight">
                ${p.headline}
            </h1>
            <p class="text-lg text-[var(--text-muted)] max-w-lg leading-relaxed">
                ${p.subline}
            </p>
            <div class="flex flex-wrap gap-4 pt-4">
                <a href="${p.cv}" download class="btn bg-primary text-white hover:bg-primary-hover px-6 py-3 rounded-lg font-medium shadow-md transition-transform hover:-translate-y-1" data-i18n="hero.cv">
                    Download CV
                </a>
                <a href="mailto:${p.email}" class="btn border border-border bg-surface text-[var(--text)] hover:bg-border px-6 py-3 rounded-lg font-medium transition-colors" data-i18n="hero.contact">
                    Email Me
                </a>
            </div>
            <div class="flex gap-6 pt-8 text-[var(--text-muted)]">
                <a href="${p.github}" target="_blank" class="hover:text-primary transition-colors" aria-label="GitHub">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.655-3.795-1.275-3.795-1.275-.54-1.38-1.335-1.755-1.335-1.755-1.095-.75.075-.735.075-.735 1.215.09 1.845 1.245 1.845 1.245 1.08 1.86 2.805 1.32 3.495 1.005.105-.78.42-1.32.765-1.62-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57C20.565 21.795 24 17.325 24 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href="${p.linkedin}" target="_blank" class="hover:text-primary transition-colors" aria-label="LinkedIn">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
            </div>
        </div>
        <div class="order-1 lg:order-2 grid grid-cols-2 gap-4">
            ${statsHtml}
        </div>
    `;

  initCountUp();
}

function renderExperience() {
  const t = document.getElementById('experience-target');
  t.innerHTML = portfolioData.experience.map(e => `
        <article class="relative pl-8 reveal-hidden">
            <div class="timeline-dot"></div>
            <div class="bg-surface p-6 rounded-xl border border-border card-hover shadow-sm">
                <div class="flex flex-col md:flex-row md:items-start justify-between mb-4">
                    <div>
                        <h3 class="text-xl font-bold text-[var(--text)]">${e.role}</h3>
                        <div class="text-primary font-medium">${e.company}</div>
                    </div>
                    <span class="text-xs font-mono font-bold text-[var(--text-muted)] bg-[var(--bg)] px-2 py-1 rounded mt-2 md:mt-0">${e.dates}</span>
                </div>
                <ul class="space-y-2 mb-4">
                    ${e.bullets.map(b => `<li class="text-[var(--text-muted)] text-sm leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-primary/50 before:rounded-full">${b}</li>`).join('')}
                </ul>
                ${e.tags ? `<div class="flex flex-wrap gap-2 pt-2">${e.tags.map(tag => `<span class="px-2 py-1 bg-[var(--bg)] text-[var(--text-muted)] text-xs rounded border border-border font-medium">${tag}</span>`).join('')}</div>` : ''}
            </div>
        </article>
    `).join('');
}

function renderProjects(projects) {
  const t = document.getElementById('projects-target');
  const empty = document.getElementById('projectsEmpty');

  if (projects.length === 0) {
    t.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  t.innerHTML = projects.map(p => `
        <article class="bg-surface rounded-xl border border-border overflow-hidden card-hover flex flex-col h-full reveal-hidden group cursor-pointer" onclick="openModal('${p.id}')">
            <div class="p-6 flex-grow">
                <div class="flex justify-between items-start mb-4">
                     <span class="text-xs font-bold font-mono uppercase text-primary bg-primary/10 px-2 py-1 rounded">${p.category}</span>
                     ${p.metrics[0] ? `<span class="text-xs font-bold text-[var(--text-muted)]">${p.metrics[0]}</span>` : ''}
                </div>
                <h3 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors">${p.title}</h3>
                <p class="text-[var(--text-muted)] text-sm line-clamp-3 mb-4">
                    ${p.summary}
                </p>
                <div class="flex flex-wrap gap-2 mt-auto">
                    ${p.tags.slice(0, 3).map(tag => `<span class="text-xs px-2 py-1 bg-[var(--bg)] rounded border border-border text-[var(--text-muted)]">${tag}</span>`).join('')}
                    ${p.tags.length > 3 ? `<span class="text-xs px-2 py-1 text-[var(--text-muted)]">+${p.tags.length - 3}</span>` : ''}
                </div>
            </div>
            <div class="bg-[var(--bg)] px-6 py-3 border-t border-border flex justify-between items-center text-xs font-medium text-[var(--text-muted)]">
                 <span>Read Case Study</span>
                 <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
        </article>
    `).join('');

  // Re-init animations for new elements
  const newEls = t.querySelectorAll('.reveal-hidden');
  observeElements(newEls);
}

function renderSkills() {
  const t = document.getElementById('skills-target');
  t.innerHTML = Object.entries(portfolioData.skills).map(([cat, list]) => `
        <div class="reveal-hidden">
            <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                <span class="w-1 h-5 bg-primary rounded-full"></span>
                ${cat}
            </h3>
            <div class="flex flex-wrap gap-2">
                ${list.map(s => `<span class="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm font-medium text-[var(--text-muted)] hover:border-primary hover:text-primary transition-colors cursor-default">${s}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderCerts() {
  const t = document.getElementById('certs-target');
  t.innerHTML = portfolioData.certifications.map(c => `
        <div class="bg-surface p-5 rounded-xl border border-border card-hover reveal-hidden">
            <div class="font-bold text-[var(--text)] mb-1">${c.name}</div>
            <div class="text-sm text-[var(--text-muted)] mb-2">${c.issuer}</div>
            <div class="flex justify-between items-center mt-4">
                <span class="text-xs font-mono text-[var(--text-muted)]">${c.date}</span>
                ${c.id ? `<span class="text-xs px-2 py-1 bg-[var(--bg)] rounded text-[var(--text-muted)] font-mono">ID: ${c.id.substring(0, 6)}...</span>` : ''}
            </div>
        </div>
    `).join('');
}

function renderFilters() {
  const t = document.getElementById('projectFilters');
  // collect unique cats
  const tags = new Set();
  portfolioData.projects.forEach(p => p.tags.forEach(tag => tags.add(tag)));

  const sortedTags = Array.from(tags).sort();

  t.innerHTML = `
        <button class="filter-chip active px-4 py-1.5 rounded-full border border-border bg-surface text-sm font-medium hover:border-primary transition-colors" data-filter="all">All</button>
        ${sortedTags.map(tag => `
            <button class="filter-chip px-4 py-1.5 rounded-full border border-border bg-surface text-sm font-medium hover:border-primary transition-colors" data-filter="${tag}">${tag}</button>
        `).join('')}
    `;
}

/* ================= Logic: Filters & Search ================= */
function initSearchAndFilter() {
  const searchInput = document.getElementById('projectSearch');
  const filterContainer = document.getElementById('projectFilters');
  let activeFilter = 'all';

  // Search
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filterProjects(query, activeFilter);
  });

  // Filter Chips
  filterContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-chip')) return;

    // UI
    filterContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');

    // Logic
    activeFilter = e.target.dataset.filter;
    filterProjects(searchInput.value.toLowerCase(), activeFilter);
  });
}

function filterProjects(search, filter) {
  const filtered = portfolioData.projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search) || p.summary.toLowerCase().includes(search) || p.tags.some(t => t.toLowerCase().includes(search));
    const matchFilter = filter === 'all' || p.tags.includes(filter);
    return matchSearch && matchFilter;
  });
  renderProjects(filtered);
}

/* ================= Logic: Modal ================= */
function initModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('closeModalBtn');

  closeBtn.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
}

// Global scope for onclick access in HTML
window.openModal = function (id) {
  const p = portfolioData.projects.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalProblem').textContent = p.problem || 'N/A';
  document.getElementById('modalApproach').textContent = p.approach || 'N/A';
  document.getElementById('modalResults').textContent = p.results || 'N/A';

  // Tags
  document.getElementById('modalTags').innerHTML = p.tags.map(t => `<span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">${t}</span>`).join('');

  // Metrics
  document.getElementById('modalMetrics').innerHTML = p.metrics.map(m => `
        <li class="flex items-center gap-3 text-sm text-[var(--text)]">
            <span class="w-1.5 h-1.5 bg-primary rounded-full"></span>
            ${m}
        </li>
    `).join('');

  // Link
  const linkEl = document.getElementById('modalCodeLink');
  if (p.links && p.links.code) {
    linkEl.href = p.links.code;
    linkEl.parentElement.classList.remove('hidden');
  } else {
    linkEl.parentElement.classList.add('hidden');
  }

  document.getElementById('projectModal').showModal();
}

/* ================= Logic: Theme & Mobile Menu ================= */
function initTheme() {
  const html = document.documentElement;
  const current = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  html.setAttribute('data-theme', current);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

function initMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('mobileMenuBtn');
  const close = document.getElementById('closeMenuBtn');

  const toggle = () => menu.classList.toggle('translate-x-full');
  btn.addEventListener('click', toggle);
  close.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach(l => l.addEventListener('click', toggle));
}

/* ================= Logic: ScrollSpy & animations ================= */
function initScrollSpy() {
  const sects = document.querySelectorAll('section[id]');
  const navs = document.querySelectorAll('.nav-link');
  const progress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    // Progress
    const limit = document.body.offsetHeight - window.innerHeight;
    const per = (window.scrollY / limit) * 100;
    progress.style.width = `${per}%`;

    // Active Spy
    let current = '';
    sects.forEach(s => {
      const top = s.offsetTop - 100;
      if (window.scrollY >= top) current = s.getAttribute('id');
    });

    navs.forEach(n => {
      n.classList.remove('active');
      if (n.getAttribute('href') === `#${current}`) n.classList.add('active');
    });
  });
}

// Re-usable observer
let observer;
function initAnimations() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.replace('reveal-hidden', 'reveal-visible');
        // Trigger count up if it's a stat
        if (e.target.querySelector('.count-up')) runCountUp(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  const els = document.querySelectorAll('.reveal-hidden');
  observeElements(els);
}

function observeElements(els) {
  els.forEach(el => observer.observe(el));
}

function initCountUp() {
  // Logic handled within intersection observer trigger
}

function runCountUp(container) {
  const el = container.querySelector('.count-up');
  if (!el) return;
  const end = parseInt(el.dataset.val);
  const suffix = container.querySelector('.hidden')?.textContent || ''; // get suffix

  let start = 0;
  const dur = 2000;
  const step = 60;
  const incr = end / (dur / step);

  const t = setInterval(() => {
    start += incr;
    if (start >= end) {
      el.textContent = end + suffix;
      clearInterval(t);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, step);
}

/* ================= Logic: I18n ================= */
function toggleLang() {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  document.getElementById('langToggle').textContent = currentLang.toUpperCase();
  updateTextContent();
}

function updateTextContent() {
  const els = document.querySelectorAll('[data-i18n]');
  els.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[currentLang][key]) {
      el.textContent = I18N[currentLang][key];
    } else {
      // fallback to inner text if missing
    }
  });
  // Placeholder update
  const search = document.getElementById('projectSearch');
  if (search) search.placeholder = I18N[currentLang]['search.placeholder'];
}
