cc.Class({
    extends: cc.Component,

    properties: {
        imgIcon: cc.Sprite,
        txtCount: cc.Label,
    },

    onLoad: function () {

    },

    SetInfo(info, idx){
        // hxjs.module.asset.LoadAtlasSprite('items', info['icon'], this.imgIcon);
        // /LoadAtlasSprite:function (atlasName, imgName, obj) {
        hxjs.module.asset.LoadAtlasSprite('comn_item',info['icon'], this.imgIcon);
        this.txtCount.string = 'x' + info['count'];
    }
});
