
cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        playerName:cc.Label,
        txt:cc.Label,  
    },

    onLoad: function () { 
    },

    SetInfo(info){  
        this.playerName.string = info['name'];
        this.txt.string = info['text'];
        var strAvatar =info['icon'];
        if( strAvatar.indexOf['icon'] == 0){
            hxjs.module.asset.LoadAtlasSprite(this.GetAtalas(strAvatar), strAvatar, this.imgAvatar);
        }
        else{
            hxjs.module.asset.LoadNetImg(strAvatar,this.imgAvatar);
        }
    },
});