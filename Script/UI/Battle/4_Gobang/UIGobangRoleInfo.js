import { hxfn } from "../../../FN/HXFN";

cc.Class({
    extends: cc.Component,

    properties: {
        //基础功能
        btnSelect:cc.Node,
        //基础玩家信息
        conUIItemRole:cc.Node,
        sonItem_Role:{ default: null, serializable: false, visible: false},
        //战斗实时信息
        //0 全局
        conLost: cc.Node,//状态：是否丢失
        imgGold:cc.Sprite,//货币类型
        txtRoleGold: cc.Label,

        //[nondisplay]
        idx:{ default: -1, serializable: false, visible: false},
        info:{ default: null, serializable: false, visible: false},
        playerid:{ default: '', serializable: false, visible: false},

        txtPlayerId : cc.Label,
    },

    onLoad: function () {
        // if(this.btnSelect){
        //     this.btnSelect.getComponent('UIButton').SetInfo(function(){
        //         //如果当前位置有玩家，则可以点击查看详情，邀请好友
        //         if(this.CheckValidPlayer() && this.idx !==0/*0表示永远是玩家自己*/) {
        //             hxfn.battle.curSelectSeatIdx = this.idx;
        //             hxjs.module.ui.hub.LoadPanel('UI_Role_BattleInfo_Other');//LoadPanel_Dlg
        //         }
        //     }.bind(this));
        // }
        

        // this.syncMsg = [
        //     'SyncPlayerJoinRoom',
        //     'SyncError',
        //     'SyncPlayerQuitRoom',
        //     'SyncForceLeft',
        //     'SyncPlayerLost',
        // ];
        this.notifiers = [
            //'Room_SyncPlayerJoinRoom',

        ];

        eval(hxfn.global.HandleNotifiersStr(this.notifiers,true)); 

        hxjs.module.ui.hub.LoadPanel('UI_Item_RoleInfo_2',function(prefab){
            this.sonItem_Role = prefab;
            this.InitItemRole();
        }.bind(this),this.conUIItemRole);

    },

    onDestroy:function (){

        if(this.sonItem_Role != null)
            hxjs.module.ui.hub.Unload(this.sonItem_Role);
    },

    OnReset:function (){
        if(this.btnSelect){
            this.btnSelect.active = false;
        }
        
        this.conUIItemRole.active = false;

        //重置玩家所有实时信息
        this.imgGold.node.active = false;
        this.txtRoleGold.node.active = false;
        this.conLost.active = false;
        if(this.txtPlayerId){
            this.txtPlayerId.string = '';
        }
    },

    InitItemRole:function(){
        if(this.sonItem_Role != null && this.basicInfo != null && this.idx != -1)
            this.sonItem_Role.getComponent('UIItemRoleInfoTS').SetInfo(this.basicInfo, this.idx);
    },

    SetInfo (info, idx) {
        this.idx = idx;
        this.info = info;

        this.OnReset();
        
        if(info!= null) {
            this.basicInfo = info.get('playerInfo');
            this.playerid = this.basicInfo['userData'].get('playerId');

            if(this.txtPlayerId){
                this.txtPlayerId.string = 'ID: ' + this.playerid;
            }

            //0,基础功能
            if(this.btnSelect){
                this.btnSelect.active = true;
            }
           
            //房间货币类型
            this.imgGold.node.active = true;
            if(hxfn.map.curRoom['roomTyp'] == 0){
                hxjs.module.asset.LoadAtlasSprite(hxfn.comn.coinAtlas,hxfn.comn.CoinPath[hxfn.comn.ItemTyp.gold],this.imgGold);
            }
            if(hxfn.map.curRoom['roomTyp'] == 1){
                hxjs.module.asset.LoadAtlasSprite(hxfn.comn.coinAtlas,hxfn.comn.CoinPath[hxfn.comn.ItemTyp.yuanbao],this.imgGold);
            }

            //1，更新基础信息
            this.conUIItemRole.active = true;
            this.InitItemRole();
            this.InitCoin(this.basicInfo);

            //0, 常见信息
            //处理房间币,同步给全局的玩家货币
            var amount = parseInt(info.get('roomCoin'));
            this.UpdateCoin(amount);

            //hxfn.battle_pinshi.SetBattleInsInfo(info, idx);
        }
    },

    InitCoin:function (infodata){
        var goldenInfo = infodata['goldenInfo'];
        var gold = goldenInfo.get('gold');//金币
        var diamond = goldenInfo.get('diamond');//钻石
        var yuanbao = goldenInfo.get('yuanbao');//元宝
        
        if(hxfn.map.curRoomTyp == hxfn.map.Enum_RoomTyp.Gold/*金币场*/){
            this.UpdateCoin(parseInt(gold));
        }
        else if(hxfn.map.curRoomTyp == hxfn.map.Enum_RoomTyp.Ingot){//元宝房
            this.UpdateCoin(parseInt(diamond));
        }
    },

    UpdateCoin:function(amount) {
        this.txtRoleGold.node.active = true;
        this.txtRoleGold.string = amount.toCoin();
    }
});