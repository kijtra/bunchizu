export default function () {
    return new Swiper('.swiper-container', {
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
        },

        on: {
            init: function (e) {
                var i, l;
                for (i = 0, l = this.$el.length; i < l; i++) {
                    this.$el[i].classList.add('ready');
                }
                this.resizeTimer = null;
            },
            tap: function (e) {
                var self = this;
                for (i in this.params.breakpoints) {
                    if (document.body.clientWidth < i) {
                        if (this.clickedIndex !== this.activeIndex) {
                            this.slideTo(this.clickedIndex);
                        }
                    }
                    break;
                }
            }
        }
    });
}
