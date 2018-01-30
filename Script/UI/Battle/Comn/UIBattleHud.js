import { hxfn } from '../../../FN/HXFN';
import { hxdt } from '../../../DT/HXDT';
import { hxjs } from '../../../../HXJS/HXJS';
// import { hxjs } from '../../../../HXJS/HXJS';

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        //所有功能按钮
        btnQuit: require('UIButton'),
        btnGetCoin: require('UIButton'),
        btnRule: require('UIButton'),
        btnChat: require('UIButton'),
        btnTalk: require('UIButton'),
        btnSetting: require('UIButton'),
        btnTestReset: require('UIButton'),
        conSafeGuard: cc.Node,

        //折叠功能按钮
        btnToggleMenu: require('UIButton'),
        conMenu: cc.Node,

        btnTestCoin: require('UIButton'),

        // sonItemRoleInfo: cc.Node,
        // lstRoleCoin: cc.Node,

        // [nondisplay]
        isShowMmenu: { default: false, serializable: false, visible: false, },
        isShowRule: { default: false, serializable: false, visible: false, },
        isStartRecord: { default: false, serializable: false, visible: false, },
        RecordPrefab: { default: null, serializable: false, visible: false, },
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onLoad: function () {
        hxfn.adjust.AdjustLabel(this.node);

        this.OnInit();
    },

    OnInit() {
        this.conSafeGuard.active = false;

        this.btnQuit.SetInfo(this.QuitRoomCheck.bind(this));
        this.btnGetCoin.SetInfo(this.OpenShop.bind(this));
        this.btnRule.SetInfo(function () {
            //TEST请打开这里测试因为网络异常退出
            // hxfn.login.QuitByNetErr();
            switch (hxfn.map.curGameTypId) {
                case hxfn.map.Enum_GameplayId.QiangZhuang:
                    hxjs.module.ui.hub.LoadPanel('UI_Battle_NiuNiu_Rule');
                    break;
                case hxfn.map.Enum_GameplayId.CombatEye://博眼子
                    break;
                case hxfn.map.Enum_GameplayId.Gobang://五子棋
                    break;
                case hxfn.map.Enum_GameplayId.FightLandlords://斗地主
                    hxjs.module.ui.hub.LoadPanel('battle_landlord/UI_Battle_Landlord_Rule');
                    break;
                case hxfn.map.Enum_GameplayId.LuoSong://罗松
                    log.trace("LuoSong", "UIBattleHud -> case hxfn.map.Enum_GameplayId.LuoSong");
                    //hxjs.module.ui.hub.LoadPanel('battle_landlord/UI_Battle_Landlord_Rule');
                    break;
                default:
                    break;
            }
        }.bind(this));
        this.btnChat.SetInfo(function () { hxjs.module.ui.hub.LoadPanel('UI_Comn_Chat'); }.bind(this));
        this.btnSetting.SetInfo(function () { hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Setting'); }.bind(this));
        // this.btnTalk.SetInfo(function(){hxjs.module.ui.hub.LoadPanel('UI_Comn_Record');}.bind(this));
        this.btnTalk.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.StartRecord();
        }, this);
        this.btnTalk.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.EndRecord();
        }, this);
        this.btnTalk.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.EndRecord();
        }, this);
        this.btnTalk.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (Math.abs(event.touch.getLocation().x - event.touch.getStartLocation().x) > hxdt.setting_niuniu.Anim_Voice_Record_Cancel_Distance
                || Math.abs(event.touch.getLocation().y - event.touch.getStartLocation().y) > hxdt.setting_niuniu.Anim_Voice_Record_Cancel_Distance) {
                this.EndRecord();
            }
        }, this);

        //！！！！测试退出战斗之后自动重进战斗
        if (this.btnTestReset) {
            this.btnTestReset.SetInfo(function () {
                hxjs.uwcontroller.GameStop2LeaveBattleRoom();
                hxjs.uwcontroller.GameResume2EnterBattleRoom();
            }.bind(this));
        }

        // if(!hxdt.setting_comn.isOL) {
        this.btnToggleMenu.getComponent('UIButton').SetInfo(
            function () {
                this.isShowMmenu = !this.isShowMmenu;
                this.ShowMenu(this.isShowMmenu);
            }.bind(this)
        );
        // }

        hxfn.global.HandleNodes([this.btnTalk.node], !hxdt.setting_comn.IsWebVersion())
        this.btnTestCoin.SetInfo(function () { hxjs.module.ui.hub.LoadPanel('UI_Test'); }, '飞金币测试')
        this.ShowMenu(this.isShowMmenu);
    },

    start: function () {
        this.HandleServerInform(true);
        this.HandleNotify(true);

        // hxfn.battle.Regist_Hud(this);
        // this.InitComplete();
    },
    OnStartReal: function () {
        this.btnGetCoin.node.active = !(hxfn.map.curRoomTyp === 0/*金币场*/);
    },
    OnReset: function () {
        //没有数据变化，不需要刷新
    },
    OnEnd() {
        this.HandleServerInform(false);
        this.HandleNotify(false);

        this.hasShowSafeGuardOnce = false;
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    HandleNotify: function (isHandle) {
        if (isHandle) {
        }
        else {
        }
    },

    HandleServerInform: function (isHandle) {
        if (isHandle) {
            //服务器推送此条信息一定是在至少第一局结束之后，所以在此注册，时机上没有问题
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.NoticeSafeGuard, this.NoticeSafeGuard.bind(this));
        } else {
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.NoticeSafeGuard);
        }
    },
    ///////////////////////////////////////////////////////////////////////////////////////

    NoticeSafeGuard: function () {
        if (hxfn.map.curRoomTyp == 1/*元宝场*/) {
            if (this.hasShowSafeGuardOnce)
                return;

            this.hasShowSafeGuardOnce = true;

            // if(!this.conSafeGuard.activeInHierarchy) {
            hxjs.module.ui.hub.ShowCom(this.conSafeGuard);
            // }
        }
    },

    QuitRoomCheck: function () {
        if (hxfn.battle.hasPlayedCurGame && hxfn.battle.isBattlePlaying) {
            hxjs.module.ui.hub.LoadDlg_Check(
                hxdt.setting.lang.Battle_Quit_Notify,
                this.QuitRoomReq.bind(this),
                null,
                '友情提示',
            );
        }
        else {
            this.QuitRoomReq();
        }
    },

    QuitRoomReq: function () {
        // if(hxfn.battle.IsBattlePlaying()) {
        hxjs.module.ui.hub.ShowWaitingUI();
        hxfn.netrequest.Req_QuitRoom(hxfn.role.playerId, this.QuitRoomSucc.bind(this));
        // }
    },

    QuitRoomSucc: function (info) {
        hxjs.module.ui.hub.HideWaitingUI();
        if (info.get('result') == 0/*OK*/) {
            // hxjs.util.Notifier.emit('UI_BattleQuit');
            hxfn.battle.QuitNormal();
        }
    },

    OpenShop: function () {
        //不管有没有提示，一旦点击打开商店，就关闭元宝不足提示
        hxjs.module.ui.hub.HideCom(this.conSafeGuard);

        hxfn.shop.curShop = 0;//元宝房
        hxfn.shop.GetMarketList(
            function () {
                hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Shop_new2');
            }.bind(this)
        );
    },

    ShowMenu: function (isShow) {
        this.conMenu.active = isShow;
    },
    StartRecord: function () {
        if (this.isStartRecord == false) {
            this.isStartRecord = true;

            if (hxfn.bridge.StartRecord() == true) {
                hxjs.module.ui.hub.LoadPanel('UI_Comn_Record', function (prefab) {
                    this.RecordPrefab = prefab;
                    if (this.isStartRecord == false) {
                        hxjs.module.ui.hub.Unload(this.RecordPrefab);
                        this.RecordPrefab = null;
                    }

                }.bind(this));
                this.scheduleOnce(function () {
                    this.EndRecord();
                }.bind(this), hxdt.setting_niuniu.Anim_Voice_Record_Time);

                //禁用背景音乐
                hxjs.module.sound.Silence();
            }
        }
    },
    EndRecord: function () {
        if (this.isStartRecord) {
            if (this.RecordPrefab != null) {
                hxjs.module.ui.hub.Unload(this.RecordPrefab);
                this.RecordPrefab = null;
            }

            hxfn.bridge.StopRecord();
        }
        this.isStartRecord = false;

        //恢复背景音乐
        hxjs.module.sound.Recover();
    }
});