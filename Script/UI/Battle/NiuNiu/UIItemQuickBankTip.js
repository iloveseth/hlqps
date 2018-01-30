cc.Class({
    extends: cc.Component,

    properties: {
        imgNo: cc.Node,
        imgYesBg: cc.Node,
        img1: cc.Node,
        img2: cc.Node,
        img3: cc.Node,
        img4: cc.Node,
    },

    onLoad: function () {
        this.imgNo.active = false;
        this.imgYesBg.active = false;
        this.img1.active = false;
        this.img2.active = false;
        this.img3.active = false;
        this.img4.active = false;
    },

    SetInfo (id, idx = -1) {
        //reset
        this.imgNo.active = false;
        this.imgYesBg.active = false;
        this.img1.active = false;
        this.img2.active = false;
        this.img3.active = false;
        this.img4.active = false;

        switch (id) {
            case 0:
            this.imgNo.active = true;

            this.imgYesBg.active = false;
            this.img1.active = false;
            this.img2.active = false;
            this.img3.active = false;
            this.img4.active = false;
            break;
            case 1:
            this.imgNo.active = false;
            this.imgYesBg.active = true;
            this.img1.active = true;
            this.img2.active = false;
            this.img3.active = false;
            this.img4.active = false;
            break;
            case 2:
            this.imgNo.active = false;
            this.imgYesBg.active = true;
            this.img1.active = false;
            this.img2.active = true;
            this.img3.active = false;
            this.img4.active = false;
            break;
            case 3:
            this.imgNo.active = false;
            this.imgYesBg.active = true;
            this.img1.active = false;
            this.img2.active = false;
            this.img3.active = true;
            this.img4.active = false;
            break;
            case 4:
            this.imgNo.active = false;
            this.imgYesBg.active = true;
            this.img1.active = false;
            this.img2.active = false;
            this.img3.active = false;
            this.img4.active = true;
            break;

            default:
                break;
        }
    }
});