cc.Class({
    extends: cc.Component,

    properties: {
        btnRedPack: require('UIButton'),
        txtHead:cc.Label,
        txtBottom:cc.Label,

        idx:-1,
        callback:null,
    },

    onLoad: function () {
        this.btnRedPack.SetInfo(function(){
            this.callback(this.idx);
        }.bind(this));
    },

    SetInfo(info, idx, callback){
        this.idx = idx;
        this.callback = callback;
        this.txtHead.string = info.content;
        this.txtBottom.string = info.from;
    },
});
