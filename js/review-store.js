// JavaScript source code
var reviewDbStoreObject = {
    db: null,
    write: function (review, callback) {

        if (reviewDbStoreObject.db) {
            var tx = reviewDbStoreObject.db.transaction('reviews-store', 'readwrite');
            var storeObject = tx.objectStore('reviews-store');            
            storeObject.put(review);
            tx.complete = () => {
                reviewDbStoreObject.db.close();              
            };

            callback();
        }
        else {
            console.log('you must call init on db before using write function');
        }
    },

    init: function (callback) {

        if (reviewDbStoreObject.db) {
            callback(reviewDbStoreObject.db, null);
        }
        else {

            const request = indexedDB.open('db-reviews', 1);
            request.onerror = err => {
                console.log(err);
                callback(null, err);
            };
            request.onupgradeneeded = function (event) {

                var db = event.target.result;
                var store = db.createObjectStore('reviews-store', { keyPath: 'id', autoIncrement : true });
                var index = store.createIndex("by-id", "id");
                reviewDbStoreObject.db = db;
            }

            request.onsuccess = function (event) {
                reviewDbStoreObject.db = request.result;
                callback(reviewDbStoreObject.db, null);
            }
        }

    },

    getAll: function (callback) {
        if (reviewDbStoreObject.db) {

            const tx = reviewDbStoreObject.db.transaction('reviews-store', 'readonly');
            const storeObject = tx.objectStore('reviews-store');
            const storeObjectRequest = storeObject.getAll()
            storeObjectRequest.onsuccess = () => {
                callback(storeObjectRequest.result);
            }


        } else {
            console.log('you have to init db before using getAll function');
        }
    },

    delete: function (id) {

        if (reviewDbStoreObject.db) {
            const tx = reviewDbStoreObject.db.transaction('reviews-store', 'readwrite');
            const storeObject = tx.objectStore('reviews-store');
            const storeObjectRequest = storeObject.delete(id);
            storeObjectRequest.onsuccess = () => {
                console.log('review has been deleted succsessfully');
            }

            storeObjectRequest.onerror = (error) => {
                console.log(error);
            }


        }
    }


}