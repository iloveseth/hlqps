
export let history = 
{
    uihub : null,
    panels : [],

    Init(hub) {
        this.uihub = hub;
    },

    GetToppestPanel() {
        return this.panels[this.panels.length -1];
    },

    HasAllPoped : function() {
        //THINKING
        // var hasAllDistroy = false;
        // this.panels.forEach(function(element) {
        //     if(element != null)
        //         hasAllDistroy = false;
        // }, this);
        
        // return hasAllDistroy || this.panels.length == 0;
        return this.panels.length == 0;
    },

    Pop() {
        if(this.panels.length<=0){
            cc.log('there is no history ui panels!');
            return;
        }
    
        let cur = this.panels.pop();
        // cc.log('============== panels panel length: ' + this.panels.length);
        // cc.log('============== pop ui panel: ' + cur.name);

        if(this.uihub != null) {
            this.uihub.JustUnload(cur);
        }
        else {
            cc.log('Init UIHistory first!');
        }
    },
    
    // 黑色背景挡板不计算在内
    Push (panel) {
        cc.log('==============[UIHistory] Push panel: ' + panel.name);
        this.panels.push(panel);
        
        //THINKING 如果类型相同，则把之前的弹掉。。。。。。
    },
    
    Sync (panel) {
        var idx = this.panels.indexOf(panel);
        if(idx > -1){
            this.panels.splice(idx, 1);
            this.uihub.JustUnload(panel);
            return true;
        }
        else return false;
    },
}