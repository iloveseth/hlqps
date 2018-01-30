import { hxfn } from "../../../../FN/HXFN";
import UIItemCardsHolder from "./UIItemCardsHolder";
import { isArray } from "util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlordCardsHolder extends cc.Component//extends UIItemCardsHolder// implements IUISub
{
    @property({type:require('UILst')})
    private lstCards: cc.Component = null;

    // LIFE-CYCLE CALLBACKS: //////////////////////////////////////////
    public OnInit(): void{
        // this.OnReset();
    }

    public OnReset(): void{
        // this.lstCards.node.active = false;
    }
    public OnEnd(): void{}

    public SetCards(cards:number[]){
        this.ResetSelectedCards();

        if(!cards || !isArray(cards)) return;

        hxfn.battle_landlord.myHandCards = cards;
        this.lstCards.SetInfo(cards, this.ClickCard.bind(this));
    }

    ///////////////////////////////////////////////////////////////////


    //选择牌
        //1，单张 点击选中
        //2，多张 拖拽选中

    //取消选中
        //1，单击 取消单张牌
        //2，双击 取消全部选中的牌

    public TipCards (tips:any) {
        this.ResetSelectedCards();

        //地主牌模型
        // message DZModelProto {
        //     optional int32 modelType = 1;   //类型
        //     repeated int32 pokerList = 2;   //出牌数组
        // }
        //TODO 牌类型，用来做特效
        // tips.get('modelType');
        let cards = hxfn.battle_landlord.HandTipPokers(tips);
        hxfn.battle_landlord.curDiscards = cards;

        if(!isArray(cards) || cards.length <=0)
        return;

        this.lstCards.SetDefaultIdxs(hxfn.battle_landlord.TransIdToIdx(cards));
    }

    //重置选中的牌，同时清空缓存
    private ResetSelectedCards () {
        this.lstCards.ResetSelectedStates();
        hxfn.battle_landlord.curDiscards = [];
    }

    private ClickCard (idx:number,isSelected:boolean) {
        //维护一个数组
        cc.error(`ClickCard idx:${idx} isSelected: ${isSelected}`);

        let num = hxfn.battle_landlord.myHandCards[idx];
        //HACK 暂时处理一副牌的情况
        if(isSelected){
            if(hxfn.battle_landlord.curDiscards.indexOf(num) == -1)
                hxfn.battle_landlord.curDiscards.push(num);
        }
        else {
            if(hxfn.battle_landlord.curDiscards.indexOf(num) >= 0)
                hxfn.battle_landlord.curDiscards.splice(idx,1);
        }
    }
}