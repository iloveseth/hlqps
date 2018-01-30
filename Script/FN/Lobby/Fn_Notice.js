import { hxfn } from "./../HXFN";

export let notice = 
{
    allNotices:null,
    callback_Complete:null,

    //////////////////////////////////////////////////////////////////////////////
    // OnInit(){
        
    // },
    OnStart(){
        this.OnReset();
    },
    OnReset(){
        this.GetAllNoticesFromServer(null);
    },
    
    OnEnd(){
        this.allNotices = null;
        this.callback_Complete = null;
    },
    //////////////////////////////////////////////////////////////////////////////

    GetAllNoticesFromServer (cb) {
        this.callback_Complete = cb;

        hxfn.netrequest.Req_GetNotice(this.CallBack_GetNoticeCommand.bind(this));
    },

    CallBack_GetNoticeCommand: function(msg){
        // var msg_GetNoticeResp = hxdt.builder.build('GetNoticeResp');
        // var msg = msg_GetNoticeResp.decode(data);
        
        var result = msg.get('result');
        if(result == 0/*OK*/) {
            var notices = msg.get('noticePages');
            
            // // var notices = [];
            // for(var i = 0;i!= noticePages.length;++i){
            //     for(var j=0;j!=noticePages[i].noticeList.length;++j){
            //         notices.push((noticePages[i].noticeList)[j]);
            //     }
            // }

            // cc.log('消息数目：' + notices.length);
            this.InitAllNotices(notices);

            if(this.callback_Complete!= null)
                this.callback_Complete(notices);
        }
    },

    InitAllNotices:function (ns){
        this.allNotices = ns;
        hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Notice]);
    },

    CountUnhandledNotices () {
        if(this.allNotices == null)
            return 0;

        var n = 0;
        this.allNotices.forEach(function(element) {
            if(!this.CheckReadedNotice(element.get('noticeId')))
                n+=1;
        }.bind(this), this);

        return n;
    },

    // 统计不在已读列表中的公告
    CheckReadedNotice (nid){
        var allReadedNotices = hxfn.role.curUserData.get('playerActivityInfo').get('readedNoticeId');
        return allReadedNotices.indexOf(nid) >= 0;
    },
}