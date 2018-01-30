cc.Class({
    extends: cc.Component,

    properties: {
        packId:cc.Integer,
        txtTop:cc.Label,
        imgOpen:cc.Node,//已领取
        imgClose:cc.Node,//无法领取
        btnClick:cc.Button,//可领取
        packState:cc.Integer,

        packInfo: null,
        conTip: cc.Node,

        txtAward: cc.Label,

    },

    // use this for initialization
    onLoad: function () {
        this.conTip.active = false;
        //this.SetState(0);
        if(this.conTip){
            this.imgClose.on(cc.Node.EventType.TOUCH_START,function(event){
                this.conTip.active = true;
            }.bind(this));
            this.imgClose.on(cc.Node.EventType.TOUCH_END,function(event){
                this.conTip.active = false;
            }.bind(this));
            this.imgClose.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
                this.conTip.active = false;
            }.bind(this));

            this.imgOpen.on(cc.Node.EventType.TOUCH_START,function(event){
                this.conTip.active = true;
            }.bind(this));
            this.imgOpen.on(cc.Node.EventType.TOUCH_END,function(event){
                this.conTip.active = false;
            }.bind(this));
            this.imgOpen.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
                this.conTip.active = false;
            }.bind(this));

            this.btnClick.node.on(cc.Node.EventType.TOUCH_START,function(event){
                this.conTip.active = true;
            }.bind(this));
            this.btnClick.node.on(cc.Node.EventType.TOUCH_END,function(event){
                this.conTip.active = false;
            }.bind(this));
            this.btnClick.node.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
                this.conTip.active = false;
            }.bind(this));
        }
        
    },

    //TODO:设置包裹状态：0--不可领取，1--未领取，2--已领取
    SetState(state){

        this.node.active = true;
        this.packState = state;
        switch(state){
            case 0:{
                this.imgClose.active = true;
                this.imgOpen.active = false;
                this.btnClick.node.active = false;
                break;
            }
            case 1:{
                this.imgClose.active = false;
                this.imgOpen.active = false;
                this.SetEnabled(true);
                break;
            }
            case 2:{
                this.imgClose.active = false;
                this.imgOpen.active = true,
                this.SetEnabled(false);
                break;
            }
            default: break;
        }

    },

    GetState(){
        return this.packState;
    },


    SetInfo(info){
        this.packInfo = info;

        if(this.txtAward){
            var awardStr = info.activityReward;
            var awardArray = awardStr.split(',');
            var awardNumStr = info.activityRewardNum;
            var awardNumArray = awardNumStr.split(',')
    
            var txtAwardStr = '';
            for(var idx = 0;idx != awardArray.length;++idx){
                txtAwardStr += hxfn.comn.CoinName[parseInt(awardArray[idx])];
                txtAwardStr += awardNumArray[idx];
                txtAwardStr += '\n';
            }
            txtAwardStr = txtAwardStr.substring(0,txtAwardStr.length - 1);//去掉最后的换行符
            this.txtAward.string = txtAwardStr;
        }
    },

    SetEnabled(isEnable){
        if(isEnable){
            this.btnClick.node.active = true;
            this.btnClick.getComponent('UIButton').ToggleEnable(true);
            this.btnClick.getComponent('UIButton').SetInfo(
                function(){
                hxjs.util.Notifier.emit('PackClicked',this);
            }.bind(this));
        }
        else{
            this.btnClick.node.active = false;
            this.btnClick.getComponent('UIButton').ToggleEnable(false);
        }
    },
    
    SetActive(isActive){

    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
