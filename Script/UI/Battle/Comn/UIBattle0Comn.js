import { hxfn } from "../../../FN/HXFN";

cc.Class({
    extends: cc.Component,

    properties: {
        txtNotifyWaiting: cc.Label,
        txtWaitingjoin:cc.Label,
        conWaitingjoin:cc.Node,
        txtWaitingOne:cc.Label,
        conWaitingOne:cc.Node,

        mt:{ default: -1, serializable: false, visible: false},
        maxTime:{ default: -1, serializable: false, visible: false},
        evtName:{ default: '', serializable: false, visible: false},
    },

    /////////////////////////////////////////////////////////////////////////
    OnInit () {
        cc.log('UIBattle0Comn on init!');
        this.txtNotifyWaiting.string = '';
        this.txtNotifyWaiting.node.active = false;
        
        this.txtWaitingjoin.string = hxdt.setting.lang.Battle_WaitJoin;
        this.txtWaitingOne.string = hxdt.setting.lang.Battle_WaitingTheFirstOne;
        this.conWaitingjoin.active = false;
        this.conWaitingOne.active = false;
    },
    
    OnEnd () {
        
    },
    /////////////////////////////////////////////////////////////////////////

    SetCDStart (mt, evtName) {
        this.unscheduleAllCallbacks(this);

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
    },

    ShowCD () {
        this.cdTimes+=1;
        this.UpdateCDTimes(this.cdTimes);

        if(this.cdTimes >= this.maxTime) 
            this.SetCDOver();
    },

    UpdateCDTimes (n) {
        // cc.log('---------------------- ShowCD: ' + this.cdTimes);
        this.txtNotifyWaiting.string = this.evtName + (this.maxTime - n);//+'倒计时: ' 
    },

    //终止计时
    SetCDOver () {
        // hxjs.util.Notifier.emit('UI_Battle_CD4RunPokerOver');

        //隐藏倒计时文字
        this.txtNotifyWaiting.node.active = false;

        //静止所有计时器
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
    },

    /////////////////////////////////////////////////////////////
    ResetCD () {
        //隐藏倒计时文字
        this.txtNotifyWaiting.node.active = false;
        
        this.cdTimes = 0;
        //静止所有计时器
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
    },

    OnReset () {
        this.ResetCD();
    },

    UpdateCDEvtName(evtName){
        this.evtName = evtName;
    },

    ResetCDToStart(){
        this.SetCDStart(this.mt, this.evtName);
    },

    /////////////////////////////////////////////////////////////////////////////////////////////
    HandleWaitOtherOne (isWait){
        this.conWaitingOne.active = isWait;
    },
    HandleWaitJoin(){
        this.conWaitingjoin.active = !hxfn.battle.hasPlayedCurGame;
    },
});