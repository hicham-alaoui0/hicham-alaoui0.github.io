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
    initInteractions(); // New Interactions
    initSearchAndFilter();
    initModal();
  }
  document.getElementById('year').textContent = new Date().getFullYear();

  // Lang Toggle
  document.getElementById('langToggle').addEventListener('click', toggleLang);
});

/* ================= Data Loading ================= */

// SW Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration);

        // Check for updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New content available; please refresh.');
                // Optional: show a toast to user to reload
              } else {
                console.log('Content is cached for offline use.');
              }
            }
          };
        };
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}

/* ================= Data Loading ================= */
async function loadData() {
  try {
    // Cache busting to ensure fresh data
    const response = await fetch(`./data/portfolio.json?t=${Date.now()}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    portfolioData = await response.json();

    if (!portfolioData || !portfolioData.projects) {
      throw new Error('Invalid data structure');
    }

    activeProjects = portfolioData.projects; // Init with all
  } catch (err) {
    console.error('Portfolio Load Error:', err);
    document.querySelector('main').innerHTML = `
        <div class="min-h-screen flex items-center justify-center p-6 text-center">
            <div class="max-w-md bg-red-50/10 border border-red-500/50 p-8 rounded-xl backdrop-blur-md">
                <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <h2 class="text-2xl font-bold mb-2">System Malfunction</h2>
                <p class="text-[var(--text-muted)] mb-6">Unable to load portfolio data. The system may be offline or the data feed is corrupted.</p>
                <button onclick="window.location.reload()" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">Retry Connection</button>
            </div>
        </div>
    `;
  }
}

/* ================= Rendering ================= */
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
  const p = portfolioData.profile || {};

  // Stats HTML - Floating Cards
  // We'll arrange them: one top-left of image, one bottom-right, one bottom-left or similar?
  // Let's make them a vertical stack on the far right, or a grid below text.
  // "Creative" Idea: Image is central/right. Stats act as orbiting satellites or a glass stack overlapping the image.

  // Let's try: Image on right. Stats are "floating cards" positioned absolute relative to image container.
  // Actually, absolute positioning is risky for responsiveness. 
  // Let's do: Left Column = Text + CTAs. Right Column = Image centered. 
  // Stats = A row of glass cards *below* the text on the left, or interacting with the image?
  // User wants "Creative".

  // Design Choice:
  // Left: Text -> CTAs -> Stats (Grid).
  // Right: Large Profile Image with abstract shapes/blob background.

  const statsHtml = (p.stats || []).map((s, i) => `
        <div class="p-4 bg-surface/50 border border-border/50 rounded-xl backdrop-blur-sm reveal-hidden hover:border-primary/50 transition-colors flex flex-col justify-center min-w-[120px]" style="transition-delay: ${700 + (i * 100)}ms">
            <div class="text-3xl font-extrabold font-mono text-primary count-up mb-1" data-val="${s.value}">${0}</div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] leading-tight">${s.label}</div>
            ${s.suffix ? `<div class="hidden">${s.suffix}</div>` : ''}
        </div>
    `).join('');

  t.innerHTML = `
        <div class="order-2 lg:order-1 flex flex-col justify-center space-y-8 reveal-hidden z-10">
            <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-mono font-bold uppercase tracking-wide rounded-full mb-4">
                    <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    ${p.role || 'Data Scientist'}
                </div>
                <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance leading-[1.1] mb-6">
                    ${p.name || 'Hicham Alaoui'}
                </h1>
                <p class="text-xl text-[var(--text-muted)] max-w-xl leading-relaxed">
                    ${p.subline || 'Building precision risk controls and machine learning solutions for equity markets.'}
                </p>
            </div>
            
            <div class="flex flex-wrap gap-4">
                <a href="${p.cv || '#'}" download class="btn bg-primary text-white hover:bg-primary-hover px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-primary/20 transition-all transform hover:-translate-y-1" data-i18n="hero.cv">
                    Download CV
                </a>
                <a href="#contact" class="btn border border-border bg-surface text-[var(--text)] hover:border-primary px-8 py-4 rounded-xl font-bold transition-all" data-i18n="hero.contact">
                    Contact Me
                </a>
            </div>

            <!-- Stats Row -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 w-fit">
                ${statsHtml}
            </div>

            <!-- Socials -->
             <div class="flex items-center gap-6 text-[var(--text-muted)] pt-2">
                ${p.github ? `<a href="${p.github}" target="_blank" class="hover:text-primary transition-colors hover:scale-110 transform duration-200"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.655-3.795-1.275-3.795-1.275-.54-1.38-1.335-1.755-1.335-1.755-1.095-.75.075-.735.075-.735 1.215.09 1.845 1.245 1.845 1.245 1.08 1.86 2.805 1.32 3.495 1.005.105-.78.42-1.32.765-1.62-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57C20.565 21.795 24 17.325 24 12c0-6.63-5.37-12-12-12z"/></svg></a>` : ''}
                ${p.linkedin ? `<a href="${p.linkedin}" target="_blank" class="hover:text-primary transition-colors hover:scale-110 transform duration-200"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>` : ''}
            </div>
        </div>
        
        <div class="order-1 lg:order-2 relative flex justify-center items-center">
             <!-- Background Blob -->
             <div class="absolute inset-0 bg-gradient-to-tr from-primary/30 to-blue-500/30 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
             
             <!-- Image Container -->
             <div class="relative w-72 h-72 md:w-96 md:h-96 rounded-full p-2 border border-white/20 bg-white/5 backdrop-blur-sm shadow-2xl reveal-hidden" style="transition-delay: 200ms">
                <img 
                    src="./assets/images/profile/profile-gen.jpg" 
                    alt="${p.name}" 
                    class="w-full h-full object-cover rounded-full shadow-inner"
                    loading="eager"
                    onerror="this.src='./assets/images/hero-bg.jpg'"
                >
                
                <!-- Floating Badge -->
                 <div class="absolute -bottom-6 -right-6 bg-surface border border-border p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style="animation-duration: 3s">
                    <div class="bg-primary/10 p-2 rounded-full text-primary">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div>
                        <div class="text-[10px] font-bold text-[var(--text-muted)] uppercase">Focus</div>
                        <div class="text-sm font-bold text-[var(--text)]">EQD & Data Science</div>
                    </div>
                 </div>
             </div>
        </div>
    `;

  initCountUp();
}

function renderExperience() {
  const t = document.getElementById('experience-target');
  t.innerHTML = portfolioData.experience.map((e, index) => `
        <article class="relative pl-8 md:pl-12 reveal-hidden pb-12 last:pb-0" style="transition-delay: ${index * 100}ms">
            <!-- Timeline Line/Dot handled by CSS on parent and pseudo-elements here -->
            <div class="absolute left-[-5px] md:left-[-6px] top-6 w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full border-4 border-bg z-10 shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.2)]"></div>
            
            <div class="group bg-surface p-6 md:p-8 rounded-2xl border border-border hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                    <div>
                        <h3 class="text-xl md:text-2xl font-bold text-[var(--text)] group-hover:text-primary transition-colors">${e.role}</h3>
                        <div class="text-lg font-medium text-[var(--text-muted)]">${e.company}</div>
                    </div>
                    <span class="inline-block px-3 py-1 bg-surface border border-border rounded-full text-xs font-mono font-bold text-[var(--text-muted)] whitespace-nowrap shadow-sm">${e.dates}</span>
                </div>
                
                <ul class="space-y-3 mb-6">
                    ${e.bullets.map(b => `
                        <li class="flex items-start gap-3 text-[var(--text-muted)] text-[15px] leading-relaxed">
                            <svg class="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>${b}</span>
                        </li>
                    `).join('')}
                </ul>
                
                ${e.tags ? `
                    <div class="flex flex-wrap gap-2 pt-2 border-t border-border pt-4">
                        ${e.tags.map(tag => `<span class="px-2.5 py-1 bg-primary/5 text-primary text-xs rounded-md font-bold tracking-wide border border-primary/10">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </article>
    `).join('');
}

function renderProjects(projects) {
  const t = document.getElementById('projects-target');
  const empty = document.getElementById('projectsEmpty');

  if (!projects || projects.length === 0) {
    t.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  t.innerHTML = projects.map((p, index) => `
        <article class="group bg-surface rounded-2xl border border-border overflow-hidden flex flex-col h-full reveal-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-300" style="transition-delay: ${index * 50}ms">
            <div class="p-6 md:p-8 flex-grow flex flex-col">
                <div class="flex justify-between items-start mb-4">
                     <span class="text-[10px] font-extrabold font-mono uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full ring-1 ring-primary/20">${p.category}</span>
                     ${p.metrics && p.metrics[0] ? `<span class="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>${p.metrics[0]}</span>` : ''}
                </div>
                
                <h3 class="text-2xl font-bold mb-3 group-hover:text-primary transition-colors cursor-pointer" onclick="openModal('${p.id}')">${p.title}</h3>
                
                <p class="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-3 mb-6">
                    ${p.summary}
                </p>
                
                <div class="flex flex-wrap gap-2 mt-auto pb-6">
                    ${p.tags.slice(0, 3).map(tag => `<span class="text-xs px-2.5 py-1 bg-surface border border-border rounded-md text-[var(--text-muted)] font-medium">${tag}</span>`).join('')}
                    ${p.tags.length > 3 ? `<span class="text-xs px-2.5 py-1 text-[var(--text-muted)] font-medium">+${p.tags.length - 3}</span>` : ''}
                </div>
            </div>
            
            <button onclick="openModal('${p.id}')" class="w-full bg-surface border-t border-border px-6 py-4 flex justify-between items-center text-sm font-bold text-[var(--text)] group-hover:bg-primary group-hover:text-white transition-all cursor-pointer">
                 <span>View Details</span>
                 <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
        </article>
    `).join('');

  // Re-init animations for new elements
  const newEls = t.querySelectorAll('.reveal-hidden');
  observeElements(newEls);
}

function renderSkills() {
  const t = document.getElementById('skills-target');
  t.innerHTML = Object.entries(portfolioData.skills).map(([cat, list], i) => `
        <div class="reveal-hidden space-y-4" style="transition-delay: ${i * 100}ms">
            <h3 class="text-lg font-bold flex items-center gap-3 text-[var(--text)]">
                <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </span>
                ${cat}
            </h3>
            <div class="flex flex-wrap gap-2">
                ${list.map(s => `
                    <span class="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm font-medium text-[var(--text-muted)] shadow-sm hover:border-primary hover:text-primary hover:shadow-md transition-all cursor-default select-none group">
                        ${s}
                    </span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderCerts() {
  const t = document.getElementById('certs-target');
  t.innerHTML = portfolioData.certifications.map((c, i) => `
        <div class="bg-surface p-6 rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-lg reveal-hidden flex flex-col h-full" style="transition-delay: ${i * 50}ms">
            <div class="flex items-start justify-between mb-2">
                <div class="p-2 bg-primary/10 text-primary rounded-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                </div>
                <span class="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg)] px-2 py-1 rounded">${c.date}</span>
            </div>
            <h4 class="font-bold text-[var(--text)] text-lg mb-1 leading-tight">${c.name}</h4>
            <div class="text-sm text-[var(--text-muted)] font-medium mb-4">${c.issuer}</div>
            
            ${c.id ? `
            <div class="mt-auto pt-4 border-t border-border flex items-center gap-2">
                 <span class="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">ID</span>
                 <code class="text-xs font-mono bg-[var(--bg)] px-2 py-1 rounded select-all">${c.id}</code>
            </div>` : ''}
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
/* ================= Logic: Interactions (RAF) ================= */
// Throttling with requestAnimationFrame
let ticking = false;
let lastScrollY = 0;
let mouseX = 0;
let mouseY = 0;
let isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

function initInteractions() {
  const progress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const heroImageContainer = document.querySelector('.hero-image-container'); // For Parallax

  // 1. Create Global Spotlight
  const spot = document.createElement('div');
  spot.classList.add('global-spotlight', 'fixed', 'inset-0', 'pointer-events-none', 'z-0');
  document.body.appendChild(spot);

  // Scroll Listener
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScroll(progress, backToTop);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mouse Listener (Global)
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isTouch && !reduceMotion) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateMouse(heroImageContainer);
        });
      }
    }, { passive: true });
  }

  // Back To Top Click
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

