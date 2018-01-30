cc.Class({
    extends: cc.Component,

    properties: {
       newActivity:require('UINew'),
       newTask:require('UINew'),
       newMail:require('UINew'),
       newAnnounce:require('UINew'),
    },

    onLoad: function () {
        hxfn.newtip.Add(hxfn.newtip.Enum_TipNew.Fn_Activity, this.newActivity);
        hxfn.newtip.Add(hxfn.newtip.Enum_TipNew.Fn_Task, this.newTask);
        hxfn.newtip.Add(hxfn.newtip.Enum_TipNew.Fn_Mail, this.newMail);
        hxfn.newtip.Add(hxfn.newtip.Enum_TipNew.Fn_Notice, this.newAnnounce);
    },

    onDestroy: function () {
        hxfn.newtip.Rmv(hxfn.newtip.Enum_TipNew.Fn_Activity, this.newActivity);
        hxfn.newtip.Rmv(hxfn.newtip.Enum_TipNew.Fn_Task, this.newTask);
        hxfn.newtip.Rmv(hxfn.newtip.Enum_TipNew.Fn_Mail, this.newMail);
        hxfn.newtip.Rmv(hxfn.newtip.Enum_TipNew.Fn_Notice, this.newAnnounce);
    },
});
