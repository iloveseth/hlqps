cc.Class({
    extends: cc.Component,

    properties: {
        txtHead: cc.Label,
        Img_Read: cc.Node,
        Img_Unread: cc.Node,
        btnCheck:cc.Button,
        txtTime: cc.Label,
        idx:-1,
        callback_check: null,
    },

    onLoad: function () {
        cc.log('UIItemMail.onLoad');

        this.btnCheck.getComponent('UIButton').SetInfo(function(){
            this.callback_check(this.idx);
        }.bind(this));
    },

    ResetLayout:function() {

    },

    SetInfo (inf/*{time, origin, ......}*/,idx, callback) {
        if(inf == null) {
            cc.log("setInfo return;")
            return;
        }

        this.idx = idx;
        this.callback_check = callback;

        var mailId = inf.mailId;
        cc.log('mailId:' + mailId);

        // this.btnCheck.getComponent('UIButton').SetInfo(function(){
        //     var playerEvent = new cc.Event.EventCustom('detail', true);
        //     playerEvent.setUserData(mailId);
        //     this.node.dispatchEvent(playerEvent);
        // }.bind(this));
        
        if(inf.readFlag == 0)
        {
            this.Img_Read.active = false;
            this.Img_Unread.active = true;
        }
        else if(inf.readFlag == 1)
        {
            this.Img_Unread.active = false;
            this.Img_Read.active = true;
        }

        this.txtHead.string = inf.title;

        var date =  new Date(inf.time*1000);
        var y = 1900+date.getYear();
        var m = "0"+(date.getMonth()+1);
        var d = "0"+date.getDate();
        var timeString =  y+"/"+m.substring(m.length-2,m.length)+"/"+d.substring(d.length-2,d.length);

        this.txtTime.string =timeString ;
    },
});
