import { hxfn } from "../../FN/HXFN";
import { log } from "../../../HXJS/Util/Log";

cc.Class({
    extends: cc.Component,

    properties: {
        btnRegist: cc.Node,
        btnGetSMSCode: cc.Node,
        btnClose: cc.Node,

        IptUsr: {
            default: null,
            type: cc.EditBox,
        },
        IptPsw: {
            default: null,
            type: cc.EditBox,
        },
        IptSMSCode: {
            default: null,
            type: cc.EditBox,
        },

        restTime: cc.Node,

        Text_RestTime: cc.Label,

        usr: { default: null, serializable: false, visible: false },
        psw: { default: null, serializable: false, visible: false },
        usr_ipt: { default: null, serializable: false, visible: false },
        psw_ipt: { default: null, serializable: false, visible: false },
    },

    onLoad: function () {
        this.btnRegist.getComponent('UIButton').SetInfo(this.OnBtnRegistClick.bind(this));
        this.btnGetSMSCode.getComponent('UIButton').SetInfo(this.OnBtnGetSMSCodeClick.bind(this));
        this.btnClose.getComponent('UIButton').SetInfo(this.OnBtnCloseClick.bind(this));
    },

    start: function () {

    },


    //获取验证码按钮点击事件
    OnBtnGetSMSCodeClick: function () {

        var phoneNumber = this.IptUsr.string;

        log.trace("ui", "【UILoginPhoneFirstTime -> OnBtnGetSMSCodeClick】 =>  phoneNumber: " + phoneNumber);
        
        if (hxfn.account.hasGetServeInfo) {
            hxfn.login.lTryLoginSMSCode(phoneNumber, (msg) => {
                log.trace("ui", "【UILoginPhoneFirstTime -> OnBtnGetSMSCodeClick】 => msg: " + JSON.stringify(msg));
                this.StartCountDown(msg.leftTime);
            });
        }
        else {
            hxfn.account.StartGetServerInfo(
                function () {
                    hxfn.login.lTryLoginSMSCode(phoneNumber, (msg) => {
                        log.trace("ui", "【UILoginPhoneFirstTime -> OnBtnGetSMSCodeClick】 => msg: " + JSON.stringify(msg));
                        
                        this.StartCountDown(msg.leftTime);
                    });
                }.bind(this)
            )
        }
    },

    OnBtnCloseClick: function () {
        hxjs.module.ui.hub.Unload(this.node);
        hxjs.module.ui.hub.LoadPanel_DlgPop('UI_Login_Phone_Common');
    },

    //注册按钮点击事件
    OnBtnRegistClick: function () {
        var data = {
            phoneNumber: this.IptUsr.string,
            password: this.IptPsw.string,
            smsAuthCode: this.IptSMSCode.string,
        };

        log.trace("ui", "【UILoginPhoneFirstTime -> OnBtnRegistClick 】=> phoneNumber: " + data.phoneNumber);
        log.trace("ui", "【UILoginPhoneFirstTime -> OnBtnRegistClick 】=> password: " + data.password);
        log.trace("ui", "【UILoginPhoneFirstTime -> OnBtnRegistClick 】=> smsAuthCode: " + data.smsAuthCode);
        log.trace("ui", "【UILoginPhoneFirstTime -> OnBtnRegistClick 】=> alert(data.password.length: " + data.password.length);

        if (!this.ValidateMobile(data.phoneNumber)) {
            return;
        }

        if (!this.ValidatePassword(data.password)) {
            return;
        }

        //创建账户
        if (hxfn.account.hasGetServeInfo) {
            hxfn.login.lTryLoginPhoneUserCreat(data, function () {
                log.trace("ui", "【UILoginPhoneFirstTime -> OnBtnRegistClick 】=> Creat Success !!!!");
                hxfn.login.lTryLoginGetSalt(data.phoneNumber, data.password, function () {

                })
            })
        }
        else {
            hxfn.account.StartGetServerInfo(
                function () {
                    hxfn.login.lTryLoginPhoneUserCreat(data, function () {
                        log.trace("ui", "【UILoginPhoneFirstTime -> OnBtnRegistClick 】=> Creat Success !!!!");
                        hxfn.login.lTryLoginGetSalt(data.phoneNumber, data.password, function () {

                        })

                    });

                }.bind(this)
            )
        }
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

        //var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
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
    },


    StartCountDown(time) {
        this.schedule(function () {
            --time;
            this.btnGetSMSCode.active = false;
            this.restTime.active = true
            this.Text_RestTime.string = time + 'S';
            if (time == 0) {
                this.unscheduleAllCallbacks();
                this.Text_RestTime.node.active = false;
                this.restTime.active = false
                this.btnGetSMSCode.active = true;
            }
        }.bind(this), 1)
    }
});