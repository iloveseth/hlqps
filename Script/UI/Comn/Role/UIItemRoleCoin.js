
cc.Class({
    extends: cc.Component,

    properties: {
        txtCoinTyp: cc.Sprite,
        txtCoinVal: cc.Label,
        btnHandle: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    SetInfo (info,idx) {
        this.txtCoinVal.string = info + '';

        // var str  = '';
        // if(score >= 0)
        //     str = "+ " + score;
        // else
        //     str = "- " + score;
        
        // this.txtScore.string = score + '';

        // cc.log('LoadSpriteFrameFromAtlas idx: ' + idx);
        // hxjs.module.asset.LoadSpriteFrameFromAtlas('score_niu','Img_NiuScore_2',
        // function(sf){
        //     this.scoreImg.spriteFrame = sf;
        // }.bind(this));
    }
});
