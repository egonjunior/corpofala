/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist: undefined | RegExp[];
if (import.meta.env.DEV)
    allowlist = [/^\/$/];

// to allow work offline
registerRoute(new NavigationRoute(
    createHandlerBoundToURL('index.html'),
    { allowlist, denylist: [/^\/~oauth/] }
));

self.skipWaiting();
clientsClaim();

// PUSH NOTIFICATIONS EVENT
self.addEventListener('push', function (event) {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const title = data.title || 'CorpoFala';
        const options = {
            body: data.body || 'Uma nova mensagem para você.',
            icon: '/pwa-192x192.svg',
            badge: '/badge.png', // Fallback for small icon
            data: {
                url: data.url || '/app/dashboard'
            },
            vibrate: [200, 100, 200],
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    } catch (e) {
        console.error('Error parsing push data', e);
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

    const promiseChain = self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        let matchingClient = null;

        for (let i = 0; i < windowClients.length; i++) {
            const windowClient = windowClients[i];
            if (windowClient.url === urlToOpen) {
                matchingClient = windowClient;
                break;
            }
        }

        if (matchingClient) {
            return matchingClient.focus();
        } else {
            return self.clients.openWindow(urlToOpen);
        }
    });

    event.waitUntil(promiseChain);
});
