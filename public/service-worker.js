'use strict';

const CACHE_NAME = 'static-cache-v9';

const FILES_TO_CACHE = [
    '/offline.html',
    '/index.html',
    '/assets/bueno_muerto.png',
    '/assets/bueno.png',
    '/assets/clases.png',
    '/assets/game_over.png',
    '/assets/jefe_muerto.png',
    '/assets/jefe.png',
    '/assets/malo_muerto.png',
    '/assets/malo.png',
    '/assets/screenshot.png',
    '/assets/shot1.png',
    '/assets/shot2.png',
    '/assets/you_win.png',
    '/install.js'
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');

    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-catching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');

    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    evt.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(evt.request)
            .then((response) => {
                console.log("RESP", response);
                return response || fetch(evt.request);
            });
        })
    );
});

