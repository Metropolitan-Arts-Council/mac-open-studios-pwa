import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {imageCache, offlineFallback, pageCache, staticResourceCache} from "workbox-recipes";
import {registerRoute, setCatchHandler, setDefaultHandler} from "workbox-routing";
import {NetworkFirst} from "workbox-strategies";
import {CacheableResponsePlugin} from "workbox-cacheable-response";
import {cacheNames} from "workbox-core";

const manifest = self.__WB_MANIFEST;
const cacheName = cacheNames.runtime;
const cacheEntries = [];
const manifestURLs = manifest.map(
    (entry) => {
        const url = new URL(entry.url, self.location);

        cacheEntries.push(new Request(url.href));

        return url.href
    }
)
cleanupOutdatedCaches();
precacheAndRoute(manifest);

self.addEventListener('install', (event) => {
    console.log('SW MANIFEST', manifest);

    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(cacheEntries)
        })
    )
});
self.addEventListener('activate', (event) => {
    console.log('SW MANIFEST', manifest);

    event.waitUntil(
        caches.open(cacheName).then((cache) => {

            cache.keys().then((keys) => {
                keys.forEach((request) => {

                    if (!manifestURLs.includes(request.url)) {
                        cache.delete(request)
                    }
                })
            })
        })
    )
});

registerRoute(
    ({request}) => request.url.includes('wp-json') || request.url.includes('_payload.json'),
    new NetworkFirst({
        plugins: [
            new CacheableResponsePlugin({statuses: [0, 200]}),
        ],
    })
);

registerRoute(
    ({ url }) => manifestURLs.includes(url.href),
    new NetworkFirst({cacheName})
);

setDefaultHandler(new NetworkFirst());

setCatchHandler(({ event }) => {
    switch (event.request.destination) {
        case 'document':
            return caches.match('index.html').then((r) => {
                return r ? Promise.resolve(r) : Promise.resolve(Response.error())
            });
        case 'image':
            return caches.match('placeholder.png').then((r) => {
                return r ? Promise.resolve(r) : Promise.resolve(Response.error())
            });
        default:
            return Promise.resolve(Response.error());
    }
})

// pageCache({warmCache: [
//     '/',
//     '/about', 'about',
//     '/sponsors', 'sponsors',
//     '/map', 'map',
//     '/artists', 'artists',
// ]});
// imageCache({maxEntries: 500});
// staticResourceCache();

offlineFallback({
    pageFallback: '/',
    imageFallback: 'placeholder.png',
});
