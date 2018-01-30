import { hxjs } from "../../../../HXJS/HXJS";
import UIBattleLandlordBasic from "../5_Landlord/UIBattleLandlordBasic";
import { log } from "../../../../HXJS/Util/Log";
import UIBattleLuoSongRoleMgr from "./UIBattleLuoSongRoleMgr";
import UIBattleLuoSongPlay from "./UIBattleLuoSongPlay";
import UIBattleHud from "../Comn/UIBattleHudTS";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIBattleLuoSongMain extends cc.Component {
    private _rootBasic: cc.Node;
    private _rootChat: cc.Node;
    private _rootRoleMgr: cc.Node;

    private _play: cc.Node;
    private _hud: cc.Node;

    public start() {
        log.trace("LuoSong", "UIBattleLuoSongMain -> start")

        this.InitBasic();
    }

    //公用面板
    private InitBasic() {
        log.trace("LuoSong", "UIBattleLuoSongMain -> InitBasic")

        //1.底分，电池 WIFI 时间等（注：暂时部局按斗地主部局）
        this._rootBasic = cc.find("Root_Basic", this.node)
        hxjs.module.ui.hub.LoadPanel("battle_landlord/UI_Battle_Landlord_Basic", (prefab) => {
            prefab.addComponent('UIBattleLandlordBasic')
        }, this._rootBasic);

        //2.聊天
        this._rootChat = cc.find("Root_Chat", this.node);
        hxjs.module.ui.hub.LoadPanel("battle_landlord/UI_Battle_Chat_Landlord", null, this._rootChat);

        //角色
        this._rootRoleMgr = cc.find("UI_RoleMgr", this.node);
        this._rootRoleMgr.addComponent(UIBattleLuoSongRoleMgr)


        //玩法界面
        this._play = cc.find("Play", this.node);
        this._play.addComponent(UIBattleLuoSongPlay)

        this._hud = cc.find("RootHud", this.node);
        hxjs.module.ui.hub.LoadPanel("battle_landlord/UI_Battle_Landlord_Hud", (prefab) => {

            prefab.addComponent('UIBattleHudTS')
        }, this._hud);

    }







}