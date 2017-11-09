/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

var domready = require('domready');
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

window.initMap = () => {
    window.AbstractInfoBox = require('./lib/AbstractInfoBox');
    window.Baloon = require('./lib/Baloon');
    window.Marker = require('./lib/Marker');
    var mc = new Map(document.getElementById('js-map'));
}

domready(function () {
    var article = new ToggleArticle();
    article.listen('.toggle-article');
    article.onShow(function () {
        console.log('onShow');
    });

    (function () {
        var ref = document.querySelector('header .share button');
        var target = document.querySelector('header .share .buttons');
        if (!ref || !target) {
            return;
        }

        var popper;

        ref.addEventListener('click', function (e) {
            e.preventDefault();

            if (popper) {
                ref.classList.remove('show');
                popper.destroy();
                popper = null;
            } else {
                popper = new Popper(ref, target, {
                    placement: 'right'
                });
                ref.classList.add('show');
            }
        });
    })();
});
