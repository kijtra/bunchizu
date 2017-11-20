/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');



/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// Vue.component('example', require('./components/Example.vue'));

// const app = new Vue({
//     el: '#app'
// });


require('domready')(function () {
    Uni.Map.initCards();
    // console.log(Uni.schema.getData('spots'));
});

window.initMap = () => {
    Uni.Map.initMap();
    // window.AbstractInfoBox = require('./lib/AbstractInfoBox');
    // window.Baloon = require('./lib/Baloon');
    // window.Marker = require('./lib/Marker');
    // window.RichMarker = require('js-rich-marker/lib/richmarker').RichMarker;
    // var mc = new Map(document.getElementById('js-map'));
}

// require('domready')(function () {
//     Elements.sets({
//         map: '#js-map',
//         spots: '.spot-list',
//     });
    
//     SwiperInit();

//     // var article = new ToggleArticle();
//     articleToggler.listen('.toggle-article');
//     articleToggler.onShow(function () {
//         console.log('onShow');
//     });

//     (function () {
//         var ref = document.querySelector('header .share button');
//         var target = document.querySelector('header .share .buttons');
//         if (!ref || !target) {
//             return;
//         }

//         var popper;

//         ref.addEventListener('click', function (e) {
//             e.preventDefault();

//             if (popper) {
//                 ref.classList.remove('show');
//                 popper.destroy();
//                 popper = null;
//             } else {
//                 popper = new Popper(ref, target, {
//                     placement: 'right'
//                 });
//                 ref.classList.add('show');
//             }
//         });
//     })();
// });
