import { enum_game } from "../DT/DD/Enum_Game";
import { hxfn } from "./HXFN";
import {hxjs} from "../../HXJS/HXJS";

export let role = 
{
    //包含两部分用户信息 1，基本信息 2，货币信息
    curUserData: null,
    
    //1,用户基本信息
    // curUserInfo: null,
    //用户基本数据 message UserDataProto
    // playerId: -1,
    // nickName: -1,
    // sex : 0,
    // playerIcon: 'dummy',
    // gold: 0,
    // diamond: 0,
    // level: 0,
    // levelExp: 0,

    //2,用户货币信息
    // curGoldenInfo: null,
    
    safeGuard:null,//破产信息缓存
    
    reasonDesc:{
        // source:来源
        // public static final int RegisterPresent = 1;    //注册赠送
        // public static final int Recharge = 2;           //充值
        // public static final int GroupMail = 3;          //群发邮件
        // public static final int SingleMail = 4;         //单发邮件
        // public static final int GameResult = 5;         //游戏赢取
        // public static final int DailyLogin = 7;         //每日赠送钻石
        // public static final int TaskReward = 8;         //任务奖励
        // public static final int Lottery = 9;            //抽奖
        // public static final int Exchange = 10;          //商城兑换
        // public static final int RobotRequest = 11;      //机器人使用
        // public static final int ActivitySign = 12;      //签到
        // public static final int ActivityRemedySign = 13;//补签
        // public static final int GetSafeGuard = 14;      //补助
        // public static final int FinishTask = 15;        //完成任务
        1:'注册赠送',
        2:'充值获得',
        3:'领取成功',
        4:'领取成功',
        5:'游戏赢取',
        // 6:'游戏赢取',
        7:'每日赠送',
        8:'任务奖励',
        9:'抽奖获得',
        10:'商城兑换获得',
        11:'机器人使用',
        12:'签到奖励',
        13:'补签奖励',
        14:'补助',
        15:'任务奖励',
        21:'玩家赠送',
    },

    /**
     * 重置所有数据
     * @method reset
     */
    OnReset () {
        // reset this role all profile
    },

    OnInit() {
        this.HandleServerInfo(true);
    },
    
    OnEnd () {
        this.HandleServerInfo(false);
    },

    // HandleNotify
    HandleServerInfo:function(isHandle) {
        if(isHandle) {
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.PlayerInfoChanged, this.PlayerInfoChanged.bind(this));
        }
        else {
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.PlayerInfoChanged);
        }
    },


    // public static final int gold = 300;         //金币房金币
    // public static final int yuanbao = 301;      //金币房元宝
    // public static final int diamond = 302;      //金币房钻石\房卡
    UpdateRoleCoinInfo: function (typ, num){
        switch (typ) {
            case enum_game.Enum_Dtype.gold:
            this.curUserData.goldenInfo.gold = this.curGold + num;
            break;
            case enum_game.Enum_Dtype.yuanbao:
            this.curUserData.goldenInfo.yuanbao = this.curIngot + num;
            break;
            case enum_game.Enum_Dtype.diamond:
            this.curUserData.goldenInfo.diamond = this.curTicket + num;
            break;
            case enum_game.Enum_Dtype.bankYuanbao:
            this.curUserData.goldenInfo.bankYuanbao = this.curBankYuanbao + num; 
            break;
            case enum_game.Enum_Dtype.vipLevel:
            this.curUserData.playerData.vipLevel = this.curVipLevel+num;
            break;
            case enum_game.Enum_Dtype.remedySignCard : 
            this.curUserData.goldenInfo.remedySignCard += num;
            break;
            //case enum_game.Enum_Dtype.smallHorn :
              //补签卡
            //smallHorn : 305,          
            default:
                break;
        }
    },
    // handle funcs
    PlayerInfoChanged:function (data) 
    {
        // var msg = hxdt.builder.build('PlayerInfoChangedProto').decode(data);
        var msg = data;
        
        var playerId = msg.playerId;//hxjs.module.data.proto.Get('PlayerInfoChangedProto','playerId',data);
        var itemProto = msg.itemProto;//hxjs.module.data.proto.Get('PlayerInfoChangedProto','itemProto',data);
        var reason = msg.reason;//hxjs.module.data.proto.Get('PlayerInfoChangedProto','reason',data);

        cc.log(playerId);
        cc.log(this.playerId);

        if(playerId === this.playerId){
            var uiitems = [];

            //1 /////////////////////////////////////更新用户客户端数据
            itemProto.forEach(function(element) {
                var typ = element.get('DType');
                var num = element.get('count');
                this.UpdateRoleCoinInfo(typ, num);
                
                if(num>0/*表示获得而不是消耗*/) {
                    var icon = hxfn.comn.GetItemIcon(typ);
                    var uiitem = {'icon':icon, 'count':num,'typ':typ};
                    
                    uiitems.push(uiitem);
                }
            }, this);

            hxjs.util.Notifier.emit('Role_Update-Coin');
            

            
            //2 /////////////////////////////////////弹出物品变化通知
            //如果是游戏赢取则不弹出
            if(reason === 5         //游戏结算
                || reason === 22    //保险箱提取
                || reason === 23    //保险箱存
            )
                return;

            //签到奖励和补签奖励提示改为飘字
            if(reason ==12 || reason == 13 || reason == 8 || reason == 15){
                var desc = this.reasonDesc[reason];
                var award = '';
                uiitems.forEach(element => {
                    award += element.count;
                    award += hxfn.comn.CoinName[parseInt(element.typ)];
                    award += ',';
                })
                award = award.substring(0,award.length - 1);//去掉最后的换行符
                hxjs.module.ui.hub.LoadTipFloat(desc + award);
                return;
            }
            if(reason == 27){
                hxjs.module.ui.hub.LoadTipFloat('新人登录获得%1元宝'.replace(/%1/,uiitems[0].count));
                return;
            }
            if(uiitems.length >0){
                // 1，如果是获得 2，如果是消耗则不弹出\
                var desc = '';
                if(parseInt(reason) > 0 && parseInt(reason) <= 21){
                    if(msg.reasonTxt){
                        desc = msg.reasonTxt
                    }
                    else{
                        desc = this.reasonDesc[reason];
                    }

                }
                hxjs.module.ui.hub.LoadDlg_Reward(desc,'获得提示',uiitems);
            }
        }
    },

    // SyncRoleCoinInfo:function(typ, amount){
    //     switch (typ) {
    //         case 300:
    //         this.curUserData.goldenInfo.gold = amount;
    //         break;
    //         case 301:
    //         this.curUserData.goldenInfo.yuanbao = amount;
    //         break;
    //         case 302:
    //         this.curUserData.goldenInfo.diamond = amount;
    //         break;
    //         default:
    //             break;
    //     }

    //     // hxjs.util.Notifier.emit('Role_Update-Coin');
    //     hxjs.util.Notifier.emit('Role_Update-Coin_Battle');
    // },

    // SyncRoleCoinInfo_Battle (info) {
    //     var allPlayerCoins = info.get('playerCoins');

    //     // 获取货币数量
    //     var amount = 0;
    //     allPlayerCoins.forEach(function(element) {
    //         if(element.playerId === this.playerId) {
    //             amount = parseInt(element.get('roomCoin'));

    //             // 判断房间类型
    //             var typ = -1;
    //             if(hxfn.map.curRoomTyp == 0/*金币场*/){
    //                 typ = 300;
    //             }
    //             else if(hxfn.map.curRoomTyp == 1/*元宝场*/){
    //                 typ = 301;
    //             }

    //             this.SyncRoleCoinInfo(typ,amount);

    //         }
    //     }, this);
    // },

    // UpdateUserData : function(){
    //     var postData = {
    //     };
    //     hxfn.net.Request(
    //         postData,
    //         'GetUserAllDataReq',
    //         hxdt.msgcmd.GetUserInfoCommand,//5
    //         function(data){
    //             var msg = hxdt.builder.build('GetUserAllDataResp').decode(data);
    //             var userAllData = msg.get('userAllData');
    //             hxfn.role.curUserData = userAllData;
    //             // hxfn.role.curRole = userAllData.playerData;
    //             // hxfn.role.curGolden = userAllData.goldenInfo;

    //             hxjs.util.Notifier.emit('Role_Update');
    //         }
    //     )
    // },

    GetValidGameplayConf : function (profile) {
        return [];
    },

    ModifyRoleNameAndSex : function (newName, newSex) {
        hxfn.role.curRole.nickName = newName;
        hxfn.role.curRole.sex = newSex;
        cc.log('角色名称：' + hxfn.role.curRole.nickName);
        cc.log('角色性别：' + hxfn.role.curRole.sex);

        hxjs.util.Notifier.emit('Role_Update');
    },

    UpdateUserDataAndNotify(){
        var postData = {
            deviceId : hxdt.setting_comn.GetDeviceId(),
            platformId : hxdt.setting_comn.GetPlatformId(), //平台id
            packageId : hxdt.setting_comn.GetPackageId(), //包id
            service : 0,     //不填写或者0(携带所有), 1 麻将， 2 败家乐
        };

        hxfn.netrequest.Req_GetUserAllData(postData, function(msg){
                // var msg = hxdt.builder.build('GetUserAllDataResp').decode(data);
                var userAllData = msg.get('userAllData');
                hxfn.role.curUserData = userAllData;
                hxjs.util.Notifier.emit('UserData_Update');
            }
        );
    },

    UpdateUserData(){
        var postData = {
            deviceId : hxdt.setting_comn.GetDeviceId(),
            platformId : hxdt.setting_comn.GetPlatformId(), //平台id
            packageId : hxdt.setting_comn.GetPackageId(), //包id
            service : 0,     //不填写或者0(携带所有), 1 麻将， 2 败家乐
        };
        
        hxfn.netrequest.Req_GetUserAllData(postData, function(msg){
                // var msg = hxdt.builder.build('GetUserAllDataResp').decode(data);
                var userAllData = msg.get('userAllData');
                hxfn.role.curUserData = userAllData;
            }
        );
    },

    get curRole() {
        if(hxfn.role.curUserData)
            return hxfn.role.curUserData.get('playerData');
        else
            return null;
    },

    get curGoldenInfo() {
        if(hxfn.role.curUserData)
            return hxfn.role.curUserData.get('goldenInfo');
        else
            return null;
    },

    get playerId() {
        if(hxfn.role.curRole)
            return hxfn.role.curRole.get('playerId');
        else
            return '';
    },

    //当前玩家拥有的：金币
    get curGold() {
        if(hxfn.role.curUserData)
            return parseInt(hxfn.role.curUserData.get('goldenInfo').get('gold'));
        else
            return -1;
    },

    //当前玩家拥有的：元宝
    get curIngot() {
        if(hxfn.role.curUserData)
            return parseInt(hxfn.role.curUserData.get('goldenInfo').get('yuanbao'));
        else
            return -1;
    },

    //当前玩家拥有的：房卡
    get curTicket() {
        if(hxfn.role.curUserData)
            return parseInt(hxfn.role.curUserData.get('goldenInfo').get('diamond'));
        else
            return -1;
    },

    get curCarryYuanbao(){
        if(hxfn.role.curUserData)
            return parseInt(hxfn.role.curUserData.get('goldenInfo').get('yuanbao'));
        else
        return -1;
    },

    get curVipLevel(){
        if(hxfn.role.curUserData)
            return parseInt(hxfn.role.curUserData.get('playerData').get('vipLevel'));
        else
        return -1;
    },

    get curBankYuanbao(){
        if(hxfn.role.curUserData)
            return parseInt(hxfn.role.curUserData.get('goldenInfo').get('bankYuanbao'));
        else
        return -1;
    },
}
