// import RichMarker from 'js-rich-marker/lib/richmarker';
var RichMarker = null;

export default class Marker {
    constructor(opts) {
        let self = this;

        if (!RichMarker) {
            RichMarker = require('js-rich-marker/lib/richmarker').RichMarker;
        }

        this.container = null;
        this.content = null;
        this.width = null;
        this.height = null;

        this.opts = this.buildOptions_(opts);
        this.el = this.createContainer_(this.opts.content);
        this.opts.content = this.el;

        this.richMarker = new RichMarker(this.opts);

        this.richMarker.addListener('ready', function () {
            self.width = self.el.clientWidth;
            self.height = self.el.clientHeight;
            self.el.classList.add('ready');
        });
    }

    buildOptions_ (opts) {
        if ('object' !== typeof opts) {
            opts = {};
        }

        opts.shadow = false;

        if (opts.position && !(opts.position instanceof google.maps.LatLng)) {
            opts.position = new google.maps.LatLng(opts.position);
        }

        return opts;
    }

    createContainer_ (content) {
        this.container = document.createElement('div');
        let inner1 = document.createElement('div');
        this.content = document.createElement('div');

        inner1.appendChild(this.content);
        this.container.appendChild(inner1);

        this.container.classList.add('map-marker');
        this.content.innerHTML = content || '';

        return this.container;
    }

    setContent (content) {
        this.content.innerHTML = content || '';
        this.width = this.el.clientWidth;
        this.height = this.el.clientHeight;
        this.richMarker.content_changed();
    }

    setDraggable (bool) {
        this.richMarker.setDraggable(bool);
    }

    setPosition (position) {
        if (position && !(position instanceof google.maps.LatLng)) {
            position = new google.maps.LatLng(position);
        }
        this.richMarker.setPosition(position);
    }

    setVisible (bool) {
        this.richMarker.setVisible(bool);
    }

    setZIndex (num) {
        this.richMarker.setZIndex();
    }

    addListener (name, callback) {
        this.richMarker.addListener(name, callback);
    }
}
