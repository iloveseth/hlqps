import { hxfn } from '../../../FN/HXFN';

////////////////////////////////////////////////////////////////////////
// 1, eval调试不直观
// 2, 多处注册消息 不方便
// 3, 子对象最好由父对象直接管理，初始化，跟更新，与结束生命周期
////////////////////////////////////////////////////////////////////////

cc.Class({
    extends: require('UIPanelSceneJS'),//cc.Component,

    properties: {
        txtRoomId:cc.Label,
        txtFee:cc.Label,
        btnSetFee:require('UIButton'),
        btnGiveup:require('UIButton'),
        btnReady:require('UIButton'),
        btnStart:require('UIButton'),

        conDisplay:require('UIGobangDisplay'),
        chessMap:require('UIGobangChessMap'),
        scrRoleMgr:require('UIGobangRoleManager'),

        notifiers: {default: null, serializable: false, visible: false,},
        nodeWait: cc.Node,

        isLoadThis:{default: false,serializable: false, visible: false},
    },

    /////////////////////////////////////////////////////////////////////////
    onLoad: function () {
        this.notifiers = [
            'Gobang_GBTipChessDown',
            'Gobang_GBActChessDown',
            //'Gobang_GBActionTurn',
            'Gobang_GBSyncRingBegin',
            'Gobang_GBSyncRingEnd',
            'Gobang_SyncPlayerReady',
            'Gobang_GBSyncSetTuition',
            'Gobang_GBSyncPlayerGiveup',

            'Five_DisplayRoles',
            // 'Room_SyncPlayerJoinRoom',
            'Room_SyncForceLeft',
            // 'Room_SyncPlayerQuitRoom',
            // 'Room_SyncPlayerLost',
        ];

        this.btnSetFee.SetInfo(this.OpenSetFee.bind(this),'设置学费');
        this.btnGiveup.SetInfo(this.Giveup.bind(this),'认输');
        this.btnReady.SetInfo(this.Ready.bind(this),'准备');
        this.btnStart.SetInfo(this.StartGame.bind(this));
    },

    StartGame(){
        hxfn.five.SyncPlayerReady();
        //如果是房主  直接开始游戏
        this.btnStart.node.active = false;
    },

    start:function (){
        this.scrRoleMgr.OnInit();
        this.conDisplay.OnInit();
        this.chessMap.OnInit();


        // this.SetFee(hxfn.five.tuition);
        // this.txtRoomId.string = hxfn.level.roomId;
        // //this.SetState(0);
        // // this.SetState(1);
        // this.Five_DisplayRoles();



        //handle notifiers true
        eval(hxfn.global.HandleNotifiersStr(this.notifiers,true));
        hxjs.util.Notifier.on('Battle_ReadyData', this.RealStart, this);
        hxjs.util.Notifier.on('[Gobang]_DataRefresh', this.RefreshData, this);

        this.isLoadThis = true;
        this.CheckDelayLoadComplete();
    },

    OnReset (){
        this.ClearBattleInsObjs();

        this.scrRoleMgr.OnReset();
    },

    //为每局的开始做清理！！！！！！！！！！！！！！！
    //清理的是牌局中的临时表现
    ClearBattleInsObjs:function (){
        this.unscheduleAllCallbacks(this);

        if(this.conDisplay)
            this.conDisplay.Reset();
        if(this.chessMap)
            this.chessMap.OnReset();
    },

    OnEnd(){
        this.scrRoleMgr.OnEnd();
        this.conDisplay.OnEnd();
        this.chessMap.OnEnd();

        this.isLoadThis = false;
        //handle notifiers false
        eval(hxfn.global.HandleNotifiersStr(this.notifiers,false));
        hxjs.util.Notifier.off('Battle_ReadyData', this.RealStart, this);
        hxjs.util.Notifier.off('[Gobang]_DataRefresh', this.RefreshData, this);
    },

    // onDestroy: function(){
    //     this.OnEnd();
    // },
    /////////////////////////////////////////////////////////////////////////

    CheckDelayLoadComplete:function (){
        if(this.isLoadThis){
            hxfn.battle.Regist_Main(this);
            this.InitComplete();
        }
    },

    RealStart(){
        this.scrRoleMgr.OnStart();
        this.conDisplay.OnStart();
        this.chessMap.OnStart();


        this.SetFee(hxfn.five.tuition);
        this.txtRoomId.string = hxfn.level.roomId;

        //this.SetState(0);
        // this.SetState(1);
        this.Five_DisplayRoles();
    },

    RefreshData (){
        this.OnReset();

        //HACK
        this.RealStart();
    },

    Five_DisplayRoles(){
        this.SetState(1);
    },
    SetFee(fee){
        this.txtFee.string = parseInt(fee) + '元宝';
    },
    OpenSetFee(){
        hxjs.module.ui.hub.LoadPanel_Dlg('UI_Battle_Gobang_Fee');
    },
    Giveup(){
        hxjs.module.ui.hub.LoadDlg_Check(
            '三分钟内认输将向对方支付学费' + hxfn.five.tuition + '元宝，是否确定',
            function(){
                if(hxfn.five.tuition > 0 && parseInt(hxfn.role.curUserData.goldenInfo.yuanbao) + parseInt(hxfn.role.curUserData.goldenInfo.bankYuanbao) - parseInt(hxfn.five.tuition) < 3000){
                    hxjs.module.ui.hub.LoadDlg_Info('认输后自身元宝余额不能低于3000，请房主调整学费','无法认输');
                    return;
                }
                hxfn.five.Giveup();
            },
            null,
            '',
            '确认',
            '取消',
        );
    },
    Ready(){
        hxfn.five.SyncPlayerReady();
        //如果是房主  直接开始游戏
        this.btnReady.node.active = false;
        //}
    },

    //这里只负责根据不同的房间状态显示或隐藏按钮
    SetState(state){
        hxfn.five.gameState = state;
        switch(state){
            case hxfn.five.GameStates.State_1:
            {//房主：房客加入但是没有点准备
                if(!hxfn.five.IsMaster(hxfn.role.curUserData.playerData.playerId)){
                    this.btnReady.ToggleEnable(true);
                    this.btnReady.SetName('准备');
                    hxfn.global.HandleNodes([this.btnReady.node],true);
                    hxfn.global.HandleNodes([this.btnGiveup.node,this.btnSetFee.node,this.nodeWait,this.btnStart.node],false);
                }
                else{
                    this.btnReady.ToggleEnable(false);
                    this.btnReady.SetName('等待开始');
                    hxfn.global.HandleNodes([this.btnSetFee.node,this.nodeWait],true);
                    hxfn.global.HandleNodes([this.btnGiveup.node,this.btnReady.node,this.btnStart.node],false);
                }
                break;
            }
            case hxfn.five.GameStates.State_2:
            {
                //房客加入并且已经点击准备
                if(!hxfn.five.IsMaster(hxfn.role.curUserData.playerData.playerId)){//房客
                    this.btnReady.ToggleEnable(false);
                    hxfn.global.HandleNodes([this.nodeWait],true);
                    hxfn.global.HandleNodes([this.btnReady.node,this.btnGiveup.node,this.btnSetFee.node,this.btnStart.node],false);
                }
                else{//房主
                    this.btnReady.ToggleEnable(true);
                    this.btnReady.SetName('开始游戏');
                    hxfn.global.HandleNodes([this.btnStart.node],true);
                    hxfn.global.HandleNodes([this.btnReady.node,this.btnGiveup.node,this.btnSetFee.node,this.nodeWait],false);
                }
                break;
            }
            case hxfn.five.GameStates.State_3:
            {
                //房主已经点击准备，游戏已经开始
                hxfn.five.isGiveup = false;
                hxfn.global.HandleNodes([this.btnSetFee.node,this.btnReady.node,this.nodeWait,this.btnStart,this.nodeWait],false);
                hxfn.global.HandleNodes([this.btnGiveup.node],true);
                break;
            }
            // case hxfn.five.gameState.State_4:
            // {
            //     //游戏结束
            //     //房主显示设置学费和准备按钮
            //     //房客显示准备按钮
            //     if(hxfn.five.IsMaster(hxfn.role.curUserData.playerData.playerId)){
            //         this.btnReady.ToggleEnable(false);
            //         this.btnReady.SetName('无法开始');
            //         hxfn.global.HandleNodes([this.btnSetFee.node,this.btnReady.node],true);
            //         hxfn.global.HandleNodes([this.btnGiveup.node],false);
            //     }
            //     else{

            //     }
            //     break;
            // }
        }
    },
    /////////////////////////////////////////////////////////////////////////


    //GBTipChessDown
    Gobang_GBTipChessDown(msg){
        cc.log('GBtipchessdown');
    },

    Gobang_GBActChessDown(msg){
        cc.log('gbactchessdown');
        // var msg = hxdt.builder.build('GBActChessDown').decode(data);
        //this.chessMap.PlaceChessFromServer(msg.x,msg.y,msg.blackOrWhite);
    },

    // Gobang_GBActionTurn(msg){

    //     cc.log('GBactionturn');
    // },

    Gobang_GBSyncPlayerGiveup(msg){
        hxfn.five.isGiveup = true;
    },

    Gobang_SyncPlayerReady(data){
        this.SetState(2);
    },

    Gobang_GBSyncSetTuition(msg){
        cc.log('此处设置学费');
        this.SetFee(msg.tuition);
        hxfn.five.SetTuition(msg.tuition);
    },

    //1，认输
    //2，正常结束
    // 会发送此条信息
    // 且都需要显示结算信息
    Gobang_GBSyncRingEnd(msg){
        hxfn.five.SetGobangResult(msg);

        //正常结算的情况
        //庄家显示结果，但是不退出游戏
        //闲家显示结果，且退出游戏
        if(hxfn.five.IsMaster(hxfn.role.curUserData.playerData.playerId)){
            this.SetState(1);
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Battle_Gobang_End');
        }
        else{
            hxfn.five.QuitRoom4NotMaster();
        }
    },

    Gobang_GBSyncRingBegin(msg){
        hxfn.five.isGiveup = false;
        this.SetState(3);
        //hxfn.global.HandleNodes([this.btnSetFee.node],false)
    },

    Room_SyncForceLeft(data){
        cc.log('Room_SyncForceLeft');
        // hxfn.five.QuitRoom();
        hxfn.five.KickOutRoom();
    },

    //////////////////////////////////////////////////////////////////////////
    // !!!一局结束就离开，不需要同步此状态
    // Room_SyncPlayerQuitRoom(playerId){
    //     // 被踢出房间、
    //     // 发生情况为：当房主主动退出房间
    //     if(!hxfn.five.IsMaster(hxfn.role.curUserData.playerData.playerId)){
    //         hxfn.five.KickOutRoom();
    //     }
    //     else
    //         this.SetState(1);
    // },

    // Room_SyncPlayerLost(playerId){
    //     if(!hxfn.five.IsMaster(hxfn.role.curUserData.playerData.playerId)){
    //         hxfn.five.QuitRoom();
    //     }
    //     else
    //         this.SetState(1);
    // }
});
