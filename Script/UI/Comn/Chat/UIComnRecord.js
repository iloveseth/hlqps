cc.Class({
    extends:cc.Component,

    properties: {
        // [display]
        
        labelMaxTxt:cc.Label,
        proRecord:cc.ProgressBar,
    },
   
    onLoad: function () { 
        this.proRecord.progress=0.1;
        hxfn.adjust.AdjustLabel(this.node);
        this.labelMaxTxt.string = '最长时间'+hxdt.setting_niuniu.Anim_Voice_Record_Time+'秒';
      
        this.schedule(function(){
            this.proRecord.progress+=0.1;
            cc.info('update');
        }.bind(this),1,10,0);
    }, 
})