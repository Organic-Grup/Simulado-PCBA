const CACHE_NAME = "pcba-v1";

const urlsToCache = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"
];

self.addEventListener("install", event => {

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

            return response ||
                   fetch(event.request);

        })

    );

});

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                .filter(key =>
                    key !== CACHE_NAME
                )
                .map(key =>
                    caches.delete(key)
                )

            );

        })

    );

});
