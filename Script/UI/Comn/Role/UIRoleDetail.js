cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        //用户操作
        btnEditAvatar:cc.Node,
        btnEditNickname:cc.Node,
        // btnBindMobile:require('UIButton'),
        // btnBinding:require('UIButton'),
        btn_Realname:require('UIButton'),
        // txtSign:cc.Label,
        //动态数据更新
        sonItem_RoleInfo:cc.Node,

        imgRealIcon:cc.Node,
        player: null,
        
        // [nondisplay]
        scr_roleInfo:null,
        src_groupMenu:null,
    },

    onLoad: function () {
        //this.txtSign.string = hxfn.role.curRole.personalSign;

        this.btnEditAvatar.getComponent('UIButton').SetInfo(function(){
            hxjs.module.ui.hub.LoadPanel_DlgPop ('UI_Role_EditAvatar');
        }.bind(this),'编辑头像');
        this.btnEditNickname.getComponent('UIButton').SetInfo(function(){
            hxjs.module.ui.hub.LoadPanel_Dlg ('UI_Role_EditBasic');
        }.bind(this),'修改资料');
        this.SetPhoneState();

        // this.btnBindMobile.SetInfo(this.BindMobile.bind(this),'绑定手机');
        // this.btnBinding.SetInfo(this.Binding.bind(this),'已绑定');

        this.btn_Realname.SetInfo(this.Realname.bind(this),'实名认证');  
    },
    
    start:function () {
        this.scr_roleInfo = this.sonItem_RoleInfo.getComponent('UIItemRoleInfoTS');
        this.UpdateInfo();
        this.HandleNotify(true);
    },
    
    onDestroy:function () {
        this.HandleNotify(false);
    },

    HandleNotify:function (isHandle){
        if(isHandle) {
            hxjs.util.Notifier.on('Role_Update', this.UpdateInfo, this);
            hxjs.util.Notifier.on('UserData_Update', this.UpdateInfo, this);
            hxjs.util.Notifier.on('UserData_IdCard', this.SetPhoneState, this);
        }
        else {
            hxjs.util.Notifier.off('Role_Update', this.UpdateInfo, this);
            hxjs.util.Notifier.off('UserData_Update', this.UpdateInfo, this);
            hxjs.util.Notifier.off('UserData_IdCard', this.SetPhoneState, this);

        }
    },

    UpdateInfo:function (){
        this.scr_roleInfo.SetInfo({'userData': hxfn.role.curUserData.playerData, 'goldenInfo': hxfn.role.curUserData.goldenInfo});
        this.SetPhoneState();

    },

    SetPhoneState(){
        // //手机号码绑定成功后,刷新个人信息界面
        // this.player = hxfn.role.curUserData.playerData;
        // if(this.player.bindPhone != null){
        //     this.btnBindMobile.node.active = false;
        //     this.btnBinding.node.active = true;
        // }
        // else{
        //      this.btnBinding.node.active = false;
        //      this.btnBindMobile.node.active = true;
        // }
        //实名认证后,刷新个人信息界面
        if(hxfn.role.curRole.idCard!=null){
            this.imgRealIcon.active=true;
            this.btn_Realname.node.active=false;
        }else{
            this.imgRealIcon.active=false;
        }
    },

    // BindMobile(){
    //     hxjs.module.ui.hub.LoadPanel_Dlg ('UI_Login_ByRegister_Phone');
    // },
    //
    // Binding(){
    //     hxjs.module.ui.hub.LoadDlg_Check (
    //         this.player.bindPhone,
    //         this.BindMobile.bind(this),
    //         null,
    //         '已绑定手机：',
    //         '重置密码',
    //         '',
    //         'UI_Dlg_Check_PhoneBinded');
    // },

    Realname(){
        hxjs.module.ui.hub.LoadPanel_Dlg ('UI_Lobby_Realname');
    },
});