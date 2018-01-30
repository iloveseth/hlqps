import { hxfn } from '../../FN/HXFN';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        rolRecord: require('UIScrollView'),
        preRecord: [cc.Prefab],
        content: cc.Node,
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
    // use this for initialization
    onLoad: function () {
        this.OnInit('战绩');//'ui_lobby_fn_close', 
        hxfn.netrequest.Req_GetBalanceHistory(function(msg){
            if(msg.historyList){
                var info = msg.historyList;

                msg.historyList.forEach((info)=>{
                    var playerNum = info.playerRecord.length;
                    var preIdx = parseInt((playerNum - 1)/2);

                    var preNode = cc.instantiate(this.preRecord[preIdx]);
                    var src_node = preNode.getComponent('UIItemRecord');
                    this.content.addChild(preNode);
                    src_node.SetInfo(info);
                });
            }
        }.bind(this))
    },


});
