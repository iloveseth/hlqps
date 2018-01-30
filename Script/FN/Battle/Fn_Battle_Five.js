import { hxfn } from "./../HXFN";
import { hxjs } from "../../../HXJS/HXJS";
import { hxdt } from "../../DT/HXDT";
import { isNullOrUndefined } from "util";

export let battle_five = {
    //设置数据---------------------------------
    GamePhases: cc.Enum({
        Init : 0,//初始化
        TipChessDown : 1,//提示落子
        WaitChessDown : 2,//等待落子
        Balance:3,//结算
        Finish: 4,//结束
    }),

    RoomPhases: cc.Enum({
        RoomWait: 0,//等待
        RoomCountDown : 1,//开局倒数
        RoomCDBreak: 2,//新玩家加入，倒数被打断
        RingInit: 3,//一局初始化
        RingBegin: 4,//一局开始
        RingEnd: 5,//一局结束
        RoomEnd:6,//结束
    }),

    GameStates: cc.Enum({
        State_0:0,
        State_1:1,
        State_2:2,
        State_3:3,
        State_4:4,
        State_5:5,
    }),

    //需要转换  客户端  0黑1白  服务端1白2黑
    hands:cc.Enum({
        BLACK:0,
        WHITE:1,
    }),
    txtHand: ['黑方','白方'],
    imgChess: ['黑子','白子'],
    atlasName: 'battle_main',

    syncMsg :  [
        'GBTipChessDown',
        'GBActChessDown',
        'GBActionTurn',
        'GBSyncRingBegin',
        'GBSyncRingEnd',
        'GBPlayerGiveup',
        'SyncPlayerReady',
        'GBSyncSetTuition',
        'GBSyncPlayerGiveup',
    ],
    tag : 'Gobang',


    //过程数据---------------------------------
    roomPhase: null,
    gamePhase: null,

    hand:0,

    // needBanance: false,

    playerInfo:null,
    seat:0,

    serverX:0,
    serverY:0,

    curPlayerId:[],
    curPlayerInfo:null,
    myHand:null,

    gameProto: null,

    roles: [],
    uiRoles: null,
    uiNum:2,
    tuition: -1,

    // isInfoChanged: null,

    cdS: 60,

    

    gameState: 1,

    //战斗结果缓存，不能清理，有可能在退出大厅时需要用-------------
    msgResult: null,
    resultRoles: null,
    //--------------------------------------------------------


    isGiveup:false,


    ///////////////////////////////////////////////////////////////////////////////
    // OnInit(){
    //     // this.syncMsg = [
    //     // ];
    // },
    OnStart(){
        // hxfn.level.GetRoomData((msg)=>{
        //     hxfn.five.SetGameProto(msg.gbRoom);
        //     hxfn.global.HandleServerInvokes(this.syncMsg,this.tag,true);
        //     hxjs.util.Notifier.emit('Battle_ReadyData');
        // });

        //this.isGiveup = false;
        var isRefresh = false;
        hxfn.netrequest.SyncReq_GetRoomData(isRefresh, (msg)=>{
            if(msg.result === 0/*OK*/) {
                hxfn.level.roomId = msg.roomId;
                this.SetGameProto(msg.gbRoom);
                hxfn.global.HandleServerInvokes(this.syncMsg,this.tag,true);
                hxjs.util.Notifier.emit('Battle_ReadyData');
            }
        });
    },
    OnReset(){
        //0 THINKING 战斗场景全局数据

        //1,重新初始化本地数据

        //2，重新获取完整服务器战斗数据
        this.OnStart();
    },
    OnEnd(){
        hxfn.global.HandleServerInvokes(this.syncMsg,this.tag,false);


        this.hand = 0;

        //this.needBanance: false,

        this.playerInfo = null;
        this.seat = 0;

        this.serverX = 0;
        this.serverY = 0;

        this.curPlayerId = [];
        this.curPlayerInfo = null;
        this.myHand = null;

        this.gameProto = null;

        this.roles = [];
        this.uiRoles = null;
        this.uiNum = 2;
        this.tuition = -1;
        // isInfoChanged: null,
        this.cdS = 60;


        this.gameState = 1;

        //战斗结果缓存，不能清理，有可能在退出大厅时需要用
        // this.msgResult = null;
        // this.resultRoles = null;

        //this.isGiveup = false;

        // this.syncMsg = null;
        // this.tag = null;
    },
    ///////////////////////////////////////////////////////////////////////////////

    
    SyncGBBegin(){
        var postData = {};
        hxfn.net.Sync(
            postData,
            'GBSyncRingBegin',
            hxdt.msgcmd.GBSyncRingBegin,
        );
    },

    SyncPlayerReady(){
        var postData = {
            playerId:hxfn.role.curUserData.playerData.playerId,
            ready:true,
        };
        hxfn.netrequest.Sync_Comn(
            postData,
            hxfn.netrequest.Msg_SyncPlayerReady,
        );
    },

    SyncGBEnd(){
        var postData = {
            playerInfo:this.playerInfo,
            seat:this.seat,
        };
    },

    SetHand(hand){
        this.hand = hand;
        this.myHand = hand;
    },

    SetServerXY(x,y){
        this.serverX = x;
        this.serverY = y;
    },

    SyncPlayerJoin(){
        var postData = {
            playerInfo:this.playerInfo,
            seat:this.seat,
        };
        hxfn.net.Sync(
            postData,
            'SyncPlayerJoin',
            hxdt.msgcmd.SyncPlayerJoin,
        );
    },

    GBInputChessDown(){
        var postData = {
            blackOrWhite: this.hand + 1,
            x: this.serverX,
            y: this.serverY,
        };
        hxfn.net.Sync(
            postData,
            'GBInputChessDown',
            hxdt.msgcmd.GBInputChessDown,
        );
    },

    SetFee(tuition){
        var postData = {
            tuition: tuition,
        };

        cc.log('fees');
        cc.log(postData);

        hxfn.netrequest.Sync_Comn(
            postData,
            hxfn.netrequest.Msg_SetTuition,
        );
    },

    SetTuition(tuition){
        this.tuition = parseInt(tuition);
    },

    GetTuition(){
        return this.tuition;
    },

    GameBegin(){
        hxfn.util.Notifier.emit('Five_GameBegin',tuition);
    },
    
    SetGameProto(proto){
        this.gameProto = proto;
        this.roomPhase = proto.roomPhase;
        this.gamePhase = proto.gamePhase;
        this.SetTuition(proto.tuition);
        this.roles = proto.players;
        this.SetupUIRoles();
        this.SetupRoleIds();

        var myHand = this.GetRoleById(hxfn.role.curUserData.playerData.playerId).blackOrWhite;

        if(isNullOrUndefined(myHand)||isNaN(myHand))
        return;

        this.SetHand(myHand);
    },

    GetGameProto(){
        return this.gameProto;
    },

    SetupUIRoles(){
        this.uiRoles = new Array(this.uiNum);
        for(var idx = 0;idx!= this.roles.length;++idx){
            this.uiRoles[this.roles[idx].seat] = this.roles[idx];
        }
        this.myId = hxfn.role.curUserData.playerData.playerId;
        cc.log(this.myId);
        if(this.GetSeatById(this.myId) != 0){
            var mySeat = this.GetSeatById(this.myId);
            var tempRole = this.uiRoles[0];
            this.uiRoles[0] = this.GetRoleById(this.myId);
            this.uiRoles[mySeat] = tempRole;
        }

        //通知刷新角色
        // hxjs.util.Notifier.emit('Five_DisplayRoles');
    },

    SetupRoleIds(){
        this.roleIds = new Array(this.roles.length);
        for(var idx = 0;idx != this.roles.length;++idx){
            this.roleIds[idx] = this.GetIdByRole(this.roles[idx]);
        }
    },

    GetIdBySeat(idx){
        for(var idx = 0;idx != this.roles.length;++idx){
            var element = this.roles[idx];
            if(element.seat == idx){
                return element.playerInfo.userData.playerId;
            }
        }
    },

    GetSeatById(id){
        for(var idx = 0;idx != this.roles.length;++idx){
            var element = this.roles[idx];
            if(element.playerInfo.userData.playerId == id){
                return element.seat;
            }
        }
        return -1;
    },

    GetUISeatById(id){
        for(var idx = 0;idx != this.uiRoles.length;++idx){
            var element = this.uiRoles[idx];
            if(element.playerInfo.userData.playerId == id){
                return idx;
            }
        }
        return -1;
    },

    GetIdByRole(role){
        return role.playerInfo.userData.playerId;
    },

    GetRoleById(id){
        var role = null;
        this.roles.forEach(element => {
            if(this.GetIdByRole(element) == id){
                role = element;
            }
        });

        return role;
    },

    //获取当前房间的房主
    GetMaster(){
        if(this.roles == null || this.roles.length == 0){
            return null;
        }
        else{
            return this.gameProto.createrId;
        }
    },

    //判断某个人是不是主家/庄家
    IsMaster(roleId){
        return this.GetMaster() == roleId;
    },

    GetRoomPhase(){
        return this.roomPhase;
    },

    GetGamePhase(){
        return this.gamePhase;
    },

    GetFee(){
        return this.gameProto.tuition;
    },

    ToServerHand(hand){
        return hand + 1;
    },

    ToMyHand(hand){
        return hand - 1;
    },

    Giveup(){
        if(this.myHand == null) {
            hxjs.module.ui.hub.LoadTipFloat('未正确初始化数据!');
            return;
        }

        var postData = {
            blackOrWhite: this.myHand.ToServerHand,
        };
        hxfn.netrequest.Sync_Comn(
            postData,
            hxfn.netrequest.Msg_GBGiveup,
        );
        this.isGiveup = true;
    },

    GetHandFromId(playerId){
        if(playerId == hxfn.role.curUserData.playerData.playerId){
            return this.myHand;
        }
        else if(this.roleIds.indexOf(playerId)!= -1){
            return 1-this.myHand;
        }
        else{
            return -1;
        }
    },

    SetGameState(state){
        this.gameState = state;
    },

    SetGobangResult(msg){
        this.msgResult = msg;

        for(var idx = 0;idx!=this.msgResult.playerRecords.length;++idx){
            for(var idy = 0;idy != this.roles.length;++idy){
                if(this.GetIdByRole(this.roles[idy]) == this.msgResult.playerRecords[idx].playerId){
                    this.roles[idy].roomCoin = this.msgResult.playerRecords[idx].leftCoin;
                }
            }
        }

        var role1 = this.msgResult.playerRecords[0];
        var id = role1.playerId;

        if(role1.winOrLose){

            let roleWin1 = this.GetRoleById(role1.playerId);
            let roleLose1 = this.GetRoleById(this.msgResult.playerRecords[1].playerId);
            this.resultRoles = [roleLose1,roleWin1];
        }
        else{
            let roleLose2 = this.GetRoleById(role1.playerId);
            let roleWin2 = this.GetRoleById(this.msgResult.playerRecords[1].playerId);
            this.resultRoles = [roleLose2,roleWin2];
        }
        
        cc.log('this.resultRoles');
        cc.log(this.resultRoles);
    },



    // 有结算的退出
    QuitRoom4NotMaster(){
        var postData = {
            playerId: hxfn.role.curUserData.playerData.playerId,
        };
        hxfn.netrequest.Req_Comn(
            postData,
            hxfn.netrequest.Msg_QuitRoom,
            function(msg){
                if(msg.result == 0){
                    //关闭信号监听，清理音乐音效等
                    // this.OnEnd();
                    // hxfn.global.HandleServerInvokes(this.syncMsg,this.tag,false);
                    hxjs.uwcontroller.SetState(hxdt.enum_game.Enum_GameState.Lobby);

                    //显示结果 退出前已缓存存储结果！！！
                    // hxfn.five.GetResultRoles();
                    hxjs.module.ui.hub.LoadPanel_Dlg('UI_Battle_Gobang_End');
                }
            }.bind(this),
        );
    },

    //庄家离场，玩家被动（被服务器）退出房间
    KickOutRoom () {
        // hxfn.global.HandleServerInvokes(this.syncMsg,this.tag,false);
        hxjs.uwcontroller.SetState(hxdt.enum_game.Enum_GameState.Lobby);
    },

    //无结算的退出，任何一方点击退出按钮，中途退出游戏
    QuitRoomNoResult(){
        var postData = {
            playerId: hxfn.role.curUserData.playerData.playerId,
        };
        hxfn.netrequest.Req_Comn(
            postData,
            hxfn.netrequest.Msg_QuitRoom,
            function(msg){
                if(msg.result == 0){
                    //关闭信号监听，清理音乐音效等
                    // this.OnEnd();
                    // hxfn.global.HandleServerInvokes(this.syncMsg,this.tag,false);
                    hxjs.uwcontroller.SetState(hxdt.enum_game.Enum_GameState.Lobby);
                }
            }.bind(this),
        );
    },












    //TODO 以下功能应该属于 fn_level
    ////////////////////////////////////////////////////////////////////////////////////////
    // 可重构，不需要重新获取数据，玩家进出客户端主动管理
    UpdateRoomData(){
        var isRefresh = true;
        hxfn.netrequest.SyncReq_GetRoomData(isRefresh, (msg)=>{
            //成功获取房间信息
            //下一步：初始化游戏模型
            if(msg.result == 0/*OK*/) {
                hxfn.level.roomId = msg.roomId;
                switch(hxfn.level.gameType){
                    case 4:{
                        this.SetGameProto(msg.gbRoom);
                        hxjs.util.Notifier.emit('[Gobang]_DataRefresh');
                        break;
                    }
                }
            }
            //如果获取房间信息失败  应该直接退出大厅
            //或者，先获取房间信息，如果成功再跳转页面
            else {
                hxjs.module.ui.hub.LoadDlg_Info('GetRoomDataResp, result: '+ result, '提示');
            }
        });
    },
}