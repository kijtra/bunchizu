import Swiper from 'swiper';
// const Swiper = require('swiper').default;

export default class Cards {
    constructor () {
        this.options = {
            loop:true,
    
            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
    
            spaceBetween: 20,
            slidesPerView: 3,
    
            centeredSlides: true,
    
            breakpoints: {
                576: {
                    autoHeight: true,
                    slidesPerView: 'auto'
                },
    
                768: {
                    spaceBetween: 50,
                    slidesPerView: 2
                },
    
                992: {
                    spaceBetween: 20,
                    slidesPerView: 2
                }
            }
        };

        this.el = Uni.el.get('mapCards');
        this.swiper = null;
    }

    init () {
        this.el.setAttribute('aria-hidden', 'true');
        let container = this.el.querySelector('.swiper-container');

        let options = this.options;
        options.on = {
            init: this.onInit_,
            tap: this.onTap_
        };

        this.swiper = new Swiper(container, options);
    }

    onInit_ () {
        let i, l;
        for (i = 0, l = this.$el.length; i < l; i++) {
            this.$el[i].classList.add('ready');
        }
        this.resizeTimer = null;
    }

    onTap_ () {
        let self = this, i;
        for (i in this.params.breakpoints) {
            if (document.body.clientWidth < i) {
                if (this.clickedIndex !== this.activeIndex) {
                    this.slideTo(this.clickedIndex);
                }
            }
            break;
        }
    }

    toggle () {
        var state = this.el.getAttribute('aria-hidden');
        if ('true' === state) {
            this.el.setAttribute('aria-hidden', 'false');
        } else {
            this.el.setAttribute('aria-hidden', 'true');
        }
    }
}
