import UIBattleLandlordWinLose from "./UIBattleLandlordWinLose";
import { hxfn } from "../../../FN/HXFN";
import { hxdt } from "../../../DT/HXDT";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlordResult extends cc.Component implements IUISub
{
    //for coin fly
    @property({type:cc.Node})
    private conCoinFly:cc.Node = null;
    //???
    @property({type:UIBattleLandlordWinLose})
    private scrWinOrLose: UIBattleLandlordWinLose = null;

    private scr_coinFly:cc.Component = null;
    private scores:any[] = [];
    private loseidxLst:any[] = [];
    private winidxLst:any[] = [];
    private lordIdx:number = -1;

    // LIFE-CYCLE CALLBACKS: //////////////////////////////////////////
    public OnInit(): void{
        this.scr_coinFly = this.conCoinFly.getComponent('UIBattle5CoinFlyMgr');

        this.scrWinOrLose.node.active = false;
        this.OnReset();
    }
    public OnStart(): void{

    }
    public OnReset(): void{

        //XXX 不自动关闭结算面板，等待下一局ring begin,或者自己手动关闭
        // this.scrWinOrLose.node.active = false;
    }
    public OnEnd(): void{}
    public OnStartReal(): void{}
    ///////////////////////////////////////////////////////////////////

    public EndRing (info:any) {
        // repeated DZPlayerRecord playerRecords = 1;
        // optional float balanceAnimDuration = 2;      //结算时通知客户端的动画时间(单次飞金币的时间)     
        // optional float nextRingDelay = 3;            //到下一局开始的延迟时间-单位秒    

        // optional string playerId = 1;       //玩家ID
        // optional bool isLord = 2;           //是否地主, true为地主
        // optional int32 ringCoin = 3;        //本局输赢的金币
        // optional int32 leftCoin = 4;        //结算后金币



        this.lordIdx = hxfn.battle_landlord.lordIdx;

        //有地主
        if(this.lordIdx >=0) {
            this.HandleEndInfo(info);

            //0, （废弃）显示玩家自己的胜利失败动画
            // this.ShowMyselfAnim();

            //1, 飞金币
            this.ShowCoinFly();
            //2, 新需求，播放赢得金币的特效：金币到达时即显示特效，即庄家如果有赢得话就延时首个金币到达的时间，如果玩家赢的话就等第一组（如果有）结束之后+首个金币到达的时间
            this.ShowWinCoinEff();
        }
        // //无庄家，只有一个赢家（比如拼十的通比玩法）
        // else{
        //     this.HandleEndInfoWithoutBanker(info);
        //     this.ShowCoinFlyWithoutBanker();
        //     this.ShowWinCoinEffWithoutBanker();
        // }

        // //3, ShowScore
        var totalTime = 1 * hxdt.setting_niuniu.Time_ResultCoinFlyPerPhase;
        // //新需求，暂时分数和金币同时显示 // this.ShowScore();
        // this.scheduleOnce(function(){
        //     this.ShowScore();
        // }.bind(this),totalTime + hxdt.setting_niuniu.Time_HackDelayShowCoinEff);

        // 4，显示胜利失败详情面板
        this.scheduleOnce(function(){
            // this.ShowScore();
            this.scrWinOrLose.node.active = true;
            this.scrWinOrLose.SetInfo(info.get('playerRecords'), this.isMeWin);
        }.bind(this),totalTime + hxdt.setting_niuniu.Time_HackDelayShowCoinEff);
    }

    private get isMeWin (){
        if(hxfn.battle_landlord.isMeLord) {
            if(this.winidxLst.length > 0)
                return false;
            else
                return true;
        }
        else {
            if(this.winidxLst.length > 0)
                return true;
            else
                return false;
        }
    }
    private HandleEndInfo (allinfos:any[]) {
        this.scores = [];
        this.loseidxLst=[];
        this.winidxLst=[];

        // let allinfos = info.get('playerRecords');

        for (let i = 0; i < allinfos.length; i++) {
            let element = allinfos[i];

            let pid = element.get('playerId');

            // if(!hxfn.battle.CheckJoinedCurrentRingById(pid))
            // continue;

            let pidx = hxfn.battle.GetUISeatIdx(pid);
            if (pidx === -1)
            continue;
            
            // Fix 正确处理分数的idx顺序
            let ringCoin = element.get('ringCoin');
            this.scores[pidx] = ringCoin;

            if(!hxfn.battle_landlord.CheckALord(pid)) {
                if(ringCoin<0){
                    this.loseidxLst.push(pidx);
                }
                else if(ringCoin>0){
                    this.winidxLst.push(pidx);
                }
            }
        }
    }

    private ShowCoinFly () {
        var flyGroups = this.GetFlyGroups();
        this.scr_coinFly.SetInfo(flyGroups);
    }

    private GetFlyGroups () {
        let poses = hxdt.setting_niuniu.SeatPoses;

        let flyLose = [];
        let posBanker = poses[this.lordIdx];
        for (let i = 0; i < this.loseidxLst.length; i++) {
            let playeridx = this.loseidxLst[i];
            flyLose.push([poses[playeridx], posBanker]);//失败金币飞向: 闲家在前->庄家在后
        }

        let flyWin = [];
        for (let j = 0; j < this.winidxLst.length; j++) {
            let playeridx = this.winidxLst[j];
            flyWin.push([posBanker, poses[playeridx]]);//胜利金币飞向：庄家在前 -> 闲家在后
        }

        // 按照庄家先从输的玩家收取金币，再发给胜利的玩家
        let flyGroups = [];
        if(flyLose.length>0)
        flyGroups.push(flyLose);
        if(flyWin.length>0)
        flyGroups.push(flyWin);

        // cc.log("FlyCoin->"+JSON.stringify(flyGroups));
        return flyGroups;
    }

    private ShowWinCoinEff (){}
}
