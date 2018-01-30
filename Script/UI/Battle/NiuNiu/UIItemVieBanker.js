cc.Class({
    extends: cc.Component,

    properties: {
        uiBankRatio:require('UIItemQuickBankTip'),
        conVieAnim:cc.Node,
        conVieMark:cc.Node,
    },

    onLoad: function () {
        this.conVieAnim.active = false;
        this.conVieMark.active = false;
    },


    ResetAll (){
        //隐藏
        hxjs.module.ui.hub.HideCom(this.conVieAnim);
        hxjs.module.ui.hub.HideCom(this.conVieMark);
        // hxjs.module.ui.hub.HideCom(this.uiBankRatio);
        this.uiBankRatio.node.active = false;
    },

    ResetVieAnim(){
        hxjs.module.ui.hub.HideCom(this.conVieAnim);
    },

    ShowVieAnim(){
        hxjs.module.ui.hub.ShowCom(this.conVieAnim);
    },

    SureBanker (){
        hxjs.module.ui.hub.ShowCom(this.conVieMark);
    },

    ShowRatioTip (idx, mul) {
        // hxjs.module.ui.hub.ShowCom(this.uiBankRatio);
        this.uiBankRatio.node.active = true;
        this.uiBankRatio.SetInfo(mul, idx);
    },

    ResetRatioTip (){
        // hxjs.module.ui.hub.HideCom(this.uiBankRatio);
        this.uiBankRatio.node.active = false;
    }
});
