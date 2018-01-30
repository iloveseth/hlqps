import { hxjs } from "../../../../../HXJS/HXJS";
import { hxdt } from "../../../../DT/HXDT";

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        txtTitle:cc.Label,
        rolPlayers:cc.Node,

        btnInviteOnce:cc.Node,
        btnInvite:cc.Node,
        btnRefresh:cc.Node,
        conEmptyLstNotify:cc.Node,
        txtInviteAll:cc.Label,

        // [nondisplay]
        scr_rolPlayers:null,

        hasInit:false,
        inviteTyp:-1,
        allPlayers:[],
        selectIdxs:[],

        isEnableInviteAll:{ default: true, serializable: false, visible: false},
    },

    //////////////////////////////////////////////////////////////////////////////////////////////
    // onLoad: function () { },
    // start:function () { },

    OnInit(typ){
        if(!this.hasInit){
            this.hasInit = true;

            // this.txtInviteAll.string = '';
            // this.txtInviteAll.node.active = false;
            this.isEnableInviteAll = true;

            this.btnInviteOnce.getComponent('UIButton').SetInfo(this.InviteOnce.bind(this),'一键邀请');
            this.btnInvite.getComponent('UIButton').SetInfo(this.Invite.bind(this),'邀请');
            this.btnRefresh.getComponent('UIButton').SetInfo(this.Refresh.bind(this),'刷新');
            this.scr_rolPlayers = this.rolPlayers.getComponent('UIScrollView');

            this.inviteTyp = typ;
            
            if(typ === hxfn.battle.Enum_PlayerTyp.Friend)
                this.txtTitle.string = '所有在线牌友';
            else if(typ === hxfn.battle.Enum_PlayerTyp.Free)
                this.txtTitle.string = '随机查找10名空闲玩家';
        }
    },
        
    OnEnd(){
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
        // this.txtInviteAll.string = '';
        // this.txtInviteAll.node.active = false;
        this.isEnableInviteAll = true;

        if(this.hasInit){
            this.hasInit = false;
        }
    },
    onDestroy:function () {
        this.OnEnd();
    },
    //////////////////////////////////////////////////////////////////////////////////////////////
    
    // SelectPlayer:function (params/*idx, isSelected*/) {
    //     var idx = params[0];
    //     var isSelected = params[1];

    //     var i = this.selectIdxs.indexOf(idx);
       
    //     if(!isSelected) {
    //         if(i!=-1)
    //             this.selectIdxs.removeAt(i);
    //     }
    //     else {
    //         if(i==-1)
    //             this.selectIdxs.push(idx);
    //     }
    // },

    SelectPlayerNew:function (idx, isSelected) {
        var i = this.selectIdxs.indexOf(idx);
       
        if(!isSelected) {
            if(i!=-1)
                this.selectIdxs.removeAt(i);
        }
        else {
            if(i==-1)
                this.selectIdxs.push(idx);
        }
    },

    InviteOnce () {
        if(!this.isEnableInviteAll){
            hxjs.module.ui.hub.LoadTipFloat(hxdt.setting.lang.Battle_InviteAll_Disable);
            return;
        }

        this.ClearAllSelecteds();

        //一键邀请，发送所有可邀请的对象
        if(this.allPlayers.length>0){
            for (let i = 0; i < this.allPlayers.length; i++) {
                this.InvitePlayer(i);
            }

            //15秒后可以重新一键邀请
            this.HandleInviteAll();
        }
        else {
            hxjs.module.ui.hub.LoadDlg_Info('没有可邀请的对象！','提示');
        }
    },

    Invite () {
        //用数组存，可能是多个
        var i = 0;
        if(this.selectIdxs.length>0){
            for (let i = 0; i < this.selectIdxs.length; i++) {
                var idx = this.selectIdxs[i];
                this.InvitePlayer(idx);
            }

            this.ClearAllSelecteds();
        }
        else {
            hxjs.module.ui.hub.LoadDlg_Info('请先选择至少一个邀请的对象！','提示');
        }
    },

    InvitePlayer:function(idx) {
        var player = this.allPlayers[idx];
        if(player != null) {
            var pid = player.get('playerId');
            this.InviteJoinRoom(pid);
        }
        else {
            cc.log('[hxjs][err] InviteJoinRoom player is null with idx: ' + idx);
        }
    },

    HandleInviteAll (){
        var cd = 15;

        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器

        // this.btnInviteOnce.getComponent('UIButton').ToggleEnable(false);
        // this.txtInviteAll.node.active = true;
        // this.txtInviteAll.string = '倒计时：' + cd;

        this.isEnableInviteAll = false;
        

        this.schedule(function(){
            cd--;
            // this.txtInviteAll.string = '倒计时：' + cd;
            if(cd <=0) {
                // this.btnInviteOnce.getComponent('UIButton').ToggleEnable(true);
                // this.txtInviteAll.string = '';
                // this.txtInviteAll.node.active = false;

                this.isEnableInviteAll = true;
            }
        }.bind(this), 1, 15-1, 0);
    },

    ClearAllSelecteds(){
        // this.ResetInvite();
        this.scr_rolPlayers.populateList([]);
        this.scr_rolPlayers.populateList(this.allPlayers,this.SelectPlayerNew.bind(this));
        this.selectIdxs = [];
    },

    Refresh () {
        this.UpdateInfo();
    },

    // 不自动刷新
    // ResetInvite:function () {
    //     this.selectIdxs = [];

    //     this.Refresh();
    // },

    InviteJoinRoom:function(pid){
        cc.log('InviteJoinRoom playerid: ' + pid);

        var postData = {
            'friendId': pid,
            'roomId': hxfn.battle.curRoomId,
        };

        hxfn.netrequest.Req_InviteJoinRoom(postData, this.Callback_InviteJoinRoomReq.bind(this));
    },

    Callback_InviteJoinRoomReq:function (info) {
        // 成功弹提示
        if(info.result === 0/*OK*/) {
            hxjs.module.ui.hub.LoadTipFloat('已成功发出邀请！');
        }

        // var msgDef = hxdt.builder.build('InviteJoinRoomResp');
        // var msg = msgDef.decode(data);
    
        // var result = msg.get('result');
        // if(result === 0/*OK*/) {
        //     // this.countSend += 1;
        //     // if(this.countSend >= this.selectIdxs.length){
        //     //     //所有的都成功

        //     //     //重置，所有选择，更新列表(重新初始化列表)
        //     //     this.curSendPlayerIdx
        //     //     this.SelectPlayer(this.curSendPlayerIdx,false);
        //     // }
        // }
    },

    OnReset:function(){
        this.allPlayers=[];
        this.scr_rolPlayers.populateList(this.allPlayers);
        this.selectIdxs=[];
    },
    
    UpdateInfo(){
        this.OnReset();

        if(this.inviteTyp == hxfn.battle.Enum_PlayerTyp.Friend) {
            this.UpdateFirend();
        }
        else if(this.inviteTyp == hxfn.battle.Enum_PlayerTyp.Free){
            this.UpdateFreeIdle();
        }
    },

    UpdateFirend:function(){
        var postData = {};
        hxfn.netrequest.Req_GetAgentChildren(postData, this.Callback_GetFriendListCommand.bind(this));
    },

    Callback_GetFriendListCommand:function (msg) {
        var lst = msg.get('childrenList');
        // var lst2 = msg.get('friendEvents');

        // 应该只需要显示在线的好友
        var validLst = [];
        //FriendProto
        for (var i = 0; i < lst.length; i++) {
            var element = lst[i];
            if(element.get('online') == 1){
                validLst.push(element);//.get('playerName')
            }
        }

        this.allPlayers = validLst;
        this.scr_rolPlayers.populateList(validLst,this.SelectPlayerNew.bind(this));

        if(this.conEmptyLstNotify!= null)
            this.conEmptyLstNotify.active = validLst.length <= 0;
    },

    UpdateFreeIdle:function(){
        var postData = {};
        hxfn.netrequest.Req_SearchIdlePlayer(postData, this.Callback_SearchIdlePlayerReq.bind(this));
    },

    Callback_SearchIdlePlayerReq:function (msg) {
        var lst = msg.get('idleList');
        this.allPlayers = lst;
        this.scr_rolPlayers.populateList(lst, this.SelectPlayerNew.bind(this));

        if(this.conEmptyLstNotify!= null)
            this.conEmptyLstNotify.active = validLst.length <= 0;
    }
});