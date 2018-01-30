cc.Class({
    extends: cc.Component,

    properties: {
        conWuXiaoNiu: cc.Node,//13
        conWuHuaNiu: cc.Node,//12
        conSiZha: cc.Node,//11
        conNiuNiu: cc.Node,//10
        conNiu: cc.Node,
        conMeiNiu: cc.Node,

        // imgScore: cc.Sprite,

        imgNiu: cc.Sprite,
        imgNiu2: cc.Sprite,
        imgNiuNiu: cc.Sprite,
        imgNiuNiu2: cc.Sprite,
        // txtNiuNiu: cc.Label,
        // txtNiu: cc.Label,
        txtMul:cc.Label,
    },

    onLoad: function () {
       this.Reset();
    },

    Reset () {
        hxjs.module.ui.hub.HideCom(this.conWuXiaoNiu);
        hxjs.module.ui.hub.HideCom(this.conWuHuaNiu);
        hxjs.module.ui.hub.HideCom(this.conSiZha);
        hxjs.module.ui.hub.HideCom(this.conNiuNiu);
        hxjs.module.ui.hub.HideCom(this.conNiu);
        hxjs.module.ui.hub.HideCom(this.conMeiNiu);
    },

    SetInfo (info/*分数*/, idx) {
        this.Reset();
        
        //0 无牛， 1-9 牛一 到 牛九 10牛牛 11顺子 12同花 13葫芦-3+2 14五花牛 15四炸 16五小牛
        var score = info['niu'];
        var playerId = info['playerId'];//info.get('playerId');
        //// sex = 3;             //玩家性别， 0 unkown, 1 male, 2 female
        var isFemale = hxfn.battle.GetSexByPlayerId(playerId) == 2;
        
        hxjs.module.sound.PlayNiuScore(score,!isFemale);

        if(score === 0) {
            hxjs.module.ui.hub.ShowCom(this.conMeiNiu);
        }
        else if(score >= 0 && score <= 9) {
            hxjs.module.ui.hub.ShowCom(this.conNiu);
            if(this.imgNiu!= null)
                hxjs.module.asset.LoadAtlasSprite('battle_scores','Score_'+ score,this.imgNiu);
            if(this.imgNiu2!= null)
                hxjs.module.asset.LoadAtlasSprite('battle_scores','Score_'+ score,this.imgNiu2);
        }
        else if(score >= 10 && score<=13) {
            hxjs.module.ui.hub.ShowCom(this.conNiuNiu);
            if(this.imgNiuNiu!= null)
                hxjs.module.asset.LoadAtlasSprite('battle_scores','Score_'+ score,this.imgNiuNiu);
            if(this.imgNiuNiu2!= null)
                hxjs.module.asset.LoadAtlasSprite('battle_scores','Score_'+ score,this.imgNiuNiu2);
        }
        else if(score == 14) {
            hxjs.module.ui.hub.ShowCom(this.conWuHuaNiu);
        }
        else if(score == 15) {
            hxjs.module.ui.hub.ShowCom(this.conSiZha);
        }
        else if(score == 16) {
            hxjs.module.ui.hub.ShowCom(this.conWuXiaoNiu);
        }

        // else if(score >= 10 && score <= 13) {
        //     hxjs.module.ui.hub.ShowCom(this.conNiuNiu);
        //     hxjs.module.asset.LoadAtlasSprite('battle_scores','Score_'+ score,this.imgNiuNiu);
        //     hxjs.module.asset.LoadAtlasSprite('battle_scores','Score_'+ score,this.imgNiuNiu2);
        // }


        var mul = info['niumulti'];
        if(mul && mul > 1) {
            var mulString = ' ' + mul;
            this.txtMul.node.active = true;
            this.txtMul.string =  mulString;
        }
        else {
            this.txtMul.node.active = false;
        }

        // if(score>6){
        //     var mulString = '';
        //     //score = 8;

        //     if(score === 7 || score === 8){
        //         mulString = ''+this.GetExtraRatio(2);
        //     }
        //     else if(score === 9){
        //         mulString = ''+this.GetExtraRatio(3);
        //     }
        //     else if(score === 10){
        //         mulString = ''+this.GetExtraRatio(4);
        //     }
        //     else if(score === 11 || score === 12 || score === 13){
        //         mulString = ''+this.GetExtraRatio(5);
        //     }
        //     else if(score === 14 || score === 15){
        //         mulString = ''+this.GetExtraRatio(6);
        //     }
        //     else if(score === 16){
        //         mulString = ''+this.GetExtraRatio(7);
        //     }

        //     this.txtMul.node.active = true;
        //     this.txtMul.string =  mulString;
        // }
        // else{
        //     this.txtMul.node.active = false;
        // }


        // switch (score) {
        //     case 0:
        //     hxjs.module.ui.hub.ShowCom(this.conMeiNiu);
        //     break;
        //     case 1:
        //     hxjs.module.ui.hub.ShowCom(this.conNiu);
        //     this.txtNiu.string = '十带一';
        //     break;
        //     case 2:
        //     hxjs.module.ui.hub.ShowCom(this.conNiu);
        //     this.txtNiu.string = '十带二';
        //     break;
        //     case 3:
        //     hxjs.module.ui.hub.ShowCom(this.conNiu);
        //     this.txtNiu.string = '十带三';
        //     break;
        //     case 4:
        //     hxjs.module.ui.hub.ShowCom(this.conNiu);
        //     this.txtNiu.string = '十带四';
        //     break;
        //     case 5:
        //     hxjs.module.ui.hub.ShowCom(this.conNiu);
        //     this.txtNiu.string = '十带五';
        //     break;
        //     case 6:
        //     hxjs.module.ui.hub.ShowCom(this.conNiu);
        //     this.txtNiu.string = '十带六';
        //     break;
        //     case 7:
        //     hxjs.module.ui.hub.ShowCom(this.conNiu);
        //     this.txtNiu.string = '十带七' + this.GetExtraRatio(2);
        //     break;
        //     case 8:
        //     hxjs.module.ui.hub.ShowCom(this.conNiu);
        //     this.txtNiu.string = '十带八' + this.GetExtraRatio(2);
        //     break;
        //     case 9:
        //     hxjs.module.ui.hub.ShowCom(this.conNiu);
        //     this.txtNiu.string = '十带九' + this.GetExtraRatio(2);
        //     // cc.log('LoadSpriteFrameFromAtlas idx: ' + idx);
        //     // hxjs.module.asset.LoadSpriteFrameFromAtlas('score_niu','Img_NiuScore_'+ score,
        //     // function(sf){
        //     //     this.imgScore.spriteFrame = sf;
        //     // }.bind(this));
        //     break;
        //     case 10:
        //     hxjs.module.ui.hub.ShowCom(this.conNiuNiu);
        //     this.txtNiuNiu.string = '双十' + this.GetExtraRatio(3);
        //     break;
        //     case 11:
        //     // hxjs.module.ui.hub.ShowCom(this.conSiZha);
        //     hxjs.module.ui.hub.ShowCom(this.conNiuNiu);
        //     this.txtNiuNiu.string = '四炸' + this.GetExtraRatio(4);
        //     break;
        //     case 12:
        //     // hxjs.module.ui.hub.ShowCom(this.conWuHuaNiu);
        //     hxjs.module.ui.hub.ShowCom(this.conNiuNiu);
        //     this.txtNiuNiu.string = '五花' + this.GetExtraRatio(5);
        //     break;
        //     case 13:
        //     // hxjs.module.ui.hub.ShowCom(this.conWuXiaoNiu);
        //     hxjs.module.ui.hub.ShowCom(this.conNiuNiu);
        //     this.txtNiuNiu.string = '五小' + this.GetExtraRatio(6);
        //     break;
        //     default:
        //         break;
        // }
    },

    // GetExtraRatio:function(typ){
    //     // var r = ' ×1';
    //     var r = ' 1';

    //     switch (typ) {
    //         case 1:
    //         r = ' 1';
    //         break;
    //         case 2:
    //         r = ' 2';
    //         break;
    //         case 3:
    //         r = ' 3';
    //         break;
    //         case 4:
    //         r = ' 4';
    //         break;

    //         case 5:
    //         r = ' 5';
    //         break;

    //         case 6:
    //         r = ' 6';
    //         break;

    //         case 7:
    //         r = ' 8';
    //         break;

    //         default:
    //         break;
    //     }

    //     return r;
    // },
});