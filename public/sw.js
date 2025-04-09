const CACHE_NAME = "lamongan-trip-cache-v1";
const urlsToCache = ["/", "/index.html", "/src/styles/*", "/index.js"];

// Instalasi Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Aktivasi Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetching (Intercept permintaan dan coba dari cache)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Tidak ada di cache - fetch dari network
      return fetch(event.request).then((response) => {
        // Periksa jika response valid
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Duplikat response dan simpan di cache
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
