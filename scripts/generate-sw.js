const fs = require('fs');
const path = require('path');

async function generateServiceWorker() {
  const distDir = path.join(process.cwd(), 'out');
  const files = [];

  // Rekurencyjne odczytywanie wszystkich plików w dist
  async function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
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
  const urlsToCache = ['/', ...files.filter(file => 
    file.endsWith('.html') || 
    file.endsWith('.js') || 
    file.endsWith('.css') || 
    file.includes('/assets/')
  )];

  // Generuj unikalną nazwę cache'u na podstawie daty i czasu
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14); // np. 20250325123456
  const CACHE_NAME = `my-app-cache-${timestamp}`;

  // Service Worker z uproszczoną strategią cache-first
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
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only deal with GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then((cachedResponse) => {
        // Jeśli mamy w cache, zwróć z cache'u
        if (cachedResponse) {
          return cachedResponse;
        }

        // W przeciwnym razie pobierz z sieci
        return fetch(event.request).then((networkResponse) => {
          // Jeśli odpowiedź jest niepoprawna, po prostu ją zwróć
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          // Sklonuj odpowiedź, żeby móc ją dodać do cache'u
          const responseToCache = networkResponse.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        }).catch(() => {
          // W przypadku błędu, pozwól hostingowi obsłużyć odpowiedź
          throw new Error('Network error');
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
  fs.writeFileSync(path.join(distDir, 'sw.js'), swContent.trim());
  console.log('Service Worker wygenerowany z CACHE_NAME:', CACHE_NAME);
  console.log('Liczba plików w urlsToCache:', urlsToCache.length);
}

generateServiceWorker().catch((error) => {
  console.error("Błąd generowania Service Workera:", error);
});