import { hxfn } from "../../../FN/HXFN";

cc.Class({
    extends:cc.Component,

    properties: {
        touchNode:cc.Node,
        bg:cc.Node,

        titleQZModel:cc.Label,        
        titleCrazyDouble:cc.Label,
        titleRub:cc.Label,
        titleSpecTimes:cc.Label,
        titleSpecType:cc.Label,
        titleStrange:cc.Label,

        txtQZModel:cc.Label,
        txtCrazyDouble:cc.Label,
        txtRub:cc.Label,
        txtSpecTimes:cc.Label,
        txtSpecType:cc.Label,
        txtStrange:cc.Label,

        titleBankerOutOfTen:cc.Label,
        txtBankerOutOfTen:cc.Label,
        conBankerOutOfTen:cc.Node,
    },

    onLoad: function () { 
        hxfn.adjust.AdjustLabel(this.node);

        if(this.titleQZModel){
            this.titleQZModel.string = '玩法模式: ';
        }
        if(this.titleSpecType){
            this.titleSpecType.string = '特殊牌型: ';
        }
        if(this.titleSpecTimes){
            this.titleSpecTimes.string = '特殊倍数: ';
        }
        if(this.titleCrazyDouble){
            this.titleCrazyDouble.string = '疯狂加倍: '
        }
        if(this.titleRub){
            this.titleRub.string = '搓       牌：';
        }
        if(this.titleStrange){
            this.titleStrange.sring = '允许陌生人加入: ';
        }
        if(this.titleBankerOutOfTen){
            this.titleBankerOutOfTen.sring = '没十下庄: ';
        }

        var _this = this;
        var listener = { 
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touches, event) {
                // hxjs.module.ui.hub.Pop();
                hxjs.module.ui.hub.Unload(_this.node);
                return true; //这里必须要写 return true
            },
            onTouchMoved: function (touches, event) {
                cc.log('Touch Moved: ' + event);
            },
            onTouchEnded: function (touches, event) {
               cc.log('Touch Ended: ' + event);
            },
            onTouchCancelled: function (touches, event) {
               cc.log('Touch Cancelled: ' + event);
            }
        } 
        cc.eventManager.addListener(listener, this.touchNode);
        this.SetInfo(hxfn.map.curRoom);
    },
    // info 是为UI专门定制的数据结构
    SetInfo (info) {
        if(info==null) {
            cc.log('[hxjs][err]: battle tips info is null!')
            return;
        }
        this.SetOptions();
    },
    
    SetOptions(){
        this.txtQZModel.string = hxfn.battle_pinshi.qzModelName;
        this.txtSpecType.string = hxfn.battle_pinshi.haveSpecmodel? '葫芦/顺子/同花 ×5':'关';//createQiangzhuangRoomOption.haveSpecmodel ? '开':'关';
        this.txtSpecTimes.string = hxfn.battle_pinshi.isCrazyBet?'十带一×2 十带二×3...五小×17':'关';
        this.txtCrazyDouble.string = this.GetCrazyDouble();
        this.txtRub.string = hxfn.battle_pinshi.isRubPoker?'开':'关';
        this.txtStrange.string = hxfn.battle_pinshi.isStranger?'开':'关';
        this.txtBankerOutOfTen.string = hxfn.battle_pinshi.isBankerOutOfTen?'开':'关';
        this.conBankerOutOfTen.active = hxfn.battle_pinshi.qiangzhuangmodel ==2/*双十上庄*/;
    },

    GetCrazyDouble(){ 
        if(!hxfn.battle_pinshi.isBankerTuizhu && !hxfn.battle_pinshi.isXianTuizhu){
            return '关';
        }
        else if(hxfn.battle_pinshi.isBankerTuizhu){
            return '抢庄加倍';
        }
        else if(hxfn.battle_pinshi.isXianTuizhu){
            return '闲家加倍';
        }
        else{
            return '';
        }
    },
    onDestroy:function(){
        cc.eventManager.removeListeners(this);
    }
    
})