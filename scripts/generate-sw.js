const fs = require('fs');
const path = require('path');

async function generateServiceWorker() {
  const distDir = path.join(process.cwd(), 'out');
  const files = new Set();

  // Recursively read all files in dist
  async function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else {
        // Add path relative to dist
        let relativePath = '/' + fullPath.replace(distDir, '').replace(/\\/g, '/').replace(/^\//, '');
        
        // Convert PHP extensions to HTML for caching purposes
        if (relativePath.endsWith('.php')) {
          relativePath = relativePath.replace(/\.php$/, '.html');
        }
        
        files.add(relativePath);
      }
    }
  }

  await scanDir(distDir);

  // Filter resources to cache
  const urlsToCache = new Set(['/']);
  
  for (const file of files) {
    if ((file.endsWith('.html') || 
        file.endsWith('.js') || 
        file.endsWith('.css') || 
        file.includes('/assets/')) && 
        !file.endsWith('/sw.js')) {
      urlsToCache.add(file);
    }
  }

  console.log(`Prepared ${urlsToCache.size} unique URLs for caching`);

  // Generate unique cache name based on date and time
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const CACHE_NAME = `app-cache-${timestamp}`;

  // Standard Service Worker content
  const swContent = `
const CACHE_NAME = '${CACHE_NAME}';
const urlsToCache = ${JSON.stringify([...urlsToCache], null, 2)};

// Install event - cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - cache-first strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses or non-same-origin responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }).catch(() => {
          // For HTML requests, return the cached homepage as a fallback
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
        });
      })
  );
});
`;

  // Save the sw.js file in dist
  fs.writeFileSync(path.join(distDir, 'sw.js'), swContent.trim());
  console.log('Service Worker generated with CACHE_NAME:', CACHE_NAME);
  console.log('Number of files cached:', urlsToCache.size);
}

generateServiceWorker().catch((error) => {
  console.error("Error generating Service Worker:", error);
});