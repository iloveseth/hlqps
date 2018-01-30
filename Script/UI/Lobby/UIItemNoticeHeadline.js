import { hxfn } from '../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {
        txtName:cc.Label,
        txtName2:cc.Label,
        btnCheck:require('UIButton'),
        conUnread:cc.Node,

        callback:{ default: null, serializable: false, visible: false},
        noticeId:{ default: -1, serializable: false, visible: false},
    },

    //////////////////////////////////////////////////////////////
    onLoad: function () {
        this.btnCheck.SetInfo(this.Check.bind(this));

        hxjs.util.Notifier.on('Notice_Readed', this.Readed, this);
    },

    onDestroy(){
        hxjs.util.Notifier.off('Notice_Readed', this.Readed, this);
    },
    //////////////////////////////////////////////////////////////

    Check(){
        this.callback(this.idx);
    },

    SetInfo(inf, idx, callback){
        this.idx = idx;
        this.callback = callback;

        this.noticeId = inf.get('noticeId');

        //NoticeInfoProto
        var info = inf.get('noticeList')[0];
        
        if(this.txtName)
        this.txtName.string = info?info.title:'';
        if(this.txtName2)
        this.txtName2.string = info?info.title:'';
        if(this.conUnread)
        this.conUnread.active = !hxfn.notice.CheckReadedNotice(this.noticeId);
    },

    Readed (noticeId){
        if(noticeId == this.noticeId){
            this.conUnread.active = false;
        }
    },
});