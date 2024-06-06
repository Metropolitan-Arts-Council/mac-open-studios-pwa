import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {imageCache, offlineFallback, pageCache, staticResourceCache} from "workbox-recipes";

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

pageCache({warmCache: ['/', '/about', '/sponsors', '/map', '/artists']});
imageCache({maxEntries: 500});
staticResourceCache();

offlineFallback({
    pageFallback: '/',
    imageFallback: '/placeholder.png',
});
