// JavaScript source code
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open('restaurants-review').then(function (cache) {

        var urlToCache = ['/',
            'js/main.js',
            'css/styles.css',            
            'js/dbhelper.js',
            'js/restaurant_info.js',
            'img/1.jpg',
            'img/10.jpg',
            'img/2.jpg',
            'img/3.jpg',
            'img/4.jpg', 
            'img/5.jpg',
            'img/6.jpg',
            'img/7.jpg',
            'img/8.jpg',
            'img/9.jpg'
        ];

        return cache.addAll(urlToCache)
            .then(function () { console.log('done caching') })
            .catch(function (error) { console.log(error); });

    }));
});

self.addEventListener('fetch', function (event) {

    console.log(event.request.url);
    event.respondWith(caches.match(event.request).then(function (response) {
        console.log(response);
        return response || fetch(event.request);
    }));

});