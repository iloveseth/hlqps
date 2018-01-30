import { hxdt } from "../../DT/HXDT";

cc.Class({
    extends: cc.Component,

    properties: {
        ani:cc.Animation,
        aniNode:cc.Node,
        interval:{ default: 0, serializable: false, visible: false},
    },

 
    startDelay:function(delay){
        this.interval =delay;
        this.ani.on('stop', this.onStop, this);
        this.aniNode.active =false;
        this.scheduleOnce(function(){
            this.ani.play();
            this.aniNode.active =true;
       }.bind(this),this.interval+hxdt.setting_niuniu.GlobalLightDelay);
    },
    onStop:function(){
        this.scheduleOnce(function(){
            this.ani.play();
        }.bind(this),hxdt.setting_niuniu.GlobalLightDelay);
    },
    onDestroy:function(){
        this.unscheduleAllCallbacks(this);
    }
});