// import Cards from './Map/Cards';
// import Marker from './Map/Marker';

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

        this.RichMarker = null;
        this.addMarkerCount = 0;
        this.addMarkerTimer = null;
        this.markers = [];
        this.currentMarker;
    }

    init () {
        let me = this;

        this.RichMarker = require('js-rich-marker/lib/richmarker').RichMarker;

        this.map = new google.maps.Map(this.el, {
            zoom: this.opts.defaultZoom,
            minZoom: this.opts.zoomMin,
            maxZoom: this.opts.zoomMax,
            center: this.currentCenter,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            rotateControl: false,
            zoomControl: false,
            clickableIcons: false
        });

        this.bounds = new google.maps.LatLngBounds();

        this.initZoomControl_();
        this.initVue_();

        this.eachSpots_(function (item, isLast) {
            let position = new google.maps.LatLng(
                parseFloat(item.geo.latitude),
                parseFloat(item.geo.longitude)
            );
            me.bounds.extend(position);
            me.addMarker(position, item);

            if (isLast) {
                me.map.fitBounds(me.bounds);
            }
        });
    }

    initZoomControl_() {
        var me = this;
        var pos = google.maps.ControlPosition.RIGHT_TOP;
        var zoom = this.map.getZoom();

        var container = document.createElement('div');
        container.setAttribute('class', 'map-zoom-buttons btn-group-vertical');

        var zoomIn = document.createElement('button');
        zoomIn.setAttribute('class', 'btn btn-light btn-sm zoom-in');
        zoomIn.innerHTML = '<i class="material-icons">&#xE145;</i>';
        if (zoom >= this.opts.zoomMax) {
            zoomIn.setAttribute('disabled', true);
        }

        var zoomOut = document.createElement('button');
        zoomOut.setAttribute('class', 'btn btn-light btn-sm zoom-out');
        zoomOut.innerHTML = '<i class="material-icons">&#xE15B;</i>';
        if (zoom <= this.opts.zoomMin) {
            zoomOut.setAttribute('disabled', true);
        }

        zoomIn.addEventListener('click', function () {
            var zoom = me.map.getZoom();
            if (zoom <= me.opts.zoomMax) {
                me.map.setZoom(zoom + 1);
            }
        });

        zoomOut.addEventListener('click', function () {
            var zoom = me.map.getZoom();
            if (zoom >= me.opts.zoomMin) {
                me.map.setZoom(zoom - 1);
            }
        });

        container.appendChild(zoomIn);
        container.appendChild(zoomOut);

        this.map.controls[pos].push(container);

        this.map.addListener('zoom_changed', function (e) {
            me.beforeZoom = me.currentZoom;
            me.currentZoom = this.getZoom();

            if (me.beforeZoom < me.currentZoom) {
                me.onZoomIn_(me.beforeZoom, me.currentZoom);
            } else if (me.beforeZoom > me.currentZoom) {
                me.onZoomOut_(me.beforeZoom, me.currentZoom);
            }

            if (me.currentZoom > me.opts.zoomMin) {
                zoomOut.removeAttribute('disabled');
            } else {
                zoomOut.setAttribute('disabled', true);
            }

            if (me.currentZoom < me.opts.zoomMax) {
                zoomIn.removeAttribute('disabled');
            } else {
                zoomIn.setAttribute('disabled', true);
            }
        });
    }

    initVue_ () {
        this.vue = new Vue({
            el: Uni.el.get('mapCard'),
            data: {
                current: 0,
                timer: null,
                items: []
            },
            methods: {
                show (data) {
                    if (!data) {
                        return;
                    }

                    var len = this.items.length;
                    if (len > 1) {
                        if (0 === this.current) {
                            this.items.pop();
                            this.items.push(data);
                            this.current = 1;
                        } else {
                            this.items.shift();
                            this.items.unshift(data);
                            this.current = 0;
                        }
                    } else if (1 === len) {
                        this.items.push(data);
                        this.current = 1;
                    } else {
                        this.items.push(data);
                    }
                },

                hide () {
                    var nodes = this.$el.childNodes;
                    var i, l = nodes.length;
                    for (i = 0; i < l; i++) {
                        nodes[i].classList.remove('ready');
                    }
                }
            },
            updated () {
                var nodes = this.$el.childNodes;
                var len = this.items.length;
                var open = this.current;
                var close = (1 === open ? 0 : 1);

                if (this.timer) {
                    clearTimeout(this.timer);
                }

                this.timer = setTimeout(function () {
                    if (nodes[open]) {
                        nodes[open].classList.add('ready');
                    }
                    if (nodes[close]) {
                        nodes[close].classList.remove('ready');
                    }
                }, 30);
            }
        });
    }

    onZoomIn_(from, to) {
        // if (this.opts.debug) {
        //     console.log('zoomIn', {
        //         from: from,
        //         to: to
        //     });
        // }
    }

    onZoomOut_(from, to) {
        // if (this.opts.debug) {
        //     console.log('zoomOut', {
        //         from: from,
        //         to: to
        //     });
        // }
    }

    eachSpots_ (callback) {
        let json = Uni.el.get('mapSpotData');
        json = JSON.parse(json.innerText);
        json = json.itemListElement;

        let i, l = json.length, item, data;
        if (!l) {
            return;
        }

        for (i = 0; i < l; i++) {
            callback(json[i].item, (i === l - 1));
        }
    }

    addMarker (position, option) {
        var me = this;

        var content = '<div><div>' + (option.content || '') +'</div></div>';
        var container = document.createElement('div');
        container.classList.add('map-marker', 'normal');
        container.innerHTML = content;

        var marker = new this.RichMarker({
            position: position,
            content: container,
            shadow: false
        });

        marker.addListener('ready', function () {
            container.classList.add('ready');
        });

        marker.addListener('click', function () {
            if (me.currentMarker && me.currentMarker != this) {
                let cmContent = me.currentMarker.getContent();
                cmContent.classList.remove('focused');
                cmContent.classList.add('normal');
                me.currentMarker.content_changed();
            }

            if (container.classList.contains('normal')) {
                container.classList.remove('normal');
                container.classList.add('focused');
                me.vue.show(option);
                me.currentMarker = this;
            } else {
                container.classList.remove('focused');
                container.classList.add('normal');
                me.vue.hide();
                me.currentMarker = null;
            }
            this.content_changed();
        });

        setTimeout(function () {
            marker.setMap(me.map);
        }, 200 * this.addMarkerCount);

        if (this.addMarkerTimer) {
            clearTimeout(this.addMarkerTimer);
        }
        this.addMarkerTimer = setTimeout(function () {
            me.addMarkerCount = 0;
            me.addMarkerTimer = null;
        }, 2000);

        this.markers.push(marker);
        this.addMarkerCount++;
        return marker;
    }
}
