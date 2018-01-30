cc.Class({
    extends:cc.Component,

    properties: {

        txtRoomId:cc.Label,
        
        txtDifen:cc.Label,
        txtEnterLimit:cc.Label,
        txtExitLimit:cc.Label,
        txtGamePlay:cc.Label,
        txtGameMode:cc.Label,
        txtCrazyDouble:cc.Label,
        txtRub:cc.Label,
        txtSpecTimes:cc.Label,
        txtSpecType:cc.Label,
        txtStrange:cc.Label,
        txtRub:cc.Label,
        txtStrange:cc.Label,
        txtPlayerNum:cc.Label,

        isXianTuizhu:false,
        isBankerTuizhu:false,

        conSpecType: cc.Node,
        conSpecTimes:cc.Node,
        conCrazyDouble:cc.Node,
        
    },

    onLoad: function () { 
        hxfn.adjust.AdjustLabel(this.node);
    },
 
    GetCrazyDouble(){ 
        if(!this.isBankerTuizhu && !this.isXianTuizhu){
            return '关';
        }
        else if(this.isBankerTuizhu){
            return '抢庄加倍';
        }
        else if(this.isXianTuizhu){
            return '闲家加倍';
        }
        else{
            return '';
        }
    },

    SetInfoS (info) {
        if(info==null) {
            cc.log('[hxjs][err]: battle tips info is null!')
            return;
        }
        // cc.log('setinfos');
        // cc.log(info);

        var option = info.roomInfo.createQiangzhuangRoomOption;
        if(option == null)
        return;
        
        this.isXianTuizhu = option.isXianTuizhu;
        this.isBankerTuizhu = option.isBankerTuizhu;
        if(this.txtRoomId){
            this.txtRoomId.string = info.roomId;
        }
        if(this.txtDifen){
            this.txtDifen.string = info.difen;
        }
        if(this.txtEnterLimit){
            this.txtEnterLimit.string = info.enterLimit;
        }
        if(this.txtExitLimit){
            this.txtExitLimit.string = info.leftLimit;
        }
        if(this.txtGameMode){
            this.txtGameMode.string = hxfn.map.GetGameModeName(option.qiangzhuangmodel);
        }
        if(this.txtSpecType){
            this.txtSpecType.string = option.haveSpecmodel?'开':'关';
        }
        if(this.txtSpecTimes){
            this.txtSpecTimes.string = option.iscrazyMulti?'开':'关';
        }
        if(this.txtCrazyDouble){
            this.txtCrazyDouble.string = this.GetCrazyDouble();
        }
        if(this.txtRub){
            this.txtRub.string = info.roomInfo.rubPoker?'开':'关';
        }
        if(this.txtPlayerNum){
            this.txtPlayerNum.string = info.nowPlayer + " / " + info.maxPlayer;
        }

        if(this.conSpecType){
            this.conSpecType.active = option.haveSpecmodel;
        }
        if(this.conSpecTimes){
            this.conSpecTimes.active = option.iscrazyMulti;
        }
        if(this.conCrazyDouble){
            this.conCrazyDouble.active = option.isXianTuizhu || option.isBankerTuizhu;
        }
    },

    SetInfoV(){
        if(this.txtRoomId){
            this.txtRoomId.string = hxfn.map.curRoom['roomId'];
        }
        if(this.txtGameMode){
            this.txtGameMode.string = hxfn.map.GetGameModeName(hxfn.battle_pinshi.qiangzhuangmodel);
        }
        if(this.txtDifen){
            this.txtDifen.string = hxfn.map.curRoom['difen'];
        }
        if(this.txtEnterLimit){
            this.txtEnterLimit.string = hxfn.map.curRoom['enterLimit'];
        }
        if(this.txtExitLimit){
            this.txtExitLimit.string = hxfn.map.curRoom['leftLimit'];
        }
        if(this.txtSpecType){
            this.txtSpecType.string = hxfn.battle_pinshi.haveSpecmodel? '开':'关';//createQiangzhuangRoomOption.haveSpecmodel ? '开':'关';
        }
        if(this.txtSpecTimes){
            this.txtSpecTimes.string = hxfn.battle_pinshi.isCrazyBet?'开':'关';
        }
        
        this.isBankerTuizhu = hxfn.battle_pinshi.isBankerTuizhu;
        this.isXianTuizhu = hxfn.battle_pinshi.isXianTuizhu;
        if(this.txtCrazyDouble){
            this.txtCrazyDouble.string = this.GetCrazyDouble();
        }
        if(this.txtRub){
            this.txtRub.string = hxfn.battle_pinshi.isRubPoker?'开':'关';
        }
        if(this.txtPlayerNum){
            //this.txtPlayerNum.string = hxfn.battle.
        }
    },

})