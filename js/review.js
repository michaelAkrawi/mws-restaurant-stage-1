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

    let anchors = document.querySelectorAll('#ul-review a');
    let ul = document.getElementById('ul-review');
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
}

function resetRateStars() {

    const items = document.querySelectorAll('#ul-review li');
    items.forEach(function (item) {
        item.classList = "";
    });
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




