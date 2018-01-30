cc.Class({
    extends: require('UIPanelItem'),

    properties: {
        txtRatio:cc.Label,
        //特殊样式处理
        conCrazy:cc.Node,

        txtRatioEx:[cc.Label],
    },

    onLoad: function () {
        this.OnInit();
    },

    SetInfo(info, idx, callback, isEnableInvalidClick = false){
        this.SetInfoBase(idx, callback, isEnableInvalidClick);
        
        if(info < 0) {
            this.conCrazy.active = true;
        }
        else {
            this.conCrazy.active = false;
            this.txtRatio.string = 'x'+ info + '$';

            if(this.txtRatioEx){
                this.txtRatioEx.forEach((e)=>{
                    e.string = 'x'+ info + '$';
                })
            }
        }
    },
});