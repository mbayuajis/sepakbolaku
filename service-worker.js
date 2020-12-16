const CACHE_NAME = "sepakbolaku-v1";

var urlsToCache = [
	"/",
	"manifest.json",
	"index.html",
	"nav.html",
	"klasemenucl.html",
	"jadwalpertandinganucl.html",
	"tim.html",
	"icon.png",
	"icon192.png",
	"js/jquery.min.js",
	"js/main.js",
	"js/idb.js",
	"js/materialize.min.js",
	"js/api.js",
	"js/nav.js",
	"push.js",
	"css/materialize.min.css"
];

self.addEventListener("install", function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener("fetch", function(event) {
	const base_url = "https://api.football-data.org/";
  	if (event.request.url.indexOf(base_url) > -1) {
		event.respondWith(
	      caches.open(CACHE_NAME).then(function(cache) {
	        return fetch(event.request).then(function(response) {
	          cache.put(event.request.url, response.clone());
	          return response;
	        })
	      })
	    );
    } else {
	    event.respondWith(
	      caches.match(event.request, { ignoreSearch: true }).then(function(response) {
	        return response || fetch (event.request);
	      })
	    )
	}
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/icon192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Sepakbolaku', options)
  );
});
