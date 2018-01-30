import { hxfn } from "./../HXFN";
import { hxjs } from "../../../HXJS/HXJS";
import { hxdt } from "../../DT/HXDT";
import { setting_landlord } from "../../DT/DD/Setting_Battle_Landlord";
import { log } from "../../../HXJS/Util/Log";
import { isNullOrUndefined } from "util";

export class Fn_Battle_Landlord implements IFn,IMgr 
{
    //当前场景所需要的基础显示数据 ====================================
    public landlordModel= -1; //模式:抢庄类型-> 1，经典模式 2，赖子 3，==
    public isLightCard:boolean = false;//是否明牌
    public isMulti:boolean = false;//是否加倍

    
    
    public lordCard:number[] = [];//地主牌
    public lordCardMulti:number = -1;//地主牌倍数
    public ringMulti:number = -1;//牌局倍数
    public beginOpenMulti:number = -1; //??? 开局明牌的倍数


    //过程数据 ======================================================
    //------------------玩家------------------
    public lordId:string = null;//地主ID
    public get lordIdx(){
        return hxfn.battle.GetUISeatIdx(this.lordId);
    }
    public get isMeLord (){
        return this.lordId === hxfn.role.playerId;
    }
    public CheckALord (pid:string):boolean {
        return pid == this.lordId;
    }
    public get isPlayerFull () {
        return hxfn.battle.allRoles.length >= setting_landlord.maxUISeats;
    }

    //已经开启明牌的玩家id
    private _playersLightCard:string[] = [];
    public playerLightCard (val){
        log.warn('[ui] LightCard by player: ' + val);
        if(this._playersLightCard.indexOf(val) == -1)
            this._playersLightCard.push(val);
        //通知牌组视觉管理器:显示可以查看明牌的按钮
        hxjs.util.Notifier.emit('Battle_Landlord_LightCardPlayer', hxfn.battle.GetUISeatIdx(val));
    }
    public get playersLightCard (){
        return this._playersLightCard;
    }
    
    //------------------牌组------------------
    //我手中的牌
    public myHandCards:Array<number> = [];
    //我已经打出的牌：//为了记牌器做统计
    public myOutCards:number[] = [];
    //我要打出的牌
    public curDiscards:number[] = [];

    public SuccDiscard4MyHandCards (cards:number[]) {
        log.warn('ui SuccDiscard4MyHandCards');

        // 1，更新手中的牌，
        cards.forEach(c=>{
            let idx = this.myHandCards.indexOf(c);
            if(idx >= 0)
                this.myHandCards.splice(idx,1);
        });
        
        //通知牌组视觉管理器:更新当前的牌组
        // if(cards.length > 0)
        hxjs.util.Notifier.emit('Battle_Landlord_SuccDiscard', cards);

        // log.warn(this.curDiscards);
        log.warn(this.myHandCards);

        // 2，更新已出的牌
        // this.myOutCards = this.myOutCards.concat(this.curDiscards);
        // log.warn(this.myOutCards);
    }

    //管理玩家的手牌
    private playersHandCards:Map<string,number[]> = new Map<string,number[]>();
    //为了记牌器做统计
    private playersOutCards:Map<string,number[]> = new Map<string,number[]>();
    public GetHandCards(playerId:string){
        if(this.playersHandCards.has(playerId))
            return this.playersHandCards.get(playerId);
        else 
            return null;
    }
    public GeOutCards(playerId:string){
        if(this.playersOutCards.has(playerId))
            return this.playersOutCards.get(playerId);
        else 
            return null;
    }
    public GetRemainCardsNum (pid:string):number {
        let outNum:number = 0;
        let outcards:number[] = this.GeOutCards(pid);

        if(!outcards) outNum = 0;
        else outNum = outcards.length;

        if(this.CheckALord(pid))
            return 17+3 - outNum;
        else
            return 17- outNum;
    }
    public UpdateOutCards (pid:string, discards:number[]) {
        let ns:number[] = this.playersOutCards.get(pid);
        if(isNullOrUndefined(ns)) ns = [];
        ns = ns.concat(discards);
        this.playersOutCards.set(pid, ns);

        // cc.warn('[ui] UpdateOutCards');
        // cc.warn('[ui] pid:' + pid);
        // cc.warn(ns);
        
        //发警报
        hxjs.util.Notifier.emit('Battle_Landlord_CardsLess',[pid,this.CheckCardLess(pid,ns)]);
    }
    

    private CheckCardLess (pid:string, outCards:number[]){
        //HACK pid 非地主
        if(this.CheckALord(pid))
            return outCards.length>=(17+3-2) && outCards.length<(17+3);
        else
            return outCards.length>=(17-2) && outCards.length<17;
    }

