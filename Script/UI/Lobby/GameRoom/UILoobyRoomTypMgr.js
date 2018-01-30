cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        //[display]
        tempPanel:cc.Node,
        groupMenu: cc.Node,
        //ingot 元宝房
        conIngot:cc.Node,
        uiIngotEntry:cc.Node,
        //gold 金币房
        conGold:cc.Node,
        conGreen:cc.Node,

        //[nondisplay]
        uiGoldEntry:null,
        uiGoldEntry2:null,
        scr_uiIngotEntry:null,
        scr_groupMenu:null,
    },

    onLoad: function () {
        this.OnInit(hxdt.setting.lang.Map_Room_Enter);// base func//'ui_lobby_fn_close', 

        //初始化动态加载：金币房，分阶选择
        this.scr_uiIngotEntry = this.uiIngotEntry.getComponent('UILobbyRoomTypIngot');
        hxjs.module.ui.hub.LoadPanel ('UI_Lobby_RoomTyp_Gold_new2', function(pref){
            this.uiGoldEntry = pref;
        }.bind(this),this.conGold);

        hxjs.module.ui.hub.LoadPanel ('UI_Lobby_RoomTyp_Greenhand', function(pref){
            this.uiGoldEntry2 = pref;
        }.bind(this),this.conGreen);

        this.scr_groupMenu = this.groupMenu.getComponent('UIGroup');
        this.scr_groupMenu.SetInfo (this.SelectMenu.bind(this),['元宝房','金币房']);
        hxfn.adjust.AdjustLabel(this.node);
        hxjs.util.Notifier.on('UI_Lobby_RoomTypMgr_Select_Ingot', this.SelectIngot, this);
        hxjs.util.Notifier.on('UI_Lobby_JoinRoom', this.OpenJoinRoom, this);
    },

    OpenJoinRoom(idx){
        this.scr_groupMenu.SetSelect(idx);
    },
    SelectIngot:function(){
        this.scr_groupMenu.SetSelect(0);
    },
    start:function () {
        this.scr_groupMenu.SetDefaultIdx(hxfn.map.curRoomTyeIdxSet);
    },

    onDestroy:function () {
        hxjs.module.ui.hub.Unload(this.uiGoldEntry); 
        hxjs.module.ui.hub.Unload(this.uiGoldEntry2); 
        hxjs.util.Notifier.off('UI_Lobby_RoomTypMgr_Select_Ingot', this.SelectIngot, this);
        hxjs.util.Notifier.off('UI_Lobby_JoinRoom', this.OpenJoinRoom, this);
    },

    SelectMenu: function(idx){
        this.conIngot.active = false;
        this.conGold.active = false;
        this.conGreen.active = false;

        switch (idx) {
            case 0:
                hxfn.map.curRoomTyp = 1;
                //元宝房
                this.conIngot.active = true;
                this.scr_uiIngotEntry.UpdateIngotRoomList ();
                break;
            case 1:
                hxfn.map.curRoomTyp = 0;
                //金币房
                this.conGold.active = true;
                break;
            case 2:
                hxfn.map.curRoomTyp = 1;
                this.conGreen.active = true;
            default:
                break;
        }
    },

    Show (gameplayId) {
        this.tempPanel.active = true;
        // hxjs.module.ui.hub.TogglePanel(this.curUI, 'UI_LevelDifficulty_Style1','' , true, function(prefab){
        //     this.curUI = prefab;
        //     this.curUI.getComponent('UILevelDifficulty').SetInfo(gameplayId);
        // }.bind(this));
    },

    Hide () {
        this.tempPanel.active = false;
        // hxjs.module.ui.hub.TogglePanel(this.curUI, 'UI_LevelDifficulty_Style1','' , false);
    },

    Clear () {
        this.cachePanels = {};
    }
});