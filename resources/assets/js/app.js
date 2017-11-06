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

window.initMap = () => {
    window.AbstractInfoBox = require('./lib/AbstractInfoBox');
    window.Baloon = require('./lib/Baloon');
    window.Marker = require('./lib/Marker');
    // window.Baloon = require('./lib/baloon');
    var mc = new Map(document.getElementById('map'));



    // var currentCenter = null;
    // var panPoint = null;
    // map.addListener('zoom_changed', function(e) {
    //     console.log(panPoint);
    //     if (panPoint) {
    //         var bounds = getPadBounds(0,0,0-(mapObj.height() * 0.7),0);
    //         panPoint = bounds.getCenter();
    //         console.log([panPoint.lat(),panPoint.lng()]);
    //         map.panTo(panPoint);
    //     }
    // });

    // $('#open-article').on('change', function () {
    //     var t = $(this);
    //     var flag = t.is(':checked');

    //     if (flag) {
    //         currentCenter = map.getCenter();
    //         map.setOptions({
    //             gestureHandling: 'none'
    //         });
    //         var pad = mapObj.height() * 0.7;
    //         var bounds = getPadBounds(0,0,pad,0);
    //         panPoint = bounds.getCenter();
    //         console.log([panPoint.lat(),panPoint.lng()]);
    //         map.panTo(panPoint);
    //     } else {
    //         panPoint = null;
    //         map.setOptions({
    //             gestureHandling: 'greedy'
    //         });
    //         map.panTo(currentCenter);
    //     }
    // });

    // marker.addListener('click', function() {
    //     $('#open-article').click();
    // });

    // var getPadBounds = function (top, right, bottom, left) {
    //     top = (('' + top).match(/^[0-9\.]+$/i) ? parseInt(top) : 0);
    //     right = (('' + right).match(/^[0-9\.]+$/i) ? parseInt(right) : 0);
    //     bottom = (('' + bottom).match(/^[0-9\.]+$/i) ? parseInt(bottom) : 0);
    //     left = (('' + left).match(/^[0-9\.]+$/i) ? parseInt(left) : 0);
    //     console.log([top, right, bottom, left]);

    //     var bounds = map.getBounds();
    //     var scale = Math.pow(2, map.getZoom());
    //     var proj = map.getProjection();

    //     var sw = proj.fromLatLngToPoint(bounds.getSouthWest());
    //     var ne = proj.fromLatLngToPoint(bounds.getNorthEast());
    //     sw = new google.maps.Point(
    //         ((sw.x * scale) + right) / scale,
    //         ((sw.y * scale) - top) / scale
    //     );
    //     ne = new google.maps.Point(
    //         ((ne.x * scale) - left) / scale,
    //         ((ne.y * scale) + bottom) / scale
    //     );
    //     var rect = new google.maps.LatLngBounds(proj.fromPointToLatLng(sw), proj.fromPointToLatLng(ne));

    //     // // Debug: show rectangle
    //     new google.maps.Rectangle({
    //         bounds: rect,
    //         map: map
    //     });

    //     return rect;
    // };
}
