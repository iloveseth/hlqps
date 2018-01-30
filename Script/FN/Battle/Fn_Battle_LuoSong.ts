import { hxfn } from "./../HXFN";
import { hxjs } from "../../../HXJS/HXJS";
import { hxdt } from "../../DT/HXDT";
import { setting_landlord } from "../../DT/DD/Setting_Battle_Landlord";
import { log } from "../../../HXJS/Util/Log";
import UIBattleLuoSongRoleMgr from "../../UI/Battle/13_LuoSong/UIBattleLuoSongRoleMgr";


export class Fn_Battle_LuoSong implements IFn, IMgr {

    public static Instance: Fn_Battle_LuoSong;

    public OnStart() {
        log.trace("LuoSong", "[Fn_Battle_LuoSong,OnStart]");
        this.GetRoomData();

        this.RegistServerInfo();
    }

    public OnReset() {

    }

    public OnEnd() {
        this.UnRegistServerInfo()
    }

    public ResetAllData() {

    }

    public ClearAllUI() { }

    private GetRoomData() {
        hxfn.netrequest.SyncReq_GetRoomData(false, (msg) => {
            if (msg.result != 0) {
                hxjs.module.ui.hub.LoadTipFloat(hxdt.errcode.codeToDesc(msg.result));
                hxjs.module.net.NotifyFailedNetwork();
                return;
            }

            log.blue("LuoSong", "Fn_Battle_LuoSong -> GetRoomData , msg=" + JSON.stringify(msg))

            var lsRoom = msg.get('lsRoom');
            var playerData = lsRoom.get('players');


            hxfn.battle.InitAllRoles(playerData, 4);
            UIBattleLuoSongRoleMgr.Instance.RefreshRoleBase();
        });
    }



    //注册监听
    RegistServerInfo() {

        hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.DZSyncPlayerJoin, this.SyncPlayerJoinRoom.bind(this));
        hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncPlayerLost, this.SyncPlayerLost.bind(this));
        hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncRoomChat, this.SyncRoomChat.bind(this));
        hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncPlayerSendInterEmoj, this.SyncPlayerSendInterEmoj.bind(this));
        hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.LSActDispatch, this.LSActDispatch.bind(this));
    };

    //释放监听
    UnRegistServerInfo() {
        hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.DZSyncPlayerJoin, this.SyncPlayerJoinRoom.bind(this));
        hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncPlayerLost, this.SyncPlayerLost.bind(this));
        hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncRoomChat, this.SyncRoomChat.bind(this));
        hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncPlayerSendInterEmoj, this.SyncPlayerSendInterEmoj.bind(this));
        hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.LSActDispatch, this.LSActDispatch.bind(this));
    };


    private SyncForceLeft(data: any) {
        hxfn.battle.SyncForceLeft(data);
    }

    private SyncPlayerJoinRoom(data: any) {
        hxfn.battle.SyncPlayerJoinRoom(data);
    }

    private SyncPlayerQuitRoom(data: any) {
        hxfn.battle.SyncPlayerQuitRoom(data);
    }

    private SyncPlayerLost(data: any) {
        hxfn.battle.SyncPlayerLost(data);
    }

    private SyncRoomChat(data: any) {
        hxfn.battle.SyncRoomChat(data);
    }

    private SyncPlayerSendInterEmoj(data: any) {
        hxfn.battle.SyncPlayerSendInterEmoj(data);
    }

    private LSActDispatch(data) {
        log.gray("LuoSong", "Fn_Battle_LuoSong -> LSActDispatch , data=" + data)
    }



}