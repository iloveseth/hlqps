import { hxdt } from "../../../DT/HXDT";
import { hxfn } from "../../../FN/HXFN";
import { hxjs } from "../../../../HXJS/HXJS";

cc.Class({
    extends: cc.Component,

    properties: {
        lstResultNiuTip:cc.Node,
        scr_lstResultNiuTip:{ default: null, serializable: false, visible: false},
        lstResultNiuTip_Silence:cc.Node,
        scr_lstResultNiuTip_Silence:{ default: null, serializable: false, visible: false},

        
        scores:{ default: [], serializable: false, visible: false},
        // myScore:{ default: 0, serializable: false, visible: false},
        
        //for coin fly
        conCoinFly:cc.Node,
        loseidxLst:{ default: [], serializable: false, visible: false},
        winidxLst:{ default: [], serializable: false, visible: false},
        
        //有庄家的模式
        bankerIdx:{ default: -1, serializable: false, visible: false},
        //没有庄家，只有一个赢家的模式（比如拼十的通比玩法）
        justOneWinner:{ default: -1, serializable: false, visible: false},
        
        arrResultCon:[cc.Node],
        arrResult:{ default:null, serializable: false, visible: false},
    },
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onLoad: function () {
        hxfn.adjust.AdjustLabel(this.node);

        this.scr_lstResultNiuTip = this.lstResultNiuTip.getComponent('UILst');
        this.scr_lstResultNiuTip_Silence = this.lstResultNiuTip_Silence.getComponent('UILst');
        this.scr_coinFly = this.conCoinFly.getComponent('UIBattle5CoinFlyMgr');

        this.arrResult = new Array(hxdt.setting_niuniu.maxUISeats);

        for (let i = 0; i < hxdt.setting_niuniu.maxUISeats; i++) {
            this.Preload(i);
        }

        this.OnInit();
    },

    Preload:function (idx){
        hxjs.module.ui.hub.LoadPanel('UI_Item_Result',function(prefab){
            if(prefab != null){
                if(!hxfn.comn.HandleDelayLoadObj(prefab, hxdt.enum_game.Enum_GameState.Battle))
                    this.arrResult[idx] = prefab.getComponent('UIItemResult');
            }
        }.bind(this),this.arrResultCon[idx]);
    },

    OnInit:function () {
        cc.log('UIBattle5Result on init!');

        this.OnReset();
    },

    OnReset() {
        this.unscheduleAllCallbacks(this);

        this.scr_lstResultNiuTip.Reset();
        this.scr_lstResultNiuTip_Silence.Reset();
        
        this.arrResult.forEach(element => {
            if(element)
                element.ResetAll();
        });

        this.scr_coinFly.OnReset();

        // this.myScore = 0;
        this.scores = [];
        this.loseidxLst=[];
        this.winidxLst=[];
        this.bankerIdx = -1;
    },

    OnEnd () {
        // this.OnReset();
        this.unscheduleAllCallbacks(this);
        
        //清理预加载资源--------------------------------
        if(this.arrResult == null) return;
        
        this.arrResult.forEach(element => {
            if(element)
                hxjs.module.ui.hub.Unload(element.node);
        });

        this.arrResult = [];
    },

    onDestroy:function () {
        this.OnEnd();
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    
    ShowNiuNiuTip (ifo) {
        var idx = hxfn.battle.GetUISeatIdx(ifo.get('playerId'));
        var info = {};
        info['niu'] = ifo.get('niu');
        info['playerId'] = ifo.get('playerId');
        info['niumulti'] = ifo.get('niumulti');

        cc.log('ShowNiuNiuTip: ' + idx);
        this.scr_lstResultNiuTip.SetItem(idx, info);
    },

    ShowNiuNiuTip_Recover (idx, niu, mul){
        var info = {};
        info['niu'] = niu;
        info['playerId'] = hxfn.battle.uiRoles[idx].get('playerInfo').get('userData').get('playerId');
        info['niumulti'] = mul;

        cc.log('ShowNiuNiuTip_Recover: ' + idx);
        this.scr_lstResultNiuTip_Silence.SetItem(idx, info);
    },

    EndRing (info) {
        this.bankerIdx = hxfn.battle_pinshi.GetBankerIdx();

        //有庄家
        if(this.bankerIdx >=0) {
            this.HandleEndInfo(info);
            //0, （废弃）显示玩家自己的胜利失败动画
            // this.ShowMyselfAnim();
            //1, 飞金币
            this.ShowCoinFly();
            //2, 新需求，播放赢得金币的特效：金币到达时即显示特效，即庄家如果有赢得话就延时首个金币到达的时间，如果玩家赢的话就等第一组（如果有）结束之后+首个金币到达的时间
            this.ShowWinCoinEff();
        }
        //无庄家，只有一个赢家（比如拼十的通比玩法）
        else{
            this.HandleEndInfoWithoutBanker(info);
            this.ShowCoinFlyWithoutBanker();
            this.ShowWinCoinEffWithoutBanker();
        }

        //3, ShowScore
        var totalTime = this.GetAnimPhases() * hxdt.setting_niuniu.Time_ResultCoinFlyPerPhase;//hxdt.setting_niuniu.Time_HackTotleCoinFly;//
        //新需求，暂时分数和金币同时显示 // this.ShowScore();
        this.scheduleOnce(function(){
            this.ShowScore();
        }.bind(this),totalTime + hxdt.setting_niuniu.Time_HackDelayShowCoinEff);
    },

    HandleEndInfo:function (info) {
        this.scores = [];
        this.loseidxLst=[];
        this.winidxLst=[];

        let allinfos = info.get('playerRecords');

        for (let i = 0; i < allinfos.length; i++) {
            let element = allinfos[i];

            let pid = element.get('playerId');

            if(!hxfn.battle.CheckJoinedCurrentRingById(pid))
            continue;

            let pidx = hxfn.battle.GetUISeatIdx(pid);
            if (pidx === -1)
            continue;
            
            // Fix 正确处理分数的idx顺序
            let ringCoin = element.get('ringCoin');
            this.scores[pidx] = ringCoin;

            // if(pid === hxfn.role.playerId)
            //     this.myScore = element.get('ringCoin');

            // if(hxfn.battle_pinshi.IsBanker(pid)){
            //     this.bankerIdx = hxfn.battle.GetUISeatIdx(pid);
            // }
            

            if(!hxfn.battle_pinshi.IsBanker(pid)) {
                if(ringCoin<0){
                    this.loseidxLst.push(pidx);
                }
                else if(ringCoin>0){
                    this.winidxLst.push(pidx);
                }
            }
        }
    },

    HandleEndInfoWithoutBanker (info){
        this.scores = [];
        this.loseidxLst=[];

        let allinfos = info.get('playerRecords');

        for (let i = 0; i < allinfos.length; i++) {
            let element = allinfos[i];

            let pid = element.get('playerId');

            if(!hxfn.battle.CheckJoinedCurrentRingById(pid))
            continue;

            let pidx = hxfn.battle.GetUISeatIdx(pid);
            if (pidx === -1)
            continue;
            
            // Fix 正确处理分数的idx顺序
            let ringCoin = element.get('ringCoin');
            this.scores[pidx] = ringCoin;

            if(ringCoin > 0) {
                this.justOneWinner = pidx;
            }
            else if(ringCoin<0){
                this.loseidxLst.push(pidx);
            }
        }
    },

    //0, ----------------------------------------------------------------
    // 如果我参数本局，需要判断胜利和失败
    // ShowMyselfAnim:function(){
    //     this.scheduleOnce(function(){
    //         //如果有播放胜利失败动画，则需要判定当前玩家的输赢
    //         if(this.myScore === 0){
    //             if(hxfn.battle_pinshi.IsMeBanker())
    //                 this.ShowVictoryAnim ();
    //             else
    //                 cc.log('[hxjs][Err] no result coin data');
    //         }
    //         else if(this.myScore > 0){
    //             this.ShowVictoryAnim ();
    //         }
    //         else if(this.myScore < 0){
    //             this.ShowFailureAnim ();
    //         }
    //     }.bind(this),hxdt.setting_niuniu.Anim_Delay_Victory);
    // },

    // ShowVictoryAnim:function () {
    //     hxjs.module.ui.hub.TogglePanel(this.animV, 'UI_Battle_Result_Win','UIPanelAnim' , true, function(prefab){
    //         this.animV = prefab;
    //     }.bind(this), hxdt.setting_niuniu.Anim_Stay_Victory);

    //     this.scheduleOnce(function(){
    //         this.ShowCoinFly();
    //     }.bind(this),hxdt.setting_niuniu.Anim_Stay_Victory);
    // },

    // ShowFailureAnim:function () {
    //     hxjs.module.ui.hub.TogglePanel(this.animF, 'UI_Battle_Result_Lose','UIPanelAnim' , true, function(prefab){
    //         this.animF = prefab;
    //     }.bind(this), hxdt.setting_niuniu.Anim_Stay_Failure);
        
    //     this.scheduleOnce(function(){
    //         this.ShowCoinFly();
    //     }.bind(this),hxdt.setting_niuniu.Anim_Stay_Failure);
    // },

    //1, ----------------------------------------------------------------
    ShowCoinFly:function () {
        var flyGroups = this.GetFlyGroups();
        // cc.log('ShowCoinFly');
        // cc.log(this.loseidxLst);
        // cc.log(this.winidxLst);
        // cc.log(this.bankerIdx);
        // cc.log(flyGroups);
        this.scr_coinFly.SetInfo(flyGroups);
    },

    GetFlyGroups:function () {
        let poses = hxdt.setting_niuniu.SeatPoses;

        let flyLose = [];
        let posBanker = poses[this.bankerIdx];
        for (let i = 0; i < this.loseidxLst.length; i++) {
            let playeridx = this.loseidxLst[i];
            flyLose.push([poses[playeridx], posBanker]);//失败金币飞向: 闲家在前->庄家在后
        }

        let flyWin = [];
        for (let j = 0; j < this.winidxLst.length; j++) {
            let playeridx = this.winidxLst[j];
            flyWin.push([posBanker, poses[playeridx]]);//胜利金币飞向：庄家在前 -> 闲家在后
        }
        // flyLose = [[poses[1], poses[0]],[poses[4], poses[0]]];
        // flyWin = [[poses[0], poses[2]],[poses[0], poses[3]]];

        // 按照庄家先从输的玩家收取金币，再发给胜利的玩家
        let flyGroups = [];
        flyGroups.push(flyLose);
        flyGroups.push(flyWin);

        // cc.log("FlyCoin->"+JSON.stringify(flyGroups));
        return flyGroups;
    },

    ShowCoinFlyWithoutBanker:function () {
        var flyGroups = this.GetFlyGroupsWithoutBanker();
        this.scr_coinFly.SetInfo(flyGroups);
    },
    GetFlyGroupsWithoutBanker () {
        let poses = hxdt.setting_niuniu.SeatPoses;

        let flyLose = [];
        let posWinner = poses[this.justOneWinner];
        for (let i = 0; i < this.loseidxLst.length; i++) {
            let playeridx = this.loseidxLst[i];
            flyLose.push([poses[playeridx], posWinner]);//失败金币飞向
        }

        // 最大的玩家收取所有其他输家的金币
        let flyGroups = [];
        flyGroups.push(flyLose);

        return flyGroups;
    },

    //2, ----------------------------------------------------------------
    // 1和2的规则需要保持一致
    ShowWinCoinEff:function (){
        //1 处理庄家赢
        if(this.loseidxLst && this.loseidxLst.length > 0) {
            var delayTime1 = hxdt.setting_niuniu.Time_PerCoinFlyDuration;

            //一次金币达到时间之后，给庄家播放特效
            this.scheduleOnce(function(){
                if(this.arrResult[this.bankerIdx] != null)
                    this.arrResult[this.bankerIdx].ShowWinCoinEff();
            }.bind(this),delayTime1 + hxdt.setting_niuniu.Time_HackDelayShowCoinEff);
        }

        //2 处理玩家赢
        if(this.winidxLst && this.winidxLst.length > 0) {
            //默认值：如果庄家输给所有玩家
            var delayTime2 = hxdt.setting_niuniu.Time_PerCoinFlyDuration;
            //如果庄家赢过
            if(this.loseidxLst && this.loseidxLst.length > 0) {
                delayTime2 += hxdt.setting_niuniu.Time_ResultCoinFlyPerPhase;
            }

            this.scheduleOnce(function(){
                this.winidxLst.forEach(function(element) {
                    if(this.arrResult[element] != null)
                        this.arrResult[element].ShowWinCoinEff();
                }.bind(this), this);
            }.bind(this),delayTime2 + hxdt.setting_niuniu.Time_HackDelayShowCoinEff);
        }
    },

    ShowWinCoinEffWithoutBanker () {
        // 处理唯一赢家
        if(this.loseidxLst && this.loseidxLst.length > 0) {
            var delayTime1 = hxdt.setting_niuniu.Time_PerCoinFlyDuration;

            //一次金币达到时间之后，给庄家播放特效
            this.scheduleOnce(function(){
                if(this.arrResult[this.justOneWinner] != null)
                    this.arrResult[this.justOneWinner].ShowWinCoinEff();
            }.bind(this),delayTime1 + hxdt.setting_niuniu.Time_HackDelayShowCoinEff);
        }
    },

    //3, ----------------------------------------------------------------
    GetAnimPhases:function () {
        // 总时间为 = 胜利段 +　失败段
        var phases = 0;
        if(this.loseidxLst.length > 0)
            phases += 1;
        if(this.winidxLst.length > 0)
            phases += 1;

        return phases;
    },

    ShowScore:function () {
        // this.scr_lstResultScore.SetInfo(this.scores);
        for (let i = 0; i < this.arrResult.length; i++) {
            var element = this.arrResult[i];
            element.ShowScore(this.scores[i], i);
        }
    },
});