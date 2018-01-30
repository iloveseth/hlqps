cc.Class({
    extends: cc.Component,

    properties: {
        imgChess:cc.Sprite,
        txtHand:cc.Label,
        txtCountDown:cc.Label,

        timerHand:{default: null, serializable: false, visible: false,},
    },

    ////////////////////////////////////////////////////////////////////////
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    start () {
        //this.StartCountDown();
        //this.SetHand(0);

        // this.notifiers = [
            
        // ];
        // eval(hxfn.global.HandleNotifiersStr(this.notifiers,true));
    },
    // update (dt) {},
    onDestroy(){
        if(this.timerHand){
            window.clearInterval(this.timerHand);
            this.timerHand = null;
        }
    },
    ////////////////////////////////////////////////////////////////////////


    StartHandCountDown(time){
        this.timerHand = window.setInterval(function(){
            this.SetHandTime(--time);
        }.bind(this),1000);
    },

    StopHandCountDown(time){
        if(this.timerHand){
            window.clearInterval(this.timerHand);
        }
        this.SetHandTime(time);
        this.timerHand = null;
    },

    SetHandTime(time){
        if(this.txtCountDown)
        this.txtCountDown.string = time + 'S';
    },

    SetHand(hand){
        this.txtHand.string = hxfn.five.txtHand[hand] + ':';
        hxjs.module.asset.LoadAtlasSprite(hxfn.five.atlasName,hxfn.five.imgChess[hand],this.imgChess);
    },
});