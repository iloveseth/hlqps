import { hxfn } from "../../../FN/HXFN";
import { hxjs } from "../../../../HXJS/HXJS";
import UIItemRoleBattleTS from "../../Comn/Role/UIItemRoleBattleTS";
import UIItemRoleBattle_Landlord from "../5_Landlord/UIItemRoleBattle_Landlord";
import { log } from "../../../../HXJS/Util/Log";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleRoleMgr_Landlord extends cc.Component implements IUISub
{
    // 采用数组
    @property({type:[cc.Node]})
    private uiRols: cc.Node[] = [];

    private scr_roles: UIItemRoleBattleTS[] = null;
    private hasInit:boolean = false;

    // LIFE-CYCLE CALLBACKS://///////////////////////////////////////
    public OnStart () {}
    public OnStartReal () {}

    public OnInit () {
        if(this.hasInit) return;
        this.hasInit = true;

        this.scr_roles = [];
        this.uiRols.forEach(e=>{
            this.scr_roles.push(e.getComponent('UIItemRoleBattleTS'));
        });

        this.OnReset();
    }

    public OnReset () {
        // this.scr_lstRole.Reset();
        this.scr_roles.forEach(e=>{
            e.OnReset();
            e.node.active = false;
        });
    }
    
    public OnEnd () {
        this.hasInit = false;
        this.OnReset();
        this.scr_roles = [];
    }
    /////////////////////////////////////////////////////////////////

    public SetOriginalPlayers() {
        // this.scr_lstRole.SetInfo(hxfn.battle.uiRoles);
        for (let i = 0; i < hxfn.battle.uiRoles.length; i++) {
            const element = hxfn.battle.uiRoles[i];
            this.scr_roles[i].node.active = true;
            this.scr_roles[i].SetInfo(element,i);
        }
    }
    public SyncPlayerJoinRoom (player) {
        // 单个刷新
        let seatIdx = hxfn.battle.GetUISeatIdx2(player);
        log.trace('ui','SyncPlayerJoinRoom seatIdx: ' + seatIdx);
        this.scr_roles[seatIdx].node.active = true;
        this.scr_roles[seatIdx].SetInfo(player,seatIdx);
    }
    public SyncPlayerQuitRoom (playerid) {
        let seatIdx = hxfn.battle.GetUISeatIdx(playerid);
        log.trace('ui','SyncPlayerQuitRoom seatIdx: ' + seatIdx);
        if(seatIdx<0) return;

        this.scr_roles[seatIdx].OnDisable();
        this.scr_roles[seatIdx].node.active = false;

        this.ClearReadyFlag(seatIdx);
    }

    // 各种服务器推送的Act状态设置!!!生命周期：阶段性存在
    // 已准备
    // 叫x?/不叫
    // XXX 叫/抢
    // 明牌X? 
    // 加倍/不加倍
    public ClearAllStat(){
        this.scr_roles.forEach(element => {
            element.OnReset();
        });
    }
    public ClearStat(idx:number){
        this.scr_roles[idx].OnReset();
    }
    public SetReady(info:any){
        let players = info.get('playerList');
        players.forEach(element => {
            let pid:string = element.get('playerId');
            let idx:number = hxfn.battle.GetUISeatIdx(pid);
            this.scr_roles[idx].SetReady(element.get('ready'));

            this.SetLightCard(idx,pid,element.get('open'));
            
            // 1waiting SetReady 如果是自己已准备，则直接标记为牌局中，否则只有发牌（等倒计时结束）才算
            if(pid === hxfn.role.playerId) {
                hxfn.battle.isBattlePlaying = true;
            }
        });
    }
    private ClearReadyFlag(idx){//pid
        //清理已准备的玩家
        // let idx = hxfn.battle.GetUISeatIdx(pid);
        this.scr_roles[idx].ClearReady();
    }
    
    public RingBegin(){
        this.ClearAllReadyStat();
    }
    private ClearAllReadyStat (){
        this.scr_roles.forEach(element => {
            element.ClearReady();
        });
    }
    
    public CallLord(info:any){
        let idx:number = hxfn.battle.GetUISeatIdx(info.get('playerId'));
        let multi:number = info.get('addMulti');

        (this.scr_roles[idx] as UIItemRoleBattle_Landlord).CallLord(multi);
    }
    private SetLightCard(idx:number,pid:string, isOpen:boolean){//, multi:number = -1
        if(isOpen) hxfn.battle_landlord.playerLightCard(pid);
        (this.scr_roles[idx] as UIItemRoleBattle_Landlord).SetOpen(isOpen);
        // (this.scr_roles[idx] as UIItemRoleBattle_Landlord).SetLightCard(multi);
    }
    //SetChipinMulti
    public ActMulti (playerId:string,multi:number){
        let idx = hxfn.battle.GetUISeatIdx(playerId);
        (this.scr_roles[idx] as UIItemRoleBattle_Landlord).SetChipinMulti(multi);
    }
    public MarkLord(info:any){
        let lordId = info.get('lordPlayer');
        hxfn.battle_landlord.lordId = lordId;
        let idx = hxfn.battle.GetUISeatIdx(lordId);

        (this.scr_roles[idx] as UIItemRoleBattle_Landlord).MarkLord(info.get('lordMulti'));
    }
    public SetCD (idx:number,cd:number){
        (this.scr_roles[idx] as UIItemRoleBattle_Landlord).SetCD(cd);
    }



    //清理阶段性显示信息
    public ClearPhaseObjs (pid) {
        let idx:number = hxfn.battle.GetUISeatIdx(pid);
        (this.scr_roles[idx] as UIItemRoleBattle_Landlord).ClearPhaseObjs();
    }
    public ClearAllPhaseObjs () {
        let item:UIItemRoleBattle_Landlord = null;
        this.scr_roles.forEach(element => {
            item = element as UIItemRoleBattle_Landlord;
            if(item) item.ClearPhaseObjs();
        });
    }
}