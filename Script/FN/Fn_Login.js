import { hxdt } from "../DT/HXDT";
import { enum_game } from "../DT/DD/Enum_Game";
import { hxjs } from "../../HXJS/HXJS";
import { uwcontroller } from "../../HXJS/Module/UW/UWController";
import { log } from "../../HXJS/Util/Log";
import { ErrorCode } from "../DT/DD/ErrorCode";
import { hxfn } from "./HXFN";
import { isNullOrUndefined } from "util";
import { http } from "./Fn_Http";
import { SyncPing } from "./Fn_Ping";

export let login =
    {
        sessionLoginInfo: null,
        url_socket: null,

        GetLastLoginInfo() {
            return hxjs.module.data.localStorage4Json.GetItem('LoginInfo');
        },

        //尝试自动登录
        /**
         * @param {{channel : number, wx : {token:string, refreshToken:string}, fast:{usr:string,pwd:string}, reconnect:{authToken:string}, phone:{phone:string,pwd:string}}} loginInfo
         */
        lTryLoginAuto: function (loginInfo) {
            hxfn.lobby.needPop = true;
            //HACK
            hxjs.module.ui.hub.HideWaitingUI();

            log.trace("net", "lTryLoginAuto, loginInfo: " + JSON.stringify(loginInfo));

            if (loginInfo == null) {
                return;
            }

            //重连操作，不刷新logininfo
            let channel = loginInfo.channel;
            if (channel != LoginWay.Reconnect) {
                this.sessionLoginInfo = loginInfo;
            } else {
                this.sessionLoginInfo = null;
            }

            // var data = loginInfo.data;

            // var os = hxdt.setting_comn.GetOS();
            // var gameVersion = hxdt.setting_comn.GetGameVersion();

            var postData = null;
            var url_login = null;
            var request = null;
            switch (channel) {//待优化
                //非渠道

                //微信
                case LoginWay.WECHAT: {
                    //微信刷新登陆
                    if (loginInfo.wx.refreshToken) {
                        postData = {
                            "token": loginInfo.wx.refreshToken,
                            "par1": "refresh",
                            "OS": hxdt.setting_comn.GetOS(),
                            "gameVersion": hxdt.setting_comn.GetGameVersion(),
                            "platformId": hxdt.setting_comn.GetPlatformId(),	//用于区分同一platform下不同包类型的字段
                            "packageId": hxdt.setting_comn.GetPackageId(),
                            "debugServer": hxdt.setting_comn.GetDebugServerId(),	//用于调试的字段C01 //C06
                            "loginPlatform": "WECHAT", //推广上线用户id
                            "deviceId":hxdt.setting_comn.GetDeviceId,
                        }
                    } else {
                        postData = {
                            "token": loginInfo.wx.token,
                            "par1": "",
                            "OS": hxdt.setting_comn.GetOS(),
                            "gameVersion": hxdt.setting_comn.GetGameVersion(),
                            "platformId": hxdt.setting_comn.GetPlatformId(),	//用于区分同一platform下不同包类型的字段
                            "packageId": hxdt.setting_comn.GetPackageId(),
                            "debugServer": hxdt.setting_comn.GetDebugServerId(),	//用于调试的字段C01 //C06
                            "loginPlatform": "WECHAT", //推广上线用户id
                            "deviceId":hxdt.setting_comn.GetDeviceId,
                        }
                    }

                    url_login = hxfn.account.urlDict['loginPlatformUrl'];
                    hxfn.bridge.PrintLog(url_login);
                    request = 'LoginPlatformReq';
                    break;
                }
                case LoginWay.Fast: {
                    postData = {
                        "account": loginInfo.fast.usr,//"LoyWong",
                        "password": loginInfo.fast.pwd,//"123456",
                        "OS": hxdt.setting_comn.GetOS(),
                        "gameVersion": hxdt.setting_comn.GetGameVersion(),
                        "platformId": hxdt.setting_comn.GetPlatformId(),	//用于区分同一platform下不同包类型的字段
                        "packageId": hxdt.setting_comn.GetPackageId(),
                        "debugServer": hxdt.setting_comn.GetDebugServerId(),	//用于调试的字段C01 //C06
                        "rebateParentId": "", //推广上线用户id
                    }
                    url_login = hxfn.account.urlDict['loginUrl'];
                    hxfn.bridge.PrintLog(url_login);
                    request = 'LoginReq';
                    break;
                }
                case LoginWay.Visit:{
                    postData = {
                        "account": loginInfo.visit.usr,//"LoyWong",
                        "password": loginInfo.visit.pwd,//"123456",
                        "OS": hxdt.setting_comn.GetOS(),
                        "gameVersion": hxdt.setting_comn.GetGameVersion(),
                        "platformId": hxdt.setting_comn.GetPlatformId(),	//用于区分同一platform下不同包类型的字段
                        "packageId": hxdt.setting_comn.GetPackageId(),
                        "debugServer": hxdt.setting_comn.GetDebugServerId(),	//用于调试的字段C01 //C06
                        "rebateParentId": "", //推广上线用户id
                    }
                    break;
                }
                case LoginWay.Phone: {

                    postData = {
                        // "token": loginInfo.wx.refreshToken,
                        //     "par1": "refresh",
                        //     "OS": hxdt.setting_comn.GetOS(),
                        //     "gameVersion": hxdt.setting_comn.GetGameVersion(),
                        //     "platformId": hxdt.setting_comn.GetPlatformId(),	//用于区分同一platform下不同包类型的字段
                        //     "packageId": hxdt.setting_comn.GetPackageId(),
                        //     "debugServer": hxdt.setting_comn.GetDebugServerId(),	//用于调试的字段C01 //C06
                        //     "loginPlatform": "WECHAT", //推广上线用户id


                        "token": loginInfo.phone.pwd,                  //hashed passwd
                        "par1": loginInfo.phone.phone,                 //phone number
                        "OS": hxdt.setting_comn.GetOS(),
                        "gameVersion": hxdt.setting_comn.GetGameVersion(),
                        "platformId": hxdt.setting_comn.GetPlatformId(),	//用于区分同一platform下不同包类型的字段
                        "packageId": hxdt.setting_comn.GetPackageId(),
                        "deviceId": hxdt.setting_comn.GetDeviceId(),
                        "debugServer": hxdt.setting_comn.GetDebugServerId(),	//用于调试的字段C01 //C06
                        "loginPlatform": "PHONE", //推广上线用户id
                    }
                    url_login = hxfn.account.urlDict['loginPlatformUrl'];
                    hxfn.bridge.PrintLog(url_login);
                    request = 'LoginPlatformReq';
                    break;
                }
                case LoginWay.Reconnect: {
                    postData = {
                        "token": loginInfo.reconnect.authToken,
                        "par1": "",
                        "OS": hxdt.setting_comn.GetOS(),
                        "gameVersion": hxdt.setting_comn.GetGameVersion(),
                        "platformId": hxdt.setting_comn.GetPlatformId(),	//用于区分同一platform下不同包类型的字段
                        "packageId": hxdt.setting_comn.GetPackageId(),
                        "debugServer": hxdt.setting_comn.GetDebugServerId(),	//用于调试的字段C01 //C06
                        "loginPlatform": "RECONNECT", //推广上线用户id
                    }

                    url_login = hxfn.account.urlDict['loginPlatformUrl'];
                    hxfn.bridge.PrintLog(url_login);
                    request = 'LoginPlatformReq';

                    break;
                }
                default:
                    break;
            }

            log.trace("net", "【Fn_Login >>> LoginReq】: " + JSON.stringify(postData));
            let postInfo = hxjs.proto.Pack(request, postData);
            if (postInfo == null) {
                return;
            }
            var postMsg = postInfo.toBuffer();

            //提示等待
            hxjs.module.ui.hub.ShowWaitingUI();
            hxjs.module.net.SendHttpRequest(
                url_login,
                postMsg,
                this,
                function (data) {
                    //回调结束等待


                    var msg = hxjs.proto.UnPack('LoginResp', data);
                    var result = msg.result;
                    log.trace("net", "【Fn_Login >>> LoginResp】: " + JSON.stringify(msg))

                    //微信 refreshToken刷新登陆失败，尝试拉起微信授权
                    if (result == ErrorCode.PlatformLoginCheckFail) {
                        if (loginInfo.channel == LoginWay.WECHAT && loginInfo.wx.refreshToken) {
                            hxjs.module.ui.hub.HideWaitingUI();
                            hxfn.bridge.LoginByWx();
                            return;
                        }
                    }

                    // 被禁止登陆
                    if (result == ErrorCode.BeBaned && msg.par1) {
                        hxjs.module.ui.hub.HideWaitingUI();
                        let tip = "您的账号（ID: " + msg.par1 + "）存在异常不能登陆，请联系客服反馈问题";
                        hxjs.module.ui.hub.LoadDlg_Info(tip, '提示');
                        return;
                    }

                    if (result != ErrorCode.OK) {
                        hxjs.module.ui.hub.HideWaitingUI();
                        hxjs.module.ui.hub.LoadTipFloat(hxdt.errcode.codeToDesc(result), '提示');
                        return;
                    }

                    if (result == 0) {
                        hxfn.account.authToken = msg.get('authToken');
                        if (channel == LoginWay.WECHAT) {
                            //保存wechat 的 refreshToken
                            loginInfo.wx.refreshToken = msg.refreshToken;
                        }

                        var gameServer = msg.get('gameServer');
                        if (gameServer == null) {
                            hxjs.module.ui.hub.HideWaitingUI();
                            hxjs.module.ui.hub.LoadDlg_Info('游戏服务器未启动！！！！！！', '异常提示');
                            return;
                        }

                        var gameServerAddress = gameServer.get('address');
                        hxfn.account.serverId = gameServer.get('serverId');

                        //开始建立Socket连接
                        var url_socket = 'ws://' + gameServerAddress + '/ws/client';
                        this.url_socket = url_socket;
                        this.SetupSocketLink(url_socket);
                    }
                }.bind(this),
                null,
                // function (readyState, status) {
                //     // hxjs.module.ui.hub.LoadDlg_Info('服务器请求失败 错误码: ' + status, '提示');
                //     var str = '您的网络好像有点问题，重新连接一下试试吧？';
                //     // hxjs.module.ui.hub.LoadDlg_Info(str, '提示');
                //     hxjs.module.netlinkerLong.NotifyRelink(str);

                //     // this.ClearLocalRecord();
                // }.bind(this)
            )
        },

        ClearWxLoginInfo() {
            var loginInfo = this.GetLastLoginInfo();
            if (loginInfo && loginInfo.wx) {
                loginInfo.wx = { token: "", refreshToken: "" };
                hxjs.module.data.localStorage4Json.SetItem('LoginInfo', loginInfo);
            }
        },
        // logout游戏时，清理账户信息（所有）
        ClearLocalRecord() {
            // Old
            // //清理游客账户
            // //清理正式注册账户

            hxjs.module.data.localStorage4Json.RmvItem('LoginInfo');
            cc.sys.localStorage.removeItem('isAutoLogin');
        },

        CancelAutoLogin() {
            cc.sys.localStorage.setItem('isAutoLogin', '0');
            // hxfn.login.ClearLocalRecord();
        },


        ///////////////////////////////////////////////////////////////////////////////////////////////////
        CheckToLogin() {
            var loginInfo = hxfn.login.GetLastLoginInfo();
            var isAutoLogin = cc.sys.localStorage.getItem('isAutoLogin');
            //如果上次成功登录过，则利用之前的信息进行登录，否则停留在登录界面(但是需要自动填充上次成功登录过的账号信息！！！)，再次手动登录
            // if(loginInfo != null) {
            if (!isAutoLogin) {
                return;
            }

            if (isAutoLogin === '0') {
                return;
            }

            if (!loginInfo) {
                return;
            }

            if (isNullOrUndefined(loginInfo.channel)) {
                return;
            }

            if (loginInfo.channel === LoginWay.WECHAT) {
                if (!loginInfo.wx)
                    return;
                if (!loginInfo.wx.refreshToken)
                    return;
            }

            if ((loginInfo.channel === LoginWay.Fast) && !(loginInfo.fast)) {
                return;
            }

            hxfn.bridge.PrintLog('cc: has login to autologin');
            hxfn.login.lTryLoginAuto(loginInfo);
        },

        //微信登陆按钮,点击响应函数
        //wechat step 1
        LoginWeChat() {
            /**
             * @type {{channel : number, wx : {token:string, refreshToken:string}, fast:{usr:string,pwd:string}, reconnect:{authToken:string}}}
             */

            cc.log("Wechat Call APP to Login");
            //重新获取微信授权登陆
            hxfn.bridge.LoginByWx();
        },

        //游客登陆，根据创建时间生成唯一编码，如果本地有游客登陆账号，则直接登陆，删除应用后无效
        LoginVisitor(){
            let visitorKey='visitorKey';
            let account=md5(md5(hxdt.setting_comn.GetDeviceId()));
            let loginInfo = new LoginInfo();
            loginInfo.channel = LoginWay.Fast;
            loginInfo.fast.usr = account;
            loginInfo.fast.pwd = '';
            hxfn.login.TryLoginByBtn(loginInfo);
        },

        // 点击微信登录等待壳的回调，并尝试使用返回的信息进行微信登录
        //wechat step 4
        lTryLogin4WC(loginInfo) {
            if (hxfn.account.hasGetServeInfo && loginInfo != null) {
                this.lTryLoginAuto(loginInfo);
            }
            else {
                // hxjs.module.ui.hub.LoadDlg_Info('服务器信息尚未初始化！！！！！！','社交账号登录');

                //若获取服务信息失败，再次点击微信登录按钮，可以重新获取服务信息再接登录
                hxfn.account.StartGetServerInfo(
                    function () {
                        this.lTryLoginAuto(loginInfo);
                    }.bind(this)
                )
            }
        },



        // 重置密码
        ITryResetPasswordByAuthCode(data, callback) {
            var url = hxfn.account.urlDict['smsresetpwd'];
            var postData = {
                "account": data.account,
                "smsAuthCode": data.smsAuthCode,
                "newPassword": data.newPassword,
                "platformId": hxdt.setting_comn.GetPlatformId(),
            };
            log.trace("net", "【Fn_Login ->ITryResetPasswordByAuthCode -> ResetPasswordByAuthCodeReq】 " + JSON.stringify(postData));

            let postMsg = hxjs.proto.Pack("ResetPasswordByAuthCodeReq", postData).toBuffer();

            http.SendHttpRequest(url, postMsg, this, (data) => {
                var msg = hxjs.proto.UnPack('ResetPasswordByAuthCodeResp', data);
                log.trace("net", "【Fn_Login -> ITryResetPasswordByAuthCode -> ResetPasswordByAuthCodeResp】=> msg:: " + JSON.stringify(msg));

                if (msg.result != 0) {
                    hxjs.module.ui.hub.LoadTipFloat(hxdt.errcode.codeToDesc(msg.result));
                    return
                }

                callback(msg);
            }, null);
        },


        //找回密码  -> 点击手机注册，获取验证码
        lTryFindPasswordSMSCode(phoneNumber,callback) {

            var url = hxfn.account.urlDict['smscode'];
            var postData = {
                "phoneNumber": phoneNumber,
                "purpose": 2,
            };

            log.trace("net", "【Fn_Login ->lTryFindPasswordSMSCode -> SMSGetAuthCodeReq】 => postdata:" + JSON.stringify(postData));
            let postMsg = hxjs.proto.Pack("SMSGetAuthCodeReq", postData).toBuffer();

            http.SendHttpRequest(url, postMsg, this, (data) => {
                var msg = hxjs.proto.UnPack('SMSGetAuthCodeResp', data);
                log.trace("net", "【Fn_Login ->lTryFindPasswordSMSCode -> SMSGetAuthCodeResp】 => msg: " + JSON.stringify(msg));

                if (msg.result != 0) {
                    hxjs.module.ui.hub.LoadTipFloat(hxdt.errcode.codeToDesc(msg.result));
                    return
                }

                callback(msg);

            }, null);
        },



        //Phone Login step 1  -> 点击手机注册，获取验证码
        lTryLoginSMSCode(phoneNumber, callback) {

            var url = hxfn.account.urlDict['smscode'];
            var postData = {
                "phoneNumber": phoneNumber,
                "purpose": 1,
            };

            log.trace("net", "【Fn_Login ->lTryLoginSMSCode -> SMSGetAuthCodeReq】 => postdata:" + JSON.stringify(postData));
            let postMsg = hxjs.proto.Pack("SMSGetAuthCodeReq", postData).toBuffer();

            http.SendHttpRequest(url, postMsg, this, (data) => {
                var msg = hxjs.proto.UnPack('SMSGetAuthCodeResp', data);
                log.trace("net", "【Fn_Login ->lTryLoginSMSCode -> SMSGetAuthCodeResp】 => msg: " + JSON.stringify(msg));


                if (msg.result != 0) {
                    hxjs.module.ui.hub.LoadTipFloat(hxdt.errcode.codeToDesc(msg.result));
                    return
                }

                callback(msg);

            }, null);
        },

        //Phone Login step 2  -> 创建账户
        lTryLoginPhoneUserCreat(data, callback) {

            var url = hxfn.account.urlDict['smscreate'];

            var postData = {
                "phoneNumber": data.phoneNumber,
                "password": data.password,
                "smsAuthCode": data.smsAuthCode,
                "OS": hxdt.setting_comn.GetOS(),
                "gameVersion": hxdt.setting_comn.GetGameVersion(),
                "platformId": hxdt.setting_comn.GetPlatformId(),	//用于区分同一platform下不同包类型的字段
                "packageId": hxdt.setting_comn.GetPackageId(),
                "deviceId": hxdt.setting_comn.GetDeviceId(),
            };

            log.trace("net", "【Fn_Login ->lTryLoginPhoneUserCreat -> SMSCreateUserReq】 postData: " + JSON.stringify(postData));

            let postMsg = hxjs.proto.Pack("SMSCreateUserReq", postData).toBuffer();
            http.SendHttpRequest(url, postMsg, this, (data) => {
                var msg = hxjs.proto.UnPack('SMSCreateUserResp', data);
                log.trace("net", "【Fn_Login -> lTryLoginSMSCode -> SMSCreateUserResp】 => msg:: " + JSON.stringify(msg))

                if (msg.result != 0) {
                    hxjs.module.ui.hub.LoadTipFloat(hxdt.errcode.codeToDesc(msg.result));
                    return
                }

                callback(msg);
            }, null);
        },

        //Phone Login step 3  -> 获取salt登录
        lTryLoginGetSalt(phoneNumber, password, callback) {
            cc.log('【Fn_Login】 lTryLoginGetSalt ->>>>>> phoneNumber: ' + phoneNumber);

            var url = hxfn.account.urlDict['getsalt'];
            var postData = {
                "account": phoneNumber,
                "platformId": "PHONE",
            };
            let postMsg = hxjs.proto.Pack("GetSaltReq", postData).toBuffer();

            http.SendHttpRequest(url, postMsg, this, (data) => {
                var msg = hxjs.proto.UnPack('GetSaltResp', data);
                var result = msg.result;
                log.trace("net", "GetSaltResp: " + JSON.stringify(msg))

                if (result != 0) {
                    hxjs.module.ui.hub.LoadTipFloat(hxdt.errcode.codeToDesc(result));
                    return
                }

                //Phone Login step 4  ->   通过salt 登录
                var hashedPasswd = md5(md5(password + msg.staticSalt) + msg.randomSalt)
                var loginInfo = new LoginInfo();
                loginInfo.channel = LoginWay.Phone;
                loginInfo.phone.pwd = hashedPasswd;
                loginInfo.phone.phone = phoneNumber;

                hxfn.login.lTryLoginAuto(loginInfo);
            }, null);
        },






        // 登录界面的按钮点击进行登录，在这之前肯定已经获得过服务器信息
        TryLoginByBtn(loginInfo) {
            if (hxfn.account.hasGetServeInfo && loginInfo != null) {
                hxfn.bridge.PrintLog('cc: TryLoginByBtn when hasGetServeInfo');

                this.lTryLoginAuto(loginInfo);
            }
            else {
                hxfn.bridge.PrintLog('cc: Re Get ServeInfo to TryLoginByBtn');

                // hxjs.module.ui.hub.LoadDlg_Info('服务器信息尚未初始化！！！！！！','注册用户登录');

                // 重新开始开始获取服务器信息，并使用提供信息进行登录
                // 如果获取服务器信息失败，通过登录界面的点击按钮进行登录仍然有重新获取服务信息的机会
                hxfn.account.StartGetServerInfo(
                    function () {
                        this.lTryLoginAuto(loginInfo);
                    }.bind(this)
                )
            }
        },




        //////////////////////////////////////////////////////////////////////////////////////////////////
        TryLoginByResume() {
            hxjs.module.ui.hub.HideWaitingUI();

            // if(uwcontroller.curState === enum_game.Enum_GameState.Battle){
            //     //当在战斗房间中断网是必须发送此消息，退出到登陆界面开始
            //     hxjs.util.Notifier.emit('UI_BattleQuitByNetErr');
            // }
            // else if(uwcontroller.curState === enum_game.Enum_GameState.Lobby) {
            //     hxjs.module.uw.controller.SetState(enum_game.Enum_GameState.Login);
            // }

            //////////////////////////////////////////////////////////////
            // hxfn.login.TryLoginByNetErr();
            hxfn.account.closeNetAuto = true;
            if (hxjs.module.netlinkerLong.ws) {
                //预先关闭连接，将不会弹出因自动断开导致的网络错误弹框
                hxjs.module.netlinkerLong.ws.onclose = null;
                hxjs.module.netlinkerLong.ws.close();
                hxjs.module.netlinkerLong.ws = null;
            }

            //拥有有效的authToken，直接使用authToken重连
            if (hxfn.account.authToken) {
                let loginInfo = new LoginInfo();
                loginInfo.channel = LoginWay.Reconnect;
                loginInfo.reconnect.authToken = hxfn.account.authToken;
                hxfn.login.lTryLoginAuto(loginInfo);
                return;
            }

            let loginInfo = this.sessionLoginInfo;
            if (hxfn.account.hasGetServeInfo && loginInfo != null) {
                hxfn.login.lTryLoginAuto(loginInfo);
            }
            else {
                //重新获取服务信息再接登录
                hxfn.account.StartGetServerInfo(
                    function () {
                        hxfn.login.lTryLoginAuto(loginInfo);
                    }.bind(this)
                )
            }
        },

        TryLoginByNetErr() {
            hxjs.module.ui.hub.HideWaitingUI();

            // //HACK 大厅已支持静默刷新，所以不需要额外发消息
            // if(uwcontroller.curState === enum_game.Enum_GameState.Battle){
            //     //当在战斗房间中断网是必须发送此消息
            //     hxjs.util.Notifier.emit('UI_BattleQuitByNetErr');
            // }

            //----------------------------------------------------
            hxfn.account.closeNetAuto = true;
            if (hxjs.module.netlinkerLong.ws) {
                //预先关闭连接，将不会弹出因自动断开导致的网络错误弹框
                hxjs.module.netlinkerLong.ws.onclose = null;
                hxjs.module.netlinkerLong.OnClose();
            }
            //----------------------------------------------------

            var loginInfo = hxfn.login.GetLastLoginInfo();
            if (hxfn.account.hasGetServeInfo && loginInfo != null) {
                hxfn.login.lTryLoginAuto(loginInfo);
            }
            else {
                //重新获取服务信息再接登录
                hxfn.account.StartGetServerInfo(
                    function () {
                        hxfn.login.lTryLoginAuto(loginInfo);
                    }.bind(this)
                )
            }
        },

        QuitByNetErr() {
            hxjs.module.ui.hub.HideWaitingUI();

            // //HACK 大厅已支持静默刷新，所以不需要额外发消息
            // if(uwcontroller.curState === enum_game.Enum_GameState.Battle) {
            //     //当在战斗房间中断网是必须发送此消息
            //     hxjs.util.Notifier.emit('UI_BattleQuitByNetErr');
            // } 

            //----------------------------------------------------
            hxfn.account.closeNetAuto = true;
            hxjs.module.netlinkerLong.OnClose();
            //----------------------------------------------------

            hxjs.uwcontroller.SetState(enum_game.Enum_GameState.Login);
        },
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        //after login step 1
        SetupSocketLink: function (url) {
            cc.log('>>>>>== start websocket url -> ' + url);

            //建立Socket
            hxjs.module.netlinkerLong.OnInit(url, this.Callback_WSSucc.bind(this));
        },

        //after login step 2
        //授权请求：发送消息 GameAuthReq (AuthPack.proto)
        Callback_WSSucc: function () {
            //websocket成功建立连接后，发送消息 GameAuthReq (AuthPack.proto)
            var postData = {
                "authToken": hxfn.account.authToken,
                "serverId": hxfn.account.serverId,
            };
            hxfn.netrequest.Req_GameAuth(postData, this.Callback_LoginSucc.bind(this));
        },

        //after login step 3
        //授权成功：发送后续消息 > 第一个消息一般是 GetUserAllDataReq (GamePack.proto)
        Callback_LoginSucc: function (msg) {
            var result = msg.get('result');
            cc.log("GameAuthResp result: " + result);
            // hxfn.bridge.PrintLog("GameAuthResp result: " + result);

            if (!hxfn.comn.HandleServerResult(result)) {
                // 登陆游戏服务器成功后，发送后续消息

                //!!!显示层表现
                //成功切换到Lobby界面
                // hxjs.uwcontroller.SetState (2/*Enum_GameState.Lobby*/);
                this.GetRoleToEnterLobby();
            }
            else {
                hxjs.module.ui.hub.HideWaitingUI();
                this.ClearLocalRecord();
                hxjs.uwcontroller.SetState(enum_game.Enum_GameState.Login);
            }
        },

        ////////////////////////获取玩家信息成功之后再登录大厅/////////////////////////////////////////
        //after login step 4
        GetRoleToEnterLobby() {
            // > 第一个消息一般是 GetUserAllDataReq (GamePack.proto)
            this.StartGetUserAllData();
        },

        StartGetUserAllData() {
            var postData = {
                deviceId: hxdt.setting_comn.GetDeviceId(),
                platformId: hxdt.setting_comn.GetPlatformId(), //平台id
                packageId: hxdt.setting_comn.GetPackageId(), //包id
                service: 0,     //不填写或者0(携带所有), 1 麻将， 2 败家乐
            };

            hxfn.netrequest.Req_GetUserAllData(
                postData,
                this.Callback_GetUserAllData.bind(this)
            );
        },

        //如果成功！！！
        //after login step 5
        Callback_GetUserAllData(msg) {
            if (this.sessionLoginInfo != null) {
                cc.sys.localStorage.setItem('isAutoLogin', '1');
                hxjs.module.data.localStorage4Json.SetItem('LoginInfo', this.sessionLoginInfo);
            }

            var userAllData = msg.get('userAllData');
            hxfn.role.curUserData = userAllData;

            hxfn.bridge.onPlayerLoginSuccess(userAllData.playerData.playerId);

            //检测微信分享奖励
            if(hxfn.bridge.shareErrcode == 0 && hxfn.lobby.activityMsg && hxfn.lobby.activityMsg.sharereward && hxfn.lobby.activityMsg.shareGiveYuanBaoNum > 0) {
                cc.log('Send:Msg_NewPlayerAndShareReward');
                hxfn.bridge.shareErrcode = null;
                hxfn.msg.Req_Comn(
                    {
                        rewardName: 'share',
                    },
                    hxfn.msg.Msg_NewPlayerAndShareReward,
                    (msg) => {
                        if(msg.resultCode == 0 && msg.giveYuanBaoNum > 0){
                            //window.setTimeout(()=>{
                            hxjs.module.ui.hub.LoadTipFloat('分享有礼已经发到您的邮箱，请注意查收哦');
                            //},500);
                        }
                    }
                )
            }

            cc.log(userAllData);

            // hxjs.module.ui.hub.HideWaitingUI();
            this.CheckRelink();
            // // 进入游戏大厅！！！！！！！！！！！！！！！！！！！！！！！！
            // hxjs.uwcontroller.SetState(2/*Enum_GameState.Lobby*/);
        },

        //after login step 6
        // 掉线 重连
        // 通过获取最近的加入过的房间 GetLatestRoomReq，如果roomid存在，则直接通过joinroom加入战斗，否则停留在大厅 
        CheckRelink() {
            var postData = {};

            hxfn.netrequest.Req_MaJiangGetOldRoom(postData, this.Callback_GetLatestRoom.bind(this));
        },

        Callback_GetLatestRoom(msg) {
            this.TryRelink(msg.get('roomId'));
        },

        //after login step 7
        //登录成功进入游戏的3种情况
        //根据优先级处理
        //1，如果有正在进行的房间
        //2，如果有被邀请的房间
        //3，正常进入大厅
        TryRelink: function (roomId) {
            hxjs.module.ui.hub.HideWaitingUI();
            //SyncPing.PingEnd();

            //1, 进入游戏房间！！！！！！！！！！！！！！！！！！！！！！！！
            if (roomId != null && roomId !== '') {
                hxfn.level.JoinRoom(roomId);
                return;
            }

            //2，检测是否有分享的房间！！！！！！！！！！！！！！！！！！！！！！
            roomId = this.GetWCShareRoom();
            if (roomId != null && roomId !== '') {
                hxfn.level.JoinRoom(roomId);
                return;
            }

            //3，进入游戏大厅！！！！！！！！！！！！！！！！！！！！！！！！
            hxjs.uwcontroller.SetState(enum_game.Enum_GameState.Lobby);
        },

        SendAuthToRelink() {
            var postData = {
                "authToken": hxfn.account.authToken,
                "serverId": hxfn.account.serverId,
            };

            cc.log('%%%%%%%%%%%%%%%%%%%%%%%%');
            cc.log(hxfn.account.authToken);
            cc.log(hxfn.account.serverId);
            cc.log('%%%%%%%%%%%%%%%%%%%%');

            hxfn.netrequest.Req_GameAuth(postData, this.Callback_LoginSucc.bind(this));
        },

        GetUrlParams(url) {
            let strings = url.split("?");
            if (strings.length != 2)
                return null;

            let query = strings[1];
            let allQuery = query.split("&");
            if (allQuery && allQuery.length > 0) {
                let params = new Map();
                for (let i = 0; i < allQuery.length; i++) {
                    let entry = allQuery[i].split("=");
                    if (entry.length == 2) {
                        params.set(entry[0], entry[1]);
                    }
                }
                return params;
            }
            return null;
        },

        // //有两个时机来取得来自于微信的房间分享
        // //1，在游戏中
        // //2，不在游戏中，必然进过进大厅
        // // 有种情况是，如果已经在房间中战斗，则忽略比较好！！！！！！？？？？？？
        GetWCShareRoom: function () {
            var url = hxfn.bridge.GetUrl();//"http://aaaaa?roomid=10000"
            cc.log('hxfn.bridge.GetUrl-> ' + url);

            if (url != null && url != '') {
                var params = this.GetUrlParams(url);
                if (params) {
                    var roomid = params.get("roomId");
                    return roomid;
                }
            }

            return null;
        },
    }

export class LoginInfo {
    channel = 0;    //0 fast, 1 weixin
    wx = {
        token: "",
        refreshToken: ""
    };

    fast = {
        usr: "",
        pwd: ""
    };

    reconnect = {
        authToken: "",
    };

    phone = {
        phone: "",
        pwd: ""
    };

    visit={
        usr:"",
        pwd:""
    }
}

export let LoginWay = {
    Fast: 0,
    WECHAT: 1,
    Reconnect: 2,
    Phone: 3,
    Visit:4,//游客登陆
}