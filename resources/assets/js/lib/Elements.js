class Me {
    constructor () {
        this.cached = {};
    }

    getElement_ (val) {
        let element;
        if ('string' === typeof val) {
            if ('#' === val[0]) {
                element = document.getElementById(val.substr(1));
            } else if ('.' === val[0]) {
                element = document.querySelector(val);
            }  else {
                element = document.getElementsByTagName(val)[0];
            }
        }

        if (element) {
            return element;
        }
    }

    sets (elements) {
        if ('object' !== typeof elements) {
            return;
        }

        let key, val;
        for (key in elements) {
            if (this.cached[key]) {
                continue;
            }

            if (val = this.getElement_(elements[key])) {
                this.cached[key] = val;
            }
        }
    }

    set (name, element) {
        let val;
        if (val = this.getElement_(element)) {
            this.cached[name] = val;
        }
        
    }

    get (name) {
        if (this.cached[name]) {
            return this.cached[name];
        }

        let val = this.getElement_(name);
        if (val) {
            this.cached[name] = val;
            return val;
        }
    }

    all () {
        return this.cached;
    }
}

module.exports = new Me;