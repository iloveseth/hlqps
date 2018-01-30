cc.Class({
    extends: cc.Component,

    properties: {
        groupSeatGold:cc.Node,
        groupSeat:cc.Node,
        btnSeats:[cc.Node],
    },

    // onLoad: function () {
    //     // this.btnStart.getComponent('UIButton').SetInfo(this.Start.bind(this));
    //     this.groupSeat.getComponent('UIGroup').SetInfo(this.Invite.bind(this));
    //     hxfn.review.HideNode(this.btnSeats);
    // },

    // Start:function () {
    //     hxjs.module.ui.hub.HideCom(this.node);

    //     //如果不是房主

    //     //TODO:通知服务器已经准备好，可以事先判断一下是否有人已经加入，应该是至少有一个玩家
    // },

    OnInit(){
        this.groupSeat.getComponent('UIGroup').SetInfo(this.Invite.bind(this));
        // hxfn.review.HideNode(this.btnSeats);

        this.groupSeat.active = false;
        this.groupSeatGold.active = false;
    },

    Show(){
        this.groupSeat.active = true;
        this.groupSeatGold.active = false;
    },

    Hide(){
        this.groupSeat.active = false;
        this.groupSeatGold.active = true;
    },

    Invite:function (idx) {
        //TODO: ???需要指明邀请的位置？？？------应该不需要
        hxjs.module.ui.hub.LoadPanel_DlgPop('UI_Battle_Invite_new2');
    },

    // UpdateSeat(idx, isComeOrLeave){
    //     if(isComeOrLeave){
    //         hxjs.module.ui.hub.HideCom(this.btnSeats[idx-1]);
    //     }
    //     else{
    //         hxjs.module.ui.hub.ShowCom(this.btnSeats[idx-1]);
    //     }
    // }
});
