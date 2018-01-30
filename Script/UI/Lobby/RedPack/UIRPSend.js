cc.Class({
    extends: cc.Component,

    properties: {
        btnSend: cc.Button,
    },

    // use this for initialization
    onLoad: function () {
        this.btnSend.getComponent('UIButton').SetInfo(
            function(){
                hxfn.redpack.SwitchState(this.node,1);
            }.bind(this),
        )
    },

    IsRedPackEnable(){
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
