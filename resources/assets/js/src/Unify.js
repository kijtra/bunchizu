import Elements from './Elements';
import Schema from './Schema';
import Map from './Map';

export default class Unify {
    constructor () {
        this.el_ = null;
        this.schema_ = null;
        this.Map_ = null;
    }

    get el () {
        if (!this.el_) {
            this.el_ = new Elements();
        }
        return this.el_;
    }

    get schema () {
        if (!this.schema_) {
            this.schema_ = new Schema();
        }
        return this.schema_;
    }

    get Map () {
        if (!this.Map_) {
            this.Map_ = new Map();
        }
        return this.Map_;
    }
}
