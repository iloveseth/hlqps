cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        txtNickName:cc.Label,
        txtTitleIngot:cc.Label,
        txtIngotCount:cc.Label,
        togSelect:cc.Toggle,

        // [nondisplay]
        // isChecked:false,
        idx : -1,
    },

    // use this for initialization
    onLoad: function () {
        // this.txtTitleIngot.string = '元宝';
        this.togSelect.node.on('toggle',this.TogSelect,this);
    },

    TogSelect:function(evt) {
        var t = evt.detail;

        var isChecked = t.isChecked;
        this.callback_check(this.idx, isChecked);
    },

    SetInfo (info, idx, callback_check) {
        this.callback_check = callback_check;
        this.idx = idx;
        this.Reset();

        if(info!= null) {
            // 空闲玩家
            this.txtNickName.string = info.get('nickName');
            // this.txtIngotCount.string = info.get('yuanbao');

            // 好友玩家，不共用一个资源
            //好友信息
            // message FriendProto {
            //     required PlayerNameProto playerName = 1;
            //     optional bool online = 2;
            // }
        }
    },
    
    Reset:function () {
        this.togSelect.isChecked = false;
        this.txtNickName.string = '';
        this.txtIngotCount.string = '';
    }
});