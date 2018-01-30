import { hxfn } from "./../HXFN";
import { hxjs } from "../../../HXJS/HXJS";
import { hxdt } from "../../DT/HXDT";
import UISceneBattleLandlord from "../../UI/Battle/5_Landlord/UISceneBattleLandlord";

export class Fn_Battle_Landlord_Classic implements IFn 
{
    //////////////////////////////////////
    constructor() {
        //初始化
    }
    
    OnStart() {
        this.HandleServerInfo(true);
    }

    OnReset() {
    }

    OnEnd() {
        this.HandleServerInfo(false);
    }
    ////////////////////////////////////////

    ////////////////////////////////////开始：战斗即时切入恢复///////////////////////////////////////
    //!!!用来处理信息，并且广播给原有的显示对象进行显示，应使用另外一套静默显示的表现，而不是沿用一般的有动画表现的显示
    SetBattleInsInfo (info:any, idx:number) {
        //*********************************************************
        //以下为重连模式回到房间时，需要进行的现场恢复操作
        //*********************************************************
        var roomPhase = hxfn.battle.roomPhase;
        var gamePhase = hxfn.battle.gamePhase;
        cc.log('============roomPhase: ' + roomPhase);
        cc.log('============gamePhase: ' + gamePhase);
        if(roomPhase <= hxfn.battle_pinshi.Enum_RoomPhase.RingInit|| roomPhase > hxfn.battle_pinshi.Enum_RoomPhase.RoomEnd || gamePhase >= hxfn.battle_pinshi.Enum_GamePhase.Finish)
        return;
        
        //如果不在牌局中，则不需要处理一下信息！！！
        if(!hxfn.battle.CheckJoinedCurrentRing(info)) 
        return;
        
        var pid = info.get('playerInfo').get('userData').get('playerId');

        //目前的逻辑下UI索引第一位一定是玩家自己！！！
        let isMyself = pid === hxfn.role.playerId;
        //处理倒计时--------------------------------------------------
        if(isMyself){
            let cd = info.get('cdMS');
            if(cd > 0) {
                //TODO:
                let typ = '请等待：';//hxfn.battle_pinshi.Enum_EventCD.BankerVie;
                hxjs.util.Notifier.emit('Battle_Recover_0CD', [cd, typ]);
            }
        }








    }

    HandleServerInfo(isHandle){
        if(isHandle) {
            //更新其他玩家进出
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncForceLeft, this.SyncForceLeft.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZSyncPlayerJoin, this.SyncPlayerJoinRoom.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncPlayerQuitRoom, this.SyncPlayerQuitRoom.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncPlayerLost, this.SyncPlayerLost.bind(this));
    
            // 注册来自服务器消息
            // 1, 房间状态
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZSyncRingCountdown, this.DZSyncRingCountdown.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZSyncRingCDBreak, this.DZSyncRingCDBreak.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZSyncRingBegin, this.DZSyncRingBegin.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZSyncRingEnd, this.DZSyncRingEnd.bind(this));
        
