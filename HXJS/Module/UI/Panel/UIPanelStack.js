import { hxjs } from "../../../HXJS";

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        txtTitle: { default : null, type: cc.Label, override: true},
        btnClose: {
            default : null,
            type: cc.Button,
            override: true,
        },

        // [nondisplay]
        // closeNotify:{ default: '', serializable: false, visible: false},
        // srcAnimPanel: null,
    },

    onLoad: function () {
        this.node.active = true;
    },
    
    OnInit (title/*optional*/) { //closeNotify/*required*/,
        if(this.txtTitle != null && title != null)
            this.txtTitle.string = title;

        // this.closeNotify = closeNotify;
        if(this.btnClose){
            this.btnClose.getComponent('UIButton').SetInfo(this.Close.bind(this));
        }

        // this.srcAnimPanel = this.node.getComponent('UIAnimPanel');
        // if(this.srcAnimPanel != null)
        //     this.srcAnimPanel.Show(999999);
    },

    Close:function () {
        var anim = null;

        //TODO 结束动画
        if(this.srcAnimPanel != null && this.srcAnimPanel.eff != null) {
            // var anim = this.node.getComponent(cc.Animation);
            anim = this.srcAnimPanel.eff.getComponent(cc.Animation);
        }
        
        if(anim) {
            anim.play('out_slide_panel');

            this.scheduleOnce(function(){
                // // hxjs.module.ui.hub.Unload(this.node);
                // hxjs.util.Notifier.emit('ui_lobby_fn_close');
                this.RealClose();
            }.bind(this),0.5);
        }
        else {
            // // hxjs.module.ui.hub.Unload(this.node);
            // hxjs.util.Notifier.emit('ui_lobby_fn_close');
            this.RealClose();
        }
    },

    RealClose:function () {
        // hxjs.module.ui.hub.Pop();
        hxjs.module.ui.hub.Unload(this.node);

        // if(this.closeNotify != null && this.closeNotify != ''){
        //     hxjs.util.Notifier.emit(this.closeNotify);
        // }
        // hxjs.module.ui.hub.UnloadPanelStack();
    }
});