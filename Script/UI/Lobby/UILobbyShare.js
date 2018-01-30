import { hxfn } from '../../FN/HXFN';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        btnGroup:require('UIGroup'),
    },

    // use this for initialization
    onLoad: function () {
        this.OnInit('分享');//'ui_lobby_fn_close', 
        this.btnGroup.SetInfo(this.ShareWeb.bind(this));
    },

    ShareWeb(idx){
        // 0 会话， 1 朋友圈
        if (idx === 0) {
            this.WxPubShare();
            return;
        }

        this.WxTimelineShare();
        return;
        // hxfn.http.SaveNetImage('http://qr.liantu.com/api.php?text=x','share.png',function(name){

        // }.bind(this));
        
    },
    //微信公众号分享
    WxPubShare() {
        let openWxUrl = hxfn.role.curUserData.wxShareUrl.pubShareUrl;
        let finalUrl = openWxUrl + hxfn.role.curRole.playerId + "#wechat_redirect";

        hxfn.bridge.shareType = 0;
        hxfn.bridge.WXShareWeb(0,'欢乐棋牌室-最刺激的牛牛玩法','玩法最全，体验超燃，快加入能创造财富的棋牌游戏！',finalUrl,'respath');
        return;
    },

    //微信朋友圈分享
    WxTimelineShare() {
        // let url = hxfn.role.curUserData.wxShareUrl.timelineUrl;
        // if (hxfn.role.curRole.inviteId) {
        //     url += '?nick_name=' + hxfn.role.curRole.nickName;
        //     url += ("&id=" + hxfn.role.curRole.inviteId);
        // }
        //
        // let encodeUrl = encodeURI(url);
        let openWxUrl = hxfn.role.curUserData.wxShareUrl.pubShareUrl;
        let finalUrl = openWxUrl + hxfn.role.curRole.playerId + "#wechat_redirect";
        hxfn.bridge.shareType = 1;
        hxfn.bridge.WXShareWeb(1,'欢乐棋牌室-最刺激的牛牛玩法','玩法最全，体验超燃，快加入能创造财富的棋牌游戏！',finalUrl,'respath');
        //欢乐棋牌室下载送元宝
    },

    //普通微信消息分享
    WxMessageShare() {
        let url = hxfn.role.curUserData.wxShareUrl.timelineUrl;
        if (hxfn.role.curRole.inviteId) {
            url += '?nick_name=' + hxfn.role.curRole.nickName;
            url += ("&id=" + hxfn.role.curRole.inviteId);
        }

        let encodeUrl = encodeURI(url);
        hxfn.bridge.shareType = 1;
        hxfn.bridge.WXShareWeb(0,'欢乐棋牌室-最刺激的牛牛玩法','玩法最全，体验超燃，快加入能创造财富的棋牌游戏！',encodeUrl,'respath');
        return;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
