
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// Vue.component('example', require('./components/Example.vue'));

// const app = new Vue({
//     el: '#app'
// });

window.initMap = () => {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: uluru,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
        },
    });

    var marker = new google.maps.Marker({
        position: uluru,
        map: map,
        title: 'Hello World!'
    });

    marker.addListener('click', function() {
        var check = $('#open-article');
        check.prop('checked', !check.is(':checked'));
    });
}

