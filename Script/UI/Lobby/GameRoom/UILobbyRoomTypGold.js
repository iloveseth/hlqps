import { hxfn } from "../../../FN/HXFN";

cc.Class({
    extends: cc.Component,
    
    properties: {
        btnEntered: cc.Node,

        txtMemberCount:cc.Label,
        txtEnterCond:cc.Label,
        txtLimitChipin:cc.Label,

        // txtCurRoleGold:cc.Label,

        // [nondisplay]
        // dizhu:-1,
        enterLimit:-1,
        // leftLimit:-1,
    },
    
    onLoad: function () {
        this.btnEntered.getComponent('UIButton').SetInfo(this.StartGame.bind(this));
        hxfn.adjust.AdjustLabel(this.node);
    },

    start: function (){
        // this.txtCurRoleGold.string = parseInt(hxfn.role.curGold).toCoin();
        
        hxjs.module.ui.hub.ShowWaitingUI();
        hxfn.netrequest.Req_GetGoldEntryInfo(
            function(msg){
                hxjs.module.ui.hub.HideWaitingUI();
                this.SetInfo(msg);
            }.bind(this)
        );
    },

    SetInfo (info/*gameplay id*/) {
        //如果是静态配置的话则需要根据游戏类型来读取相应的配置信息
        // let panelName = confGameplay[gameplayID+'']['difficulty-style'];

        var playerCount = info['playerCount'];
        var dizhu = info['difen'];
        this.enterLimit = info['enterLimit'];

        this.txtMemberCount.string = '（' + playerCount + '人在线）';
        this.txtLimitChipin.string = dizhu +'金币';//'底注：' + 
        this.txtEnterCond.string = this.enterLimit+'金币进入';

        hxfn.map.UpdateCoinInfo(dizhu, this.enterLimit, 0);
    },

    StartGame(){
        if(hxfn.level.CheckEnterBattle4Gold(this.enterLimit)){
            hxfn.level.StartJoinGoldFlow();
        }
    },
});