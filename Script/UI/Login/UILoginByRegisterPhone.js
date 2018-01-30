import { hxfn } from '../../FN/HXFN';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        txtPhoneNumber:cc.EditBox,              //手机号码输入框
        txtIdentifier:cc.EditBox,
        txtPhonePassword:cc.EditBox,            
        txtPhoneNumbers:cc.Label,               //重置密码时,手机号码显示框
        imgFrame:cc.Node,                       //手机号码输入背景框
        imgGetIdentifier:cc.Node,
        txtIdentifiers:cc.Label,

        btnGetIdentifier:require('UIButton'),
        btnConfirm: require('UIButton'),
        btnRepetition: require('UIButton'),
        btnCancel: require('UIButton'),

        userDataChanged: false,
    },

    // use this for initialization
    onLoad: function () {
        this.OnInit('绑定手机');//'ui_lobby_fn_close', 

        this.btnGetIdentifier.SetInfo(this.GetIdentifier.bind(this),'获取验证码');
        
        this.btnCancel.SetInfo(this.Cancel.bind(this),'取消');
        // this.imgFrame.SetInfo(this.Frame.bind(this),'');

        if(hxfn.role.curRole.bindPhone!=null){
            this.txtPhoneNumbers.string = hxfn.role.curRole.bindPhone;
            this.txtPhoneNumber.node.active = false;
            this.imgFrame.active = false;
            
            this.btnConfirm.node.active = false;
            this.btnRepetition.SetInfo(this.Repetition.bind(this),'重置密码');
            cc.log('重置密码');
            
        }else{
            this.txtPhoneNumbers.node.active = false;
            this.txtPhoneNumber.node.active = true;

            this.btnRepetition.node.active = false;
            // this.imgFrame.node.active = false;
            this.btnConfirm.SetInfo(this.Confirm.bind(this),'绑定');
            cc.log('绑定手机');
        }


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onDestroy: function(){
        if(this.userDataChanged){
            // hxfn.role.UpdateUserDataAndNotify();
        }
    },

    UpdateInfo:function (){
        cc.log(hxfn.role.curRole);
        this.scr_roleInfo.SetInfo({'userData': hxfn.role.curUserData.playerData, 'goldenInfo': hxfn.role.curUserData.goldenInfo});
        this.GetIdentifier();
    },
    GetIdentifier(){
        if(this.txtPhonePassword.string.length<6){
            hxjs.module.ui.hub.LoadTipFloat('密码需6至16位！');
        } else{
            if(hxfn.role.curRole.bindPhone!=null){
                var phoneNumber = this.txtPhoneNumbers.string;
            }else{
                var phoneNumber = this.txtPhoneNumber.string;
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
        }
        // hxfn.net.Request(
        //     postData,
        //     'SMSGetAuthCodeReq',
        //     hxdt.msgcmd.SMSGetAuthCode,
        //     function(data){
        //         var msg = hxdt.builder.build('SMSGetAuthCodeResp').decode(data);
        //         cc.log(msg);
        //         if(!hxfn.comn.HandleServerResult(msg.result)){
        //             this.StartCountDown(msg.leftTime);
        //         }
        //     }.bind(this),
        // )
    },


    // Frame(){

    // },

    Confirm(){
        var smsId = this.txtIdentifier.string;       
        var phonePassword = this.txtPhonePassword.string;
        
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
                this.Close();

                //更新本地数据
                hxfn.role.curUserData.playerData.bindPhone = msg.bindPhone;   
                hxjs.util.Notifier.emit('UserData_Update');
                hxjs.util.Notifier.emit('Role_Update');
                hxjs.util.Notifier.emit('UserData_PhoneBinded');
            }
        }.bind(this),);

        // hxfn.net.Request(
        //     postData,
        //     'SMSAuthBindReq',
        //     hxdt.msgcmd.SMSAuthBind,
        //     function(data){
        //         var msg = hxdt.builder.build('SMSAuthBindResp').decode(data);
        //         cc.log('msg========');
        //         cc.log(msg);
        //         if(!hxfn.comn.HandleServerResult(msg.result)){
        //             cc.log('手机已经绑定成功');
        //             this.userDataChanged = true;
        //             this.Close();
        //         }\
        //     }.bind(this),

        // )
    },

    Repetition(){
        var smsId = this.txtIdentifier.string;         
        var phonePassword = this.txtPhonePassword.string;
           
        var postData = {
            smsAuth: smsId,
            password: phonePassword,
        };

        hxfn.netrequest.Req_SMSAuthResetPassword(postData, function(msg){

            if(!hxfn.comn.HandleServerResult(msg.result)){
                hxjs.module.ui.hub.LoadDlg_Info('密码修改成功', '提示');
                cc.log('密码修改成功');
                this.userDataChanged = true;
                this.Close();
            }
        }.bind(this),);  

    },

    Cancel(){
        this.Close();
    },

    StartCountDown(time){
        this.schedule(function(){
            --time;
            this.imgGetIdentifier.active=false;
            this.txtIdentifiers.string=time + 'S';
            if(time == 0){
                this.unscheduleAllCallbacks();
                this.txtIdentifiers.node.active=false;
                this.imgGetIdentifier.active=true;
            }
        }.bind(this),1)
    }
});