function updateScroll(progressEl, backToTopEl) {
  // 1. Progress Bar
  const limit = document.body.offsetHeight - window.innerHeight;
  const per = Math.min((lastScrollY / limit) * 100, 100);

  // Hide progress bar at very top (0-2%)
  if (per < 2) {
    progressEl.style.transform = 'scaleX(0)';
    progressEl.style.opacity = '0';
  } else {
    progressEl.style.transform = `scaleX(${per / 100})`;
    progressEl.style.transformOrigin = 'left';
    progressEl.style.width = '100%';
    progressEl.style.opacity = '1';
  }

  // 2. Back To Top
  if (lastScrollY > window.innerHeight * 0.25) {
    backToTopEl.classList.remove('translate-y-20', 'opacity-0');
  } else {
    backToTopEl.classList.add('translate-y-20', 'opacity-0');
  }
}

function updateMouse(heroImageContainer) {
  // Global Spotlight Update
  // We update CSS vars on body to be accessible everywhere
  document.body.style.setProperty('--mx', `${mouseX}px`);
  document.body.style.setProperty('--my', `${mouseY}px`);

  // Parallax (Hero Image only)
  if (heroImageContainer) {
    // Calculate position relative to window center for parallax effect
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (mouseX - cx) / cx; // -1 to 1
    const dy = (mouseY - cy) / cy; // -1 to 1

    // Dampen the effect
    const img = heroImageContainer.querySelector('img');
    if (img) {
      img.style.transform = `translate3d(${dx * -10}px, ${dy * -10}px, 0)`;
    }
  }
}