            // 2, 游戏状态
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncRoomCoin, this.SyncRoomCoin.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZSyncPlayerReady, this.DZSyncPlayerReady.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZSyncRingMulti, this.DZSyncRingMulti.bind(this));

            //Tip
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZTipOpenCard, this.DZTipOpenCard.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZTipCallLord, this.DZTipCallLord.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZTipVieLord, this.DZTipVieLord.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZTipMultiple, this.DZTipMultiple.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZTipDiscard, this.DZTipDiscard.bind(this));
            //Act
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZActCallLord, this.DZActCallLord.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZActShowLordCard, this.DZActShowLordCard.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZActDispatch, this.DZActDispatch.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZActDispatchLordCard, this.DZActDispatchLordCard.bind(this));
            // hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZActOpenCard, this.DZActOpenCard.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZActVieLord, this.DZActVieLord.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZActMultiple, this.DZActMultiple.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZActConfirmLord, this.DZActConfirmLord.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZActDiscard, this.DZActDiscard.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZActionTurn, this.DZActionTurn.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZActRefreshOpenCard, this.DZActRefreshOpenCard.bind(this));

            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZInputACK, this.DZInputACK.bind(this));
    
            // 3, 额外功能
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncRoomChat,this.SyncRoomChat.bind(this));
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncPlayerSendInterEmoj,this.SyncPlayerSendInterEmoj.bind(this));
        }
        else {
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncForceLeft);//
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncPlayerJoinRoom);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncPlayerQuitRoom);//
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncPlayerLost);
    
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZSyncRingCountdown);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZSyncRingCDBreak);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZSyncRingBegin);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZSyncRingEnd);

            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncRoomCoin);//
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZSyncPlayerReady);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZSyncRingMulti);//

            //Tip
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZTipOpenCard);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZTipCallLord);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZTipVieLord);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZTipMultiple);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZTipDiscard);
            //Act
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZActCallLord);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZActShowLordCard);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZActDispatch);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZActDispatchLordCard);
            // hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZActOpenCard);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZActVieLord);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZActMultiple);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZActConfirmLord);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZActDiscard);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZActionTurn);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZActRefreshOpenCard);
    
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncRoomChat);
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncPlayerSendInterEmoj);
        }
    }

    //通用 ////////////////////////////////////////////////////////////////////////////////////////////////
    private SyncForceLeft (data:any) {
        hxfn.battle.SyncForceLeft(data);
    }
    private SyncPlayerJoinRoom (data:any){
        hxfn.battle.SyncPlayerJoinRoom(data);
    }
    private SyncPlayerQuitRoom (data:any){
        hxfn.battle.SyncPlayerQuitRoom(data);
    }
    private SyncPlayerLost (data:any){
        hxfn.battle.SyncPlayerLost(data);
    }
    private SyncRoomChat(data:any){
        hxfn.battle.SyncRoomChat(data);
    }
    private SyncPlayerSendInterEmoj(data:any){
        hxfn.battle.SyncPlayerSendInterEmoj(data);
    }
    private SyncRoomCoin (data:any) {
        hxfn.battle.SyncRoomCoin(data);
    }
    
    
    
    //特有 /////////////////////////////////////////////////////////////////////////////////////////////////
    //之 普遍
    private DZSyncRingCountdown (data:any) {
        UISceneBattleLandlord.Instance.DZSyncRingCountdown(data);
    }
    private DZSyncRingCDBreak (data:any) {
        UISceneBattleLandlord.Instance.DZSyncRingCDBreak(data);
    }
    private DZSyncRingBegin (data:any) {
        UISceneBattleLandlord.Instance.DZSyncRingBegin();
    }
    private DZSyncRingEnd (data:any) {
        UISceneBattleLandlord.Instance.DZSyncRingEnd(data);
    }
    private DZSyncPlayerReady (data:any) {
        UISceneBattleLandlord.Instance.DZSyncPlayerReady(data);
    }
        

    //之 特殊
    private DZSyncRingMulti(data:any) {
        UISceneBattleLandlord.Instance.DZSyncRingMulti(data);
    }
    private DZTipOpenCard(data:any) {
        UISceneBattleLandlord.Instance.DZTipOpenCard(data);
    }
    private DZTipCallLord(data:any) {
        UISceneBattleLandlord.Instance.DZTipCallLord(data);
    }
    private DZTipVieLord(data:any) {
        UISceneBattleLandlord.Instance.DZTipVieLord(data);
    }
    private DZTipMultiple(data:any) {
        UISceneBattleLandlord.Instance.DZTipMultiple(data);
    }
    private DZTipDiscard(data:any) {
        UISceneBattleLandlord.Instance.DZTipDiscard(data);
    }
    private DZActCallLord(data:any) {
        UISceneBattleLandlord.Instance.DZActCallLord(data);
    }
    private DZActShowLordCard(data:any) {
        UISceneBattleLandlord.Instance.DZActShowLordCard(data);
    }
    private DZActDispatch(data:any) {
        UISceneBattleLandlord.Instance.DZActDispatch(data);
    }
    private DZActDispatchLordCard(data:any) {
        UISceneBattleLandlord.Instance.DZActDispatchLordCard(data);
    }
    // private DZActOpenCard(data:any) {
    //     UISceneBattleLandlord.Instance.DZActOpenCard(data);
    // }
    private DZActVieLord(data:any) {
        UISceneBattleLandlord.Instance.DZActVieLord(data);
    }
    private DZActMultiple(data:any) {
        UISceneBattleLandlord.Instance.DZActMultiple(data);
    }
    private DZActConfirmLord(data:any) {
        UISceneBattleLandlord.Instance.DZActConfirmLord(data);
    }
    private DZActDiscard(data:any) {
        UISceneBattleLandlord.Instance.DZActDiscard(data);
    }
    private DZActionTurn(data:any) {
        UISceneBattleLandlord.Instance.DZActionTurn(data);
    }
    //明牌的玩家，出牌后，向其他人发送刷新的明牌
    private DZActRefreshOpenCard(data:any) {
        UISceneBattleLandlord.Instance.DZActRefreshOpenCard(data);
    }

    private DZInputACK(data:any) {
        UISceneBattleLandlord.Instance.DZInputACK(data);
    }
}