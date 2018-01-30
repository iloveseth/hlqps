import { hxfn } from "../../../FN/HXFN";
import { hxjs } from "../../../../HXJS/HXJS";
import { isArray } from "util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlord5Discard extends cc.Component implements IUISub
{
    @property({type: cc.Node})
    private conLordFirst: cc.Node = null;
    @property({type: cc.Node})
    private conOptPlay: cc.Node = null;
    @property({type: cc.Node})
    private conInvalidPlay: cc.Node = null;

    @property({type: require('UIButton')})
    private btnHint: cc.Component = null;
    @property({type: require('UIButton')})
    private btnConfirm: cc.Component = null;
    @property({type: require('UIButton')})
    private btnCancel: cc.Component = null;
    @property({type: require('UIButton')})
    private btnCant: cc.Component = null;

    @property({type: require('UIButton')})
    private btnLightCard: cc.Component = null;
    @property({type: require('UIButton')})
    private btnConfirm0: cc.Component = null;

    //第一次出牌，必然是地主
    private theFirstDiscardOfLord:boolean = true;
    //本轮提示出牌
    private tipPokers:number[] = [];
    //提示明牌的倍数
    private openMulti:number = 0;

    // LIFE-CYCLE CALLBACKS: //////////////////////////////////////////////
    public OnInit(): void{
        //初始化按钮事件
        this.btnHint.SetInfo(this.Hint.bind(this));
        this.btnConfirm.SetInfo(this.Confirm.bind(this));
        this.btnCancel.SetInfo(this.Cancel.bind(this));
        this.btnCant.SetInfo(this.Cancel.bind(this));
        
        this.btnConfirm0.SetInfo(this.Confirm.bind(this));
        this.btnLightCard.SetInfo(this.LightCard.bind(this));

        this.OnReset();
    }
    public OnStart(): void{}
    public OnReset(): void{
        this.theFirstDiscardOfLord = true;
        this.openMulti = 0;

        this.Hide();
    }
    public OnEnd(): void{ this.OnReset();}
    public OnStartReal(): void{}
    ///////////////////////////////////////////////////////////////////////

    public Hide () {
        this.unscheduleAllCallbacks();

        this.conLordFirst.active = false;
        this.conOptPlay.active = false;
        this.conInvalidPlay.active = false;
    }

    private Confirm () {
        if(!hxfn.battle_landlord.curDiscards 
            || !isArray(hxfn.battle_landlord.curDiscards) 
            || hxfn.battle_landlord.curDiscards.length <= 0) 
        {
            hxjs.module.ui.hub.LoadTipFloat('尚未选择要出的牌！');
            return;
        }
        
        // this.Hide();
        var postData = {
            actType:1,//出牌动作: 0 要不起, 1出牌,
            pokerList:hxfn.battle_landlord.curDiscards//出的牌列表
        }
        hxfn.netrequest.Sync_DZInputDiscard(postData);
        // hxfn.battle_landlord.curDiscards = [];//出牌成功再清理
    }
    private Cancel () {
        this.Hide();

        var postData = {
            actType:0,//出牌动作: 0 要不起, 1出牌,
            pokerList:[],//出的牌列表
        }
        hxfn.netrequest.Sync_DZInputDiscard(postData);
    }

    private Hint () {
        hxjs.util.Notifier.emit('Battle_Landlord_CardsDiscardHint', this.tipPokers);
    }

    private LightCard () {
        // this.btnLightCard.ToggleEnable(false);
        this.btnLightCard.node.active = false;

        let postData = {
            openMulti : this.openMulti,
        };
        hxfn.netrequest.Sync_DZInputOpenCard(postData);
    }
    
    public Discard (info:any) {
        this.unscheduleAllCallbacks();

        let pass:boolean = info.get('pass')
        if(!pass) {
            this.tipPokers = info.get('tips');
        }

        this.openMulti = info.get('openMulti');
        // 地主第一次出牌
        if(hxfn.battle_landlord.isMeLord && this.theFirstDiscardOfLord) {
            this.theFirstDiscardOfLord = false;

            this.conLordFirst.active = true;
            // this.btnLightCard.ToggleEnable(!isNaN(this.openMulti) && this.openMulti > 0);
            this.btnLightCard.node.active = (!isNaN(this.openMulti) && this.openMulti > 0);

            this.conOptPlay.active = false;
            this.conInvalidPlay.active = false;
        }
        else {
            this.conLordFirst.active = false;

            this.conOptPlay.active = !pass;
            this.conInvalidPlay.active = pass;
        }

        this.scheduleOnce(function(){
            this.Hide();
        }.bind(this),info.get('cdMS')/1000);
    }
}