    public HandTipPokers (tips:any):number[] {
        let allTipCards:number[] = [];
        for (let i = 0; i < tips.length; i++) {
            if(tips[i]) {
                let arr = tips[i].get('pokerList');
                for (let j = 0; j < arr.length; j++) {
                    allTipCards.push(arr[j]);
                }
            }
        }

        return allTipCards;
    }

    public HandDiscardPokers (tip:any):number[] {
        let allTipCards:number[] = [];

        if(tip) {
            let arr = tip.get('pokerList');
            for (let j = 0; j < arr.length; j++) {
                allTipCards.push(arr[j]);
            }
        }

        return allTipCards;
    }

    public TransIdToIdx (cs:number[]) {
        //转换成索引
        let idxs = [];

        cs.forEach(c=>{
            idxs.push(hxfn.battle_landlord.myHandCards.indexOf(c));
        });

        return idxs;
    }

    public CheckTheFirstDiscard () {
        //TODO 地主一次出牌，重连时如何判断???
        return false;
    }

    //ui对象引用 ====================================================

    ////////

    
    //设置数据
    //1 准备与发牌开始阶段
    //2 抢庄阶段
    //3 下注阶段
    //4 open阶段
    //5 结算阶段
    public Enum_RoomPhase = cc.Enum({
        RoomWait    :0,// 开局等待
        RoomCD      :1,// 开局倒数
        RoomCDBreak :2,// 开局倒数被打断

        RingInit    :3,
        RingBegin   :4,
        RingEnd     :5,
        RoomEnd     :6,
    })

    public Enum_GamePhase = cc.Enum({
        Init         :0,
        Dispath      :1,
        // TipVieBanker :2,
        // WaitVieBanker:3,
        // ConfirmBanker:4,
        // TipChipin    :5,
        // WaitChipin   :6,
        // ShowHand     :7,
        // TipNiuNiu    :8,
        // WaitNiuNiu   :9,
        // TipRubPoker  :10,
        // WaitRubPoker :11,
        Balance      :12,//结算
        Finish       :13,
    })

    public Enum_GameMode=cc.Enum({
        KPQZ:0,
        ZYQZ:1,
        SSSZ:2,
        TBPS:3,
    })

    public Enum_QZModelName = cc.Enum({
        0:'看牌抢庄',
        1:'自由抢庄',
        2:'双十上庄',
        3:'通比拼十',
        4:'疯狂拼十',
    })

    public get dzModelName(){
        // if(this.landlordModel == 0)

        return '经典模式';
    }

    public Enum_EventCD = cc.Enum({
        Start:"请准备：",
        HasReady:"等待其他玩家准备：",

        BankerVie:"请抢庄：",
        HasBankerVie:"等待其他玩家抢庄：",

        Chipin:"请下注：",
        HasChipin:"等待其他玩家下注：",

        LightPoker:"请亮牌：",
        HasLightPoker:"等待其他玩家亮牌：",

        Comn:'请等待：',
    })

    constructor() {
    }

    public OnStart() {
        hxfn.battle_cardmem.OnStart();

        var isRefresh = false;
        hxfn.netrequest.SyncReq_GetRoomData(isRefresh, (msg)=>{
            if(msg.result === 0/*OK*/) {
                //1，所有数据准备好
                this.SetRoomData(msg);
                
                switch (this.landlordModel) {
                    case 0:
                    hxfn.battle_landlord_classic.OnStart();
                    break;
                    // case 1:
                    // hxfn.battle_pinshi_zyqz.OnStart();
                    // break;
                    // case 2:
                    // hxfn.battle_pinshi_sssz.OnStart();
                    // break;
                    // case 3:
                    // hxfn.battle_pinshi_tbps.OnStart();
                    // break;
                    default:
                    break;
                }
                
                //2，消息广播通知UI初始化
                // hxjs.util.Notifier.emit('Battle_ReadyData');
                hxfn.battle.uiMain.OnStartReal();
            }
            else{
                // hxjs.module.ui.hub.LoadDlg_Info(hxdt.errcode.codeToDesc(result), '提示');
                hxjs.module.net.NotifyFailedNetwork();
            }
        });
    }

    public OnReset() {
        hxfn.battle_cardmem.OnReset();

        //THINKING 战斗场景全局数据
        hxfn.battle.isBattlePlaying = false;
        // this.roomData = null;
        hxfn.battle.curRoom = null;
        
        //1,重新初始化本地数据
        this.lordId = null;
        this._playersLightCard = [];
        this.myHandCards = [];
        this.myOutCards = [];
        this.curDiscards = [];

        //2，重新获取完整服务器战斗数据
        this.OnStart();
    }

