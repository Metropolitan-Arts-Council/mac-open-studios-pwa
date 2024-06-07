import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {imageCache, offlineFallback, pageCache, staticResourceCache} from "workbox-recipes";
import {registerRoute} from "workbox-routing";
import {NetworkFirst} from "workbox-strategies";
import {CacheableResponsePlugin} from "workbox-cacheable-response";

const manifest = self.__WB_MANIFEST;
cleanupOutdatedCaches();
precacheAndRoute(manifest);

self.addEventListener('install', () => console.log('SW MANIFEST', manifest));
self.addEventListener('activate', () => console.log('SW MANIFEST', manifest));

registerRoute(
    ({request}) => request.url.includes('wp-json') || request.url.includes('_payload.json'),
    new NetworkFirst({
        plugins: [
            new CacheableResponsePlugin({statuses: [0, 200]}),
        ],
    })
);

pageCache({warmCache: [
    '/',
    '/about', 'about',
    '/sponsors', 'sponsors',
    '/map', 'map',
    '/artists', 'artists',
]});
imageCache({maxEntries: 500});
staticResourceCache();

offlineFallback({
    pageFallback: '/',
    imageFallback: '/placeholder.png',
});
