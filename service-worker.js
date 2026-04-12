const CACHE_NAME = 'portfolio-v9';
const CORE_ASSETS = [
  './',
  './index.html',
  './projects/index-rebalancing-control-platform.html',
  './projects/ai-pricing-promotion-decision-engine.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './data/profile.json',
  './data/certifications.json',
  './assets/images/hero-bg.jpg',
  './assets/images/profile/profile-gen.jpg',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

// Network First for detailed content (HTML, JS, CSS, Data)
// Implements "Stale-While-Revalidate" only for images/fonts
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Network First for: HTML, JS, CSS, JSON Data
  // This ensures the latest code/content is always prioritized.
  if (request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.includes('/data/')) {

    event.respondWith(
      fetch(request)
        .then(networkRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkRes.clone());
            return networkRes;
          });
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Stale-while-revalidate for everything else (Images, Fonts)
  event.respondWith(
    caches.match(request).then(cacheRes => {
      const fetchPromise = fetch(request).then(networkRes => {
        if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return networkRes;
      }).catch(() => cacheRes);
      return cacheRes || fetchPromise;
    })
  );
});
