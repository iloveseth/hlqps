cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        con_roleInfo: cc.Node,
        src_roleInfo: null,

    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.OnInit('');
     },

    start () {
        this.src_roleInfo = this.con_roleInfo.getComponent('UIItemRoleInfoTS');
        this.src_roleInfo.SetInfoR(hxfn.rank.curRankDetail);
    },

    // Close:function (){
    //     hxjs.module.ui.hub.Unload(this.node);
    // },
});
