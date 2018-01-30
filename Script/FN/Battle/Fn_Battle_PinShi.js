import { hxjs } from "../../../HXJS/HXJS";
import { hxfn } from "./../HXFN";
import { hxdt } from "../../DT/HXDT";

//此类特供给拼十玩法战斗场景

export let battle_pinshi = 
{
    //当前场景所需要的基础显示数据 ===================================
    //
    // 元宝房特有
    isRubPoker:false,//是否搓牌
    isStranger: false,//是否允许陌生人加入
    
    haveSpecmodel:false,        //是否包含特殊牌型(葫芦，顺子，同花) 
    isCrazyBet:false,        //是否特殊倍数
    qiangzhuangmodel: -1,     //模式:抢庄类型(0-看牌抢庄，1-自由抢庄，2-双十上庄，3-通比拼十，4-疯狂拼十) 
    isXianTuizhu: false,     //是否闲家推注-疯狂加倍  
    isBankerTuizhu: false,   //是否庄家推注-疯狂加倍
    isBankerOutOfTen: false, //是否没十下庄，此选项在双十上庄才有
    
    //过程数据 ======================================================
    //通用
    bankerId: null,
    CachePlayersHasActNiuNiu:[],//是否亮过牌
    
    //ui对象引用 ====================================================
    uiRubPoker:null,


    //设置数据
    //1 准备与发牌开始阶段
    //2 抢庄阶段
    //3 下注阶段
    //4 open阶段
    //5 结算阶段
    Enum_RoomPhase : cc.Enum({
        RoomWait    :0,// 开局等待
        RoomCD      :1,// 开局倒数
        RoomCDBreak :2,// 开局倒数被打断

        RingInit    :3,
        RingBegin   :4,
        RingEnd     :5,
        RoomEnd     :6,
    }),

    Enum_GamePhase : cc.Enum({
        Init         :0,
        Dispath      :1,
        TipVieBanker :2,
        WaitVieBanker:3,
        ConfirmBanker:4,
        TipChipin    :5,
        WaitChipin   :6,
        ShowHand     :7,
        TipNiuNiu    :8,
        WaitNiuNiu   :9,
        TipRubPoker  :10,
        WaitRubPoker :11,
        Balance      :12,//结算
        Finish       :13,
    }),

    Enum_GameMode:cc.Enum({
        KPQZ:0,
        ZYQZ:1,
        SSSZ:2,
        TBPS:3,
    }),

    Enum_EventCD : cc.Enum({
        Start:"请准备：",
        HasReady:"等待其他玩家准备：",

        BankerVie:"请抢庄：",
        HasBankerVie:"等待其他玩家抢庄：",

        Chipin:"请下注：",
        HasChipin:"等待其他玩家下注：",

        LightPoker:"请亮牌：",
        HasLightPoker:"等待其他玩家亮牌：",

        Comn:'请等待：',
    }),

    Enum_QZModelName:cc.Enum({
        0:'看牌抢庄',
        1:'自由抢庄',
        2:'双十上庄',
        3:'通比拼十',
        4:'疯狂拼十',
    }),

    get qzModelName(){
        return this.Enum_QZModelName[hxfn.battle_pinshi.qiangzhuangmodel];
    },

    //==============================================================
    OnStart(){
        //1,UI已经完全准备好，------------------------
        //2,等待获取数据，----------------------------
        //3,缓存起来，-------------------------------
        //4,再发出广播，通知各单位进行初始化，---------
        var isRefresh = false;
        hxfn.netrequest.SyncReq_GetRoomData(isRefresh, function(msg){
            if(msg.result === 0/*OK*/) {
                //1，所有数据准备好
                hxfn.battle_pinshi.SetRoomData(msg);
                
                switch (hxfn.battle_pinshi.qiangzhuangmodel) {
                    case 0:
                    hxfn.battle_pinshi_kpqz.OnStart();
                    break;
                    case 1:
                    hxfn.battle_pinshi_zyqz.OnStart();
                    break;
                    case 2:
                    hxfn.battle_pinshi_sssz.OnStart();
                    break;
                    case 3:
                    hxfn.battle_pinshi_tbps.OnStart();
                    break;
                    default:
                    break;
                }
                
                //2，消息广播通知UI初始化
                hxjs.util.Notifier.emit('Battle_ReadyData');
            }
            else{
                // hxjs.module.ui.hub.LoadDlg_Info(hxdt.errcode.codeToDesc(result), '提示');
                hxjs.module.net.NotifyFailedNetwork();
            }
        });
    },
    
    OnReset (){
        //1,重新初始化本地数据
        //THINKING 全部数据
        // this.ResetAllData();
        this.bankerId = null;
        this.ClearRubPokerUI();

        //2，重新获取完整服务器战斗数据
        this.OnStart();
    },

    OnEnd(){
        switch (hxfn.battle_pinshi.qiangzhuangmodel) {
            case 0:
                hxfn.battle_pinshi_kpqz.OnEnd();
            break;
            case 1:
                hxfn.battle_pinshi_zyqz.OnEnd();
            break;
            case 2:
                hxfn.battle_pinshi_sssz.OnEnd();
            break;
            case 3:
                hxfn.battle_pinshi_tbps.OnEnd();
            break;
            default:
                break;
        }

        this.ClearRubPokerUI();
        this.ResetAllData();
    },
    //////////////////////////////////////////////////////////////////////////
    
    ResetAllData(){
        this.bankerId = null;

        //每次初始化房间都会对以下数据初始化
        //保护性重置：为了防止金币房与元宝房互相污染（防止初始化失败或者一些特殊处理）
        // 元宝房特有
        this.isRubPoker=false;//是否搓牌
        this.isStranger= false;//是否允许陌生人加入
        
        this.haveSpecmodel=false;        //是否包含特殊牌型(葫芦，顺子，同花) 
        this.isCrazyBet=false;        //是否特殊倍数
        this.qiangzhuangmodel= -1;     //模式:抢庄类型(0-看牌抢庄，1-自由抢庄，2-双十上庄，3-通比拼十，4-疯狂拼十) 
        this.isXianTuizhu= false;     //是否闲家推注-疯狂加倍  
        this.isBankerTuizhu= false;   //是否庄家推注-疯狂加倍
        this.isBankerOutOfTen= false; //是否没十下庄，此选项在双十上庄才有

        //过程数据 -------------------
        //通用
        this.CachePlayersHasActNiuNiu=[];//是否亮过牌
    },
    //==============================================================
    
    
    SetRoomData(msg){
        hxfn.battle.curRoom = msg;

        //房间概况////////////////////////////////////////////////////////////
        hxfn.map.curRoomTyp = msg.get('roomType');
        hxfn.map.UpdateCoinInfo(msg.get('difen'),msg.get('enterLimit'),msg.get('leftLimit'));
        
        var qzRoom = msg.get('qzRoom');
        //房间玩家信息////////////////////////////////////////////////////////
        hxfn.battle.SetBattlePhase(qzRoom.get('roomPhase'), qzRoom.get('gamePhase'));
        //记录是否房间内搓牌
        hxfn.battle_pinshi.isRubPoker = msg.get('rubPoker');
        //记录是否房间内疯狂加倍
        hxfn.battle_pinshi.haveSpecmodel = qzRoom.get('createQiangzhuangRoomOption').get('haveSpecmodel');//msg.get('crazyDouble');
        hxfn.battle_pinshi.isCrazyBet = qzRoom.get('createQiangzhuangRoomOption').get('iscrazyMulti');//msg.get('crazyDouble');
        hxfn.battle_pinshi.qiangzhuangmodel = qzRoom.get('createQiangzhuangRoomOption').get('qiangzhuangmodel');
        hxfn.battle_pinshi.isXianTuizhu = qzRoom.get('createQiangzhuangRoomOption').get('isXianTuizhu');
        hxfn.battle_pinshi.isBankerTuizhu = qzRoom.get('createQiangzhuangRoomOption').get('isBankerTuizhu');
        hxfn.battle_pinshi.isBankerOutOfTen = qzRoom.get('createQiangzhuangRoomOption').get('isBankerOutOfTen');
        hxfn.battle_pinshi.isStranger = msg.get('strangerJoin');

        //设置自己是否在牌局中
        var players = qzRoom.get('players');
        players.forEach(element => {
            if(element) {
                let pid = element.get('playerInfo').get('userData').get('playerId');
                if(pid == hxfn.role.playerId)
                    hxfn.battle.hasPlayedCurGame = element.get('isJoinCurrentRing');

                if(element.get('isRubPoker'))
                    hxfn.battle_pinshi.CachePlayersHasActNiuNiu.push(pid);
            }
        });

        hxfn.battle.InitAllRoles(msg.get('qzRoom').get('players'), hxdt.setting_niuniu.maxUISeats);

        // this.HandleServerInfo(true);
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-ReadyData');
    },

    IsMeBanker () {
        var myPlayerId = hxfn.role.playerId;//hxfn.role.playerId;
        return myPlayerId === this.bankerId;
    },

    IsBanker (pid) {
        return pid === this.bankerId;
    },

    GetBankerIdx(){
        // cc.log("this.bankerId:" + this.bankerId);
        // cc.log("this.uiroles:" + hxfn.battle.uiRoles);
        return hxfn.battle.GetUISeatIdx(this.bankerId);
    },

    CheckHasActNiuNiu(idx){
        var has = false;

        var player = hxfn.battle.uiRoles[idx];
        if(player) {
            var pid = player.get('playerInfo').get('userData').get('playerId');
            has = hxfn.battle_pinshi.CachePlayersHasActNiuNiu.indexOf(pid)>=0;
        }

        return has;
    },

    ////////////////////////////////////开始：战斗即时切入恢复///////////////////////////////////////
    // 实时战斗信息
    // optional PlayerBriefProto playerInfo = 1;
    // optional int32 seat = 2;
    // repeated int32 inHand = 3;     //手牌
    // optional bool isBanker = 4;       //是否庄家
    // optional int32 bankerMulti = 5;     //庄倍数
    // optional int32 playerMulti = 6;     //闲家下注
    // optional int32 niu = 7;             //选牛结果
    // optional int64 roomCoin = 8;        //房间币，根据房间不同
    // optional bool isRubPoker = 9;       //是否亮过牌
    // repeated int32 vieBankerMultiList = 10;  //抢庄倍数列表
    // optional int32 vieBankerMaxLimit = 11;   //抢庄倍数索引
    // repeated int32 chipInMultiList = 12;    //下注倍数列表
    // optional int32 chipInMaxLimit = 13;     //下注倍数索引
    // optional int32 cdMS = 14;               //当前状态的倒计时，如果=0就是没有
    // optional bool isJoinCurrentRing = 15;   //是否参与当前轮游戏
    
    //!!!用来处理信息，并且广播给原有的显示对象进行显示，但是应该有另外一套静默显示的表现，而不是沿用一般的有动画表现的显示
    SetBattleInsInfo:function (info, idx) {
        switch (hxfn.battle_pinshi.qiangzhuangmodel) {
            case 0:
                hxfn.battle_pinshi_kpqz.SetBattleInsInfo(info, idx);
            break;
            case 1:
                hxfn.battle_pinshi_zyqz.SetBattleInsInfo(info, idx);
            break;
            case 2:
                hxfn.battle_pinshi_sssz.SetBattleInsInfo(info, idx);
            break;
            case 3:
                hxfn.battle_pinshi_tbps.SetBattleInsInfo(info, idx);
            break;
            default:
                break;
        }
    },

    HasNotVieBanker:function (bankerMulti){
        return bankerMulti == null || bankerMulti < 0;
    },
    HasNotChipin:function (playerMulti){
        return playerMulti <= 0;
    },

    IsAutoBanker () {
        var b = false;
        if(hxfn.map.curGameTypId == 1) {
            if(hxfn.battle_pinshi.qiangzhuangmodel == this.Enum_GameMode.SSSZ)
                b = true;
        }

        return b;
    },
    ////////////////////////////////////结束：战斗即时切入恢复///////////////////////////////////////

    ////////////////////////////////////开始：战斗牌组管理///////////////////////////////////////////
    // GetIdx4NiuNiuScoreLstByCardId (curLst, newCardid) {
    //     if(curLst.indexOf(newCardid) != -1)
    //     return curLst;

    //     var idx = -1;
    //     //[3,1,6,9,12]
    //     // cur [3, -1, 9]
    //     //cur idxs [0, -1, 3]
    //     // new 6 ==> [3,6,9]  idx = 2
    //     // new 12==> [3,9,12] idx = 4
    //     //还有潜规则，第一项一定填第一个空， 最后一项一定填最后一个空
        
    //     //所以最终最简单的做法是，操作完整的5个元素，然后按顺序取出选中的项即可
    //     //满3项，按序
    //     //满两项，有间隔则中间留-1，连续的则判断从第一项连续（最后一空留-1），还是连续到最后一项（第一空留-1）
    //     //1项，除是最后一项的情况在最后一空，其他情况都是填第一个空

    //     //HACK 暴力处理，哪里有
        
    //     return curLst;
    // },

    // GetVisualLst4NiuNiuScore (cardlst) {
    //     var newlst = [];

    //     for (var i = 0; i < cardlst.length; i++) {
    //         var element = cardlst[i];
    //         if(element != -1)
    //         newlst.push(element);
    //     }

    //     if(newlst.length == 0){
    //         newlst = [-1,-1,-1];
    //     }
    //     else if(newlst.length == 1) {
    //         // TODO 已有元素的位置设定在前，中，后
    //         newlst.push(-1);
    //         newlst.push(-1);
    //     }
    //     else if(newlst.length == 2) {
    //         // TODO 新元素插入到前、中、后位置
    //         newlst.push(-1);
    //     }

    //     return newlst;
    // },

    //初始化为完整的5张牌选中状态形式
    // GetCardLstByNiuNiuBestLst (bestLst) {
    //     var cardlst = [-1, -1, -1, -1, -1];

    //     for (var i = 0; i < bestLst.length; i++) {
    //         var element = bestLst[i];
    //         var idx = hxfn.battle.GetIdxByCardId(element)
    //         cardlst[idx] = element;
    //     }
        
    //     return cardlst;
    // },

    //计算牛牛分数
    // GetNiuNiuTotalScore (cardLst) {
    //     var newPoint = (function(arr){
    //         var a = 0;
    //         for (var i = 0; i < arr.length; i++) {
    //             var element = arr[i];
    //             if(element != -1){
    //                 var point = hxfn.battle.GetCardPointInfo(element)['point'];
    //                 a+=point>=10? 10 : point;
    //             }
    //         }
    //         return a;
    //     })(cardLst);

    //     return newPoint;
    // },

    GetScoreByPoint (point) {
        return point>=10? 10 : point;
    },

    //3+2牌型
    Check3A2 (niu) {
        var is3A2 = false;

        if(niu >0) {
            if(niu == 11 || niu == 12 || niu == 14 || niu == 16 || niu == 15)
                is3A2 = false;
            else 
                is3A2 = true;
        }
        else {
            is3A2 = false;
        }
        
        return is3A2;
    },

    //4+1牌型
    Check4A1(niu) {
        return niu == 15;
    },
    ////////////////////////////////////结束：战斗牌组管理///////////////////////////////////////////
    
    ////////////////////////////////////////////即时操作////////////////////////////////////////////
    ShowRubPokerUI() {
        this.ClearRubPokerUI();
        
        hxjs.module.ui.hub.LoadPanel('UI_Battle_RubPoker', function(prefab){
            this.uiRubPoker = prefab;
        }.bind(this), hxjs.module.ui.hub.rootUI4Scene);
    },
    ClearRubPokerUI (){
        cc.log(this.uiRubPoker);
        if(this.uiRubPoker){
            cc.log('[ui] unload: UI_Battle_RubPoker');
            
            hxjs.util.Notifier.emit('[NiuNiu]_BattleUI-LightCard');
            hxjs.util.Notifier.emit('UI_Battle_UpdateCDEventName', hxfn.battle_pinshi.Enum_EventCD.HasLightPoker);
            
            // hxjs.module.ui.hub.Unload(this.uiRubPoker);
            hxjs.util.Notifier.emit('UI_Battle_CD4RunPokerOver');
            this.uiRubPoker = null;
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
};