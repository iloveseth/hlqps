import { hxjs } from "../../../../../HXJS/HXJS";
import { hxfn } from "../../../../FN/HXFN";

cc.Class({
    extends: cc.Component,

    properties: {
        conDispatchEff: cc.Node,
        conCards: [cc.Sprite],
        cardsCount:5, //看牌抢庄 博眼子 三公 牌总数不一样
        
        // timer:-1,
        //所有牌的索引
        allCardIdxs:{ default: null, serializable: false, visible: false},
        //第一轮发牌的索引
        cardIdxs:{ default: null, serializable: false, visible: false},
        //第二轮（最后一轮）发牌索引
        lastCardIdxs:{ default: null, serializable: false, visible: false},
    },

    // LIFE-CYCLE //////////////////////////////////////////////////////////////////////////////
    onLoad: function () {
        //如果需要程序初始化为全背面，事实上没有必要，静态设置好即可！！！

        // this.conCards.forEach(function(element) {
        //     hxjs.module.asset.LoadAtlasSprite(
        //         hxdt.setting_ui.Enum_Atlas.Battle_Cards,  
        //         'back',
        //         element);
        // }.bind(this), this);
    },

    OnInit() {
        this.allCardIdxs = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],[25,26,27,28,29]];
        this.cardIdxs = [[0,1,2,3],[5,6,7,8],[10,11,12,13],[15,16,17,18],[20,21,22,23],[25,26,27,28]],
        this.lastCardIdxs = [4,9,14,19,24,29],
        this.OnReset();
    },

    OnReset () {
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
        // hxjs.module.ui.hub.HideCom(this.conDispatchEff);
        this.MakeSureAllCardsHide();
        // this.timer = 0;
    },

    OnEnd () {
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
    },
    ////////////////////////////////////////////////////////////////////////////////////////////


    
    //1，发牌 //////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////非看牌抢庄情况下
    Dispatch5All_Recover_2 (seatIdx){
        var allCardIdxs = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],[25,26,27,28,29]];
        var idxs = allCardIdxs[seatIdx];
        idxs.forEach(function(element) {
            this.SilenceShow(this.conCards[element].node);
        }.bind(this), this);
    },


    /////////////////////////////////看牌抢庄情况下
    //有可能位置上没人
    //XXX 前4张牌可以理解为是一次性全发的
    Dispatch4Others_Recover (idx){
        //恢复现场时，不需要有自己的发牌效果，前四张直接显示holder里的牌
        var cardIdxs = [null,[5,6,7,8],[10,11,12,13],[15,16,17,18],[20,21,22,23],[25,26,27,28]];
        var idxs = cardIdxs[idx];
        idxs.forEach(function(element) {
            this.SilenceShow(this.conCards[element].node);
        }.bind(this), this);
    },
    //有可能位置上没人
    //XXX 最后一张牌是一个一个发的，但是挨着，所以也可以理解为一次性
    Dispatch5All_Recover (seatIdx){
        //如果是玩家自己，则会默认显示4张牌，所以其实是只要发一张牌
        var allCardIdxs = [[/*0,1,2,3,*/4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],[25,26,27,28,29]];
        var idxs = allCardIdxs[seatIdx];
        idxs.forEach(function(element) {
            this.SilenceShow(this.conCards[element].node);
        }.bind(this), this);
    },

    //静默显示一个对象
    SilenceShow:function (card){
        card.active = true;
        
        //静默显示，播放一帧到位的动画
        var animCtrl = card.getComponent(cc.Animation);
        if(animCtrl) {
            var clips = animCtrl.getClips();
            if(clips.length>1 && clips[1] != null)
                animCtrl.play(clips[1].name);
        }
    },
    //------------------------------------------------------------------------

    //目前！！！有发四张暗牌和5张暗牌的区别
    DispatchNew (num) {
        //HACK
        if(num && num <4)
        return;

        var cardsNum = num;
        // this.allCardIdxs = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],[25,26,27,28,29]];
        // this.cardIdxs = [[0,1,2,3],[5,6,7,8],[10,11,12,13],[15,16,17,18],[20,21,22,23],[25,26,27,28]],
        var cardIdxs = [];
        if(cardsNum == 4)
            cardIdxs = this.cardIdxs;
        else if(cardsNum == 5)
            cardIdxs = this.allCardIdxs;



        var delta = 0.05;
        var duration = hxdt.setting_niuniu.Time_Anim_DispatchOnce;
        var maxTimers =  delta * cardsNum + duration;
        var realRolesIdx = hxfn.battle.GetValidSeatIdx();

        //////////////////////////////////////////////////////////////////////
        for (var i = 0; i < realRolesIdx.length; i++) {
            var idxs = cardIdxs[realRolesIdx[i]];
            if(idxs != null) {
                hxjs.module.sound.PlayBattle(hxdt.setting_niuniu.Enum_BattleSFX.Card_Dispath);
                this.PCards(idxs, delta);
            }
            else {
                cc.log('[hxjs][err] no item found in cardIdxs, with idx: ' + realRolesIdx[i]);
            }
        }

        //发牌结束之后关闭发牌动作特效
        this.schedule(function() {
            // hxjs.module.ui.hub.HideCom(this.conDispatchEff);
            this.unscheduleAllCallbacks(this);
        }.bind(this),maxTimers);
    },

    PCards:function (idxs, delta) {
        // cc.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1 : '+cardsIdx);
        var timer = 0;
        this.schedule(function() {
            var tempidx = timer;
            // cc.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~2 : '+tempidx);
            // cc.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~3 : '+cardsIdx[tempidx]);
            hxjs.module.ui.hub.ShowCom(this.conCards[idxs[tempidx]].node);                
            timer += 1;
        }.bind(this),delta, idxs.length-1, 0);
    },

    //给所有玩家发最后一张牌
    //根据实际有效玩家的位置发最后一张牌（除去观战中的玩家）
    //正确的是：暗牌发过来之后，在由Holder翻开！
    DispatchAllLastCard(){
        var arr = this.lastCardIdxs;//[4,9,14,19,24,29];
        var realRolesIdx = hxfn.battle.GetValidSeatIdx();
        for (var i = 0; i < realRolesIdx.length; i++) {
            var uiIdx = realRolesIdx[i];
            if(hxfn.battle_pinshi.CheckHasActNiuNiu(uiIdx))
                continue;
                
            var cardIdx = arr[uiIdx];
            if(this.conCards[cardIdx] != null) {
                hxjs.module.sound.PlayBattle(hxdt.setting_niuniu.Enum_BattleSFX.Card_DispathLast);
                hxjs.module.ui.hub.ShowCom(this.conCards[cardIdx].node);
            }
            else{
                cc.log('[hxjs][err] no item found in this.conCards, with idx: ' + cardIdx);
            }
        }
    },

    //2,隐藏牌 //////////////////////////////////////////////////////////////////////////////
    
    // ------ 我的
    // HideCurRole () {
    HideMy4 () {
        // cardsCount - 1
        this.conCards[0].node.active = false;
        this.conCards[1].node.active = false;
        this.conCards[2].node.active = false;
        this.conCards[3].node.active = false;
    },
    // 通用
    // HideRoleCurCards (cardsIdx) {
    //     for (let i = 0; i < cardsIdx.length; i++) {
    //         let element = cardsIdx[i];
    //         if(element)
    //             this.conCards[element].node.active = false;
    //     }
    // },

    HideMyLast (){
        this.unscheduleAllCallbacks(this);//停止所有计时器

        var lstIdx = this.cardsCount -1;
        this.conCards[lstIdx].node.active = false;
    },

    MakeSureAllCardsHide_My(){
        hxjs.module.ui.hub.HideCom(this.conCards[0].node);
        hxjs.module.ui.hub.HideCom(this.conCards[1].node);
        hxjs.module.ui.hub.HideCom(this.conCards[2].node);
        hxjs.module.ui.hub.HideCom(this.conCards[3].node);
        hxjs.module.ui.hub.HideCom(this.conCards[4].node);
    },


    // ------ 其他玩家的
    HideOtherCards_Cover(idx){
        if(idx == null || idx <= 0){
            cc.log('[hxjs][err] can not find player idx: ' + idx);
            return;
        }

        var idxs = this.allCardIdxs[idx];

        if(idxs!= null) {
            idxs.forEach(function(element) {
                // hxjs.module.ui.hub.ShowCom(this.conCards[idxs[tempidx]].node);  
                this.conCards[element].node.active = false;
            }.bind(this), this);
        }
    },
    
    HideOtherCards (cardsInfo) {
        var playerId = cardsInfo.get('playerId');
        var idx = hxfn.battle.GetUISeatIdx(cardsInfo.get('playerId'));
        
        this.HideOtherCards_Cover(idx);
    },


    // ------ 所有玩家的
    MakeSureAllCardsHide(){
        this.conCards.forEach(function(element) {
            hxjs.module.ui.hub.HideCom(element.node);
        }.bind(this), this);
    },
});





