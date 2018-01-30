cc.Class({
    extends: cc.Component,

    properties: {
        btnCheck: {
            default : null,
            type: require('UIButton'),
            override: true,
        },

        idx:{default: -1, serializable: false, visible: false},
        callback_check:{default: null, serializable: false, visible: false},
        isEnable:{default: true, serializable: false, visible: false},

        isEnableInvalidClick:{default: false, serializable: false, visible: false},
    },

    onLoad: function () {

    },

    OnInit (){
        this.btnCheck.SetInfo(this.Check.bind(this));
        this.ToggleEnable(this.isEnable);
    },

    ToggleEnable (isEnable) {
        this.isEnable = isEnable;

        //!!! Lst需要处理不能点的对象的信息，所以必须有反馈，至于反馈之后怎么处理看具体的业务需求
        if(!this.isEnableInvalidClick)
            this.btnCheck.node.active = this.isEnable;

        var scr = this.getComponent('UIStateDisplayer');//可优化
        if(scr!= null){
            scr.ToggleEnable(isEnable);
        }
    },

    Check () {
        if(this.isEnableInvalidClick){
            if(this.callback_check)
            this.callback_check(this.idx, this.isEnable);
        }
        else {
            if(this.callback_check)
                this.callback_check(this.idx);
        }
    },

    SetInfoBase (idx, callback, isEnableInvalidClick = false){
        this.idx = idx;
        this.callback_check = callback;
        this.isEnableInvalidClick = isEnableInvalidClick;
    }
});
