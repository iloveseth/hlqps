import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {
        btnClose:require('UIButton'),
        // conPoker:cc.Node,
        lbTime:cc.Label,
        ui_RubPoker:cc.Node,
        ui_Fly:cc.Node,
        uiRubPoker:null,
        btnOpen:require('UIButton'),
    },
    
    onLoad: function () {
        hxfn.adjust.AdjustLabel(this.node);

        this.uiRubPoker = this.ui_RubPoker.getComponent('UIRubPoker');
        this.btnClose.SetInfo(function(){
            this.OnEnd();
        }.bind(this));
        this.ui_Fly.active=true;
        this.ui_RubPoker.active=false;
        this.btnOpen.active=false;
        this.ui_Fly.runAction(cc.sequence(cc.spawn(cc.rotateTo(0.4,90),cc.scaleTo(0.4,0.5,0.5),cc.moveTo(0.4,0,80)),cc.callFunc(this.showBig,this)));
        this.btnOpen.SetInfo(function(){
            var postData = {
                playerId:hxfn.role.playerId,
                open : true,
            };
            hxfn.net.Sync(
                postData,
                'QZInputRubPoker',
                hxdt.msgcmd.QZInputRubPoker,
            );
    
            hxjs.util.Notifier.emit('[NiuNiu]_BattleUI-LightCard');
            hxjs.util.Notifier.emit('UI_Battle_UpdateCDEventName', hxfn.battle_pinshi.Enum_EventCD.HasLightPoker); 
            this.OnEnd();
        }.bind(this));
        this.lbTime.string="倒计时:"+hxfn.comn.GetCurCD()+"秒";
        this.schedule(function(){ 
            this.lbTime.string="倒计时:"+hxfn.comn.GetCurCD()+"秒";
            if(hxfn.comn.GetCurCD()<=0){
                this.OnEnd();
            }
        }.bind(this),1);
    },

    start:function (){
        this.uiRubPoker.OnInit();
        this.HandleNotify(true);
    },

    OnEnd () {
        this.unscheduleAllCallbacks(this);
        
        this.HandleNotify(false);
        this.uiRubPoker.OnEnd();
        hxjs.module.ui.hub.Unload(this.node);
        hxfn.comn.StopCD();
    },
    onDestroy:function (){
        this.OnEnd();
    },

    HandleNotify:function (isHandle) {
        if(isHandle) {
            hxjs.util.Notifier.on('UI_Battle_CD4RunPokerOver', this.OnEnd, this);
        }
        else {
            hxjs.util.Notifier.off('UI_Battle_CD4RunPokerOver', this.OnEnd, this);
        }
    },

    showBig:function(){
        this.ui_Fly.active=false;
        this.ui_RubPoker.active=true;
        this.btnOpen.active=true;
    },

    // Show:function () {
    //     this.btnClose.node.active = true;
    //     this.btnDarkBg.node.active = true;
    //     this.conPoker.node.active = true;

    //     this.arrCards[0].active = true;
    // },
    
    // Hide:function () {
    //     this.btnClose.node.active = false;
    //     this.btnDarkBg.node.active = false;
    //     this.conPoker.node.active = false;

    //     this.arrCards.forEach(function(element) {
    //         element.active = false;
    //     }, this);
    // },
});
