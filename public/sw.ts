import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {imageCache, offlineFallback, pageCache, staticResourceCache} from "workbox-recipes";
import {registerRoute} from "workbox-routing";
import {StaleWhileRevalidate} from "workbox-strategies";
import {CacheableResponsePlugin} from "workbox-cacheable-response";
import {ExpirationPlugin} from "workbox-expiration";

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

pageCache({warmCache: ['/', '/about', '/sponsors', '/map', '/artists']});
imageCache({maxEntries: 500});
staticResourceCache();

registerRoute(
    ({request}) => request.url.includes('wp-json'),
    new StaleWhileRevalidate({
        plugins: [
            new CacheableResponsePlugin({statuses: [0, 200]}),
            new ExpirationPlugin({maxAgeSeconds: 60 * 60 * 24 * 30}),
        ],
    })
);

offlineFallback({
    pageFallback: '/',
    imageFallback: '/placeholder.png',
});
