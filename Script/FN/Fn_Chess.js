export let chess = {
    chessNotifiers: null,
    chessSyncMessages:null,
    chessAckCallbacks:null,
    //chessMapNoti
    OnInit(){
        //需要同步的消息
        this.chessSyncMessages = [
            'GBTipChessDown',
            'GBActChessDown',
            'GBActionTurn',
            'GBSyncRingEnd',
            'GBPlayerGiveup',
            'SyncPlayerReady',
        ];
    },

    
}