self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("cache").then(cache => {
      return cache.addAll(["/", "/index.html", "/manifest.json", "/icon.png"]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(resp => {
      return resp || fetch(e.request);
    })
  );
});

self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('Push received:', data);
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon.png'
  });
});
