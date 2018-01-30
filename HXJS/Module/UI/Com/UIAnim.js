cc.Class({
    extends: cc.Component,

    properties: {
        showDelay:0,
        showDuration:-1,////如果周期为负数，则表示显示之后不消失
        showClips:[cc.AnimationClip],

        // hideDelay:0,
        // hideDuration:1,//如果周期为负数，则表示显示之后不消失，否则视为生命周期之后消失
        // hideClips:[cc.AnimationClip],
        
        animCtrl:null,
        dedaultClips:null,
    },

    //!!! 暂时只处理显示动画（根据项目特点，消失动画有时候显得拖节奏）
    //存在动画控制器用已有的，没有的话可动态添加
    onLoad: function () {
        this.unscheduleAllCallbacks(this);

        this.animCtrl = this.node.getComponent(cc.Animation);
        if(this.animCtrl == null){
            this.animCtrl = this.node.addComponent(cc.Animation);
            // this.AddClips(this.showClips);
        }
        // else {
            // var clips = this.animCtrl.getClips();
            // this.showClips.concat(clips);
        // }
        
        this.dedaultClips = this.animCtrl.getClips();
        this.AddClips(this.showClips);
        

        //TEST 需测试
        this.animCtrl.playOnLoad = false;
    },

    onDestroy:function (){
        this.animCtrl=null,
        this.dedaultClips=null,
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
    },

    AddClips (clips) {
        for (var i = 0; i < clips.length; i++) {
            var clip = clips[i];
            if(clip && this.dedaultClips.indexOf(clip) == -1)
                this.animCtrl.addClip(clip);
        }
    },

    Show(cb = null) {
        this.unscheduleAllCallbacks(this);

        //必须前置处理
        // this.node.active = true;
        
        // var animCtrl = this.conCards[this.timer].node.getComponent(cc.Animation);
        
        if(this.showDelay > 0) {
            this.scheduleOnce(function(){
                this.RealShow(cb);
            }.bind(this),this.showDelay);
        }
        else {
            this.RealShow(cb);
        }
    },

    RealShow:function (cb){
        this.unscheduleAllCallbacks(this);

        this.showClips.forEach(function(element) {
            this.animCtrl.play(element.name);
        }.bind(this), this);

        if(this.showDuration>0){
            this.scheduleOnce(function(){
                //(错误:不能再显示环节做这种有歧义的优化)优化：如果指认了显示周期，则说明，到时间之后可以使得其active为false
                // this.node.active = false;
                if(cb) cb();
            }.bind(this),this.showDuration);
        }
        else {
            if(cb) cb();
        }
    },

    // Hide(){
    //     clips = this.hideClips;

    //     if(this.showDuration>0){
    //         this.scheduleOnce(function(){
    //             this.node.active = false;
    //             if(cb) cb();
    //         }.bind(this),this.hideDuration);
    //     }
    // },
});