/*
//老版本，特定只发4张暗牌
    Dispatch (info) {
        //发牌特效
        // hxjs.module.ui.hub.ShowCom(this.conDispatchEff);
        
        //根据实际有多少玩家,且精确位置来发牌
        
        //一次性发牌
        //case3
        var delta = 0.05;
        var duration = hxdt.setting_niuniu.Time_Anim_DispatchOnce;
        var maxTimers =  delta * (this.cardsCount - 1)+ duration;
        var realRolesIdx = hxfn.battle.GetValidSeatIdx();
        //////////////////////////////////////////////////////////////////////
        var cardIdxs = this.cardIdxs;//[[0,1,2,3],[5,6,7,8],[10,11,12,13],[15,16,17,18],[20,21,22,23],[25,26,27,28]];
        
        // this.timer = 0;
        // for (var i = 0; i < cardIdxs.length; i++) {
        //     var idxs = cardIdxs[i];
        //     var timer = 0;
        //     // idxs.forEach(function(element) {
        //     //     hxjs.module.ui.hub.ShowCom(this.conCards[element].node);
        //     // }, this);

        //     this.schedule(function() {
        //         var tempidx = timer;
        //         hxjs.module.ui.hub.ShowCom(this.conCards[idxs[tempidx]].node);
                    
        //         timer += 1;
        //         // if(this.timer>= maxTimers){
        //         //     hxjs.module.ui.hub.HideCom(this.conDispatchEff);
        //         //     this.unscheduleAllCallbacks(this);
        //         // }
        //     }.bind(this),delta, idxs.length, 0);
        // }

        for (var i = 0; i < realRolesIdx.length; i++) {
            var idxs = cardIdxs[realRolesIdx[i]];
            if(idxs != null) {
                hxjs.module.sound.PlayBattle(hxdt.setting_niuniu.Enum_BattleSFX.Card_Dispath);
                this.PCards(idxs, delta);
            }
            else {
                cc.log('[hxjs][err] no item found in cardIdxs, with idx: ' + realRolesIdx[i]);
            }
        }

        //发牌结束之后关闭发牌动作特效
        this.schedule(function() {
            // hxjs.module.ui.hub.HideCom(this.conDispatchEff);
            this.unscheduleAllCallbacks(this);
        }.bind(this),maxTimers);

        //间断性的发牌
        //case2 
        // var delta = 0.2;
        // var realRolesIdx = hxfn.battle.GetValidSeatIdx();
        // //////////////////////////////////////////////////////////////////////
        // var cardIdxs = [[0,1,2,3],[5,6,7,8],[10,11,12,13],[15,16,17,18],[20,21,22,23]];
        // var maxTimers = realRolesIdx.length;
        // this.schedule(function() {
        //     //新需求，只显示4张牌
        //     var idxs = cardIdxs[this.timer];
        //     idxs.forEach(function(element) {
        //         hxjs.module.ui.hub.ShowCom(this.conCards[element].node);
        //     }, this);
        //    
        //     this.timer += 1;
        //     if(this.timer>= maxTimers){
        //         hxjs.module.ui.hub.HideCom(this.conDispatchEff);
        //         this.unscheduleAllCallbacks(this);
        //     }
        // }.bind(this),delta);
        
        //case1 老版本：轮流发牌/////////////////////////////////////////////////////
        // var realRolesCount = hxfn.battle.CountRealPlayer();//.allRoles;
        // var maxTimers = realRolesCount * this.cardsCount;

        // this.schedule(function() {
        //     //显示并播放动画
        //     //新需求，只显示4张牌
        //     var tempidx = this.timer + 1;
        //     if(tempidx%5 !== 0) {
        //         hxjs.module.ui.hub.ShowCom(this.conCards[this.timer].node);
        //     }
        //
        //     this.timer += 1;
        //     if(this.timer>= maxTimers){
        //         // this.conDispatchEff.active = false;
        //         hxjs.module.ui.hub.HideCom(this.conDispatchEff);
        //         this.unscheduleAllCallbacks(this);
        //     }
        // }.bind(this),0.1);
    },
*/

