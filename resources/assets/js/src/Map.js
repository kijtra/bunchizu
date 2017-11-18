import Cards from './Map/Cards';
import Marker from './Map/Marker';

export default class Map {
    constructor () {
        this.opts = {
            debug: true,
            defaultPosition: {
                lat: 35.7055267,
                lng: 139.424972
            },
            defaultZoom: 14,
            zoomMin: 13,
            zoomMax: 19,
            widthMax: 960,
            articleRatioHeight: 0.7,
            articleRatioWidth: 1,
            breakPoint: {
                mobile: 576,
                desktop: 577
            }
        };

        this.el = Uni.el.get('map');
        this.map = null;

        this.beforeZoom = this.opts.defaultZoom;
        this.currentZoom = this.opts.defaultZoom;
        this.currentCenter = this.opts.defaultPosition;
    }

    initMap () {
        this.map = new google.maps.Map(this.el, {
            zoom: this.opts.defaultZoom,
            minZoom: this.opts.zoomMin,
            maxZoom: this.opts.zoomMax,
            center: this.currentCenter,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            rotateControl: false,
            zoomControl: false
        });

        this.initZoomControl_();

        var mk = new Marker({map: this.map, position: this.currentCenter});
    }

    initCards () {
        let cards = new Cards;
        cards.init();
        cards.toggle();
    }

    initZoomControl_() {
        let self = this;
        let pos = google.maps.ControlPosition.RIGHT_TOP;
        let zoom = this.map.getZoom();

        let container = document.createElement('div');
        container.setAttribute('class', 'zoom-buttons btn-group-vertical');

        let zoomIn = document.createElement('button');
        zoomIn.setAttribute('class', 'btn btn-light btn-sm zoom-in');
        zoomIn.innerHTML = '<i class="material-icons">&#xE145;</i>';
        if (zoom >= this.opts.zoomMax) {
            zoomIn.setAttribute('disabled', true);
        }

        let zoomOut = document.createElement('button');
        zoomOut.setAttribute('class', 'btn btn-light btn-sm zoom-out');
        zoomOut.innerHTML = '<i class="material-icons">&#xE15B;</i>';
        if (zoom <= this.opts.zoomMin) {
            zoomOut.setAttribute('disabled', true);
        }

        zoomIn.addEventListener('click', function () {
            let zoom = self.map.getZoom();
            if (zoom <= self.opts.zoomMax) {
                self.map.setZoom(zoom + 1);
            }
        });

        zoomOut.addEventListener('click', function () {
            let zoom = self.map.getZoom();
            if (zoom >= self.opts.zoomMin) {
                self.map.setZoom(zoom - 1);
            }
        });

        container.appendChild(zoomIn);
        container.appendChild(zoomOut);

        this.map.controls[pos].push(container);

        this.map.addListener('zoom_changed', function (e) {
            self.beforeZoom = self.currentZoom;
            self.currentZoom = this.getZoom();

            if (self.beforeZoom < self.currentZoom) {
                self.onZoomIn(self.beforeZoom, self.currentZoom);
            } else if (self.beforeZoom > self.currentZoom) {
                self.onZoomOut(self.beforeZoom, self.currentZoom);
            }

            if (self.currentZoom > self.opts.zoomMin) {
                zoomOut.removeAttribute('disabled');
            } else {
                zoomOut.setAttribute('disabled', true);
            }

            if (self.currentZoom < self.opts.zoomMax) {
                zoomIn.removeAttribute('disabled');
            } else {
                zoomIn.setAttribute('disabled', true);
            }
        });
    }

    onZoomIn(from, to) {
        // if (this.opts.debug) {
        //     console.log('zoomIn', {
        //         from: from,
        //         to: to
        //     });
        // }
    }

    onZoomOut(from, to) {
        // if (this.opts.debug) {
        //     console.log('zoomOut', {
        //         from: from,
        //         to: to
        //     });
        // }
    }
}
