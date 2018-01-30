cc.Class({
    extends: cc.Component,

    properties: {
        item:require("AnimEmojFly"),//中间动画，如果有此则默认就直接飞此动画 
   
    },

    onLoad: function () { 

    },

    FunPlayAudio(id){
        hxjs.module.sound.PlayGift(id);
    },
    FunPlayMid(isKeepBegin){
        this.item.FunPlayMid(isKeepBegin);
    },
    FunPlayEnd(isKeepMid){
        this.item.FunPlayEnd(isKeepMid);
    },
    FunHiddenSelf(){
        this.node.active=false;
    }
});
