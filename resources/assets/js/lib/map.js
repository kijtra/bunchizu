export default class {
    constructor (element) {
        var self = this;

        this.option = {
            debug: true,
            defaultPosition: {
                lat: 35.7055267,
                lng: 139.424972
            },
            defaultZoom: 14,
            zoomMin: 13,
            zoomMax: 19,
            articleRatioHeight: 0.7,
            articleRatioWidth: 1,
        };

        this.mapElement = element;
        this.mapSize = {
            width: element.clientWidth,
            height: element.clientHeight,
        };

        this.beforeZoom = this.option.defaultZoom;
        this.currentZoom = this.option.defaultZoom;

        this.article = null;

        this.map = new google.maps.Map(this.mapElement, {
            zoom: this.option.defaultZoom,
            minZoom: this.option.zoomMin,
            maxZoom: this.option.zoomMax,
            center: this.option.defaultPosition,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            rotateControl: false,
            zoomControl: false
        });

        this.addCustomZoomControl();

        this.map.addListener('zoom_changed', function(e) {
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

            // if (zoom <= self.option.zoomMin || zoom >= self.option.zoomMax) {
            //     return false;
            // }

            // if (self.showedArticle) {
            //     // var proj = self.map.getProjection();
            //     var rect = self.getPadBounds(self.mapObj.height() * 0.7,0,0,0);
            //     var oldPos = self.currentMarker.getPosition();
            //     var newPos = rect.getCenter();
            //     var center = self.map.getCenter();
                
            //     var len = google.maps.geometry.spherical.computeLength([oldPos,newPos]);
            //     len = 0 - len;
            //     var heading = google.maps.geometry.spherical.computeHeading(oldPos, newPos);
                
            //     var panPos = google.maps.geometry.spherical.computeOffset(center, len, heading);
            //     // self.addMarker(panPos);
            //     self.map.setCenter(panPos);
            // }

            // self.currentZoom = self.map.getZoom();
        });

        window.resizeTimer_ = false;
        window.addEventListener('resize', function (e) {
            if (this.resizeTimer_ !== false) {
                clearTimeout(self.resizeTimer_);
            }

            this.resizeTimer_ = setTimeout(function () {
                self.mapSize = {
                    width: self.mapElement.clientWidth,
                    height: self.mapElement.clientHeight,
                };

                if (self.option.debug) {
                    console.info('mapSize', self.mapSize);
                }
            }, 200);// 最低でも16.6以上
        });

        this.addMarker(this.option.defaultPosition);

        $('#open-article').on('change', function () {
            if ($(this).is(':checked')) {
                self.showArticle();
            } else {
                self.hideArticle();
            }
        });
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

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(container);
        this.zoomInButton = zoomIn;
        this.zoomOutButton = zoomOut;
    }

    zoomIn () {
        var current = this.map.getZoom();
        var zoom = current + 1;

        if (zoom <= this.option.zoomMax) {
            this.map.setZoom(zoom);
        }
    }

    zoomOut () {
        var current = this.map.getZoom();
        var zoom = current - 1;

        if (zoom >= this.option.zoomMin) {
            this.map.setZoom(zoom);
        }
    }

    onZoomIn (from, to) {
        if (this.option.debug) {
            console.log('zoomIn', {from: from, to: to});
        }

        if (this.article) {
            this.setCenterByArticle(this.article, to);
        }
    }

    onZoomOut (from, to) {
        if (this.option.debug) {
            console.log('zoomOut', {from: from, to: to});
        }

        if (this.article) {
            this.setCenterByArticle(this.article, to);
        }
    }

    addMarker (position) {
        var self = this;
        var marker = new google.maps.Marker({
            position: position,
            map: this.map,
            title: 'Hello World!'
        });

        marker.addListener('click', function() {
            self.currentMarker = this;
            $('#open-article').click();
        });
    }

    setCenterByArticle (article, zoom) {
        var origin = article.markerPosition;
        var range = article.beforeZoom - zoom;
        var length = 0 - (article.pointLength * Math.pow(2, range));
        var heading = article.pointHeading;
        var position = google.maps.geometry.spherical.computeOffset(origin, length, heading);
        this.map.setCenter(position);
    }

    rad (x) {
        return x * Math.PI / 180;
    }

    getDistance (p1, p2) {
        console.log([p1.lat(),p2.lat(),p1.lng(),p2.lng()]);
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.lat() - p1.lat());
        var dLong = this.rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    }

    getPadBounds (top, right, bottom, left, zoom) {
        top = (('' + top).match(/^[0-9\.]+$/i) ? parseInt(top) : 0);
        right = (('' + right).match(/^[0-9\.]+$/i) ? parseInt(right) : 0);
        bottom = (('' + bottom).match(/^[0-9\.]+$/i) ? parseInt(bottom) : 0);
        left = (('' + left).match(/^[0-9\.]+$/i) ? parseInt(left) : 0);
    
        var zoom = zoom || this.map.getZoom();
        var bounds = this.map.getBounds();
        var scale = Math.pow(2, zoom);
        var proj = this.map.getProjection();

        var sw = proj.fromLatLngToPoint(bounds.getSouthWest());
        var ne = proj.fromLatLngToPoint(bounds.getNorthEast());
        sw = new google.maps.Point(
            ((sw.x * scale) + right) / scale,
            ((sw.y * scale) - top) / scale
        );
        ne = new google.maps.Point(
            ((ne.x * scale) - left) / scale,
            ((ne.y * scale) + bottom) / scale
        );
        var rect = new google.maps.LatLngBounds(proj.fromPointToLatLng(sw), proj.fromPointToLatLng(ne));
        

        // // Debug: show rectangle
        // new google.maps.Rectangle({
        //     bounds: rect,
        //     map: this.map
        // });
    
        return rect;
    }

    showArticle () {
        if (!this.currentMarker) {
            if (this.option.debug) {
                console.error('Target marker is not defined');
            }
            return;
        }

        var currentCenter = this.map.getCenter();
        var currentZoom = this.map.getZoom();
        var marker = this.currentMarker;
        var markerPosition = marker.getPosition();

        this.map.setCenter(markerPosition);
        
        this.map.setOptions({
            gestureHandling: 'none'
        });

        var padding = this.mapElement.clientHeight * this.option.articleRatioHeight;
        var bounds = this.getPadBounds(0, 0, padding, 0);
        var articleCenter = bounds.getCenter();
        this.map.panTo(articleCenter);

        this.article = {
            marker: marker,
            markerPosition: markerPosition,
            beforeZoom: currentZoom,
            beforeCenter: currentCenter,
            mapCenter: articleCenter,
            pointLength: google.maps.geometry.spherical.computeLength([articleCenter, markerPosition]),
            pointHeading: google.maps.geometry.spherical.computeHeading(articleCenter, markerPosition)
        };
    }

    hideArticle () {
        if (!this.article) {
            if (this.option.debug) {
                console.error('Article is not defined');
            }
            return;
        }

        this.map.setOptions({
            gestureHandling: 'greedy'
        });
        this.map.setZoom(this.article.beforeZoom);
        this.map.panTo(this.article.beforeCenter);
        this.article = null;
    }
}
