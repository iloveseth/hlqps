cc.Class({
    extends: cc.Component,

    properties: {
        conWinCoinEff:cc.Node,
        uiItemScore:require('UIItemScore'),
    },

    onLoad: function () {
        this.conWinCoinEff.active = false;
    },

    ResetAll(){
        hxjs.module.ui.hub.HideCom(this.conWinCoinEff);
        hxjs.module.ui.hub.HideCom(this.uiItemScore.node);
        // this.uiItemScore.node.active = false;
    },

    ShowWinCoinEff(){
        hxjs.module.ui.hub.ShowCom(this.conWinCoinEff);
    },

    ShowScore(score, idx){
        hxjs.module.ui.hub.ShowCom(this.uiItemScore.node);
        this.uiItemScore.SetInfo(score, idx);
    },
});