import { hxdt } from "../../../DT/HXDT";
import { hxfn } from "../../../FN/HXFN";

cc.Class({
    extends: cc.Component,

    properties: {
        //[display]
        lstRole: cc.Node,

        //[nondisplay]
        scr_lstRole:{ default: null, serializable: false, visible: false},
    },

    onLoad: function () {
    },
    
    /////////////////////////////////////////////////////////////////
    OnInit () {
        this.scr_lstRole = this.lstRole.getComponent('UILst');
    },
    
    OnEnd () {
        this.ResetRoles();
    },
    
    OnReset () {
        this.ResetRoles();
    },
    /////////////////////////////////////////////////////////////////

    SyncRoomCoin (playersCoinInfo) {
        var allPlayerCoins = playersCoinInfo.get('playerCoins');

        var idx;
        var count;
        allPlayerCoins.forEach(function(element) {
            if(element != null) {
                idx = hxfn.battle.GetUISeatIdx(element.get('playerId'));
                count = parseInt(element.get('roomCoin'));
                hxjs.util.Notifier.emit('UI_BattleSyncCoin', [idx, count]);
            }
        }, this);
    },

    ResetRoles:function () {
        // hxfn.battle.ClearAllRoles();
        this.scr_lstRole.Reset();
    },

    SetOriginalPlayers() {//players
        // hxfn.battle.InitAllRoles(players, hxdt.setting_niuniu.maxUISeats);
        this.scr_lstRole.SetInfo(hxfn.battle.uiRoles);
    },

    SyncPlayerJoinRoom (player) {
        if(hxfn.battle.AddRole(player)) {
            //全刷新
            // this.scr_lstRole.SetInfo(hxfn.battle.uiRoles);

            // 单个刷新
            var seatIdx = hxfn.battle.GetUISeatIdx2(player);
            this.scr_lstRole.SetItem(seatIdx,player);
        }
    },
    SyncPlayerLost (playerid) {
        var seatIdx = hxfn.battle.GetUISeatIdx(playerid);
        
        // 此时并不是真正退出，只是用来做表现，如果真正退出会收到Quit消息
        hxjs.util.Notifier.emit('UI_BattleLost', seatIdx);
    },
    SyncPlayerQuitRoom (playerid) {
        var seatIdx = hxfn.battle.GetUISeatIdx(playerid);
        this.scr_lstRole.SetItem(seatIdx, null);
    },
});