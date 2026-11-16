
const CACHE_NAME = "nuestro-primer-capitulo-v1";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon.png",
    "./portada.jpg",
    "./contraportada.jpg",
    "./musica.mp3",
    "./fotos/foto1.jpg",
    "./fotos/foto2.jpg",
    "./fotos/foto3.jpg"
];

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {

            for (const file of FILES) {

                try {
                    await cache.add(file);
                } catch (error) {
                    console.log("Archivo pendiente:", file);
                }

            }

            await self.skipWaiting();

        })
    );

});

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(async keys => {

            await Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );

            await self.clients.claim();

        })
    );

});

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(async cached => {

            if (cached) return cached;

            try {

                const response = await fetch(event.request);

                if (
                    response.ok &&
                    new URL(event.request.url).origin === self.location.origin
                ) {

                    const cache = await caches.open(CACHE_NAME);

                    cache.put(event.request, response.clone());

                }

                return response;

            } catch (error) {

                if (event.request.mode === "navigate") {
                    return caches.match("./index.html");
                }

                return new Response("Archivo no disponible sin conexión", {
                    status: 503
                });

            }

        })
    );

});
