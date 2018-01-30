import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        uiItemRoomInfo: require('UIItemRoomComn'),
        conFee:cc.Node,
        txtFee:cc.Label,
        btnTip:cc.Node,

        // [nondisplay]
        loopNotifyCon:cc.Node,// 跑马灯广告
        loopNotifyConBg:cc.Node//跑马灯背景
    },


    // LIFE-CYCLE CALLBACKS://////////////////////////////////////////
    onLoad: function () {
        hxfn.adjust.AdjustLabel(this.node);
        this.OnInit();
        // cc.log('basic 1');
        // cc.log(this.btnTip);
    },
    OnInit () {
        hxjs.module.ui.hub.HideCom(this.conFee);
    },
    start:function (){
        this.HandleNotify (true);

        if(this.loopNotifyConBg){
            this.loopNotifyConBg.active=false;
        }

        if(this.loopNotifyCon){
            this.loopNotify = this.loopNotifyCon.getComponent('UILoop');
        }

        if(this.loopNotify){
            hxfn.lobby.RegistLobbyBroadcastUI (this.loopNotify,this.SetBroadcastBg.bind(this));
        }

        // hxfn.battle.Regist_Basic(this);
        // this.InitComplete();
    },

    SetBroadcastBg:function(isplaying){
        if(this.loopNotifyConBg){
            this.loopNotifyConBg.active=isplaying;
        }
    },
    OnReset:function () {
        //没有数据变化，不需要刷新
    },
    OnEnd () {
        this.HandleNotify (false);
    },
    onDestroy:function(){
        hxfn.lobby.UnregistLobbyBroadcastUI (); 
        this.OnEnd();
    },
    /////////////////////////////////////////////////////////////////

    HandleNotify:function(isHandle) {
        if(isHandle) {
        }
        else {
        }
    },

    OnStartReal:function(){
        // cc.log('basic 2');
        // cc.log(this.btnTip);

        if(hxfn.map.curRoomTyp === hxfn.map.Enum_RoomTyp.Ingot) { 
             this.btnTip.active = true;       
             this.btnTip.getComponent('UIButton').SetInfo(this.ShowTip.bind(this)); 
         }
         else {
             this.btnTip.active = false;
         }
        this.ShowRoomInfo();
        this.ShowFee(hxfn.battle.curRoom);//hxfn.battle_pinshi.roomData
    },

    ShowRoomInfo:function (){
        if(this.uiItemRoomInfo)
        this.uiItemRoomInfo.SetInfo(hxfn.map.curRoom);
    },

    ShowFee:function (msg) {
        //判断是否显示房间的服务费, 只有在fix时显示
        //服务费类型，float 赢家收取一定比例费用, fix 所有人每局收取固定费用
        cc.log('feetype=-============================');
        var feeType = msg.get('feeType');
        cc.log(feeType);
        if(feeType === 'fix'){
            var fee = msg.get('fee');
            cc.log(fee);
            if(this.txtFee)
            this.txtFee.string  = '本局服务费：' + fee;
            //hxjs.util.Notifier.emit('[NiuNiu]_BattleModle_ShowFee', fee);
            //var action = cc.sequence(cc.fadeTo(1,0))
            hxjs.module.ui.hub.ShowCom(this.conFee);
            this.scheduleOnce(function(){
                hxjs.module.ui.hub.HideCom(this.conFee);
            },hxdt.setting_niuniu.timeForFee);
            //if(this.txtFee)
                
                cc.log('#########################');
        }
    },

    ShowTip(){
        hxjs.module.ui.hub.LoadPanel('UI_Battle_NiuNiu_Tips');
    },
});