import { hxfn } from '../../FN/HXFN';
import { hxdt } from '../../DT/HXDT';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        rolHeadlines:require('UIScrollView'),
        
        txtDetail:cc.Label,
        rolDetail: cc.ScrollView,

        notices:[],
    },
    
    onLoad: function () {
        // base func
        this.OnInit('公告');//'ui_lobby_fn_close', 
    },

    start:function () {
        hxfn.notice.GetAllNoticesFromServer (this.UpdateNoticeInfos.bind(this));
    },

    SelectNotice:function(idx){
        cc.log('SelectNotice:' + idx);
        var noticeInfo = null;
        if(this.notices[idx].get('noticeList')) {
            noticeInfo = this.notices[idx].get('noticeList')[0];
        }
        this.txtDetail.string = noticeInfo?noticeInfo.get('text'):'';

        
        //如果未读过，则发送已读请求
        var nid = this.notices[idx].get('noticeId');
        if(hxfn.notice.CheckReadedNotice(nid))
            return;
            
        var postData = {
            noticeId:nid
        };
        //ReadNoticeCommand
        hxfn.netrequest.Req_ReadNotice(
            postData,
            (info)=>{
                if(info.get('result') == hxdt.errcode.OK) {
                    var allReadedNotices = hxfn.role.curUserData.playerActivityInfo.readedNoticeId;
                    allReadedNotices = allReadedNotices?allReadedNotices:[];
                    allReadedNotices.push(nid);
                    hxfn.role.curUserData.playerActivityInfo.readedNoticeId = allReadedNotices;
                    hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Notice]);
                    hxjs.util.Notifier.emit('Notice_Readed', nid);
                }
            }
        );
    },

    UpdateNoticeInfos(notices){
        this.notices = notices;

        if(this.notices.length > 0){
            this.rolHeadlines.populateList(this.notices,this.SelectNotice.bind(this));
            this.rolHeadlines.SetDefaultIdx(0);
        }
    },
});
