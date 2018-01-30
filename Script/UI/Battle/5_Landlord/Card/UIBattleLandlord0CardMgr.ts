import { hxfn } from "../../../../FN/HXFN";
import { hxjs } from "../../../../../HXJS/HXJS";
import UIItemCardsHolder from "./UIItemCardsHolder";
import UIBattleLandlordLastCardsCounter from "./UIBattleLandlordLastCardsCounter";
import UIBattleLandlordCardsHolder from "./UIBattleLandlordCardsHolder";
import { isArray, isNullOrUndefined } from "util";
import { log } from "../../../../../HXJS/Util/Log";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlord0CardMgr extends cc.Component implements IUISub
{
    //所有玩家打出的牌
    @property({type:[UIItemCardsHolder]})
    private allDiscards: UIItemCardsHolder[] = [];
    //我的手牌
    //1 发牌阶段
    @property({type:UIItemCardsHolder})
    private myDispatch: UIItemCardsHolder = null;
    //2 持有手牌 17张
    @property({type:UIBattleLandlordCardsHolder})
    private myHolder1: UIBattleLandlordCardsHolder = null;
    // 持有手牌 20张
    @property({type:UIBattleLandlordCardsHolder})
    private myHolder2: UIBattleLandlordCardsHolder = null;

    private myCurHolder: UIBattleLandlordCardsHolder = null;

    //其他玩家的剩余手牌
    @property({type:[UIBattleLandlordLastCardsCounter]})
    private otherRemainCounters: UIBattleLandlordLastCardsCounter[] = [];

    
    //明牌模式才有
    @property({type:[require('UIButton')]})
    private btnsOpenCard: cc.Component[] = [];
    @property({type:[UIItemCardsHolder]})
    private uisOtherHands: UIItemCardsHolder[] = [];

    //牌少警报器
    @property({type:[cc.Node]})
    private conLessCardWarns: cc.Node[] = [];

    // LIFE-CYCLE CALLBACKS: /////////////////////////////////////////////////
    public OnInit(): void{
        hxfn.adjust.AdjustLabel(this.node);

        this.allDiscards.forEach(element => {
            element.OnInit();
        });

        //HACK
        this.myCurHolder = this.myHolder2;
        this.myCurHolder.OnInit();

        this.uisOtherHands.forEach(ui=>{
            ui.OnInit();
        });


        //TODO
        //获取明过牌的玩家索引s，以便显示按纽
        //TEST
        let lightedPlayersIdx:[number] = [1,2];
        
        //TODO
        //双击底板，取消所有已选中的牌（重置所有牌的选中状态）

        //已明牌过的玩家，可以通过点击按钮查看当前剩余手牌
        this.btnsOpenCard.forEach(btn=>{
            btn.SetInfo(b=>{
                cc.warn(this.btnsOpenCard);
                cc.warn(b);
                let idx = this.btnsOpenCard.indexOf(b);
                cc.warn(idx);
                this.uisOtherHands[idx].node.active = !this.uisOtherHands[idx].node.activeInHierarchy;
            });
        });


        this.OnReset();//init layout
        this.DefaultNotify(true);
    }
    public OnStart(): void{}
    public OnReset(): void{
        //他人统计牌
        for (const counter of this.otherRemainCounters) {
            if(counter)counter.OnReset();
        }

        this.myDispatch.node.active = false;
        this.myHolder1.node.active = false;
        this.myHolder2.node.active = false;

        for (const played of this.allDiscards) {
            played.OnReset();
        }

        //警报
        hxjs.module.ui.hub.ToggleComs(this.conLessCardWarns,false);

        //明牌模式
        hxjs.module.ui.hub.ToggleComs(this.btnsOpenCard, false, false);
        hxjs.module.ui.hub.ToggleComs(this.uisOtherHands, false, false);
    }
    public OnEnd(): void{
        this.DefaultNotify(false);
    }
    public OnStartReal(): void{}
    //////////////////////////////////////////////////////////////////////////

    protected DefaultNotify (isHandle:Boolean) {
        if(isHandle) {
            hxjs.util.Notifier.on('Battle_Landlord_CardsDiscardHint', this.TipCard, this);
            hxjs.util.Notifier.on('Battle_Landlord_LightCardPlayer', this.LightCard, this);
            hxjs.util.Notifier.on('Battle_Landlord_SuccDiscard', this.SuccDiscard_My, this);
            hxjs.util.Notifier.on('Battle_Landlord_CardsLess', this.CardsLess, this);
        }
        else {
            hxjs.util.Notifier.off('Battle_Landlord_CardsDiscardHint', this.TipCard, this);
            hxjs.util.Notifier.off('Battle_Landlord_LightCardPlayer', this.LightCard, this);
            hxjs.util.Notifier.off('Battle_Landlord_SuccDiscard', this.SuccDiscard_My, this);
            hxjs.util.Notifier.off('Battle_Landlord_CardsLess', this.CardsLess, this);
        }
    }

    public ActDispatch (info:any) {        
        this.myCurHolder.node.active = true;
        this.myCurHolder.SetCards (info.get('pokerList'));

        this.InitOtherCards();
    }

    public RefreshMyCards (cards:[number]) {
        this.myCurHolder.node.active = true;
        this.myCurHolder.SetCards (cards);
    }

    //每次出牌刷新
    private SuccDiscard_My (cards:number[]) {
        // cc.warn('@@@@@@@@@@@@@@@ RefreshMyCards');

        // //显示已出的牌
        // this.playedCardGroups[0].node.active = true;
        // this.playedCardGroups[0].SetCards(hxfn.battle_landlord.myOutCards);
        // //更新当前手牌
        // this.myCurHolder.SetCards(hxfn.battle_landlord.myHandCards);
        this.ShowDiscard(0, cards/*hxfn.battle_landlord.curDiscards*/, hxfn.battle_landlord.myHandCards);
    }
    public ShowDiscard (idx:number, discards:number[], handCards?:number[]) {
        cc.warn('[ui] ShowDiscard idx:' + idx);
        cc.warn(discards);
        
        this.allDiscards[idx].node.active = true;
        this.allDiscards[idx].SetCards(discards);

        if(handCards) {
            if(idx == 0) {
                this.myCurHolder.SetCards(handCards);
            }
            else if(idx >= 1) {
                //TODO 需要全局统计
                // //如果是农民
                // let lastCardsCount = 0;
                // lastCardsCount = 17 - outCards.length;
                // //如果是地主
                // // lastCardsCount = 20 - outCards.length;
                // this.otherRemainCardsCounters[idx].Show(lastCardsCount);

                //如果是明牌，则需要记录已经明牌的玩家的手牌
                
                this.uisOtherHands[idx-1].node.active = true;
                this.uisOtherHands[idx-1].SetCards(handCards, 'battle_cards_lord_s');
            }
        }
    }

    //提示出牌:多组牌
    private TipCard(tips:any) {
        this.myCurHolder.node.active = true;
        this.myCurHolder.TipCards (tips);
    }
    // public CancelSelectedCards () {
    //     this.myCurHolder.ResetSelectedCards();
    // }

    //明牌////warn///////////////////////
    private LightCard(idx:number) {
        if(idx == 0) return;

        log.warn('[ui] LightCard idx: ' + (idx - 1));
        log.warn(this.btnsOpenCard[idx]);

        this.btnsOpenCard[idx-1].node.active = true;
    }
    private ToggleOpenOtherHandCards (btn:cc.Component) {
        let idx = this.btnsOpenCard.indexOf(btn);
        this.uisOtherHands[idx].node.active=!this.uisOtherHands[idx].node.activeInHierarchy;
    }

    //牌少警告
    private CardsLess (info:any[]/*0,pid; 1:iswarn*/) {
        let idx = hxfn.battle.GetUISeatIdx(info[0]);
        if(idx>=0 && idx < this.conLessCardWarns.length)
            this.conLessCardWarns[idx].active = info[1];
    }

    //清理已经打出的牌，新打出一张牌时
    public ClearDiscards () {
        this.allDiscards.forEach(ui=>{
            ui.ResetAllCards();
        });
    }

    //更新其他玩家手牌
    public RefreshOpenCard (pid:string, cards:number[]) {
        let idx = hxfn.battle.GetUISeatIdx(pid);

        if(!isNaN(idx) && idx>0) {
            this.uisOtherHands[idx-1].node.active = true;
            this.uisOtherHands[idx-1].SetCards(cards, 'battle_cards_lord_s');
        }
    }
    //更新其他玩家剩余牌的数量
    public UpdateOtherCards (pid:string) {
        let idx = hxfn.battle.GetUISeatIdx(pid);

        //记牌器
        if(idx <= 0 || idx > this.otherRemainCounters.length) return;
        this.otherRemainCounters[idx-1].Show(hxfn.battle_landlord.GetRemainCardsNum(pid));
    }
    private InitOtherCards () {
        //记牌器
        //1,3人局
        this.otherRemainCounters[0].Show(17);
        this.otherRemainCounters[1].Show(17);

        //2,4人局
        // this.otherRemainCounters[0].Show(17);
        // this.otherRemainCounters[1].Show(17);
        // this.otherRemainCounters[2].Show(17);
    }

    //清理自己发的牌，当上一把出牌之后没人要，则在重新轮到提示自己时
    public ClearMyDiscards () {
        this.allDiscards[0].ResetAllCards();
    }
}