import { hxfn } from '../../FN/HXFN';
import { hxjs } from '../../../HXJS/HXJS';
import { hxdt } from '../../DT/HXDT';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        //基础按钮
        btnHelp:require('UIButton'),
        btnHelpTwo:require('UIButton'),
        btnAfterSale:require('UIButton'),
        btnAfterSale2:require('UIButton'),
        btnQuit:require('UIButton'),

        conStyle1:cc.Node,
        conStyle2:cc.Node,

        //音效信息
        // togMusic:require('UIToggle'),
        // togSound:require('UIToggle'),
        // togShake:require('UIToggle'),
        groupSoundEff:require('UIGroup'),
        groupSoundBGM:require('UIGroup'),
        // groupShake:require('UIGroup'),

        //红色版本
        panels: [cc.Node],
        btnGroup: require('UIGroup'),
        groupHelp:require('UIGroup'),
        btnHelps:[cc.Node],
        panelHelp:[cc.Node],
    },

    onLoad: function () {
        // base func
        this.OnInit('设置');//'ui_lobby_fn_close', 
        
        //设置界面在大厅或者战斗界面
        if(hxjs.uwcontroller.curState === hxdt.enum_game.Enum_GameState.Lobby){
            this.conStyle1.active = true;
            this.conStyle2.active = false;
        }
        else if(hxjs.uwcontroller.curState === hxdt.enum_game.Enum_GameState.Battle){
            this.conStyle1.active = false;
            this.conStyle2.active = true;
        }
        
        //基础按钮
        if(hxdt.setting_comn.gameEdition == hxdt.enum_game.GameEdition.OL) {
            this.btnHelp.SetInfo(function(){
                hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Help');
            }.bind(this),'帮助');
            
            if(this.btnHelpTwo){
                this.btnHelpTwo.SetInfo(function(){
                    hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Help');
                }.bind(this),'帮助');
            };

            if(this.btnAfterSale){
                this.btnAfterSale.SetInfo(function(){
                    hxjs.module.ui.hub.LoadPanel_DlgPop('UI_Lobby_FeedBack');
                }.bind(this),'客服');
            };
            if(this.btnAfterSale2){
                this.btnAfterSale2.SetInfo(function(){
                    hxjs.module.ui.hub.LoadPanel_DlgPop('UI_Lobby_FeedBack');
                }.bind(this),'客服');
            };
        }
        
        this.btnQuit.SetInfo(this.Quit.bind(this),'退出');
        
        //音效信息
        // this.togMusic.SetInfo(this.TogMusic.bind(this), '音乐');
        // this.togSound.SetInfo(this.TogSound.bind(this), '音效');
        // this.togShake.SetInfo(this.TogShake.bind(this), '震动');

        this.groupSoundEff.SetInfo(this.CheckSoundEff.bind(this));
        this.groupSoundBGM.SetInfo(this.CheckSoundBGM.bind(this));

        //红色版本
        if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED) {
            this.btnGroup.SetInfo(this.SelectButton.bind(this));
            this.btnGroup.SetDefaultIdx(0);
        }
    },

    start: function() {
        // this.togMusic.SetChecked(hxfn.setting.GetSoundMusicState());
        // this.togSound.SetChecked(hxfn.setting.GetSoundEffectState());
        // this.togShake.SetChecked(hxfn.setting.GetShakeState());

        this.groupSoundEff.SetDefaultIdx(hxfn.setting.GetSoundEffectState()?1:0);
        this.groupSoundBGM.SetDefaultIdx(hxfn.setting.GetSoundMusicState());

        //红色版本
        if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED) {
            this.groupHelp.SetInfo(this.SelectHelp.bind(this));
            this.groupHelp.SetDefaultIdx(0);
        }
    },

    //红色版本/////////////////////////////////////////////
    SelectButton(idx){
        this.Reset();
        this.panels[idx].active = true;
        var isHelp = idx == 2;
        this.btnHelps.forEach(e => {
            e.active = isHelp;
        });
        this.btnHelps[1].active = false;
        this.btnHelps[2].active = false;

    },

    Reset(){
        this.panels.forEach(element => {
            element.active = false;
        });
    },

    SelectHelp(idx){
        this.ResetHelp();
        this.panelHelp[idx].active = true;
    },

    ResetHelp(){
        this.panelHelp.forEach(element => {
            element.active = false;
        });
    },
    /////////////////////////////////////////////////////////

    Quit:function () {
        hxjs.module.ui.hub.LoadDlg_Check(
            '请问您确定要退出登录吗？',
            hxfn.account.PlayerConfirmQuitLobby,
            null,
            '确认退出',
        );
    },

    CheckSoundEff (idx) {
        var isChecked = idx == 1;
        hxfn.setting.UpdateSoundEffectState(isChecked);
    },
    CheckSoundBGM (idx) {
        //0:无，1:中国风，2:爵士风
        hxfn.setting.UpdateSoundMusicState(idx);
    },

    // TogMusic: function (isChecked){
    //     hxfn.setting.UpdateSoundMusicState(isChecked);
    // },

    // TogSound: function (isChecked) {
    //     hxfn.setting.UpdateSoundEffectState(isChecked);
    // },

    // TogShake: function(isChecked) {
    //     hxfn.setting.UpdateShakeState(isChecked);
    // },

});