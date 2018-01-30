export let mail = 
{
    mailData: null,
    curMailId:null,

    isStartGetting:false,
    callback_Complete:null,

    // OnInit(){
        
    // },

    OnStart(){
        this.OnReset();
    },

    OnReset(){
        this.isStartGetting = false;
        this.GetAllMailsFromServer(null);
    },

    OnEnd(){
        this.mailData = null;
        this.curMailId = -1;
        this.isStartGetting = false;
        this.callback_Complete = null;
    },

    GetAllMailsFromServer (cb) {
        if(this.isStartGetting)
            return;

        this.isStartGetting = true;
        this.callback_Complete = cb;

        hxfn.netrequest.Req_GetMailList(this.Callback_GetMailListReq.bind(this));
    },

    Callback_GetMailListReq: function(msg){//data
        // var msg_GetMailListResp = hxdt.builder.build('GetMailListResp');
        // var msg = msg_GetMailListResp.decode(data);        
        var mailData = msg.get('mailData');
        this.InitAllMail(mailData);

        if(this.callback_Complete!= null)
            this.callback_Complete()
        this.isStartGetting = false;
    },

    InitAllMail:function (m){
        this.mailData = m;
        hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Mail]);
    },

    SearchFirstMailById(mailId){
        for(var i = 0;i!= this.mailData.length;++i){
            if(this.mailData[i].mailId == mailId){
                return this.mailData[i]
            }
        }
    },
    
    RmvClientCheckedMail(mid){
        var mail = null;
        this.mailData.forEach(function(element) {
            if(element.get('mailId') == mid)
                mail = element;
        }.bind(this), this);

        this.mailData.remove(mail);

        hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Mail]);
    },

    CountUnhandledMails () {
        // 如果已经读过，但是未领取附件的邮件如何对待？
        if(this.mailData == null)
            return 0;
        
        var n = 0;
        this.mailData.forEach(function(element) {
            if(element.get('readFlag') === 0)
                n+=1;
        }, this);

        return n;
    }
}