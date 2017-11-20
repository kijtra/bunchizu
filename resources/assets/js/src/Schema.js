export default class Schema
{
    constructor () {
        this.datas = null;
    }

    getDatas () {
        if (null !== this.datas) {
            return this.datas;
        }

        this.datas = {};

        let els = document.querySelectorAll('script[type="application/ld+json"][data-name]');
        let l = els.length;
        if (l) {
            let i, el, name, data;
            for (i = 0, l = els.length; i < l; i++) {
                el = els[i];
                name = el.getAttribute('data-name');
                data = JSON.parse(el.innerText);
                this.datas[name] = data;
            }
        }

        return this.datas;
    }

    getData (name) {
        let datas = this.getDatas();
        if (datas.hasOwnProperty(name)) {
            return datas[name];
        }
    }
}
