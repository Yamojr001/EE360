/**
 * Service Worker for Excellence Entrepreneurship Academy
 * Provides offline-first capabilities with caching and background sync
 */

const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  dynamic: `dynamic-${CACHE_VERSION}`,
  static: `static-${CACHE_VERSION}`,
  api: `api-${CACHE_VERSION}`,
};

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/login',
  '/globals.css',
];

// Listen for install event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAMES.static).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      // Note: Don't cache critical assets on install to avoid issues
      // Caching will happen dynamically as user visits pages
      return Promise.resolve();
    })
  );
});

// Listen for activate event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Listen for fetch events
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle page requests
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handlePageRequest(request));
    return;
  }

  // Handle static assets
  event.respondWith(handleAssetRequest(request));
});

/**
 * Handle API requests with network-first strategy
 * Tries network first, falls back to cache if offline
 */
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request.clone());
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAMES.api);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[Service Worker] Network error, checking cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // No cache available, return offline response
    return new Response(
      JSON.stringify({ 
        error: 'Offline',
        message: 'You are currently offline. Some data may not be available.' 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Handle page requests with cache-first strategy
 */
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request.clone());
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAMES.dynamic);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[Service Worker] Network error, checking cache for page:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Excellence Academy</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            }
            .container {
              background: white;
              padding: 2rem;
              border-radius: 0.5rem;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 400px;
            }
            h1 { color: #0f172a; margin: 0 0 1rem; }
            p { color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>You are Offline</h1>
            <p>Please check your internet connection to continue.</p>
            <p>Cached data will load when you reconnect.</p>
          </div>
        </body>
      </html>`,
      {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}

/**
 * Handle static asset requests with cache-first strategy
 */
async function handleAssetRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try network
    const networkResponse = await fetch(request.clone());
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAMES.static);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Failed to fetch asset:', request.url);
    
    // Return cached response if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return a generic error response
    return new Response('Asset not found', { status: 404 });
  }
}

/**
 * Handle background sync for offline changes
 * Implemented in client-side IndexedDB manager
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[Service Worker] Syncing offline data...');
    event.waitUntil(
      // Sync will be handled by client
      Promise.resolve()
    );
  }
});

/**
 * Listen for messages from clients
 */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      Promise.all(cacheNames.map((name) => caches.delete(name)));
    });
  }
});

console.log('[Service Worker] Loaded and ready');
