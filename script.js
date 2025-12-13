/**
 * Modern Quant Portfolio - Interactive Logic
 * Handles: Theme, Mobile Menu, Scrollspy, Animations, Form
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollSpy();
  initAnimations();
});

/* ================= Theme System ================= */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Check local storage or system preference
  const storedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = storedTheme || (systemDark ? 'dark' : 'light');
  setTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}

/* ================= Mobile Menu ================= */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const close = document.getElementById('drawerClose');
  const drawer = document.getElementById('mobileDrawer');
  const panel = document.getElementById('drawerPanel');
  const backdrop = document.getElementById('drawerBackdrop');
  const links = drawer.querySelectorAll('.mobile-link');

  function openMenu() {
    drawer.removeAttribute('aria-hidden');
    backdrop.classList.add('open');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock scroll
  }

  function closeMenu() {
    backdrop.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      drawer.setAttribute('aria-hidden', 'true');
    }, 300);
  }

  toggle.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ================= Scroll Spy ================= */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        updateActiveLink(id);
      }
    });
  }, { threshold: 0.2, rootMargin: "-20% 0px -50% 0px" });

  sections.forEach(s => observer.observe(s));

  function updateActiveLink(id) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      if (href === id) {
        link.classList.add('text-accent', 'font-bold');
        link.classList.remove('text-gray-400');
      } else {
        link.classList.remove('text-accent', 'font-bold');
        link.classList.add('text-gray-400');
      }
    });
  }
}

/* ================= Animations ================= */
function initAnimations() {
  // Select elements that need animation
  // In HTML we used 'animate-reveal' as a marker
  const elements = document.querySelectorAll('.animate-reveal, .card, .chip'); // Broad selection for effect

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    // Only observe if it has the marker or is a main component
    if (el.classList.contains('animate-reveal')) {
      el.style.opacity = '0'; // Initial state
      observer.observe(el);
    }
  });
}

/* ================= Accordion ================= */
// Global function as it's called via onclick in HTML or we can attach event listeners
window.toggleAccordion = function (btn) {
  const group = btn.parentElement;
  const content = group.querySelector('.hidden-content');
  const isHidden = content.classList.contains('hidden');

  if (isHidden) {
    content.classList.remove('hidden');
    content.classList.add('block', 'animate-fade-in');
    btn.innerHTML = 'Show less <span>↑</span>';
  } else {
    content.classList.add('hidden');
    content.classList.remove('block', 'animate-fade-in');
    btn.innerHTML = 'Show more <span>↓</span>';
  }
};

/* ================= Form Toast ================= */
window.handleForm = function (e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  btn.disabled = true;
  btn.textContent = 'Sending...';

  // Simulate network request
  setTimeout(() => {
    // Success
    showToast('Message sent successfully!', 'success');
    e.target.reset();
    btn.disabled = false;
    btn.textContent = originalText;
  }, 1500);
};

function showToast(msg, type) {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toastMessage');

  text.textContent = msg;
  toast.className = `toast toast-${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
