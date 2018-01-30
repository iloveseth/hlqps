import { hxjs } from "../../../HXJS/HXJS";
import { hxfn } from "../../FN/HXFN";
import { log } from "../../../HXJS/Util/Log";

cc.Class({
    extends: cc.Component,

    properties: {
        btnGetSMSCode: cc.Node,
        btnSure: cc.Node,
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
    },

    onLoad: function () {
        this.btnGetSMSCode.getComponent('UIButton').SetInfo(this.OnBtnGetSMSCodeClick.bind(this));
        this.btnSure.getComponent('UIButton').SetInfo(this.OnBtnSureClick.bind(this));
        this.btnClose.getComponent('UIButton').SetInfo(this.OnBtnCloseClick.bind(this));
    },

    start: function () {

    },

    OnBtnGetSMSCodeClick: function () {
        var phoneNumber = this.IptUsr.string;
        log.trace("ui","【UILoginFindPassword -> OnBtnGetSMSCodeClick】 phoneNumber: " + phoneNumber);
        if (!this.ValidateMobile(phoneNumber)) {
            return;
        }

        if (hxfn.account.hasGetServeInfo) {
            hxfn.login.lTryFindPasswordSMSCode(phoneNumber, (msg) => {
                log.trace("ui", "【UILoginPhoneFirstTime -> OnBtnGetSMSCodeClick】 => msg: " + JSON.stringify(msg));
                
                this.StartCountDown(msg.leftTime);
            });
        }
        else {
            hxfn.account.StartGetServerInfo(
                function () {
                    hxfn.login.lTryFindPasswordSMSCode(phoneNumber, (msg) => {
                        log.trace("ui", "【UILoginPhoneFirstTime -> OnBtnGetSMSCodeClick】 => msg: " + JSON.stringify(msg));
                        this.StartCountDown(msg.leftTime);
                    })
                }.bind(this)
            )
        }
    },

    OnBtnSureClick: function () {
        var data = {
            account: this.IptUsr.string,
            newPassword: this.IptPsw.string,
            smsAuthCode: this.IptSMSCode.string,
        };

        cc.log('【UILoginFindPassword -> OnBtnSureClick】: ' + data.account);
        cc.log('【UILoginFindPassword -> OnBtnSureClick】: ' + data.newPassword);
        cc.log('【UILoginFindPassword -> OnBtnSureClick】: ' + data.smsAuthCode);


        if (!this.ValidateMobile(data.account)) {
            return;
        }

        if (!this.ValidatePassword(data.newPassword)) {
            return;
        }

        //创建账户
        if (hxfn.account.hasGetServeInfo) {
            hxfn.login.ITryResetPasswordByAuthCode(data, () => {
                cc.log('【UILoginFindPassword -> OnBtnSureClick: 修改密码成功');
                hxjs.module.ui.hub.Unload(this.node);
                hxjs.module.ui.hub.LoadPanel_DlgPop('UI_Login_Phone_Common');
                hxjs.module.ui.hub.LoadTipFloat("修改密码成功，请使用新密码进行登录!");

            })
        }
        else {
            hxfn.account.StartGetServerInfo(
                () => {
                    hxfn.login.ITryResetPasswordByAuthCode(data, () => {
                        cc.log('【UILoginFindPassword -> OnBtnSureClick: 修改密码成功');
                        hxjs.module.ui.hub.Unload(this.node);
                        hxjs.module.ui.hub.LoadPanel_DlgPop('UI_Login_Phone_Common');
                        hxjs.module.ui.hub.LoadTipFloat("修改密码成功，请使用新密码进行登录!");
                    })
                }
            )
        }
    },

    OnBtnCloseClick: function () {
        hxjs.module.ui.hub.Unload(this.node);
        hxjs.module.ui.hub.LoadPanel('UI_Login_Phone_Common');
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