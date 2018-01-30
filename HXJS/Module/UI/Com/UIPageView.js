cc.Class({
    extends: cc.Component,

    properties: {
        pageView: cc.PageView,
        itemPage: cc.Prefab,
        quantityPerPage:1,
    },

    onLoad: function () {

    },

    SetInfo (items) {
        let pNum = Math.floor(items.length / this.quantityPerPage) + 1;

        for (var i = 0; i < pNum; i++) {
            var copyPage = cc.instantiate(this.itemPage);
            let scr = copyPage.getComponent('UIItemPageGameplay');
            this.pageView.addPage(copyPage);
            copyPage.x = 0;
            copyPage.y = 0;
            var pageItems = items.slice2(this.quantityPerPage * i, this.quantityPerPage);
            scr.SetInfo(pageItems);
        }
    }
});