// ShowOtherCards (cardsInfo) {
    //     //新需求，需要把牌推出去
    //     //所以有牛的情况下，需要推出去的牌上面得有一个分开位置的动画
    //     //发牌的牌组仍然主管发牌，最后的显示交给 cards holder 牌专属显示容器

    //     ////选牛
    //     // message QZActNiuNiu {
    //     //     optional string playerId = 1;
    //     //     optional int32 niu = 2;      //0 无牛， 1-9 牛一 到 牛九， 10 牛牛
    //     //     repeated int32 showHand = 3;    //五张牌
    //     // }

    //     // var playerId = cardsInfo.get('playerId');
    //     // var idx = hxfn.battle.GetUISeatIdx(cardsInfo.get('playerId'));
        
    //     // cc.log('playerId: ' + playerId);
    //     // cc.log('idx: ' + idx);
    //     // //因为已经把牌发到了合适位置，所以直接显示，而不需要播动画
    //     // //而且因为showhand时候已经显示了当前自己玩家的最后一张牌，所以不需要再次显示
    //     // if(idx == null || idx <= 0){
    //     //     cc.log('[hxjs][err] can not find player id: ' + playerId);
    //     //     return;
    //     // }
        
    //     // // hxjs.module.ui.hub.ShowCom(this.conCards[(idx+1)*this.cardsCount - 1].node);
    //     // cc.log('idx: ' + idx);
    //     // var card = this.conCards[(idx+1)*this.cardsCount - 1];
    //     // //TEMP 由于最多5个玩家变成6个玩家
    //     // if(card != null)
    //     //     card.node.active = true;
        
    //     // var cards = cardsInfo.get('showHand');
    //     // for (var j = 0; j < cards.length/*should be 5/2/3 */; j++) {
    //     //     var cardid = cards[j];
    //     //     var card = hxfn.battle.GetCardPointInfo(cardid);
            
    //     //     hxjs.module.asset.LoadAtlasSprite(
    //     //         'cards',  
    //     //         + card['point'] + '_'+ card['suit'],
    //     //         this.conCards[idx*this.cardsCount + j]);
    //     // }
    // },