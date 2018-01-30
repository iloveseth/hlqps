cc.Class({
    extends: cc.Component,

    properties: {
        scrollGameplay: cc.ScrollView,
    },

    onLoad: function () {

    },

    SetInfo (games) {
        //
        // var items = [{gold:300, cost:30},{gold:2000, cost:198},{gold:3500, cost:328}];
        let s = this.scrollGameplay.node.getComponent('UIScrollView');
        cc.log('adsadsadsadsadsadadsadsad games.lenght: ' + games.length);
        s.populateList(games);
        s.setScrollEnabled (false);
    }
});