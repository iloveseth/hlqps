cc.Class({
    extends: cc.Component,

    properties: {
        imgIcon:cc.Sprite,
        imgTxt:cc.Label,
    },

    onLoad: function () {

    },

    //attachType
    SetInfo(info, idx){
        var iconAsset = hxfn.comn.GetItemIcon(info.get('attachType'));
        hxjs.module.asset.LoadAtlasSprite('comn_item', iconAsset, this.imgIcon);
        
        this.imgTxt.string = 'x' + info.get('itemCount');
        cc.log(this.imgTxt.string);
    },
});