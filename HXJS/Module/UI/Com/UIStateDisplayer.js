import { isArray } from "util";

cc.Class({
    extends: cc.Component,

    properties: {
        conEnable: cc.Node,
        
        conDisable: cc.Node,
        
        conSelect: cc.Node,
        conDeselect: cc.Node,

        conDefault: cc.Node,//默认，需要在按下与抬起时处理
        conPressed: cc.Node,
        animPressed:cc.AnimationClip,
        animUnpressed:cc.AnimationClip,

        isEnable:{ default: true, serializable: false, visible: false},
        isPressed:{ default: false, serializable: false, visible: false},

        animCtrl:{ default: null, serializable: false, visible: false},
        curClips:{ default: null, serializable: false, visible: false},
    },

    onLoad: function () {
        this.animCtrl = this.node.getComponent(cc.Animation);
        if(this.animCtrl == null){
            this.animCtrl = this.node.addComponent(cc.Animation);
        }
        this.curClips = this.animCtrl.getClips();

        this.isPressed = false;
        if(this.conPressed != null){
            this.conPressed.active = false;
        }

        //触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            if(this.isEnable) this.PressThis(true);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            if(this.isEnable) this.PressThis(false);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            if(this.isEnable) this.PressThis(false);
        }, this);

        //鼠标事件
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function () {
            if(this.isEnable)  this.PressThis(true);
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, function () {
            if(this.isEnable) this.PressThis(false);
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, function () {
            if(this.isEnable) this.PressThis(false);
        }, this);
    },

    ToggleEnable (isEnable) {
        this.isEnable = isEnable;

        if(this.conDisable)
            this.conDisable.active = !isEnable;

        if(this.conEnable)
            this.conEnable.active = isEnable;
    },

    ToggleSelect (isSelect) {
        if(this.conSelect)
            this.conSelect.active = isSelect;
            
        if(this.conDeselect)
            this.conDeselect.active = !isSelect;
    },

    PressThis (isDownOrUp) {
        if(isDownOrUp) {
            if(this.conPressed)
                this.conPressed.active = true;
            if(this.conDefault)
                this.conDefault.active = false;

            //播放按下动画
            if(!this.isPressed) {
                this.isPressed = true;
                this.PlayAnim(this.animPressed);
            }
        }
        else {
            if(this.conPressed)
                this.conPressed.active = false;
            if(this.conDefault)
                this.conDefault.active = true;

            // 播放抬起动画
            if(this.isPressed) {
                this.isPressed = false;
                this.PlayAnim(this.animUnpressed);
            }
        }
    },

    PlayAnim(clip){
        if(!clip) return;

        if(this.curClips && isArray(this.curClips) && this.curClips.indexOf(clip) == -1)
            this.animCtrl.addClip(clip);

        this.animCtrl.play(clip.name);
    },

    //触摸和鼠标事件

    // ActionCallback ///////////////////////////////////////////////////////
    // var touchEvent = this.getComponent('TouchEvent');
    // var mouseEvent = this.getComponent('MouseEvent');
    // var event = touchEvent || mouseEvent;
    // event._callback = function () {
    //     this.node.runAction(cc.sequence(
    //         cc.scaleTo(0.5, 2, 1),
    //         cc.scaleTo(0.25, 1, 1)
    //     ));
    // }



    // TouchEvent ///////////////////////////////////////////////////////////
    // _callback: null,

    // this.node.opacity = 100;
    // this.node.on(cc.Node.EventType.TOUCH_START, function () {
    //     this.node.opacity = 255;
    // }, this);
    // this.node.on(cc.Node.EventType.TOUCH_END, function () {
    //     this.node.opacity = 100;
    //     if (this._callback) {
    //         this._callback();
    //     }
    // }, this);
    // this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
    //     this.node.opacity = 100;
    // }, this);
});
