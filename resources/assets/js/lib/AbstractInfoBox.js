/**
 * https://github.com/googlemaps/v3-utility-library/tree/master/infobox
 */
module.exports = class extends google.maps.OverlayView {
    constructor(conf) {
        super();
        conf = conf || {};

        google.maps.OverlayView.apply(this, arguments);

        // Standard options (in common with google.maps.InfoWindow):
        this.maxWidth_ = conf.maxWidth || 0;
        this.maxHeight_ = conf.maxHeight || 0;
        this.pixelOffset_ = conf.pixelOffset || new google.maps.Size(0, 0);
        this.zIndex_ = conf.zIndex || null;

        this.content_ = conf.content || "";
        this.position_ = conf.position || new google.maps.LatLng(0, 0);
        this.marker_ = null;

        // Additional options (unique to InfoBox):
        this.boxClass_ = conf.boxClass || "";
        this.innerClass_ = conf.innerClass || "";

        this.infoBoxClearance_ = conf.infoBoxClearance || new google.maps.Size(1, 1);

        if (typeof conf.visible === 'undefined') {
            if (typeof conf.isHidden === 'undefined') {
                conf.visible = true;
            } else {
                conf.visible = !conf.isHidden;
            }
        }

        this.isHidden_ = !conf.visible;

        this.alignBottom_ = conf.alignBottom || false;
        this.pane_ = conf.pane || 'floatPane';

        this.box_ = null;
        this.boxInner_ = null;
        this.closeListeners_ = null;
        this.moveListener_ = null;
        this.mapListener_ = null;
        this.fixedWidthSet_ = null;

        this.contentBefore_ = '';
        this.contentAfter_ = '';
    }

    createInfoBox_(content) {
        if (this.box_) {
            return;
        }

        this.createBoxElement_();
        this.setBoxContent_(this.content_);

        // Add the InfoBox DIV to the DOM
        this.getPanes()[this.pane_].appendChild(this.box_);

        var projection = this.getProjection();
        var width = this.box_.style.width;
        var height = this.box_.style.height;
        var sizes;

        if (width) {
            this.fixedWidthSet_ = true;
            width = parseFloat(width.replace(/[^\d]+/g, ''));
        } else {
            if (this.maxWidth_ !== 0 && this.box_.offsetWidth > this.maxWidth_) {
                width = this.maxWidth_;
                this.fixedWidthSet_ = true;
            } else { // The following code is needed to overcome problems with MSIE
                sizes = this.getElementWidths_(this.box_);
                width = (this.box_.offsetWidth - sizes.left - sizes.right);
                this.fixedWidthSet_ = false;
            }
        }
        console.log(height);
        if (height) {
            height = parseFloat(height.replace(/[^\d]+/g, ''));
        } else {
            if (this.maxHeight_ !== 0 && this.box_.offsetHeight > this.maxHeight_) {
                height = this.maxHeight_;
            } else { // The following code is needed to overcome problems with MSIE
                if (!sizes) {
                    sizes = this.getElementWidths_(this.box_);
                }
                height = (this.box_.offsetHeight - sizes.top - sizes.bottom);
            }
        }

        this.box_.style.width = width + 'px';
        // this.box_.style.height = height + 'px';

        // this.panBox_();
        this.box_.style.marginLeft = (0 - (width / 2)) + 'px';

        if (this.marker_) {
            var offsetY = this.marker_.height + height;
            this.box_.style.marginTop = '-' + offsetY + 'px';
        }

        google.maps.event.trigger(this, 'domready');
    }

    createBoxElement_() {
        var box = document.createElement('div');
        box.setAttribute('class', this.boxClass_);
        box.style.cssText = '';
        box.style.WebkitTransform = 'translateZ(0)';
        box.style.transform = 'translateZ(0)';
        box.style.position = 'absolute';
        box.style.visibility = 'hidden';
        if (this.zIndex_ !== null) {
            box.style.zIndex = this.zIndex_;
        }

        this.box_ = box;

        return box;
    }

    setBoxContent_(content) {
        var self = this;
        var i, l;

        this.removeCloseHandler_();

        // Odd code required to make things work with MSIE.
        if (!this.fixedWidthSet_) {
            this.box_.style.width = '';
        }

        if (typeof content.nodeType === 'undefined') {
            var html = this.contentBefore_;
            html += '<div class="' + this.innerClass_ + '">';
            html += content;
            html += '</div>';
            html += this.contentAfter_;
            this.box_.innerHTML = html;
        } else {
            var inner = document.createElement('div');
            inner.setAttribute('class', this.innerClass_);
            inner.appendChild(content);
            this.box_.innerHTML = this.contentBefore_;
            this.box_.appendChild(inner);
            this.box_.innerHTML = this.box_.innerHTML + this.contentAfter_;
        }

        var closes = this.box_.querySelectorAll('.close');
        if (closes.length) {
            this.closeListeners_ = [];
            var closeHandle = function (e) {
                e.cancelBubble = true;
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                google.maps.event.trigger(self, 'closeclick');
                self.close();
            };
            for (i = 0, l = closes.length; i < l; i++) {
                this.closeListeners_.push(google.maps.event.addDomListener(closes[i], 'click', closeHandle));
            }
        }
    }

    removeCloseHandler_() {
        if (this.closeListener_) {
            google.maps.event.removeListener(this.closeListener_);
            this.closeListener_ = null;
        }

        if (this.closeListeners_) {
            for (i = 0, l = this.closeListeners_.length; i < l; i++) {
                google.maps.event.removeListener(this.closeListeners_[i]);
            }
            this.closeListeners_ = null;
        }
    }

    panBox_() {
        var map = this.getMap();

        // Only pan if attached to map, not panorama
        if (!map instanceof google.maps.Map) {
            return;
        }

        if (!map.getBounds().contains(this.position_)) {
            // Marker not in visible area of map, so set center
            // of map to the marker position first.
            map.setCenter(this.position_);
        }

        var xOffset = 0,
            yOffset = 0;
        var bounds = map.getBounds();

        var mapDiv = map.getDiv();
        var mapWidth = mapDiv.offsetWidth;
        var mapHeight = mapDiv.offsetHeight;
        var iwOffsetX = this.pixelOffset_.width;
        var iwOffsetY = this.pixelOffset_.height;
        var iwWidth = this.box_.offsetWidth;
        var iwHeight = this.box_.offsetHeight;
        var padX = this.infoBoxClearance_.width;
        var padY = this.infoBoxClearance_.height;
        var pixPosition = this.getProjection().fromLatLngToContainerPixel(this.position_);

        if (pixPosition.x < (-iwOffsetX + padX)) {
            xOffset = pixPosition.x + iwOffsetX - padX;
        } else if ((pixPosition.x + iwWidth + iwOffsetX + padX) > mapWidth) {
            xOffset = pixPosition.x + iwWidth + iwOffsetX + padX - mapWidth;
        }

        if (this.alignBottom_) {
            if (pixPosition.y < (-iwOffsetY + padY + iwHeight)) {
                yOffset = pixPosition.y + iwOffsetY - padY - iwHeight;
            } else if ((pixPosition.y + iwOffsetY + padY) > mapHeight) {
                yOffset = pixPosition.y + iwOffsetY + padY - mapHeight;
            }
        } else {
            if (pixPosition.y < (-iwOffsetY + padY)) {
                yOffset = pixPosition.y + iwOffsetY - padY;
            } else if ((pixPosition.y + iwHeight + iwOffsetY + padY) > mapHeight) {
                yOffset = pixPosition.y + iwHeight + iwOffsetY + padY - mapHeight;
            }
        }

        if (!(xOffset === 0 && yOffset === 0)) {
            // Move the map to the shifted center.
            var c = map.getCenter();
            map.panBy(xOffset, yOffset);
        }
    }

    getElementWidths_(element) {
        var widths = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };

        var style;
        if (document.defaultView && document.defaultView.getComputedStyle) {
            style = element.ownerDocument.defaultView.getComputedStyle(element, '');
        } else if (document.documentElement.currentStyle) { // MSIE
            style = element.currentStyle;
        }

        if (style) {
            widths.top = parseInt(style.borderTopWidth, 10) || 0;
            widths.bottom = parseInt(style.borderBottomWidth, 10) || 0;
            widths.left = parseInt(style.borderLeftWidth, 10) || 0;
            widths.right = parseInt(style.borderRightWidth, 10) || 0;
        }

        return widths;
    }

    onRemove() {
        if (this.box_) {
            this.box_.parentNode.removeChild(this.box_);
            this.box_ = null;
        }
    }

    draw() {
        this.createInfoBox_();
        var box = this.box_;

        var pixPosition = this.getProjection().fromLatLngToDivPixel(this.position_);

        box.style.left = (pixPosition.x + this.pixelOffset_.width) + 'px';

        if (this.alignBottom_) {
            box.style.bottom = -(pixPosition.y + this.pixelOffset_.height) + 'px';
        } else {
            box.style.top = (pixPosition.y + this.pixelOffset_.height) + 'px';
        }

        if (this.isHidden_) {
            box.style.visibility = 'hidden';
        } else {
            box.style.visibility = 'visible';
        }
    }

    setOptions(conf) {
        if (typeof conf.content !== 'undefined') {
            this.setContent(conf.content);
        }
        if (typeof conf.disableAutoPan !== 'undefined') {
            this.disableAutoPan_ = conf.disableAutoPan;
        }
        if (typeof conf.maxWidth !== 'undefined') {
            this.maxWidth_ = conf.maxWidth;
        }
        if (typeof conf.pixelOffset !== 'undefined') {
            this.pixelOffset_ = conf.pixelOffset;
        }
        if (typeof conf.alignBottom !== 'undefined') {
            this.alignBottom_ = conf.alignBottom;
        }
        if (typeof conf.position !== 'undefined') {
            this.setPosition(conf.position);
        }
        if (typeof conf.zIndex !== 'undefined') {
            this.setZIndex(conf.zIndex);
        }
        if (typeof conf.infoBoxClearance !== 'undefined') {
            this.infoBoxClearance_ = conf.infoBoxClearance;
        }
        if (typeof conf.isHidden !== 'undefined') {
            this.isHidden_ = conf.isHidden;
        }
        if (typeof conf.visible !== 'undefined') {
            this.isHidden_ = !conf.visible;
        }

        if (this.box_) {
            this.draw();
        }
    }

    setContent(content) {
        this.content_ = content;

        if (this.box_) {
            if (!this.fixedWidthSet_) {
                this.box_.style.width = this.box_.offsetWidth + 'px';
            }
            this.setBoxContent_(content);
        }

        google.maps.event.trigger(this, 'content_changed');
    }

    setPosition(latlng) {
        this.position_ = latlng;

        if (this.box_) {

            this.draw();
        }

        google.maps.event.trigger(this, 'position_changed');
    }

    setVisible(isVisible) {
        this.isHidden_ = !isVisible;
        if (this.box_) {
            this.box_.style.visibility = (this.isHidden_ ? 'hidden' : 'visible');
        }
    }

    getContent() {
        return this.content_;
    }

    getPosition() {
        return this.position_;
    }

    getZIndex() {
        return this.zIndex_;
    }

    getVisible() {
        var isVisible;

        if ((typeof this.getMap() === 'undefined') || (this.getMap() === null)) {
            isVisible = false;
        } else {
            isVisible = !this.isHidden_;
        }
        return isVisible;
    }

    show() {
        this.isHidden_ = false;
        if (this.box_) {
            this.box_.style.visibility = 'visible';
        }
    }

    hide() {
        this.isHidden_ = true;
        if (this.box_) {
            this.box_.style.visibility = 'hidden';
        }
    }

    open(map, marker) {
        var self = this;

        if (marker) {
            this.position_ = marker.getPosition();
            this.marker_ = marker;
            this.moveListener_ = google.maps.event.addListener(
                marker,
                'position_changed',
                function () {
                    self.setPosition(this.getPosition());
                }
            );

            this.mapListener_ = google.maps.event.addListener(
                marker,
                'map_changed',
                function () {
                    self.setMap(this.map);
                }
            );
        }

        this.setMap(map);

        if (this.box_) {
            this.panBox_();
        }
    }

    close() {
        this.removeCloseHandler_();

        if (this.moveListener_) {
            google.maps.event.removeListener(this.moveListener_);
            this.moveListener_ = null;
        }

        if (this.mapListener_) {
            google.maps.event.removeListener(this.mapListener_);
            this.mapListener_ = null;
        }

        this.setMap(null);
    }
}
