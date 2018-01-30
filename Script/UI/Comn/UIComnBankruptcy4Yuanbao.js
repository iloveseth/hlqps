import { hxfn } from "../../FN/HXFN";

// import { hxjs } from '../../../../HXJS/HXJS';

cc.Class({
    extends:cc.Component,

    properties: {
        btnBankGet: {
            default : null,
            type: cc.Node,
            override: true,
        },
        btnRecharge: {
            default : null,
            type: cc.Node,
            override: true,
        },
        btnCancel: {
            default : null,
            type: cc.Node,
            override: true,
        },
        txtYuanbao:cc.Label,

        btn_BankGet:{default: null, serializable: false, visible: false,},
        btn_Recharge:{default: null, serializable: false, visible: false},
        btn_Cancel:{default: null, serializable: false, visible: false},
    },
    
    onLoad:function () {

        if(this.btnBankGet){
            this.btn_BankGet = this.btnBankGet.getComponent('UIButton');
            this.btn_BankGet.SetInfo(this.Bankget.bind(this));
        }
        if(this.btnRecharge){
            this.btn_Recharge = this.btnRecharge.getComponent('UIButton');
            this.btn_Recharge.SetInfo(this.Recharge.bind(this));
        }
        if(this.btnCancel){
            this.btn_Cancel = this.btnCancel.getComponent('UIButton');
            this.btn_Cancel.SetInfo(this.Cancel.bind(this));
        }
        this.txtYuanbao.string = hxfn.role.curBankYuanbao.toCoin();
    },
    
    Bankget:function () {
        cc.log('~~~~~~~~~~~~~~~~Bankget');
        hxjs.module.ui.hub.Unload(this.node); 
        if(hxfn.comn.notEnoughToLobby){
            if(hxjs.uwcontroller.curState==hxdt.enum_game.Enum_GameState.Battle){
                // hxjs.util.Notifier.emit('UI_BattleQuitFastToShop',3);
                hxfn.battle.QuitFastToShop(3);  
            }
            else{
                hxjs.util.Notifier.emit('open_shop',3);
            }
        }
        else{
           // hxjs.util.Notifier.emit('open_shop',3);
           hxfn.shop.curShop = 3/*索引：元宝*/;
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Shop_new2');
        }
     
       
    },
    Recharge:function(){
        cc.log('~~~~~~~~~~~~~~~~Recharge');
        hxjs.module.ui.hub.Unload(this.node);
        // 打开商店
        hxfn.shop.curShop = 0/*索引：元宝*/;
        if(hxfn.comn.notEnoughToLobby){
            if(hxjs.uwcontroller.curState==hxdt.enum_game.Enum_GameState.Battle){
                // hxjs.util.Notifier.emit('UI_BattleQuitFast','UI_Lobby_Shop_new2'); 
                hxfn.battle.QuitFastToRoomList('UI_Lobby_Shop_new2');
            }
            else{
                hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Shop_new2');
            }
        }
        else{
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Shop_new2');
        }
    } ,
    Cancel:function () {
        cc.log('~~~~~~~~~~~~~~~~Cancel');
        hxjs.module.ui.hub.Unload(this.node);
        if(hxfn.comn.notEnoughToLobby){
            // hxjs.util.Notifier.emit('UI_BattleQuit');
            hxfn.battle.QuitNormal();
        }
    },
  
});