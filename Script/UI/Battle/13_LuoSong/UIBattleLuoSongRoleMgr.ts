import { log } from "../../../../HXJS/Util/Log";
import UIBattleLuoSongRoleItem from "./UIBattleLuoSongRoleItem";
import { EnumLuoSong } from "./EnumLuoSong";
import UIItemRoleBattleTS from "../../Comn/Role/UIItemRoleBattleTS";
import { hxfn } from "../../../FN/HXFN";
import { hxjs } from "../../../../HXJS/HXJS";
import UIItemRoleInfo from "../../Comn/Role/UIItemRoleInfoTS";



const { ccclass, property } = cc._decorator;

@ccclass
export default class UIBattleLuoSongRoleMgr extends cc.Component {

    public static Instance: UIBattleLuoSongRoleMgr;

    private _roleItem: cc.Node;
    private _roleBase: cc.Node;
    private _clock: cc.Node;

    // @property({list: type:require('UIScrollView'),})
    private MapRoleItem: Map<string, UIBattleLuoSongRoleItem> = new Map<string, UIBattleLuoSongRoleItem>();

    private MapRoleBase: Map<string, UIItemRoleInfo> = new Map<string, UIItemRoleInfo>();

    public onLoad() {
        //单例
        if (UIBattleLuoSongRoleMgr.Instance == null) {
            UIBattleLuoSongRoleMgr.Instance = this;
        }
    }


    public start() {
        log.trace("LuoSong", "UIBattleLuoSongRoleMgr -> start")
        this.InitRoot();
    }

    private InitRoot() {
        this.InitRoleItems();
        this.InitRoleBase();
    }


    //初始化所有玩家
    private InitRoleItems() {
        log.trace("LuoSong", "UIBattleLuoSongRoleMgr -> InitRoleItems")
        this.MapRoleItem = new Map<string, UIBattleLuoSongRoleItem>();
        this._roleItem = cc.find("RoleItem", this.node)
        this._roleItem.active = false;

        this._clock = cc.find("Clock", this.node)
        this._clock.active = false;

        //初始化单个玩家
        var init = (seat, name) => {
            var root = cc.find(name, this.node)
            var roleItem = cc.instantiate(this._roleItem);
            roleItem.active = true;
            roleItem.parent = root;
            var item = roleItem.addComponent(UIBattleLuoSongRoleItem);
            //cc.find("BaseInfo", roleItem).addComponent(UIItemRoleBattleTS);
            this.MapRoleItem.set(seat, item);
            log.trace("LuoSong", "key=" + seat + " mapRoleItem Lenght=" + this.MapRoleItem.size);
        }

        init(EnumLuoSong.Seat.Me, "Role_Me");
        init(EnumLuoSong.Seat.Left, "Role_Left");
        init(EnumLuoSong.Seat.Right, "Role_Right");
        init(EnumLuoSong.Seat.Opposite, "Role_Opposite");
    }

    //初始化所有玩家基础信息
    private InitRoleBase() {
        log.trace("LuoSong", "UIBattleLuoSongRoleMgr -> InitRoleBase")
        this.MapRoleBase.clear(); //= new Map<string, UIItemRoleInfo>();
        this._roleBase = cc.find("UI_Item_RoleInfo", this.node)
        this._roleBase.active = false;


        //初始化单个玩家
        var init = (seat, name) => {
            var root = cc.find(name, this.node)
            var prefab = cc.instantiate(this._roleBase);
            prefab.active = true;
            prefab.parent = root;
            let item: UIItemRoleInfo = prefab.getComponent('UIItemRoleInfoTS')
            if (item == null) {
                log.error("InitRoleBase item==null ")
                return;
            }
            this.MapRoleBase.set(seat, item);
            log.trace("LuoSong", "key=" + seat + "InitRoleBase -> MapRoleBase Lenght=" + this.MapRoleBase.size);
        }

        init(EnumLuoSong.Seat.Me, "Role_Me");
        init(EnumLuoSong.Seat.Left, "Role_Left");
        init(EnumLuoSong.Seat.Right, "Role_Right");
        init(EnumLuoSong.Seat.Opposite, "Role_Opposite");
    }

    public RefreshRoleBase() {

        for (let i = 0; i < hxfn.battle.uiRoles.length; i++) {
            const element = hxfn.battle.uiRoles[i];
            if (i == 0) {
                log.trace("LuoSong", " RefreshRoleBase  EnumLuoSong.Seat.Me");
                if (element == null) {
                    return;
                }

                //log.traceObj("LuoSong", element)
                this.MapRoleBase.get(EnumLuoSong.Seat.Me).SetInfo(element);
            }
            else if (i == 1) {
                log.trace("LuoSong", " RefreshRoleBase  EnumLuoSong.Seat.Left");
                if (element == null) {
                    return;
                }
                //log.traceObj("LuoSong", element)

                this.MapRoleBase.get(EnumLuoSong.Seat.Left).SetInfo(element);
            }
            else if (i == 2) {
                log.trace("LuoSong", " RefreshRoleBase  EnumLuoSong.Seat.Right");
                if (element == null) {
                    return;
                }
                //log.traceObj("LuoSong", element)
                this.MapRoleBase.get(EnumLuoSong.Seat.Right).SetInfo(element);
            }
            else if (i == 3) {
                log.trace("LuoSong", " RefreshRoleBase  EnumLuoSong.Seat.Opposite");
                if (element == null) {
                    return;
                }
                //log.traceObj("LuoSong", element)
                this.MapRoleBase.get(EnumLuoSong.Seat.Opposite).SetInfo(element);
            }
        }
    }



}