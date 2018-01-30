import { hxfn } from "../../../FN/HXFN";
import { hxjs } from "../../../../HXJS/HXJS";
import { hxdt } from "../../../DT/HXDT";
import { isNullOrUndefined, isArray } from "util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlordBasic extends cc.Component implements IUISub
{
    @property({type:require('UIItemRoomComn')})
    private uiItemRoomInfo: cc.Component = null;
    @property({type:cc.Node})
    private conFee: cc.Node = null;
    @property({type:cc.Label})
    private txtFee: cc.Label = null;

    //底牌
    @property({type:cc.Node})
    private conDiPai: cc.Node = null;
    @property({type:cc.Label})
    private txtDiPaiMulti: cc.Label = null;
    @property({type:cc.Sprite})
    private arrCardObj: cc.Sprite[] = [];

    //倍数按钮与信息
    @property({type:cc.Label})
    private txtMulti: cc.Label = null;
    @property({type:require('UIButton')})
    private btnMulti: cc.Component = null;
    @property({type:cc.Node})
    private conMultiDetail: cc.Node = null;

    // LIFE-CYCLE CALLBACKS://////////////////////////////////////////
    public OnInit () {
        hxfn.adjust.AdjustLabel(this.node);

        this.btnMulti.SetInfo(()=>{
            this.conMultiDetail.active = !this.conMultiDetail.activeInHierarchy;
        });

        this.OnReset();
    }
    public OnStart () {}
    public OnStartReal(){
        this.HandleNotify (true);
        
        this.ShowRoomInfo();
        this.ShowFee(hxfn.battle.curRoom);//hxfn.battle_pinshi.roomData

        //根据不同游戏玩法有所不同 //////////////////////////////////////
        if(isNullOrUndefined(hxfn.battle_landlord.lordCard) || hxfn.battle_landlord.lordCard.length == 0) {
            this.conDiPai.active = false;
        }
        else {
            this.conDiPai.active = true;
            //地主牌
            this.SetDiPai(hxfn.battle_landlord.lordCard);
            //地主牌倍数
            this.txtDiPaiMulti.string = hxfn.battle_landlord.lordCardMulti + '倍';
        }

        //牌局倍数
        if(isNaN(hxfn.battle_landlord.ringMulti)) 
            this.txtMulti.string = 0 + '倍';
        else 
            this.txtMulti.string = isNullOrUndefined(hxfn.battle_landlord.ringMulti)?'1':hxfn.battle_landlord.ringMulti + '倍';
    }
    public OnReset () {
        this.conMultiDetail.active = false;
        this.ResetDiPai();
        this.conFee.active = false;
    }
    public OnEnd () {
        this.HandleNotify (false);
    }
    //////////////////////////////////////////////////////////////////

    private HandleNotify(isHandle:Boolean) {
        if(isHandle) {
        }
        else {
        }
    }

    private ShowRoomInfo (){
        if(this.uiItemRoomInfo)
        this.uiItemRoomInfo.SetInfo(hxfn.map.curRoom);
    }

    private ShowFee (msg:any) {
        cc.log('feetype=-============================');
        if(!msg) return;
        
        //判断是否显示房间的服务费, 只有在fix时显示
        //服务费类型，float 赢家收取一定比例费用, fix 所有人每局收取固定费用
        let feeType = msg.get('feeType');
        cc.log(feeType);
        if(feeType === 'fix'){
            let fee = msg.get('fee');
            cc.log(fee);
            if(this.txtFee)
            this.txtFee.string  = '本局服务费：' + fee;
            //hxjs.util.Notifier.emit('[NiuNiu]_BattleModle_ShowFee', fee);
            //var action = cc.sequence(cc.fadeTo(1,0))
            hxjs.module.ui.hub.ShowCom(this.conFee);
            this.scheduleOnce(function(){
                hxjs.module.ui.hub.HideCom(this.conFee);
            },hxdt.setting_niuniu.timeForFee);
            
            cc.log('#########################');
        }
    }

    //=======================================================
    public UpdateCurMulti (num:number){
        this.txtMulti.string = num+'';
    }
    public SetDiPai (cards:number[]) {
        this.ResetDiPai();

        if(isNullOrUndefined(cards) || !isArray(cards) || cards.length <= 0)
        return;
        
        cc.warn('@@@@@@@@@@@@@@@ SetDiPai');
        cc.warn(cards);
        //有几张底牌显示几张牌????????????????????





        for (let i = 0; i < cards.length; i++) {
            let c = this.arrCardObj[i]
            if(!c) continue;

            c.node.active = true;
            hxfn.battle.SetCard(cards[i], c, 'battle_cards_lord_s');
        }
    }
    private ResetDiPai () {
        this.arrCardObj.forEach(item => {
            item.node.active = false;
        });
    }
}