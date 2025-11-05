const CACHE_NAME="gabeos-v3-cache";
const ASSETS=[
  "index.html",
  "app.js",
  "manifest.json"
];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});

self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(res=>{
      return res || fetch(e.request).then(fetchRes=>{
        return caches.open(CACHE_NAME).then(cache=>{
          cache.put(e.request,fetchRes.clone());
          return fetchRes;
        });
      });
    })
  );
});

self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys().then(keys=>{
      return Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));
    })
  );
});

