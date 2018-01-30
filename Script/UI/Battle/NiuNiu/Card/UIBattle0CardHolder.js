import { hxdt } from '../../../../DT/HXDT';
import { hxfn } from '../../../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        conCardsFloEff1: [cc.Node],//从背面先翻转一半
        conCardsHolders: [cc.Sprite],//背面到正面翻转，3，以及常态显示对象数组
        //老需求：提示选牛
        // groupToggleCard: require('UIBattle0CardNiuCheck'),

        //为了给其他玩家的手牌增加3+2效果显示
        //如果是散牌，没有3+2效果则仍有由发牌的牌组来显示
        conCardsHolders2:[cc.Node],

        conCardsPush:cc.Node,
        
        // [nondisplay]
        cardscore:[],
        cardsCount:{default:5, serializable:false, visible:false},

        // //牌的初始位置
        // originPosY:0,
        // //选中的牌的偏移距离
        // deltaY:20,
    },

    //由父对象来管控生命周期
    // onLoad: function () { },
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    OnInit() {
        this.OnClear();
        
        // this.scr_groupToggleCard = groupToggleCard;
        // this.scr_groupToggleCard.SetMaxSelected (3);
        // this.scr_groupToggleCard.SetInfo (this.ToggleCard.bind(this));

        // if(this.CheckPinShi()) {
        //     hxjs.util.Notifier.on('[NiuNiu]_BattleUI-SelectBestCards', this.InitBestCards,this);
        //     hxjs.util.Notifier.on('[NiuNiu]_BattleUI-EnableSelectCards', this.EnableSelect, this);
        // }
    },

    OnReset(){
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
        
        this.OnClear();
    },

    OnClear :function (){
        // if(this.CheckPinShi()) {
        //     this.ResetCardsPos();
        //     this.scr_groupToggleCard.OnReset();
        //     this.scr_groupToggleCard.SetAllUnChecked();
        //     this.EnableSelect(false);
        // }
        
        this.cardscore = [];
        hxfn.battle.myAllCards = this.cardscore;
        
        this.conCardsHolders.forEach(function(element) {
            hxjs.module.ui.hub.HideCom(element.node);
        }, this);
        
        this.HideEff1All();

        //重置因推牌带来的设置 ////////////////////////////////////
        //0 停掉所有正在播放的动画
        let anim = this.conCardsPush.getComponent(cc.Animation);
        if(anim && anim.currentClip)
            anim.stop(anim.currentClip.name);
            
        //1 玩家自己
        // (1)牌容器位置
        this.conCardsPush.setScale(cc.p(1,1));
        this.conCardsPush.setPosition(hxdt.setting_niuniu.MyCardConPos);
        // (2)每张牌的缩放与位置
        for (var i = 0; i < this.conCardsHolders.length; i++) {
            this.conCardsHolders[i].node.setScale(cc.p(1,1));
            this.conCardsHolders[i].node.setPosition(hxdt.setting_niuniu.MyPushedPos[i]);
        }

        //2 其他玩家
        this.conCardsHolders2.forEach(function(element) {
            element.getComponent('UIItemCardGroup').OnReset();
        }, this);
    },

    OnEnd(){},
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //--------------------------------------------------------------------
    ShowMy4(info) {
        this.ShowEff1(true);

        // 从背面翻一般需要0、1秒
        this.scheduleOnce(function(){
            this.ShowEff1(false);

            for (var i = 0; i < (this.cardsCount - 1); i++) {
                hxjs.module.ui.hub.ShowCom(this.conCardsHolders[i].node);
            }
        }.bind(this),0.1);
    },

    ShowMy4_Recover (){
        for (var i = 0; i < (this.cardsCount - 1); i++) {
            // hxjs.module.ui.hub.ShowCom(this.conCardsHolders[i].node);
            this.conCardsHolders[i].node.active = true;
        }
    },
    //--------------------------------------------------------------------

    //--------------------------------------------------------------------
    ShowMy5(info) {
        this.ShowEff1_5(true);

        // 从背面翻一般需要0、1秒
        this.scheduleOnce(function(){
            this.ShowEff1_5(false);

            for (var i = 0; i < this.cardsCount; i++) {
                hxjs.module.ui.hub.ShowCom(this.conCardsHolders[i].node);
            }
        }.bind(this),0.1);
    },

    ShowMy5_Recover (){
        for (var i = 0; i < this.cardsCount; i++) {
            // hxjs.module.ui.hub.ShowCom(this.conCardsHolders[i].node);
            this.conCardsHolders[i].node.active = true;
        }
    },
    //--------------------------------------------------------------------


    SetInfo(info) {
        this.cardscore = info;
        hxfn.battle.myAllCards = this.cardscore;

        for (var i = 0; i < this.conCardsHolders.length; i++) {
            if(info[i])
                hxfn.battle.SetCard(info[i], this.conCardsHolders[i]);
        }
    },

    ShowHandLast (lastCard) {
        // 最后一个位置替换为最后一张发出的有效牌
        var lastIdx = this.cardsCount - 1;
        this.cardscore[lastIdx] = lastCard;
        hxfn.battle.myAllCards = this.cardscore;

        var cardnum = lastCard;
        hxjs.module.ui.hub.ShowCom(this.conCardsHolders[lastIdx].node);
        hxfn.battle.SetCard(cardnum, this.conCardsHolders[lastIdx])

        // //同时退出手牌
        // this.PushCard();
    },

    ShowHandLast_Recover (lastCard) {
        // 最后一个位置替换为最后一张发出的有效牌
        var lastIdx = this.cardsCount - 1;
        this.cardscore[lastIdx] = lastCard;
        hxfn.battle.myAllCards = this.cardscore;

        var cardnum = lastCard;
        this.conCardsHolders[lastIdx].node.active = true;//-------------------Recover
        hxfn.battle.SetCard(cardnum, this.conCardsHolders[lastIdx])

        // //同时退出手牌
        // this.PushCard();
    },

    ShowEff1:function (isShow) {
        for (var i = 0; i < (this.cardsCount - 1); i++) {
            if(isShow)
                hxjs.module.ui.hub.ShowCom(this.conCardsFloEff1[i]);
            else
                hxjs.module.ui.hub.HideCom(this.conCardsFloEff1[i]);
        }
    },

    ShowEff1_5:function (isShow) {
        for (var i = 0; i < this.cardsCount; i++) {
            if(isShow)
                hxjs.module.ui.hub.ShowCom(this.conCardsFloEff1[i]);
            else
                hxjs.module.ui.hub.HideCom(this.conCardsFloEff1[i]);
        }
    },

    HideEff1All:function () {
        for (var i = 0; i < this.conCardsFloEff1.length; i++) {
            hxjs.module.ui.hub.HideCom(this.conCardsFloEff1[i]);
        }
    },

    // 3 + 2 刷新手牌
    RefreshCards  (inf) {
        var info = inf;//.get('showHand');
        cc.log('my best:');
        cc.log(info);

        //最后因为有牛没牛导致的最终牌型-----------
        this.cardscore = info;
        hxfn.battle.myAllCards = this.cardscore;
        //--------------------------------------

        for (var i = 0; i < this.conCardsHolders.length; i++) {
            hxfn.battle.SetCard(info[i] ,this.conCardsHolders[i]);
        }
    },

    MakeSureAllCardsHasShowed (){
        for (var i = 0; i < this.conCardsHolders.length; i++) {
            this.conCardsHolders[i].node.active = true;
        }
    },

    // 推出手牌
    PushCard (info) {
        // 播放动画
        // 如果是散牌 poker_01_flop_san
        // 如果是有牛 poker_01_flop_shi

        // var hasniu = info/*.get('niu')*/ !== 0;
        var has3A2 = hxfn.battle_pinshi.Check3A2(info);
        var has4A1 = hxfn.battle_pinshi.Check4A1(info);
        var a = this.conCardsPush.getComponent(cc.Animation);
        if(a != null) {
            if(hxdt.setting_niuniu.Time_Anim_DelayPushMyCards > 0) {
                this.scheduleOnce(function(){
                    this.RealPushCards(a, has3A2, has4A1);
                }.bind(this),hxdt.setting_niuniu.Time_Anim_DelayPushMyCards);
            }
            else{
                this.RealPushCards(a, has3A2, has4A1);
            }
        }
    },

    RealPushCards:function (cardsHolder, has3A2, has4A1){
        if(has3A2){
            cardsHolder.play('poker_01_flop_shi');
            return;
        }
        
        if(has4A1){
            cardsHolder.play('poker_01_flop_sizha');
            return;
        }
        
        cardsHolder.play('poker_01_flop_san');
    },

    // 推出手牌
    PushCard_Cover (info) {
        // 播放动画
        // 如果是散牌
        // poker_01_flop_san
        // 如果是有牛
        // poker_01_flop_shi

        // var hasniu = info/*.get('niu')*/ !== 0;
        var has3A2 = hxfn.battle_pinshi.Check3A2(info);
        var has4A1 = hxfn.battle_pinshi.Check4A1(info);
        var a = this.conCardsPush.getComponent(cc.Animation);
        if(a != null) {
            if(has3A2){
                a.play('poker_01_flop_shi_s');
                return;
            }
            
            if(has4A1) {
                a.play('poker_01_flop_sizha_s');
                return;
            }
            
            a.play('poker_01_flop_san_s');
        }
    },

    //////////////////////////////////////////////////////////////
    ShowOtherCards (cardsInfo) {
         var playerId = cardsInfo.get('playerId');
        var idx = hxfn.battle.GetUISeatIdx(cardsInfo.get('playerId'));
        
        cc.log('playerId: ' + playerId);
        cc.log('idx: ' + idx);
        //因为已经把牌发到了合适位置，所以直接显示，而不需要播动画
        //而且因为showhand时候已经显示了当前自己玩家的最后一张牌，所以不需要再次显示
        if(idx == null || idx <= 0){
            cc.log('[hxjs][err] can not find player id: ' + playerId);
            return;
        }
        
        cc.log('idx: ' + idx);
        var newinfo  = {};
        newinfo['inhand'] = cardsInfo.get('showHand');
        newinfo['niu'] = cardsInfo.get('niu');
        this.conCardsHolders2[idx-1].getComponent('UIItemCardGroup').SetInfo(newinfo);
    },

    ShowOtherCards_Cover (idx, inhand, niu) {
        cc.log('idx: ' + idx);
        if(idx == null || idx <= 0){
            return;
        }

        var newinfo  = {};
        newinfo['inhand'] = inhand;
        newinfo['niu'] = niu;
        this.conCardsHolders2[idx-1].getComponent('UIItemCardGroup').SetInfo(newinfo);
    },
});

