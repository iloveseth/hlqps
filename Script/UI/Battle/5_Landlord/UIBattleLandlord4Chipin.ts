import { hxfn } from "../../../FN/HXFN";
import { hxdt } from "../../../DT/HXDT";
import { hxjs } from "../../../../HXJS/HXJS";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlord4Chipin extends cc.Component implements IUISub
{
    @property({type:cc.Node})
    private conWhetherDouble: cc.Node = null;
    @property({type:require('UIButton')})
    private btnMulti: cc.Component = null;
    @property({type:require('UIButton')})
    private btnNoMulti: cc.Component = null;

    private rations:number[] = [];

    // LIFE-CYCLE CALLBACKS: //////////////////////////////////////////
    public OnInit(): void{
        this.HideChipinPanel();

        this.btnMulti.SetInfo(this.DoMulti.bind(this));
        this.btnNoMulti.SetInfo(this.DoNoMulti.bind(this));
    }
    public OnStart(): void{}
    public OnReset(): void{
        this.HideChipinPanel();
        this.rations = [];
    }
    public OnEnd(): void{}
    public OnStartReal(): void{}
    ///////////////////////////////////////////////////////////////////

    public ShowChipin (rations:number[],  cd:number) {//limit:number,
        this.rations = rations;

        this.unscheduleAllCallbacks();
        
        this.conWhetherDouble.active = true;

        this.scheduleOnce(function(){
            this.OnReset();
        }.bind(this),cd);
    }

    private HideChipinPanel () {
        this.unscheduleAllCallbacks();
        this.conWhetherDouble.active = false;
    }

    private DoMulti () {
        //因为目前只有加倍与不加倍，所以传过来的可供选择的倍数长度为1
        let curMulti:number = this.rations.length>=1?this.rations[0]:0;
        cc.error('DZInputMultiple curMulti: ' + curMulti);
        cc.error(this.rations);

        var postData = {
            multiple : curMulti,
        };
        hxfn.net.Sync(
            postData,
            'DZInputMultiple',
            hxdt.msgcmd.DZInputMultiple,
        );

        this.HideChipinPanel();
        // hxjs.util.Notifier.emit('UI_Battle_UpdateCDEventName', hxfn.battle_pinshi.Enum_EventCD.HasChipin);
    }

    private DoNoMulti () {
        var postData = {
            multiple : 0,
        };
        hxfn.net.Sync(
            postData,
            'DZInputMultiple',
            hxdt.msgcmd.DZInputMultiple,
        );

        this.HideChipinPanel();
    }
}