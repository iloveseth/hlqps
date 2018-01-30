import { hxfn } from "../../../FN/HXFN";
import { hxdt } from "../../../DT/HXDT";
import { hxjs } from "../../../../HXJS/HXJS";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlord3VieLord extends cc.Component implements IUISub
{
    @property({type:require('UIButton')})
    private btnCancelVie: cc.Component = null;
    @property({type:require('UILst')})
    private lst_Ratio: cc.Component = null;

    private limit:number = -1;

    // LIFE-CYCLE CALLBACKS: //////////////////////////////////////////
    public OnInit(): void{
        this.btnCancelVie.SetInfo(()=>{this.SendRatio(0);});

        this.OnReset();
    }
    public OnStart(): void{}
    public OnReset(): void{
        this.unscheduleAllCallbacks();
        if(this.lst_Ratio)
            this.lst_Ratio.node.active = false;
    }
    public OnEnd(): void{}
    public OnStartReal(): void{}
    ///////////////////////////////////////////////////////////////////

    public TipVieLord (Multis:number[],limit:number, cd:number){
        this.unscheduleAllCallbacks();
        
        if(Multis && Multis.length > 0) {
            if(this.lst_Ratio) {
                this.lst_Ratio.node.active = true;
                this.lst_Ratio.SetInfo(Multis, this.SelectRatio.bind(this));
            }
        }

        this.limit = limit;
        if(limit != null && limit >= 0) {
            if(this.lst_Ratio)
                this.lst_Ratio.Setlimit (limit);//.getComponent('UILst')
        }
        else{
            cc.log('[hxjs][err] TipVieBanker: wrong limit num: ' + limit);
        }

        this.scheduleOnce(function(){
            this.OnReset();
        }.bind(this),cd);
    }

    private SelectRatio (idx:number, isValid:boolean) {
        // var isValid = this.limit > idx;
        if(!isValid) {
            let desc = '';
            if(hxfn.map.curRoomTyp === hxfn.map.Enum_RoomTyp.Ingot) { 
                desc = hxdt.setting.lang.Battle_Tip_VieBankerDisable;
            }
            else if(hxfn.map.curRoomTyp === hxfn.map.Enum_RoomTyp.Gold) { 
                desc = hxdt.setting.lang.Battle_Tip_VieBankerDisableGold;
            }
            hxjs.module.ui.hub.LoadTipFloat(desc);
            return;
        }

        this.SendRatio(idx+1);
        hxjs.util.Notifier.emit('UI_Battle_UpdateCDEventName', hxfn.battle_pinshi.Enum_EventCD.HasBankerVie);
        
        this.OnReset();
    }

    private SendRatio (ratio:number) {
        // this.scr_GroupRatio.node.active = false;
        if(this.lst_Ratio)
            this.lst_Ratio.node.active = false;
        
        var postData = {
            callMulti : ratio,
        };
        hxfn.net.Sync(
            postData,
            'DZInputCallLord',
            hxdt.msgcmd.DZInputCallLord,
        );
    }
}
