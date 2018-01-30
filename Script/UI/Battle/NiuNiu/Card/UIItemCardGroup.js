import { hxfn } from "../../../../FN/HXFN";

cc.Class({
    extends: cc.Component,

    properties: {
        cards:[cc.Sprite],
    },

    onLoad: function () {

    },

    OnReset(){
        // //重置因推牌带来的设置 ////////////////////////////////////
        // this.cards[0].node.setPosition(cc.p(hxdt.setting_niuniu.OthersCardPushedPos[0],0));
        // this.cards[1].node.setPosition(cc.p(hxdt.setting_niuniu.OthersCardPushedPos[1],0));
        // this.cards[2].node.setPosition(cc.p(hxdt.setting_niuniu.OthersCardPushedPos[2],0));
        // this.cards[3].node.setPosition(cc.p(hxdt.setting_niuniu.OthersCardPushedPos[3],0));
        // this.cards[4].node.setPosition(cc.p(hxdt.setting_niuniu.OthersCardPushedPos[4],0));
        
        for (var i = 0; i < this.cards.length; i++) {
            // //重置因推牌带来的设置 ////////////////////////////////////
            this.cards[i].node.setPosition(cc.p(hxdt.setting_niuniu.OthersCardPushedPos[i],0));
            this.cards[i].node.active = false;
        }
    },

    SetInfo(info){
        this.OnReset();
        
        var inhand = info['inhand'];
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].node.active = true;
            if(inhand[i])
                this.SetCard(inhand[i] ,this.cards[i]);
        }
        
        //3+2表现
        var niu = info['niu'];
        // var hasniu = niu !== 0;
        var has3A2 = hxfn.battle_pinshi.Check3A2(niu);
        var has4A1 = hxfn.battle_pinshi.Check4A1(niu);
        
        // var idx = hxfn.battle.GetUISeatIdx(info.get('playerId'));
        var a = this.node.getComponent(cc.Animation);
        if(a != null) {
            if(has3A2) {
                // a.play('poker_0' + (idx+1) + '_flop_shi');
                a.play('poker_02_flop_shi');// 动画类型2
            }
            else if(has4A1) {
                a.play('poker_02_flop_sizha');
            }
            // else
            //     a.play('poker_01_flop_san');
        }
    },

    SetCard:function (cardNum, cardHolder) {
        var card = hxfn.battle.GetCardPointInfo(cardNum);

        hxjs.module.asset.LoadAtlasSprite(
            'battle_cards',  
            + card['point'] + '_'+ card['suit'],
            cardHolder);
    },
});