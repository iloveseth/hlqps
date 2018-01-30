import { hxjs } from "../../../../HXJS/HXJS";

cc.Class({
    extends: cc.Component,

    properties: {
        imgRoleIcon: cc.Sprite,
        //txtRoleName: cc.Label,

        txtVIPLevel:cc.Label,

        conLogoVIP:cc.Node,

        //  by  lzh
        //男女图标
    },

    onLoad: function () {
       
    },

    SetInfo (playerInfo) {        

        var icon = playerInfo.get('playerIcon');
        var vipLevel = playerInfo.get('vipLevel');
        this.conLogoVIP.active = vipLevel > 0;
        if(this.txtVIPLevel != null){
            this.txtVIPLevel.string = vipLevel > 0 ? vipLevel : null;
        }

        //不成功时使用此候选图
        if(icon.indexOf('icon') == 0 || (parseInt(icon) > 0 && parseInt(icon) <= 20)){
            hxjs.module.asset.LoadAtlasSprite(this.GetAtalas(icon), icon, this.imgRoleIcon, null, 'icon_avatar_dummy');
        }
        else{
            hxjs.module.asset.LoadNetImg(icon,this.imgRoleIcon, 'icon_avatar_dummy');
        }
    },

    GetAtalas(icon){
        if(parseInt(icon) > 0 && parseInt(icon) <= 20){
            return 'avatars_self'
        }
        var sex = icon.substr(5,1);
        var idx = parseInt(icon.substr(7));
        if(sex === 'F' && idx >= 1 && idx < 256){
            return 'avatars_1'
        }
        if(sex === 'M' && idx >= 1 && idx <= 256 ){
            return 'avatars_2';
        }
        if(sex === 'M' && idx >= 266 && idx <= 512){
            return 'avatars_3';
        }
        if(sex === 'F' && idx >= 257 && idx <= 383){
            return 'avatars_4'
        }
        if(sex === 'M' && idx >= 513 && idx <= 641){
            return 'avatars_4'
        }
        if(sex === 'F' && idx >= 384 && idx <= 471){
            return 'avatars_5'
        }
    }
});