import { hxfn } from '../../../FN/HXFN';
import { enum_game } from '../../../DT/DD/Enum_Game';
import { hxjs } from '../../../../HXJS/HXJS';
import { log } from '../../../../HXJS/Util/Log';

cc.Class({
    extends: require('UIPanelSceneJS'),

    //考虑到离线重连可能在任何状态进行初始化，所有资源都必须完全加载好，不能采用延时加载的优化手段
    properties: {
        // [display]
        uiBattle0Comn: cc.Node,
        uiBattle0RoleMgr: cc.Node,
        uiBattle0EmptySeats:cc.Node,
        uiBattle1Waiting: cc.Node,

        //作为容器 异步加载----------------------------
        con1_Basic:cc.Node,
        con3_Hud:cc.Node,
        con0_CardMgr: cc.Node,
        con2_VieBanker: cc.Node,
        con3_Bet: cc.Node,
        con4_Open: cc.Node,
        con5_Result: cc.Node,
        //--------------------------------------------
        
        //[nondisplay]
        scr_1Basic:{default: null,serializable: false, visible: false},
        scr_3Hud:{default: null,serializable: false, visible: false},
        scr_0Comn:{default: null,serializable: false, visible: false},
        scr_conRoleMgr:{default: null,serializable: false, visible: false},
        scr_conCardMgr:{default: null,serializable: false, visible: false},
        scr_conEmptySeat:{default: null,serializable: false, visible: false},
        scr_aConWaiting: {default: null,serializable: false, visible: false},
        scr_bConVieBanker:{default: null,serializable: false, visible: false},
        scr_cConBet:{default: null,serializable: false, visible: false},
        scr_dConOpen:{default: null,serializable: false, visible: false},
        scr_eConResult:{default: null,serializable: false, visible: false},
        
        isLoadBasic:{default: false,serializable: false, visible: false},
        isLoadHud:{default: false,serializable: false, visible: false},
        isLoadThis:{default: false,serializable: false, visible: false},
        isLoad0Card:{default: false,serializable: false, visible: false},
        isLoad2:{default: false,serializable: false, visible: false},
        isLoad3:{default: false,serializable: false, visible: false},
        isLoad4:{default: false,serializable: false, visible: false},
        isLoad5:{default: false,serializable: false, visible: false},
        
        //是否为进入后的第一局结束之后的局
        // isContinuePlay:{default: false, serializable: false, visible: false},
        
        root4Eff:cc.Node,
        gConChat:cc.Node,

        //双保险:每一局结束：EndRing /和/ 下一局开始Countdown, 两处检测做清理；确保新的一局表现正常
        //原因：EndRing之后有一段时间为纯客户端的表现，在表现之后由客户端进行数据与表现的重置与清理,这一行为并不完全安全!!!
        hasEndReal:{default:false, serializable:false, visible:false},
    },
    
    ///////////////////////////////////////////////////////////////////////////////
    onLoad: function () {
        hxfn.adjust.AdjustLabel(this.node);

        this.OnInit();
        // cc.log('UIUIUIUIUIUIUIUIUIUI get component time: ' + hxjs.util.timer.GetCurTime_S());
    },

    OnInit () {
        // 1,初始化静态放置类型界面显示,全部由子级对象管理
        // this.HandleLayout(true);
    },
    
    start: function () {
        // 2,初始化子级功能脚本对象
        this.HandleSubFn(true);
        // 3,初始化消息注册
        this.HandleNotify(true);
        
        //在start被调用时，确保为真正的加载并初始化默认状态的完成标记！！！
        //HACK 
        hxjs.uicontroller.RegistSceneUI(this);
        this.isLoadThis = true;
        this.CheckDelayLoadComplete();
    },

    update: function (dt) {
        // TEST
        // if(this.scr_conRoleMgr == null) {
        //     cc.log('UIUIUIUIUIUIUIUIUIUI get component time: ' + hxjs.util.timer.GetCurTime_S());
        //     cc.log('surprise');
        // }
    },

    //计划用来在当前场景，重连静默恢复状态！！！！！！
    OnReset:function () {
        this.ClearInstantObjs();
        this.ClearLastingObjs();
    },

    ClearLastingObjs () {
        if(this.scr_conRoleMgr)
            this.scr_conRoleMgr.OnReset();
    },
    //为每局的开始做清理！！！！！！！！！！！！！！！
    //清理的是牌局中的临时表现
    ClearInstantObjs:function () {
        this.unscheduleAllCallbacks(this);

        if(this.scr_0Comn)
            this.scr_0Comn.OnReset();

        //玩家为常驻表现，不能强制清理！！！
        // this.scr_conRoleMgr.OnReset();

        if(this.scr_1Basic != null)
            this.scr_1Basic.OnReset();

        if(this.scr_3Hud != null)
            this.scr_3Hud.OnReset();

        if(this.scr_conCardMgr != null)
            this.scr_conCardMgr.OnReset();

        if(this.scr_aConWaiting)
            this.scr_aConWaiting.OnReset();

        if(this.scr_bConVieBanker != null)
            this.scr_bConVieBanker.OnReset();

        if(this.scr_cConBet != null)
            this.scr_cConBet.OnReset();

        if(this.scr_dConOpen != null)
            this.scr_dConOpen.OnReset();

        if(this.scr_eConResult != null)
            this.scr_eConResult.OnReset();

        hxfn.battle_pinshi.CachePlayersHasActNiuNiu = [];
    },

    OnEnd:function(){
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
        
        this.isLoadThis = false;
        // this.isContinuePlay = false;
        this.HandleNotify(false);
        // this.HandleLayout(false);
        this.HandleSubFn(false);

        hxfn.battle_pinshi.CachePlayersHasActNiuNiu = [];
    },

    onDestory: function () {
        this.OnEnd();
    },
    ///////////////////////////////////////////////////////////////////////////////

    HandleSubFn (isHandle) {
        if(isHandle) {
            //1,直接嵌入
            this.scr_0Comn = this.uiBattle0Comn.getComponent('UIBattle0Comn');
            this.scr_conEmptySeat = this.uiBattle0EmptySeats.getComponent('UIBattle0EmptySeat'); 
            this.scr_conRoleMgr = this.uiBattle0RoleMgr.getComponent('UIBattle0RoleMgr');
            this.scr_aConWaiting = this.uiBattle1Waiting.getComponent('UIBattle1Waiting');
            
            if(this.scr_0Comn)
            this.scr_0Comn.OnInit();
            if(this.scr_conEmptySeat)
            this.scr_conEmptySeat.OnInit();
            if(this.scr_aConWaiting)
            this.scr_aConWaiting.OnInit();
            if(this.scr_conRoleMgr)
            this.scr_conRoleMgr.OnInit();
            
            //2,异步加载
            //（XXX 优化：延时加载) 为了保证表现的完备性，需等待全部加载完成！！！
            //拆分仍有必要的好处是：方便维护！！！
            //0 通用
            hxjs.module.ui.hub.LoadPanel('UI_Battle_NiuNiu_Basic', function(prefab){
                this.scr_1Basic = prefab.getComponent('UIBattleBasic');
                this.isLoadBasic = true;
                this.CheckDelayLoadComplete();

                if(prefab != null){
                    if(hxfn.comn.HandleDelayLoadObj(prefab, 3/*Enum_GameState.Battle*/))
                        this.isLoadBasic = false;
                }
            }.bind(this),this.con1_Basic);

            hxjs.module.ui.hub.LoadPanel('UI_Battle_NiuNiu_Hud', function(prefab){
                this.scr_3Hud = prefab.getComponent('UIBattleHud');
                this.isLoadHud = true;
                this.CheckDelayLoadComplete();

                if(prefab != null){
                    if(hxfn.comn.HandleDelayLoadObj(prefab, 3/*Enum_GameState.Battle*/))
                        this.isLoadHud = false;
                }
            }.bind(this),this.con3_Hud);

            hxjs.module.ui.hub.LoadPanel('UI_Battle_0CardMgr', function(prefab){
                this.scr_conCardMgr = prefab.getComponent('UIBattle0CardMgr');
                this.isLoad0Card = true;
                this.CheckDelayLoadComplete();

                if(prefab != null){
                    if(hxfn.comn.HandleDelayLoadObj(prefab, 3/*Enum_GameState.Battle*/))
                        this.isLoad0Card = false;
                }
            }.bind(this),this.con0_CardMgr);

            //2 抢庄
            hxjs.module.ui.hub.LoadPanel('UI_Battle_2VieBanker', function(prefab){
                this.scr_bConVieBanker = prefab.getComponent('UIBattle2VieBanker');
                this.isLoad2 = true;
                this.CheckDelayLoadComplete();

                if(prefab != null){
                    if(hxfn.comn.HandleDelayLoadObj(prefab, 3/*Enum_GameState.Battle*/))
                        this.isLoad2 = false;
                }
            }.bind(this),this.con2_VieBanker);
            //3 下注
            hxjs.module.ui.hub.LoadPanel('UI_Battle_3Bet', function(prefab){
                this.scr_cConBet = prefab.getComponent('UIBattle3Bet');
                this.isLoad3 = true;
                this.CheckDelayLoadComplete();

                if(prefab != null){
                    if(hxfn.comn.HandleDelayLoadObj(prefab, 3/*Enum_GameState.Battle*/))
                        this.isLoad3 = false;
                }
            }.bind(this),this.con3_Bet);
            //4 打开
            hxjs.module.ui.hub.LoadPanel('UI_Battle_4Open', function(prefab){
                this.scr_dConOpen = prefab.getComponent('UIBattle4Open');
                this.isLoad4 = true;
                this.CheckDelayLoadComplete();

                if(prefab != null){
                    if(hxfn.comn.HandleDelayLoadObj(prefab, 3/*Enum_GameState.Battle*/))
                        this.isLoad4 = false;
                }
            }.bind(this),this.con4_Open);
            //5 战斗结果
            hxjs.module.ui.hub.LoadPanel('UI_Battle_5Result', function(prefab){
                this.scr_eConResult = prefab.getComponent('UIBattle5Result');
                this.isLoad5 = true;
                this.CheckDelayLoadComplete();

                if(prefab != null){
                    if(hxfn.comn.HandleDelayLoadObj(prefab, 3/*Enum_GameState.Battle*/))
                        this.isLoad5 = false;
                }
            }.bind(this),this.con5_Result);
            
            hxfn.battle.LoadChatUI('UI_Battle_Chat');
        }
        else {
            if(this.scr_1Basic != null)
                this.scr_1Basic.OnEnd();

            if(this.scr_3Hud != null)
                this.scr_3Hud.OnEnd();

            if(this.scr_0Comn != null)
                this.scr_0Comn.OnEnd();

            if(this.scr_aConWaiting != null)
                this.scr_aConWaiting.OnEnd();

            if(this.scr_conRoleMgr != null)
                this.scr_conRoleMgr.OnEnd();

            if(this.scr_conCardMgr != null)
                this.scr_conCardMgr.OnEnd();

            if(this.scr_bConVieBanker != null)
                this.scr_bConVieBanker.OnEnd();

            if(this.scr_cConBet != null)
                this.scr_cConBet.OnEnd();

            if(this.scr_dConOpen != null)
                this.scr_dConOpen.OnEnd();

            if(this.scr_eConResult != null)
                this.scr_eConResult.OnEnd();

            //即时加载嵌入的对象处理////////////////////////////////////
            // 对于延时加载的对象，必须显式卸载

            if(this.scr_1Basic&&this.scr_1Basic.node)
            hxjs.module.ui.hub.Unload(this.scr_1Basic.node);

            if(this.scr_3Hud&&this.scr_3Hud.node)
            hxjs.module.ui.hub.Unload(this.scr_3Hud.node);

            if(this.scr_conCardMgr&&this.scr_conCardMgr.node)
            hxjs.module.ui.hub.Unload(this.scr_conCardMgr.node);
            
            if(this.scr_bConVieBanker&&this.scr_bConVieBanker.node)
            hxjs.module.ui.hub.Unload(this.scr_bConVieBanker.node);

            if(this.scr_cConBet&&this.scr_cConBet.node)            
            hxjs.module.ui.hub.Unload(this.scr_cConBet.node);
            
            if(this.scr_dConOpen&&this.scr_dConOpen.node)            
            hxjs.module.ui.hub.Unload(this.scr_dConOpen.node);
            
            if(this.scr_eConResult&&this.scr_eConResult.node)            
            hxjs.module.ui.hub.Unload(this.scr_eConResult.node);

            this.isLoadBasic = false;
            this.isLoadHud = false;
            this.isLoad0Card = false;
            this.isLoad2 = false;
            this.isLoad3 = false;
            this.isLoad4 = false;
            this.isLoad5 = false;

            hxfn.battle.UnloadChatUI();
        }
    },
        
    HandleNotify (isHandle) {
        cc.log("HandleNotify isHandle: " + isHandle);

        if(isHandle) {
            ////////////////////////////////////////////////////////////////////////////////////////
            // 恢复现场，静默处理
            //第一部分：显示信息
            //全局：CD
            hxjs.util.Notifier.on('Battle_Recover_0CD', this.Recover_0_CD, this);
            //全局：显示牌的状态
            hxjs.util.Notifier.on('Battle_Recover_0Cards', this.Recover_0Cards, this);
            //2,庄家
            hxjs.util.Notifier.on('Battle_Recover_2Banker_QZRatio', this.Recover_2_QZRatio, this);
            //2,根据当前阶段，判定是否显示抢庄倍数，如果有庄家，则庄家一定显示
            hxjs.util.Notifier.on('Battle_Recover_2Banker_SureBanker', this.Recover_2_SureBanker, this);
            //3,下注倍数，一直保留到当前牌局结束
            hxjs.util.Notifier.on('Battle_Recover_3Chipin_Ratio', this.Recover_3_ChipinRatio, this);
            //5,牌型结果
            hxjs.util.Notifier.on('Battle_Recover_5Result_NiuTip', this.Recover_5_ResultNiuTip, this);
            
            //第二部分：显示操作
            //1，显示抢庄面板
            hxjs.util.Notifier.on('Battle_Recover_Input_2Banker', this.Recover_Input_2Banker, this);
            //2, 显示下注面板
            hxjs.util.Notifier.on('Battle_Recover_Input_3Chipin', this.Recover_Input_3Chipin, this);
            //3，显示亮牌搓牌面板
            // hxjs.util.Notifier.on('Battle_Recover_Input_4Open', this.Recover_Input_4Open, this);

            //Client------------------------------------------------------------------------------------------------
            //初始化已经获取到的本人玩家的基本信息 -> Hud
            hxjs.util.Notifier.on('Battle_ReadyData', this.RealStart, this);
            //开局等待玩家加入
            hxjs.util.Notifier.on('Battle_Check_WaitOtherOne', this.WaitOtherOne, this);
            //是否需要等待当前一局完成再开始玩
            hxjs.util.Notifier.on('UI_Battle_UpdateCDEventName', this.UpdateCurCDNotifyMsg, this);
        }
        else {
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            //恢复现场，静默处理
            //第一部分：显示信息
            hxjs.util.Notifier.off('Battle_Recover_0CD', this.Recover_0_CD, this);
            hxjs.util.Notifier.off('Battle_Recover_0Cards', this.Recover_0Cards, this);
            
            hxjs.util.Notifier.off('Battle_Recover_2Banker_QZRatio', this.Recover_2_QZRatio, this);
            hxjs.util.Notifier.off('Battle_Recover_2Banker_SureBanker', this.Recover_2_SureBanker, this);
            hxjs.util.Notifier.off('Battle_Recover_3Chipin_Ratio', this.Recover_3_ChipinRatio, this);
            hxjs.util.Notifier.off('Battle_Recover_5Result_NiuTip', this.Recover_5_ResultNiuTip, this);
            
            //第二部分：交互操作
            hxjs.util.Notifier.off('Battle_Recover_Input_2Banker', this.Recover_Input_2Banker, this);
            hxjs.util.Notifier.off('Battle_Recover_Input_3Chipin', this.Recover_Input_3Chipin, this);
            // hxjs.util.Notifier.off('Battle_Recover_Input_4Open', this.Recover_Input_4Open, this);
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            
            //Client------------------------------------------------------------------------------------------------
            hxjs.util.Notifier.off('Battle_ReadyData', this.RealStart, this);
            hxjs.util.Notifier.off('Battle_Check_WaitOtherOne', this.WaitOtherOne, this);
            hxjs.util.Notifier.off('UI_Battle_UpdateCDEventName', this.UpdateCurCDNotifyMsg, this);
        }
    },

    //////////////////////////////////////////////////////////////////////////////////////////////
    SetOriginalPlayers:function () {
        //player携带的以下信息需要处理，根据当前的阶段，直接显示/静默处理（这里拿到的必定是历史数据）
        if(this.scr_conRoleMgr != null)
            this.scr_conRoleMgr.SetOriginalPlayers();
    },
    SyncPlayerJoinRoom:function(info) {
        if(this.scr_conRoleMgr != null)
            this.scr_conRoleMgr.SyncPlayerJoinRoom(info.get('qzPlayer'));
    },
    SyncPlayerLost:function(info) {
        if(this.scr_conRoleMgr != null)
            this.scr_conRoleMgr.SyncPlayerLost(info.get('playerId'));
    },
    SyncPlayerQuitRoom:function(info) {
        //如果是自己被Quit，则退出房间(直接退，不请求)
        //!!!!!!理论上来说是会被踢出，而不是自己来退出
        //HACK
        var playerid = info.get('playerId');
        if(playerid === hxfn.role.playerId) {
            // hxjs.util.Notifier.emit('UI_BattleQuit');
            hxfn.battle.QuitNormal();
        }
        else {
            if(this.scr_conRoleMgr)
                this.scr_conRoleMgr.SyncPlayerQuitRoom(playerid);
            //清理已准备
            if(this.scr_aConWaiting)
                this.scr_aConWaiting.ClearReadyFlag(playerid);

            hxfn.battle.RmvRole(playerid);
        }
    },

    //////////////////////////////////////////////////////////////////////////////////////////////
    // 开局倒数
    QZSyncRingCountdown:function (info) {
        //再做一次牌局状态重置与表现清理 20180115
        if(!this.hasEndReal) {
            log.warn('!!! RingEndReal when QZSyncRingCountdown!');
            this.RingEndReal();
        }

        //THINKING 2017 12 16
        // // 安全的做法在这里再次确认一次清理（根据是否是第一局之后的局），不能在开头重置，因为有可能中途切回战斗来的！！！
        // this.Clear4Start();
        // if(this.isContinuePlay) {
        //     //清理上次战斗过程中留下的对象
        //     this.ClearInstantObjs();
        // }
            
        if(this.scr_aConWaiting)
            this.scr_aConWaiting.CheckReadyBtn();//HasReady();
            
        var cdMax = info.get('cdMS');
        if(this.scr_0Comn)
            this.scr_0Comn.SetCDStart(cdMax, hxfn.battle_pinshi.Enum_EventCD.Start);
    },
    QZSyncRingCDBreak:function (info) {
        //只发给当前玩家本人
        if(this.scr_aConWaiting)
            this.scr_aConWaiting.CheckReadyBtn();

        if(this.scr_0Comn)
            this.scr_0Comn.ResetCDToStart();
    },

    SyncPlayerReady:function (info) {
        var pid = info.get('qzPlayer').get('playerInfo').get('userData').get('playerId');
        if(this.scr_aConWaiting)
            this.scr_aConWaiting.SetReady(pid);
    },

    Room_Start:function (info) {
        // Fix: 开始游戏之后仍然可以邀请好友
        // if(hxfn.map.curRoomTyp == 1/*筹码房*/){
        //     this.scr_conEmptySeat.Hide();
        // }

        // Resign: 取消牌局开始提示动画
        // this.scr_aConWaiting.PlayStartEff();

        if(this.scr_aConWaiting)
            this.scr_aConWaiting.RingBegin();
        
        if(this.scr_0Comn)
            this.scr_0Comn.OnReset();
    },
    // Room_End:function () {},


    //////////////////////////////////////////////////////////////////////////////////////////////
    Game_ActDispatch:function (info) {
        if(this.scr_conCardMgr!= null)
            this.scr_conCardMgr.ActDispatch(info);
    },

    //提示抢庄
    Game_TipVieBanker:function (info) {
        if(this.scr_0Comn!= null)
            this.scr_0Comn.SetCDStart(info.get('cdMS'), hxfn.battle_pinshi.Enum_EventCD.BankerVie);
        
        if(this.scr_bConVieBanker!= null)
            this.scr_bConVieBanker.TipVieBanker(info.get('TipVieBankerMulti'),info.get('maxLimit'));
    },
    Game_ActVieBanker:function (info) {
        if(this.scr_bConVieBanker)
            this.scr_bConVieBanker.ShowVieRatioTip(info);
    },
    Game_ActBanker:function (info) {
        // cc.log('UIUIUIUIUIUIUIUIUIUI Game_ActBanker time: ' + hxjs.util.timer.GetCurTime_S());
        if(this.scr_0Comn)
            this.scr_0Comn.SetCDOver();

        if(this.scr_bConVieBanker)
            this.scr_bConVieBanker.SetBanker(info);
    },

    Game_TipChipin:function (info) {
        // cc.log('UIUIUIUIUIUIUIUIUIUI Game_TipChipin time: ' + hxjs.util.timer.GetCurTime_S());
        if(!hxfn.battle_pinshi.IsMeBanker()) {
            if(this.scr_0Comn)
                this.scr_0Comn.SetCDStart(info.get('cdMS'), hxfn.battle_pinshi.Enum_EventCD.Chipin);

            if(this.scr_cConBet)
                this.scr_cConBet.ShowChipinPanel(info.get('TipChipinMulti'), info.get('maxLimit'), info.get('cdMS'));
        }
        else {
            if(this.scr_0Comn)
                this.scr_0Comn.SetCDStart(info.get('cdMS'), hxfn.battle_pinshi.Enum_EventCD.HasChipin);
        }
    },

    Game_ActChipin:function (info) {
        if(this.scr_cConBet!= null)
            this.scr_cConBet.ShowRatio(info);
    },

    Game_ActShowHand:function (info) {
        //只有玩家自己 才会收到显示手牌通知
        if(!hxfn.battle.hasPlayedCurGame)
            return;

        // this.scr_0Comn.SetCDOver();
        if(this.scr_cConBet)
            this.scr_cConBet.SetOver();

        if(this.scr_conCardMgr)
            this.scr_conCardMgr.ShowMyHand(info);
    },

    Game_TipNiuNiu:function (info) {
        if(this.scr_0Comn)
            this.scr_0Comn.SetCDStart(info.get('cdMS'), hxfn.battle_pinshi.Enum_EventCD.LightPoker);
        
        if(this.scr_dConOpen)
            this.scr_dConOpen.Show(info);
    },

    Game_QZTipRubPoker:function (info) {
        this.Game_TipNiuNiu(info);
    },

    Game_ActNiuNiu:function (info) {
        //玩家不在牌局中不显示倍数
        if(info == null || !hxfn.battle.CheckJoinedCurrentRingById(info.get('playerId')))
            return;

        //HACK*************
        // info.niu = 15;
        //*****************

        //记录已经亮过牌的玩家
        if(!(hxfn.battle_pinshi.CachePlayersHasActNiuNiu.indexOf(info.get('playerId'))>=0))
            hxfn.battle_pinshi.CachePlayersHasActNiuNiu.push(info.get('playerId'));

        //当玩家亮分数时，肯定已经关闭亮牌倒计时
        //TODO//新的设计里，不需要包括玩家自己？？？
        if(info.get('playerId') === hxfn.role.playerId){
            //XXX 关闭亮牌倒计时
            //不能关闭，继续等待其他玩家亮牌倒计时
            //this.scr_0Comn.SetCDOver();

            // this.scr_dConOpen.ClickOpenLastPoker();
            if(this.scr_dConOpen)
                this.scr_dConOpen.Stop_Action();
            // 只有自己的操作面板才关闭
            if(this.scr_dConOpen)
                this.scr_dConOpen.CheckHide();
            
            //如果搓牌模式，则即可关闭搓牌
            if(hxfn.battle_pinshi.isRubPoker) {
                hxfn.battle_pinshi.ClearRubPokerUI();
            }

            //打开最后一张牌
            if(this.scr_conCardMgr)
                this.scr_conCardMgr.ShowMyLastCardAuto (info.get('showHand'), info.get('niu'));
            // this.scr_conCardMgr.ShowMyLastCard ();
        }
        else {
            if(this.scr_conCardMgr)
                this.scr_conCardMgr.ShowOthersHand(info);
        }

        if(this.scr_eConResult)
            this.scr_eConResult.ShowNiuNiuTip (info);
    },

    Game_SyncRingEnd:function (info) {
        if(this.scr_0Comn)
            this.scr_0Comn.SetCDOver();

        if(this.scr_eConResult)
            this.scr_eConResult.EndRing (info);

        cc.log('info.nextRingDelay: ' + info.nextRingDelay);
        this.hasEndReal = false;
        this.scheduleOnce(function(){ 
            this.RingEndReal();
        }.bind(this), info.nextRingDelay);
    },
    
    //逻辑重置在ringend的时候就生效
    //这里是纯重置表现
    RingEndReal:function (){
        hxfn.battle.isBattlePlaying = false;
        this.ClearInstantObjs();

        //////////////////////////////////////////////////////////////////
        //必须写在这里，不能写在开头，因为有可能中途切回战斗来的！！！
        // this.isContinuePlay = true;
        
        //将所有观战中的玩家状态设置为加入本局
        hxfn.battle.ResetAllPlayersJoinCurrentRingState();
        
        //真正结束本局需要在ringEnd表现完成之后
        hxfn.battle.hasPlayedCurGame = true;

        //重置角色头像的观战中状态标识
        hxjs.util.Notifier.emit('UI_Battle_RecoverJoinedStatus');
        ////////////////////////////////////////////////////////////////////

        //如果即将加入下一局，则取消等待加入游戏中状态的ui表现！！！
        if(this.scr_0Comn)
            this.scr_0Comn.HandleWaitJoin();
        
        hxfn.battle_pinshi.CachePlayersHasActNiuNiu = [];

        // 20180118 似乎一下逻辑有误 --------------------------------
        // //重连回来不应该有以下情况
        // //如果房间内只剩玩家自己，则下一局不会开始，所以必须找到一个依据来清理战斗过程中产生的视觉对象
        // var isWaitAnyJoin = hxfn.battle.IsJustMyself();
        // if(isWaitAnyJoin) this.ClearInstantObjs();
        //----------------------------------------------------------

        //如果房间内只剩玩家自己，则下一局不会开始，确保显示等待其他人的状态
        hxfn.battle.CheckWaitAnyJoin();

        this.hasEndReal = true;
    },

    Game_SyncRoomCoin:function (info) {
        if(this.scr_conRoleMgr)
            this.scr_conRoleMgr.SyncRoomCoin(info);
    },

    Recover_RingEnd(){
        this.RingEndReal();
    },

    //！！！战斗恢复
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //静默处理房间战斗状态
    //0 显示倒计时
    Recover_0_CD:function (arr){
        //1:cd 2:typ
        if(this.scr_0Comn)
        this.scr_0Comn.SetCDStart(arr[0], arr[1]);
    },
    //1 显示牌各个阶段信息
    Recover_0Cards:function(arr) {
        if(this.scr_conCardMgr != null)
            this.scr_conCardMgr.Recover(arr[0], arr[1], arr[2]);
    },

    //确定庄家前，显示倍数，确定庄家之后则不会收到这条恢复消息
    Recover_2_QZRatio:function(arr) {
        if(this.scr_bConVieBanker != null)
            this.scr_bConVieBanker.ShowRatioTip_Recover(arr[0], arr[1]);
    },
    //显示庄家
    Recover_2_SureBanker:function(arr) {
        if(this.scr_bConVieBanker != null)
            this.scr_bConVieBanker.SureBanker_Recover(arr[0], arr[1]);
    },
    Recover_3_ChipinRatio:function(arr) {
        if(this.scr_cConBet != null)
            this.scr_cConBet.ShowRatio_Recover(arr[0], arr[1]);
    },
    Recover_5_ResultNiuTip:function (arr){
        // arr[0], arr[1], arr[2]
        // idx, inhand, niu
        if(this.scr_eConResult != null)
            this.scr_eConResult.ShowNiuNiuTip_Recover(arr[0], arr[2], arr[3]/*倍数*/);

        //显示手牌
        //模拟 Game_ActNiuNiu
        if(this.scr_conCardMgr != null)
            this.scr_conCardMgr.Show5_Recover(arr[0], arr[1], arr[2]);
    },

    //2 弹出操作面板------------------------------------------------------------
    Recover_Input_2Banker:function(arr) {
        if(this.scr_bConVieBanker != null)
            this.scr_bConVieBanker.TipVieBanker(arr[0],arr[1]);
    },
    Recover_Input_3Chipin:function(arr) {
        if(this.scr_cConBet != null)
            this.scr_cConBet.ShowChipinPanel(arr[0], arr[1]);
    },
    Recover_Input_4Open:function(arr) {
        if(this.scr_dConOpen != null)
            this.scr_dConOpen.Show_Recover();
    },

    
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    CheckDelayLoadComplete:function (){
        if(this.isLoad0Card && this.isLoad2 && this.isLoad3 &&this.isLoad4 &&this.isLoad5 && this.isLoadThis && this.isLoadBasic && this.isLoadHud){
            hxfn.battle.Regist_Main(this, this.root4Eff,this.gConChat);
            
            this.InitComplete();
        }
    },

    //当所有数据初始化，并缓存好之后调用的真实数据初始化方法
    RealStart:function(){
        if(this.scr_1Basic)  this.scr_1Basic.OnStartReal();
        if(this.scr_3Hud) this.scr_3Hud.OnStartReal();

        this.HandleRoomType();
        this.SetOriginalPlayers();
        
        //如果中途加入处于结算阶段，则需要重置一些变量
        if(hxfn.battle.gamePhase == hxfn.battle_pinshi.Enum_GamePhase.Finish) {
            this.Recover_RingEnd();
        }
        // if( battle.roomPhase >= hxfn.battle_pinshi.Enum_RoomPhase.RingBegin){
        //     this.ClearInstantObjs();
        //     this.isContinuePlay = true;
        // }

        this.CheckJoinCurrentRing();
        this.CheckWaitingReadyBtn();
        hxfn.battle.CheckWaitAnyJoin();

        this.hasEndReal = true;
    },

    HandleRoomType:function () {
        //0金币， 1筹码
        if(hxfn.map.curRoomTyp === 0){
            if(this.scr_conEmptySeat)
                this.scr_conEmptySeat.Hide();
        }
        else if(hxfn.map.curRoomTyp === 1){
            if(this.scr_conEmptySeat)
                this.scr_conEmptySeat.Show();
        }
    },

    WaitOtherOne:function (isWait){
        if(this.scr_0Comn != null)
            this.scr_0Comn.HandleWaitOtherOne(isWait);
        if(this.scr_aConWaiting != null)
            this.scr_aConWaiting.HandleWaitOtherOne(isWait);
    },

    CheckJoinCurrentRing:function (){
        //确定玩家自己是否已在牌局中
        if(this.scr_0Comn != null)
            this.scr_0Comn.HandleWaitJoin();
    },

    UpdateCurCDNotifyMsg:function(newEvtName){
        if(this.scr_0Comn != null)
            this.scr_0Comn.UpdateCDEvtName(newEvtName);
    },

    CheckWaitingReadyBtn () {
        if(hxfn.battle.roomPhase>=hxfn.battle_pinshi.Enum_RoomPhase.RingInit){//||gp>= hxfn.battle_pinshi.Enum_GamePhase.Init
            if(this.scr_aConWaiting)
                this.scr_aConWaiting.RingBegin();
        }
        else {
            if(this.scr_aConWaiting)
                this.scr_aConWaiting.OnReset();
        }
    },

    //HACK 需要用TS类 UIPanelScene重构
    ToggleSceneBaseUI (isShow){},
});