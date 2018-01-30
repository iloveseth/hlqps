import { hxjs } from "../../../../HXJS/HXJS";

cc.Class({
    extends: cc.Component,

    properties: {
        txtInfo: cc.Label,
        duration : 1.5, 
        // animObjs:[cc.Node],//如果延时处理，则需要获取具体的引用
    },

    onLoad: function () {
        // this.Init();
    },

    SetInfo (info, delay = 0) {
        this.txtInfo.string = info;

        //delay 暂时不处理
        this.scheduleOnce(()=>{
            this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
            hxjs.module.ui.hub.Unload(this.node);
            // cc.log('=============###');
            // cc.log(this.node.name);
        },this.duration);
    }

    // PlayAnim(){
        // animObjs
    // }
});