/*
ShowOtherCards
    // hxjs.module.ui.hub.ShowCom(this.conCards[(idx+1)*this.cardsCount - 1].node);

    // var card = this.conCards[(idx+1)*this.cardsCount - 1];
    // //TEMP 由于最多5个玩家变成6个玩家
    // if(card != null)
    //     card.node.active = true;

    // var cards = cardsInfo.get('showHand');
    // for (var j = 0; j < cards.length; j++) {//should be 5/2/3 
    //     var cardid = cards[j];
    //     var card = hxfn.battle.GetCardPointInfo(cardid);
        
    //     hxjs.module.asset.LoadAtlasSprite(
    //         'cards',  
    //         + card['point'] + '_'+ card['suit'],
    //         this.conCards[idx*this.cardsCount + j]);
    // }


//提示niuniu做法
// CheckPinShi(){
    //     return this.cardsCount === 5;
    // },

    //为了拼10，博眼子呢？？？
    // ResetCardsPos: function() {
    //     this.HandleToogle(0,false);
    //     this.HandleToogle(1,false);
    //     this.HandleToogle(2,false);
    //     this.HandleToogle(3,false);
    //     this.HandleToogle(4,false);
    // },

    // ToggleCard:function (idx, isChecked){
    //     cc.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~ callback idx: ' + idx + '/ isCheck: ' + isChecked);
    //     hxjs.util.Notifier.emit('[NiuNiu]_BattleUI-SelectCard', [this.cardscore[idx],idx,isChecked]);
    //     this.HandleToogle(idx, isChecked);
    // },

    // InitBestCards: function (lst) {
    //     if(lst!= null && lst.length > 0) {
    //         this.scr_groupToggleCard.SetAllUnChecked();
    //         this.EnableSelect(false);

    //         for (var i = 0; i < lst.length; i++) {
    //             var item = lst[i];
    //             var idx = this.cardscore.indexOf(item);
    //             cc.log('InitBestCards idx: ' + idx);
    //             this.HandleToogle(this.cardscore.indexOf(item), true);
    //             this.scr_groupToggleCard.UpdateSelectIdx(idx, true);
    //         }
    //     }
    // },
    
    // HandleToogle:function (idx, isChecked) {
    //     var t = this.scr_groupToggleCard.GetToggle(idx);

    //     var x = t.node.getPositionX();//获取节点的X轴位置
    //     // var y = t.node.getPositionY();//获取节点的Y轴位置
    //     // if(isChecked)
    //     //     t.node.setPosition(x,y+20);
    //     // else
    //     //     t.node.setPosition(x,y-20);

    //     if(isChecked)
    //         t.node.setPosition(x, this.originPosY+20);
    //     else
    //         t.node.setPosition(x, this.originPosY);
    // },

    // EnableSelect:function (isEnable) {
    //     this.scr_groupToggleCard.SetEnable(isEnable);
    // },

    // SetCard:function (cardNum, cardHolder) {
    //     if(cardNum > 0) {
    //         var card = hxfn.battle.GetCardPointInfo(cardNum);
    //         // cardHolder.node.active = true;
    //         hxjs.module.asset.LoadAtlasSprite(
    //             hxdt.setting_ui.Enum_Atlas.Battle_Cards,
    //             + card['point'] + '_'+ card['suit'],
    //             cardHolder);
    //     }
    //     // else{
    //         // cardHolder.node.active = false;
    //     // }
    // },
*/