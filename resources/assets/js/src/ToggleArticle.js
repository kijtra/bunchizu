export default class {
    constructor() {
        this.classNames = {
            showing: 'article-showing',
            showed: 'article-show',
            hiding: 'article-hiding',
            hided: '',
        };

        this.callOnShow = [];
        this.callOnShowed = [];
        this.callOnHide = [];
        this.callOnHided = [];

        this.body = document.getElementsByTagName('body')[0];

        this.isOpen = this.body.classList.contains(this.classNames.showed);
        this.isAnimating = false;

        this.mapWrapper = document.getElementById('js-map-wrapper');
        this.mapContainer = document.getElementById('js-map-container');

        this.enabled = true;
        if (!this.mapWrapper) {
            this.enabled = false;
            return;
        }

        var me = this;
        ['transitionend', 'webkitTransitionEnd', 'mozTransitionEnd'].forEach(function (transition) {
            me.mapContainer.addEventListener(transition, function (e) {
                me.transitionEnd(e);
            }, false);
        });
    }

    listen(className) {
        if (!this.enabled) {
            return;
        }

        var me = this;
        document.querySelectorAll(className).forEach(function (element) {
            element.addEventListener('click', function (e) {
                e.preventDefault();
                me.toggle();
            }, false);
        });
    }

    toggle() {
        if (!this.enabled || this.isAnimating) {
            return;
        }

        if (!this.isOpen) {
            this.show();
        } else {
            this.hide();
        }
    }

    show() {
        if (!this.enabled || this.isOpen || this.isAnimating) {
            return;
        }

        this.isAnimating = true;

        var me = this;
        var style = this.getWrapperStyle();
        this.mapContainer.setAttribute('style', style);

        this.isOpen = true;
        this.body.classList.add(this.classNames.showing);

        if (this.callOnShow.length) {
            this.callOnShow.forEach(function (callback) {
                callback(me);
            });
        }
    }

    hide() {
        if (!this.enabled || !this.isOpen || this.isAnimating) {
            return;
        }

        this.isAnimating = true;
        this.isOpen = false;

        var me = this;
        var style = this.getWrapperStyle();
        style += 'position:absolute;';
        this.mapContainer.setAttribute('style', style);
        setTimeout(function () {
            me.body.classList.add(me.classNames.hiding);
        }, 5);

        if (this.callOnHide.length) {
            this.callOnHide.forEach(function (callback) {
                callback(me);
            });
        }
    }

    getWrapperStyle() {
        var doc = this.mapWrapper && this.mapWrapper.ownerDocument;
        if (!doc) {
            return;
        }
        var docElem = doc.documentElement;
        var rect = this.mapWrapper.getBoundingClientRect();
        var style = '';
        style += 'width:' + this.mapWrapper.offsetWidth + 'px;';
        style += 'height:' + this.mapWrapper.offsetHeight + 'px;';
        style += 'top:' + this.mapWrapper.offsetTop + 'px;';
        style += 'left:' + (rect.left + window.pageXOffset - docElem.clientLeft) + 'px;';
        return style;
    }

    transitionEnd(e) {
        var me = this;
        if (this.isOpen) {
            this.body.classList.remove(this.classNames.showing, this.classNames.hiding);
            this.body.classList.add(this.classNames.showed);

            if (this.callOnShowed.length) {
                this.callOnShowed.forEach(function (callback) {
                    callback(me);
                });
            }
        } else {
            this.body.classList.remove(
                this.classNames.showing,
                this.classNames.showed,
                this.classNames.hiding
            );

            if (this.callOnHided.length) {
                this.callOnHided.forEach(function (callback) {
                    callback(me);
                });
            }
        }

        this.mapContainer.setAttribute('style', '');
        this.isAnimating = false;
    }

    onShow(callback) {
        if ('function' !== typeof callback) {
            return;
        }
        this.callOnShow.push(callback);
    }

    onShowed(callback) {
        if ('function' !== typeof callback) {
            return;
        }
        this.callOnShowed.push(callback);
    }

    onHide(callback) {
        if ('function' !== typeof callback) {
            return;
        }
        this.callOnHide.push(callback);
    }

    onHided(callback) {
        if ('function' !== typeof callback) {
            return;
        }
        this.callOnHided.push(callback);
    }
}
