function Coin(typ) {
    Object.defineProperties(this, {
        /**
         * @property {Number} id - 可能的值为 1 到 2, 总共有2种货币，金币和元宝
         */
        id: {
            value: typ,
            writable: false
        },
        name: {
            get: function () {
                return A2_10JQK[this.point];
            }
        },
        icon: {
            get: function () {
                return 'icon_coin_' + typ;
            }
        }
    });
}