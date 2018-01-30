cc.Class({
    extends: cc.Component,

    properties: {
        chess:[cc.Prefab],//0黑1白
        imgChessMap:cc.Node,
        imgSquare:cc.Node,

        mapGrid:{default: null, serializable: false, visible: false,},

        mapCenterX:{default: null, serializable: false, visible: false,},
        mapCenterY:{default: null, serializable: false, visible: false,},
        chessCenterX:{default: null, serializable: false, visible: false,},
        chessCenterY:{default: null, serializable: false, visible: false,},

        onNotifiers:{default: null, serializable: false, visible: false,},
        notifiers:{default: null, serializable: false, visible: false,},
        state:{default: null, serializable: false, visible: false,},
    },

    /////////////////////////////////////////////////////////////////////////////////
    // LIFE-CYCLE CALLBACKS:
    OnInit () {
        this.notifiers = [
            'Gobang_GBTipChessDown',
            'Gobang_GBActChessDown',
            //'Five_DisplayRoles',
            'Gobang_GBSyncRingEnd',
            'Gobang_GBSyncRingBegin',
            'Room_SyncPlayerQuitRoom',
            'Room_SyncPlayerLost'
        ];
        eval(hxfn.global.HandleNotifiersStr(this.notifiers,true));
        
        this.mapCenterX = 569;
        this.mapCenterY = 324;
        this.chessCenterX = 0;
        this.chessCenterY = 0;
    
        this.mapGrid = 42;    
        this.imgSquare.active = false;    
        //this.SetMapEnable(true);
        //this.SetState(1);
    },
    //三种坐标
    //1.棋盘坐标，中心0，0
    //2.触摸事件坐标
    //3.服务器坐标
    
    //嵌入对象利用父对象进行初始化
    // start () {
    OnStart(){
        
    },

    OnReset(){
        // this.SetState(1);
    },

    OnEnd(){
        this.SetMapEnable(false);
        eval(hxfn.global.HandleNotifiersStr(this.notifiers,false));
    },
    /////////////////////////////////////////////////////////////////////////////////

    ClearAllChess(){
        this.imgChessMap.removeAllChildren();
    },

    Room_SyncPlayerLost(){
        this.SetState(1);
    },

    PlaceChessFromClient(event){
        cc.log('placechess');
        var pos = event.getLocation();
        cc.log(pos);
        var chessX = Math.round((pos.x - this.mapCenterX)/this.mapGrid);
        var chessY = Math.round((pos.y - this.mapCenterY)/this.mapGrid);
        var serverX = chessX + 7;
        var serverY = 7 - chessY;
        if(serverX < 0 || serverX > 14 || serverY < 0 || serverY > 14){
            return;
        }
        //this.node.off(cc.Node.EventType.TOUCH_END);
        hxfn.five.SetServerXY(serverX,serverY);
        hxfn.five.GBInputChessDown();
    },

    PlaceChessFromServer(x,y,hand){
        //hand:1黑2白
        var myHand = hand - 1;
        var chessX = x - 7;
        var chessY = 7 - y;
        var chessAbsoluteX = chessX * this.mapGrid + this.chessCenterX;
        var chessAbsoluteY = chessY * this.mapGrid + this.chessCenterY;
        var chess = cc.instantiate(this.chess[myHand]);
        chess.x = chessAbsoluteX;
        chess.y = chessAbsoluteY;

        this.imgChessMap.addChild(chess);
        this.imgSquare.x = chessAbsoluteX;
        this.imgSquare.y = chessAbsoluteY;
        this.imgSquare.active =  true;
        //如果白方落子，开启黑方定时器
    },

    SetMapEnable(isEnable){
        if(isEnable){
            this.imgChessMap.on('touchend',this.PlaceChessFromClient.bind(this),this);
        }
        else{
            // this.imgChessMap.off('touchend',this.PlaceChessFromClient.bind(this),this);
            this.imgChessMap.off('touchend');
        }
    },

    Gobang_GBTipChessDown(msg){
        var blackOrWhite = msg.blackOrWhite;
        if(blackOrWhite - 1 == hxfn.five.myHand){
            //this.SetMapEnable(true);
        }
    },

    // Five_DisplayRoles(){
    //     this.ClearAllChess();
    // },

    Gobang_GBSyncRingEnd(msg){
        //清理棋盘
        //this.imgChessMap.off('touchend',this.PlaceChessFromClient.bind(this),this);
        this.SetState(1);
        //cc.log('游戏结束');
    },

    Gobang_GBSyncRingBegin(){
        this.SetState(2);
    },

    Gobang_GBActChessDown(msg){
        //this.SetMapEnable(false);
        this.PlaceChessFromServer(msg.x,msg.y,msg.blackOrWhite);
    },

    //显示棋盘
    DisplayChessTable(){
        for(var idx = 0;idx != hxfn.five.roles.length;++idx){
            var hand = hxfn.five.roles[idx].blackOrWhite;
            if(hand){
                for(var idy = 0;idy != hxfn.five.roles[idx].chessDownId.length; ++ idy){
                    var x = parseInt(hxfn.five.roles[idx].chessDownId[idy]%15);
                    var y = parseInt(hxfn.five.roles[idx].chessDownId[idy]/15);
                    this.PlaceChessFromServer(x,y,hand);
                }
            }
        }
    },

    SetState(state){
        this.state = state;
        switch(state){
            case 1://初始状态：半透明
            {
                this.ClearAllChess();
                this.imgSquare.active = false;
                this.SetMapEnable(false);
                //this.node.opacity = 127;
                break;
            }
            case 2://游戏开始
            {
                this.ClearAllChess();
                this.SetMapEnable(true);
                //this.node.opacity = 255;
                break;
            }
        }
    },
    Room_SyncPlayerQuitRoom(){
        this.SetState(1);
    }
  
});
