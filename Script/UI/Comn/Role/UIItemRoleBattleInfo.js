import { hxfn } from "../../../FN/HXFN";

// import { hxdt } from "../../../DT/HXDT";
// import { hxfn } from "../../../FN/HXFN";

cc.Class({
    extends: cc.Component,

    properties: {
        //基础功能
        imgFrame:cc.Node,
        btnSelect:cc.Node,
        //基础玩家信息
        conUIItemRole:cc.Node,
        sonItem_Role:{ default: null, serializable: false, visible: false},
        //战斗实时信息
        //0 全局
        conLost: cc.Node,//状态：托管中/离开中/丢失(TODO: 断线重连缺少玩家是否处于托管中的标记)
        conUnJoined:cc.Node,//状态：本局未加入/本局观战中（下局开始）
        //conReady:cc.Node,//状态：已准备
        imgGold:cc.Sprite,//货币类型
        txtRoleGold: cc.Label,

        //[nondisplay]
        idx:{ default: -1, serializable: false, visible: false},
        info:{ default: null, serializable: false, visible: false},
        playerid:{ default: '', serializable: false, visible: false},

        hasInit:{ default: false, serializable: false, visible: false},
    },
    
    ////////////////////////////////////////////////////////////////////////////////////
    // onLoad: function () {
    //     this.OnInit();
    // },

    OnInit(){
        if(this.hasInit) return;
        this.hasInit = true;

        this.HandleNotify(true);

        this.btnSelect.getComponent('UIButton').SetInfo(function(){
            //如果当前位置有玩家，则可以点击查看详情，邀请好友
            if(this.CheckValidPlayer() && this.idx !==0/*0表示永远是玩家自己*/) {
                hxfn.battle.curSelectSeatIdx = this.idx;
                hxjs.module.ui.hub.LoadPanel('UI_Role_BattleInfo_Other');//LoadPanel_Dlg
            }
        }.bind(this));

        hxjs.module.ui.hub.LoadPanel('UI_Item_RoleInfo',function(prefab){
            cc.log('~~~~~~~~~~~~~~Set Role Icon: load complete');
            this.sonItem_Role = prefab;
            this.InitItemRole();
        }.bind(this),this.conUIItemRole);
    },

    OnReset:function (){
        this.imgFrame.active = false;
        this.btnSelect.active = false;
        this.conUIItemRole.active = false;

        //重置玩家所有实时信息
        this.imgGold.node.active = false;
        this.txtRoleGold.node.active = false;
        this.conLost.active = false;
        this.conUnJoined.active = false;
    },

    onDestroy:function (){
        this.hasInit = false;
        this.HandleNotify(false);

        if(this.sonItem_Role != null)
            hxjs.module.ui.hub.Unload(this.sonItem_Role);
    },
    ////////////////////////////////////////////////////////////////////////////////////

    HandleNotify:function (isHandle){
        if(isHandle){
            //利用消息 实时同步货币
            hxjs.util.Notifier.on('UI_BattleSyncCoin', this.SyncBattleCoin, this);//[seatIdx, count]
            //状态：在线，离线，观战中，已准备
            hxjs.util.Notifier.on('UI_BattleComeBack', this.ChangeStatus_ComeBack, this);
            hxjs.util.Notifier.on('UI_BattleLost', this.ChangeStatus_Lost, this);
            hxjs.util.Notifier.on('UI_Battle_RecoverJoinedStatus', this.RecoverJoinedStatus, this);
        }
        else {
            hxjs.util.Notifier.off('UI_BattleSyncCoin', this.SyncBattleCoin, this);
            //状态：在线，离线，观战中，已准备
            hxjs.util.Notifier.off('UI_BattleComeBack', this.ChangeStatus_ComeBack, this);
            hxjs.util.Notifier.off('UI_BattleLost', this.ChangeStatus_Lost, this);
            hxjs.util.Notifier.off('UI_Battle_RecoverJoinedStatus', this.RecoverJoinedStatus, this);
        }
    },

    ChangeStatus_Lost:function (seatIdx) {
        if(this.idx === seatIdx){
            this.conLost.active = true;
        }
    },
    ChangeStatus_ComeBack:function (seatIdx) {
        if(this.idx === seatIdx){
            this.conLost.active = false;
        }
    },

    SyncBattleCoin:function (arr){
        if(this.idx == arr[0])
            this.UpdateCoin(arr[1]);
    },

    CheckValidPlayer:function (){
        return this.idx != -1;
    },

    InitItemRole:function(){
        if(this.sonItem_Role && this.basicInfo && this.idx != -1)
            this.sonItem_Role.getComponent('UIItemRoleInfoTS').SetInfo(this.basicInfo, this.idx);
    },

    SetInfo (info, idx) {
        this.OnInit();

        this.idx = idx;
        this.info = info;

        this.OnReset();
        
        if(info!= null) {
            this.basicInfo = info.get('playerInfo');
            this.playerid = this.basicInfo['userData'].get('playerId');

            //0,基础功能
            this.imgFrame.active = true;//金边，新需求是所有玩家都有，以前是只有玩家自己才有！！！
            this.btnSelect.active = true;
            //房间货币类型
            this.SetCoinStyle();
            
            //0，更新基础信息
            this.conUIItemRole.active = true;
            cc.log('~~~~~~~~~~~~~~Set Role Icon: extern SetInfo');            
            this.InitItemRole();
            this.InitCoin(this.basicInfo);
            
            //1, 常见信息
            //处理房间币,同步给全局的玩家货币
            var amount = parseInt(info.get('roomCoin'));
            this.UpdateCoin(amount);
            
            //2，更新状态
            this.SetStatus_Unjoined(!hxfn.battle.CheckJoinedCurrentRing(info));
            //2，只有当前是出处于（战斗过程中？？？），才更新即时信息；否则跳过此步，以即时信息为准
            hxfn.battle_pinshi.SetBattleInsInfo(info, idx);
        }
    },
    
    SetCoinStyle:function(){
        this.imgGold.node.active = true;
        // if(hxfn.map.curRoom['roomTyp'] == 0){
        //     hxjs.module.asset.LoadAtlasSprite(hxfn.comn.coinAtlas,hxfn.comn.CoinPath4Battle[hxfn.comn.ItemTyp.gold],this.imgGold);
        // }
        // if(hxfn.map.curRoom['roomTyp'] == 1){
        //     hxjs.module.asset.LoadAtlasSprite(hxfn.comn.coinAtlas,hxfn.comn.CoinPath4Battle[hxfn.comn.ItemTyp.yuanbao],this.imgGold);
        // }
    },
    
    RecoverJoinedStatus:function (){
        this.SetStatus_Unjoined(false);
    },
    SetStatus_Unjoined:function(isUnjoined){
        this.conUnJoined.active = isUnjoined;
    },

    InitCoin:function (infodata){
        var goldenInfo = infodata['goldenInfo'];
        var gold = goldenInfo.get('gold');//金币
        var diamond = goldenInfo.get('diamond');//钻石
        var yuanbao = goldenInfo.get('yuanbao');//元宝
        
        // var amount = -1;
        if(hxfn.map.curRoomTyp == 0/*金币场*/){
            this.UpdateCoin(parseInt(gold));
            // amount = parseInt(gold);
        }
        else if(hxfn.map.curRoomTyp == 1){//元宝房
            this.UpdateCoin(parseInt(diamond));
            // amount = parseInt(diamond);
        }

        // this.txtRoleGold.node.active = true;
        // this.txtRoleGold.string = amount.toCoin();
    },

    UpdateCoin:function(amount) {
        this.txtRoleGold.node.active = true;
        this.txtRoleGold.string = amount.toCoin();

        // // 判断房间类型
        // var typ = -1;
        // if(hxfn.map.curRoomTyp == 0/*金币场*/){
        //     typ = 300;
        // }
        // else if(hxfn.map.curRoomTyp == 1/*元宝场*/){
        //     typ = 301;
        // }

        // //如果是玩家自己的话，则同步货币信息
        // if(this.playerid === hxfn.role.playerId)
        //     hxfn.role.SyncRoleCoinInfo(typ,amount);
    }
});