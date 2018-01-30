import { hxfn } from "./HXFN";
import { log } from "../../HXJS/Util/Log";
import { hxjs } from "../../HXJS/HXJS";
import { hxdt } from "../DT/HXDT";

export let netrequest = {
    //处理具体的4种类型的协议

    //常驻内存
    // OnInit(){
        // this.requestMap = new Map();
    // },

    // OnEnd (){
        // this.requestMap.clear();
    // },
    Resp_Handle:function (req, resp, data, callback){
        var info = hxjs.proto.UnPack(resp, data);

        log.trace("net", "<<< [Recv Data] ["+resp+"] <<<<<");
        log.trace("net", info);
        // log.trace("net", '==testtesttesttesttesttest==');
        // log.trace("net", typeof info);'object'
        // log.trace("net", typeof 'info');'string'
        // log.trace("net", typeof 2);//'number'
        // log.trace("net", typeof (()=>{})); //'function'

        if(callback != null) {
            callback(info);
        }
    },

    SendReq(postData, reqName, cmd, respName, cb) {
        hxfn.net.Request(
            postData,
            reqName,
            cmd,
            (data)=>this.Resp_Handle(reqName, respName, data, cb));
    },

    //Request=====================================
    Req_GetYBRoomList(gameTypId, cb){
        // this.requestMap.set('GetYBRoomListReq',cb);
        
        var postData = {
            gameType : gameTypId,
        };
    
        this.SendReq(
            postData,
            'GetYBRoomListReq',
            hxdt.msgcmd.GetYBRoomListReq,//5,
            'GetYBRoomListResp', cb);
    },

    Req_CreateRoom(roomType, gameType, playerInfo, crOption, gpss, cb){
        // this.requestMap.set('CreateRoomReq',cb);

        var postData = {
            playerInfo : playerInfo,
            crOption : crOption,
            gps : gpss,
        };

        this.SendReq(
            postData,
            'CreateRoomReq',
            hxdt.msgcmd.CreateRoom,
            'CreateRoomResp',
            cb);
    },

    Req_GetGoldenHall(cb){
        // this.requestMap.set('GetGoldenHallReq',cb);
        
        var postData = {
            platform:hxdt.setting_comn.GetPlatformId(),
            packageId:hxdt.setting_comn.GetPackageId(),
        };

        this.SendReq(
            postData,
            'GetGoldenHallReq',
            hxdt.msgcmd.GetGoldenHall,
            'GetGoldenHallResp',
            cb);
    },
    Req_GetMarketList (cb){
        // this.requestMap.set('GetMarketListReq',cb);
        
        var postData = {
            platform : hxdt.setting_comn.GetPlatformId(),// 请求所有
            playerId: hxfn.role.curUserData.playerData.playerId,
        };
 
        this.SendReq(
            postData,
            'GetMarketListReq',
            hxdt.msgcmd.GetMarketdList,
            'GetMarketListResp', cb
        );
    },

    Req_SetPlayerInfo (nickName, sex,personalSign, cb){
        // this.requestMap.set('SetPlayerInfoReq',cb);
        
        var postData = {
            nickName: nickName,
            sex: sex,
            personalSign:personalSign,
        }

        this.SendReq(
            postData,
            'SetPlayerInfoReq',
            hxdt.msgcmd.SetPlayerInfo,//320
            'SetPlayerInfoResp', cb
        );
    },
    
    Req_JoinRoom (roomId, pwd, playerInfo, gps, cb){
        // this.requestMap.set('JoinRoomReq',cb);

        var postData = {
            'roomId': roomId,
            'pwd':pwd,
            'playerInfo': playerInfo,
            'gps': null,
        };

        this.SendReq(
            postData,
            'JoinRoomReq',
            hxdt.msgcmd.JoinRoom,//11,
            'JoinRoomResp', cb
        );
    },

    Req_SearchRoom (curRoomTyp, curGameTypId, cb) {
        // this.requestMap.set('SearchRoomReq',cb);
        
        var postData = {
            roomType : curRoomTyp,
            gameType : curGameTypId,
            playerInfo : null,   //非客户端填写 //PlayerBriefProto
        };

        this.SendReq(
            postData,
            'SearchRoomReq',
            hxdt.msgcmd.SearchRoomReq,//10002,
            'SearchRoomResp', cb
        );
    },

    Req_SearchGreenRoom (curRoomTyp, curGameTypId, cb) {
        // this.requestMap.set('SearchRoomReq',cb);

        var postData = {
            roomType : curRoomTyp,
            gameType : curGameTypId,
            playerInfo : null,   //非客户端填写 //PlayerBriefProto
            newbie: true,
        };

        this.SendReq(
            postData,
            'SearchRoomReq',
            hxdt.msgcmd.SearchRoomReq,//10002,
            'SearchRoomResp', cb
        );
    },


    Req_GetNotice(cb){
        // this.requestMap.set('GetNoticeReq',cb);

        var postData = {
        };
 
        this.SendReq(
            postData,
            'GetNoticeReq',
            hxdt.msgcmd.GetNoticeCommand,
            'GetNoticeResp', cb
        );
    },

    Req_ReadNotice(postData, cb){
        this.SendReq(
            postData,
            'ReadNoticeReq',
            hxdt.msgcmd.ReadNoticeCommand,
            'ReadNoticeResp', cb
        );
    },

    Req_GetMailList(cb){
        // this.requestMap.set('GetMailListReq',cb);
        
        var postData = {};

        this.SendReq(
            postData,
            'GetMailListReq',
            hxdt.msgcmd.GetMailList,
            'GetMailListResp', cb
        );
    },
    
    Req_GetAgent (cb){
        // this.requestMap.set('GetAgentReq',cb);
        
        var postData = {};
        
        this.SendReq(
            postData,
            'GetAgentReq',
            hxdt.msgcmd.GetAgent,
            'GetAgentResp', cb
        );
    },

    Req_BindAgent (ipt, cb){
        // this.requestMap.set('BindAgentReq',cb);
        
        var postData = {
            agentId:ipt,
        };
        
        this.SendReq(
            postData,
            'BindAgentReq',
            hxdt.msgcmd.BindAgent,
            'GetAgentResp', cb
        );
    },
    Req_QuitRoom(pid,cb){
        // hxjs.module.ui.hub.ShowWaitingUI();
        // this.requestMap.set('QuitRoomReq',cb);

        var postData = {
            playerId:pid,
        };
        this.SendReq(
            postData,
            'QuitRoomReq',
            hxdt.msgcmd.QuitRoom,//12,
            'QuitRoomResp', cb
        );
    },

    Req_GetGoldEntryInfo (cb){
        // this.requestMap.set('GetGoldEntryInfoReq',cb);

        var postData = {
        };
        this.SendReq(
            postData,
            'GetGoldEntryInfoReq',
            hxdt.msgcmd.GetGoldEntryInfoReq,//5
            'GetGoldEntryInfoResp', cb
        );
    },

    Req_GetGoldEntryInfo (cb){
        // this.requestMap.set('GetGoldEntryInfoReq',cb);

        var postData = {
        };
        this.SendReq(
            postData,
            'GetGoldEntryInfoReq',
            hxdt.msgcmd.GetGoldEntryInfoReq,//5
            'GetGoldEntryInfoResp', cb
        );
    },

    //20171212
    Req_MaJiangGetOldRoom(postData,cb){
        // this.requestMap.set('MaJiangGetOldRoomReq',cb);
        
        this.SendReq(
            postData,
            'MaJiangGetOldRoomReq',
            hxdt.msgcmd.GoldGetOldRoom,
            'MaJiangGetOldRoomResp', cb
        );
    },
    Req_GameAuth (postData,cb){
        this.SendReq ( 
            postData,
            'GameAuthReq',
            hxdt.msgcmd.LoginCommand,
            'GameAuthResp',
            cb);
    },
    Req_RefuseGiveHongbag(postData,cb){
        // this.requestMap.set('RefuseGiveHongbagReq',cb);
        
        this.SendReq(
            postData,
            'RefuseGiveHongbagReq',
            hxdt.msgcmd.RefuseGiveHongbag,
            'RefuseGiveHongbagResp', cb
        );
    },

    Req_GetActivityVitality(postData,cb){
        // this.requestMap.set('GetActivityVitalityReq',cb);
        
        this.SendReq(
            postData,
            'GetActivityVitalityReq',
            hxdt.msgcmd.GetAvRewardList,
            'GetActivityVitalityResp', cb
        );
    },

    Req_PlayerGetAvReward(postData,cb){
        // this.requestMap.set('PlayerGetAvRewardReq',cb);
        
        this.SendReq(
            postData,
            'PlayerGetAvRewardReq',
            hxdt.msgcmd.GetAvReward,
            'PlayerGetAvRewardResp', cb
        );
    },
    Req_GetTaskReward(postData,cb){
        // this.requestMap.set('GetTaskRewardReq',cb);
        
        this.SendReq(
            postData,
            'GetTaskRewardReq',
            hxdt.msgcmd.GetTaskReward,
            'GetTaskRewardResp', cb
        );
    },

    Req_AgreeGiveHongbag(postData,cb){
        // this.requestMap.set('AgreeGiveHongbagReq',cb);
        
        this.SendReq(
            postData,
            'AgreeGiveHongbagReq',
            hxdt.msgcmd.AgreeGiveHongbag,
            'AgreeGiveHongbagResp', cb
        );
    },

    Req_GetHongbagList(postData,cb){
        // this.requestMap.set('GetHongbagListReq',cb);
        
        this.SendReq(
            postData,
            'GetHongbagListReq',
            hxdt.msgcmd.GetHongbagList,
            'GetHongbagListResp', cb
        );
    },

    Req_GuessHongbag(postData,cb){
        // this.requestMap.set('GuessHongbagReq',cb);
        
        this.SendReq(
            postData,
            'GuessHongbagReq',
            hxdt.msgcmd.GuessHongbag,
            'GuessHongbagResp', cb
        );
    },
    
    Req_GiveHongbag(postData,cb){
        // this.requestMap.set('GiveHongbagReq',cb);
        
        this.SendReq(
            postData,
            'GiveHongbagReq',
            hxdt.msgcmd.GiveHongbag,
            'GiveHongbagResp', cb
        );
    },
    Req_PlayerActivitySign(postData,cb){
        // this.requestMap.set('PlayerActivitySignReq',cb);
        
        this.SendReq(
            postData,
            'PlayerActivitySignReq',
            hxdt.msgcmd.ActivitySign,
            'PlayerActivitySignResp', cb
        );
    },
    Req_SearchIdlePlayer(postData,cb){
        // this.requestMap.set('SearchIdlePlayerReq',cb);
        
        this.SendReq(
            postData,
            'SearchIdlePlayerReq',
            hxdt.msgcmd.SearchIdlePlayerReq,
            'SearchIdlePlayerResp', cb
        );
    },
    Req_GetAgentChildren(postData,cb){
        // this.requestMap.set('GetAgentChildrenReq',cb);
        
        this.SendReq(
            postData,
            'GetAgentChildrenReq',
            hxdt.msgcmd.GetAgentChildren,
            'GetAgentChildrenResp', cb
        );
    },
    Req_InviteJoinRoom(postData,cb){
        // this.requestMap.set('InviteJoinRoomReq',cb);
        
        this.SendReq(
            postData,
            'InviteJoinRoomReq',
            hxdt.msgcmd.InviteJoinRoomReq,
            'InviteJoinRoomResp', cb
        );
    },
    Req_GetUserAllData(postData,cb){
        // this.requestMap.set('GetUserAllDataReq',cb);
        
        this.SendReq(
            postData,
            'GetUserAllDataReq',
            hxdt.msgcmd.GetUserInfoCommand,
            'GetUserAllDataResp', cb
        );
    },

    Req_GetTaskList(postData,cb){
        // this.requestMap.set('GetTaskListReq',cb);
        
        this.SendReq(
            postData,
            'GetTaskListReq',
            hxdt.msgcmd.GetTaskList,
            'GetTaskListResp', cb
        );
    },

    Req_GetActivitySign(postData,cb){
        // this.requestMap.set('GetActivitySignReq',cb);
        
        this.SendReq(
            postData,
            'GetActivitySignReq',
            hxdt.msgcmd.GetAsRewardList,
            'GetActivitySignResp', cb
        );
    },

    Req_DelMail(postData,cb){
        // this.requestMap.set('DelMailReq',cb);

        this.SendReq(
            postData,
            'DelMailReq',
            hxdt.msgcmd.DelMail,
            'DelMailResp', cb
        );
    },

    Req_SMSGetAuthCode(postData,cb){
        // this.requestMap.set('SMSGetAuthCodeReq',cb);

        this.SendReq(
            postData,
            'SMSGetAuthCodeReq',
            hxdt.msgcmd.SMSGetAuthCode,
            'SMSGetAuthCodeResp', cb
        );
    },

    Req_SMSAuthBind(postData,cb){
        // this.requestMap.set('SMSAuthBindReq',cb);

        this.SendReq(
            postData,
            'SMSAuthBindReq',
            hxdt.msgcmd.SMSAuthBind,
            'SMSAuthBindResp', cb
        );
    },

    Req_SMSAuthResetPassword(postData,cb){
        this.SendReq(
            postData,
            'SMSAuthBindReq',
            hxdt.msgcmd.SMSAuthResetPassword,
            'SMSAuthBindResp', cb
        );
    },

    Req_SMSRealNameAuthentication(postData,cb){
        this.SendReq(
            postData,
            'SMSAuthBindReq',
            hxdt.msgcmd.SMSRealNameAuthentication,
            'SMSAuthBindResp', cb
        );
    },
    
    Req_UseInterEmoj(postData,cb){
        // this.requestMap.set('UseInterEmojReq',cb);

        this.SendReq(
            postData,
            'UseInterEmojReq',
            hxdt.msgcmd.UseInterEmoj,
            'UseInterEmojResp', cb
        );
    },

    Req_GetAllPlayerCount(postData,cb){
        // this.requestMap.set('GetAllPlayerCountReq',cb);

        this.SendReq(
            postData,
            'GetAllPlayerCountReq',
            hxdt.msgcmd.GetAllPlayerCountReq,
            'GetAllPlayerCountResp', cb
        );
    },

    Req_SearchPlayer(postData,cb){
        // this.requestMap.set('GetGoldRankReq',cb);

        this.SendReq(
            postData,
            'SearchPlayerReq',
            hxdt.msgcmd.SearchPlayerCommand,
            'SearchPlayerResp', cb
        );
    },

    Req_GetGoldRank(postData,cb){
        // this.requestMap.set('GetGoldRankReq',cb);

        this.SendReq(
            postData,
            'GetGoldRankReq',
            hxdt.msgcmd.GetRanking,
            'GetGoldRankResp', cb
        );
    },

    Req_GetMailAward(postData,cb){
        // this.requestMap.set('GetMailAwardReq',cb);

        this.SendReq(
            postData,
            'GetMailAwardReq',
            hxdt.msgcmd.GetMailAward,
            'GetMailAwardResp', cb
        );
    },

    Req_OpenMail(postData,cb){
        // this.requestMap.set('OpenMailReq',cb);

        this.SendReq(
            postData,
            'OpenMailReq',
            hxdt.msgcmd.OpenMail,
            'OpenMailResp', cb
        );
    },

    
    Msg_PlayerGetAsReward:{
        msg:hxdt.msgcmd.GetAsReward,
        req:'PlayerGetAsRewardReq',
        resp:'PlayerGetAsRewardResp',
    },

    Msg_CreateRoom: {
        msg:hxdt.msgcmd.CreateRoom,
        req:'CreateRoomReq',
        resp:'CreateRoomResp',
    },

    Msg_JoinRoom: {
        msg: hxdt.msgcmd.JoinRoom,
        req:'JoinRoomReq',
        resp:'JoinRoomResp',
    },

    Msg_QuitRoom: {
        msg: hxdt.msgcmd.QuitRoom,
        req: 'QuitRoomReq',
        resp:'QuitRoomResp',
    },

    // Msg_SearchRoom: {
    //     msg:'', 
    //     req:'',
    // },
    Msg_SearchRoom: {
        msg: hxdt.msgcmd.SearchRoomReq,
        req: 'SearchRoomReq',
        resp: 'SearchRoomResp',
    },

    Req_Common(postData,reqStr,cb){
        this.requestMap.set(reqStr.req,cb);
        this.SendReq(
            postData,
            reqStr.req,
            reqStr.msg,
            function(data){
                this.Resp_Handle(reqStr.req,reqStr.resp,data)
            }.bind(this),
        )
    },


    //Sync=========================================
    //玩法 斗地主
    //输入明牌倍数
    Sync_DZInputOpenCard(postData){
        hxfn.net.Sync(
            postData,
            'DZInputOpenCard',
            hxdt.msgcmd.DZInputOpenCard,
        );
    },
    Sync_DZInputReady(postData){
        hxfn.net.Sync(
            postData,
            'DZInputReady',
            hxdt.msgcmd.DZInputReady,
        );
    },
    Sync_DZInputDiscard(postData){
        hxfn.net.Sync(
            postData,
            'DZInputDiscard',
            hxdt.msgcmd.DZInputDiscard,
        );
    },
    

    //玩法 拼十
    //主要用在实时战斗房间内
    Sync_QZInputReady(postData){
        hxfn.net.Sync(
            postData,
            'QZInputReady',
            hxdt.msgcmd.QZInputReady,
        );
    },

    //SyncRequest=================================
    SyncReq_GetRoomData(isRefresh,cb){
        // this.requestMap.set('GetRoomDataReq',cb);

        var postData = {
            refresh:isRefresh,//true:重新获取, false:默认获取
        };
        
        hxfn.net.SyncRequest(
            postData,
            'GetRoomDataReq',
            hxdt.msgcmd.GetRoomData,
            function(data){
                this.Resp_Handle('GetRoomDataReq','GetRoomDataResp', data, cb);
            }.bind(this));
    },
    Req_SearchPlayerReq(postData,cb){
        // this.requestMap.set('GetUserAllDataReq',cb);
        
        this.SendReq(
            postData,
            'SearchPlayerReq',
            hxdt.msgcmd.SearchPlayerCommand,
            'SearchPlayerResp', cb
        );
    },
    Req_PlayerGiveYBReq(postData,cb){

        this.SendReq(
            postData,
            'PlayerGiveYBReq',
            hxdt.msgcmd.PlayerGiveYBReq,
            'PlayerGiveYBResp', cb
        );
    },
    Req_GetBroadCastListReq(postData,cb){
        this.SendReq(
            postData,
            'GetBroadCastListReq',
            hxdt.msgcmd.GetBroadcastList,
            'GetBroadCastListResp', cb
        );
    },

    Req_GetBroadCastQualReq(cb){
        var postData = {};
        this.SendReq(
            postData,
            'GetBroadCastQualReq',
            hxdt.msgcmd.GetBroadCastQual,
            'GetBroadCastQualResq',
            cb
        );
    },

    Req_PostBroadCastReq(broadcastContent,cb){
        var postData={
            content:broadcastContent
        };
        this.SendReq(
            postData,
            'PostBroadCastReq',
            hxdt.msgcmd.PostBroadcast,
            'PostBroadCastResq',
            cb
        );
    },
    
    Req_GetSafaGuardInfoReq (cb){
   
        var postData = {
        };
        this.SendReq(
            postData,
            'GetSafaGuardReq',
            hxdt.msgcmd.GetSafeGuardInfo,
            'GetSafaGuardResp', cb
        );
    },

    Req_GetSafaGuardRewardReq(cb){
        var postData = {
        };
        this.SendReq(
            postData,
            'GetSafaGuardRewardReq',
            hxdt.msgcmd.GetSafeGuardReward,
            'GetSafaGuardRewardResp', cb
        );
    },
    Req_BankWithdrawReq(postData,cb){
        this.SendReq(
            postData,
            'BankWithdrawReq',
            hxdt.msgcmd.BankWithdrawReq,
            'BankWithdrawResp', cb
        );
    },
    Req_BankSaveReq(postData,cb){
        this.SendReq(
            postData,
            'BankSaveReq',
            hxdt.msgcmd.BankSaveReq,
            'BankSaveResp', cb
        );
    },

    Req_BindSuggestAgent(cb){
        this.SendReq(
            {},
            'BindSuggestAgentReq',
            hxdt.msgcmd.BindSuggestAgent,
            'BindSuggestAgentResp',cb
        );
    },

    Req_GetSuggestAgentInfo(cb){
        this.SendReq(
            {},
            'GetSuggestAgentInfoReq',
            hxdt.msgcmd.GetSuggestAgentInfo,
            'GetSuggestAgentInfoResp',cb
        );
    },

    Req_GetBalanceHistory(cb){
        this.SendReq(
            {},
            'GetBalanceHistoryReq',
            hxdt.msgcmd.GetBalanceHistoryReq,
            'GetBalanceHistoryResp',cb
        );
    },

    //fn_msg重构 //////////////////////////////////////////////////////////////
    requestMap: new Map(),

    Resp_Handle2:function (req, resp, data){
        // hxjs.module.ui.hub.HideWaitingUI();
        var msg = hxdt.builder.build(resp);
        var info = msg.decode(data);
        // cc.log("<<<<< [Recv] [Response] [cmd: "+req+"] <<<<<");
        // cc.log(info);

        var callback = this.requestMap.get(req);
        if(callback!= null) {
            callback(info);
        }
        this.requestMap.delete(req);
    },

    Req_Comn(postData,reqStr,cb){
        this.requestMap.set(reqStr.req,cb);
        hxfn.net.Request(
            postData,
            reqStr.req,
            reqStr.msg,
            function(data){
                this.Resp_Handle2(reqStr.req,reqStr.resp,data)
            }.bind(this),
        )
    },

    Sync_Comn(postData,syncStr){
        hxfn.net.Sync(
            postData,
            syncStr.tag,
            syncStr.msg,
        );
    },

    Msg_SyncPlayerReady: {
        msg: hxdt.msgcmd.QZInputReady,
        tag:'QZInputReady'
    },

    Msg_SetTuition : {
        msg:hxdt.msgcmd.GBSetTuition,
        tag:'GBSetTuitionReq',
    },

    Msg_GBGiveup: {
        msg:hxdt.msgcmd.GBPlayerGiveup,
        tag:'GBInputGiveup',
    },

    Msg_GetYBRoomList: {
        msg:hxdt.msgcmd.GetYBRoomListReq,
        req:'GetYBRoomListReq',
        resp:'GetYBRoomListResp'
    },

    Msg_GetQZRoomDifenLimitList:{
        msg:hxdt.msgcmd.GetQZRoomDifenLimitList,
        req:'QZRoomDifenLimitListReq',
        resp:'QZRoomDifenLimitListResp',
    },

    Msg_GetLatestRoom:{
        msg:hxdt.msgcmd.GoldGetLatestRoom,
        req:'GoldGetLatestRoomReq',
        resp:'GoldGetLatestRoomResp',
    },

    Msg_SetPlayerInfo: {
        msg:hxdt.msgcmd.SetPlayerInfo,
        req:'SetPlayerInfoReq',
        resp:'SetPlayerInfoResp',
    },

    Msg_SetPlayerNickName: {
        msg:hxdt.msgcmd.SetPlayerNickName,
        req:'SetPlayerInfoReq',
        resp:'SetPlayerInfoResp',
    },

    // Msg_WXShareSuccess: {
    //     msg:hxdt.msgcmd.ShareSuccessCommand,
    //     req:'ShareSuccessReq',
    //     resp:'ShareSuccessResp',
    // },
    // Msg_NewPlayerAndShareActivity:{
    //     msg:hxdt.msgcmd.GetNewPlayerActivityInfoCommand,
    //     req:'NewPlayerAndShareActivityReq',
    //     resp:'NewPlayerAndShareActivityResp',
    // },

    // Msg_NewPlayerAndShareReward:{
    //     msg:hxdt.msgcmd.NewPlayerAndShareRewardCommand,
    //     req:'NewPlayerAndShareRewardReq',
    //     resp:'NewPlayerAndShareRewardReqResp',
    // }
};