import { promises as fs } from 'fs';
import { join } from 'path';

async function generateServiceWorker() {
  const distDir = join(process.cwd(), 'dist');
  const files = [];

  // Rekurencyjne odczytywanie wszystkich plików w dist
  async function scanDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else {
        // Dodaj ścieżkę relatywną do dist
        const relativePath = '/' + fullPath.replace(distDir, '').replace(/\\/g, '/').replace(/^\//, '');
        files.push(relativePath);
      }
    }
  }

  await scanDir(distDir);

  // Filtruj zasoby do cache'owania
  const urlsToCache = ['/', '/offline.html', ...files.filter(file => 
    file.endsWith('.html') || 
    file.endsWith('.js') || 
    file.endsWith('.css') || 
    file.includes('/assets/')
  )];

  // Generuj unikalną nazwę cache'u na podstawie daty i czasu
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14); // np. 20250325123456
  const CACHE_NAME = `my-app-cache-${timestamp}`;

  // Modified Service Worker content with network-first strategy
  const swContent = `
const CACHE_NAME = '${CACHE_NAME}';
const urlsToCache = ${JSON.stringify(urlsToCache, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache otwarty: ${CACHE_NAME}");
      return cache.addAll(urlsToCache).then(() => self.skipWaiting());
    }).catch((err) => {
      console.error("Błąd podczas cache'owania:", err);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("Usuwanie starego cache'u:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Clone the response because we might need to use it twice
        const responseToCache = networkResponse.clone();

        // Add the response to cache for future offline use
        if (networkResponse.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      })
      .catch(() => {
        // Network failed, try to get it from cache
        return caches.match(event.request, {
          ignoreSearch: true
        }).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If not in cache, return the offline page
          return caches.match('/offline.html');
        });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
`;

  // Zapisz plik sw.js w dist
  await fs.writeFile(join(distDir, 'sw.js'), swContent.trim());
  console.log('Service Worker wygenerowany z CACHE_NAME:', CACHE_NAME);
  console.log('Liczba plików w urlsToCache:', urlsToCache.length);
}

generateServiceWorker().catch((error) => {
  console.error("Błąd generowania Service Workera:", error);
});