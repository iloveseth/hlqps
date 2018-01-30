import { Toast } from '../../../../HXJS/Util/Toast';
import { hxjs } from '../../../../HXJS/HXJS';
import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        btnCreate: cc.Node,
        btnQuickStart: require('UIButton'),
        btnRefresh: cc.Node,
        rolRooms: require('UIScrollView'),
        conRoomNotify: cc.Node,
        txtCurRoleIngot: cc.Label,
        conRecent: cc.Node,
        notifiers: null,
        btnEnterLatest: require('UIButton'),
        btnInputRoomId: require('UIButton'),
        conLoading: cc.Node,
        // uiRoomRecent:require('UILobbyInvitedTyp'),
    },

    onLoad: function () {

        this.LoadingRefresh(false);
        if (this.conRecent) {
            this.conRecent.active = false;
        }
        this.cachePanels = {};

        this.notifiers = [
            'Room_GetLatestRoomReady',
            //'Room_GetRoomDataHeadReady',
        ];

        eval(hxfn.global.HandleNotifiersStr(this.notifiers, true));

        this.btnCreate.getComponent('UIButton').SetInfo(this.CreateRoom.bind(this), '创建房间');
        this.btnRefresh.getComponent('UIButton').SetInfo(this.RefreshRoom.bind(this), '刷新房间');
        this.btnQuickStart.SetInfo(this.QuickStart.bind(this), '快速加入');

        this.btnInputRoomId.SetInfo(this.InputRoomId.bind(this));

        hxfn.level.GetLatestRoom();

        this.btnEnterLatest.SetInfo(this.EnterLatest.bind(this));

        //HACK Layout
        hxfn.adjust.AdjustLabel(this.node);

        //this.conRecent.getComponent('UIItemRoomIngot').SetInfo()
    },

    start: function () {
        this.txtCurRoleIngot.string = parseInt(hxfn.role.curCarryYuanbao).toCoin();

        //responce notify when everything has been inited first time
        this.HandleNotify(true);
    },

    onDestroy: function () {
        eval(hxfn.global.HandleNotifiersStr(this.notifiers, false));

        //remove first to forbid responce notify
        this.HandleNotify(false);

        //...
    },
    // onDestroy(){
    //     eval(hxfn.global.HandleNotifiersStr(this.notifiers,false));
    // },

    HandleNotify: function (isHandle) {
        if (isHandle) {
            hxjs.util.Notifier.on('UI_RoomEnterFailed', this.RefreshRoom, this);
        }
        else {
            hxjs.util.Notifier.off('UI_RoomEnterFailed', this.RefreshRoom, this);
        }
    },

    CreateRoom: function () {
        
        // 打开创立房间界面
        switch (hxfn.map.curGameTypId) {
            case hxfn.map.Enum_GameplayId.QiangZhuang:
                hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_RoomTyp_Ingot_Create_NiuNiu');
                break;
            case hxfn.map.Enum_GameplayId.CombatEye:
                hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_RoomTyp_Ingot_Create_BoYanZi');
                break;
            case hxfn.map.Enum_GameplayId.Gobang:
                hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_RoomTyp_Ingot_Create_Gobang');
                break;
            case hxfn.map.Enum_GameplayId.FightLandlords:
                hxjs.module.ui.hub.LoadPanel_Dlg('battle_landlord/UI_Lobby_RoomIngot_Create_Landlord');
                break;
            case hxfn.map.Enum_GameplayId.LuoSong:
                hxjs.module.ui.hub.LoadPanel_Dlg('Battle_LuoSong/UI_Lobby_RoomTyp_Ingot_Create_LuoSong');
                break;
            default:
                break;
        }
    },

    RefreshRoom: function () {
        // hxjs.module.ui.hub.LoadTipFloat(hxdt.setting.lang.Map_Room_HasRefresh);

        this.rolRooms.SetInfo([]);
        this.LoadingRefresh(true);
        this.conRoomNotify.active = false;
        hxfn.level.GetLatestRoom();
        this.UpdateIngotRoomList();
    },
    QuickStart: function () {
        // 有可能货币不足，需要服务器返回提示
        hxfn.level.StartJoinGoldFlow();
    },

    UpdateIngotRoomList() {
        hxfn.netrequest.Req_GetYBRoomList(hxfn.map.curGameTypId, this.Callback_GetYBRoomListReq.bind(this));
        window.setTimeout(() => {
            this.LoadingRefresh(false);
        }, 5000);

        // var postData = {
        //     gameType : hxfn.map.curGameTypId,
        // };

        // hxfn.net.Request(
        //     postData,
        //     'GetYBRoomListReq',
        //     hxdt.msgcmd.GetYBRoomListReq,//5,
        //     this.Callback_GetYBRoomListReq.bind(this)
        // );
    },

    Callback_GetYBRoomListReq: function (msg) {
        // var msg_SearchRoomResp = hxdt.builder.build('GetYBRoomListResp');
        // var msg = msg_SearchRoomResp.decode(data);

        // var result = msg.get('result');// int 提交搜索的结果，仅代表搜索请求提交给服务器，不代表找到匹配房间
        var roomlst = msg.get('ybRoomList');// string
        if (roomlst == null)
            roomlst = [];
        this.LoadingRefresh(false);

        this.rolRooms.SetInfo(roomlst);

        var isShow = roomlst.length <= 0;
        this.conRoomNotify.active = isShow;
    },

    Room_GetLatestRoomReady() {
        this.conRecent.active = false;
        //this.conRecent.active = false;
        if (hxfn.level.latestRoomInfo) {
            this.conRecent.active = true;
            this.conRecent.getComponent('UIItemRoomInfo').SetInfoS(hxfn.level.latestRoomInfo);
            //hxfn.level.latestRoomInfo = null;
        }
    },

    EnterLatest() {
        hxfn.level.JoinRoom(hxfn.level.latestRoomInfo.roomId);
    },

    InputRoomId() {
        hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_RoomDirectFind');
    },

    LoadingRefresh(isLoading) {
        if (this.conLoading) {
            this.conLoading.active = isLoading;
        }
        //this.btnRefresh.node.active = !isLoading;
    },
});