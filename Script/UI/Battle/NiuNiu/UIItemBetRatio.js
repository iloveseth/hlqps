cc.Class({
    extends: require('UIPanelItem'),

    properties: {
        txtRatio:cc.Label,

        txtRatioEx:[cc.Label],
    },

    onLoad: function () {
        this.OnInit();
    },

    SetInfo(info, idx, callback, isEnableInvalidClick = false){
        this.SetInfoBase(idx, callback, isEnableInvalidClick);
        
        if(info < 0) {
            this.ToggleEnable (false);
        }
        else {
            this.ToggleEnable (true);
            this.txtRatio.string = 'x'+ info + '$';
            if(this.txtRatioEx){
                this.txtRatioEx.forEach((e)=>{
                    e.string = 'x'+ info + '$';
                })
            }
        }
    },
});