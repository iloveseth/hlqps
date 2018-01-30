cc.Class({
    extends: cc.Component,

    properties: {

        txtTaskName:cc.Label,

        txtProg:cc.Label,
        txtComplete:cc.Label,

        txtAward:cc.Label,
        txtActive:cc.Label,
        btnReceive:cc.Button,
        conReceive:cc.Node,
        conUncompleted:cc.Node,
        conReceived:cc.Node,

        

        buttonState:null,
        nodeInfo:null,
        callback:null,

        conPower:cc.Node,

        // idx: -1,
        // callback_check:null,
    },

    onLoad: function () {
        // this.OnInit()

        // this.buttonState.SetInfo () {}

        this.btnReceive.getComponent('UIButton').SetInfo(function(){
            hxjs.util.Notifier.emit('ReceiveTaskAward',this);
        }.bind(this))
    },

    SetInfo(info, idx, cb){
        // this.SetInfoBase();
    //    this.idx = idx;
    //    this.callback_check = cb;
        this.nodeInfo = info;
        if(parseInt(hxfn.activityAndTask.curTaskTypId) == 0){
            this.txtTaskName.string = info.taskDes;
            this.conPower.active = true;
            this.txtActive.string = info.awardVitality + '';
        }
        else{
            this.txtTaskName.string = info.taskName;
            this.conPower.active = false;
        }
        

        if(info.progress != info.taskNum){
            this.txtProg.node.active = true;
            this.txtComplete.node.active = false;
            this.txtProg.string = info.progress + '/' + info.taskNum;
            this.SetButtonState(hxfn.activityAndTask.EnumPack.CannotReceive);
        }
        else{
            this.txtComplete.node.active = true;
            this.txtProg.node.active = false;
            //this.txtProg.string = '已完成';
            if(info.haveGetReward){
                this.SetButtonState(hxfn.activityAndTask.EnumPack.HasReceived);
            }
            else{
                this.SetButtonState(hxfn.activityAndTask.EnumPack.ToBeReceived);
            }
        }
        this.txtAward.string = info.awardNum + '';  
    },

    SetButtonState(state){
        this.buttonState = state;
        switch(state){
            case hxfn.activityAndTask.EnumPack.CannotReceive:{
                if(this.conUncompleted)
                this.conUncompleted.active = true;
                if(this.conReceive)
                this.conReceive.active = false;
                if(this.conReceived)
                this.conReceived.active = false;
                break;
            }
            case hxfn.activityAndTask.EnumPack.ToBeReceived:{
                if(this.conUncompleted)
                this.conUncompleted.active = false;
                if(this.conReceive)
                this.conReceive.active = true;
                if(this.conReceived)
                this.conReceived.active = false;
                break;
            }
            case hxfn.activityAndTask.EnumPack.HasReceived:{
                if(this.conUncompleted)
                this.conUncompleted.active = false;
                if(this.conReceive)
                this.conReceive.active = false;
                if(this.conReceived)
                this.conReceived.active = true;
                break;
            }
        }
    },

    GetButtonState(){
        return this.buttonState;
    }
});
