import { log } from "../../../../../HXJS/Util/Log";
import { hxfn } from "../../../../FN/HXFN";
import { hxdt } from "../../../../DT/HXDT";
import { hxjs } from "../../../../../HXJS/HXJS";

cc.Class({
    extends: cc.Component,

    properties: {
        //[display]
        conDispatch: cc.Node,
        conHolder: cc.Node,

        //[nondisplay]
        scrDispatch:{ default: null, serializable: false, visible: false},
        scrHolder:{ default: null, serializable: false, visible: false},

        curMyHandInfo:{ default: null, serializable: false, visible: false},
        hasShowMyHand:{ default: false, serializable: false, visible: false},
    },

    ///////////////////////////////////////////////////////////////////////////////////////////
    onLoad: function () {
        this.OnInit();
    },

    OnInit () {
        this.scrDispatch = this.conDispatch.getComponent('UIBattle0CardDispatch');
        this.scrHolder = this.conHolder.getComponent('UIBattle0CardHolder');
        
        if(this.scrDispatch)
            this.scrDispatch.OnInit();
        if(this.scrHolder)
            this.scrHolder.OnInit();

        hxjs.util.Notifier.on('[NiuNiu]_BattleUI-LightCard',this.ShowMyLastCard, this);
        hxfn.adjust.AdjustLabel(this.node);
    },

    OnReset(){
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器

        //------------------------------------------视觉对象
        if(this.scrDispatch)
        this.scrDispatch.OnReset();
        
        if(this.scrHolder)
        this.scrHolder.OnReset();
        
        this.OnClearBattleInsObjs();
        
        //------------------------------------------逻辑对象
        // this.curMyHandInfo = null;
        this.hasShowMyHand = false;
    },

    OnClearBattleInsObjs () {
        //HACK
        hxfn.comn.OnReset4RubPokerTimer();
        hxfn.battle_pinshi.ClearRubPokerUI();
    },

    OnEnd () {
        this.OnClearBattleInsObjs();

        // this.OnReset();
        hxjs.util.Notifier.off('[NiuNiu]_BattleUI-LightCard',this.ShowMyLastCard, this);
    },
    ///////////////////////////////////////////////////////////////////////////////////////////



    ActDispatch (info) {
        //1,发牌,给所有人发牌
        if(this.scrDispatch) {
            // this.scrDispatch.Dispatch(info);
            
            //统一发四张或者5张
            var dispatchCardsNum = 0;
            var myself = this.GetMyRoleInfo(info);
            if(myself) {
                var cards = myself.get('pokers');
                dispatchCardsNum = cards.length;
            }
            this.scrDispatch.DispatchNew(dispatchCardsNum);
        }

        //2，翻自己牌，两个阶段（拼十的特定实现）
        // this.ShowMyOriginCards();
        //new 如果有几张亮牌，则接着亮几牌)（通用）
        this.CheckShowOriginCards (info);
    },

    CheckShowOriginCards:function (info){
        //分两种情况 1，玩家自己牌 2，其他玩家牌

        //1 自己
        var myself = this.GetMyRoleInfo(info);
        if(myself) {
            var cards = myself.get('pokers');
            var cardsIdxToShow = hxfn.battle.CheckShowCardsIdx(cards);
            if(cardsIdxToShow.length > 0) {
                this.scheduleOnce(function(){
                    this.DelayToShowMy4(cards);
                }.bind(this),hxdt.setting_niuniu.Time_Anim_DispatchToShow4);
            }
        }
        else{
            log.error('Can not find role info by id: ' + hxfn.role.playerId);
        }

        //2 TODO
    },

    DelayToShowMy4 (cards){
        if(this.scrDispatch) {
            this.scrDispatch.HideMy4();
            // this.scrDispatch.HideRoleCurCards(myCardIdxs);
        }

        if(this.scrHolder) {
            this.scrHolder.ShowMy4(cards);
            this.scrHolder.SetInfo(cards);
        }
    },

    GetMyRoleInfo:function (info){
        //取得自己的信息
        var myself = null;

        //自己的牌需要设置信息
        var roles = info.get('dispatch');
        for (var i = 0; i < roles.length; i++) {
            var item = roles[i];
            if(item.get('playerId') === hxfn.role.playerId) {
                myself = item;
                break;
            }
        }
        return myself;
    },

    MakeSureAllCardsVisible(){
        this.scrDispatch.MakeSureAllCardsHide_My();
        this.scrHolder.MakeSureAllCardsHasShowed();
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    // info/*last info 包括最佳牌型，可能和之前的牌顺序不一样*/
    // 方案1：先保留老牌的基础上，显示老组合的最后一张牌，再做推牌效果
    ShowMyLastCardAuto (showHand, niu) {
        this.ShowMyLastCard();

        // 为了3+2 和 推牌
        if(this.scrHolder) {
            this.MakeSureAllCardsVisible();
            this.scrHolder.RefreshCards(showHand);//info.get('showHand')
            this.scrHolder.PushCard(niu);//info.get('niu')
        }
    },

    // 方案2：利用最新的牌组，显示最后一张牌，再做推牌效果
    ShowMyLastCardAuto_Recover (showHand, niu) {
        if(this.scrHolder)
        this.scrHolder.ShowMy4_Recover();//!!!

        if(this.scrHolder)
            this.scrHolder.RefreshCards(showHand);
        if(this.scrDispatch)
            this.scrDispatch.HideMyLast();
        if(this.scrHolder)
            this.scrHolder.ShowHandLast_Recover(showHand[4]);//最后一张牌
        
        // 为了3+2 和 推牌
        // this.scrHolder.PushCard(niu);//info.get('niu')
        
        if(this.scrHolder) {
            this.MakeSureAllCardsVisible();
            this.scrHolder.PushCard_Cover(niu);//info.get('niu')
        }
    },

    ShowMyLastCard:function () {//info/*last info 包括最佳牌型，可能和之前的牌顺序不一样*/
        if(this.hasShowMyHand)
            return;

        this.hasShowMyHand = true;
        if(this.scrDispatch)
            this.scrDispatch.HideMyLast();

        if(this.scrHolder != null) {
            this.scrHolder.ShowHandLast(this.curMyHandInfo);//.get('handPoker')
        }
    },

    ShowMyHand (info) {
        var handCards = info.get('handList');
        if(handCards && handCards.length > 0){
            this.ShowMyHandCards(handCards);
        }
        else {
            let lastCard = info.get('handPoker');
            if(lastCard && lastCard > 0) {
                this.ShowMyHandLast(lastCard);
            }
            else{
                log.error('No valid showhand info!');
            }
        }
    },

    //同时亮5张手牌(说明之前没有执行过翻牌动画)
    ShowMyHandCards (cards) {
        hxfn.battle.myAllCards= cards;

        if(hxfn.battle_pinshi.isRubPoker){
            //显示4张牌（隐藏发牌动作的4张背面牌）
            this.DelayToShowMy4(cards);

            //只有在搓牌模式弹
            // hxfn.battle_pinshi.ShowRubPokerUI();
        }
        else{
            // this.MakeSureAllCardsVisible();
            this.scrDispatch.MakeSureAllCardsHide_My();
            if(this.scrHolder) {
                this.scrHolder.ShowMy5(cards);
                this.scrHolder.SetInfo(cards);
            }
        }
    },

    //新需求是，最后一张牌的显示时机有
    //1，既没有搓牌，也没有亮牌，则最后ringend结算的时候显示
    //2，如果亮牌，则直接显示
    //3，如果搓牌，则搓完显示
    // ShowMyHand (info) {
    ShowMyHandLast (card) {
        //show my hand 意义有所转变，保留为搓牌做准备
        // this.curMyHandInfo = info.get('handPoker');
        this.curMyHandInfo = card;
        hxfn.battle.myAllCards[4]= this.curMyHandInfo;

        //发牌肯定都是同时的
        if(this.scrDispatch) {
            this.scrDispatch.DispatchAllLastCard();
        }

        if(hxfn.battle_pinshi.isRubPoker){
            //只有在搓牌模式弹
            // hxfn.battle_pinshi.ShowRubPokerUI();
        }
        //新需求:非搓牌模式下直接翻开牌/////////////////////////////////
        else{
            this.scheduleOnce(function(){
                this.ShowMyLastCard();
            }.bind(this),hxdt.setting_niuniu.Card_DispathDuration + hxdt.setting_niuniu.Card_DispathDelayToShow);
        }
        return;

        ////////////////////////////老需求////////////////////////////
        //由于保留了发牌时的最后一张牌为底牌，所以当显示手牌时由于使用的最后效果的正面牌，所以需要隐藏发牌时的底牌
        if(this.scrDispatch)
            this.scrDispatch.HideMyLast();
        if(this.scrHolder)
            this.scrHolder.ShowHandLast(card);
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    
    ShowOthersHand (info) {
        if(this.scrDispatch)
            this.scrDispatch.HideOtherCards(info);
        if(this.scrHolder)
            this.scrHolder.ShowOtherCards(info);//实现推牌
    },
    
    //牌组恢复的统一规则
    //////////////////////////////////////////////////////////////////////////////////////////
    //1，玩家自己=============================================
    //------只显示4张明牌
    Recover_My_Show4_Open(inhand){
        if(this.scrHolder){
            this.scrHolder.ShowMy4_Recover();
            this.scrHolder.SetInfo(inhand);
        }
    },
    //-------显示5张明牌（全：同时显示牌型）
    Recover_My_Show5With4_Open(inhand, niu){
        this.curMyHandInfo = inhand[4];
        this.ShowMyLastCardAuto_Recover (inhand, niu);
    },
    //-------显示4张明牌，1张暗牌
    Recover_My_Show4Hide1(inhand){
        this.curMyHandInfo = inhand[4];
        if(this.scrHolder){
            this.scrHolder.ShowMy4_Recover();
            this.scrHolder.SetInfo(inhand);
        }

        if(this.scrDispatch)
            this.scrDispatch.Dispatch5All_Recover(0);
    },

    //+++显示5张暗牌
    Recover_My_Show5_Close(idx){
        if(this.scrDispatch)
            this.scrDispatch.Dispatch5All_Recover_2(idx);
    },
    //+++直接显示5张明牌
    Recover_My_Show5_Open(inhand, niu){
        this.ShowMyHandCards(inhand);

        if(niu && niu>=0) {
            if(this.scrHolder) {
                this.MakeSureAllCardsVisible();
                this.scrHolder.PushCard_Cover(niu);
            }
        }
    },

    //2，其他玩家=============================================
    //-------显示4张暗牌
    Recover_Other_Show4_Close(idx){
        if(this.scrDispatch)
            this.scrDispatch.Dispatch4Others_Recover(idx);
    },
    //-------显示5张暗牌
    Recover_Other_Show5_Close(idx){
        if(this.scrDispatch)
            this.scrDispatch.Dispatch5All_Recover_2(idx);
    },
    Recover_Other_Show5_Open(idx, inhand, niu){
        if(this.scrHolder)
            this.scrHolder.ShowOtherCards_Cover(idx, inhand, niu);
    },

    //Old 看牌抢庄专有
    Recover (idx, inhand, niu) {
        if(inhand == null || inhand.length === 0 || idx < 0)
        return;

        //1,4张全背（他人）
        //2,4张显示（自己）

        //3,4张显1张背（自己）
        //4,5张全背（他人）
        //5,5张全显（所有人）


        //inhand手牌新规则：
        //1,如果牌值 = 0，表示牌背，否则显示正面牌值
        //2,根据长度显示牌的张数，如果为空或者长度为0不显示任何牌

        //1,玩家自己的规则
        //2,其他玩家的规则

        //牌显示有这么几个阶段
        //1.前四张牌（自己现实，其他人不显示）
        //2,前五张牌（所有人默认不显示，已经搓过牌的显示）
        //3,显示所有的牌
        if(idx === 0) {
            if(inhand.length ===4){
                //肯定全显示
                if(this.scrHolder){
                    this.scrHolder.ShowMy4_Recover();
                    this.scrHolder.SetInfo(inhand);
                }
            }
            else if(inhand.length ===5){
                if(hxfn.battle.CheckAllShowed(inhand)) {
                    this.curMyHandInfo = inhand[4];
                    this.ShowMyLastCardAuto_Recover (inhand, niu);
                }
                else{
                    //一定是显示4张背着一张
                    this.curMyHandInfo = inhand[4];
                    if(this.scrHolder){
                        this.scrHolder.ShowMy4_Recover();
                        this.scrHolder.SetInfo(inhand);
                    }

                    if(this.scrDispatch)
                        this.scrDispatch.Dispatch5All_Recover(idx);
                }
            }
        }
        else {
            if(inhand.length ===4){
                //肯定全背部
                if(this.scrDispatch)
                    this.scrDispatch.Dispatch4Others_Recover(idx);
            }
            else if(inhand.length ===5){
                //1,如果全背牌
                //2,如果全显示
                if(hxfn.battle.CheckAllShowed(inhand)) {
                    if(this.scrHolder)
                        this.scrHolder.ShowOtherCards_Cover(idx, inhand, niu);
                }
                else {
                    if(this.scrDispatch)
                        this.scrDispatch.Dispatch5All_Recover(idx);
                }
            }
        }
    },

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    Show5_Recover (idx, inhand, niu) {
        if(idx < 0) return;

        if(idx === 0) {
            this.curMyHandInfo = inhand[4];

            //如果是玩家自己
            // this.scrDispatch.DispatchMyLastCard();

            if(this.scrDispatch)
                this.scrDispatch.HideMyLast();
            // this.scrHolder.ShowHandLast(inhand);

            // 直接显示最终效果
            this.ShowMyLastCardAuto_Recover (inhand, niu);
        }
        else {
            //如果是其他玩家
            if(this.scrDispatch)
                this.scrDispatch.HideOtherCards_Cover(idx);
            if(this.scrHolder)
                this.scrHolder.ShowOtherCards_Cover(idx, inhand, niu);
        }
    },
    //-------------------------------------------------------------
    //发4张牌和发最后一张牌都是连续性的，所以可以一次性全部显示出来
    //-------------------------------------------------------------
    // Dispatch5_Recover (idx, inhand) {
    //     if(idx < 0) return;

    //     if(idx === 0) {
    //         cc.log('Recover: inhand: ');
    //         cc.log(inhand);

    //         this.curMyHandInfo = inhand[4];

    //         //如果是玩家自己,由于能看到前4张牌，所以(如果按正常发5张牌的效果，则需要隐藏已经发出的4张牌，否则不需要)
    //         // this.scrDispatch.HideCurRole();
    //         this.scrHolder.ShowMy4_Recover();
    //         this.scrHolder.SetInfo(inhand);
    //     }

    //     //自己的最后一张牌和其他人一样的操作，都是一开始蒙着不见得
    //     this.scrDispatch.Dispatch5All_Recover(idx);
    // },
    // Dispatch4_Recover (idx, inhand) {
    //     if(idx < 0) return;

    //     if(idx === 0) {
    //         cc.log('Recover: inhand: ');
    //         cc.log(inhand);

    //         this.curMyHandInfo = inhand[4];

    //         //2.
    //         //////////////////////////////////////////////////////
    //         //如果是玩家自己,不发牌，直接显示已有的四张手牌
    //         //由于没有经历发牌过程，所以相对正常流程，不需要隐藏发牌过程中的前4张牌
    //         // this.scrDispatch.HideCurRole();
    //         this.scrHolder.ShowMy4_Recover();
    //         // var cards = role.get('pokers');
    //         // cc.log(cards);
    //         this.scrHolder.SetInfo(inhand);
    //     }
    //     else {
    //         //如果是其他玩家
    //         //显示所有人的前4张牌
    //         this.scrDispatch.Dispatch4Others_Recover(idx);
    //     }
    // },
});


/*
// ShowMyOriginCards:function (){
    //     if(!hxfn.battle.hasPlayedCurGame)
    //         return;

    //     this.scheduleOnce(function(){
    //         //HACK???
    //         if(this.scrDispatch)
    //             this.scrDispatch.HideCurRole();
    //         if(this.scrHolder)
    //             this.scrHolder.ShowMy4();

    //         var myself = this.GetMyRoleInfo(info);
    //         if(myself != null){
    //             var cards = myself.get('pokers');
    //             if(this.scrHolder)
    //                 this.scrHolder.SetInfo(cards);
    //         } else{
    //             log.error('Can not find role info by id: ' + hxfn.role.playerId);
    //         }
    //     }.bind(this),hxdt.setting_niuniu.Time_Anim_DispatchToShow4);
    // },
*/