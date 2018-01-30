import { clearInterval } from 'timers';
import { hxjs } from '../../HXJS/HXJS';
import { log } from '../../HXJS/Util/Log';
import { hxfn } from './HXFN';
import { enum_game } from '../DT/DD/Enum_Game';
import { SyncPing } from './Fn_Ping';
import { hxdt } from '../DT/HXDT';


export let account =
    {
        authToken: null,
        serverId: 0,
        urlDict: {},

        hasGetServeInfo: false,//是否成功获取服务信息
        callback_getServerInfo: null,
        closeNetAuto: true,
        timer: null,
        syncTimer: null,
        tickNum: 0,
        tickTime: 5000,//心跳时间

        OnInit() {
            this.hasGetServeInfo = false;
            this.HandleServerInfo(true);

        },

        OnEnd() {
            this.HandleServerInfo(false);
        },

        // HandleNotify
        HandleServerInfo: function (isHandle) {
            if (isHandle) {
                //log.trace("net", "[][][][][][][][][HandleServerInfo  regist listener")
                hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.NetBeKickedCommand, this.NetBeKickedCommand.bind(this));
                hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.SyncHeartBeatAck, ()=>{SyncPing.PingEnd()});
            }
            else {
                hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.NetBeKickedCommand);
                hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.SyncHeartBeatAck);
            }
        },

        //外踢人下线
        NetBeKickedCommand: function (data) {
            var reason = data.reason;//原因，1：玩家顶掉，2：GM踢掉, 3: 服务器关闭
            var reasonStr = data.reasonContent;
            cc.log('NetBeKickedInform desc: ' + reasonStr);
            hxjs.module.ui.hub.LoadDlg_Info(reasonStr, '离线提示');
            hxfn.login.CancelAutoLogin();

            //登出,且停留在登录界面
            this.ConfirmQuitLobby();
        },

        ConfirmQuitLobby: function () {
            //HACK 
            hxjs.module.ui.hub.HideWaitingUI();

            // hxjs.util.Notifier.emit('UI_LobbyQuit');
            // hxfn.login.CancelAutoLogin();
            hxfn.account.closeNetAuto = false;
            hxjs.module.netlinkerLong.OnClose();
            hxjs.uwcontroller.SetState(enum_game.Enum_GameState.Login);
            // hxfn.account.StopHeartTick();//重复
        },

        PlayerConfirmQuitLobby: function () {
            // hxjs.util.Notifier.emit('UI_LobbyQuit');

            //HACK 
            hxjs.module.ui.hub.HideWaitingUI();

            hxfn.login.CancelAutoLogin();
            hxfn.login.ClearWxLoginInfo();

            hxfn.account.closeNetAuto = false;
            hxjs.module.netlinkerLong.OnClose();

            hxjs.uwcontroller.SetState(enum_game.Enum_GameState.Login);
            // hxfn.account.StopHeartTick();//重复
        },

        StartHeartTick(time) {
            this.StopHeartTick();
            // hxfn.account.syncTimer = window.setInterval(function(){
            hxfn.account.timer = window.setInterval(function () {
                var postData = {
                    playerId: hxfn.role.curUserData.playerData.playerId,
                    roomId: hxfn.battle.curRoomId,
                };
                //cc.log('hearttick......');
                hxfn.net.Sync(
                    postData,
                    'SyncHeartBeat',
                    hxdt.msgcmd.SyncHeartBeat
                );
                SyncPing.PingStart();
            }.bind(this), time)
        },


        // StartSyncTick(time){
        //     hxfn.account.syncTimer = window.setInterval(function(){
        //         var postData = {
        //             playerId : hxfn.role.curUserData.playerData.playerId,
        //             roomId : hxfn.battle.curRoomId,
        //         };
        //         cc.log('synctick......');
        //         hxfn.net.Sync(
        //             postData,
        //             'SyncHeartBeat',
        //             hxdt.msgcmd.SyncHeartBeat
        //         );
        //     }.bind(this),time)
        // },

        //客户端向服务器同步心跳，大厅与战斗频率不一致
        StopHeartTick() {
            if (hxfn.account.timer) {
                window.clearInterval(hxfn.account.timer);
                hxfn.account.timer = null;
            }
        },

        //向服务器发Sync请求时，检测服务器响应超时时，客户端主动处理断开连接
        // StopSyncTick(){
        //     cc.log(hxfn.account.syncTimer)
        //     if(hxfn.account.syncTimer){
        //         window.clearInterval(hxfn.account.syncTimer);
        //         hxfn.account.syncTimer = null;
        //     }
        // },


        /////////////////////////////////////////////////////////////////////////////////
        OnStart() {
            hxfn.bridge.PrintLog('cc: StartGetServerInfo');

            if (!hxfn.bridge.IsNetAvailable()) {
                hxfn.account.ReconectNetwork(hxdt.setting.lang.Net_Disable);
                return;
            }

            //1， 首先获取服务器信息
            if (this.hasGetServeInfo) {
                hxfn.bridge.PrintLog('cc: Has GetServerInfo');
                hxfn.login.CheckToLogin();
            }
            else {
                hxfn.bridge.PrintLog('cc: Start GetServerInfo');
                this.StartGetServerInfo(hxfn.login.CheckToLogin);
            }
        },

        //////////////////////////////////////////////////
        ReconectNetwork(info) {
            //HACK 务必关掉waiting界面
            hxjs.module.ui.hub.HideWaitingUI();
            hxjs.module.ui.hub.LoadDlg_Check(
                info,
                hxfn.account.OnStart,
                null,//hxfn.login.QuitByNetErr
                hxdt.setting.lang.Net_Dlg_Title,
                hxdt.setting.lang.Net_Btn_Relink,
                '',//hxdt.setting.lang.Comn_Quit,
                'UI_Dlg_Check_DisableNet'
            );
        },


        /////////////////////////////////////////////////////////////////////////////////


        /**
         * 重置所有数据
         * @method reset
         */
        Reset() {
            sys.localStorage.removeItem('Usr');
            sys.localStorage.removeItem('Psw');
        },

        FailedGetServerInfo: function () {
            hxjs.module.ui.hub.HideWaitingUI();
            this.hasGetServeInfo = false;
            hxjs.uwcontroller.SetState(hxdt.enum_game.Enum_GameState.Login);

            // hxjs.module.ui.hub.LoadDlg_Info('获取服务错误', '提示');
            // cc.log('!!! NotifyFailedNetwork FailedGetServerInfo');
            hxjs.module.net.NotifyFailedNetwork();
        },

        StartGetServerInfo(callback) {
            hxfn.bridge.PrintLog('cc: !!!!!! Real StartGetServerInfo');
            this.callback_getServerInfo = callback;

            //从壳里拿
            if (!hxdt.setting_comn.IsWebVersion()) {
                hxfn.bridge.PrintLog('cc: !!!!!! Real StartGetServerInfo is not web version!');

                //提示等待
                hxjs.module.ui.hub.ShowWaitingUI();
                // var serverInfo = {"addressList": [{"key": "loginUrl","address": "http://jj.itrainingame.com:35554/rest/user/login"},{"key": "checkVersionUrl","address": "http://jj.itrainingame.com:35554/rest/checkversion"},{"key": "loginPlatformUrl","address": "http://jj.itrainingame.com:35554/rest/user/loginPlatform"},{"key": "rechargeIOSUrl","address": "http://jj.itrainingame.com:35559/rest/recharge/rechargeios"},{"key": "checkVersionUrlG","address": "http://jj.itrainingame.com:35554/rest/checkversion/json"},{"key": "rechargeOrderUrl","address": "http://jj.itrainingame.com:35559/rest/recharge/order"}],"mustCheckVersion": true,"openGuest": false,"isServerClosed": false}
                var bridgeServerInfo = hxfn.bridge.GetServerInfo();
                hxjs.module.ui.hub.HideWaitingUI();

                this.GetServerInfo_Succ(bridgeServerInfo);
                return;
            }

            //网络获取
            hxfn.bridge.PrintLog('cc: !!!!!! Real StartGetServerInfo is web version!');

            var postData = {
                'packageId': hxdt.setting_comn.GetPackageId(),
                'OS': hxdt.setting_comn.GetOS(),
                'gameVersion': hxdt.setting_comn.GetGameVersion(),
            };

            var postTxt = JSON.stringify(postData);

            //提示等待
            hxjs.module.ui.hub.ShowWaitingUI();
            hxjs.module.net.SendHttpRequest
                (
                hxdt.setting_comn.GetServerUrl4WebVer(),
                postTxt,
                this,//_this
                function (data) {
                    hxjs.module.ui.hub.HideWaitingUI();
                    // cc.log('~~~~~~~nnnnnnnnnnn~~~~~~~~ ok GetServerInfo, with data: ' + data);
                    hxfn.bridge.PrintLog('cc: !!!!!! Real StartGetServerInfo is web version Succ!');
                    this.GetServerInfo_Succ_WebVersion(data);
                }.bind(this),
                function (readyState, status) {
                    hxjs.module.ui.hub.HideWaitingUI();
                    hxfn.bridge.PrintLog('cc: !!!!!! Real StartGetServerInfo is web version Failed!');
                    this.FailedGetServerInfo();
                    // _this.schedule(function () {
                    //     this.RequestServerInfo(url);
                    // }, 5/*timeout*/);
                }.bind(this),
            );
        },

        GetServerInfo_Succ: function (bridgeServerInfo) {
            if (bridgeServerInfo == null) {
                hxfn.bridge.PrintLog('cc: !!!!!! Real StartGetServerInfo not web version Failed!');
                this.FailedGetServerInfo();
                return;
            }

            var serverInfo = JSON.parse(bridgeServerInfo);
            hxfn.bridge.PrintLog('serverinfo::::::::' + bridgeServerInfo);

            if (serverInfo == null) {
                hxfn.bridge.PrintLog('cc: !!!!!! Real StartGetServerInfo not web version Failed!');
                this.FailedGetServerInfo();
                return;
            }

            var isServerClosed = serverInfo['isServerClosed'];//.isServerClosed;
            if (isServerClosed) {
                hxfn.bridge.PrintLog('cc: !!!!!! Real StartGetServerInfo not web version Failed!');
                this.FailedGetServerInfo();
                return;
            }

            // this.mustCheckVersion = serverInfo.mustCheckVersion;
            var addressList = serverInfo['addressList'];//.addressList;
            addressList.forEach(function (item) {
                this.urlDict[item['key']] = item['address'];
            }.bind(this), this);

            hxfn.bridge.PrintLog('cc: !!!!!! Real StartGetServerInfo not web version Succ!');
            this.hasGetServeInfo = true;
            if (this.callback_getServerInfo)
                this.callback_getServerInfo();
        },

        GetServerInfo_Succ_WebVersion: function (data) {
            log.trace("net", "cc: !!!!!! Real StartGetServerInfo is web version Succ To callback for login!");
            var msg = hxjs.proto.UnPack('ServerInfoResult', data); // msg_ServerInfoResult.decode(data);
            if (msg == null) {
                hxjs.module.ui.hub.LoadDlg_Info('Protobuf 数据错误', '提示');
                return;
            }

            var addressList = msg.get('addressList');
            addressList.forEach(function (item) {
                this.urlDict[item.get('key')] = item.get('address');
            }.bind(this), this);

            this.hasGetServeInfo = true;
            if (this.callback_getServerInfo)
                this.callback_getServerInfo();
        },
    }