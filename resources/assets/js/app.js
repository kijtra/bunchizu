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

import Map from './lib/Map';
import ToggleArticle from './lib/ToggleArticle';

var article = new ToggleArticle();
article.listen('.toggle-article');
article.onShow(function () {
    console.log('onShow');
});

window.initMap = () => {
    window.AbstractInfoBox = require('./lib/AbstractInfoBox');
    window.Baloon = require('./lib/Baloon');
    window.Marker = require('./lib/Marker');
    var mc = new Map(document.getElementById('js-map'));
}
