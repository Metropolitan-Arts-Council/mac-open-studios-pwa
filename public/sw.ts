import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {imageCache, offlineFallback, pageCache, staticResourceCache} from "workbox-recipes";
import {registerRoute} from "workbox-routing";
import {NetworkFirst} from "workbox-strategies";
import {CacheableResponsePlugin} from "workbox-cacheable-response";

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({request}) => request.url.includes('wp-json'),
    new NetworkFirst({
        plugins: [
            new CacheableResponsePlugin({statuses: [0, 200]}),
        ],
    })
);

pageCache({warmCache: ['/', '/about', '/sponsors', '/map', '/artists']});
imageCache({maxEntries: 500});
staticResourceCache();

offlineFallback({
    pageFallback: '/',
    imageFallback: '/placeholder.png',
});
