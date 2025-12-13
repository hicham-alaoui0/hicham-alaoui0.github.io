const CACHE_NAME = 'portfolio-v5';
const CORE_ASSETS = [
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/CV/CV_2025_DS_AI.pdf',
  '/assets/images/hero-bg.jpg',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
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

// Network First for data, Stale-while-revalidate for others
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Network First for data files
  if (url.pathname.includes('/data/')) {
    event.respondWith(
      fetch(request)
        .then(networkRes => {
          if (networkRes.ok) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
            return networkRes;
          }
          throw new Error('Network response not ok');
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Stale-while-revalidate for everything else
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