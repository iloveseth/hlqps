import { hxjs } from "../../HXJS";
import { hxdt } from "../../../Script/DT/HXDT";
import { hxfn } from "../../../Script/FN/HXFN";
import { UWView } from "./UWView";
import { log } from "../../Util/Log";

export let uwcontroller = {
    curState: hxdt.enum_game.Enum_GameState.None,

    SetState: function (state) {
        cc.log('+++++++++++++++++++++ uw controller SetState: ' + state);

        if (state == this.curState) {
            if (this.curState === state) {
                this.OnReset();
            }
            return;
        }

        if (this.curState != hxdt.enum_game.Enum_GameState.None)
            this.LeaveState(this.curState);

        this.curState = state;

        this.OnInit();
        hxjs.uicontroller.SetState(state);
    },

    LeaveState: function (state) {
        if (state != this.curState)
            return;

        this.OnEnd();
    },

    /////////////////////////////////////////////////////////////////////////////////////////
    GameStop() {
        hxjs.module.sound.Silence();
        hxjs.module.sound.StopAllEffcts();
        //转换到后台：关闭所有心跳
        hxfn.account.StopHeartTick();
    },
    GameResume() {
        hxjs.module.sound.Recover();

        if (this.curState <= hxdt.enum_game.Enum_GameState.Login)
            return;

        //！！！！！！！！！！！！！！不会有简单的只是重置表现，而是从登陆验证开始重新跑一遍流程

        // XXX 只是简单的再次获取房间信息（不可靠，需要重新获取完全的最新数据）
        // hxfn.login.CheckRelink();

        //走离线重连的最完整流程
        hxfn.login.TryLoginByResume();
    },


    ////////////////////////////////////////////////////////////////////////////////////////
    //重构 login, lobby, battle Controller
    isReadyUIAssets: false,
    isReadyUWAssets: false,
    view: null,
    // bgmid:-1,

    OnInit() {
        this.isReadyUIAssets = false;
        this.isReadyUWAssets = false;

        this.view = new UWView();

        switch (this.curState) {
            case hxdt.enum_game.Enum_GameState.Login:
                this.view.OnInit(this, hxdt.setting.uwscene.Login);
                hxjs.uicontroller.SetInfo(hxdt.setting.uiscene.Login, this/*hxuw.loginController*/);
                break;

            case hxdt.enum_game.Enum_GameState.Lobby:
                this.view.OnInit(this, hxdt.setting.uwscene.Lobby);
                hxjs.uicontroller.SetInfo(hxdt.setting.uiscene.Lobby, this/*hxuw.lobbyController*/);
                break;

            case hxdt.enum_game.Enum_GameState.Battle:
                switch (hxfn.map.curGameTypId) {
                    case hxfn.map.Enum_GameplayId.QiangZhuang:
                        this.view.OnInit(this, hxdt.setting.uwscene.Battle_NiuNiu);
                        hxjs.uicontroller.SetInfo(hxdt.setting.uiscene.Battle_NiuNiu, this/*hxuw.battleController*/);
                        break;
                    case hxfn.map.Enum_GameplayId.CombatEye://博眼子
                        this.view.OnInit(this, hxdt.setting.uwscene.Battle_BoYanZi);
                        hxjs.uicontroller.SetInfo(hxdt.setting.uiscene.Battle_BoYanZi, this/*hxuw.battleController*/);
                        break;
                    case hxfn.map.Enum_GameplayId.Gobang://五子棋
                        this.view.OnInit(this, hxdt.setting.uwscene.Battle_Gobang);
                        hxjs.uicontroller.SetInfo(hxdt.setting.uiscene.Battle_Gobang, this/*hxuw.battleController*/);
                        break;
                    case hxfn.map.Enum_GameplayId.FightLandlords://斗地主
                        this.view.OnInit(this, hxdt.setting.uwscene.Battle_Landlord);
                        hxjs.uicontroller.SetInfo(hxdt.setting.uiscene.Battle_Landlord, this/*hxuw.battleController*/);
                        break;
                    case hxfn.map.Enum_GameplayId.LuoSong://罗松
                        log.trace("LuoSong", "UWController -> case hxfn.map.Enum_GameplayId.LuoSong");
                        this.view.OnInit(this, hxdt.setting.uwscene.Battle_LuoSong);
                        hxjs.uicontroller.SetInfo(hxdt.setting.uiscene.Battle_LuoSong, this);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    },
    OnStart: function () {
        this.FnStart();

        this.view.OnStart();
        // this.model.OnStart();

        hxjs.module.sound.PlayBGM(hxfn.setting.GetBgmId());
    },
    OnReset() {
        this.view.OnReset();
        // this.model.OnReset();

        this.FnReset();
    },
    OnEnd() {
        // hxjs.module.sound.StopBGM(this.bgmid);
        hxjs.module.sound.StopAllBGM();
        //清理音效（可能存在循环类型的音效(战斗)）
        hxjs.module.sound.StopAllEffcts();

        this.FnEnd();

        // this.model.OnEnd();
        this.view.OnEnd();
    },

    ReadyUI() {
        // cc.log('@@@@@@@@@@@@@@@@@@@ ReadyUI');
        this.isReadyUIAssets = true;
        this.CheckReadyClient();
    },

    ReadyUW() {
        // cc.log('@@@@@@@@@@@@@@@@@@@ ReadyUW');
        this.isReadyUWAssets = true;
        this.CheckReadyClient();
    },

    // 检测初始化是否已完成
    CheckReadyClient() {
        if (this.isReadyUIAssets && this.isReadyUWAssets) {
            this.OnStart();
        }
    },

    ////////////////////////////////////////////////////////////////////////////////////////
    //处理 场景相关类型的Fns
    FnStart() {
        switch (this.curState) {
            case hxdt.enum_game.Enum_GameState.Login:
                break;
            case hxdt.enum_game.Enum_GameState.Lobby:
                hxfn.lobby.OnStart();
                hxfn.mail.OnStart();
                hxfn.notice.OnStart();
                hxfn.activityAndTask.OnStart();
                break;
            case hxdt.enum_game.Enum_GameState.Battle:
                hxfn.battle.OnStart();
                break;
            default:
                break;
        }
    },
    FnReset() {
        switch (this.curState) {
            case hxdt.enum_game.Enum_GameState.Login:
                break;
            case hxdt.enum_game.Enum_GameState.Lobby:
                hxfn.lobby.OnReset();
                hxfn.mail.OnReset();
                hxfn.notice.OnReset();
                hxfn.activityAndTask.OnReset();
                break;
            case hxdt.enum_game.Enum_GameState.Battle:
                hxfn.battle.OnReset();
                break;
            default:
                break;
        }
    },
    FnEnd() {
        switch (this.curState) {
            case hxdt.enum_game.Enum_GameState.Login:
                break;
            case hxdt.enum_game.Enum_GameState.Lobby:
                hxfn.lobby.OnEnd();
                hxfn.mail.OnEnd();
                hxfn.notice.OnEnd();
                hxfn.activityAndTask.OnEnd();
                hxfn.shop.OnEnd();
                break;
            case hxdt.enum_game.Enum_GameState.Battle:
                hxfn.battle.OnEnd();
                break;
            default:
                break;
        }
    },
}