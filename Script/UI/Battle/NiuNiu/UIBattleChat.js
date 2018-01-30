cc.Class({
    extends: cc.Component,

    properties: { 
        lstChatMsg: require('UILst'), 
        lstChatFace: require('UILst'), 
        lstChatVoice: require('UILst'), 
    },

    onLoad: function () {
        
        this.OnInit();
        hxfn.adjust.AdjustLabel(this.node);
    },

   

    OnInit:function () { 
        this.OnReset();
        
    },

    OnReset(){
        if(this.lstChatMsg)
            this.lstChatMsg.Reset(); 
        if(this.lstChatFace)
            this.lstChatFace.Reset();
        if(this.lstChatVoice)
            this.lstChatVoice.Reset(); 
    },

    OnEnd () {
        this.OnReset();
    },


    ShowChatMsg (info) { 
        var playerid = info.get('playerId');
        var idx = hxfn.battle.GetUISeatIdx(playerid); 

        if(idx == null || idx == -1) {
            cc.log('[hxjs][err] cant find player id in all battle players, pid: ' + playerid);
        }
        else {

            this.lstChatMsg.SetItem(idx, info);
        }
        
    },
    ShowChatFace (info) { 
        var playerid = info.get('playerId');
        var idx = hxfn.battle.GetUISeatIdx(playerid); 

        if(idx == null || idx == -1) {
            cc.log('[hxjs][err] cant find player id in all battle players, pid: ' + playerid);
        }
        else {

            this.lstChatFace.SetItem(idx, info);
        }
    },
    ShowChatVoice(info) { 
        var playerid = info.get('playerId');
        var idx = hxfn.battle.GetUISeatIdx(playerid); 

        if(idx == null || idx == -1) {
            cc.log('[hxjs][err] cant find player id in all battle players, pid: ' + playerid);
        }
        else {

            this.lstChatVoice.SetItem(idx, info);
        }
    },
});