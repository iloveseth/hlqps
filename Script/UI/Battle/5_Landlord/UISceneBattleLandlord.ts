
import UIPanelScene from "../../../../HXJS/Module/UI/Panel/UIPanelScene";
import { hxfn } from "../../../FN/HXFN";
import { hxjs } from "../../../../HXJS/HXJS";
import { hxdt } from "../../../DT/HXDT";
import UIBattleLandlordBasic from "./UIBattleLandlordBasic";
import UIBattleHud from "../Comn/UIBattleHudTS";
import UIBattle0Comn from "../Comn/UIBattle0ComnTS";
import UIBattle0EmptySeat from "../Comn/UIBattle0EmptySeatTS";
import UIBattleRoleMgr_Landlord from "./UIBattleRoleMgr_Landlord";
import UIBattleLandlord0CardMgr from "./Card/UIBattleLandlord0CardMgr";
import UIBattleLandlordResult from "./UIBattleLandlordResult";

import UIBattleLandlordMyUtils from "./UIBattleLandlordMyUtils";
import UIBattleLandlord1Waiting from "./UIBattleLandlord1Waiting";
import UIBattleLandlord2Dispatch from "./UIBattleLandlord2Dispatch";
import UIBattleLandlord3VieLord from "./UIBattleLandlord3VieLord";
import UIBattleLandlord4Chipin from "./UIBattleLandlord4Chipin";
import UIBattleLandlord5Discard from "./UIBattleLandlord5Discard";
import { log } from "../../../../HXJS/Util/Log";
import { isArray, isNullOrUndefined } from "util";
import { Enum_AckResult, Enum_AckTyp } from "../../../DT/DD/Setting_Battle_Landlord";

const {ccclass, property} = cc._decorator;

/*
 * 有6种模式
 * 首先实现经典模式
 * 经典模式有2个可选项：1，是否明牌 2，是否加倍
 * 1，明牌，在多个阶段皆有可选项
 * 2，加倍，在发完牌之后操作
 * 3, 4人玩法是8张底牌（2副牌），其余3人或者2人玩法都是3张底牌，每个人17张牌（1副牌），经典玩法是3人局！！！
 * 
 * 倍数相关信息：1，底牌 2，倍数（随时变化）
 * 
 * 其他：类似之前拼十玩法：有服务费，底分，玩家基本的状态，倒计时表现，手动托管操作，默认农民身份，抢中为地主（庄家）
 * 牌：自己分为剩余手牌和已打出牌，其他玩家只有打出牌
 */

 //叫地主，随机选一名玩家
 //第一个抢地主的叫叫地主，其他随后的玩家抢地主都是抢地主

@ccclass
export default class UISceneBattleLandlord extends UIPanelScene
{
    public static Instance:UISceneBattleLandlord;

    //索引-脚本 =============================================
    //1,静态镶嵌 
    @property({type:UIBattleRoleMgr_Landlord})
    private scr_conRoleMgr:UIBattleRoleMgr_Landlord = null;
    @property({type:UIBattle0EmptySeat})
    private scr_conEmptySeat:UIBattle0EmptySeat = null;
    @property({type:UIBattle0Comn})
    private scr_notify:UIBattle0Comn = null;
    @property({type:UIBattleLandlordMyUtils})
    private scr_0MyUtils:UIBattleLandlordMyUtils = null;
    @property({type:UIBattleLandlord1Waiting})
    private scr_1Waiting:UIBattleLandlord1Waiting = null;
    @property({type:UIBattleLandlord2Dispatch})
    private scr_2Dispatch:UIBattleLandlord2Dispatch = null;
    @property({type:UIBattleLandlord3VieLord})
    private scr_3VieLord:UIBattleLandlord3VieLord = null;
    @property({type:UIBattleLandlord4Chipin})
    private scr_4Chipin:UIBattleLandlord4Chipin = null;
    @property({type:UIBattleLandlord5Discard})
    private scr_5Discard:UIBattleLandlord5Discard = null;
    //2,动态加载
    private scr_basic:UIBattleLandlordBasic = null;
    private scr_hud:UIBattleHud = null;
    private scr_result:UIBattleLandlordResult = null;
    private scr_cardMgr:UIBattleLandlord0CardMgr = null;

