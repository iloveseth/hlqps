cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        btn: cc.Button,
        txt: {
            default: null,
            type: cc.Label
        },
        time_hold:1,

        // TOREMOVE
        // conDisable: cc.Node,
        // conSelect: cc.Node,
        // conDeselect: cc.Node,

        // [nondisplay]
        callback_click:{default: null,serializable: false, visible: false},
        callback_hold:{default: null,serializable: false, visible: false},
        hasSetEnable:{default: false,serializable: false, visible: false},

        hasHoldValid:{default: false,serializable: false, visible: false},
    },

    onLoad: function () {
        if(this.btn == null) {
            cc.log('UIButton name: ' + this.name);
            // cc.log('this.btn.name');
            // cc.log(this.btn.name);
        }

        // if(this.conDisable != null || this.conSelect != null || this.conDeselect != null) {
        //     cc.log('UIButton: ' + this.name);
        // }
    },
    
    //如果外部执行过ToggleEnable的话，则不能再执行（由于start是延后的）
    start:function () {
        if(!this.hasSetEnable)
            this.ToggleEnable(true);
    },
    
    SetInfo (func, name = '', funhold) {
        this.callback_click = func;
        this.callback_hold = funhold;
        if(this.btn) {
            if(func) {
                this.btn.node.on('click', this.ClickThis.bind(this));
            }

            if(funhold) {
                this.btn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
                    this.StartTimer();
                },this);
                this.btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                    this.EndTimer();
                },this);
                this.btn.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
                    this.EndTimer();
                },this);
            }
        }

        if(name !=null && name != '')
            if(this.txt)
                this.txt.string = name;
    },

    StartTimer(){
        this.scheduleOnce(function(){
            this.hasHoldValid = true;
            if(this.callback_hold)
                this.callback_hold();
        }.bind(this),this.time_hold);
    },
    EndTimer(){
        this.hasHoldValid = false;
        this.unscheduleAllCallbacks(this);//停止组件的所有计时器
    },

    ClickThis:function(evt){
        //如果长按生效的话就屏蔽点击事件
        if(this.hasHoldValid) {
            this.hasHoldValid = false;
            return;
        }

        //中断长按
        this.EndTimer();

        //play sound
        hxjs.module.sound.PlayUI_Button();

        if(this.callback_click)
            this.callback_click(this);
    },

    ToggleEnable (isEnable) {
        var stateDis = this.getComponent('UIStateDisplayer');
        if(stateDis)
            stateDis.ToggleEnable(isEnable);

        // if(this.conDisable)
        //     this.conDisable.active = !isEnable;

        if(this.btn)
            this.btn.interactable = isEnable;
        else
            cc.log('UIButton ToggleEnable with name: ' + this.name);

        this.hasSetEnable = true;
    },

    ToggleSelect (isSelect) {
        // if(this.conSelect)
        //     this.conSelect.active = isSelect;
            
        // if(this.conDeselect)
        //     this.conDeselect.active = !isSelect;
        var stateDis = this.getComponent('UIStateDisplayer');
        if(stateDis)
            stateDis.ToggleSelect(isSelect);
    },



    ////////////////////////////////////////////
    // UIButton 二次刷新自己的名称
    // UIGroup给button类型的子对象设置名称
    SetName (name) {
        if(this.txt)
            this.txt.string = name;
    },
});