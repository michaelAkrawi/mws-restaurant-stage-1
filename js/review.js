// JavaScript source code

document.addEventListener('DOMContentLoaded', function (event) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(function (reg) {
            if ('sync' in reg) {

                const form = document.getElementById('user-review-form');
                form.addEventListener('submit', function (e) {

                    e.preventDefault();
                    const review = createNewReview();
                    postReview(null, review);
                    //cacheReview(review, postReview);

                });
            }
        }).catch(function (err) {
            console.error(err); // the Service Worker didn't install correctly

        });;
    }
});







const MAX_RATE = 5;

$(document).ready(function () {

    bindEvents();
    fetchRestaurant();

});


/**
 * Post user review.
 */
function postReview(error, review) {
    if (error == null) {
        DBHelper.postNewReview(review, function (error, result) {
            if (error) {
                store.write(review);
            } else {

                window.alert('Review has been submited!');
                window.location.replace(`${window.location.origin}/restaurant.html?id=${review.id}`);
            }
        });
    }
}


/**
 *  get the restaurant data for the review
 **/
function fetchRestaurant() {

    let info = document.getElementById('restaruant-info');
    const id = getParameterByName('id');
    DBHelper.fetchRestaurantById(id, function (error, restaurant) {
        if (error) {
            console.log(error);
        }
        else {
            fillRestaurantHTML(restaurant)
        }

    });
}


/**
 * create HTML from restaurant data 
 **/
function fillRestaurantHTML(restaurant) {

    const container = document.getElementById('restaruant-info');
    let $name = $('<h2>');
    $name.attr('id', 'restaurant-name');
    let $img = $('<img>');
    $img.attr('id', 'restaurant-img');
    $img.attr('alt', `image of ${restaurant.name}`);
    $name.html(restaurant.name);
    $(container).append($name);
    $img.attr('src', DBHelper.imageUrlForRestaurant(restaurant));
    $img.addClass('restaurant-img');
    $(container).append($img);

}


/**
 *  bind events for page elements
 **/
function bindEvents() {

    const anchors = document.querySelectorAll('#ul-review a');
    const ul = document.getElementById('ul-review');
    const form = document.querySelector('form');

    anchors.forEach(function (a) {
        a.addEventListener('mouseover', function () {
            onRateStarsHover(a.parentElement);
        });

        a.addEventListener('click', function () {
            setSelectedRate(a.parentElement);
        });
    });
}

/*
 * validate form contros before post.
 */
function validateReview() {

    let valid = true;
    const name = document.getElementById('txb-firstname');
    const comments = document.getElementById('txb-reivew');
    if (name.value == undefined || name.value == '') {
        name.classList.add('has-error');
        name.parentElement.parentElement.querySelector('label').classList.add('has-error-control-label');
        valid = false;
    }
    else {
        name.classList.remove('has-error');
        name.parentElement.parentElement.querySelector('label').classList.remove('has-error-control-label');
    }

    if (comments.value == undefined || comments.value == '') {
        comments.classList.add('has-error');
        comments.parentElement.parentElement.querySelector('label').classList.add('has-error-control-label');
        valid = false;

    }
    else {
        comments.classList.remove('has-error');
        comments.parentElement.parentElement.querySelector('label').classList.remove('has-error-control-label');
    }

    return valid;
}


/**
 *  Create new review from page inputs.
 **/
function createNewReview() {
    const review = {
        restaurant_id: parseInt(getParameterByName('id')),
        name: document.getElementById('txb-firstname').value,
        comments: document.getElementById('txb-reivew').value,
        rating: document.querySelectorAll('#ul-review li.selected').length
    }

    return review;
}


/**
 *  set rating stars checked by mouse position
 **/
function onRateStarsHover(li) {

    const index = $(li).index();
    let j = 0;
    while (j < MAX_RATE) {

        let $item = $('#ul-review').children().eq(j);
        if (j <= index) {
            $item.addClass('checked');
        }
        else {
            $item.removeClass('checked');
        }

        j++;
    }


    const flagText = document.getElementById('rate-flag-text');
    const $a = $(li).find('a');
    flagText.innerHTML = $a.attr('title');

}


/**
 * Set the final selected rating.
 **/
function setSelectedRate(li) {

    const index = $(li).index();
    let j = 0;
    let items = document.querySelectorAll('li');
    while (j < MAX_RATE) {

        let $item = $('#ul-review').children().eq(j);
        if (j <= index) {
            $item.removeClass('checked').addClass('selected');
        }
        else {
            $item.removeClass('selected');
        }

        j++
    }
}


/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}







