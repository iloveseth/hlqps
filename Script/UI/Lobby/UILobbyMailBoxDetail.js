import { hxfn } from '../../FN/HXFN';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        txtMailTitle:cc.Label,
        txtContent: cc.Label,
        btnAttachment:require('UIButton'),
        btnDelete:require('UIButton'),
        conLayoutNoAttachment:cc.Node,
        conLayoutHasAttachment:cc.Node,
        lstAttachment:require('UILst'),

        mail:null,
    },

    onLoad: function () {
        this.OnInit('');//'ui_lobby_fn_close', 

        this.btnAttachment.SetInfo(this.GetAttachment.bind(this),'领取附件');
        this.btnDelete.SetInfo(this.DeleteMail.bind(this),'删除');
    },

    // message MailAttachProto {
    //     required int32 attachType = 1;   //使用DropType定义的值
    //     required int32 itemId = 2;       //当attachType为装备(7)时，此字段代表物品ID
    //     optional float itemCount = 3;    //物品的数量
    // }
    // message MailDataProto {
    //     required string mailId = 1;		//邮件ID
    //     required string from = 2;		//发件人名称
    //     required string content = 3;	//邮件内容
    //     required int64 time = 4;		//发件时间戳
    //     required int32 readFlag = 5;	//已读标志 0 未读，1 已读
    //     required int32 remainTime = 6;	//距离邮件过期还剩的时间，单位秒
    //     repeated MailAttachProto attachment = 7;
    //     optional string title = 8;
    // }
    
    start:function () {
        var curMailId = hxfn.mail.curMailId;
        this.mail = hxfn.mail.SearchFirstMailById(curMailId);
    
        this.txtMailTitle.string = this.mail.title;
        this.txtContent.string = this.mail.content;
        this.CheckLayout(this.mail.get('attachment'));
    },

    CheckLayout:function(attachment) {
        if(attachment == null || attachment.length<=0){
            //没有附件
            this.conLayoutNoAttachment.active = true;
            this.conLayoutHasAttachment.active = false;
        }
        else {
            //显示附件
            this.conLayoutNoAttachment.active = false;
            this.conLayoutHasAttachment.active = true;
            
            this.lstAttachment.SetInfo(attachment);
        }
    },

    GetAttachment:function(){
        var postData = {
            mailId:hxfn.mail.curMailId,
        }

        hxfn.netrequest.Req_GetMailAward(postData,this.Callback_GetMailAwardReq.bind(this));

        // hxfn.net.Request(
        //     postData,
        //     'GetMailAwardReq',
        //     hxdt.msgcmd.GetMailAward,
        //     this.Callback_GetMailAwardReq.bind(this)
        // );
    },

    Callback_GetMailAwardReq:function (msg) {
        // var msgDef = hxdt.builder.build('GetMailAwardResp');
        // var msg = msgDef.decode(data);
        if(hxfn.mail.curMailId == msg.get('mailId'))//成功领取
        {
            hxjs.module.ui.hub.Unload (this.node);
            hxjs.util.Notifier.emit('UpdateMailboxClient', hxfn.mail.curMailId);
            hxfn.mail.curMailId = null;
        }
    },

    DeleteMail:function(){
        var postData = {
            mailId:hxfn.mail.curMailId,
        }

        hxfn.netrequest.Req_DelMail(postData, this.Callback_DelMailReq.bind(this));
        // hxfn.net.Request(
        //     postData,
        //     'DelMailReq',
        //     hxdt.msgcmd.DelMail,
        //     this.Callback_DelMailReq.bind(this)
        // );
    },

    Callback_DelMailReq:function(msg){
        // var msg_DelMailResp = hxdt.builder.build('DelMailResp');
        // var msg = msg_DelMailResp.decode(data);
        if(hxfn.mail.curMailId == msg.get('mailId'))//成功删除邮件
        {
            cc.log('邮件已删除');
            hxjs.module.ui.hub.Unload (this.node);
            hxjs.util.Notifier.emit('UpdateMailboxClient', hxfn.mail.curMailId);
            hxfn.mail.curMailId = null;
        }
    }
});