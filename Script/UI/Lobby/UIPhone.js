// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        editPhone:cc.EditBox,
        editPassword: cc.EditBox,
        editNewPassword: cc.EditBox,
        editIdentifier: cc.EditBox,

        txtIdCount: cc.Label,
        conCountDown: cc.Node,

        btnGetIdentifier: require('UIButton'),
        btnConfirmBind:require('UIButton'),

        txtPhone: cc.Label,

        btnConfirmChange: require('UIButton'),

    },



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if(this.btnGetIdentifier)
            this.btnGetIdentifier.SetInfo(this.GetIdentifier.bind(this));
        if(this.btnConfirmBind){
            this.btnConfirmBind.SetInfo(this.ConfirmBind.bind(this));
        }
        if(this.btnConfirmChange){
            this.btnConfirmChange.SetInfo(this.ConfirmChange.bind(this));
        }
        if(this.txtPhone){
            this.txtPhone.string = hxfn.role.curRole.bindPhone;
        }
    },

    // update (dt) {},
    GetIdentifier(){
        // if(this.editPassword.string.length<6){
        //     hxjs.module.ui.hub.LoadTipFloat('密码需6至16位！');
        // } 
        // else{
        //     if(hxfn.role.curRole.bindPhone!=null){
        //         var phoneNumber = this.editPhone.string;
        //     }else{
        //         var phoneNumber = this.editPhone.string;
        //     }       

        var phoneNumber = null;
        if(this.editPhone){
            phoneNumber = this.editPhone.string;
        }
        if(this.txtPhone){
            phoneNumber = this.txtPhone.string;
        }

        if(!this.ValidateMobile(phoneNumber)){
            return;
        }

        var postData = {
            phoneNumber: phoneNumber,
        };
        // cc.log(postData);
        hxfn.netrequest.Req_SMSGetAuthCode(postData, function(msg){
            // var msg = hxdt.builder.build('SMSGetAuthCodeResp').decode(data);
            // cc.log(msg);
            if(!hxfn.comn.HandleServerResult(msg.result)){
                this.StartCountDown(msg.leftTime);
            }
        }.bind(this));
        //}
    },

    StartCountDown(time){
        this.schedule(function(){
            --time;
            this.btnGetIdentifier.node.active=false;
            this.conCountDown.active = true;
            this.txtIdCount.string=time + 'S';
            if(time == 0){
                this.unscheduleAllCallbacks();
                this.btnGetIdentifier.node.active=true;
                this.conCountDown.active=false;
            }
        }.bind(this),1)
    },

    ConfirmBind(){
        var smsId = this.editIdentifier.string;       
        var phonePassword = this.editPassword.string;
        if(!this.ValidatePassword(phonePassword)){
            return;
        }
        var postData = {
            smsAuth: smsId,
            password: phonePassword,
        };

        hxfn.netrequest.Req_SMSAuthBind(postData, function(msg){
            // var msg = hxdt.builder.build('SMSAuthBindResp').decode(data);
            // cc.log('msg========');
            // cc.log(msg);
            if(!hxfn.comn.HandleServerResult(msg.result)){
                cc.log('手机已经绑定成功');

                this.userDataChanged = true;
                //this.Close();

                //更新本地数据
                hxfn.role.curUserData.playerData.bindPhone = msg.bindPhone;   
                hxjs.module.ui.hub.LoadDlg_Info('手机绑定成功')
                hxjs.util.Notifier.emit('UserData_Update');
                hxjs.util.Notifier.emit('Role_Update');
                hxjs.util.Notifier.emit('UserData_PhoneBinded');
            }
        }.bind(this),);
    },
    
    ConfirmChange(){

        var smsId = this.editIdentifier.string;         
        var phonePassword = this.editNewPassword.string;
        if(!this.ValidatePassword(phonePassword)){
            return;
        }
        var postData = {
            smsAuth: smsId,
            password: phonePassword,
        };

        hxfn.netrequest.Req_SMSAuthResetPassword(postData, function(msg){

            if(!hxfn.comn.HandleServerResult(msg.result)){
                hxjs.module.ui.hub.LoadDlg_Info('密码修改成功', '提示');
                cc.log('密码修改成功');
                this.userDataChanged = true;
            }
        }.bind(this),);  
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
        if (password.length > 16 || password.length < 6) {
            hxjs.module.ui.hub.LoadTipFloat("请设置6至16位的密码!");
            return false;
        }
        return true;
    },

});
