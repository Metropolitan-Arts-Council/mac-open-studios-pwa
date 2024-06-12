import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {imageCache, offlineFallback, pageCache, staticResourceCache} from "workbox-recipes";
import {registerRoute} from "workbox-routing";
import {NetworkFirst} from "workbox-strategies";
import {CacheableResponsePlugin} from "workbox-cacheable-response";

const manifest = self.__WB_MANIFEST;
cleanupOutdatedCaches();

precacheAndRoute(manifest);

pageCache({
    warmCache: [
        '/',
        '/about',
        '/sponsors',
        '/map',
        '/artists',
    ]
});

registerRoute(
    ({url}) => url.pathname.includes('wp-json') || url.pathname.includes('_payload.json'),
    new NetworkFirst({
        plugins: [
            new CacheableResponsePlugin({statuses: [0, 200]}),
        ],
    })
);
staticResourceCache();
imageCache({maxEntries: 500});
offlineFallback({
    pageFallback: 'index.html',
    imageFallback: 'placeholder.png',
});

self.addEventListener('push', (event) => {
    console.log('SW PUSH', event, event?.data?.json());

    if (!(!!self.Notification && self.Notification.permission === 'granted')) return;

    // https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData
    if (event.data) {
        const data = event.data.json();

        event.waitUntil(
            self.registration.showNotification(data.title, data)
        );
    }
});
