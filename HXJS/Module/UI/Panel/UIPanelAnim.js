// 已废弃

cc.Class({
    extends: cc.Component,

    properties: {
        eff: cc.Node,
        
        timeDelay:0.5,
        timeStay:2,
        timeHide:1,
        
        isAutoHide: true,
    },

    onLoad: function () {
        this.Reset();
    },

    Show (stayTime) {
        this.scheduleOnce(function(){
            this.Play(stayTime);
        },0);
    },

    Play:function (stayTime) {
        // this.eff.active = true;
        hxjs.module.ui.hub.ShowCom(this.eff);

        if(!this.isAutoHide)
            return;

        this.scheduleOnce(function(){
            this.Hide();  
        },stayTime);
    },

    Hide (){
        this.Reset();
    },

    Reset () {
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
        // this.eff.active = false;
        hxjs.module.ui.hub.HideCom(this.eff);
    },
});
