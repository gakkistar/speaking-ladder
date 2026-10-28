/* Offline-first service worker for 口语阶梯.
   After changing index.html (or any precached file), bump VERSION so phones pick up the new copy. */
const VERSION = `v14`;
const CACHE = `speaking-ladder-${VERSION}`;
const FONT_CACHE = `speaking-ladder-fonts`;
const PRECACHE = [
  `./`,
  `./index.html`,
  `./manifest.webmanifest`,
  `./icons/icon-192.png`,
  `./icons/icon-512.png`,
  `./icons/apple-touch-icon.png`
];

self.addEventListener(`install`, event => {
  event.waitUntil(
    caches.open(CACHE)
      // cache: reload skips the HTTP cache, so a new VERSION never precaches a stale file
      .then(cache => cache.addAll(PRECACHE.map(url => new Request(url, { cache: `reload` }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener(`activate`, event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith(`speaking-ladder-`) && k !== CACHE && k !== FONT_CACHE)
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Google Fonts: serve from cache straight away, refresh in the background.
   With nothing cached and no network, answer with an empty stylesheet so the page
   falls back to its system fonts without errors. */
function fontResponse(event) {
  const { request } = event;
  const isCss = new URL(request.url).hostname === `fonts.googleapis.com`;
  return caches.open(FONT_CACHE).then(cache => cache.match(request).then(cached => {
    const network = fetch(request)
      .then(res => {
        if (res && (res.ok || res.type === `opaque`)) cache.put(request, res.clone());
        return res;
      })
      .catch(() => null);
    if (cached) {
      event.waitUntil(network);
      return cached;
    }
    return network.then(res => res || (isCss
      ? new Response(``, { headers: { 'Content-Type': `text/css` } })
      : Response.error()));
  }));
}

self.addEventListener(`fetch`, event => {
  const { request } = event;
  if (request.method !== `GET`) return;
  const url = new URL(request.url);

  if (url.hostname === `fonts.googleapis.com` || url.hostname === `fonts.gstatic.com`) {
    event.respondWith(fontResponse(event));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // Pages (including ./?foo) all resolve to the cached app shell.
  if (request.mode === `navigate`) {
    event.respondWith(
      caches.match(`./index.html`, { cacheName: CACHE })
        .then(cached => cached || fetch(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request, { cacheName: CACHE, ignoreSearch: true }).then(cached => cached || fetch(request).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy));
      }
      return res;
    }))
  );
});
