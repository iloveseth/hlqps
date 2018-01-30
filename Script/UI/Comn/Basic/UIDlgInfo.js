cc.Class({
    extends: require('UIPanelDlg'),

    properties: {
    },

    onLoad: function () {
        this.Init();
    },
    
    SetInfo (info, title) {
        //Base func
        this.PlayOpenAnim();
        this.SetBasicInfo(info, title);
    },
});