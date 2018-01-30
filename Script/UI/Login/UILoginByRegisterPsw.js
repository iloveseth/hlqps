import { hxfn } from "../../FN/HXFN";
import { LoginInfo } from "../../FN/Fn_Login";

cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: cc.Node,
        btnLogin: cc.Node,

        IptUsr: {
            default: null,
            type: cc.EditBox,
        },
        IptPsw: {
            default: null,
            type: cc.EditBox,
        },

        btnRegister: cc.Node,

        usr:null,
        psw:null,
        usr_ipt:null,
        psw_ipt:null,
        con_psw:null,
    },

    onLoad: function () {
        this.btn_Login = this.btnLogin.getComponent('UIButton');
        this.btn_Close = this.btnClose.getComponent('UIButton');
    },

    start: function () {
        this.btn_Close.SetInfo(this.Close.bind(this));
        this.btn_Login.SetInfo(this.Login.bind(this));//,'立即登录' 开始游戏

        this.InitPrevUsrName();
    },

    InitPrevUsrName:function (){
        var loginInfo = hxfn.login.GetLastLoginInfo();
        if (loginInfo && loginInfo.channel == 0 && loginInfo.fast)
            this.IptUsr.string = loginInfo.fast.usr;
        else
            this.IptUsr.string = "";
    },

    Close: function () {
        // this.node.destroy();
        hxjs.module.ui.hub.Unload(this.node);
        hxjs.util.Notifier.emit('UI_Login_CloseSub');
    },

    Login(evt) {
        this.usr_ipt = this.IptUsr.string;
        this.psw_ipt = this.IptPsw.string;

        cc.log('this.usr_ipt: ' +　this.usr_ipt);
        cc.log('this.usr: ' + this.usr);
        cc.log('this.psw_ipt: ' + this.psw_ipt);
        cc.log('this.usr: ' + this.psw);


        if(this.usr_ipt == null || this.usr_ipt =='') {
            hxjs.module.ui.hub.LoadDlg_Info('用户名为空实在是太过分了！','提示');
            return;
        }

        // if(this.CheckOfficialUsr()) {
        //     if(this.usr_ipt === this.usr && this.psw_ipt === this.psw)
        //         hxjs.uwcontroller.SetState(Enum_GameState.Lobby);//cc.director.loadScene('Lobby');
        //     else 
        //         hxjs.module.ui.hub.LoadDlg_Info('账号名或密码错误','提示');
        // }
        // else {
        //     if(this.CheckGuestUsr())
        //         hxjs.module.ui.hub.LoadDlg_Info('你是游客账户，请点击游客登录','提示');
        //     else 
        //         hxjs.module.ui.hub.LoadDlg_Info('请先注册帐号','提示');
        // }

        var loginInfo = new LoginInfo();
        loginInfo.channel = 0;
        loginInfo.fast.usr = this.usr_ipt;
        loginInfo.fast.pwd = this.psw_ipt;

        //hxfn.login.TryLogin(this.usr_ipt, this.psw_ipt);
        hxfn.login.TryLoginByBtn(loginInfo);
    },
});