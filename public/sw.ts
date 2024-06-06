import * as navigationPreload from 'workbox-navigation-preload';
import {CacheFirst, NetworkFirst, StaleWhileRevalidate} from 'workbox-strategies';
import {registerRoute, NavigationRoute, Route} from 'workbox-routing';
import {cleanupOutdatedCaches, precacheAndRoute} from 'workbox-precaching';
import {CacheableResponsePlugin} from "workbox-cacheable-response";
import {ExpirationPlugin} from "workbox-expiration";
import {offlineFallback, warmStrategyCache} from "workbox-recipes";

const manifest = self.__WB_MANIFEST;

cleanupOutdatedCaches();

precacheAndRoute(manifest);

const pageCache = new NetworkFirst({
  cacheName: 'page-cache',
  plugins: [
      new CacheableResponsePlugin({statuses: [0, 200]}),
      new ExpirationPlugin({maxAgeSeconds: 60 * 30}),// 30 min
  ],
});

warmStrategyCache({
  urls: ['/', '/about', '/sponsors', '/map', '/artists'],
  strategy: pageCache,
});

registerRoute(({ request }) => {
    return request.mode === 'navigate';
}, pageCache);


registerRoute(
    ({ request }) => {
        return request.mode !== 'navigate';
    },
    new StaleWhileRevalidate({
        cacheName: 'asset-cache',
        plugins: [
            new CacheableResponsePlugin({statuses: [0, 200]}),
            new ExpirationPlugin({maxAgeSeconds: 60 * 30}),// 30 min
        ],
    }),
);

offlineFallback({
    pageFallback: '/',
});

// const version = '20240703153200'; // Increment this version whenever you make changes
//
// const manifest = self.__WB_MANIFEST;
//
// cleanupOutdatedCaches();
//
// precacheAndRoute(manifest);
//
// // navigationPreload.enable();
//
//
// const navigationRoute = new NavigationRoute(new NetworkFirst({
//   cacheName: 'navigations-' + version
// }));
// registerRoute(navigationRoute);
//
//
// const staticAssetsRoute = new Route(
//     ({request}) => ['image', 'script', 'style'].includes(request.destination),
//     new NetworkFirst({cacheName: 'static-assets-' + version})
// );
// registerRoute(staticAssetsRoute);
//
//
// const wpJsonRoute = new Route(
//     ({request}) => request.url.includes('wp-json'),
//     new NetworkFirst({cacheName: 'wp-json-' + version})
// );
// registerRoute(wpJsonRoute);
//
//
// self.addEventListener('message', (event) => {
//   console.log('SW message', event);
//   if (event.data && event.data.type === 'SKIP_WAITING') {
//     console.log('SW skip waiting', event);
//     self.skipWaiting();
//   }
// });
//
// // This happens when a new service worker is pushed to the server
// self.addEventListener('install', (event) => {
//   console.log('SW install', event);
//   self.skipWaiting();
// });
//
// // This happens when all tabs/clients with the old SW are closed and a new one is opened
// self.addEventListener('activate', (event) => {
//   console.log('SW activate', event);
//
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames
//           .filter((cacheName) => !cacheName.includes(version))
//           .map((cacheName) => caches.delete(cacheName))
//       );
//     })
//   );
//
//   self.clients.claim(); // Ensure that the service worker is controlling the clients immediately
// });
//
// self.addEventListener('fetch', (event) => {
//   console.log('manifest', manifest);
//   console.log('SW fetch', event.request.url, event.request.destination);
// });
//
// // Listen for the precache update event
// self.addEventListener('precache-updated', (event) => {
//   console.log('SW Precache updated', event);
//   self.skipWaiting(); // Ensure the updated cache is used immediately
// });
//
// // Listen for when the service worker is ready to handle requests
// self.addEventListener('ready', (event) => {
//   console.log('SW ready');
// });
