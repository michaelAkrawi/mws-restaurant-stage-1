// JavaScript source code


const MAX_RATE = 5;

$(document).ready(function () {

    bindEvents();
    fetchRestaurant();

});



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
    const review = document.getElementById('post-review');
    const form = document.querySelector('form');

    anchors.forEach(function (a) {
        a.addEventListener('mouseover', function () {
            onRateStarsHover(a.parentElement);
        });

        a.addEventListener('click', function () {
            setSelectedRate(a.parentElement);
        });
    });

    ul.addEventListener('mouseleave', function () {
        resetRateStars();
    });

    review.addEventListener('click', function (e) {
        postUserReview();
    });
    
}

function postUserReview() {


    const review = {
        id: getParameterByName('id'),
        name: document.getElementById('txb-firstname').value,
        comments: document.getElementById('txb-reivew').value,
        rating: document.querySelectorAll('#ul-review li.selected').length
    }

    DBHelper.postNewReview(review);
}

/*
 * reset user rating selection 
 */
function resetRateStars() {

    const items = document.querySelectorAll('#ul-review li');
    items.forEach(function (item) {
        $(item).removeClass('checked');
    });

    const rate = document.querySelectorAll('.selected');
    if (rate.length == 0) {
        const flag = document.getElementById('rate-flag');
        flag.style.display = 'none';
    }
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

    const flag = document.getElementById('rate-flag');
    const flagText = document.getElementById('rate-flag-text');

    flag.style.display = 'inline-block';
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






