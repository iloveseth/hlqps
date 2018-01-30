import { hxfn } from "../../../FN/HXFN";
import { hxjs } from "../../../../HXJS/HXJS";
import { hxdt } from "../../../DT/HXDT";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlord1Waiting extends cc.Component implements IUISub
{
    @property({type:require('UIButton')})
    private btnReady: cc.Component = null;
    @property({type:require('UIButton')})
    private btnReady2: cc.Component = null;
    @property({type:require('UIButton')})
    private btnLightCard: cc.Component = null;
    @property({type:cc.Label})
    private txtLightCardMulti: cc.Label = null;

    // @property({type:[cc.Node]})
    // private readyMarks:cc.Node[] = [];

    private hasMyReady:boolean = false;
    private openMulti:number = 0;

    // LIFE-CYCLE CALLBACKS: //////////////////////////////////////
    public OnInit(): void{
        this.btnReady.SetInfo(this.ClickReady.bind(this),'准备');
        this.btnReady2.SetInfo(this.ClickReady.bind(this),'准备');
        this.btnLightCard.SetInfo(this.ClickReady_LightCard.bind(this));//,'明牌'
        
        //1,layout
        this.btnReady.node.active = false;
        this.btnReady2.node.active = false;
        this.btnLightCard.node.active = false;

        //2,data
        cc.log('UIBattle1Waiting on init!');
        this.hasMyReady = false;
    }
    public OnStart(): void{
        this.btnReady.node.active = !hxfn.battle_landlord.isLightCard;
        this.btnReady2.node.active = hxfn.battle_landlord.isLightCard;
        this.btnLightCard.node.active = hxfn.battle_landlord.isLightCard;
    }
    public OnReset(): void{
        this.hasMyReady = false;

        this.btnReady.node.active = false;
        this.btnReady2.node.active = false;
        this.btnLightCard.node.active = false;

        // this.readyMarks.forEach(element => {
        //     if(element)
        //         element.active = false;
        // });
    }
    public OnEnd(): void{
        this.OnReset();
    }
    public OnStartReal(): void{}
    ///////////////////////////////////////////////////////////////

    private ClickReady() {
        var postData = {
            open : false,
        };
        hxfn.netrequest.Sync_DZInputReady(postData);

        this.hasMyReady = true;
        this.Hide();

        hxjs.util.Notifier.emit('UI_Battle_UpdateCDEventName', hxfn.battle_landlord.Enum_EventCD.HasReady);        
    }

    private ClickReady_LightCard () {
        //同时发送开局倍数
        let postData1 = {
            openMulti : this.openMulti,
        };
        hxfn.netrequest.Sync_DZInputOpenCard(postData1);

        let postData2 = {
            open : true,
        };
        hxfn.netrequest.Sync_DZInputReady(postData2);

        this.hasMyReady = true;
        this.Hide();
        

        hxjs.util.Notifier.emit('UI_Battle_UpdateCDEventName', hxfn.battle_landlord.Enum_EventCD.HasReady);
    }


    public SetLightMulti (multi:number){
        this.openMulti = multi;
    }
    public CheckReadyBtn(){
        if(hxfn.battle_landlord.isLightCard) {
            this.btnReady2.node.active = !this.hasMyReady;
            this.btnLightCard.node.active = !this.hasMyReady;
        }
        else {
            this.btnReady.node.active = !this.hasMyReady;
        }
    }

    private Hide(){
        this.btnReady.node.active = false;
        this.btnReady2.node.active = false;
        this.btnLightCard.node.active = false;
    }

    // public SetReady (pid) {
    //     //1, 处理头像上的已准备标记，标记已准备的玩家------------
    //     let idx = hxfn.battle.GetUISeatIdx(pid);
        
    //     if(idx == -1) {
    //         cc.log('[hxjs][err] cant find player id in all battle players, bid: ' + pid);
    //     }
    //     else {
    //         cc.log('SetReady: ' + idx)
    //         // this.lstReadyMark.SetItem(idx, null);
    //         if(this.readyMarks[idx])
    //             this.readyMarks[idx].active = true;
    //     }

    //     //2, 处理玩家自己的已准备按钮---------------------------
    //     if(pid == hxfn.role.playerId) {
    //         this.HasReady();
    //     }
    // }

    // // 当QuitRoom时的处理
    // public ClearReadyFlag(pid){
    //     //清理已准备的玩家
    //     let idx = hxfn.battle.GetUISeatIdx(pid);
    //     let mark = this.readyMarks[idx];
    //     if(mark)
    //         mark.active = false;
    // }

    public RingBegin(){
        this.HasReady();

        // this.readyMarks.forEach(element => {
        //     if(element)
        //         element.active = false;
        // });
    }

    public HandleWaitOtherOne (isWait) {
        if(isWait) {
            this.btnReady.node.active = false;
            this.btnReady2.node.active = false;
            this.btnLightCard.node.active = false;
        }
        else {
            this.CheckReadyBtn();
        }
    }

    public HasReady(){
        this.hasMyReady = true;
        this.CheckReadyBtn();
    }
}