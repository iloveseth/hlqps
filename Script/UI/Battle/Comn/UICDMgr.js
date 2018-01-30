cc.Class({
    extends: cc.Component,

    properties: {
        txtNotifyWaiting: cc.Label,
        conNums:[cc.Node],

        maxTime: -1,
        evtName:'',
        cdTimes:0,
    },

    // use this for initialization
    onLoad: function () {
        this.ToggleVisual(false);
    },

    OnInit () {
        cc.log('UIBattle0Comn on init!');
    },

    SetCDStart (mt, evtName = '') {
        cc.log('UIBattle0Comn SetCDStart mt: ' + mt);
        this.evtName = evtName;
        this.maxTime = mt / 1000;

        this.ResetCD();
        this.ToggleVisual(true);
        this.UpdateVisual(this.cdTimes);
        
        //计时（1(3)秒后，以1(1)秒的执行间隔，执行10(2)次）
        this.schedule(function(){
            this.UpdateCD();
        }.bind(this),1/*(1)*/,this.maxTime/*(2)*/,0/*(3)*/);
    },

    UpdateCD:function () {
        this.cdTimes+=1;
        this.UpdateVisual(this.cdTimes);

        if(this.cdTimes >= this.maxTime) 
            this.SetCDOver();
    },

    ToggleVisual:function (isOpen) {
        if(!isOpen)
            this.txtNotifyWaiting.node.active = isOpen;

        this.conNums.forEach(function(element) {
            element.active = isOpen;
        }, this);
    },
    
    UpdateVisual:function(n) {
        // cc.log('---------------------- UpdateCD curTime: ' + this.cdTimes);
        // cc.log('---------------------- UpdateCD maxTime: ' + this.maxTime);
        // this.txtNotifyWaiting.string = (this.maxTime - n);//'等待倒计时: ' + 

        if((this.maxTime - n)<=this.conNums.length) {
            this.conNums.forEach(function(element) {
                element.active = false;
            }, this);

            this.conNums[this.maxTime - n].active = true;
        }
    },

    //终止计时
    SetCDOver:function () {
        this.ResetCD();
    },

    /////////////////////////////////////////////////////////////
    ResetCD:function () {
        //隐藏倒计时文字
        this.ToggleVisual(false);
        
        this.cdTimes = 0;
        //静止所有计时器
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
    },

    Reset () {
        this.ResetCD();
    },
});