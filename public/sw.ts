import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {imageCache, offlineFallback, pageCache, staticResourceCache} from "workbox-recipes";
import {registerRoute} from "workbox-routing";
import {NetworkFirst} from "workbox-strategies";
import {CacheableResponsePlugin} from "workbox-cacheable-response";

// class CustomLoggerPlugin {
//     response = undefined;
//
//     async cacheWillUpdate(ctx) {
//         console.log('cacheWillUpdate', ctx);
//         return ctx.response;
//     }
//     async cacheKeyWillBeUsed(ctx) {
//         console.log('cacheKeyWillBeUsed', ctx);
//         return ctx.request.clone();
//     }
//     async cachedResponseWillBeUsed(ctx) {
//         const response = this.response ? this.response : ctx.cachedResponse;
//         console.log('cachedResponseWillBeUsed', ctx, response);
//         return response;
//     }
//     async requestWillFetch(ctx) {
//         console.log('requestWillFetch', ctx);
//         return ctx.request;
//     }
//     async fetchDidFail(ctx) {
//         console.log('fetchDidFail', ctx);
//     }
//     async fetchDidSucceed(ctx) {
//         console.log('fetchDidSucceed', ctx, ctx.response.ok);
//
//         if (ctx.response.ok) {
//             this.response = await ctx.response.clone();
//             return this.response;
//         }
//     }
//     async handlerWillRespond(ctx) {
//         console.log('handlerWillRespond', ctx);
//         return ctx.response;
//     }
//     async handlerDidRespond(ctx) {
//         console.log('handlerDidRespond', ctx);
//     }
//     async handlerDidComplete(ctx) {
//         console.log('handlerDidComplete', ctx);
//     }
//     async handlerDidError(ctx) {
//         console.log('handlerDidError', ctx);
//         return null;
//     }
// }

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
    ]/*, plugins: [new CustomLoggerPlugin()]*/
});

// self.addEventListener('install', () => console.log('SW Install', manifest));

registerRoute(
    ({url}) => url.pathname.includes('wp-json') || url.pathname.includes('_payload.json'),
    new NetworkFirst({
        plugins: [
            new CacheableResponsePlugin({statuses: [0, 200]}),
            // new CustomLoggerPlugin(),
        ],
    })
);
staticResourceCache(/*{plugins: [new CustomLoggerPlugin()]}*/);
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
