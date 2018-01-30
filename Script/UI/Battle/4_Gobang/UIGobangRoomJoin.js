import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        btnCreateRoom: require('UIButton'),
        btnQuickBegin: require('UIButton'),
        btnRefreshRoom: require('UIButton'),
        imgMoney: cc.Sprite,
        conRoom: cc.Prefab,
        txtMoney: cc.Label,

        scrollRoom: require('UIScrollView'),

        notifiers: {default: null, serializable: false, visible: false,}, 
    },

    
    /////////////////////////////////////////////////////////////////////////////////
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    start () {
        this.OnInit('加入房间');// base func//'ui_lobby_fn_close', 

        this.notifiers = [
            'Room_GetListReady',
        ];

        eval(hxfn.global.HandleNotifiersStr(this.notifiers,true)); 

        this.btnCreateRoom.SetInfo(this.CreateRoom.bind(this));
        this.btnQuickBegin.SetInfo(this.QuickBegin.bind(this));
        this.btnRefreshRoom.SetInfo(this.RefreshRoom.bind(this));
        this.txtMoney.string = hxfn.role.curCarryYuanbao.toCoin();

        this.RefreshRoom();
    },

    // update (dt) {},

    onDestroy(){
        eval(hxfn.global.HandleNotifiersStr(this.notifiers,false)); 
    },
    /////////////////////////////////////////////////////////////////////////////////


    CreateRoom(){
        hxjs.module.ui.hub.LoadPanel_Dlg ('UI_Lobby_RoomTyp_Ingot_Create_Gobang');
    },
    
    QuickBegin(){
        hxfn.level.SearchAndJoinRoom(1,4);
    },

    RefreshRoom(){
        hxfn.level.GetYBRoomList(4);
    },

    Room_GetListReady(){
        // cc.log(hxfn.level.ybRoomList);
        this.scrollRoom.SetInfo(hxfn.level.ybRoomList);
    },
});
