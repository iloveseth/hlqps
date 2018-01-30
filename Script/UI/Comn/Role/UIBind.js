// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

import {hxjs} from "../../../../HXJS/HXJS";
import {hxfn} from "../../../FN/HXFN";

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
        txtMyInviteCode:cc.Label,
        iptInviterId:cc.EditBox,
        btnBind:require('UIButton'),
        btnBindOfficial:require('UIButton'),
        txtTipBind:cc.Label,
        conBind:cc.Node,
        conBinded:cc.Node,
        txtBindedInfo:cc.Label,
        txtBindedInviteCode:cc.Label,
        btnBusiness: require('UIButton'),
        txtTitleMyAgent: cc.Label,

        imgBinded: cc.Node,

        btnBindMobile:require('UIButton'),
        btnBinding:require('UIButton'),

        player: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        this.imgBinded.active = false;
        this.GetMyAgentCode();
        //检测代理情况！！！
        this.CheckBindInfo();

        this.btnBind.SetInfo(this.BindAgent.bind(this), '绑定');
        this.btnBindOfficial.SetInfo(this.BindOfficial.bind(this), '绑定官方推荐人');
        this.btnBusiness.SetInfo(this.Business.bind(this));

        this.btnBindMobile.SetInfo(this.BindMobile.bind(this),'绑定手机');
        this.btnBinding.SetInfo(this.BindMobile.bind(this),'修改密码');

        this.HandleNotify(true);

        this.SetPhoneState();
    },

    onDestroy:function () {
        this.HandleNotify(false);
    },

    HandleNotify:function (isHandle){
        if(isHandle) {
            hxjs.util.Notifier.on('UserData_PhoneBinded', this.SetPhoneState, this);
        }
        else {
            hxjs.util.Notifier.off('UserData_PhoneBinded', this.SetPhoneState, this);

        }
    },

    GetMyAgentCode:function () {
        this.txtMyInviteCode.string = hxfn.role.curUserData.playerData.inviteId;//hxfn.role.curRole.get('inviteId');
    },

    CheckBindInfo:function () {
        hxfn.netrequest.Req_GetAgent(this.Callback_GetAgentReq.bind(this));
        
        // var postData = {};
        
        // hxfn.net.Request(
        //     postData,
        //     'GetAgentReq',
        //     hxdt.msgcmd.GetAgent,
        //     this.Callback_GetAgentReq.bind(this)
        // );
    },

    Callback_GetAgentReq:function (msg){
        // var msg = hxdt.builder.build('GetAgentResp').decode(data);
        var result = msg.get('result');
        //成功判断是否有代理信息，有则显示conBinded，否则显示conBind
        if(result == 0/*OK*/) {
            this.conBinded.active = true;
            this.conBind.active = false;
            var myAgent = msg.get('agentNickName');
            var agentId = msg.get('agentId');
            if(agentId == 'SUPPER'){//顶级代理

                this.txtTitleMyAgent.string = '我的状态: ';
                this.txtBindedInfo.string = '顶级代理';
                //this.imgBinded.active = false;
            }
            else{
                this.txtTitleMyAgent.string = '我的状态: ';
                this.txtBindedInfo.string = '已绑定上级'//myAgent;
                //this.imgBinded.active = true;
            }

            this.txtBindedInviteCode.string = hxfn.role.curUserData.playerData.inviteId;
        }
        else {
            this.conBinded.active = false;
            this.conBind.active = true;
        }
    },

    Callback_BindAgentReq:function (msg){
        var result = msg.get('result');
        hxfn.comn.HandleServerResult(result);

        this.CheckBindInfo();

    },

    BindAgent:function(){
        //绑定代理请求
        // message BindAgentReq {
        //     optional string agentId = 1;
        // }

        // message BindAgentResp {
        //     optional int32 result = 1;  //绑定结果
        //     optional string agentId = 2;
        //     optional string agentNickName = 3;
        // }

        var ipt = this.iptInviterId.string;
        if(ipt === '') {
            // hxjs.module.ui.hub.LoadDlg_Info('邀请码不能为空！','输入提示');
            hxfn.comn.HandleClientResult(1);
        }
        else {
            // var postData = {
            //     agentId:ipt,
            // };
            
            // hxfn.net.Request(
            //     postData,
            //     'BindAgentReq',
            //     hxdt.msgcmd.BindAgent,
            //     this.Callback_BindAgentReq.bind(this)
            // );
            hxfn.netrequest.Req_BindAgent(ipt, this.Callback_BindAgentReq.bind(this));
        }
    },

    BindOfficial:function(){
        // TODO BindOfficial

        hxfn.netrequest.Req_GetSuggestAgentInfo(
            function(msg){
                if(!hxfn.comn.HandleServerResult(msg.result)) {
                    hxjs.module.ui.hub.LoadDlg_Check(
                        '您是否绑定官方代理: ' + msg.nickName,
                        function () {
                            hxfn.netrequest.Req_BindSuggestAgent(this.Callback_BindAgentReq.bind(this));
                        }.bind(this),
                        null,
                        '',
                        '确认',
                        '取消',
                    );
                }
            }.bind(this),
        )

        //hxfn.netrequest.Req_BindSuggestAgent(this.Callback_BindAgentReq.bind(this));
    },

    Business(){
        var url = 'http://agent.jzsddh.com/';
        //var testUrl = 'http://agent.testgold.hx-game.com/--'
        cc.sys.openURL(url);
    },

    BindMobile(){
        hxjs.module.ui.hub.LoadPanel_Dlg ('UI_Login_ByRegister_Phone');
    },

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

    SetPhoneState(){
        //手机号码绑定成功后,刷新个人信息界面
        this.player = hxfn.role.curUserData.playerData;
        if(this.player.bindPhone != null){
            this.btnBindMobile.node.active = false;
            this.btnBinding.node.active = true;
        }
        else{
            this.btnBinding.node.active = false;
            this.btnBindMobile.node.active = true;
        }
        //实名认证后,刷新个人信息界面
        // if(hxfn.role.curRole.idCard!=null){
        //     this.imgRealIcon.active=true;
        //     this.btn_Realname.node.active=false;
        // }else{
        //     this.imgRealIcon.active=false;
        // }
    },


    // update (dt) {},
});