    //容器 ==============================================
    //-通用
    @property({type:cc.Node})
    private rootEff:cc.Node = null;
    @property({type:cc.Node})
    private rootChat:cc.Node = null;
    //容器-专用
    @property({type:cc.Node})
    private root_Basic: cc.Node = null;
    @property({type:cc.Node})
    private root_Hud: cc.Node = null;
    @property({type:cc.Node})
    private root_0CardMgr: cc.Node = null;


    private hasEndReal:boolean = false;

    // LIFE-CYCLE CALLBACKS:////////////////////////////////////////////////////////
    protected SetDynamicSubUI () {
        this.dynamicSubUI = [
            ['battle_landlord/UI_Battle_Landlord_Basic', 'UIBattleLandlordBasic',src=>{this.scr_basic = src}],
            ['battle_landlord/UI_Battle_Landlord_Hud', 'UIBattleHudTS',src=>{this.scr_hud = src}],
            ['battle_landlord/UI_Battle_Landlord_Cards', 'UIBattleLandlord0CardMgr',src=>{this.scr_cardMgr = src}],
            ['battle_landlord/UI_Battle_Landlord_Result', 'UIBattleLandlordResult',src=>{this.scr_result = src}],
        ]
    }
    //场景可异步延时UI
    protected GetDynamicAsyncUI () {
        hxfn.battle.LoadChatUI('battle_landlord/UI_Battle_Chat_Landlord');
    }
    public OnStart () {
        if(!UISceneBattleLandlord.Instance)
            UISceneBattleLandlord.Instance = this;

        hxfn.battle.Regist_Main(this, this.rootEff, this.rootChat);
        super.OnStart();
    }
    public OnStartReal(){
        super.OnStartReal();

        if(this.scr_basic)
            this.scr_basic.OnStartReal();

        if(this.scr_hud)
            this.scr_hud.OnStartReal();

        this.HandleRoomType();
        this.SetOriginalPlayers();

        //如果中途加入处于结算阶段，则需要重置一些变量
        if(hxfn.battle.gamePhase == hxfn.battle_pinshi.Enum_GamePhase.Finish) {
            this.Recover_RingEnd();
        }

        // this.CheckJoinCurrentRing();
        this.CheckWaitingReadyBtn();
        hxfn.battle.CheckWaitAnyJoin();

        this.hasEndReal = true;
    }

    protected DefaultNotify (isHandle:Boolean) {
        if(isHandle) {
            hxjs.util.Notifier.on('Battle_Check_WaitOtherOne', this.WaitOtherOne, this);
        }
        else{
            hxjs.util.Notifier.on('Battle_Check_WaitOtherOne', this.WaitOtherOne, this);
        }
     }

    protected GetSubFn_Static () {
        let arr:[IUISub] = [
            // this.scr_basic,
            // this.scr_hud,
            // this.scr_CardMgr,
            this.scr_conRoleMgr,
            this.scr_conEmptySeat,
            this.scr_notify,
            this.scr_0MyUtils,

            this.scr_1Waiting,
            this.scr_2Dispatch,
            this.scr_3VieLord,
            this.scr_4Chipin,
            this.scr_5Discard
            // this.scr_Result,
        ];
        this.CollectAllStaticSubUI(arr);
    }
    protected SetAllRoundClearSubUI (){
        this.allRoundClearSubUI = [
            // this.scr_conRoleMgr,
            this.scr_basic,
            this.scr_hud,
            this.scr_conEmptySeat,
            this.scr_notify,
            this.scr_0MyUtils,

            this.scr_cardMgr,
            this.scr_1Waiting,
            this.scr_2Dispatch,
            this.scr_3VieLord,
            this.scr_4Chipin,
            this.scr_5Discard,
            this.scr_result,
        ];
    }
    ///////////////////////////////////////////////////////////////////////////////



    
    //具体方法 0,通用，1,提示，2，同步 3，输入 4，推送
    // 0，通用
    public SyncPlayerJoinRoom (player){
        if(this.scr_conRoleMgr)
        this.scr_conRoleMgr.SyncPlayerJoinRoom(player);

        if(hxfn.battle_landlord.isPlayerFull)
            this.scr_1Waiting.HandleWaitOtherOne(false);
    }
    public SyncPlayerQuitRoom (playerid){
        if(this.scr_conRoleMgr)
        this.scr_conRoleMgr.SyncPlayerQuitRoom(playerid);
        
        //清理已准备
        // if(this.scr_1Waiting)
        // this.scr_1Waiting.ClearReadyFlag(playerid);
    }
    // public SyncPlayerLost (info){hxfn.battle.SyncPlayerLost(info)}
    // public SyncForceLeft (info){hxfn.battle.SyncForceLeft(info)}
    
    
    // 4，推送
    //同步刷新牌局倍数
    public DZSyncRingMulti (info:any){
        if(this.scr_basic && info)
            this.scr_basic.UpdateCurMulti(info.get('ringMulti'));
    }


