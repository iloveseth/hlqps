cc.Class({
    extends: cc.Component,

    properties: {
        groupSeat:cc.Node,
        btnSeats:[cc.Node],
    },

    ////////////////////////////////////////////////////////////////////////////////////
    // Start:function () {
    //     hxjs.module.ui.hub.HideCom(this.node);
    
    //     //如果不是房主
    
    //     //TODO:通知服务器已经准备好，可以事先判断一下是否有人已经加入，应该是至少有一个玩家
    // },
    
    start(){
        this.groupSeat.getComponent('UIGroup').SetInfo(this.Invite.bind(this));
        // hxfn.review.HideNode(this.btnSeats);
    },
    ////////////////////////////////////////////////////////////////////////////////////

    Invite:function (idx) {
        hxjs.module.ui.hub.LoadPanel_DlgPop('UI_Battle_Invite_new2');
    },
});
