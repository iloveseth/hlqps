cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        btnHasNiu: cc.Button,
        btnNoNiu: cc.Button,
        
        //for 看牌抢庄
        conNiuCheck: cc.Node,//算有牛没有牛，变成亮牌与搓牌
        txtOpenTip:cc.Label,
        conCountPoint:cc.Node,
        txtHasNiuNotify: cc.Label,

        // isShowCardsPoint:{default: false, serializable: false, visible: false},

        // [nondisplay]
        //for 开牌抢庄
        isNiu:{default: false, serializable: false, visible: false},
        cardLst:{ default: [], serializable: false, visible: false},
        hasLight:{default: false, serializable: false, visible: false},
    },

    onLoad: function () {
        this.btnHasNiu.getComponent('UIButton').SetInfo(this.ClickOpenLastPoker.bind(this),'亮牌');
        // this.btnNoNiu.getComponent('UIButton').SetInfo(this.ClickRubPoker.bind(this),'搓牌');
        
        //为不同类型的玩法初始化
        // this.btnHasNiu.getComponent('UIButton').SetInfo(this.ClickHasNiu.bind(this),'有牛');
        // this.btnNoNiu.getComponent('UIButton').SetInfo(this.ClickNoNiu.bind(this),'没牛');
        //老需求：提示选牛
        // if(this.isShowCardsPoint) this.Init4KPQZ();

        this.OnInit();
        hxfn.adjust.AdjustLabel(this.node);
    },

    // ClickHasNiu:function(){
    //     if(!this.isNiu){
    //         //没牛的情况下，选择了有牛
    //         this.txtHasNiuNotify.string = '当前没有牛哦！';
    //     }
    //     else {
    //         this.InputNiu(true);
    //     }
    // },

    // ClickNoNiu:function(){
    //     if(this.isNiu){
    //         //提示有牛的情况下，选择了没牛
    //         this.txtHasNiuNotify.string = '当前是有牛的哦！';
    //     }
    //     else {
    //         this.InputNiu(false);
    //     }
    // },

    ClickOpenLastPoker:function (){
        if(this.hasLight)
        return;

        this.hasLight = true;

        // HACK
        /////////////////////////////////////////////////
        // this.OnReset();
        this.btnHasNiu.node.active = false;
        // this.btnNoNiu.node.active = false;

        //老需求：提示选牛
        // if(this.isShowCardsPoint) {
        //     this.conNiuCheck.active = false;
        //     this.txtHasNiuNotify.string ='';
        //     this.scr_score.OnReset();
        // }
        /////////////////////////////////////////////////


        var postData = {
            playerId:hxfn.role.playerId,
            open : true,
        };
        hxfn.net.Sync(
            postData,
            'QZInputRubPoker',
            hxdt.msgcmd.QZInputRubPoker,
        );

        hxjs.util.Notifier.emit('[NiuNiu]_BattleUI-LightCard');
        hxjs.util.Notifier.emit('UI_Battle_UpdateCDEventName', hxfn.battle_pinshi.Enum_EventCD.HasLightPoker);
    },
    
    // ClickRubPoker:function (){
    //     // 开启搓牌界面
    //     // 缓存必要的信息，供面板打开时进行初始化
    //     // var info = null;
    //     hxjs.module.ui.hub.LoadPanel('UI_Battle_RubPoker', null, hxjs.module.ui.hub.rootUI4Scene);
    // },
    
    // Init4KPQZ:function (){
    //         //拼点暂时
    //         this.cardLst = [-1, -1, -1, -1, -1];
    //         this.scr_score = this.conCountPoint.getComponent('UIBattle4CountNiuNiuPoint');
    //         //注册消息，处理点击牌面时的算分，最多为同时选择3张，有选择与取消选择的操作
    //         hxjs.util.Notifier.on('[NiuNiu]_BattleUI-SelectCard', this.SelectCard,this);
    // },

    InputNiu (hasNiu) {
        //立马关闭界面
        this.CheckHide();
        
        var postData = {
            niuniu : hasNiu,// optional bool niuniu = 1;       //false 输入没牛, true 输入有牛
        };
        hxfn.net.Sync(
            postData,
            'QZInputNiuNiu',
            hxdt.msgcmd.QZInputNiuNiu,
        );
    },

    OnInit:function () {
        cc.log('UIBattle4Open on init!');

        // this.Check4RubPoker();
        this.OnReset();
        // this.HandleNotify(true);
    },

    OnEnd () {
        // this.HandleNotify(false);
    },

    Check4RubPoker:function (){
        if(hxfn.battle_pinshi.isRubPoker){
            //直接弹搓牌界面，这里不需要处理
            this.btnHasNiu.node.active = false;
            
            // this.btnHasNiu.node.active = true;
            // this.btnNoNiu.node.active = true;

            //只有在搓牌模式弹
            hxfn.battle_pinshi.ShowRubPokerUI();
        }
        else {
            this.btnHasNiu.node.active = true;
            // this.btnNoNiu.node.active = false;
        }

    },

    OnReset() {
        this.hasLight = false;

        this.btnHasNiu.node.active = false;
        // this.btnNoNiu.node.active = false;

        //老需求：提示选牛
        // if(this.isShowCardsPoint) {
        //     this.conNiuCheck.active = false;
        //     this.txtHasNiuNotify.string ='';
        //     this.scr_score.OnReset();
        // }
    },

    // HandleNotify (isHandle) {
        //for 看牌抢庄 拼分数
        // if(isHandle) {
        //     hxjs.util.Notifier.on('UI_Battle_CheckNiu_SelectCard', this.SelectCard, this);
        // }
        // else {
        //     hxjs.util.Notifier.off('UI_Battle_CheckNiu_SelectCard', this.SelectCard, this);
        // }
    // },

    // SelectCard (info/*[cardid, idx, isSelect]*/) {
    //     var cardid = info[0];
    //     var idx = info[1];
    //     var isSelect = info[2];
    //     cc.log('@@@@@@@@@@@@@@ SelectCard cardid: ' + cardid + ' /idx: ' + idx + ' /isselect: ' + isSelect);
 
    //     //TODO 分数需要插入到合适的位置
    //     if(isSelect) {
    //         this.cardLst[idx] = cardid;
    //     }
    //     else {
    //         this.cardLst[idx] = -1;
    //     }

    //     var newPoint = hxfn.battle_pinshi.GetNiuNiuTotalScore(this.cardLst);
    //     // var newPoint = (function(arr){
    //     //     var a = 0;
    //     //     for (var i = 0; i < arr.length; i++) {
    //     //         var element = arr[i];
    //     //         if(element != -1)
    //     //         a+=hxfn.battle.GetCardPointInfo(element)['point'];
    //     //     }
    //     //     return a;
    //     // })(this.cardLst);

    //     this.scr_score.UpdateNiuNiuPanel(hxfn.battle_pinshi.GetVisualLst4NiuNiuScore(this.cardLst), newPoint);
    // },

    Show (info) {
        if(!hxfn.battle.hasPlayedCurGame)
        return;

        this.unscheduleAllCallbacks(this);
        
        //1，处理cd时间
        // 暂时用公共倒计时
        // this.scr_cder.SetCDStart(info.get('cdMS'));
        hxfn.comn.StartCD(info.get('cdMS')/1000);
        this.Check4RubPoker();

        this.scheduleOnce(function(){
            // this.ClickOpenLastPoker();
            this.OnReset();

            //搓牌倒计时：通知关闭搓牌界面（可能有弹出过）
            //cc.log('@@2');
            //hxjs.util.Notifier.emit('UI_Battle_CD4RunPokerOver');
        }.bind(this),info.get('cdMS')/1000);
        
        //老需求：提示选牛
        //this.Show_KPQZ(info);
    },
    Stop_Action(){
        this.unscheduleAllCallbacks(this);
    },
    //因为重连回来补发了showhand和TipNiuNiu
    // Show_Recover (){
    //     if(!hxfn.battle.hasPlayedCurGame)
    //     return;
        
    //     this.Check4RubPoker();
    //     // this.btnHasNiu.node.active = true;
    //     // this.btnNoNiu.node.active = true;
    // },




    // Show_KPQZ:function (info) {
    //     if(this.isShowCardsPoint) {
    //         this.conNiuCheck.active = true;

    //         //2，通知牌组可以操作
    //         hxjs.util.Notifier.emit('[NiuNiu]_BattleUI-EnableSelectCards', true);
            
    //         // //3-1，接受UI的操作来更新分数
    //         this.cardLst = [-1, -1, -1, -1, -1];
    //         // //3-2，
    //         var bestLst = info.get('best');
    //         this.isNiu = info.get('point') != 0;
    //         var totalScore = hxfn.battle_pinshi.GetNiuNiuTotalScore(bestLst);
    //         if(bestLst.length > 0){
    //             this.cardLst = hxfn.battle_pinshi.GetCardLstByNiuNiuBestLst(bestLst);
                
    //             //1, 更新分数
    //             this.scr_score.UpdateNiuNiuPanel(bestLst, totalScore/*info.get('point')*/);
    //             //2, 通知牌组管理UI更新牌的选中与未选中状态
    //             hxjs.util.Notifier.emit('[NiuNiu]_BattleUI-SelectBestCards', bestLst);
    //         }
    //     }
    // },

    

    CheckHide(){
        this.OnReset();

        // if(this.isShowCardsPoint) {
        //     hxjs.util.Notifier.emit('[NiuNiu]_BattleUI-EnableSelectCards', false);
        // }
    }
});