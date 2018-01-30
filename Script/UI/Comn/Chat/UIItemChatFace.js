
cc.Class({
    extends: require('UIPanelItem'),

    properties: {
        img:cc.Sprite,
    },

    onLoad: function () {
        this.OnInit();
    },

    SetInfo(info, idx, callback){ 
        this.SetInfoBase(idx, callback);
        hxjs.module.asset.LoadAtlasSprite("emoticon",info, this.img);
    },
});