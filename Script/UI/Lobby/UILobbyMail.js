cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        scrollMail: cc.ScrollView, 
        groupTabs: require('UIGroup'),
        src_scrollMail: null,
    },
    
    onLoad: function () {
        this.OnInit('邮箱');//'ui_lobby_fn_close', 
        this.selectPanelIndex=0;
        // this.node.on('detail',this.GetDetail.bind(this));
        this.src_scrollMail = this.scrollMail.getComponent('UIScrollView');
    },
    
    start:function (){
        this.UpdateMailBox();
        this.HandleNotify(true);
        this.groupTabs.SetInfo(this.SelectPanels.bind(this));
        this.groupTabs.SetDefaultIdx(0);
    },
    SelectPanels(idx){
        this.scrollMail.scrollToTop(0.1);
        this.selectPanelIndex=idx; 
        this.UpdateMails();
    },

    onDestroy:function (){
        this.HandleNotify(false);
    },

    HandleNotify:function(isHandle){
        if(isHandle){
            hxjs.util.Notifier.on('UpdateMailboxClient', this.UpdateClientMails, this);
        }
        else{
            hxjs.util.Notifier.off('UpdateMailboxClient', this.UpdateClientMails, this);
        }
    },

    UpdateMails: function(){
        var mailData = hxfn.mail.mailData;
        
        if(mailData !== null)// && mailData.length > 0)
        {
            var mails=[];
            if(this.selectPanelIndex==0){
                //未读邮件
                for(var i=0;i<mailData.length;i++){
                    if(mailData[i].readFlag == 0){
                        mails[mails.length]=mailData[i];
                    }
                }   
            }
            else{
                  //已读邮件
                  for(var i=0;i<mailData.length;i++){
                    if(mailData[i].readFlag == 1){
                        mails[mails.length]=mailData[i];
                    }
                }   
            }
            this.src_scrollMail.populateList(mails,this.GetDetail.bind(this));
           
        }
        else
            cc.log('[hxjs][err] mailData is null!!!!!!');
    },

    // GetDetail(event){
    //     var postData = {
    //         mailId: event.getUserData(),
    //     };

    //     cc.log(postData.mailId);
    //     hxfn.net.Request(
    //         postData,
    //         'OpenMailReq',
    //         hxdt.msgcmd.OpenMail,//301
    //         this.Callback_OpenMailReq.bind(this),
    //     )
    // },

    GetDetail:function(idx){
        var mid = hxfn.mail.mailData[idx].get('mailId');
        
        var postData = {
            mailId:mid,
        };

        hxfn.netrequest.Req_OpenMail(postData,this.Callback_OpenMailReq.bind(this));
        // hxfn.net.Request(
        //     postData,
        //     'OpenMailReq',
        //     hxdt.msgcmd.OpenMail,
        //     this.Callback_OpenMailReq.bind(this),
        // )
    },

    Callback_OpenMailReq:function(msg){
        // var msg_OpenMailResp = hxdt.builder.build('OpenMailResp');
        // var msg = msg_OpenMailResp.decode(data);
        hxfn.mail.curMailId = msg.get('mailId');
        hxfn.mail.GetAllMailsFromServer(this.UpdateMails.bind(this));

        hxjs.module.ui.hub.LoadPanel_Dlg ('UI_Lobby_MailBox_Detail');
        // this.UpdateMailBox();
    },

    UpdateMailBox:function(){
        hxfn.mail.GetAllMailsFromServer(this.UpdateMails.bind(this));
    },

    UpdateClientMails:function (mid) {
        hxfn.mail.RmvClientCheckedMail(mid);
        this.UpdateMails();
        // this.src_scrollMail.populateList(hxfn.mail.mailData,this.GetDetail.bind(this));
    }
});