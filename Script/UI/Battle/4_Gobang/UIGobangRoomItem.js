import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {
        txtTitleRoomId: cc.Label,
        txtTitlePlayerNum:cc.Label,
        txtTitleYuanbao: cc.Label,
        
        txtRoomId: cc.Label,
        txtPlayerNum: cc.Label,
        txtYuanbao: cc.Label,

        btnEnterRoom: require('UIButton'),
    },

    ////////////////////////////////////////////////////////////////////////////////
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    // update (dt) {},
    start () {
        this.btnEnterRoom.SetInfo(this.EnterRoom.bind(this));
    },
    ////////////////////////////////////////////////////////////////////////////////

    SetInfo(info){
        if(this.txtTitleRoomId){
            this.txtTitleRoomId.string = '房间号：';
        }
        if(txtTitlePlayerNum){
            this.txtTitlePlayerNum.string = '人数：'
        }
        if(this.txtTitleYuanbao){
            this.txtYuanbao.String = '学费';
        }
        

        this.txtRoomId.string = info.roomId;
        this.txtPlayerNum.string = info.nowPlayer;
        this.txtYuanbao.string = info.tuition;
    },

    EnterRoom(){
        hxfn.level.JoinRoom(this.txtRoomId.string);
    }
});
