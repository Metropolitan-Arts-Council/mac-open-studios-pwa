import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {imageCache, offlineFallback, pageCache, staticResourceCache} from "workbox-recipes";
import {registerRoute} from "workbox-routing";
import {NetworkFirst} from "workbox-strategies";
import {CacheableResponsePlugin} from "workbox-cacheable-response";

const manifest = self.__WB_MANIFEST;
cleanupOutdatedCaches();

offlineFallback({
    pageFallback: '/',
    imageFallback: 'placeholder.png',
});

precacheAndRoute(manifest);

registerRoute(
    ({request}) => request.url.includes('wp-json') || request.url.includes('_payload.json'),
    new NetworkFirst({
        plugins: [
            new CacheableResponsePlugin({statuses: [0, 200]}),
        ],
    })
);

pageCache({warmCache: [
    '/', '/index.html', 'index.html',
    '/about', 'about', '/about.html', 'about.html',
    '/sponsors', 'sponsors', '/sponsors.html', 'sponsors.html',
    '/map', 'map', '/map.html', 'map.html',
    '/artists', 'artists', '/artists.html', 'artists.html',
]});
imageCache({maxEntries: 500});
staticResourceCache();
