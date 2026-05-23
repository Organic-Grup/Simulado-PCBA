const CACHE_NAME = "pcba-v2";

const urlsToCache = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(cache => {

            return cache.addAll(
                urlsToCache
            );

        })

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
        .then(response => {

            return response || fetch(event.request);

        })

    );

});

self.addEventListener("activate", event => {

    event.waitUntil(

        Promise.all([

            caches.keys().then(keys => {

                return Promise.all(

                    keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

                );

            }),

            self.clients.claim()

        ])

    );

});
