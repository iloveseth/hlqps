import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // display
        // btnEnter:cc.Node,
        groupNums:cc.Node,
        labels:cc.Node,
        labelGroup:[cc.Label],

        // nondisplay
        _labelIdx: 0,
    },

    onLoad: function () {
        // base func
        this.OnInit('进入房间');//'ui_lobby_fn_close', 

        hxfn.level.dialog = 'UI_Lobby_RoomDirectFind';

        // this.btnEnter.getComponent('UIButton').SetInfo(this.EnterTheRoom.bind(this),'进入房间');
        this.groupNums.getComponent('UIGroup').SetInfo(this.SelectButton.bind(this),['0','1','2','3','4','5','6','7','8','9','清空','删除']);
        this._labelIdx = 0;
        hxfn.adjust.AdjustLabel(this.node);
    },

    onDestroy(){
        hxfn.level.dialog = '';
    },

    SelectButton: function (idx) {
        // cc.info(this._labelIdx);
        // cc.info(idx);

        if(idx == 10)
        {
            this._labelIdx = 0;
            for(var i = 0;i < 6;++i )
            {
                this.labelGroup[i].string = '';
            }
            return;
        }
        else if(idx == 11) {
            if(this._labelIdx > 0)
            {
                --this._labelIdx;
                this.labelGroup[this._labelIdx].string = '';
            }
            return;
        }

        if(this._labelIdx !== null && this._labelIdx < 6) {
            this.labelGroup[this._labelIdx].string = idx;
            ++ this._labelIdx;
        }

        this.CheckRoomIdFull();
    },

    CheckRoomIdFull: function () {
        var idStr = '';
        for(var i=0;i<6;++i)
            idStr += this.labelGroup[i].string;

        //当输入完整的6位数字，则直接触发进入房间申请
        if(idStr.length < 6)
        return;

        //字符串转数值类型
        // var idNum = parseInt(idStr);
        // cc.info(idNum);

        hxfn.level.JoinRoom(idStr);
    },
});