    // 1，提示
    //开局
    public DZSyncRingBegin () {
        if(this.scr_1Waiting)
            this.scr_1Waiting.RingBegin();

        if(this.scr_conRoleMgr)
            this.scr_conRoleMgr.RingBegin();

        if(this.scr_notify)
            this.scr_notify.OnReset();
    }
    //结算
    public DZSyncRingEnd (info:any){
        if(this.scr_notify)
            this.scr_notify.SetCDOver();

        if(this.scr_result)
            this.scr_result.EndRing (info);

        cc.log('info.nextRingDelay: ' + info.nextRingDelay);
        this.scheduleOnce(function(){ 
            this.RingEndReal();
        }.bind(this), info.nextRingDelay);
    }
    //开局倒数
    DZSyncRingCountdown(info:any) {
        let cdMax = info.get('cdMS');
        if(this.scr_1Waiting) {
            this.scr_1Waiting.SetLightMulti(info.get('openMulti'));
            this.scr_1Waiting.CheckReadyBtn();
        }

        if(this.scr_notify)
            this.scr_notify.SetCDStart(cdMax, hxfn.battle_landlord.Enum_EventCD.Start);
    }
    DZSyncRingCDBreak (info:any) {
        //只发给当前玩家本人
        if(this.scr_1Waiting)
            this.scr_1Waiting.CheckReadyBtn();

        if(this.scr_notify)
            this.scr_notify.ResetCDToStart();
    }

    //玩家确认情况 支持多个？？？
    // DZSyncPlayerReady//DZPlayerReadyProto//???
    public DZSyncPlayerReady (info) {
        if(this.scr_conRoleMgr)
        this.scr_conRoleMgr.SetReady(info);
    }
    
    //提示明牌
    public DZTipOpenCard (info) {}

    //提示叫地主
    public DZTipCallLord (info) {
        // 类似抢庄
        this.scr_3VieLord.TipVieLord(info.get('callMulti'), info.get('callMulti'),info.get('cdMS')/1000);
        this.scr_notify.SetCDStart(info.get('cdMS'),'选择地主倍数！');
    }
    // 提示抢地主
    public DZTipVieLord (info) {}
    //提示加倍
    public DZTipMultiple (info) {
        // repeated int32 multiList = 1;   //可加倍的选择
        // optional int32 cdMS = 2;    //倒数时间，毫秒

        this.scr_4Chipin.ShowChipin(info.get('multiList'), info.get('cdMS')/1000);
    }
    //提示出牌
    public DZTipDiscard (info) {
        this.scr_conRoleMgr.ClearAllPhaseObjs();
        this.scr_cardMgr.ClearMyDiscards();
        this.scr_5Discard.Discard(info);

        let cdMS:number = info.get('cdMS');
        this.scr_notify.SetCDStart(cdMS, '快出牌啊');
    }
    

