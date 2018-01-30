
cc.Class({
    extends: cc.Component,

    properties: {
        // txtScore: cc.RichText,
        // effScore: cc.Node,

        effScore1: cc.Label,
        effScore2: cc.Label,
    },

    onLoad: function () {
        this.OnReset();
    },
    
    SetInfo (score/*分数*/, idx) {
        this.OnReset();

        if(score == null)
            return;

        // hxjs.module.ui.hub.ShowCom(this.txtScore.node);
        
        // 更改显示颜色 
        // f1bb2b ++++++
        // e0dede ------
        
        // var str  = '';
        if(score >= 0){
            // hxjs.module.ui.hub.ShowCom(this.effScore);
            
            // str = "<color=#f1bb2b> +" + score + "</c>";
            this.effScore1.string = "+" + score;
            hxjs.module.ui.hub.ShowCom(this.effScore1.node);
        }
        else {
            // str = "<color=#e0dede>" + score + "</c>";
            this.effScore2.string = score;
            hxjs.module.ui.hub.ShowCom(this.effScore2.node);
        }
        
        // this.txtScore.string = str;

        // cc.log('LoadSpriteFrameFromAtlas idx: ' + idx);
        // hxjs.module.asset.LoadSpriteFrameFromAtlas('score_niu','Img_NiuScore_2',
        // function(sf){
        //     this.scoreImg.spriteFrame = sf;
        // }.bind(this));
    },

    OnReset:function (){
        // this.txtScore.node.active = false;
        this.effScore1.node.active = false;
        this.effScore2.node.active = false;
    }
});