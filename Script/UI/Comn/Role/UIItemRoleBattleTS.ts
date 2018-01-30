import { hxjs } from "../../../../HXJS/HXJS";
import { hxfn } from "../../../FN/HXFN";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIItemRoleBattleTS extends cc.Component 
{
    //基础功能
    @property({type:cc.Node})
    private imgFrame:cc.Node = null;
    @property({type:cc.Node})
    private btnSelect:cc.Node = null;
    //基础玩家信息
    @property({type:cc.Node})
    private conUIItemRole:cc.Node = null;
    @property({type:cc.Sprite})
    private imgGold:cc.Sprite = null;//货币类型
    @property({type:cc.Label})
    private txtRoleGold: cc.Label = null;
    
    //战斗实时信息
    //0 全局
    @property({type:cc.Node})
    private conLost: cc.Node = null;//状态：托管中/离开中/丢失(TODO: 断线重连缺少玩家是否处于托管中的标记)
    @property({type:cc.Node})
    private conUnJoined:cc.Node = null;//状态：本局未加入/本局观战中（下局开始）
    // @property({type:cc.Node})
    // private conLightCard:cc.Node = null;//状态：已明牌
    
    ///////////////////////////////////////////////////
    //Action
    @property({type:cc.Node})
    private conReady:cc.Node = null;//状态：已准备

    // //叫地主（经典模式）
    // @property({type:cc.Node})
    // private conActCallLord:cc.Node = null;
    // //叫与抢（欢乐模式）
    // @property({type:cc.Node})
    // private conActVieLord:cc.Node = null;
    // //明牌
    // @property({type:cc.Node})
    // private conActOpenCard:cc.Node = null;
    // //加倍、不加倍
    // @property({type:cc.Node})
    // private conActMulti:cc.Node = null;
    // //不出
    // @property({type:cc.Node})
    // private conActDiscard:cc.Node = null;


    private sonItem_Role:any = null;
    private idx:number = -1;
    private info:any = null;
    private playerid:string = '';
    private basicInfo:any = null;
    

    private hasInit:boolean = false;

    // LIFE-CYCLE CALLBACKS: /////////////////////////////////////////////////////////////
    public OnInit(){
        if(this.hasInit) return;
        this.hasInit = true;

        // this.HandleNotify(true);

        this.btnSelect.getComponent('UIButton').SetInfo(function(){
            //如果当前位置有玩家，则可以点击查看详情，邀请好友
            if(this.CheckValidPlayer() && this.idx !==0/*0表示永远是玩家自己*/) {
                hxfn.battle.curSelectSeatIdx = this.idx;
                hxjs.module.ui.hub.LoadPanel('UI_Role_BattleInfo_Other');//LoadPanel_Dlg
            }
        }.bind(this));

        hxjs.module.ui.hub.LoadPanel('UI_Item_RoleInfo',function(prefab){
            cc.log('~~~~~~~~~~~~~~Set Role Icon: load complete');
            this.sonItem_Role = prefab;
            this.InitItemRole();
        }.bind(this),this.conUIItemRole);

        if(this.conReady)
            this.conReady.active = false;
    }
    public OnReset(){
        this.imgFrame.active = false;
        this.btnSelect.active = false;
        this.conUIItemRole.active = false;

        //重置玩家所有实时信息
        this.imgGold.node.active = false;
        this.txtRoleGold.node.active = false;
        this.conLost.active = false;
        if(this.conUnJoined)
        this.conUnJoined.active = false;

        if(this.conReady)
            this.conReady.active = false;
    }
    public OnEnd(){
        this.hasInit = false;
        this.HandleNotify(false);

        if(this.sonItem_Role)
            hxjs.module.ui.hub.Unload(this.sonItem_Role);
        
        // this.conReady.active = false;
    }
    onDestroy (){
        this.OnEnd();
    }
    ///////////////////////////////////////////////////////////////////////////////////

    private OnEnable () {
        this.HandleNotify(true);
    }
    public OnDisable () {
        this.HandleNotify(false);
    }

    private HandleNotify (isHandle:boolean){
        if(isHandle){
            //利用消息 实时同步货币
            hxjs.util.Notifier.on('UI_BattleSyncCoin', this.SyncBattleCoin, this);//[seatIdx, count]
            //状态：在线，离线，观战中，已准备
            hxjs.util.Notifier.on('UI_BattleComeBack', this.ChangeStatus_ComeBack, this);
            hxjs.util.Notifier.on('UI_BattleLost', this.ChangeStatus_Lost, this);
            hxjs.util.Notifier.on('UI_Battle_RecoverJoinedStatus', this.RecoverJoinedStatus, this);
        }
        else {
            hxjs.util.Notifier.off('UI_BattleSyncCoin', this.SyncBattleCoin, this);
            //状态：在线，离线，观战中，已准备
            hxjs.util.Notifier.off('UI_BattleComeBack', this.ChangeStatus_ComeBack, this);
            hxjs.util.Notifier.off('UI_BattleLost', this.ChangeStatus_Lost, this);
            hxjs.util.Notifier.off('UI_Battle_RecoverJoinedStatus', this.RecoverJoinedStatus, this);
        }
    }

    private ChangeStatus_Lost (seatIdx:number) {
        if(this.idx === seatIdx){
            this.conLost.active = true;
        }
    }
    private ChangeStatus_ComeBack (seatIdx:number) {
        if(this.idx === seatIdx){
            this.conLost.active = false;
        }
    }
    private SyncBattleCoin (arr){
        if(this.idx == arr[0])
            this.UpdateCoin(arr[1]);
    }
    private CheckValidPlayer (){
        return this.idx != -1;
    }
    private InitItemRole(){
        if(this.sonItem_Role && this.basicInfo && this.idx != -1)
            this.sonItem_Role.getComponent('UIItemRoleInfoTS').SetInfo(this.basicInfo, this.idx);
    }

    //////////////////////
    public SetInfo (info:any, idx:number):void {
        this.OnInit();
        this.OnEnable();

        this.idx = idx;
        this.info = info;

        this.OnReset();
        
        if(info) {
            this.basicInfo = info.get('playerInfo');
            this.playerid = this.basicInfo['userData'].get('playerId');

            //0,基础功能
            this.imgFrame.active = true;//金边，新需求是所有玩家都有，以前是只有玩家自己才有！！！
            this.btnSelect.active = true;
            //房间货币类型
            this.SetCoinStyle();
            
            //0，更新基础信息
            this.conUIItemRole.active = true;
            cc.log('~~~~~~~~~~~~~~Set Role Icon: extern SetInfo');            
            this.InitItemRole();
            this.InitCoin(this.basicInfo);
            
            //1, 常见信息
            //处理房间币,同步给全局的玩家货币
            var amount = parseInt(info.get('roomCoin'));
            this.UpdateCoin(amount);
            
            //2，更新状态
            this.SetStatus_Unjoined(!hxfn.battle.CheckJoinedCurrentRing(info));
            //2，只有当前是出处于（战斗过程中？？？），才更新即时信息；否则跳过此步，以即时信息为准
            hxfn.battle_pinshi.SetBattleInsInfo(info, idx);
        }
    }

    private SetCoinStyle(){
        this.imgGold.node.active = true;
    }
    
    private RecoverJoinedStatus (){
        this.SetStatus_Unjoined(false);
    }
    private SetStatus_Unjoined(isUnjoined){
        if(this.conUnJoined)
        this.conUnJoined.active = isUnjoined;
    }

    private InitCoin (infodata:any){
        var goldenInfo = infodata['goldenInfo'];
        var gold = goldenInfo.get('gold');//金币
        var diamond = goldenInfo.get('diamond');//钻石
        var yuanbao = goldenInfo.get('yuanbao');//元宝
        
        if(hxfn.map.curRoomTyp == 0/*金币场*/){
            this.UpdateCoin(parseInt(gold));
        }
        else if(hxfn.map.curRoomTyp == 1){//元宝房
            this.UpdateCoin(parseInt(diamond));
        }
    }

    private UpdateCoin(amount) {
        this.txtRoleGold.node.active = true;
        this.txtRoleGold.string = amount.toCoin();
    }

    //new 4 douodizhu
    public SetReady(isReady:boolean) {
        this.conReady.active = isReady;
    }
    public ClearReady (){this.conReady.active = false;}
    
}
