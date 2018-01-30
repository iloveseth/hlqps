cc.Class({
    extends: cc.Component,

    properties: {
        txtTime:cc.Label,
        conHands:[cc.Node],

        timerRound:{default: null, serializable: false, visible: false,},
        state:{default: null, serializable: false, visible: false,},
        msgBegin:{default: null, serializable: false, visible: false,},
    },

    // LIFE-CYCLE CALLBACKS: ///////////////////////////////////////////////////////////
    OnInit () { 
        this.Reset();
        this.notifiers = [
            'Gobang_GBSyncRingEnd',
            'Gobang_GBSyncRingBegin',
            'Gobang_GBTipChessDown',
            'Gobang_GBActChessDown',
            'Five_DisplayRoles',
            'Room_SyncPlayerQuitRoom',
            'Room_SyncPlayerLost'
        ];
        eval(hxfn.global.HandleNotifiersStr(this.notifiers,true));
        //InitGameView();
    },
    //嵌入对象利用父对象进行初始化及启动
    OnStart () {
        
    },

    Reset(){
        cc.log('resets')
        hxfn.global.HandleNodes(this.conHands,false);
        this.conHands.forEach(element => {
            element.getComponent('UIGobangHand').StopHandCountDown(0);
        });
        this.DisplayTime(0);
    },

    OnEnd(){
        eval(hxfn.global.HandleNotifiersStr(this.notifiers,false));
        if(this.timerRound){
            window.clearInterval(this.timerRound);
            this.timerRound = null;
        }
    },

    // update (dt) {},
    ///////////////////////////////////////////////////////////////////////////////////////

    Room_SyncPlayerLost(){
        this.StopCountDown();
        this.Reset();
    },
    
    Room_SyncPlayerQuitRoom(){
        this.StopCountDown();
        this.Reset();
    },

    StartCountDown(time){
        this.timerRound = window.setInterval(function(){
            this.DisplayTime(time--);
        }.bind(this),1000);
    },

    DisplayTime(time){
        var min = parseInt(time/60);
        var sec = parseInt(time%60);
        if(min < 10){
            min = '0' + min;
        }
        if(sec < 10){
            sec = '0' + sec;
        }
        this.txtTime.string = min + ':' + sec;
    },

    StopCountDown(){
        window.clearInterval(this.timerRound);
        this.timerRound = null;
    },

    Gobang_GBSyncRingEnd(){
        this.StopCountDown();
        this.Reset();
    },

    Gobang_GBSyncRingBegin(msg){
        this.msgBegin = msg;
        this.StartCountDown(parseInt(hxfn.five.GetGameProto().ringLimitTime));
        var blackPlayerId = msg.blackPlayerId;
        var whitePlayerId = msg.whitePlayerId;
        var players = [blackPlayerId,whitePlayerId];
        for(var idx = 0;idx != players.length; ++ idx){
            var seat = hxfn.five.GetUISeatById(players[idx]);
            this.conHands[seat].getComponent('UIGobangHand').SetHand(idx);
        }
        hxfn.global.HandleNodes(this.conHands,true);
        hxfn.five.SetHand(players.indexOf(hxfn.role.curUserData.playerData.playerId));
    },
    
    Gobang_GBTipChessDown(msg){
        var hand = msg.blackOrWhite;
        if(hxfn.five.ToMyHand(hand) == hxfn.five.myHand){//该自己下棋
            this.conHands[0].getComponent('UIGobangHand').StartHandCountDown(parseInt(msg.cdMS/1000));
            this.conHands[1].getComponent('UIGobangHand').StopHandCountDown(parseInt(msg.cdMS/1000));
        }
        else{
            this.conHands[1].getComponent('UIGobangHand').StartHandCountDown(parseInt(msg.cdMS/1000));
            this.conHands[0].getComponent('UIGobangHand').StopHandCountDown(parseInt(msg.cdMS/1000));
        }
    },

    Gobang_GBActChessDown(msg){
        //关闭本方计时器
        //打开对方计时器
        //var hand = msg.blackOrWhite;
        //this.conHands[hand-1].getComponent('UIGobangHand').StopHandCountDown(parseInt(msg.cdMS/1000));
        //this.conHands[2-hand].getComponent('UIGobangHand').StartHandCountDown(parseInt(msg.cdMS/1000));
    },

    // GamePhases: cc.Enum({
    //     Init,//初始化
    //     TipChessDown,//提示落子
    //     WaitChessDown,//等待落子
    //     Balance,//结算
    //     Finish,//结束
    // }),

    // RoomPhases: cc.Enum({
    //     RoomWait,//等待
    //     RoomCountDown,//开局倒数
    //     RoomCDBreak,//新玩家加入，倒数被打断
    //     RingInit,//一局初始化
    //     RingBegin,//一局开始
    //     RingEnd,//一局结束
    //     RoomEnd,//结束
    // }),
    InitGameView(){//初始化游戏表现//这里主要指黑白和倒计时
        switch(hxfn.five.GetRoomPhase()){
            case hxfn.five.RoomPhases.RoomWait:
            case hxfn.five.RoomPhases.RoomCountDown:
            {
                break;
            }
            case hxfn.five.RoomPhases.RingInit:
            case hxfn.five.RoomPhase.RingBegin:
            this.Reset();
            {
                //只有房间有两个人的时候才会进行表现，否则一律显示初始界面。
                if(hxfn.five.gameProto.players > 2){
                    this.DisplayTime(hxfn.five.gameProto.ringRemainingTime);
                    hxfn.global.HandleNodes(this.conHands,true);
                    //设置黑白
                    this.conHands[0].getComponent('UIGobangHand').SetHand(hxfn.five.myHand);
                    this.conHands[1].getComponent('UIGobangHand').SetHand( 1 - hxfn.five.myHand);
                    //设置定时器
                    var curId = hxfn.five.gameProto.curMovePlayerId;
                    var cdMS = hxfn.five.GetRoleById(curId).cdMS;
                    //设置活动玩家的定时器
                    this.conHands[hxfn.GetUISeatById(curId)].getComponent('UIGobangHand').StartCountDown(parseInt(cdMS));
                    //设置等待玩家的定时器
                    this.conHands[hxfn.GetUISeatById(curId)].getComponent('UIGobangHand').SetHandTime(parseInt(hxfn.five.cdS));                    
                }
                break;
               
            }
        }
    },

    Five_DisplayRoles(){
        // this.Reset();
    },

    GetGameTime(){
        var timeStr = this.txtTime.string;
        var timeArray = timeStr.split(':');
        var timeleft = timeArray[0]*60 + timeArray[1];
        var timeGame = 600 - timeleft;
        return parseInt(timeGame);
    },
});
