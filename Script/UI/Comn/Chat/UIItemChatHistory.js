
cc.Class({
    extends: cc.Component,

    properties: { 
        leftPanel:require('UIItemChatHistorySmall'),
        rightPanel:require('UIItemChatHistorySmall'),
    },

    onLoad: function () { 
    },

    SetInfo(info, idx, callback){  
        if(info['playerId']==hxfn.role.playerId){
            this.leftPanel.node.active=false;
            this.rightPanel.node.active=true;
            this.rightPanel.SetInfo(info);
        }
        else{
            this.leftPanel.node.active=true;
            this.rightPanel.node.active=false;
            this.leftPanel.SetInfo(info);
        }
        
    },
});