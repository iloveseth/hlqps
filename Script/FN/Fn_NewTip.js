import { hxfn } from "./HXFN";

export let newtip = 
{
    Enum_TipNew : cc.Enum({
        Fn_Activity:'1',
        Fn_Task:'2',
        Fn_Mail:'3',
        Fn_Notice:'4',
    }),

    // function Notifyer() {
    //     this.container = null,
    //     this.number = -1,
    // },

    OnInit(){
        hxjs.util.Notifier.on('Update_Tip_New',this.UpdateTipNew,this);
    },

    OnEnd(){
        hxjs.util.Notifier.off('Update_Tip_New',this.UpdateTipNew,this);
    },

    // 最多支持两级嵌套
    UpdateTipNew:function(arr){
        // var enumId='';
        var mainId = '';
        var subId = -1;

        mainId = arr[0];
        if(arr.length == 2) 
            subId = arr[1];

        // if(subId == null){
        //     enumId = mainId;//.toString();
        // }
        // else {
        //     enumId = mainId + subId;
        // }

        switch (mainId) {
            case this.Enum_TipNew.Fn_Activity:
            this.UpdateNew(mainId, hxfn.activityAndTask.CountAllUndoneActivity());
            if(subId != -1)
                this.UpdateNew(mainId + subId, hxfn.activityAndTask.CountUndoneActivityByTyp(subId));
            break;
            case this.Enum_TipNew.Fn_Task:
            this.UpdateNew(mainId, hxfn.activityAndTask.CountAllUnawardTasks());
            if(subId != -1)
                this.UpdateNew(mainId + subId, hxfn.activityAndTask.CountUnawardTasksByTyp(subId));
            break;
            case this.Enum_TipNew.Fn_Mail:
            this.UpdateNew(mainId, hxfn.mail.CountUnhandledMails());
            break;
            case this.Enum_TipNew.Fn_Notice:
            this.UpdateNew(mainId, hxfn.notice.CountUnhandledNotices());
            break;
            default:
                break;
        }
    },

    UpdateNew(enumId, num){
        var arr = this.notifyCollector[enumId];
        if(arr != null) {
            arr.forEach(function(element) {
                element.SetInfo(num);
            }, this);
        }
    },

    notifyCollector:{},

    Add(enumId, uinew) {
        var n = uinew;
        // var n = new Notifyer();
        // n.container = con,
        // n.number = num,

        // this.notifyCollector[enumId].push(n);
        var arr= this.notifyCollector[enumId];
        if(arr == null)
            arr = [];
        arr.push(n);

        this.notifyCollector[enumId] = arr;
    },

    Rmv(enumId, uinew){
        var toRemoveN = null;
        var ns = this.notifyCollector[enumId];
        ns.forEach(function(element) {
            if(element == uinew) {
                toRemoveN = element;
                // break;
                return false;
            }
        }, this);

        if(toRemoveN != null) {
            ns.remove(toRemoveN);
            toRemoveN = null;
        }
    }
}