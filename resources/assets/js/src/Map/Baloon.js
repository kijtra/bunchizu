/**
 * https://github.com/googlemaps/v3-utility-library/tree/master/infobox
 */
module.exports = class Baloon extends AbstractInfoBox {
    constructor(conf) {
        super();
        opt_opts = conf || {};

        this.boxClass_ = opt_opts.boxClass || "infobox";
        this.innerClass_ = opt_opts.innerClass || "infobox-inner";

        this.contentBefore_ = '<button class="close"><i class="material-icons">&#xE5CD;</i></button>';
        this.contentAfter_ = '';
    }
}
