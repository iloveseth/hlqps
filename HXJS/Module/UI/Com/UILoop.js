/**
 * 目前只实现了水平，向左滚动的效果
 */ 
cc.Class({
    extends: cc.Component,

    properties: {
        //isUOrV:true,
        conItem:cc.Node, 

        txtInfo:cc.Label,

        //thisSize: null, 
        contentSize:null,

        isStart:{ default: false, serializable: false, visible: false},
        msgNormal:{ default: [], serializable: false, visible: false},//永久公告，获取后不断循环，优先级最低
        msgSpeical:{ default: [], serializable: false, visible: false},//临时公告，获取后播放一次
        msgPlayerBroadcast:{ default: [], serializable: false, visible: false},//玩家广播，获取后播放一次，优先级最高
        //isNormal:{ default: true, serializable: false, visible: false},
        normalIndex:{ default: 0, serializable: false, visible: false},  
        
        eventCallback:{ default: null, serializable: false, visible: false},
        isPlayingSpeical:{default:false,serializable:false,visible:false}
    },

    onLoad: function () {

        //this.msgNormal=['我是普通测试1','我是普通测试2'];
        //this.msgSpeical=['我是特殊测试1','我是特殊测试2'];
        //this.thisSize = this.node.getContentSize(); 
        //this.conItem.setPosition(cc.p(this.thisSize.width,0)); 
        //this.Play();
        this.txtInfo.string = "";        
    },
 
    setMsg:function(){
        if(this.isPlayingSpeical){
            return;
        }
        var content="";
        if(this.msgPlayerBroadcast.length>0){
            content=this.msgPlayerBroadcast[0];
            this.msgPlayerBroadcast.splice(0,1);
            this.isPlayingSpeical=true;
        }
        else if(this.msgSpeical.length>0){
            content=this.msgSpeical[0];
            this.msgSpeical.splice(0,1);
            this.isPlayingSpeical=true;
        }else if(this.msgNormal.length>0){
            if(this.normalIndex>=this.msgNormal.length){
                this.normalIndex=0;
            }
            content=this.msgNormal[this.normalIndex++];
        }else{
            if(this.eventCallback!=null){
                this.eventCallback(false);
            }
        }

        if(this.txtInfo!=null){
            this.txtInfo.string = content;
        }

        this.setStartState();
    },

    setStartState:function(){  
        this.contentSize=this.txtInfo.node.getContentSize().width;
        this.conItem.setPositionX(this.node.getContentSize().width);
    },

    Play(){ 
        this.isStart = true;
        this.setMsg();

    },
    onDestroy:function () { 
        this.isStart = false;
        this.eventCallback = null;
    },

    update: function (dt) {
        if(this.isStart) { 
            if(this.txtInfo.string.length==0){
                return;
            }
            let contentPosX=this.conItem.getPositionX();
            if(contentPosX<-this.contentSize){
                this.isPlayingSpeical=false;
                this.setMsg();
            }else{
                this.conItem.setPositionX(contentPosX-hxdt.setting_niuniu.BroadCastDelayPixel);
            }
        }
    },

    SetInfo (infos, cb=null) {
        this.eventCallback = cb;
        if(infos.length>0){
            if(this.eventCallback){
                this.eventCallback(true);
            }
        }else{
            if(this.eventCallback){
                this.eventCallback(false);
            }
        }

        for(var i=0;i<infos.length;i++){ 
            if(infos[i].mode==0){
                this.msgNormal.push(infos[i].content); 
            }else if(infos[i].mode==1){
                this.msgSpeical.push(infos[i].content);
            }else if(infos[i].mode==2){
                this.msgPlayerBroadcast.push(infos[i].content);
            }
            
        }

    }
});