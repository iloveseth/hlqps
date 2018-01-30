cc.Class({
    extends: cc.Component,

    properties: {
        objs:[cc.Node],

        showDelay:0,
        showDuration:1,

        //!!! 暂时只处理显示动画（根据项目特点，消失动画有时候显得拖节奏）
        // hideDelay:0,
        // hideDuration:1,
    },

    onLoad: function () {
        this.Show(null);
    },

    onDestroy:function (){
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
    },

    Show(cb){ 
        if(this.objs.length == 0) {
            cc.log('[hxjs][err] at lease one object exist!!!');
        }
        else {
            this.objs.forEach(function(element) {
               element.setPosition(cc.p(element.getPosition().x+5000,element.getPosition().y));
            }, this);
            if(this.showDelay > 0) {
                this.scheduleOnce(function(){ 
                    this.RealShow(cb);
                }.bind(this),this.showDelay);
            }
            else {
                this.RealShow(cb);
            }
        }
    },

    RealShow:function (cb){
        this.objs.forEach(function(element) {
            element.setPosition(cc.p(element.getPosition().x-5000,element.getPosition().y));
            hxjs.module.ui.hub.ShowObjAnim(element);
        }, this);

        if(this.showDuration>0){
            this.scheduleOnce(function(){
                if(cb) cb();
            }.bind(this),this.showDuration);
        }
        else {
            if(cb) cb();
        }
    },
});