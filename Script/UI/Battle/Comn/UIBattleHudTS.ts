import { hxfn } from "../../../FN/HXFN";
import { hxdt } from "../../../DT/HXDT";
import { hxjs } from "../../../../HXJS/HXJS";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleHud extends cc.Component implements IUISub
{
    //所有功能按钮
    @property({type:require('UIButton')})
    private btnQuit:cc.Component = null;
    @property({type:require('UIButton')})
    private btnGetCoin:cc.Component = null;
    @property({type:require('UIButton')})
    private btnRule:cc.Component = null;
    @property({type:require('UIButton')})
    private btnChat:cc.Component = null;
    @property({type:require('UIButton')})
    private btnTalk:cc.Component = null;
    @property({type:require('UIButton')})
    private btnSetting:cc.Component = null;
    @property({type:require('UIButton')})
    private btnTestReset:cc.Component = null;
    @property({type:cc.Node})
    private conSafeGuard: cc.Node = null;

    //折叠功能按钮
    @property({type:require('UIButton')})
    private btnToggleMenu:cc.Component = null;
    @property({type:cc.Node})
    private conMenu: cc.Node = null;

    @property({type:require('UIButton')})
    private btnTestCoin:cc.Component = null;
    

    private isShowMmenu:boolean = false;
    private isShowRule:boolean = false;
    private isStartRecord:boolean = false;
    private RecordPrefab:cc.Node = null;
    
    private hasShowSafeGuardOnce:boolean = false;


    // LIFE-CYCLE CALLBACKS: /////////////////////////////////////////////////////////
    public OnInit(): void{
        hxfn.adjust.AdjustLabel(this.node);
    }
    public OnStart(): void{
        this.HandleServerInform (true);
        // this.HandleNotify (true);
    }
    public OnReset () {
        //没有数据变化，不需要刷新
    }
    public OnEnd(): void{
        this.HandleServerInform (false);
        // this.HandleNotify (false);

        this.hasShowSafeGuardOnce = false;
    }
    public OnStartReal(): void{
        this.btnGetCoin.node.active = !(hxfn.map.curRoomTyp === 0/*金币场*/);
    }
    //////////////////////////////////////////////////////////////////////////////////

    private HandleServerInform (isHandle:boolean){
        if(isHandle) {
            //服务器推送此条信息一定是在至少第一局结束之后，所以在此注册，时机上没有问题
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.NoticeSafeGuard,this.NoticeSafeGuard.bind(this));
        }else{
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.NoticeSafeGuard);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////

    NoticeSafeGuard () {
        if(hxfn.map.curRoomTyp == 1/*元宝场*/) {
            if(this.hasShowSafeGuardOnce)
                return;
                
            this.hasShowSafeGuardOnce = true;

            // if(!this.conSafeGuard.activeInHierarchy) {
                hxjs.module.ui.hub.ShowCom(this.conSafeGuard);
            // }
        }
    }

    QuitRoomCheck() {
        if(hxfn.battle.hasPlayedCurGame && hxfn.battle.isBattlePlaying) {
            hxjs.module.ui.hub.LoadDlg_Check(
                hxdt.setting.lang.Battle_Quit_Notify,
                this.QuitRoomReq.bind(this),
                null,
                '友情提示',
            );
        }
        else {
            this.QuitRoomReq();
        }
    }

    QuitRoomReq (){
        // if(hxfn.battle.IsBattlePlaying()) {
            hxjs.module.ui.hub.ShowWaitingUI();
            hxfn.netrequest.Req_QuitRoom(hxfn.role.playerId, this.QuitRoomSucc.bind(this));
        // }
    }

    QuitRoomSucc (info:any) {
        hxjs.module.ui.hub.HideWaitingUI();
        if(info.get('result') == 0/*OK*/) {
            // hxjs.util.Notifier.emit('UI_BattleQuit');
            hxfn.battle.QuitNormal();
        }
    }

    OpenShop(){
        //不管有没有提示，一旦点击打开商店，就关闭元宝不足提示
        hxjs.module.ui.hub.HideCom(this.conSafeGuard);

        hxfn.shop.curShop = 0;//元宝房
        hxfn.shop.GetMarketList(
            function(){
                hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Shop_new2');
            }.bind(this)
        );
    }

    ShowMenu (isShow:boolean) {
        this.conMenu.active = isShow;
    }
    StartRecord(){
        if(this.isStartRecord==false){ 
            this.isStartRecord=true; 

            if(hxfn.bridge.StartRecord()==true){
                hxjs.module.ui.hub.LoadPanel('UI_Comn_Record',function(prefab){
                    this.RecordPrefab=prefab;
                    if(this.isStartRecord==false){
                        hxjs.module.ui.hub.Unload(this.RecordPrefab);
                        this.RecordPrefab=null;
                    }
    
                }.bind(this));
                this.scheduleOnce(function(){
                this.EndRecord();
                }.bind(this), hxdt.setting_niuniu.Anim_Voice_Record_Time);

                //禁用背景音乐
                hxjs.module.sound.Silence();
            }
        }
    }
    EndRecord(){
        if(this.isStartRecord){
            if(this.RecordPrefab!=null){
                hxjs.module.ui.hub.Unload(this.RecordPrefab);
                this.RecordPrefab=null;
            }
     
            hxfn.bridge.StopRecord();
        }
        this.isStartRecord=false;

        //恢复背景音乐
        hxjs.module.sound.Recover();
    }
}
