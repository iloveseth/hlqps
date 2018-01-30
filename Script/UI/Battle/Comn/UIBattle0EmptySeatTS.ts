import { hxjs } from "../../../../HXJS/HXJS";
import { setting_landlord } from "../../../DT/DD/Setting_Battle_Landlord";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattle0EmptySeat extends cc.Component implements IUISub
{
    //TOREMOVE 金币模式没有空位邀请
    @property({type:cc.Node})
    private groupSeatGold:cc.Node = null;
    @property({type:cc.Node})
    private groupSeat:cc.Node = null;
    @property({type:[cc.Node]})
    private btnSeats:cc.Node[] = [];

    // LIFE-CYCLE CALLBACKS:
    public OnStart () {}
    public OnStartReal () {}
    public OnReset () {}

    public OnInit(){
        this.groupSeat.getComponent('UIGroup').SetInfo(this.Invite.bind(this));
        // hxfn.review.HideNode(this.btnSeats);

        this.groupSeat.active = false;
        this.groupSeatGold.active = false;

        //玩法：地主
        // 需要根据不同的子玩法有不同的最多玩家个数
        this.groupSeat.getComponent('UIGroup').SetMaxVisiable(setting_landlord.maxUISeats - 1);
    }
    public OnEnd(){

    }

    private Invite (idx) {
        hxjs.module.ui.hub.LoadPanel_DlgPop('battle_landlord/UI_Battle_Invite_Landlord');
    }

    public Show(){
        this.groupSeat.active = true;
        this.groupSeatGold.active = false;
    }

    public Hide(){
        this.groupSeat.active = false;
        this.groupSeatGold.active = true;
    }

}
