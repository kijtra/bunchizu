import Elements from './Elements';
import Map from './Map';

export default class Unify {
    constructor () {
        this.el_ = null;
        this.Map_ = null;
    }

    get el () {
        if (!this.el_) {
            this.el_ = new Elements();
        }
        return this.el_;
    }

    get Map () {
        if (!this.Map_) {
            this.Map_ = new Map();
        }
        return this.Map_;
    }
}
