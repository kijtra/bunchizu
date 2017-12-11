// import Swiper from 'swiper';
// import Swiper from 'vue-swiper'
const Swiper = require('swiper').default;

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

        let me = this;

        this.items = null;

        let json = Uni.el.get('mapItems');
        json = JSON.parse(json.innerText);
        this.json = json.itemListElement;

        this.el = Uni.el.get('mapCards');
        this.swiper = null;
    }

    init () {
        var me = this;
        this.vue = new Vue({
            el: this.el,
            // components: {Swiper},
            data: {
                cards: []
            },
            mounted () {
                me.el.setAttribute('aria-hidden', 'false');

                let container = me.el.querySelector('.swiper-container');
                
                let swiperOptions = me.options;
                swiperOptions.on = {
                    init: me.onInit_,
                    tap: me.onTap_
                };

                let bounds = new google.maps.LatLngBounds();
                let items = me.getItems_();
                let i, l = items.length, item, marker;
                for (i = 0; i < l; i++) {
                    item = items[i];

                    // me.vue.cards.push(item);

                    bounds.extend(new google.maps.LatLng(item.point));
                    marker = Uni.Map.addMarker(item.point);

                    if (i + 1 >= l) {
                        Uni.Map.map.fitBounds(bounds);
                        console.log('itemed');
                        me.swiper = new Swiper(container, swiperOptions);
                        container.classList.add('ready');
                        // this.swiper.reInit();
                    }
                }
            }
        });
    }

    getItems_ () {
        if (this.items) {
            return this.items;
        }

        this.items = [];
        let i, l = this.json.length, item, data;
        for (i = 0; i < l; i++) {
            item = this.json[i].item;
            data = {
                name: item.name,
                addr: item.address.addressLocality + item.address.streetAddress,
                point: {
                    lat: parseFloat(item.geo.latitude),
                    lng: parseFloat(item.geo.longitude)
                }
            };
            this.items.push(data);
        }
        return this.items;
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
