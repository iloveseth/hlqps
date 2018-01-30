import UIPanelScene from "../../../HXJS/Module/UI/Panel/UIPanelScene";
import { hxfn } from "../../FN/HXFN";
import { hxjs } from "../../../HXJS/HXJS";
import { hxdt } from "../../DT/HXDT";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UILobbyBasic extends UIPanelScene
{
    @property({type:cc.Node})
    private loopNotifyCon:cc.Node = null;// 跑马灯广告
    @property({type:cc.Node})
    private lstGames: cc.Node = null;
    @property({type:cc.Label})
    private txtAllPlayerCount:cc.Label = null;

    
    @property({type:cc.Node})
    private conBasic: cc.Node = null;
    @property({type:cc.Node})
    private conRoleInfo: cc.Node = null;
    @property({type:cc.Node})
    private conFnEntry: cc.Node = null;
    @property({type:cc.Node})
    btn_TestBattleEntry:cc.Node = null;
    btnTestBattleEntry:cc.Component = null;

    @property({type:cc.Button})
    private btnNewShare: cc.Button = null;

    @property({type:cc.PageView})
    private pageView: cc.PageView = null;

    @property({type:cc.PageView})
    private pageView1: cc.PageView = null;



    //红色版本修改 //////////////////////////////////////////////////////////////////////////////
    @property({type:cc.Node})
    private bgLoop: cc.Node = null;
    @property({type:cc.Button})
    private btnRoomNumber: cc.Button = null;
    @property({type:cc.Button})
    private btnSendnotify:cc.Button = null;

    @property({type:cc.Button})
    private btnBind:cc.Button = null;
    ////////////////////////////////////////////////////////////////////////////////////////////

    // uiRoleInfo:cc.Node = null;
    // uiLobbyFnEntrys:cc.Node = null;
    loopNotify:cc.Component = null;
    
    isLoadedRoleInfo:Boolean = false;
    isLoadedFns:Boolean = false;

    pageIdx: Number = 0;
    // isLoadedThis:Boolean = false;

    // LIFE-CYCLE CALLBACKS:///////////////////////////////////////////
    // protected DefaultLayout (isHandle:Boolean) {}
    protected GetSubFn_Static () {}
    protected SetAllRoundClearSubUI () {}
    // protected DefaultNotify (isHandle:Boolean) {}

    private scr_RoleInfo:cc.Component = null;
    private scr_FnEntrys:cc.Component = null;
    private scr_BtnNewShare: cc.Component = null;
    protected SetDynamicSubUI () {
        this.dynamicSubUI = [
            ['UI_Role_Info_S', 'UIRoleInfoTS',this.scr_RoleInfo],
            ['UI_Lobby_FnEntrys', 'UILobbyFnEntrys',this.scr_FnEntrys],
        ]
    }
    protected OnInit(){
        super.OnInit();
        // this.HandleNotify(true);


        
        this.txtAllPlayerCount.string = '';
        
        
        if(this.btn_TestBattleEntry) {
            this.btnTestBattleEntry = this.btn_TestBattleEntry.getComponent('UIButton') as cc.Component;
            this.btnTestBattleEntry.SetInfo(()=>{
                hxfn.map.curGameTypId = hxfn.map.Enum_GameplayId.FightLandlords;//this.gameplayID;
                hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_RoomTypMgr_new2');
                // hxjs.module.ui.hub.LoadPanel_Dlg('battle/landlord/UI_Battle_Landlords_Main');
            });
            
            this.btnTestBattleEntry.node.active = hxdt.setting_comn.isTest;
        }

        if(this.btnNewShare){
            this.scr_BtnNewShare = this.btnNewShare.getComponent('UIButton') as cc.Component;
            this.scr_BtnNewShare.SetInfo(()=>{
                hxfn.lobby.PopShare();

            })
        }
    }
    
    public OnStart () {
        if(hxjs.uwcontroller.curState != hxdt.enum_game.Enum_GameState.Lobby)
        return;

        super.OnStart();
       
        //请求跑马灯信息，开启跑马灯
        this.loopNotify = this.loopNotifyCon.getComponent('UILoop');
        hxfn.lobby.RegistLobbyBroadcastUI (this.loopNotify); 
        
        // if(this.node != null){
        //     hxfn.comn.HandleDelayLoadObj(this.node, hxdt.enum_game.Enum_GameState.Lobby);
        // }
        
        this.schedule(function(){
            hxfn.mail.GetAllMailsFromServer(null); 
            hxfn.lobby.GetBroadcastList();
        }.bind(this),60*5,0,0);
        // if(hxfn.lobby.activityMsg){
        //     this.pageView.node.active = false;
        //     this.pageView1.node.active = true;
        // }
        // else{
        //     this.pageView1.node.active = false;
        //     this.pageView.node.active = true;
        // }
        window.setInterval(()=>{
            if(this.pageView && this.pageView1) {
                this.pageView.getComponent(cc.PageView).scrollToPage((++this.pageIdx)%2);
                this.pageView1.getComponent(cc.PageView).scrollToPage((++this.pageIdx)%3);

            }
        },6000);

        if(this.btnSendnotify){
            this.btnSendnotify.getComponent('UIButton').SetInfo(()=>{
                hxfn.lobby.GetBroadcastQual();
            });
        }

        if(this.btnRoomNumber){
            this.btnRoomNumber.getComponent('UIButton').SetInfo(function(){this.LoadNobgFn("UI_Lobby_RoomDirectFind")}.bind(this),'输入房间号');
        }
        if(this.btnBind){
            this.btnBind.getComponent('UIButton').SetInfo(()=>{
                hxfn.global.detailIndex = 1;
                hxjs.module.ui.hub.LoadPanel_Dlg('UI_Role_DetailNew');
            })
        }
    }

    OnEnd () {
        super.OnEnd();

        // this.HandleNotify(false);

        hxfn.lobby.UnregistLobbyBroadcastUI (); 
        
        // // 处理卸载异步延时嵌入加载的面板
        // if(this.uiRoleInfo != null)
        // hxjs.module.ui.hub.Unload (this.uiRoleInfo);
        // if(this.uiLobbyFnEntrys != null)
        // hxjs.module.ui.hub.Unload (this.uiLobbyFnEntrys);

        // this.isLoadedRoleInfo = false;
        // this.isLoadedFns = false;
    }
    onDestroy () {
        this.OnEnd();
    }
    ///////////////////////////////////////////////////////////////////

    // protected CheckCompleteDelayLoad (){
    //     if(this.isLoadedRoleInfo && this.isLoadedFns){
    //         this.InitComplete();

    //         //HACK
    //         this.OnStartReal();
    //     }
    // }
    public OnStartReal (){
        super.OnStartReal();
        this.UpdateAllPlayerCount();
        this.UpdateAllGamePlayers();
    }

    protected DefaultNotify (isHandle:Boolean) {
        if(isHandle) {
            hxjs.util.Notifier.on('lobby_allPlayerCount', this.UpdateAllPlayerCount, this);
            hxjs.util.Notifier.on('lobby_allGameplays', this.UpdateAllGamePlayers, this);
            hxjs.util.Notifier.on('NewActivity', this.NewActivity, this);
            hxjs.util.Notifier.on('Broadcast',this.ShowLoopBg,this);
        }
        else {
            hxjs.util.Notifier.off('lobby_allPlayerCount', this.UpdateAllPlayerCount, this);
            hxjs.util.Notifier.off('lobby_allGameplays', this.UpdateAllGamePlayers, this);
            hxjs.util.Notifier.off('NewActivity', this.NewActivity, this);
            hxjs.util.Notifier.off('Broadcast',this.ShowLoopBg,this);
        }
    }

    ShowLoopBg(isShow){
        if(this.bgLoop){
            this.bgLoop.active = isShow;
        }
    }

    NewActivity(){
        this.pageView.node.active = false;
        this.pageView1.node.active = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////
    // private CheckDelayLoad (uiname:string, prefab:cc.Node){
    //     if(uiname==='UI_Role_Info_S'){
    //         this.uiRoleInfo = prefab;

    //         if(prefab != null){
    //             if(hxfn.comn.HandleDelayLoadObj(prefab, hxdt.enum_game.Enum_GameState.Lobby))
    //                 this.isLoadedRoleInfo = false;
    //             else{
    //                 this.isLoadedRoleInfo = true;
    //                 this.CheckCompleteDelayLoad();   
    //             }
    //         }
    //     }
    //     else if(uiname==='UI_Lobby_FnEntrys'){
    //         this.uiLobbyFnEntrys = prefab;
            
    //         if(prefab != null){
    //             if(hxfn.comn.HandleDelayLoadObj(prefab, hxdt.enum_game.Enum_GameState.Lobby))
    //                 this.isLoadedFns = false;
    //             else {
    //                 this.isLoadedFns = true;
    //                 this.CheckCompleteDelayLoad();
    //             }
    //         }
    //     }
    // }
    
        
    private UpdateAllPlayerCount (){
        // cc.log('UpdateAllPlayerCount');
        // cc.log(hxfn.lobby.allPlayerCount);
        if(this.txtAllPlayerCount) {
            this.txtAllPlayerCount.string = hxfn.lobby.allPlayerCount + '';
        }
    }
    private UpdateAllGamePlayers (){
        // cc.log('UpdateAllGamePlayers');
        // cc.log(hxfn.lobby.allGameplays);
        if(this.lstGames != null)
            this.lstGames.getComponent('UIScrollView').populateList(hxfn.lobby.allGameplays);
    }
    
    public ToggleSceneBaseUI (isShow){
        super.ToggleSceneBaseUI(isShow);

        this.conRoleInfo.active = isShow;
        this.conBasic.active = isShow;
        this.conFnEntry.active = isShow;
    }

    LoadNobgFn (fnPanelName) {
        //this.ToggleLobbyBaseUI(false);
        hxjs.module.ui.hub.LoadPanel_DlgPop(fnPanelName);
    }

    CloseFnPanels (){
        //if(hxjs.module.ui.hub.HasAllPoped()) {
            this.ToggleLobbyBaseUI(true);
        //}
    }

    ToggleLobbyBaseUI (isShow){
        this.conRoleInfo.active = isShow;
        this.conBasic.active = isShow;
        this.conFnEntry.active = isShow;
        if(this.conLoop){
            this.conLoop.active = isShow;
        }
    }
}
