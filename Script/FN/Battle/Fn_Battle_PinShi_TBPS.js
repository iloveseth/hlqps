import { hxjs } from "../../../HXJS/HXJS";
import { hxfn } from "./../HXFN";
import { hxdt } from "../../DT/HXDT";

//此类特供给拼十玩法战斗场景

export let battle_pinshi_tbps = 
{
    //==============================================================
    OnStart(){
        this.HandleServerInfo(true);
    },
    
    OnReset (){
        
    },

    OnEnd(){
        this.HandleServerInfo(false);
    },
    //==============================================================

    //处理牌的规则///////////////////////////////////////////////////
    //玩家自己
    //Recover_My_Show4_Open
    //Recover_My_Show5_Open
    //Recover_My_Show4A1
    //Recover_My_Show5_Close

    //其他玩家
    //Recover_Other_Show4_Close
    //Recover_Other_Show5_Close
    //Recover_Other_Show5_Open

    HandleCards (idx, inhand, niu) {
        if(!hxfn.battle.uiMain)
        return;

        var cardMgr = hxfn.battle.uiMain.scr_conCardMgr;
        if(!cardMgr)
        return;


        //HACK 这里的潜规则是，玩家永远处于0号位置
        //5张牌 一定是全开或者全关
        if(idx === 0) {
            if(inhand.length ===5){
                if(hxfn.battle.CheckAllShowed(inhand)) {
                    cardMgr.Recover_My_Show5_Open(inhand, niu);
                }
                else{
                    cardMgr.Recover_My_Show5_Close(idx);
                }
            }
        }
        else {
            if(inhand.length ===5){
                if(hxfn.battle.CheckAllShowed(inhand)) {
                    cardMgr.Recover_Other_Show5_Open(idx, inhand, niu);
                }
                else {
                    cardMgr.Recover_Other_Show5_Close(idx);
                }
            }
        }
    },

    ////////////////////////////////////开始：战斗即时切入恢复///////////////////////////////////////
    // 实时战斗信息
    // optional PlayerBriefProto playerInfo = 1;
    // optional int32 seat = 2;
    // repeated int32 inHand = 3;     //手牌
    // optional bool isBanker = 4;       //是否庄家
    // optional int32 bankerMulti = 5;     //庄倍数
    // optional int32 playerMulti = 6;     //闲家下注
    // optional int32 niu = 7;             //选牛结果
    // optional int64 roomCoin = 8;        //房间币，根据房间不同
    // optional bool isRubPoker = 9;       //是否亮过牌
    // repeated int32 vieBankerMultiList = 10;  //抢庄倍数列表
    // optional int32 vieBankerMaxLimit = 11;   //抢庄倍数索引
    // repeated int32 chipInMultiList = 12;    //下注倍数列表
    // optional int32 chipInMaxLimit = 13;     //下注倍数索引
    // optional int32 cdMS = 14;               //当前状态的倒计时，如果=0就是没有
    // optional bool isJoinCurrentRing = 15;   //是否参与当前轮游戏
    
    //!!!用来处理信息，并且广播给原有的显示对象进行显示，但是应该有另外一套静默显示的表现，而不是沿用一般的有动画表现的显示
    SetBattleInsInfo:function (info, idx) {
        var roomPhase = hxfn.battle.roomPhase;
        var gamePhase = hxfn.battle.gamePhase;

        var pid = info.get('playerInfo').get('userData').get('playerId');

        cc.log('============roomPhase: ' + roomPhase);
        cc.log('============gamePhase: ' + gamePhase);
        if(roomPhase <= hxfn.battle_pinshi.Enum_RoomPhase.RingInit|| roomPhase > hxfn.battle_pinshi.Enum_RoomPhase.RoomEnd || gamePhase >= hxfn.battle_pinshi.Enum_GamePhase.Finish)
            return;


        //目前的逻辑下UI索引第一位一定是玩家自己！！！
        var isMyself = pid === hxfn.role.playerId;
        // if(isMyself){
        //     //处理是否参与当前一轮游戏
        //     hxfn.battle.hasPlayedCurGame = info.get('isJoinCurrentRing');
        //     // cc.log('myself hasPlayedCurGame: ' + hxfn.battle.hasPlayedCurGame);
        //     hxjs.util.Notifier.emit('Battle_Check_JoinCurrentRing', hxfn.battle.hasPlayedCurGame);
        // }

        /////////////////////////////////////////////////////////////////////////////////////////////////
        //                                 如果不在牌局中，则不需要处理一下信息！！！
        /////////////////////////////////////////////////////////////////////////////////////////////////
        if(!hxfn.battle.CheckJoinedCurrentRing(info)) 
            return;
        
        //处理倒计时--------------------------------------------------
        if(isMyself){
            var cd = info.get('cdMS');
            if(cd > 0) {
                //TODO:
                var typ = '请等待：';//hxfn.battle_pinshi.Enum_EventCD.BankerVie;
                hxjs.util.Notifier.emit('Battle_Recover_0CD', [cd, typ]);
            }
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////
        //全局都用
        var inHand = info.get('inHand');
        var niu = info.get('niu');

        // //已经确定庄家
        // var isBanker = info.get('isBanker');
        // if(isBanker) {
        //     hxfn.battle_pinshi.bankerId = pid;
        //     hxjs.util.Notifier.emit('Battle_Recover_2Banker_SureBanker', [idx, info.get('bankerMulti')]);
        // }

        // //2, 抢庄阶段，只有抢庄阶段结束前才显示倍数
        // if(gamePhase <= hxfn.battle_pinshi.Enum_GamePhase.ConfirmBanker){
        //     var mlt = info.get('bankerMulti');
        //     if(mlt > 0) {
        //         hxjs.util.Notifier.emit('Battle_Recover_2Banker_QZRatio', [idx, mlt]);
        //     }
        // }

        // // 3, 下注阶段
        // if(gamePhase >= hxfn.battle_pinshi.Enum_GamePhase.WaitChipin){
        //     if(!isBanker){
        //         hxjs.util.Notifier.emit('Battle_Recover_3Chipin_Ratio', [idx, info.get('playerMulti')]);
        //     }
        // }

        //4, 处理手牌开牌结果
        //处理牛牛结果：显示十带几
        if(gamePhase >= hxfn.battle_pinshi.Enum_GamePhase.WaitNiuNiu){
            // cc.log('@@@@@@@@@@@@@@@@@@@@:' + info.get('niu'));
            if(niu!= null && niu>=0 && info.get('isRubPoker')/*且已经亮牌！！！*/) {
                hxjs.util.Notifier.emit('Battle_Recover_5Result_NiuTip', [idx, inHand, niu, info.get('niumulti')]);
            }
        }

        //5, 结算阶段
        


        
        ////////////////////////////////////////////////////////////////////////////////////////////////
        //通过牌是0就显示牌背面， 通过牌是非0就显示正常的牌
        //针对中途加入的人（不在牌局中的话不发牌）
        // // if(hxfn.battle.CheckJoinedCurrentRing(info))
        // hxjs.util.Notifier.emit('Battle_Recover_0Cards', [idx, inHand, niu/*只是用来显示牌的样式（比如3+2）*/]);
        this.HandleCards(idx, inHand, niu);

        /////////////////////////////////////////////////////////////////////////////////////////////////
        //如果是玩家自身的话，需要处理是否显示交互面板！！！
        if(isMyself) {
            // //如果是2 抢庄阶段，且玩家自身未有操作过，则弹出抢庄面板
            // // if(gamePhase >= 3/*TipVieBanker*/ && gamePhase < 5) {
            // if(gamePhase >= hxfn.battle_pinshi.Enum_GamePhase.TipVieBanker && gamePhase <= hxfn.battle_pinshi.Enum_GamePhase.WaitVieBanker) {
            //     if(hxfn.battle_pinshi.HasNotVieBanker(info.get('bankerMulti'))) {
            //         hxjs.util.Notifier.emit('Battle_Recover_Input_2Banker', [info.get('vieBankerMultiList'), info.get('vieBankerMaxLimit')]);
            //     }
            // }

            // //如果是3 下注阶段，且玩家自身未有下注操作，则弹出下注面板
            // if(gamePhase >= 6/*WaitChipin*/ && gamePhase <= 7/*ShowHand*/) {
            //     if(hxfn.battle_pinshi.HasNotChipin(info.get('playerMulti'))) {
            //         // repeated int32 vieBankerMultiList = 10;  //抢庄倍数列表
            //         // // optional int32 vieBankerMaxLimit = 11;   //抢庄倍数索引
            //         hxjs.util.Notifier.emit('Battle_Recover_Input_3Chipin', [info.get('chipInMultiList'), info.get('chipInMaxLimit')]);
            //     }
            // }
                
            //如果是4 亮牌阶段，且玩家没有亮过牌，则显示亮牌、搓牌面板
            // if(gamePhase >=hxfn.battle_pinshi.Enum_GamePhase.WaitNiuNiu && gamePhase <= hxfn.battle_pinshi.Enum_GamePhase.Balance/*可能只需要处理wait niuniu 阶段*/) {
            //     if(!info.get('isRubPoker')/*亮过牌*/) {
            //         hxjs.util.Notifier.emit('Battle_Recover_Input_4Open');
                    
            //         //如果房间设置为搓牌，且当前的hideCard>0,且为计算之前，则存下最后一张牌且弹出搓牌UI
            //         var mylastcard = info.get('hideCard');
            //         // cc.log('====================XXX=======================');
            //         // cc.log(hxfn.battle_pinshi.isRubPoker);
            //         // cc.log(gamePhase);
            //         // cc.log(info.get('hideCard'));
            //         // cc.log(info.get('cdMS'));
            //         // cc.log('====================XXX=======================');
            //         if(hxfn.battle_pinshi.isRubPoker 
            //             && gamePhase <= hxfn.battle_pinshi.Enum_GamePhase.WaitNiuNiu 
            //             && mylastcard!= null
            //             && mylastcard>0)
            //         {
            //             //TODO 重复代码可重构
            //             hxfn.battle.myAllCards[4]= mylastcard;
                        
            //             //且根据剩余时间来关闭
            //             hxfn.comn.StartCD(info.get('cdMS')/1000);
                        
            //             //直接弹页面
            //             hxjs.module.ui.hub.LoadPanel('UI_Battle_RubPoker', null, hxjs.module.ui.hub.rootUI4Scene);
            //         }
            //     }
            // }
        }
    },
    ////////////////////////////////////结束：战斗即时切入恢复///////////////////////////////////////

    HandleServerInfo(isHandle){
        if(isHandle) {
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncForceLeft, this.SyncForceLeft);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncPlayerJoinRoom, this.SyncPlayerJoinRoom);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncPlayerQuitRoom, this.SyncPlayerQuitRoom);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncPlayerLost, this.SyncPlayerLost);
    
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncPlayerReady, this.SyncPlayerReady);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZSyncRingCountdown, this.QZSyncRingCountdown);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZSyncRingCDBreak, this.QZSyncRingCDBreak);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZSyncRingBegin, this.QZSyncRingBegin);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZSyncRingEnd, this.QZSyncRingEnd);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncRoomCoin, this.SyncRoomCoin);
    
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZActDispatch, this.QZActDispatch);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZActVieBanker, this.QZActVieBanker);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZActBanker, this.QZActBanker);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZActChipin, this.QZActChipin);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZActShowHand, this.QZActShowHand);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZActNiuNiu, this.QZActNiuNiu);
            //搓牌为基础玩法：拼十，博眼子，三公都有
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZTipRubPoker, this.QZTipRubPoker);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZTipVieBanker, this.QZTipVieBanker);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZTipChipin, this.QZTipChipin);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.QZTipNiuNiu, this.QZTipNiuNiu);
    
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncRoomChat,this.SyncRoomChat);
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncPlayerSendInterEmoj,this.SyncPlayerSendInterEmoj);
        }
        else {
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncForceLeft);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncPlayerJoinRoom);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncPlayerQuitRoom);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncPlayerLost);
    
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncPlayerReady);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZSyncRingCountdown);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZSyncRingCDBreak);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZSyncRingBegin);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZSyncRingEnd);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncRoomCoin);
    
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZActDispatch);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZActVieBanker);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZActBanker);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZActChipin);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZActShowHand);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZActNiuNiu);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZTipRubPoker);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZTipVieBanker);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZTipChipin);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.QZTipNiuNiu);
    
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncRoomChat);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncPlayerSendInterEmoj);
        }
    },

    SyncPlayerReady:function (data) {
        // 1waiting SetReady 如果是自己已准备，则直接标记为牌局中，否则只有发牌（等倒计时结束）才算
        var pid = data.get('qzPlayer').get('playerInfo').get('userData').get('playerId');
        if(pid === hxfn.role.playerId) {
            hxfn.battle.isBattlePlaying = true;
        }

        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-SyncPlayerReady', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.SyncPlayerReady(data);
    },
    QZSyncRingCountdown:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZSyncRingCountdown', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.QZSyncRingCountdown(data);
    },
    QZSyncRingCDBreak:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZSyncRingCDBreak', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.QZSyncRingCDBreak(data);
    },
    QZSyncRingBegin:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZSyncRingBegin', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Room_Start(data);
    },
    QZSyncRingEnd:function (data) {
        // //THINKING 放在结束且结果表演完成之后
        // hxfn.battle.isBattlePlaying = false;
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZSyncRingEnd', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_SyncRingEnd(data);
    },
    SyncRoomCoin:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-SyncRoomCoin', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_SyncRoomCoin(data);
    },
    SyncForceLeft:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-SyncForceLeft', data);
        // if(hxfn.battle.uiMain)
        //     hxfn.battle.uiMain.SyncForceLeft(data);
        hxfn.battle.SyncForceLeft(data);
    },
    QZActDispatch:function (data) {
        hxfn.battle.isBattlePlaying = true;
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZActDispatch', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_ActDispatch(data);
    },
    QZActVieBanker:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZActVieBanker', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_ActVieBanker(data);
    },
    QZActBanker:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZActBanker', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_ActBanker(data);
    },
    QZActChipin:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZActChipin', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_ActChipin(data);
    },
    QZActShowHand:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZActShowHand', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_ActShowHand(data);
    },
    QZActNiuNiu:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZActNiuNiu', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_ActNiuNiu(data);
    },
    QZTipRubPoker:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZTipRubPoker', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_QZTipRubPoker(data);
    },
    QZTipVieBanker:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZTipVieBanker', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_TipVieBanker(data);
    },
    QZTipChipin:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZTipChipin', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_TipChipin(data);
    },
    QZTipNiuNiu:function (data) {
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-QZTipNiuNiu', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.Game_TipNiuNiu(data);
    },

    SyncRoomChat:function(data){
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-SyncRoomChat', data);
        // if(hxfn.battle.uiMain)
        //     hxfn.battle.uiMain.SyncRoomChat(data);
        hxfn.battle.SyncRoomChat(data);
    },
    SyncPlayerSendInterEmoj: function(data){
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-SyncPlayerSendInterEmoj', data);
        // if(hxfn.battle.uiMain)
        //     hxfn.battle.uiMain.SyncPlayerSendInterEmoj(data);
        hxfn.battle.SyncPlayerSendInterEmoj(data);
    },
    SyncPlayerJoinRoom:function (data){
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-SyncPlayerJoinRoom', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.SyncPlayerJoinRoom(data);
    },
    SyncPlayerQuitRoom:function (data){
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-SyncPlayerQuitRoom', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.SyncPlayerQuitRoom(data);
    },
    SyncPlayerLost:function (data){
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-SyncPlayerLost', data);
        if(hxfn.battle.uiMain)
            hxfn.battle.uiMain.SyncPlayerLost(data);
    },
};