module.exports = class Marker extends google.maps.Marker {
    constructor(conf) {
        super();

        this.icon = 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png';
        this.width = 22;
        this.height = 40;
        conf = conf || new google.maps.MarkerOptions();
        conf.icon = this.icon;
        google.maps.Marker.apply(this, [conf]);
    }

    getHeight() {
        return this.height;
    }
}
