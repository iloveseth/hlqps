import { hxdt } from "../../DT/HXDT";
import { enum_game } from "../../DT/DD/Enum_Game";
import { hxfn } from "./../HXFN";
import { hxjs } from "../../../HXJS/HXJS";
import { log } from "../../../HXJS/Util/Log";
import { isNullOrUndefined } from "util";
import { SyncPing } from "./../Fn_Ping";
import { Fn_Battle_LuoSong } from "./Fn_Battle_LuoSong";
import { Setting_Battle, Enum_ChatType } from "../../DT/DD/Setting_Battle";
import { setting_landlord } from "../../DT/DD/Setting_Battle_Landlord";

//此类供所有战斗场景通用

export let battle =
    {
        //==============================================================
        //一，当前场景所需要的基础显示数据
        //1，房间信息
        curRoom: null,//battle_pinshi.roomData
        curRoomId: '',

        //2，游戏信息：基础信息
        roomPhase: -1,
        gamePhase: -1,
        //==============================================================

        //二，过程数据（2次加工后的信息）----------------------
        allRoles: [],
        uiRoles: [],
        hasPlayedCurGame: false,//false//用来标记玩家是否已在当前的牌局中
        // TODO: 牌局中指：玩家已经点击准备（如玩家不点准备，则按倒计时结束开始发牌算起）到结算完成
        // 房间内是否正在打牌（不管玩家自己是不是参与）
        isBattlePlaying: false,

        myAllCards: [],

        //直接引用战斗ui对象，Fn_Battle的各种游戏玩法类型的fn类作为数据与显示（ui）的解释器
        //UI显示层不负责业务逻辑，抽象成最简单的业务无关的对象，以达到通用
        uiMain: null,//Type: UIPanelScene

        uiRoot4Eff: null,
        uiRoot4Chat: null,
        scr_gConChat: null,// uiChat:null,
        needDownloadRec: null,

        Enum_PlayerTyp: cc.Enum({
            Friend: 1,//牌友
            Free: 2,//在线空闲玩家
        }),

        //重构五子棋
        syncMsg: [
            'SyncPlayerJoinRoom',
            'SyncError',
            'SyncPlayerQuitRoom',
            'SyncForceLeft',
            'SyncPlayerLost',
        ],
        tag: 'Room',
        //==============================================================

        Regist_Main(ui, effRoot, chatRoot) {
            this.uiMain = ui;
            this.uiRoot4Eff = effRoot;
            this.uiRoot4Chat = chatRoot
        },

        //==============================================================
        // OnInit() {},
        OnStart() {
            SyncPing.PingEnd();
            hxfn.account.StartHeartTick(hxfn.net.heartTick_Battle);

            if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.QiangZhuang) {
                hxfn.battle_pinshi.OnStart();
            }
            else if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.Gobang) {
                hxfn.global.HandleServerInvokes(this.syncMsg, this.tag, true);
                hxfn.five.OnStart();
            }
            else if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.FightLandlords) {
                hxfn.battle_landlord.OnStart();
            }
            else if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.LuoSong) {
                if (Fn_Battle_LuoSong.Instance == null) {
                    Fn_Battle_LuoSong.Instance = new Fn_Battle_LuoSong();
                }
                Fn_Battle_LuoSong.Instance.OnStart();
            }
        },

        //1,重置UI
        //2，重新获取数据
        OnReset() {
            //THINKING 战斗场景全局数据
            // this.ResetAllData();
            this.ClearAllRoles();
            hxfn.battle.isBattlePlaying = false;
            hxfn.battle.curRoom = null;

            hxfn.account.StartHeartTick(hxfn.net.heartTick_Battle);

            if (this.uiMain)
                this.uiMain.OnReset();

            if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.QiangZhuang) {
                hxfn.battle_pinshi.OnReset();
            }
            else if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.Gobang) {
                hxfn.five.OnReset();
            }
            else if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.FightLandlords) {
                hxfn.battle_landlord.OnReset();
            }
            else if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.LuoSong) {
                hxfn.battle_LuoSong.OnReset();
            }
        },

        OnEnd() {
            if (this.uiMain)
                this.uiMain.OnEnd();

            hxfn.account.StopHeartTick();
            hxfn.help.ClearChatHistory();

            if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.QiangZhuang) {
                hxfn.battle_pinshi.OnEnd();
            }
            else if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.Gobang) {
                hxfn.global.HandleServerInvokes(this.syncMsg, this.tag, false);
                hxfn.five.OnEnd();
            }
            else if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.FightLandlords) {
                hxfn.battle_landlord.OnEnd();
            }
            else if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.LuoSong) {
                Fn_Battle_LuoSong.Instance.OnEnd();
                Fn_Battle_LuoSong.Instance = null;
            }

            this.ResetAllData();
            this.ClearAllUI();
        },
        //==============================================================

        ResetAllData() {
            //==============================================================
            //当前场景所需要的基础显示数据
            //1，房间信息
            this.curRoom = null;
            this.curRoomId = '';

            //2，游戏信息：基础信息
            this.roomPhase = -1;
            this.gamePhase = -1;

            //每次初始化房间都会对以下数据初始化
            //保护性重置：为了防止金币房与元宝房互相污染（防止初始化失败或者一些特殊处理）
            //2次加工后的信息----------------------
            this.allRoles = [];
            this.hasPlayedCurGame = false;//false//用来标记玩家是否已在当前的牌局中
            this.uiRoles = [];
            // TODO: 牌局中指：玩家已经点击准备（如玩家不点准备，则按倒计时结束开始发牌算起）到结算完成
            // 房间内是否正在打牌（不管玩家自己是不是参与）
            this.isBattlePlaying = false;
            // this.safeGuard=null;//破产信息缓存

            this.myAllCards = [];
        },

        ClearAllUI() {
            //直接引用战斗ui对象，Fn_Battle的各种游戏玩法类型的fn类作为数据与显示（ui）的解释器
            //UI显示层不负责业务逻辑，抽象成最简单的业务无关的对象，以达到通用
            if (this.uiMain) {
                this.uiMain.OnEnd();
                hxjs.module.ui.hub.Unload(this.uiMain.node);
            }
            this.uiMain = null;
            this.UnloadChatUI();
            // if(this.scr_gConChat) {
            //     this.scr_gConChat.OnEnd();
            //     hxjs.module.ui.hub.Unload(this.scr_gConChat.node);
            // }
            // this.scr_gConChat=null;

            this.uiRoot4Eff = null;
            this.uiRoot4Chat = null;
        },

        //清除战斗玩家
        ClearAllRoles() {
            this.allRoles = [];
            this.uiRoles = [];
        },

        //进入房间时的初始房间状态和牌局进行状态
        SetBattlePhase(rp, gp) {
            this.roomPhase = rp;
            this.gamePhase = gp;

            // this.isBattlePlaying = rp>=hxfn.battle_pinshi.Enum_RoomPhase.RingInit && rp < hxfn.battle_pinshi.Enum_RoomPhase.RingEnd;
            if (rp >= hxfn.battle_pinshi.Enum_RoomPhase.RingInit) {
                if (gp >= hxfn.battle_pinshi.Enum_GamePhase.Init && gp < hxfn.battle_pinshi.Enum_GamePhase.Finish)
                    this.isBattlePlaying = true;
            }
            else {
                this.isBattlePlaying = false;
            }
        },

        CheckWaitAnyJoin() {
            //且只有一个玩家（自己本身），且处于为开始倒计时准备和endring结束之后，则弹出提示：等待玩家加入。。。
            var isWaitAnyJoin = !this.isBattlePlaying && this.IsJustMyself();

            hxjs.util.Notifier.emit('Battle_Check_WaitOtherOne', isWaitAnyJoin);

            //TODO 还可以统一处理界面清理
            //如果房间内只剩玩家自己，则下一局不会开始，所以必须找到一个依据来清理战斗过程中产生的视觉对象
        },

        IsJustMyself: function () {
            if (this.allRoles.length == 1) {
                var pid = this.allRoles[0].get('playerInfo').get('userData').get('playerId');
                if (pid === hxfn.role.playerId)
                    return true;
            }

            return false;
        },

        //!!!!!!!!!!!!!!
        /////////////////////////////////////////////////////////////////////////
        //必须考虑到异步加载的问题，快速切战斗，对于那些延时加载对象，有可能表现逻辑触发时，其还没有初始化好！！！！！！
        //需要确保所有视觉对象预备完成才开始getRoomData!!!
        /////////////////////////////////////////////////////////////////////////

        QuitNormal() {
            //跳转
            hxjs.uwcontroller.SetState(enum_game.Enum_GameState.Lobby);

            //从战斗跳转到大厅，则需要默认打开房间选择界面
            window.setTimeout(function () {
                hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_RoomTypMgr_new2');
                this.CheckToShowReason4LeaveBattle();
            }.bind(this), 500);
        },
        QuitFastToRoomList(panel) {
            hxjs.uwcontroller.SetState(enum_game.Enum_GameState.Lobby);

            if (panel != undefined && panel != null)
                hxjs.module.ui.hub.LoadPanel_Dlg(panel);
        },
        QuitFastToShop(index) {
            hxfn.shop.curShop = index;
            hxjs.uwcontroller.SetState(enum_game.Enum_GameState.Lobby);
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Shop_new2');
        },
        QuitFastToTask(index) {
            hxjs.uwcontroller.SetState(enum_game.Enum_GameState.Lobby);
            hxfn.activityAndTask.curSelectMenu = index;//hxfn.activityAndTask.Enum_Menu.Task;
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_ActivityAndMission_new2');
        },
        //如果有系统强迫离开的原因，则显示(需要在这里显示的原因是，该浮窗需要在最上层)
        CheckToShowReason4LeaveBattle() {
            var reason = hxfn.lobby.cacheLeaveBattleReason;
            if (reason) {
                hxjs.module.ui.hub.LoadDlg_Info(reason, '提示');
                hxfn.lobby.cacheLeaveBattleReason = null;
            }
        },

        ////////////////////////////////////开始：战斗玩家管理///////////////////////////////////////////
        InitAllRoles(roles, maxSeats) {
            //初始化战斗玩家
            this.allRoles = roles;
            //初始化战斗玩家为UI显示
            this.SetupUIRoles(maxSeats);

            //检测玩家数量
            this.CheckWaitAnyJoin();
        },
        //增加战斗玩家
        AddRole(role) {
            if (this.CheckHasPlayer(role)) {
                //说明该玩家是离线之后有回到原来房间的玩家
                //获得其Seat idx, 并且把其的离线状态提示清楚！！！
                var idx = this.GetUISeatIdx2(role);
                hxjs.util.Notifier.emit('UI_BattleComeBack', idx);
                return false;
            }

            this.allRoles.push(role);
            cc.log(this.allRoles);
            // var sIdx = -1;
            //不能根据Seat来定位客户端的玩家界面位置，seat发给房间内的所有玩家都是固定的！！！
            //XXX 更新UIRoles,以前根据客户端的逻辑和选座--->现在接受服务端的同步信息
            cc.log(this.uiRoles);
            for (var j = 0; j < this.uiRoles.length; j++) {
                if (this.uiRoles[j] == null) {
                    this.uiRoles[j] = role;
                    // sIdx = j;
                    break;
                }
            }

            this.CheckWaitAnyJoin();

            // return sIdx;
            return true;
        },
        //减少战斗玩家
        RmvRole(roleid) {
            var idx = this.GetIdxByID(roleid);
            if (idx !== -1)
                this.allRoles.removeAt(idx);

            //更新UIRoles
            var seatIdx = this.GetUISeatIdx(roleid);
            this.uiRoles[seatIdx] = null;

            this.CheckWaitAnyJoin();
        },

        ResetRoles: function (infs) {
            var infos = infs;
            var idx = -1;
            var myInfo = null;
            for (var i = 0; i < infos.length; i++) {
                var e = infos[i];
                if (e != null) {
                    if (e.get('playerInfo').get('userData').get('playerId') === hxfn.role.playerId) {
                        idx = i;
                        myInfo = e;
                        break;
                    }
                }
            }

            //if idx == -1 Error
            infos.removeAt(idx);
            infos.unshift(myInfo);

            return infos;
        },

        GetIdxByID: function (playerid) {
            for (let index in this.allRoles) {
                if (!this.allRoles[index] || !this.allRoles[index]['playerInfo'])
                    continue;
                if (this.allRoles[index]['playerInfo']['userData'].get('playerId') === playerid)
                    return index;
            }

            return -1;
        },

        CheckHasPlayer: function (player) {
            //判断房间内玩家是否存在
            //首先获取id列表，然后判断id是否存在
            //不能直接通过this.allRoles.indexOf(player)的方式判断

            // this.MakeIdList();
            // var playerIdList = [];
            // cc.log(this.allRoles);
            // this.allRoles.forEach(function(e){
            //     var curId = e.playerInfo.userData.playerId;
            //     if(playerIdList.indexOf(curId) === -1){
            //         playerIdList.push(curId);
            //     }
            // })

            // var curPlayerId =  player.playerInfo.userData.playerId;
            // return playerIdList.indexOf(curPlayerId) !== -1;

            var isHas = false;

            var curPlayerId = player.playerInfo.userData.playerId;
            this.allRoles.forEach(function (e) {
                var id = e.playerInfo.userData.playerId;
                if (curPlayerId === id) {
                    isHas = true;
                }
            })

            return isHas;
        },

        SetupUIRoles: function (maxUISeats) {
            //首先需要把当前玩家自己放到第一索引位置
            var infos = this.ResetRoles(this.allRoles);

            //转换成UI显示需要的数据格式
            // 需求由5个玩家变成多个6个玩家同局
            this.uiRoles = new Array(maxUISeats);

            for (var i = 0; i < infos.length; i++) {
                var e = infos[i];
                if (e != null) {
                    this.uiRoles[i] = e;
                }
                else {
                    this.uiRoles[i] = null;
                }
            }
        },

        CheckJoinedCurrentRing(battlePlayer) {
            //斗地主没有是否已加入本局，一定是加入的
            //HACK
            if (hxfn.map.curGameTypId == hxdt.enum_game.Enum_GameType.FightLandlords)
                return true;
            else
                return battlePlayer.isJoinCurrentRing;
        },

        CheckJoinedCurrentRingById(playerId) {
            var idx = hxfn.battle.GetUISeatIdx(playerId);

            if (idx >= 0 && this.uiRoles[idx]) {
                return this.uiRoles[idx].isJoinCurrentRing;
            }

            return false;
        },

        //这里是指所有在场，且正在牌局中玩的玩家
        GetValidSeatIdx() {
            var idxs = [];
            for (var i = 0; i < this.uiRoles.length; i++) {
                var element = this.uiRoles[i];
                if (element != null) {
                    //应该判断所有的玩家是否在牌局中玩，而不是仅仅自己
                    if (this.CheckJoinedCurrentRing(element))
                        idxs.push(i);
                }
            }

            return idxs;
        },
        //这里是所有在场的玩家
        // GetValidSeatIdx () {
        //     var idxs = [];
        //     for (var i = 0; i < this.uiRoles.length; i++) {
        //         var element = this.uiRoles[i];
        //         if(element != null) {
        //             if(i=== 0/*ui上，玩家自己永远在一号位*/) {
        //                 if(hxfn.battle.hasPlayedCurGame)
        //                     idxs.push(i);
        //             }
        //             else{
        //                 idxs.push(i);
        //             }
        //         }
        //     }

        //     return idxs;
        // },

        GetUISeatIdx(playerid) {
            for (let i = 0; i < this.uiRoles.length; i++) {
                if (!this.uiRoles[i] || !this.uiRoles[i]['playerInfo'])
                    continue;
                
                let pid = this.uiRoles[i]['playerInfo']['userData'].get('playerId');
                if (pid == playerid)
                    return i;
            }

            return -1;
        },

        GetUISeatIdx2(player) {
            var curPlayerId = player.playerInfo.userData.playerId;
            return this.GetUISeatIdx(curPlayerId);
        },

        GetSexBySeat(idx) {
            return this.uiRoles[idx]['playerInfo']['userData'].get('sex');
        },

        GetSexByPlayerId(pid) {
            var sex = 0;
            // sex = 3;             //玩家性别， 0 unkown, 1 male, 2 female
            this.allRoles.forEach(function (element) {
                if (element.get('playerInfo').get('userData').get('playerId') === pid)
                    sex = element.get('playerInfo').get('userData').get('sex');
            }.bind(this), this);

            return sex;
        },
        GetNameByPlayerId(pid) {
            let idx = this.GetUISeatIdx(pid);
            return idx>=0 ? this.uiRoles[idx]['playerInfo']['userData'].get('nickName'):'';
        },

        GetPlayerInfoByPlayerId(pid) {
            var playerInfo;
            // sex = 3;             //玩家性别， 0 unkown, 1 male, 2 female
            this.allRoles.forEach(function (element) {
                if (element.get('playerInfo').get('userData').get('playerId') === pid)
                    playerInfo = element.get('playerInfo').get('userData');
            }.bind(this), this);

            return playerInfo;
        },

        ResetAllPlayersJoinCurrentRingState() {
            this.allRoles.forEach(function (element) {
                if (element)
                    element.isJoinCurrentRing = true;
            }.bind(this), this);

            this.uiRoles.forEach(function (element) {
                if (element)
                    element.isJoinCurrentRing = true;
            }.bind(this), this);
        },
        ////////////////////////////////////结束：战斗玩家管理///////////////////////////////////////////



        ////////////////////////////////////开始：战斗牌组管理///////////////////////////////////////////
        GetIdxByCardId(cardid) {
            return this.myAllCards.indexOf(cardid);
        },

        GetCardPointInfo(cardNum) {
            //cardid 可能的值为 1 到 52
            //value: (suit - 1) * 13 + (point - 1),
            // cc.log('!!!!!!!!!!!!!!!!!!!!!!!! cardNum: ' + cardNum);
            var suit = parseInt((cardNum - 1) / 13) + 1;
            var point = ((cardNum - 1) % 13) + 1;
            // cc.log('!!!!!!!!!!!!!!!!!!!!!!!! suit: ' + suit);
            // cc.log('!!!!!!!!!!!!!!!!!!!!!!!! point: ' + point);

            return {
                'suit': suit,
                'point': point,
            }
        },

        //牌背与牌正的显示规则-------------------------------------------
        //检测蒙几张牌
        // var backCardCount = 0;
        // if(inHand != null && inHand.length >0) {
        //     for (let i = 0; i < inHand.length; i++) {
        //         if(inHand[i]===0){
        //             backCardCount+=1;
        //         }
        //     }
        // }

        // if(backCardCount === 5) {

        // }
        CheckShowCardsIdx(inhand) {
            var arr = [];

            for (let i = 0; i < inhand.length; i++) {
                if (inhand[i] > 0) {
                    arr.push(i);
                }
            }

            return arr;
        },

        CheckAllShowed(inhand) {
            var isAllShowed = true;
            for (let i = 0; i < inhand.length; i++) {
                if (inhand[i] <= 0) {
                    isAllShowed = false;
                }
            }

            cc.log('isAllShowed:' + isAllShowed);
            cc.log(inhand);

            return isAllShowed;
        },

        SetCard(cardNum, cardHolder, atlas = 'battle_cards') {
            let cardAsset = null;

            if (cardNum > 0) {
                if (cardNum == 53)
                    cardAsset = '14_2';//小王
                else if (cardNum == 54)
                    cardAsset = '14_1';//大王
                else {
                    var card = hxfn.battle.GetCardPointInfo(cardNum);
                    if (card) {
                        cardAsset = card['point'] + '_' + card['suit'];
                    }
                    else {
                        log.error('cardNum > 0, but the value is overflow: ' + cardNum);
                    }
                }

                if (isNullOrUndefined(cardAsset)) return;

                // log.warn('ui: cardAsset: ' + cardAsset);
                // log.warn('ui: cardHolder: ' + cardHolder.name);
                hxjs.module.asset.LoadAtlasSprite(
                    atlas,
                    cardAsset,
                    cardHolder);
            }
            else if (cardNum == 0) {
                cardAsset = 'back';
                hxjs.module.asset.LoadAtlasSprite(
                    atlas,
                    cardAsset,
                    cardHolder);
            }
            else {
                log.error('cardNum < 0, the value is invalid: ' + cardNum);
            }
        },
        ////////////////////////////////////结束：战斗牌组管理///////////////////////////////////////////


        CheckToShopWhenForLeft(reasonId, reasonContent) {
            //HACK---------------------------------------------
            //由于服务器会主动踢人，所有客户端只需要在表现上退出房间

            //-------------------------------------------------

            // //!!! 已经离开房间，不管什么原因都应该弹提示，如果是破产情况，则应该在之前会弹出相应的处理界面
            // //由于破产离开房间,会通过效应消息 hxdt.msgcmd.NoticeSafeGuard 来进行处理！！！
            // //如果是金币不足或者元宝不足不弹窗，会走破产流程
            if (reasonId === 2 || reasonId === 3) {
                if (reasonId === 2) {
                    hxfn.comn.HandleSafeGuard(1, true);
                }
                else {
                    hxfn.comn.HandleSafeGuard(2, true);
                }
                return;
            }

            // hxjs.util.Notifier.emit('UI_BattleQuit');
            hxfn.battle.QuitNormal();

            var str = reasonContent;
            if (str == null || str == '')
                str = this.Enum_LeftReason.reasonId;
            if (str == null || str == '')
                str = '离开房间';

            hxfn.lobby.cacheLeaveBattleReason = str;

            //XXXXXXXXXXXXXX
            // //HACK 因为离开战斗房间会弹出房间选择界面，所以延时可以确保离开原因在最上层
            // window.setTimeout(function(){
            //     hxjs.module.ui.hub.LoadDlg_Info(str, '提示');
            // },1000);
        },

        Enum_LeftReason: cc.Enum({
            0: '被踢出房间！',
            1: '房间已经关闭！',
            2: '您当前拥有的金币不足，请前往充值!',
            3: '您当前拥有的元宝不足，请前往充值!',
        }),

        ////////////////////////////////////////////////////////////////////////////////////////////////

        GetEmojInfo(id) {
            //先根据ID获取icon 
            var msgEmoj = hxfn.role.curUserData.playerInterEmojInfo.interEmojProto;
            var icon = null;
            for (var i = 0; i < msgEmoj.length; ++i) {
                if (msgEmoj[i].get("id") == id) {
                    icon = msgEmoj[i].get("icon");
                    break;
                }
            }
            //然后根据Icon获取本地信息
            if (icon != null) {
                var emojs = Setting_Battle.EmojTypes;
                for (var i = 0; i < emojs.length; i++) {
                    if (emojs[i]["icon"] == icon) {
                        return emojs[i];
                    }
                }
            }

            return null;
        },

        FlyEmojFromPos2Pos(id, fromPos, toPos, con) {
            var emoj = this.GetEmojInfo(id);

            hxjs.module.ui.hub.LoadPanel(emoj['prefab'], (prefab) => {
                var scr = prefab.getComponent('AnimEmojFly');
                scr.OnInit(emoj, this.GetSeatPoses(fromPos), this.GetSeatPoses(toPos), fromPos, toPos);
                scr.Play();
            }, con);
        },

        GetSeatPoses (idx) {
            switch (hxfn.map.curGameTypId) {
                case hxfn.map.Enum_GameplayId.QiangZhuang:
                    return hxdt.setting_niuniu.SeatPoses[idx];
                    break;
                case hxfn.map.Enum_GameplayId.CombatEye://博眼子
                    // return hxdt.setting_niuniu.SeatPoses[idx];
                    break;
                case hxfn.map.Enum_GameplayId.Gobang://五子棋
                    // return hxdt.setting_niuniu.SeatPoses[idx];
                    break;
                case hxfn.map.Enum_GameplayId.FightLandlords://斗地主
                    return setting_landlord.SeatPoses[idx];
                    break;
                case hxfn.map.Enum_GameplayId.LuoSong://罗松
                    // return hxdt.setting_niuniu.SeatPoses[idx];
                    break;
                default:
                    break;
            }
            return 0;
        },

        ////////////////////////////////////////////加载公共UI////////////////////////////////////////////
        LoadChatUI(path) {
            //聊天信息
            hxjs.module.ui.hub.LoadPanel(path, function (prefab) {
                if (prefab) {
                    this.scr_gConChat = prefab.getComponent('UIBattleChat');
                    if (this.scr_gConChat)
                        this.scr_gConChat.OnInit();
                }
            }.bind(this), this.uiRoot4Chat);
        },
        UnloadChatUI() {
            if (this.scr_gConChat != null)
                this.scr_gConChat.OnEnd();

            if (this.scr_gConChat && this.scr_gConChat.node)
                hxjs.module.ui.hub.Unload(this.scr_gConChat.node);
        },

        ///////////////////////////////////////////////////////////////////////////////////////////////
        //额外功能
        SyncPlayerSendInterEmoj: function (info) {
            var toPlayerId = info.get('toPlayerId');
            var playerId = info.get('playerId');
            var id = info.get('id');
            hxfn.battle.FlyEmojFromPos2Pos(id, hxfn.battle.GetUISeatIdx(playerId), hxfn.battle.GetUISeatIdx(toPlayerId), this.uiRoot4Eff);
        },
        SyncRoomChat: function (info) {

            var playerId = info.get('playerId');
            var chatType = info.get('chatType');
            var chatMsg = info.get('chatMsg');
            cc.info('@@Receive chat' + chatType);
            if (chatType == Enum_ChatType.CHAT_MSG) {
                if (this.scr_gConChat != null)
                    this.scr_gConChat.ShowChatMsg(info);
                var chatMsgs = Setting_Battle.ChatMsgs;
                var sex = hxfn.battle.GetSexByPlayerId(playerId);
                if (sex == 0) {
                    sex = 1;
                }
                for (var i = 0; i < chatMsgs.length; i++) {
                    if (chatMsgs[i].txt == chatMsg) {
                        hxjs.module.sound.PlayChat(i + (sex - 1) * chatMsgs.length);
                        break;
                    }
                }

            }
            else if (chatType == Enum_ChatType.CHAT_FACE) {
                if (this.scr_gConChat != null)
                    this.scr_gConChat.ShowChatFace(info);
            }
            else if (chatType == Enum_ChatType.CHAT_TEXT) {
                if (this.scr_gConChat != null)
                    this.scr_gConChat.ShowChatMsg(info);

                var playerInfo = hxfn.battle.GetPlayerInfoByPlayerId(playerId);
                hxfn.help.AddChatHistory(chatMsg, playerInfo.get('playerIcon'), playerInfo.get('nickName'), playerId);
            }
            else if (chatType == Enum_ChatType.CHAT_VOICE) {
                var chatMsg = info.get('chatMsg');
                var playerId = info.get('playerId');
                var timeSpit = chatMsg.indexOf('|');
                var time = chatMsg.substring(0, timeSpit);
                var fileID = chatMsg.substring(timeSpit + 1);
                this.needDownloadRec = info;
                hxfn.bridge.DownloadRecord(fileID);
                //this.scr_gConChat.ShowChatVoice(info);
            }
        },
        OnRecordUploadSuccess: function (data) {
            cc.info('@@OnRecordUploadSuccess =' + data);
            var timeSpit = data.indexOf('|');
            var time = data.substring(0, timeSpit);
            var fileID = data.substring(timeSpit + 1);
            if (fileID != null && fileID.length > 0) {
                cc.info('@@Ready to send voice');
                //发送请求
                var postData = {
                    chatMsg: data,
                    chatType: Enum_ChatType.CHAT_VOICE,
                };
                hxfn.net.Sync(
                    postData,
                    'PrimChat',
                    hxdt.msgcmd.PrimChat//150
                );
            }
        },
        OnRecordDownloadSuccess: function (fileID) {
            if (this.scr_gConChat != null)
                this.scr_gConChat.ShowChatVoice(this.needDownloadRec);
        },

        //玩家战斗变化响应 ////////////////////////////////////////////////////////////////////////////////////
        SyncPlayerJoinRoom: function (info) {
            var player = null;

            //HACK
            if (hxfn.map.curGameTypId == hxdt.enum_game.Enum_GameType.FightLandlords)
                player = info.get('player');
            else
                player = info.get('qzPlayer');

            if (hxfn.battle.AddRole(player)) {
                if (this.uiMain)
                    this.uiMain.SyncPlayerJoinRoom(player);
                // var seatIdx = hxfn.battle.GetUISeGetUISeatIdx2(player);
                // this.scr_lstRole.SetItem(seatIdx,player);
            }
        },
        SyncPlayerLost: function (info) {
            var playerid = info.get('playerId');
            var seatIdx = hxfn.battle.GetUISeatIdx(playerid);
            // 此时并不是真正退出，只是用来做表现，如果真正退出会收到Quit消息
            hxjs.util.Notifier.emit('UI_BattleLost', seatIdx);
        },
        SyncPlayerQuitRoom: function (info) {
            //如果是自己被Quit，则退出房间(直接退，不发请求)
            var playerid = info.get('playerId');
            if (playerid === hxfn.role.playerId) {
                hxfn.battle.QuitNormal();
            }
            else {
                if (this.uiMain)
                    this.uiMain.SyncPlayerQuitRoom(playerid);

                hxfn.battle.RmvRole(playerid);
            }
        },
        SyncForceLeft: function (info) {
            var pid = info.get('playerId');
            var reason = info.get('reason');
            var reasonContent = info.get('reasonContent');
            cc.log('SyncForceLeft pid:' + pid);
            cc.log('SyncForceLeft reason:' + reason);

            //!!!绝对不会发给其他人
            //如果离开的是自己，则弹出原因
            if (pid === hxfn.role.playerId) {
                hxfn.battle.CheckToShopWhenForLeft(reason, reasonContent);
            }
        },

        //牌局内货币同步 ////////////////////////////////////////////////////////////////////////////////////
        SyncRoomCoin(playersCoinInfo) {
            var allPlayerCoins = playersCoinInfo.get('playerCoins');

            var idx;
            var count;
            allPlayerCoins.forEach(function (element) {
                if (element != null) {
                    idx = hxfn.battle.GetUISeatIdx(element.get('playerId'));
                    count = parseInt(element.get('roomCoin'));
                    hxjs.util.Notifier.emit('UI_BattleSyncCoin', [idx, count]);
                }
            }, this);
        }
    }