import { hxfn } from "../../../FN/HXFN";
import {hxjs} from "../../../../HXJS/HXJS";
import {hxdt} from "../../../DT/HXDT";

cc.Class({
    extends: cc.Component,

    properties: {
        btnEntered: cc.Node,

        maxYuanbao: 5000,
        minYuanbao: 60,
        difen:2,
        // leftLimit:-1,
    },

    onLoad: function () {
        this.btnEntered.getComponent('UIButton').SetInfo(this.StartGame.bind(this));
        hxfn.adjust.AdjustLabel(this.node);
    },

    start: function (){
        // this.txtCurRoleGold.string = parseInt(hxfn.role.curGold).toCoin();

        // hxjs.module.ui.hub.ShowWaitingUI();
        // hxfn.netrequest.Req_GetGoldEntryInfo(
        //     function(msg){
        //         hxjs.module.ui.hub.HideWaitingUI();
        //         this.SetInfo(msg);
        //     }.bind(this)
        // );
    },

    // SetInfo (info/*gameplay id*/) {
    //     //如果是静态配置的话则需要根据游戏类型来读取相应的配置信息
    //     // let panelName = confGameplay[gameplayID+'']['difficulty-style'];
    //
    //     var playerCount = info['playerCount'];
    //     var dizhu = info['difen'];
    //     this.enterLimit = info['enterLimit'];go
    //
    //     this.txtMemberCount.string = '（' + playerCount + '人在线）';
    //     this.txtLimitChipin.string = dizhu +'金币';//'底注：' +
    //     this.txtEnterCond.string = this.enterLimit+'金币进入';
    //
    //     hxfn.map.UpdateCoinInfo(dizhu, this.enterLimit, 0);
    // },

    StartGame(){
        var carryYuanbao = parseInt(hxfn.role.curUserData.goldenInfo.yuanbao);
        // if(carryYuanbao < 60 || carryYuanbao > 5000 || isNaN(carryYuanbao)){
        //     hxjs.module.ui.hub.LoadDlg_Info('60-5000元宝进入新手房', '提示');
        //     return;
        // }

        if(carryYuanbao < 60){
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Dlg_Check_Bankruptcy4Ingot');
            return;
        }
        if(carryYuanbao > 5000){
            //hxjs.module.ui.hub.LoadDlg_Info('您携带元宝过多，请前往元宝场');
            hxjs.module.ui.hub.LoadDlg_Check(
                '您携带元宝过多，请前往元宝房',
                ()=>{
                    hxjs.util.Notifier.emit('UI_Lobby_JoinRoom',0);
                },//hxfn.account.OnStart,
                null,//hxfn.login.QuitByNetErr
                '提示',
                '确定',
                '',//hxdt.setting.lang.Comn_Quit,
                'UI_Dlg_Check_DisableNet'
            );
            return;
        }

        //if(hxfn.level.CheckEnterBattle4Gold(this.enterLimit)){
            hxfn.level.StartJoinGreenRoom();
        //}
    },
});