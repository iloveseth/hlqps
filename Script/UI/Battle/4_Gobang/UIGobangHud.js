import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {
        btnSetting:require('UIButton'),
        btnHelp:require('UIButton'),
        btnQuit:require('UIButton'),
    },

    ///////////////////////////////////////////////////////////////
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    // update (dt) {},
    start () {
        this.btnSetting.SetInfo(this.Setting.bind(this));
        this.btnHelp.SetInfo(this.Help.bind(this));
        this.btnQuit.SetInfo(this.Quit.bind(this));
    },
    ///////////////////////////////////////////////////////////////
    
    Setting(){
        hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Setting');
    },

    Help(){
        hxjs.module.ui.hub.LoadPanel('UI_Battle_Gobang_Rule');
    },

    Quit(){
        hxfn.five.QuitRoomNoResult();
    },
});
