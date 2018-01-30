import { hxfn } from '../../../FN/HXFN';
import { hxjs } from '../../../../HXJS/HXJS';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        //用户操作
        // btnClose:cc.Node,
        btnConfirm:cc.Node,
        btnChangeName: require('UIButton'),
        btnCancel:cc.Node,
        iptName:cc.EditBox,
        iptSign:cc.EditBox,

        modifyTimes:cc.Label,//当前可修改次数
        //togSex:cc.Node,
        togMale: cc.Toggle,
        togFemale: cc.Toggle,
        
        src_ToggleSex:null,
        nickName:null,
        sex:null,
    },

    onLoad: function () {
        this.OnInit('修改资料');

        

        // this.btnClose.getComponent('UIButton').SetInfo(function(){
        //     hxjs.module.ui.hub.Unload (this.node);
        // }.bind(this));
        
        this.btnCancel.getComponent('UIButton').SetInfo(function(){
            hxjs.module.ui.hub.Unload (this.node);
        }.bind(this));
        
        
        this.btnConfirm.getComponent('UIButton').SetInfo(this.confirmEdit.bind(this));
        
        this.togFemale.node.on('toggle',this.TogFemale,this);
        this.togMale.node.on('toggle',this.TogMale,this);

        this.GetRemedyCardString();

        this.btnChangeName.SetInfo(this.ChangeNickName.bind(this));
    },


    confirmEdit:function () {
        //this.nickName = this.iptName.string;
        this.personalSign = hxfn.help.CheckSensitive(this.iptSign.string) ;
        // if(this.nickName =="")
        // {
        //    hxfn.comn.HandleClientResult(1);
        //    return;
        // }

        var postData = {
            sex: this.sex,
            personalSign: this.personalSign,
            //nickName:this.iptName.string,
            // icon
        };
        hxfn.netrequest.Req_Comn(
            postData,
            hxfn.netrequest.Msg_SetPlayerInfo,
            function(msg){
                cc.log('xiugainicheng')
                if(!hxfn.comn.HandleServerResult(msg.result))//设置成功：修改本地全局变量并退出
                {
                    hxfn.role.curUserData.playerData.sex = this.sex;
                    hxfn.role.curUserData.playerData.personalSign = this.personalSign;
                    hxjs.util.Notifier.emit('Role_Update');
                    hxjs.module.ui.hub.Unload (this.node);
                }
            }.bind(this)
        );
        //hxfn.netrequest.Req_SetPlayerInfo(this.nickName, this.sex, this.personalSign,this.CallBack_SetPlayerInfoReq.bind(this));
    },

    start: function() {

        this.sex = hxfn.role.curRole.sex;
        this.nickName = hxfn.role.curRole.nickName;
        this.personalSign = hxfn.role.curRole.personalSign?hxfn.role.curRole.personalSign:'';
        this.iptName.string = this.nickName;
        this.iptSign.string = this.personalSign;
        

        if(this.sex == 1)
        {
            this.togFemale.isChecked = false;
            this.togMale.isChecked = true;
        }
            
        if(this.sex == 2)
        {
            this.togMale.isChecked = false;
            this.togFemale.isChecked = true;
        }

        this.HandleNotify(true);
    },

    TogMale: function(event) {


        this.sex = 1;//0 和 1都当作男处理
        this.togFemale.isChecked = false;
        this.togMale.isChecked = true;
        cc.log('性别：' + this.sex);
    },

    TogFemale: function(event) {

        this.sex = 2;
        this.togMale.isChecked = false;
        this.togFemale.isChecked = true;
        
        cc.log('性别：' + this.sex);                
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    ChangeNickName(){
        cc.log('修改昵称')
        this.nickName = this.iptName.string;
        if(this.nickName == hxfn.role.curUserData.playerData.nickName){
            hxjs.module.ui.hub.LoadTipFloat('修改昵称成功！');
            return;
        }
        var postData = {
            nickName: this.nickName,
        };
        hxfn.netrequest.Req_Comn(
            postData,
            hxfn.netrequest.Msg_SetPlayerNickName,
            function(msg){
                if(!hxfn.comn.HandleServerResult(msg.result))//设置成功：修改本地全局变量并退出
                {
                    //hxfn.role.UpdateUserDataAndNotify();
                    hxfn.role.curUserData.playerData.nickName = this.nickName;
                    hxjs.util.Notifier.emit('Role_Update');
                    hxjs.module.ui.hub.LoadTipFloat('修改昵称成功！');
                }
                else{
                    this.iptName.string = hxfn.role.curRole.nickName;
                    hxjs.module.ui.hub.LoadTipFloat('修改昵称失败！');
                }
            }.bind(this)
        );
    },

    GetRemedyCardString(){
        this.modifyTimes.string = '当前可修改次数: ' + hxfn.role.curUserData.goldenInfo.nameCard;
    },

    onDestroy:function () {
        this.HandleNotify(false);
    },

    HandleNotify:function (isHandle){
        if(isHandle) {
            hxjs.util.Notifier.on('Role_Update', this.UpdateInfo, this);
            hxjs.util.Notifier.on('UserData_Update', this.UpdateInfo, this);
        }
        else {
            hxjs.util.Notifier.off('Role_Update', this.UpdateInfo, this);
            hxjs.util.Notifier.off('UserData_Update', this.UpdateInfo, this);
        }
    },

    UpdateInfo(){
        this.GetRemedyCardString();
    }
});
