import { log } from "../../HXJS/Util/Log";
import { hxdt } from "../DT/HXDT";
import { hxjs } from "../../HXJS/HXJS";
import { MessageCommand } from "../DT/DD/MessageCommand";
import { hxfn } from "./HXFN";
import { SyncPing } from "./Fn_Ping";

// Ring: 同步Room房间状态
// Act： 同步给客户端
// Input：玩家操作通知服务器
// Tip：服务器提示玩家操作事件

//TODO: postData, msgDefName 应该作为一个整体来封装,构造一个DataHandler的对象来处理，语义更为明确

export let net = {
    _nextReqId : 1,
    requestCacher : new Map(),

    Enum_PackTyp : cc.Enum({
        Request: 1,//RequestResponse 主动请求
        ServerInform: 2,//被动响应服务器广播
        Forward: 3,
        Report:4,
        Sync: 5,//只输入，不需要同步反馈
        IPC: 6,
        IPCRequest:7,
        IPCResponse:8,
        SyncRequest: 9,//只有get room data 使用这条
    }),

    // builder : null,
    hasInit: false,
    serverInvokeFuncDict:{},

    heartTick_Lobby : 60000,
    heartTick_Battle : 5000,


    OnInit () {
        if(this.hasInit)
        return;
    
        // this.builder = hxdt.builder;
        this.hasInit = true;
    },
    OnReset() {
        this.requestCacher = new Map();
    },

    GetNextReqID() {
        let id = this._nextReqId;
        this._nextReqId++;
        return id;
    },

    Call (requestId, postData, msgDefName, cmdid, packTyp, callback = null,failedCallback = null) 
    {
        // hxjs.module.ui.hub.ShowWaitingUI();
        var postMsg = hxjs.proto.Pack(msgDefName, postData);

        if (callback != null) {
            this.requestCacher.set(requestId, callback);
        }
        
        let sendResult = hxjs.module.netlinkerLong.OnSend (
            msgDefName, 
            this.WrapMsg(
                requestId,
                cmdid, 
                packTyp, 
                hxfn.account.authToken, 
                postMsg, 
                callback,
                failedCallback,
            )
        );

        //超时检查
        if(sendResult && packTyp === this.Enum_PackTyp.Request) {
            var checkTimer = function(){
                if(hxfn.net.CheckTimeOut(requestId)){
                    if(failedCallback == null){
                        log.trace("net", "你已经超时！[requestId="+requestId+"][cmd="+cmdid+", "+MessageCommand.codeToString(cmdid)+"]");
                        hxfn.login.QuitByNetErr();
                    }
                    else{
                        failedCallback();
                    }
                }
            };
            this.timer = setTimeout(checkTimer.bind(this), hxdt.setting_comn.GetClientTimeout());
        }

        if (!sendResult) {
            
        }
    },
    
    Request (postData, msgDefName, cmdid, callback,failedCall = null) 
    {
        let reqId = this.GetNextReqID();
        log.trace("net", ">>>>> [Send] [Request] [cmd = "+cmdid+", "+msgDefName+"] [ReqId="+reqId+"] >>>>>");
        log.trace("net", ">>> [Send Data] "+ JSON.stringify(postData));
        this.Call(reqId, postData, msgDefName, cmdid, this.Enum_PackTyp.Request, callback,failedCall);
    },
    
    Sync (postData, msgDefName, cmdid) 
    {
        if (cmdid != hxdt.msgcmd.SyncHeartBeat) {
            log.trace("net", ">>>>> [Send] [Sync] [cmd = "+cmdid+", "+msgDefName+"] >>>>>");
            log.trace("net", ">>> [Send Data] "+ JSON.stringify(postData));
        }
            
        this.Call(0, postData, msgDefName, cmdid, this.Enum_PackTyp.Sync);
    },
    
    SyncRequest (postData, msgDefName, cmdid, callback) 
    {
        let reqId = this.GetNextReqID();
        log.trace("net", ">>>>> [Send] [SyncRequest] [cmd = "+cmdid+", "+msgDefName+"] [ReqId="+reqId+"] >>>>>");
        this.Call(reqId, postData, msgDefName, cmdid, this.Enum_PackTyp.SyncRequest, callback);
    },




    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Regist4ServerInvoke (cmdid, func) {
        this.serverInvokeFuncDict[cmdid+''] = func;
    },
    
    Unregist4ServerInvoke (cmdid, func) {
        var key = cmdid+'';
    
        if(key in this.serverInvokeFuncDict) {
            delete this.serverInvokeFuncDict.key;
        }
        else {
            cc.log('[hxjs][err]: the serverInvokeFuncDict has not find key: ' + key);
        }
    },
    
    HandleServer : function (dt) {
        var msg_WrapPacket = hxdt.builder.build('WrapPacket');
        var msg = msg_WrapPacket.decode(dt);
    
        var cmd = msg.get('cmd');
        var requestId = msg.get('requestId');
        var errorCode = msg.get('errorCode');
        var packType = msg.get('packType');
        // var authToken = msg.get('authToken');
        var data = msg.get('data');
        
        switch (packType) {
            case this.Enum_PackTyp.Request:
                log.trace("net", "<<<<< [Recv] [Response] [cmd = "+cmd+", "+MessageCommand.codeToString(cmd)+"] [ReqId="+requestId+"] <<<<<");
            break;
            case this.Enum_PackTyp.ServerInform:
                log.trace("net", "<<<<< [Recv] [ServerInform] [cmd = "+cmd+", "+MessageCommand.codeToString(cmd)+"] <<<<<");
                // cc.log(info);
            break;
            case this.Enum_PackTyp.Sync:
                if (cmd != MessageCommand.SyncHeartBeatAck)
                    log.trace("net", "<<<<< [Recv] [Sync] [cmd = "+cmd+", "+MessageCommand.codeToString(cmd)+"] <<<<<");
                // cc.log(info);
            break;
            case this.Enum_PackTyp.SyncRequest:
                log.trace("net", "<<<<< [Recv] [SyncRequest Response] [cmd = "+cmd+", "+MessageCommand.codeToString(cmd)+"] [ReqId="+requestId+"]  <<<<<");
                // cc.log(info);
            break;
        }

        if(errorCode > 0){
            hxjs.module.ui.hub.HideWaitingUI();

            //HACK 特殊处理：最好由服务器以ErrorCode = 0同时带上ResultId来处理
            if(errorCode == hxdt.errcode.LackYuanbao) {
                hxfn.comn.IngotNotEnough(true);
            }
            else{
                if(hxfn.level.dialog == 'UI_Lobby_RoomDirectFind'){
                    hxjs.module.ui.hub.LoadTipFloat(hxdt.errcode.codeToDesc(errorCode));
                }
                else {
                    log.trace('net', '[error code]: ' + errorCode);
                    hxjs.module.ui.hub.LoadDlg_Info(hxdt.errcode.codeToDesc(errorCode), '提示');
                }
            }
            
            this.requestCacher.delete(requestId);
        }
        else {
            var func = this.requestCacher.get(requestId);
            this.requestCacher.delete(requestId);
            if(func != null) {
                func(data);
                return;
            }
    
            //ServerInfo \ Sync 消息的回调
            var func2 = this.serverInvokeFuncDict[cmd+''];
            if(func2 != null) {
                log.trace('net', 'server Invoke msgcmd: ' + hxdt.msgcmd.codeToString(cmd));
                func2(this.HandleServerInvoke(packType, cmd, data));
            }
        }
    },

    HandleServerInvoke:function (packType, cmd, data){
        var cmdName = this.GetMsgDefBycmdID(cmd);

        var msg = hxdt.builder.build(cmdName);
        var info = msg.decode(data);
        if (cmd != MessageCommand.SyncHeartBeatAck)
            cc.log(info);
        
        return info;
    },
    
    HandleClient : function (data) {
        
    },
    
    WrapMsg : function(requestId, cmd, packTyp, authToken, data, callback = null,failedCallback = null) {
        if(packTyp === this.Enum_PackTyp.Request){
            hxdt.setting_comn.requestMap.set(requestId,cmd);
        }
    
        var postObj = {
            "cmd": cmd,
            "requestId" : requestId,
            "errorCode" : 0,
            "packType" : packTyp,
            "roomServer" : '',
            "authToken" : authToken,
            "data" : data,
        };

        var wrapPacket = hxjs.proto.Pack('WrapPacket', postObj).toBuffer();
    
        return wrapPacket;
    },

    CheckTimeOut(requestId){
        return this.requestCacher.has(requestId) ;
    },

    GetMsgDefBycmdID:function(cmd){
        var msgName = null;

        switch (cmd) {
            //非战斗部分
            case hxdt.msgcmd.NetBeKickedCommand:
            msgName = 'NetBeKickedInform';
            break;
            case hxdt.msgcmd.BroadcastPost:
            msgName = 'BroadCastPost';
            break;
            case hxdt.msgcmd.InviteJoinRoomInform:
            msgName = 'InviteJoinRoomInform';
            break;
            case hxdt.msgcmd.PlayerInfoChanged:
            msgName = 'PlayerInfoChangedProto';
            break;
            case hxdt.msgcmd.SyncHeartBeatAck:
            msgName = 'SyncHeartBeatAck';
            break;
            //战斗：牛牛
            case hxdt.msgcmd.SyncForceLeft:
            msgName = 'SyncForceLeft';
            break;
            case hxdt.msgcmd.SyncPlayerJoinRoom:
            msgName = 'SyncPlayerJoin';
            break;
            case hxdt.msgcmd.SyncPlayerQuitRoom:
            msgName = 'SyncPlayerQuit';
            break;
            case hxdt.msgcmd.SyncPlayerLost:
            msgName = 'SyncPlayerLost';
            break;
            case hxdt.msgcmd.SyncPlayerReady:
            msgName = 'SyncPlayerReady';
            break;
            case hxdt.msgcmd.QZSyncRingCountdown:
            msgName = 'QZSyncRingCountdown';
            break;
            case hxdt.msgcmd.QZSyncRingCDBreak:
            msgName = 'QZSyncRingCDBreak';
            break;
            case hxdt.msgcmd.QZSyncRingBegin:
            msgName = 'QZSyncRingBegin';
            break;
            case hxdt.msgcmd.QZSyncRingEnd:
            msgName = 'QZSyncRingEnd';
            break;
            case hxdt.msgcmd.SyncRoomCoin:
            msgName = 'SyncRoomCoin';
            break;


            case hxdt.msgcmd.QZActDispatch:
            msgName = 'QZActDispatch';
            break;
            case hxdt.msgcmd.QZActVieBanker:
            msgName = 'QZActVieBanker';
            break;
            case hxdt.msgcmd.QZActBanker:
            msgName = 'QZActBanker';
            break;
            case hxdt.msgcmd.QZActChipin:
            msgName = 'QZActChipin';
            break;
            case hxdt.msgcmd.QZActShowHand:
            msgName = 'QZActShowHand';
            break;
            case hxdt.msgcmd.QZActNiuNiu:
            msgName = 'QZActNiuNiu';
            break;


            case hxdt.msgcmd.QZTipRubPoker:
            msgName = 'QZTipRubPoker';
            break;
            case hxdt.msgcmd.QZTipVieBanker:
            msgName = 'QZTipVieBanker';
            break;
            case hxdt.msgcmd.QZTipChipin:
            msgName = 'QZTipChipin';
            break;
            case hxdt.msgcmd.QZTipNiuNiu:
            msgName = 'QZTipNiuNiu';
            break;


            case hxdt.msgcmd.NoticeSafeGuard:
            msgName = 'SafeGuard';
            break;
            case hxdt.msgcmd.SyncRoomChat:
            msgName = 'SyncRoomChat';
            break;
            case hxdt.msgcmd.SyncPlayerSendInterEmoj:
            msgName = 'SyncPlayerSendInterEmoj';
            break;
            case hxdt.msgcmd.GBTipChessDown:
            msgName = 'GBTipChessDown';
            break;
            case hxdt.msgcmd.GBActChessDown:
            msgName = 'GBActChessDown';
            break;
            case hxdt.msgcmd.GBSyncRingEnd:
            msgName = 'GBSyncRingEnd';
            break;
            case hxdt.msgcmd.GBSyncRingBegin:
            msgName = 'GBSyncRingBegin';
            break;
            case hxdt.msgcmd.GBSyncSetTuition:
            msgName = 'GBSetTuitionResp';
            break;
            case hxdt.msgcmd.GBSyncPlayerGiveup:
            msgName = 'GBInputGiveup';
            break;
            case hxdt.msgcmd.SetPlayerNickName:
            msgName = 'SetPlayerNickName';
            break;

            //战斗：五子棋

            //战斗：斗地主
            case hxdt.msgcmd.DZSyncPlayerJoin:
            msgName = 'DZSyncPlayerJoin';
            break;
            case hxdt.msgcmd.DZSyncRingCountdown:
            msgName = 'DZSyncRingCountdown';
            break;
            case hxdt.msgcmd.DZSyncRingCDBreak:
            msgName = 'DZSyncRingCDBreak';
            break;
            case hxdt.msgcmd.DZInputReady:
            msgName = 'DZInputReady';
            break;
            case hxdt.msgcmd.DZSyncPlayerReady:
            msgName = 'DZSyncPlayerReady';
            break;
            case hxdt.msgcmd.DZSyncRingBegin:
            msgName = 'DZSyncRingBegin';
            break;
            case hxdt.msgcmd.DZActShowLordCard:
            msgName = 'DZActShowLordCard';
            break;
            case hxdt.msgcmd.DZActDispatch:
            msgName = 'DZActDispatch';
            break;
            case hxdt.msgcmd.DZActionTurn:
            msgName = 'DZActionTurn';
            break;
            case hxdt.msgcmd.DZTipCallLord:
            msgName = 'DZTipCallLord';
            break;
            case hxdt.msgcmd.DZActConfirmLord:
            msgName = 'DZActConfirmLord';
            break;
            case hxdt.msgcmd.DZActDispatchLordCard:
            msgName = 'DZActDispatchLordCard';
            break;
            case hxdt.msgcmd.DZTipMultiple:
            msgName = 'DZTipMultiple';
            break;
            case hxdt.msgcmd.DZActMultiple:
            msgName = 'DZActMultiple';
            break;
            case hxdt.msgcmd.DZTipDiscard:
            msgName = 'DZTipDiscard';
            break;
            case hxdt.msgcmd.DZActDiscard:
            msgName = 'DZActDiscard';
            break;
            case hxdt.msgcmd.DZInputACK:
            msgName = 'DZInputACK';
            break;
            case hxdt.msgcmd.DZSyncRingEnd:
            msgName = 'DZSyncRingEnd';
            break;
            case hxdt.msgcmd.DZInputOpenCard:
            msgName = 'DZInputOpenCard';
            break;
            case hxdt.msgcmd.DZActRefreshOpenCard:
            msgName = 'DZActRefreshOpenCard';
            break;
            default:
                break;
        }

        //cc.log('+++++++++++++++++++++ ServerInvoke [cmd]: ' + cmd + ' [msg name:] ' + msgName);
        return msgName;
    },

    GetNetIntensity() {
        return SyncPing.GetNetIntensity();
    }
};