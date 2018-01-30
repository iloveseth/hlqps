cc.Class({
    extends: cc.Component,

    properties: {
        rolActivityTyp: require('UIScrollView'),
    },

    onLoad: function () {
        this.rolActivityTyp.SetInfo(hxfn.activityAndTask.activityTypsInfo, this.CheckTyp.bind(this));
    },

    start:function () {
        this.rolActivityTyp.SetDefaultIdx(0);
    },

    CheckTyp:function (idx) {
        //TODO responce activity type
    }
});