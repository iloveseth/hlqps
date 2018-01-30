import { hxfn } from '../../../FN/HXFN';
import { hxjs } from '../../../../HXJS/HXJS';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // [display]
        // btnClose:cc.Node,
        btnConfirm:cc.Node,
        btnCancel:cc.Node,

        uiLobbyInviteTyp:require('UILobbyInvitedTyp'),

        // [nondisplay]
        roomInfo:{ default: null, serializable: false, visible: false},
    },

    //**************************************************/
        // 其他玩法的邀请信息分开做！！！
    //**************************************************/

    onLoad: function () {
        // base func
        this.OnInit('邀请消息');

        //current
        this.btnConfirm.getComponent('UIButton').SetInfo(this.EnterRoom.bind(this));
        this.btnCancel.getComponent('UIButton').SetInfo(()=>{hxjs.module.ui.hub.Unload(this.node);});
    },

    EnterRoom:function () {
        if(this.roomInfo!= null){
            var roomInfoOpts = this.roomInfo.createRoomOption;
            
            if(roomInfoOpts.roomType == 1/*元宝房*/ && roomInfoOpts.enterLimit > hxfn.role.curCarryYuanbao) {
                hxfn.comn.IngotNotEnough(true);
            }
            else {
                hxfn.level.JoinRoom(this.roomInfo.roomId, (isSucc)=>{
                    if(isSucc){
                        hxjs.module.ui.hub.Unload(this.node);
                    }
                });
            }
        }
        else {
            cc.log('[hxjs][err] error room info');
        }
    },

    SetInfo(info){
        this.roomInfo = info.roomInfo;
        this.uiLobbyInviteTyp.SetInfo(info);
    },
});