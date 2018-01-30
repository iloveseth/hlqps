cc.Class({
    extends: cc.Component,

    properties: {
        prog:cc.ProgressBar,
        imgArrow:cc.Node,
        bar: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    SetProg(prog){
        cc.log('SetProg:');
        cc.log(prog)
        if(prog == 0){
            this.prog.progress = 0;
            this.imgArrow.active = false;
            this.bar.active = false;
        }
        else{
            this.bar.active = true;
            this.prog.progress = prog;
            
            //红色版本
            if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED) {
                this.bar.width = 640*prog;//红色版本
            }
            else {
                this.bar.width = 546.9*prog;
            }

            this.imgArrow.active = true;
            this.imgArrow.x = this.bar.width;
        }
        
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
