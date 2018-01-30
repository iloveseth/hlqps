
cc.Class({
    extends: cc.Component,

    properties: {
        txtMsg:cc.Label,
    },

    onLoad: function () { 
    },

    SetInfo(info, idx, callback){  
        this.node.stopAllActions();
        this.txtMsg.string = info.get('chatMsg');
        this.node.runAction( 
            cc.sequence(
                cc.fadeIn(hxdt.setting_niuniu.Anim_Chat_Dismiss_Duration),
                cc.delayTime(hxdt.setting_niuniu.Anim_Chat_Play_Duration),
                cc.fadeOut(hxdt.setting_niuniu.Anim_Chat_Dismiss_Duration),
                cc.callFunc(this.hiddenSelf,this)
            )
         );
        
       
    },
    hiddenSelf:function(){
        hxjs.module.ui.hub.HideCom(this.node);
    }
});