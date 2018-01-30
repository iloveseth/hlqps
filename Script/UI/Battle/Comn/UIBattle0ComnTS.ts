import { hxdt } from "../../../DT/HXDT";
import { hxfn } from "../../../FN/HXFN";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattle0Comn extends cc.Component implements IUISub
{
    @property({type:cc.Label})
    private txtNotifyWaiting: cc.Label = null;
    @property({type:cc.Label})
    private txtWaitingOne: cc.Label = null;
    @property({type:cc.Node})
    private conWaitingOne: cc.Node = null;
    
    //TOREMOVE
    @property({type:cc.Label})
    private txtWaitingjoin: cc.Label = null;
    @property({type:cc.Node})
    private conWaitingjoin: cc.Node = null;

    private mt: number = -1;
    private mmaxTimet: number = -1;
    private evtName: string = '';
    
    private maxTime: number = -1;
    private cdTimes: number = -1;

    // LIFE-CYCLE CALLBACKS: /////////////////////////////////////////////////////////
    public OnInit(): void{
        this.txtNotifyWaiting.string = '';
        this.txtNotifyWaiting.node.active = false;
        
        // this.txtWaitingjoin.string = hxdt.setting.lang.Battle_WaitJoin;
        // this.conWaitingjoin.active = false;

        this.txtWaitingOne.string = hxdt.setting.lang.Battle_WaitingTheFirstOne;
        this.conWaitingOne.active = false;
    }
    public OnStart(): void{}
    public OnReset () {
        this.ResetCD();
    }
    public OnEnd(): void{}
    public OnStartReal(): void{}
    //////////////////////////////////////////////////////////////////////////////////

    SetCDStart (mt:number, evtName:string) {
        this.unscheduleAllCallbacks();

        if(isNaN(mt))
        return;
        
        
        this.evtName = evtName;
        this.maxTime = Math.ceil(mt / 1000);
        this.mt = this.maxTime*1000;//缓存起来，以便中断之后恢复重新倒计时

        this.ResetCD();

        this.txtNotifyWaiting.node.active = true;
        this.txtNotifyWaiting.string = this.evtName + this.maxTime;//+'倒计时: ' 

        this.cdTimes = 0;
        this.UpdateCDTimes(this.cdTimes);
        
        //计时（0(3)秒后，以1(1)秒的执行间隔，执行10(2)次）
        this.schedule(function(){
            this.ShowCD();
        }.bind(this),1/*(1)*/,this.maxTime/*(2)*/,0/*(3)*/);
    }

    ShowCD () {
        this.cdTimes+=1;
        this.UpdateCDTimes(this.cdTimes);

        if(this.cdTimes >= this.maxTime) 
            this.SetCDOver();
    }

    UpdateCDTimes (n:number) {
        // cc.log('---------------------- ShowCD: ' + this.cdTimes);
        this.txtNotifyWaiting.string = this.evtName + (this.maxTime - n);//+'倒计时: ' 
    }

    //终止计时
    SetCDOver () {
        // hxjs.util.Notifier.emit('UI_Battle_CD4RunPokerOver');

        //隐藏倒计时文字
        this.txtNotifyWaiting.node.active = false;

        //静止所有计时器
        this.unscheduleAllCallbacks();//停止某组件的所有计时器
    }

    /////////////////////////////////////////////////////////////
    ResetCD () {
        //隐藏倒计时文字
        this.txtNotifyWaiting.node.active = false;
        
        this.cdTimes = 0;
        //静止所有计时器
        this.unscheduleAllCallbacks();//停止某组件的所有计时器
    }

    

    UpdateCDEvtName(evtName:string){
        this.evtName = evtName;
    }

    ResetCDToStart(){
        this.SetCDStart(this.mt, this.evtName);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////
    HandleWaitOtherOne (isWait:boolean){
        this.conWaitingOne.active = isWait;
    }
    // HandleWaitJoin(){
    //     this.conWaitingjoin.active = !hxfn.battle.hasPlayedCurGame;
    // }
}
