cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        groupTyp:require('UIGroup'),
        conPinShi:cc.Node,
        conBoYanZi:cc.Node,
        conSanGong:cc.Node,
    },

    onLoad: function () {
        // base func
        this.OnInit('帮助中心');//'ui_lobby_fn_close', 

        this.groupTyp.SetInfo(this.CheckGroup.bind(this),['拼十','博眼子','三公']);
    },
    
    start:function () {
        this.groupTyp.SetDefaultIdx(0);
    },

    CheckGroup:function(idx){
        this.conPinShi.active = false;
        this.conBoYanZi.active = false;
        this.conSanGong.active = false;

        switch (idx) {
            case 0:
            this.conPinShi.active = true;
            break;
            case 1:
            this.conBoYanZi.active = true;
            break;
            case 2:
            this.conSanGong.active = true;
            break;
            default:
                break;
        }
    }
});