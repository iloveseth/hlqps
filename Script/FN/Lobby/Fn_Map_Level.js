import { hxdt } from '../../DT/HXDT';
import { hxfn } from './../HXFN';
import {hxjs} from "../../../HXJS/HXJS";


export let level = 
{
    roomId : null,
    roomType: null,
    gameType: null,

    latestRoomInfo: null,
    ybRoomList: null,

    dialog: null,

    StartJoinGoldFlow () {    
        // 搜索房间-》得到可用房间号-》申请加入房间-》加入成功
        hxfn.netrequest.Req_SearchRoom(
            hxfn.map.curRoomTyp,
            hxfn.map.curGameTypId,
            this.Callback_SearchRoomReq.bind(this)
        );
    },

    StartJoinGreenRoom(){
        hxfn.netrequest.Req_SearchGreenRoom(
            hxfn.map.curRoomTyp,
            hxfn.map.curGameTypId,
            this.Callback_SearchRoomReq.bind(this)
        );
    },

    Callback_SearchRoomReq:function (msg) {//data
        // var msg_SearchRoomResp = hxdt.builder.build('SearchRoomResp');
        // var msg = msg_SearchRoomResp.decode(data);
    
        var result = msg.get('result');// int 提交搜索的结果，仅代表搜索请求提交给服务器，不代表找到匹配房间
        var roomId = msg.get('roomId');// string
    
        //检测房间ID是否有效 > 0???
        if(result == 0/*搜索成功*/ && roomId > 0) {
            hxfn.level.JoinRoom(roomId);
        }
        else {
            cc.log('======================== 搜索失败，或者无有效房间！！！');
            // if(this.dialog == 'UI_Lobby_RoomDirectFind'){
            //     hxjs.module.ui.hub.LoadTipFloat('搜索失败，或者无有效房间！！！');
            //     //this.dialog = '';
            //     return;
            // }
            hxjs.module.ui.hub.LoadDlg_Info('搜索失败，或者无有效房间！！！', '提示');
        }
    },

    // QuickJoinIngotRoom () {
    //     this.StartJoinGoldFlow();
    // },

    JoinRoom (roomId, callback = null) {
        cc.log('JoinRoom with id: ' + roomId);
        cc.log(this.dialog);
        //通过RoomID加入房间，roomID决定了房间类型，返回的结果里带有房间更多信息
        hxfn.netrequest.Req_JoinRoom(
            roomId,
            '',
            null,
            null,
            (msg)=>{
                this.Callback_JoinRoomReq(msg);//.bind(this)
                if(callback)
                    callback(msg.get('result') === 0); 
            }
        );
    },

    Callback_JoinRoomReq:function (msg) {
        var result = msg.get('result');
        var roomId = msg.get('roomId');
        var roomType = msg.get('roomType');
        var gameType = msg.get('gameType');
        // var serverId = msg.get('serverId');
    
        cc.log('加入房间结果: '+ JSON.stringify(msg));
    
        if(result === 0/*OK*/){
            hxfn.level.roomId = roomId;
            hxfn.level.roomType = roomType;
            hxfn.level.gameType = gameType;
            
            hxfn.map.UpdateRoomId(roomId);
            hxfn.map.UpdateRoomTyp(roomType);
            hxfn.map.UpdateGameTyp(gameType);
       
            hxfn.battle.curRoomId = roomId;
            hxjs.uwcontroller.SetState(hxdt.enum_game.Enum_GameState.Battle);
        }
        else {
            cc.log('======================== 加入房间失败！！！');
            if(this.dialog == 'UI_Lobby_RoomDirectFind'){
                hxjs.module.ui.hub.LoadTipFloat(hxdt.errcode.codeToDesc(result));
                hxjs.util.Notifier.emit('UI_RoomEnterFailed');
                return;
            }
            hxjs.module.ui.hub.LoadDlg_Info(hxdt.errcode.codeToDesc(result), '提示');

            hxjs.util.Notifier.emit('UI_RoomEnterFailed');
        }
    },

    CheckEnterBattle4Gold (enterLimit) {
        var isEnableEnter = false;

        if(hxfn.role.curGold < enterLimit) {
            //TODO 需要修改为破产提示!!!
            // var info = null;//获取补助信息！！！
            hxfn.comn.HandleSafeGuard(0,true);
            //hxjs.module.ui.hub.LoadDlg_Info('您当前拥有的金币少于：'+ enterLimit +'，请前往充值!', '充值提示');
        }
        else 
            isEnableEnter = true;

        return isEnableEnter;
    },

    CreateRoom(postData, callback = null){
        hxfn.netrequest.Req_CreateRoom(
            hxfn.map.curRoomTyp,
            hxfn.map.curGameTypId,
            null,
            postData,
            null,
            (msg)=>{
                var result = msg.get('creatorJoin');
                if(result) {
                    // this.SaveData();
                    if(callback)
                        callback();
                }

                this.Callback_CreateRoomReq(msg);
            }
        )
    },

    Callback_CreateRoomReq:function (msg) {

        var result = msg.get('creatorJoin');
        var roomId = msg.get('roomId');

        if(result) {
            // this.SaveData();

            if(roomId <= 0) {
                hxjs.module.ui.hub.LoadDlg_Info('这不是一个有效的房间！', '提示');
            }
            else {
                hxfn.level.JoinRoom(roomId);
            }
        }
        else {
            hxjs.module.ui.hub.LoadDlg_Info('创建者未能加入房间！', '提示');
        }
    },

    //五子棋 重构///////////////////////////////////////////////////////////////
    CreateRoomFive(roomData){
        var postData = roomData;
        hxfn.netrequest.Req_Comn(
            postData,
            hxfn.netrequest.Msg_CreateRoom,
            function(msg){
                hxfn.level.roomType = msg.roomType;
                hxfn.level.gameType = msg.gameType;
                hxfn.level.roomId = msg.roomId;
                
                var creatorJoin = msg.creatorJoin;
                if(creatorJoin) {
                    if(this.roomId <= 0) {
                        hxjs.module.ui.hub.LoadDlg_Info('这不是一个有效的房间！', '提示');
                    }
                    else {
                        hxfn.level.JoinRoom(hxfn.level.roomId);
                    }
                }
                else {
                    hxjs.module.ui.hub.LoadDlg_Info('创建者未能加入房间！', '提示');
                }
            }.bind(this),
        );
    },

    SearchAndJoinRoom(roomType,gameType){
        var postData = {
            roomType: roomType,
            gameType: gameType,
        }
        hxfn.netrequest.Req_Comn(
            postData,
            hxfn.netrequest.Msg_SearchRoom,
            function(msg){
                if(msg.result == 0 && msg.roomId > 0){
                    hxfn.level.roomId = msg.roomId;
                    hxfn.level.JoinRoom(msg.roomId);
                }
            }.bind(this),
        );
    },

    GetYBRoomList(gameType){
        var postData = {
            gameType: gameType,
        }
        hxfn.netrequest.Req_Comn(
            postData,
            hxfn.netrequest.Msg_GetYBRoomList,
            function(msg){
                hxfn.level.ybRoomList = msg.ybRoomList;
                hxjs.util.Notifier.emit('Room_GetListReady');
            }.bind(this),
        )
    },

    GetLatestRoom(){
        hxfn.level.latestRoomInfo = null;
        hxfn.netrequest.Req_Comn(
            {},
            hxfn.netrequest.Msg_GetLatestRoom,
            function(msg){
                hxfn.level.latestRoomInfo = msg.lastestRoom;
                hxjs.util.Notifier.emit('Room_GetLatestRoomReady');
            }.bind(this)
        );
    },






    // Gameplays ////////////////////////////////////////////////////////////////////////////////////////////
    // GetClientGameplay: function (gps) {
    //     var gp = [];
    //     var g = [];

    //     // var gp = [
    //     //     {"games": [4],"style":1},
    //     //     {"games": [4,4],"style":2},
    //     //     {"games": [4],"style":1},
    //     //     {"games": [4,4],"style":2},
    //     //     {"games": [4],"style":1},
    //     // ];

    //     var conf = null;
    //     for (var i = 0; i < gps.length; i++) {
    //         var e = gps[i];
    //         conf = conf_gameplay[e+''];
    //         if(conf==null){
    //             cc.log('[lowojs][err] config: gameplay has not been loaded!');
    //         }
    //         else {
    //             if(conf.style == 1){
    //                 gp.push({"games": [e],"style":1});
    //             }
    //             else if(conf.style == 2){
    //                 var gpItem = null;
    //                 if(gp.length>0){
    //                     gpItem = gp[gp.length -1];
    //                     //如果当前最后一个元素的games数组对象长度为2，且最后一个位置未填，则数据填写到该位置
    //                     //否则新生成一个长度为2的games数组对象
    //                     if(gpItem['games'].length == 2 && gpItem['games'][1] == undefined)
    //                         gpItem['games'][1] = e;
    //                     else {
    //                         g = new Array(2);
    //                         g[0] = e;
    //                         gp.push({"games": g,"style":2});
    //                     }
    //                 }
    //                 else {
    //                     g = new Array(2);
    //                     g[0] = e;
    //                     gp.push({"games": g,"style":2});
    //                 }
    //             }
    //         }
    //     }

    //     return gp;
    // },

    GetVisibleGameplayers (gps) {
        var newgps = [];
        gps.forEach(function(element) {
            if(element.get('disable') === 0)
                newgps.push(element);
        }, this);

        return newgps;
    },

    RecordGameplays(gps){
        var newgps = [];

        var idxArr = [];
        //取出menu idx
        gps.forEach(function(element) {
            idxArr.push(element.get('menuIndex'));
        }, this);

        //排序
        idxArr = hxjs.util.sort.quickSort(idxArr);

        for (var i = 0; i < idxArr.length; i++) {
            var element = idxArr[i];
            
            gps.forEach(function(item) {
                if(item.get('menuIndex') === element)
                    newgps.push(item);
            }, this);
        }

        return newgps;
    },

    GetClientGameplay_New (gps) {
        var gp = [];

        var conf = null;
        for (var i = 0; i < gps.length; i++) {
            var conf = gps[i];

            if(conf == null) {
                cc.log('[lowojs][err] error GetGoldenHallResp data!');
            }
            else {
                //忽略 menuShowSize 和 menuTakeSize
                gp.push({"games": [conf],"style":1});
            }
        }

        return gp;
    },

    // GetClientGameplay_New2 (gps) {
    //     var gp = [];
    //     var g = [];

    //     // var gp = [
    //     //     {"games": [4],"style":1},
    //     //     {"games": [4,4],"style":2},
    //     //     {"games": [4],"style":1},
    //     //     {"games": [4,4],"style":2},
    //     //     {"games": [4],"style":1},
    //     // ];

    //     var conf = null;
    //     for (var i = 0; i < gps.length; i++) {
    //         var e = gps[i];
    //         conf = e;//conf_gameplay[e+''];

    //         if(conf == null) {
    //             cc.log('[lowojs][err] error GetGoldenHallResp data!');
    //         }
    //         else {
    //             if(conf.get('menuShowSize') == 2) {
    //                 gp.push({"games": [e],"menuShowSize":1});
    //             }
    //             else if(conf.get('menuShowSize') == 1){
    //                 var gpItem = null;
    //                 if(gp.length>0){
    //                     gpItem = gp[gp.length -1];
    //                     //如果当前最后一个元素的games数组对象长度为2，且最后一个位置未填，则数据填写到该位置
    //                     //否则新生成一个长度为2的games数组对象
    //                     if(gpItem['games'].length == 2 && gpItem['games'][1] == undefined)
    //                         gpItem['games'][1] = e;
    //                     else {
    //                         g = new Array(2);
    //                         g[0] = e;
    //                         gp.push({"games": g,"style":2});
    //                     }
    //                 }
    //                 else {
    //                     g = new Array(2);
    //                     g[0] = e;
    //                     gp.push({"games": g,"style":2});
    //                 }
    //             }
    //         }
    //     }

    //     return gp;
    // },

    // GetClientGameplay_New1: function (gps) {
    //     var gp = [];
    //     // var g = [];

    //     // var gp = [
    //     //     {"games": [info],"style":1},
    //     //     {"games": [info,info],"style":2},
    //     //     {"games": [info],"style":1},
    //     //     {"games": [info,info],"style":2},
    //     //     {"games": [info],"style":1},
    //     // ];
        
    //     var conf = null;
    //     for (var i = 0; i < gps.length; i++) {
    //         var e = gps[i];
    //         conf = e;
            
    //         if(conf==null){
    //             cc.log('[lowojs][err] error GetGoldenHallResp data!');
    //         }
    //         else {
    //             var menuShowSize = conf.get('menuShowSize');

    //             if(menuShowSize == 1) {
    //                 gp.push({"games": [e],"style":1});
    //             }
    //             else if(menuShowSize == 2) {

    //             }
    //         }
    //     }

    //     return gp;
    // },
}