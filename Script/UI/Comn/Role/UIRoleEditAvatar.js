import {hxjs} from "../../../../HXJS/HXJS";
import {hxfn} from "../../../FN/HXFN";

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        //用户操作
        btnClose: {
            default: null,
            type: cc.Button,
            override: true,
        },


        conAvatars: require('UIGroup'),
        btnConfirm: require('UIButton'),

        selectIdx: 1,
        icon: null,
        avatars:[cc.Sprite],
    },

    onLoad: function () {
        this.OnInit('修改头像');
        // var userAllData = hxfn.role.curUserData;
        // var murl = userAllData.playerData.playerIcon;
        // hxjs.module.asset.LoadSprite(murl,this.imgAvatar);
        // this.conAvatar.SetInfo(hxfn.role.curUserData.playerData);
        //
        // this.btnUpload.SetInfo(function(){hxfn.bridge.OpenCamera()},'本地上传');
        // this.btnSelectPic.SetInfo(function(){hxfn.bridge.OpenAlbum()},'选择图片');
        this.conAvatars.SetInfo(this.SelectAvatar.bind(this));
        this.conAvatars.SetDefaultIdx(this.selectIdx);

        this.btnConfirm.SetInfo(this.ConfirmAvatar.bind(this));

        this.icon = hxfn.role.curUserData.playerData.playerIcon;

        this.LoadAvatars();
    },

    SelectAvatar(idx){
        cc.log('selectavatar');
        cc.log(idx);
        this.selectIdx = idx;
        this.icon = idx + 1;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    ConfirmAvatar(){
        var postData = {
            icon: this.icon + '',
            //nickName:this.iptName.string,
            // icon
        };
        hxfn.netrequest.Req_Comn(
            postData,
            hxfn.netrequest.Msg_SetPlayerInfo,
            function(msg){
                if(!hxfn.comn.HandleServerResult(msg.result))//设置成功：修改本地全局变量并退出
                {
                    hxfn.role.curUserData.playerData.playerIcon = this.icon + '';
                    hxjs.util.Notifier.emit('Role_Update');
                    hxjs.module.ui.hub.Unload (this.node);
                }
            }.bind(this)
        );
    },

    LoadAvatars(){
        let atlasName = 'avatars_self';
        for(var idx = 1;idx<= 20; ++idx){
            hxjs.module.asset.LoadAtlasSprite(atlasName,idx + '', this.avatars[idx - 1]);
        }
    }
});
