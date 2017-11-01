export default class {
    constructor (element) {
        this.option = {
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
            },
        };

        this.headerElement = document.getElementById('header');
        this.articleElement = document.getElementById('article');
        this.toggleElement = document.getElementById('show-article');

        this.mapElement = element;

        this.beforeZoom = this.option.defaultZoom;
        this.currentZoom = this.option.defaultZoom;
        this.currentCenter = this.option.defaultPosition;

        this.bounds = null;
        this.article = null;

        this.map = new google.maps.Map(this.mapElement, {
            zoom: this.option.defaultZoom,
            // minZoom: this.option.zoomMin,
            // maxZoom: this.option.zoomMax,
            center: this.currentCenter,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            rotateControl: false,
            zoomControl: false
        });

        this.init();
    }

    init () {
        var self = this;

        self.addCustomZoomControl();

        self.map.addListener('zoom_changed', function(e) {
            self.beforeZoom = self.currentZoom;
            self.currentZoom = this.getZoom();

            if (self.beforeZoom < self.currentZoom) {
                self.onZoomIn(self.beforeZoom, self.currentZoom);
            } else if (self.beforeZoom > self.currentZoom) {
                self.onZoomOut(self.beforeZoom, self.currentZoom);
            }

            if (self.zoomOutButton) {
                if (self.currentZoom > self.option.zoomMin) {
                    self.zoomOutButton.removeAttribute('disabled');
                } else {
                    self.zoomOutButton.setAttribute('disabled', true);
                }
            }

            if (self.zoomInButton) {
                if (self.currentZoom < self.option.zoomMax) {
                    self.zoomInButton.removeAttribute('disabled');
                } else {
                    self.zoomInButton.setAttribute('disabled', true);
                }
            }
        });

        google.maps.event.addDomListener(window, 'resize', function (e) {
            google.maps.event.trigger(self.map, 'resize');
            self.map.setCenter(self.currentCenter);
        });

        google.maps.event.addDomListener(self.toggleElement, 'click', function (e) {
            if (!self.currentMarker) {
                e.preventDefault();
                return false;
            }
        });

        google.maps.event.addDomListener(self.toggleElement, 'change', function (e) {
            if (self.currentMarker) {
                if (self.toggleElement.checked) {
                    self.showArticle();
                } else {
                    self.hideArticle();
                }
            }
        });

        self.addMarker(this.option.defaultPosition);
    }

    triggerEvent(element, event) {
        console.log(element, event);
        if (window.Event) {
            var evt = new Event(event, {bubbles:false, cancelable:false});
            element.dispatchEvent(evt);
        } else if (document.createEvent) {
            // IE以外
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent(event, true, true ); // event type, bubbling, cancelable
            return element.dispatchEvent(evt);
        } else {
            // IE
            var evt = document.createEventObject();
            return element.fireEvent("on"+event, evt);
        }
    }

    addCustomZoomControl () {
        var self = this;
        var zoom = this.map.getZoom();

        var container = document.createElement('div');
        container.setAttribute('class', 'zoom-buttons btn-group-vertical');

        var zoomIn = document.createElement('button');
        zoomIn.setAttribute('class', 'btn btn-light btn-sm zoom-in');
        zoomIn.innerHTML = '<i class="material-icons">&#xE145;</i>';
        if (zoom >= this.option.zoomMax) {
            zoomIn.setAttribute('disabled', true);
        }

        var zoomOut = document.createElement('button');
        zoomOut.setAttribute('class', 'btn btn-light btn-sm zoom-out');
        zoomOut.innerHTML = '<i class="material-icons">&#xE15B;</i>';
        if (zoom <= this.option.zoomMin) {
            zoomOut.setAttribute('disabled', true);
        }

        zoomIn.addEventListener('click', function () { self.zoomIn(); });
        zoomOut.addEventListener('click', function () { self.zoomOut(); });

        container.appendChild(zoomIn);
        container.appendChild(zoomOut);

        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(container);
        this.zoomInButton = zoomIn;
        this.zoomOutButton = zoomOut;
    }

    onZoomIn (from, to) {
        if (this.option.debug) {
            console.log('zoomIn', {from: from, to: to});
        }

        // if (this.article) {
        //     this.setCenterByArticle(this.article, to);
        // }
    }

    onZoomOut (from, to) {
        if (this.option.debug) {
            console.log('zoomOut', {from: from, to: to});
        }

        // if (this.article) {
        //     this.setCenterByArticle(this.article, to);
        // }
    }

    addMarker (position, conf) {
        var self = this;

        var option = {};
        if ('object' === typeof conf) {
            option = conf;
        }
        option.position = position;
        option.map = this.map;

        var marker = new google.maps.Marker(option);

        marker.addListener('click', function() {
            self.currentMarker = this;
            self.toggleElement.checked = true;
            self.triggerEvent(self.toggleElement, 'change');
        });
    }

    setCenter (latlon, bounds) {
        var position;

        if (!bounds) {
            position = latlon;
        } else {
            var spherical = google.maps.geometry.spherical;
            var mapCenter = this.map.getCenter();
            var boundsCenter = bounds.getCenter();
            var target = latlon || mapCenter;

            var length = spherical.computeLength([target, boundsCenter]);
            var heading = spherical.computeHeading(boundsCenter, target);

            position = spherical.computeOffset(mapCenter, length, heading);
        }

        this.map.panTo(position);

        this.currentCenter = position;
    }

    getPadBounds (requests, zoom) {
        var width = this.mapElement.clientWidth;
        var height = this.mapElement.clientHeight;
        var max = this.option.widthMax;
        var currentBounds = this.map.getBounds();
        var proj = this.map.getProjection();
        var scale = Math.pow(2, zoom || this.map.getZoom());
        var sw = proj.fromLatLngToPoint(currentBounds.getSouthWest());
        var ne = proj.fromLatLngToPoint(currentBounds.getNorthEast());

        var key, val, sizes = {top:0, right:0, bottom:0, left:0};
        for (key in requests) {
            val = '' + (requests[key] || 0);
            if (/^\d+$/.test(val)) {
                sizes[key] = parseInt(val);
            } else if (/^\d+px$/.test(val)) {
                sizes[key] = parseInt(val.slice(0, -2));
            } else if (/^\d+\%$/.test(val)) {
                val = parseInt(val.slice(0, -1));
                if ('left' === key || 'right' === key) {
                    sizes[key] = (Math.min(val, 100) / 100) * width;
                } else {
                    sizes[key] = (Math.min(val, 100) / 100) * height;
                }
            }
        }

        if (this.option.debug) {
            console.info('bounds size', requests, sizes);
        }

        if (width > max) {
            var pad = (width - max) / 2;

            if (sizes.left < pad) {
                sizes.left = sizes.left + pad;
            }

            if (width - sizes.right > width - pad) {
                sizes.right = sizes.right + pad;
            }
        }

        var tr = new google.maps.Point(
            ne.x - (sizes.right ? sizes.right / scale : 0),
            ne.y + (sizes.top ? sizes.top / scale : 0)
        );
        var bl = new google.maps.Point(
            sw.x + (sizes.left ? sizes.left / scale : 0),
            sw.y - (sizes.bottom ? sizes.bottom / scale : 0)
        );

        var bounds = new google.maps.LatLngBounds(
            proj.fromPointToLatLng(bl),
            proj.fromPointToLatLng(tr)
        );

        return bounds;
    }

    showArticle () {
        if (!this.currentMarker) {
            if (this.option.debug) {
                console.error('Target marker is not defined');
            }
            return;
        }

        this.map.setOptions({
            gestureHandling: 'none'
        });

        var marker = this.currentMarker;
        var markerPosition = marker.getPosition();

        this.article = {
            marker: marker,
            markerPosition: markerPosition,
            beforeZoom: this.map.getZoom(),
            beforeCenter: this.map.getCenter(),
        };

        this.map.setZoom(13);

        var size = {top: this.headerElement.clientHeight, bottom: '70%'};
        if (document.body.clientWidth > this.option.breakPoint.mobile) {
            size = {top: this.headerElement.clientHeight, right: '70%'};
        }
        var bounds = this.getPadBounds(size);
        this.setCenter(marker.getPosition(), bounds);
    }

    hideArticle () {
        if (!this.article) {
            if (this.option.debug) {
                console.error('Article is not defined');
            }
            return;
        }

        this.map.setZoom(this.article.beforeZoom);
        this.map.panTo(this.article.beforeCenter);
        this.article = null;

        this.map.setOptions({
            gestureHandling: 'greedy'
        });
    }

    // onArticleShowed () {
    //     var self = this;
    //     google.maps.event.trigger(self.map, 'resize');
    //     self.map.panTo(self.article.marker.getPosition());
    // }

    // onArticleHided () {
    //     var self = this;
    //     self.map.setOptions({
    //         gestureHandling: 'greedy'
    //     });
    //     self.map.setZoom(self.article.beforeZoom);
    //     self.map.panTo(self.article.beforeCenter);
    //     self.article = null;
    // }

    // getTransitionEvent () {
    //     var t, el = document.createElement("div");
    //     var transitions = {
    //         "transition"      : "transitionend",
    //         "OTransition"     : "oTransitionEnd",
    //         "MozTransition"   : "transitionend",
    //         "WebkitTransition": "webkitTransitionEnd"
    //     }

    //     for (t in transitions){
    //         if (el.style[t] !== undefined){
    //             return transitions[t];
    //         }
    //     }
    // }

    // setCenterByArticle (article, zoom) {
    //     var origin = article.markerPosition;
    //     var range = article.beforeZoom - zoom;
    //     var length = 0 - (article.pointLength * Math.pow(2, range));
    //     var heading = article.pointHeading;
    //     var position = google.maps.geometry.spherical.computeOffset(origin, length, heading);
    //     this.map.setCenter(position);
    // }

    // rad (x) {
    //     return x * Math.PI / 180;
    // }

    // getDistance (p1, p2) {
    //     var R = 6378137; // Earth’s mean radius in meter
    //     var dLat = this.rad(p2.lat() - p1.lat());
    //     var dLong = this.rad(p2.lng() - p1.lng());
    //     var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //       Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
    //       Math.sin(dLong / 2) * Math.sin(dLong / 2);
    //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     var d = R * c;
    //     return d; // returns the distance in meter
    // }

    // getContainerBounds () {
    //     var width = this.mapElement.clientWidth;
    //     var height = this.mapElement.clientHeight;
    //     var max = this.option.widthMax;
    //     var bounds;

    //     if (width > max) {
    //         var currentBounds = this.map.getBounds();
    //         var proj = this.map.getProjection();
    //         var scale = Math.pow(2, this.map.getZoom());
    //         var ne = currentBounds.getNorthEast();//北東
    //         var sw = currentBounds.getSouthWest();//南西
    //         var left = (width - max) / 2;
    //         var right = left + max;

    //         var x = proj.fromLatLngToPoint(sw).x;
    //         var y = proj.fromLatLngToPoint(ne).y;

    //         var tr = new google.maps.Point(right / scale + x, y);
    //         var bl = new google.maps.Point(left / scale + x, height / scale + y);

    //         bounds = new google.maps.LatLngBounds(
    //             proj.fromPointToLatLng(bl),
    //             proj.fromPointToLatLng(tr)
    //         );
    //     } else {
    //         bounds = this.map.getBounds();
    //     }

    //     return bounds;
    // }
}
