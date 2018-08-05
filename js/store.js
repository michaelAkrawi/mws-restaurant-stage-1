// JavaScript source code
var store = {
    db: null,
    write: function (review) {

        if (store.db) {
            var tx = store.db.transaction('reviews-store', 'readwrite');
            var storeObject = tx.objectStore('reviews-store');

            storeObject.put(review);
            tx.complete = () => {
                store.db.close();
            };
        }
        else {

            const request = indexedDB.open('db-reviews', 1);
            request.onerror = err => { console.log(err) };
            request.onupgradeneeded = function (event) {

                var db = event.target.result;
                var store = db.createObjectStore('reviews-store', { keyPath: 'id' });
                var index = store.createIndex("by-id", "id");
                store.db = db;
            }

            request.onsuccess = function (event) {
                store.db = request.result;
                store.write(review);
            }
        }        
    },

    read: function (callback) {

        if (store.db) {
            callback(store.db, null);
        }
        else {

            const request = indexedDB.open('db-reviews', 1);
            request.onerror = err => {
                console.log(err);
                callback(null, err);
            };
            request.onupgradeneeded = function (event) {

                var db = event.target.result;
                var store = db.createObjectStore('reviews-store', { keyPath: 'id' });
                var index = store.createIndex("by-id", "id");
                store.db = db;
            }

            request.onsuccess = function (event) {
                store.db = request.result;
                callback(store.db, null);
            }
        }
        
    }

}