/* ================= Logic: ScrollSpy & animations ================= */
function initScrollSpy() {
  const sects = document.querySelectorAll('section[id]');
  const navs = document.querySelectorAll('.nav-link');

  // Use IntersectionObserver for current section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Update Active Nav
        const id = e.target.getAttribute('id');
        navs.forEach(n => {
          n.classList.remove('is-active', 'text-primary'); // Remove text-primary legacy class if exists
          n.classList.remove('active'); // fallback
          if (n.getAttribute('href') === `#${id}`) {
            n.classList.add('is-active');
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px', // Center band detection
    threshold: 0
  });

  sects.forEach(s => observer.observe(s));
}

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.replace('reveal-hidden', 'reveal-visible');
        // Trigger count up if it's a stat
        if (e.target.querySelector('.count-up')) runCountUp(e.target);

        // Unobserve after reveal
        observer.unobserve(e.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before bottom
  });

  const els = document.querySelectorAll('.reveal-hidden');
  observeElements(els, observer);
}

function observeElements(els, observerInstance) {
  // If no instance provided, ignore (handled in init)
  if (observerInstance) {
    els.forEach(el => observerInstance.observe(el));
  }
}

function initCountUp() {
  const stats = document.querySelectorAll('.count-up');
  stats.forEach(el => {
    runCountUp(el.parentElement);
  });
}

function runCountUp(container) {
  const el = container.querySelector('.count-up');
  if (!el) return;
  // If already ran, skip (check if text != 0 unless 0 is final)
  // Better: add a 'done' flag
  if (container.dataset.counted) return;

  const end = parseInt(el.dataset.val);
  const suffix = container.querySelector('.hidden')?.textContent || '';

  // Make sure we don't animate if end is NaN (fallback)
  if (isNaN(end)) return;

  container.dataset.counted = "true";

  let start = 0;
  const dur = 2000;
  const step = 20; // faster FPS
  const iterations = dur / step;
  const incr = end / iterations;

  const t = setInterval(() => {
    start += incr;
    if (start >= end) {
      el.textContent = end + suffix;
      clearInterval(t);
    } else {
      el.textContent = Math.ceil(start) + suffix;
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
    if (I18N[currentLang] && I18N[currentLang][key]) {
      el.textContent = I18N[currentLang][key];
    }
  });

  // Placeholder update
  const search = document.getElementById('projectSearch');
  if (search) search.placeholder = I18N[currentLang]['search.placeholder'];
}
