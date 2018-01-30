import { hxfn } from '../../../FN/HXFN';

// import { hxfn } from '../../FN/HXFN';

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
        txtRealName:cc.EditBox,
        txtPhoneNumber:cc.EditBox,
        txtIdCardNumber:cc.EditBox,
        txtIdentifier:cc.EditBox,
        imgGetIdentifier:cc.Node,
        txtIdentifiers:cc.Label,

        btnGetIdentifier:require('UIButton'),
        btn_Registered: require('UIButton'),

        userDataChanged: false,
    },

    // use this for initialization
    onLoad: function () {
        this.OnInit('实名注册');//'ui_lobby_fn_close', 
        
        this.btn_Registered.SetInfo(this.Registered.bind(this),'注册');
        this.btnGetIdentifier.SetInfo(this.GetIdentifier.bind(this),'获取验证码');
    },


    onDestroy: function(){
        if(this.userDataChanged){
        }
    },

    UpdateInfo:function (){
        this.GetIdentifier();
    },

    GetIdentifier(){
        if(this.txtIdCardNumber.string.length<18){
            hxjs.module.ui.hub.LoadTipFloat('请输入18位有效身份证号码!');
        }else{
        var phoneNumber = this.txtPhoneNumber.string;
        var postData = {
            phoneNumber: phoneNumber,
        };
        // cc.log(postData);
        hxfn.netrequest.Req_SMSGetAuthCode(postData, function(msg){
            if(!hxfn.comn.HandleServerResult(msg.result)){
                this.StartCountDown(msg.leftTime);
            }
        }.bind(this));
        }
    },

    Registered(){
        var smsId = this.txtIdentifier.string;       
        var RealName = this.txtRealName.string;        
        var IdCard = this.txtIdCardNumber.string;

        var postData = {
            smsAuth: smsId,
            realName: RealName,
            idCard: IdCard,
        };

        hxfn.netrequest.Req_SMSRealNameAuthentication(postData, function(msg){
            // var msg = hxdt.builder.build('SMSAuthBindResp').decode(data);
            // cc.log('msg========');
            // cc.log(msg);
            if(!hxfn.comn.HandleServerResult(msg.result)){
                cc.log('实名注册成功');
                hxjs.util.Notifier.emit('UserData_IdCard');
                this.userDataChanged = true;
                this.Close();


                //更新本地数据
                // hxfn.role.curUserData.playerData.bindPhone = msg.bindPhone;
                hxfn.role.curUserData.playerData.idCard = IdCard;
                hxjs.util.Notifier.emit('UserData_Update');
                hxjs.util.Notifier.emit('Role_Update');
            }
        }.bind(this),);
    },

//输入验证码，并绑定手机
// message SMSAuthBindReq {
// 	required string smsAuth = 1;	//短信验证码
// 	optional string realName = 2;	//真实姓名
// 	optional string idCard = 3;		//身份证
// 	optional string password = 4;	//用户密码
// }
// //输入验证码，并绑定手机的响应信息
// message SMSAuthBindResp {
// 	required int32 result = 1;		//绑定结果
// 	optional string bindPhone = 2;	//绑定的电话号码
// }



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
