export default class {
    constructor (element) {
        var self = this;

        this.currentCenter = {lat: -25.363, lng: 131.044};
        this.currentZoom = 4;
        this.showedArticle = false;
        this.currentMarker = null;

        this.map = new google.maps.Map(element, {
            zoom: this.currentZoom,
            center: this.currentCenter,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            rotateControl: false,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
          //   mapTypeControlOptions: {
          //     position: google.maps.ControlPosition.LEFT_BOTTOM
          //     },
        });
        this.mapObj = $(element);

        this.addMarker(this.currentCenter);

        this.map.addListener('zoom_changed', function(e) {
            if (self.showedArticle) {
                // var proj = self.map.getProjection();
                var rect = self.getPadBounds(self.mapObj.height() * 0.7,0,0,0);
                var oldPos = self.currentMarker.getPosition();
                var newPos = rect.getCenter();
                var center = self.map.getCenter();
                var zoom = self.map.getZoom();
                var len = google.maps.geometry.spherical.computeLength([oldPos,newPos]);
                len = 0 - len;
                var heading = google.maps.geometry.spherical.computeHeading(oldPos, newPos);
                
                var panPos = google.maps.geometry.spherical.computeOffset(center, len, heading);
                // self.addMarker(panPos);
                self.map.setCenter(panPos);
            }

            self.currentZoom = self.map.getZoom();
        });

        
        $('#open-article').on('change', function () {
            if ($(this).is(':checked')) {
                self.showArticle();
            } else {
                self.hideArticle();
            }
        });
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

    getPadBounds (top, right, bottom, left) {
        top = (('' + top).match(/^[0-9\.]+$/i) ? parseInt(top) : 0);
        right = (('' + right).match(/^[0-9\.]+$/i) ? parseInt(right) : 0);
        bottom = (('' + bottom).match(/^[0-9\.]+$/i) ? parseInt(bottom) : 0);
        left = (('' + left).match(/^[0-9\.]+$/i) ? parseInt(left) : 0);
    
        var zoom = this.map.getZoom();
        var bounds = this.map.getBounds();
        var scale = Math.pow(2, this.map.getZoom());
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
        this.showedArticle = true;
        this.currentCenter = this.map.getCenter();

        var markerPos = this.currentMarker.getPosition();
        this.map.setCenter(markerPos);
        
        this.map.setOptions({
            gestureHandling: 'none'
        });
        var pad = this.mapObj.height() * 0.7;
        var bounds = this.getPadBounds(0,0,pad,0);
        var panPoint = bounds.getCenter();
        this.map.panTo(panPoint);
        
        
        var proj = this.map.getProjection();
        this.currentMarkerPos = proj.fromLatLngToPoint(markerPos);
    }

    hideArticle () {
        this.showedArticle = false;
        this.map.setOptions({
            gestureHandling: 'greedy'
        });
        if (this.currentCenter) {
            this.map.panTo(this.currentCenter);
        }
    }
}
