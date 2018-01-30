import { hxfn } from "../../FN/HXFN";
import { log } from "../../../HXJS/Util/Log";



cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        imgIcon: cc.Sprite,
        // imgBg: cc.Sprite,
        // txtNum: cc.Label,
        btnClick: cc.Button,
        conLock: cc.Node,
        conUnlock: cc.Node,

        // [nondisplay]
        isOpen: { default: 0, serializable: false, visible: false },
        index: { default: 0, serializable: false, visible: false },
        // gameplayID:{ default: 0, serializable: false, visible: false},
    },

    onLoad: function () {
        this.btnClick.getComponent('UIButton').SetInfo(this.Select.bind(this));
    },

    Select() {
        if (this.isOpen === 0) {
            hxjs.module.ui.hub.LoadDlg_Info('暂未开放！', '提示');
        }
        else {
            this.SelectGame();
        }
    },

    SelectGame: function () {
        hxfn.map.curGameTypId = this.gameplayID;

        log.trace("Test", "hxfn.map.curGameTypId=" + hxfn.map.curGameTypId);
        
        //特殊处理，如果是红包广场的话
        if (this.gameplayID == hxfn.map.Enum_GameplayId.RedPack) {
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_RedPack');
        }
        else if (this.gameplayID == hxfn.map.Enum_GameplayId.Gobang) {
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_RoomTyp_Ingot_Create_Gobang');
        }
        // else if(this.gameplayID == hxfn.map.Enum_GameplayId.LuoSong){
        //     hxjs.module.ui.hub.LoadPanel_Dlg('');
        // }
        else {
            // hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_RoomTypMgr_new2');
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_RoomTypMgr_new2');
        }
    },

    SetInfo(info/*configID*/, idx) {
        this.ToggleVisible(false);

        // this.gameplayID = configID;
        // var conf = conf_gameplay[configID+''];

        // message GoldenMenuProto 
        this.index = idx;
        var conf = info;
        if (conf) {
            this.gameplayID = conf.get('gameType');


            this.isOpen = conf.get('isOpen');
            // this.txtNum.string = conf.get('gameName');
            // if (this.gameplayID == 13)   //Test ming.lei
            // {
            //     this.isOpen = 1;
            // }

            // var isLock = this.CheckisLock();
            // this.conLock.active = isLock;
            // this.conUnlock.active = !isLock;

            var gpIcon = conf.get('menuIcon');
            var gpBg = conf.get('menuBgId');
            
            //红色版本
            if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED) {
                hxjs.module.asset.LoadAtlasSprite ('lobby_main', gpIcon, this.imgIcon, this.CompleteImg.bind(this));
                if(idx%2 == 1){
                    this.btnClick.node.y = -40;
                    this.imgIcon.node.y = -40;
                }
                if(idx%2 == 0){
                    this.btnClick.node.y = 80;
                    this.imgIcon.node.y = 80;
                }
            }
            else {
                hxjs.module.asset.LoadAtlasSprite('lobby_main2', gpIcon, this.imgIcon, this.CompleteImg.bind(this));
            }
        }
    },

    CompleteImg: function () {
        this.ToggleVisible(true);
    },
    CheckisLock() {
        return this.isOpen === 0;
    },

    ToggleVisible: function (isShow) {
        // cc.log('ToggleVisible: ' + isShow);

        if (isShow) {
            // this.txtNum.node.active = false;
            if (this.conLock)
                this.conLock.active = this.CheckisLock();
            if (this.conUnlock)
                this.conUnlock.active = !this.CheckisLock();

            if (this.conUnlock && this.conUnlock.active) {
                this.conUnlock.getComponent("UIAnimation").startDelay(this.index);
            }
        }
        else {
            // this.txtNum.node.active = false;
            if (this.conLock)
                this.conLock.active = false;
            if (this.conUnlock)
                this.conUnlock.active = false;
        }
    },
});