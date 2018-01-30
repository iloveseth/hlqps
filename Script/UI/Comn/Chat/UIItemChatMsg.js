
cc.Class({
    extends: require('UIPanelItem'),

    properties: {
        txtMsg:cc.Label,
    },

    onLoad: function () {
        this.OnInit();
    },

    SetInfo(info, idx, callback){ 
        this.SetInfoBase(idx, callback);
        this.txtMsg.string = info.txt;
       
    },
});