// Mission Control Mobile - Service Worker
const CACHE_NAME = 'mission-control-mobile-v1';

// Basic service worker for future offline capability
self.addEventListener('install', event => {
    console.log('📱 Mission Control Mobile SW installed');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('📱 Mission Control Mobile SW activated');
    event.waitUntil(clients.claim());
});