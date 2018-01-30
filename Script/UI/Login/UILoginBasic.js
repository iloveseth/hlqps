import { hxfn } from "../../FN/HXFN";
import { hxdt } from "../../DT/HXDT";

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        // txtUsrTypNotify:cc.Label,
        // btnClearAllData: cc.Button,
        Con: cc.Node,

        btnByWeChat: cc.Node,
        btnByQQ: cc.Node,
        btnByRegist: cc.Node,
        btnByAno: cc.Node,

        btnByPhone: cc.Node,

        btnByVisitor:cc.Node,

        // [nondisplay]
        callbackList: null,
        txtGameVersion: cc.Label,
        txtResVersion: cc.Label,
    },

    onLoad: function () {
        this.btn_GOLoginByRegist = this.btnByRegist.getComponent('UIButton');
        this.btn_GOLoginByRegist.SetInfo(this.GOLoginByRegist.bind(this));
        this.btn_Ano = this.btnByAno.getComponent('UIButton');
        if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED){
            this.btn_Visitor=this.btnByVisitor.getComponent('UIButton');
            this.btn_Visitor.SetInfo(hxfn.login.LoginVisitor.bind(this));
        }
        
        this.btnByPhone.getComponent('UIButton').SetInfo(this.OnBtnByPhoneEvt.bind(this));

        // this.btn_Ano.SetInfo(hxfn.login.TryLoginByAno,'游客登录');
        // this.btnByQQ.getComponent('UIButton').SetInfo(hxfn.login_social.LoginByQQ);

        this.btnByWeChat.getComponent('UIButton').SetInfo(hxfn.login.LoginWeChat.bind(hxfn.login));
        //this.btnByWeChat.getComponent('UIButton').SetInfo(this.LoginByWxTest.bind(this)); 

        this.HandleNotify(true);
        this.txtGameVersion.string = '游戏版本号：' + hxdt.setting_comn.GetGameVersion();
        this.txtResVersion.string = '资源版本号：' + hxdt.setting_comn.GetResVersion();
        hxfn.adjust.AdjustLabel(this.node);

        hxfn.global.HandleNodes([this.btnByRegist], hxdt.setting_comn.IsWebVersion());
    },

    start: function () {
    },

    OnReset: function () {

    },

    onDestroy: function () {
        this.HandleNotify(false);
    },

    GOLoginByRegist: function () {
        hxjs.module.ui.hub.HideCom(this.Con);
        hxjs.module.ui.hub.LoadPanel('UI_Login_ByRegister_Psw');
        // hxfn.bridge.OpenUrl('http://www.baidu.com');
    },

    OnBtnByPhoneEvt: function () {
        hxjs.module.ui.hub.HideCom(this.Con);
        hxjs.module.ui.hub.LoadPanel_DlgPop('UI_Login_Phone_Common');
    },

    BackToLoginBasic: function () {
        hxjs.module.ui.hub.ShowCom(this.Con);
    },

    HandleNotify(isHandle) {
        if (isHandle) {
            hxjs.util.Notifier.on('UI_Login_CloseSub', this.BackToLoginBasic, this);
            //刷新
            // hxjs.util.Notifier.on('Reset_UI', this.OnReset, this);
        }
        else {
            hxjs.util.Notifier.off('UI_Login_CloseSub', this.BackToLoginBasic, this);
            // hxjs.util.Notifier.off('Reset_UI', this.OnReset, this);
        }
    },

    LoginByWxTest() {
        // var loginInfo = {
        //     channel:1,//微信登录
        //     data:{
        //         token: '071pTvNW0E5M6W1sLULW0wyBNW0pTvN5',
        //         par1: '',
        //     }
        // }
        // cc.log(loginInfo);
        // hxfn.login.lTryLogin(loginInfo);
    }
});