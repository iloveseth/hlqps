// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        txtGameType: cc.Label,
        txtRoomType: cc.Label,
        txtRoomId: cc.Label,
        txtGameMode: cc.Label,
        txtTitleGameMode: cc.Label,
        txtTime: cc.Label,
        playerBalance:[cc.Label],
        playerName:[cc.Label],
        playerId:[cc.Label],
        txtGameOption: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },


//     message GetBalanceHistoryResp {
//     repeated BalanceRecordProto historyList = 1;    //历史结算
// }
//
// message BalanceRecordProto {
//     optional int32 roomType = 1;    //房间类型
//     optional int32 gameType = 2;    //游戏类型
//     optional int32 subGame = 3;     //子游戏类型
//     optional string ringId = 4;     //本轮游戏ID，万一以后用呢……
//     optional string dateTime = 5;   //结算日期
//     repeated PlayerBalanceProto playerRecord = 6;   //本轮各玩家的结算
// }
//
// message PlayerBalanceProto {
//     optional string playerId = 1;
//     optional string nickName = 2;
//     optional int32 balance = 3;     //结算点数
// }

    SetInfo(info,idx){
        this.Reset();
        var playerNum = info.playerRecord.length;
        this.txtGameType.string = hxfn.map.GetGameplayName(info.gameType);
        this.txtRoomType.string = '【' + hxfn.map.GetRoomTypeName(info.roomType) + '】';
        var hasMode = !(info.gameType == 4);
        this.txtGameMode.node.active = hasMode;
        this.txtTitleGameMode.node.active = false;
        this.txtGameMode.string = hxfn.map.GetGameModeName(info.subGame);

        this.txtTime.string = info.dateTime.substr(0,info.dateTime.length - 3);
        var newRecord = info.playerRecord;
        for(var idx = 0;idx != playerNum; ++idx){
            if(newRecord[idx].playerId == hxfn.role.curUserData.playerData.playerId){
                var temp = newRecord[0];
                newRecord[0] = newRecord[idx];
                newRecord[idx] = temp;
            }
        }

        for(var idx = 0;idx!= playerNum;++idx){
            this.playerName[idx].string = newRecord[idx].nickName;
            //this.playerId[idx].node.x = this.playerName[idx].node.x + this.playerName[idx].node.width;
            this.playerId[idx].string = '(ID:' + newRecord[idx].playerId + ') : '
            this.playerBalance[idx].node.x = this.playerId[idx].node.x + this.playerId[idx].node.width;
            this.playerBalance[idx].node.color = newRecord[idx].balance >= 0 ? new cc.Color().fromHEX('#EFD45F') : new cc.Color().fromHEX('#F07F5F');
            this.playerBalance[idx].string = newRecord[idx].balance > 0 ? '+' + newRecord[idx].balance : newRecord[idx].balance + '';
        }
        this.leftWidth = 0;
        for(var idy = 0;idy < playerNum; idy += 2){
            if(this.leftWidth < this.playerName[idy].node.width){
                this.leftWidth = this.playerName[idy].node.width
            }
        }

        this.rightWidth = 0;
        for(var idz = 1;idz - 1 < playerNum; idz += 2){
            if(this.rightWidth < this.playerName[idz].node.width){
                this.rightWidth = this.playerName[idz].node.width
            }
        }

        for(var idy = 0;idy < playerNum; idy += 2){
            this.playerName[idy].node.x = this.playerId[idy].node.x - this.leftWidth;
        }
        for(var idz = 1;idz - 1 < playerNum; idz += 2){
            this.playerName[idz].node.x = this.playerId[idz].node.x - this.rightWidth;
        }
    },

    Reset(){
        this.txtGameType.string = '';
        this.txtRoomType.string = '';
        //this.txtRoomId.string = '';
        this.txtGameMode.string = '';
        this.txtTime.string = '';
        this.txtGameOption.string = '';
        this.playerName.forEach((element)=>{
            element.string = '';
        });
        this.playerId.forEach((element) => {
            element.string = '';
        });
        this.playerBalance.forEach((element)=>{
            element.string = '';
        })

    }
    // update (dt) {},
});
