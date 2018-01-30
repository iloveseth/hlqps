cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        if(hxjs.module.data == null) {
            cc.log('=========================== Module_Data init');
            hxjs.module.data = this;

            this.Init();
            cc.game.addPersistRootNode(this.node);
        }
    },

    OnInit () {

    },

    onDestroy: function () {
        //TODO
    }
});
