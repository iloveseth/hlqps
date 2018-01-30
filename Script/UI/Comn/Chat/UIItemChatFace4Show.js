
cc.Class({
    extends: cc.Component,

    properties: {
        emotion:require('UIItemChatFaceList'),
    },

    onLoad: function () { 
    },

    SetInfo(info, idx, callback){  
        //this.imgFace.node.stopAllActions();
        //this.imgFace.node.setPosition(cc.p(0,0));
        var item =info['chatMsg'];
      
        var items = item.split("_"); 
        this.index =parseInt(items[2])-1; 
        this.emotionNode = this.emotion.getEmotion(this.index);
        cc.log('@@'+this.emotionNode );
        if(this.emotionNode!=null){
            this.emotionNode.node.active=true;
            this.emotionNode.play();
        }
        this.node.runAction( 
            cc.sequence(
                cc.delayTime(hxdt.setting_niuniu.Anim_Chat_Dismiss_Duration),
                cc.callFunc(this.hiddenSelf,this)
            )
         );
        
       
    },
    hiddenSelf:function(){
        if(this.emotionNode!=null){
            this.emotionNode.node.active=false;
        }
        hxjs.module.ui.hub.HideCom(this.node);
    }
});