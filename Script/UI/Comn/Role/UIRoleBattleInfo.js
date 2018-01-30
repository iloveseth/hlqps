cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // [display]
        sonItem_RoleInfo:cc.Node,
        btnReport:require('UIButton'),
        btnAddFriend:require('UIButton'),
        btnFullscreenBtn:require('UIButton'), 
        lstEmojs: require('UILst'),
        // [nondisplay]
        scr_roleInfo:null,
    },

    onLoad: function () {
        this.OnInit('玩家资料');

        this.scr_roleInfo = this.sonItem_RoleInfo.getComponent('UIItemRoleInfoTS');
        this.btnReport.SetInfo(this.Report.bind(this),'举报玩家');//.getComponent('UIButton')
        this.btnAddFriend.SetInfo(this.AddFriend.bind(this),'加为好友');//.getComponent('UIButton')
        this.btnFullscreenBtn.SetInfo(this.Close.bind(this));

 
    },

    start:function () {
      
        var uiseatIdx = hxfn.battle.curSelectSeatIdx;
        var info = hxfn.battle.uiRoles[uiseatIdx];

        this.UpdateInfo(info);
    },

    UpdateInfo:function (info){
 
        this.scr_roleInfo.SetInfo({'userData': info.playerInfo.userData, 'goldenInfo': null});//{'userData': hxfn.role.curRole, 'goldenInfo': hxfn.role.curGolden}
        
        var msgEmoj=hxfn.role.curUserData.playerInterEmojInfo.interEmojProto;
        this.lstEmojs.SetInfo(msgEmoj);
   
    },
   

    Report: function () {
        //TODO:
    },

    AddFriend:function () {

    },
});