    // 2，同步
    public DZActCallLord (info) {
        //叫X3
        this.scr_conRoleMgr.CallLord(info);
    }
    public DZActShowLordCard (info) {
        this.scr_basic.SetDiPai(info.get('pokerList'));
    }
    public DZActDispatch (info) {
        // repeated int32 pokerList = 1;       //发牌扑克列表
        // repeated DZOpenMultiProto openMultis = 2;   //明牌 倍数，如果没有，则不显示明牌按钮
        // optional int32 cdMS = 3;            //展示牌所需时间
        
        //TODO 
        this.scr_cardMgr.ActDispatch(info);
    }
    public DZActDispatchLordCard (info) {
        if(hxfn.battle_landlord.isMeLord) {
            //刷新玩家的手牌，只有收到地主牌的玩家才有
            this.scr_cardMgr.RefreshMyCards(info.get('refreshHandCards'));
        }
        
        //公开地主底牌，向所有玩家
        let cards:any[] = info.get('lordCardList');
        let cs:number[] = [];
        cards.forEach(item=>{
            if(item.get('poker') == hxfn.battle_landlord.lordId)
                cs.push(item.get('poker'));
        });
        this.scr_basic.SetDiPai(cs);

        //刷新剩余手牌
        this.scr_cardMgr.UpdateOtherCards(hxfn.battle_landlord.lordId);
        

        //下发完地主牌，即牌桌上所有的牌发完，开启记牌器
        this.scr_0MyUtils.ShowTogCardMemBtn();
    }
    // public DZActOpenCard (info) {}//已明牌玩家的手牌
    public DZActVieLord (info) {}//抢地主 经典模式没有
    public DZActMultiple (info) {
        // 如果是自己，则刷新房间倍数
        
        //加倍/不加倍
        this.scr_conRoleMgr.ActMulti(info.get('playerId'), info.get('addMulti'));
    }
    public DZActConfirmLord (info) {
        // optional string lordPlayer = 1;     //地主玩家ID
        // optional int32 lordMulti = 2;       //地主的倍数
        // repeated string candidate = 3;  //地主候选，所有人都不叫地主，客户端展示多人争抢动画，最后定格在banker上

        //TODO: 抢地主动画
        // let idxes = 

        this.scr_conRoleMgr.MarkLord(info);
    }
    public DZActDiscard (info) {
        // optional string player = 1; //出牌玩家
        // optional int32 actType = 2; //出牌动作: 0 要不起, 1出牌,
        // optional DZModelProto discard = 3;
        // optional bool finish = 4;   //是否已经出完手牌
        let playerId = info.get('player');

        //清理阶段性的信息
        // 1，角色提示
        this.scr_conRoleMgr.ClearPhaseObjs(info.get('player'));
        
        // 3，出自己牌时，一定关闭出牌功能按钮
        if(playerId == hxfn.role.playerId) {
            this.scr_5Discard.Hide();

            // XXX已选中的牌，取消选中(更新牌时统一重置)
            // this.scr_0CardMgr.CancelSelectedCards();
        }

        //客户端记牌管理器更新,有可能没有出牌，则为null
        let discardInfo = info.get('discard');
        if(discardInfo) {
            // hxfn.battle_cardmem.UpdateCardsMem (info.get('discard').get('pokerList'));
            //显示该玩家的出牌组
            //刷新该玩家的牌组
            let cards = hxfn.battle_landlord.HandDiscardPokers(discardInfo);
            if(isNullOrUndefined(cards) || !isArray(cards) || cards.length <= 0)
            return;
            
            // 2，重置所有玩家已打出的牌！！！如果当前一局有出牌，没有的话则保留给下一位！！！
            this.scr_cardMgr.ClearDiscards();

            if(playerId == hxfn.role.playerId) {
                //XXX 如果是玩家自己，可以再次校验数据（已在InputACK的时候做了纯客户端的处理）
                // hxfn.battle_landlord.curDiscards = cards;
                hxfn.battle_landlord.SuccDiscard4MyHandCards(cards);
                hxfn.battle_landlord.curDiscards = [];
            }
            else{
                let idx:number = hxfn.battle.GetUISeatIdx(playerId);

                // let outCards:number[] = hxfn.battle_landlord.GeOutCards(playerId);
                //TODO 如果是一个明牌玩家，则静默更新其手牌
                // hxfn.battle_landlord.GeOutCards(playerId);

                this.scr_cardMgr.ShowDiscard(idx,cards);
                hxfn.battle_landlord.UpdateOutCards(playerId,cards);
            }

            // 4, 更新剩余牌的计数器
            this.scr_cardMgr.UpdateOtherCards(playerId);
        }
    }
    public DZActionTurn (info) {
        //清理角色的所有提示！！！
        this.scr_conRoleMgr.ClearAllPhaseObjs();

        let idx = hxfn.battle.GetUISeatIdx(info.get('player'));
        //设置闹钟倒计时
        this.scr_conRoleMgr.SetCD(idx, info.get('cdMS'));
        //HACK 文字提示版
        let str = '';

        let typ = info.get('actionType');
        if(typ == 1) str = '[叫地主] ';
        else if(typ == 2) str = '[抢地主] ';
        else if(typ == 3) str = '[出牌] ';

        this.scr_notify.SetCDStart(info.get('cdMS'), str);
    }

