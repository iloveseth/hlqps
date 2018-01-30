
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () { 
    },

    SetInfo(info, idx, callback){  
        this.node.stopAllActions();
        var chatMsg= info.get('chatMsg');
        var playerId = info.get('playerId');
        var timeSpit =chatMsg.indexOf('|');
        var time = chatMsg.substring(0,timeSpit);
        var fileID = chatMsg.substring(timeSpit+1);
       
        cc.info('@@record time'+time); 
        hxfn.bridge.PlayRecord(fileID);
        this.scheduleOnce(function(){
            this.hiddenSelf();
         }.bind(this), time/1000);
       
    },
    hiddenSelf:function(){
        hxjs.module.ui.hub.HideCom(this.node);
    }
});