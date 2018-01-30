cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        txtNickName:cc.Label,
        txtTitleIngot:cc.Label,
        txtIngotCount:cc.Label,
        togSelect:cc.Toggle,

        // [nondisplay]
        // isSelected:false,
        idx : -1,
    },

    onLoad: function () {
        this.txtTitleIngot.string = '元宝';
        this.togSelect.node.on('toggle',this.TogSelect,this);
    },

    TogSelect:function(evt) {
        var t = evt.detail;

        var isChecked = t.isChecked;
        hxjs.util.Notifier.emit('Battle_Invite_FriendPlayer', [this.idx, isChecked]);
    },

    SetInfo (info, idx) {
        this.idx = idx;
        this.Reset();

        if(info!= null) {
            this.txtNickName.string = info.get('nickName');
            // this.txtIngotCount.string = info.get('yuanbao');
        }
    },
    
    Reset:function () {
        this.togSelect.isChecked = false;
        this.txtNickName.string = '';
        this.txtIngotCount.string = '';
    }
});