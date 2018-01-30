import { hxdt } from "../DT/HXDT";

export let msg = {
    requestMap: new Map(),

    Resp_Handle:function (req, resp, data){
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
                this.Resp_Handle(reqStr.req,reqStr.resp,data)
            }.bind(this),
        )
    },

    // // Sync_Comn(postData,syncStr){
    // //     hxfn.net.Sync(
    // //         postData,
    // //         syncStr.tag,
    // //         syncStr.msg,
    // //     );
    // // },

    // //SyncReq_Common(postData,)

    // // Msg_PlayerGetAsReward:{
    // //     msg:hxdt.msgcmd.GetAsReward,
    // //     req:'PlayerGetAsRewardReq',
    // //     resp:'PlayerGetAsRewardResp',
    // // },

    // // Msg_CreateRoom: {
    // //     msg:hxdt.msgcmd.CreateRoom,
    // //     req:'CreateRoomReq',
    // //     resp:'CreateRoomResp',
    // // },

    // // Msg_JoinRoom: {
    // //     msg: hxdt.msgcmd.JoinRoom,
    // //     req:'JoinRoomReq',
    // //     resp:'JoinRoomResp',
    // // },

    // // Msg_QuitRoom: {
    // //     msg: hxdt.msgcmd.QuitRoom,
    // //     req: 'QuitRoomReq',
    // //     resp:'QuitRoomResp',
    // // },

    // // Msg_SearchRoom: {
    // //     msg: hxdt.msgcmd.SearchRoomReq,
    // //     req: 'SearchRoomReq',
    // //     resp: 'SearchRoomResp',
    // // },

    // Msg_SyncPlayerReady: {
    //     msg: hxdt.msgcmd.QZInputReady,
    //     tag:'QZInputReady'
    // },

    // Msg_SetTuition : {
    //     msg:hxdt.msgcmd.GBSetTuition,
    //     tag:'GBSetTuitionReq',
    // },

    // Msg_GBGiveup: {
    //     msg:hxdt.msgcmd.GBPlayerGiveup,
    //     tag:'GBInputGiveup',
    // },

    // Msg_GetYBRoomList: {
    //     msg:hxdt.msgcmd.GetYBRoomListReq,
    //     req:'GetYBRoomListReq',
    //     resp:'GetYBRoomListResp'
    // },

    // // Msg_PlayerGetAsReward:{
    // //     msg:hxdt.msgcmd.GetAsReward,
    // //     req:'PlayerGetAsRewardReq',
    // //     resp:'PlayerGetAsRewardResp',
    // // },

    // Msg_GetQZRoomDifenLimitList:{
    //     msg:hxdt.msgcmd.GetQZRoomDifenLimitList,
    //     req:'QZRoomDifenLimitListReq',
    //     resp:'QZRoomDifenLimitListResp',
    // },

    // Msg_GetLatestRoom:{
    //     msg:hxdt.msgcmd.GoldGetLatestRoom,
    //     req:'GoldGetLatestRoomReq',
    //     resp:'GoldGetLatestRoomResp',
    // },

    // // Msg_GetRoomDataHead:{
    // //     msg:hxdt.msgcmd.GetRoomDataHead,
    // //     req:'GetRoomDataHeadReq',
    // //     resp:'GetRoomDataHeadResp',
    // // },

    // Msg_SetPlayerInfo: {
    //     msg:hxdt.msgcmd.SetPlayerInfo,
    //     req:'SetPlayerInfoReq',
    //     resp:'SetPlayerInfoResp',
    // },

    // Msg_SetPlayerNickName: {
    //     msg:hxdt.msgcmd.SetPlayerNickName,
    //     req:'SetPlayerInfoReq',
    //     resp:'SetPlayerInfoResp',
    // },

    Msg_WXShareSuccess: {
        msg:hxdt.msgcmd.ShareSuccessCommand,
        req:'ShareSuccessReq',
        resp:'ShareSuccessResp',
    },

    Msg_NewPlayerAndShareActivity:{
        msg:hxdt.msgcmd.GetNewPlayerActivityInfoCommand,
        req:'NewPlayerAndShareActivityReq',
        resp:'NewPlayerAndShareActivityResp',
    },

    Msg_NewPlayerAndShareReward:{
        msg:hxdt.msgcmd.NewPlayerAndShareRewardCommand,
        req:'NewPlayerAndShareRewardReq',
        resp:'NewPlayerAndShareRewardResp',
    }
}
