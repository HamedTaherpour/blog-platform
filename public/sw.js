// Simple Service Worker for PWA
const CACHE_NAME = 'conduit-pwa-v1';
const API_CACHE_NAME = 'conduit-api-v1';
const STATIC_CACHE_NAME = 'conduit-static-v1';

const urlsToCache = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip unsupported schemes (chrome-extension, moz-extension, etc.)
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('moz-extension://') ||
      event.request.url.startsWith('safari-extension://') ||
      event.request.url.startsWith('ms-browser-extension://')) {
    return;
  }

  // Handle API requests
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('api.realworld.io') ||
      event.request.url.includes('localhost:3000/api')) {
    
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // If we have a cached response, return it immediately
          if (cachedResponse) {
            console.log('SW: Serving API from cache:', event.request.url);
            
            // Also try to fetch fresh data in background
            fetch(event.request)
              .then((response) => {
                if (response.status === 200) {
                  cache.put(event.request, response.clone());
                  console.log('SW: Updated API cache:', event.request.url);
                }
              })
              .catch(() => {
                // Ignore fetch errors when updating cache
              });
            
            return cachedResponse;
          }
          
          // If no cached response, fetch from network
          return fetch(event.request)
            .then((response) => {
              // Cache successful API responses
              if (response.status === 200) {
                const responseClone = response.clone();
                cache.put(event.request, responseClone);
                console.log('SW: Cached API response:', event.request.url);
              }
              return response;
            })
            .catch(() => {
              // If network fails, return a generic offline response for API calls
              return new Response(
                JSON.stringify({ 
                  error: 'You are offline. Please check your connection.',
                  offline: true 
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        });
      })
    );
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If online, cache the response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If no cached page, serve offline page
              return caches.match('/offline');
            });
        })
    );
    return;
  }

  // Handle static assets (CSS, JS, images, etc.)
  event.respondWith(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Cache static assets
            if (response.status === 200 && 
                (event.request.url.includes('_next/static') || 
                 event.request.url.includes('.css') || 
                 event.request.url.includes('.js') ||
                 event.request.url.includes('.png') ||
                 event.request.url.includes('.jpg') ||
                 event.request.url.includes('.svg') ||
                 event.request.url.includes('.woff') ||
                 event.request.url.includes('.woff2'))) {
              const responseClone = response.clone();
              cache.put(event.request, responseClone);
            }
            return response;
          })
          .catch(() => {
            // Return cached version if available
            return caches.match(event.request);
          });
      });
    })
  );
});

console.log('Service Worker: Loaded');