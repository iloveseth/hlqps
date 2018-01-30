cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        
        uiItemRoomInfo: require('UIItemRoomInfo'),
        
        btnInvite:require('UIButton'),

        // [nondisplay]
        hasInit:false,
    },

    // use this for initialization
    onLoad: function () {

        this.btnInvite.SetInfo(this.InviteFriend.bind(this));
    },

    OnInit(){
        if(!this.hasInit) {
            this.hasInit = true;

            //TODO:初始化
            //roomId 得到所有房间相关信息
            // this.uiItemRoomInfo.SetInfo(hxfn.battle.curRoom);
            
            this.uiItemRoomInfo.SetInfoV();
        }
    },

    //特殊牌型，特殊倍数，抢庄加倍，闲家加倍
    InviteFriend(){
        var urlStr = 'http://agent.jzsddh.com/share/agentshare.html?nick_name=aaa&id=123&roomId=123456';
        var url = urlStr.replace(/123/,hxfn.role.curRole.playerId).replace(/aaa/,hxfn.role.curRole.nickName).replace(/123456/,this.GetRoomId());
        cc.log(url);
        var encodeUrl = encodeURI(url);
        // var contentStr1 = '房号: ' + this.GetRoomId() + ','  + '拼十' +'/' + '看牌抢庄' + '\n';
        var contentStr1 = '房号:' + this.GetRoomId() + ','  + hxfn.map.GetGameplayName(hxfn.map.curGameTypId) +'/' + hxfn.map.GetGameModeName(hxfn.battle_pinshi.qiangzhuangmodel)  + '\n';
        var contentStr2 = '底分' + hxfn.map.curRoom['difen'] + ',' + hxfn.map.curRoom['enterLimit'] + '进,' + hxfn.map.curRoom['leftLimit'] + '出' + '\n';
        var contentStr3 = (hxfn.battle_pinshi.haveSpecmodel?'特殊牌型,':'') + (hxfn.battle_pinshi.isCrazyBet?'特殊倍数,':'')+  this.GetMultDesc();
        var contentStr = contentStr1 + contentStr2 + contentStr3;
        if(contentStr.charAt(contentStr.length - 1) == '\n'){
            contentStr = contentStr.substring(0,contentStr.length - 1);
        }
        if(contentStr.charAt(contentStr.length - 1) == ','){
            contentStr = contentStr.substring(0,contentStr.length - 1);
        }
        cc.log(contentStr);
        hxfn.bridge.WXShareWeb(0, '欢乐棋牌室' ,contentStr ,encodeUrl,'share.png');
    },

    GetRoomId(){
        var roomId = hxfn.map.curRoom['roomId'];
        if(!roomId){
            roomId = '';
        }
        return roomId;
    },

    GetDifen(){
        var difen = hxfn.map.curRoom['difen'];
        if(!difen){
            difen = '';
        }
        return difen;
    },

    GetEnterLimit(){
        return hxfn.map.curRoom['enterLimit'];
    },

    GetExitLimit(){
        return hxfn.map.curRoom['leftLimit'];
    },

    GetMultDesc(){
        var desc = '';
        if(hxfn.battle_pinshi.isBankerTuizhu){
            desc = '闲家加倍';
        }
        if(hxfn.battle_pinshi.isXianTuizhu){
            desc = '庄家加倍';
        }
        return desc;
    }
    
});