    public OnEnd() {
        hxfn.battle_cardmem.OnEnd();


        //reset local data
        this.lordId = null;

        switch (this.landlordModel) {
            case 0:
                hxfn.battle_landlord_classic.OnEnd();
            break;
            // case 1:
            //     hxfn.battle_pinshi_zyqz.HandleServerInfo(false);
            // break;
            // case 2:
            //     hxfn.battle_pinshi_sssz.HandleServerInfo(false);
            // break;
            // case 3:
            //     hxfn.battle_pinshi_tbps.HandleServerInfo(false);
            // break;
            default:
                break;
        }
    }
    ResetAllData(){
        this.lordId = null;//地主ID
        this.landlordModel= -1; //模式:抢庄类型-> 1，经典模式 2，赖子 3，==
        this.isLightCard = false;//是否明牌
        this.isMulti = false;//是否加倍
    }
    ClearAllUI(){}
    //////////////////////////////////////////////////////////////////////////



    //房间初始化信息
    // message DZRoomProto {
    //     repeated DZPlayerProto players = 1;     //玩家列表
    //     optional int32 roomPhase = 2;           //room状态
    //     optional int32 gamePhase = 3;           //游戏状态
    //     repeated int32 lordCard = 4;        //地主牌
    //     optional int32 lordCardMulti = 5;   //地主牌倍数
    //     optional int32 ringMulti = 6;       //牌局倍数
    //     optional int32 beginOpenMulti = 7;  //开局明牌的倍数
    // }

    //
    // message DZPlayerProto {
    //     optional PlayerBriefProto playerInfo = 1;
    //     optional int32 seat = 2;       //位置ID
    //     repeated int32 inHand = 3;     //手牌
    //     optional bool isLord = 4;       //是否庄家
    //     optional int32 lordMulti = 5;     //地主倍数，如果玩家是地主才有效
    //     optional int32 playerMulti = 6;     //农民加倍
    //     optional int64 roomCoin = 8;        //房间币，根据房间不同
    //     optional DZActDiscard lastAct = 9;  //玩家上一个动作
    //     optional int32 openPokerList = 10;  //玩家明牌列表
    // }

    SetRoomData(msg){
        hxfn.battle.curRoom = msg;
        
        //房间概况////////////////////////////////////////////////////////////
        var roomOption = msg.get('roomOption');
        hxfn.map.curRoomTyp = roomOption.get('roomType');
        hxfn.map.UpdateCoinInfo(roomOption.get('difen'),roomOption.get('enterLimit'),roomOption.get('leftLimit'));


        //房间基本信息////////////////////////////////////////////////////////
        var lordRoom = msg.get('lordRoom');
        hxfn.battle.SetBattlePhase(lordRoom.get('roomPhase'), lordRoom.get('gamePhase'));
        this.lordCard = lordRoom.get('lordCard');
        this.lordCardMulti = lordRoom.get('lordCardMulti');//地主牌倍数
        this.ringMulti = lordRoom.get('ringMulti');//牌局倍数
        this.beginOpenMulti = lordRoom.get('beginOpenMulti'); //??? 开局明牌的倍数
        
        //TODO
        this.landlordModel= 0; //模式:抢庄类型-> 0，经典模式 1，赖子 2，==
        this.isLightCard = true;//是否明牌
        this.isMulti = true;//是否加倍
        
        
        //房间玩家信息////////////////////////////////////////////////////////
        var players = lordRoom.get('players');
        //查找地主
        players.some(element => {
            if(element) {
                if(element.get('isLord')) {
                    this.lordId = element.get('playerInfo').get('userData').get('playerId');
                    return true;
                }
            }
        });

        hxfn.battle.InitAllRoles(players, setting_landlord.maxUISeats);
    }

    //!!!用来处理信息，并且广播给原有的显示对象进行显示，但是应该有另外一套静默显示的表现，而不是沿用一般的有动画表现的显示
    SetBattleInsInfo (info:any, idx:number) {
        switch (this.landlordModel) {
            case 0:
                hxfn.battle_landlord_classic.SetBattleInsInfo(info, idx);
            break;
            // case 1:
            //     hxfn.battle_pinshi_zyqz.SetBattleInsInfo(info, idx);
            // break;
            // case 2:
            //     hxfn.battle_pinshi_sssz.SetBattleInsInfo(info, idx);
            // break;
            // case 3:
            //     hxfn.battle_pinshi_tbps.SetBattleInsInfo(info, idx);
            // break;
            default:
                break;
        }
    }
}