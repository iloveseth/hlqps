import { hxfn } from "../../FN/HXFN";

cc.Class({
    extends: cc.Component,

    properties: {
        btnRegist: cc.Node,
        btnLogin: cc.Node,
        btnClose: cc.Node,
        btnFindPassword:cc.Node,
        IptUsr: {
            default: null,
            type: cc.EditBox,
        },
        IptPsw: {
            default: null,
            type: cc.EditBox,
        },
    },

    onLoad: function () {
        this.btnRegist.getComponent('UIButton').SetInfo(this.OnBtnRegistClick.bind(this));
        this.btnLogin.getComponent('UIButton').SetInfo(this.OnBtnLoginClick.bind(this));
        this.btnClose.getComponent('UIButton').SetInfo(this.OnBtnCloseClick.bind(this));
        this.btnFindPassword.getComponent('UIButton').SetInfo(this.OnBtnFindPasswordClick.bind(this));
    },

    start: function () {

    },

    OnBtnRegistClick: function () {
        hxjs.module.ui.hub.Unload(this.node);
        hxjs.module.ui.hub.LoadPanel('UI_Login_Phone_FirstTime');
    },

    OnBtnCloseClick: function () {
        hxjs.module.ui.hub.Unload(this.node);
        hxjs.module.ui.hub.LoadPanel('UI_Login_Basic');
    },

    OnBtnFindPasswordClick: function () {
        hxjs.module.ui.hub.Unload(this.node);
        hxjs.module.ui.hub.LoadPanel('UI_Login_FindPassword');
    },

    OnBtnLoginClick: function () {

        var phoneNumber = this.IptUsr.string;
        var phonePassword = this.IptPsw.string;


        if (!this.ValidateMobile(phoneNumber)) {
            return;
        }

        if (!this.ValidatePassword(phonePassword)) {
            return;
        }

        cc.log('【UILoginPhoneCommon】 OnBtnLoginClick ->>>>>> phoneNumber: ' + phoneNumber);
        cc.log('【UILoginPhoneCommon】 OnBtnLoginClick ->>>>>> phonePassword: ' + phonePassword);

        hxfn.login.lTryLoginGetSalt(phoneNumber, phonePassword, function () {

        })
    },


    
    ValidateMobile: function (mobile) {
        if (mobile.length == 0) {
            hxjs.module.ui.hub.LoadTipFloat("您输入的手机号码为空，请重新输入！");
            return false;
        }
        if (mobile.length != 11) {
            hxjs.module.ui.hub.LoadTipFloat("您输入的手机号码长度有误，请重新输入！");
            return false;
        }

        var myreg = /^(((1[3-8]{1}))+\d{9})$/;
        if (!myreg.test(mobile)) {
            hxjs.module.ui.hub.LoadTipFloat("您输入的手机号码有误，请重新输入！");
            return false;
        }
        return true;
    },

    ValidatePassword: function (password) {
        if (password.length > 11 || password.length < 6) {
            hxjs.module.ui.hub.LoadTipFloat("请设置6至16位的密码!");
            return false;
        }
        return true;
    }
});