    //明牌的玩家，出牌后，向其他人发送刷新的明牌
    public DZActRefreshOpenCard (info:any) {
        this.scr_cardMgr.RefreshOpenCard(info.get('player'),info.get('pokerList'));
    }
    
    public DZInputACK (info) {
        if(info.get('inputType') == Enum_AckTyp.Discard) {
            if(info.get('result') == Enum_AckResult.OK) {
                this.scr_5Discard.Hide();

                //如果出牌成功，只有当前玩家才收到
                //XXX 在actdiscard的时候真正同步为服务器的数据，可以再次校验
                // hxfn.battle_landlord.SuccDiscard4MyHandCards();
            }
            else {
                // //如果不成功，选中的牌取消选中
                // this.scr_0CardMgr.CancelSelectedCards();

                //给出友情提示
                hxjs.module.ui.hub.LoadTipFloat(`出牌无效: ${Enum_AckResult[info.get('result')]}`);
            }
            // hxfn.battle_landlord.curDiscards = [];
        }
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////
    private HandleRoomType () {
        //0金币， 1筹码
        if(hxfn.map.curRoomTyp === 0){
            if(this.scr_conEmptySeat)
                this.scr_conEmptySeat.Hide();
        }
        else if(hxfn.map.curRoomTyp === 1){
            if(this.scr_conEmptySeat)
                this.scr_conEmptySeat.Show();
        }
    }
    private SetOriginalPlayers () {//players
        //player携带的以下信息需要处理，根据当前的阶段，直接显示/静默处理（这里拿到的必定是历史数据）
        if(this.scr_conRoleMgr != null)
            this.scr_conRoleMgr.SetOriginalPlayers();
        
        this.scr_0MyUtils.ShowAutoBtn();
    }
    private Recover_RingEnd(){
        this.RingEndReal();
    }
    private CheckWaitingReadyBtn () {
        if(hxfn.battle.roomPhase>=hxfn.battle_landlord.Enum_RoomPhase.RingInit){
            if(this.scr_1Waiting) this.scr_1Waiting.RingBegin();
        }
        else {
            if(this.scr_1Waiting) this.scr_1Waiting.OnReset();
        }
    }
    // private CheckJoinCurrentRing (){
    //     //确定玩家自己是否已在牌局中
    //     if(this.scr_0Comn) this.scr_0Comn.HandleWaitJoin();
    // }

    //逻辑重置在ringend的时候就生效
    //这里是纯重置表现
    private RingEndReal (){
        hxfn.battle.isBattlePlaying = false;
        this.ClearInstantObjs();

        //////////////////////////////////////////////////////////////////
        //将所有观战中的玩家状态设置为加入本局
        hxfn.battle.ResetAllPlayersJoinCurrentRingState();
        
        //真正结束本局需要在ringEnd表现完成之后
        hxfn.battle.hasPlayedCurGame = true;

        //重置角色头像的观战中状态标识
        hxjs.util.Notifier.emit('UI_Battle_RecoverJoinedStatus');
        ////////////////////////////////////////////////////////////////////

        //如果即将加入下一局，则取消等待加入游戏中状态的ui表现！！！
        // this.CheckJoinCurrentRing();
        
        //如果房间内只剩玩家自己，则下一局不会开始，确保显示等待其他人的状态
        hxfn.battle.CheckWaitAnyJoin();

        this.hasEndReal = true;
    }

    ////////////////////////////////////////////////////////////////////////
    private WaitOtherOne (isWait:boolean){
        if(this.scr_notify != null)
            this.scr_notify.HandleWaitOtherOne(isWait);
        // if(this.scr_1Waiting != null)
        //     this.scr_1Waiting.HandleWaitOtherOne(isWait);
    }
}
