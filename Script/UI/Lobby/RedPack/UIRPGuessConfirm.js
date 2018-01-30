cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        btnGuessConfirm: cc.Button,
        txtBottom:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.btnGuessConfirm.getComponent('UIButton').SetInfo(
            function(){
                hxfn.redpack.ClosePop(this.node);
            }.bind(this),
        )
    },

    onEnable:function(){
        var money = hxfn.redpack.guessMoney;
        if(money != null)
        {
            this.txtBottom.string = '可获得' + hxfn.redpack.guessMoney + '元宝！';
            hxfn.redpack.guessMoney = null;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
