cc.Class({
    extends: require('UIPanelItem'),

    properties: {
        txtName:cc.Label,
        newCon:require('UINew'),

        typid:0,
        clasid:0,
    },

    onLoad: function () {
        this.OnInit();
    },
    
    start:function (){
    },
    
    onDestroy: function () {
        if(this.clasid === 1)
            hxfn.newtip.Rmv(hxfn.newtip.Enum_TipNew.Fn_Activity + this.typid, this.newCon);
        else if(this.clasid === 2)
            hxfn.newtip.Rmv(hxfn.newtip.Enum_TipNew.Fn_Task + this.typid, this.newCon);
    },
    
    SetInfo(info, idx, callback){
        this.SetInfoBase(idx, callback);
        
        this.txtName.string = info['name'];
        this.clasid = info['clas'];
        
        this.typid = this.idx;
        if(this.clasid === 1) {
            hxfn.newtip.Add(hxfn.newtip.Enum_TipNew.Fn_Activity + this.typid, this.newCon);
            hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Activity, this.typid]);
        }
        else if(this.clasid === 2) {
            hxfn.newtip.Add(hxfn.newtip.Enum_TipNew.Fn_Task + this.typid, this.newCon);
            hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Task, this.typid]);
        }
    }
});