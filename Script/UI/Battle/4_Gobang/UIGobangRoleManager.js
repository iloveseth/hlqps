import { hxfn } from "../../../FN/HXFN";

cc.Class({
    extends: cc.Component,

    properties: {
        lstRole: cc.Node,
        
        src_lstRole:{default: null, serializable: false, visible: false,},
        notifiers:{default: null, serializable: false, visible: false,},
    },

    /////////////////////////////////////////////////////////////////////////////
    // LIFE-CYCLE CALLBACKS:
    OnInit () {
        this.src_lstRole = this.lstRole.getComponent('UILst');
        
        this.notifiers = [
            'Five_DisplayRoles',
            'Room_SyncPlayerJoinRoom',
            'Room_SyncPlayerLost',
            'Room_SyncPlayerQuitRoom',
            // 'Room_SyncForceLeft',
        ];
        eval(hxfn.global.HandleNotifiersStr(this.notifiers,true));
    },
    OnStart () {
        cc.log('UIGobangManager_start');
        
        cc.log(hxfn.five.roles);
        cc.log('hxfn.five.uiRoles');
        cc.log(hxfn.five.uiRoles);
        cc.log(this.src_lstRole);
        this.src_lstRole.SetInfo(hxfn.five.uiRoles); 
    },
    OnReset (){
        //TODO:
    },
    OnEnd(){
        eval(hxfn.global.HandleNotifiersStr(this.notifiers,false));
        cc.log('UIGobangManager_onDestroy');
    },
    /////////////////////////////////////////////////////////////////////////////
    
    //同步：玩家加入房间
    Five_DisplayRoles(){
        cc.log(hxfn.five.roles);
        cc.log('hxfn.five.uiRoles');
        cc.log(hxfn.five.uiRoles);
        cc.log(this.src_lstRole);
        this.src_lstRole.SetInfo(hxfn.five.uiRoles); 
    },
    
    //下一步：重新获取房间信息并显示
    Room_SyncPlayerJoinRoom(data){
        cc.log('Room_SyncPlayerJoinRoom');
        hxfn.five.UpdateRoomData();
    },

    //同步：玩家被T出去
    //下一步：重新获取房间信息并显示
    // Room_SyncForceLeft(data){
    //     cc.log('Room_SyncForceLeft');
    //     // hxfn.level.QuitRoom();
    //     hxfn.level.KickOutRoom();
    // },

    Room_SyncPlayerLost(data){
        cc.log('Room_SyncPlayerLost');
        hxfn.five.UpdateRoomData();
    },

    //如果是房主退出房间，房间解散，客家回到大厅
    //如果是房客退出房间，本局结束
    //退出房间不结算
    Room_SyncPlayerQuitRoom(msg){
        cc.log('Room_SyncPlayerQuitRoom');
        hxfn.five.UpdateRoomData();
    },  
});
