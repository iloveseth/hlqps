import { log } from "../../HXJS/Util/Log";
import { hxfn } from "./HXFN";
import { hxjs } from "../../HXJS/HXJS";
import { isNullOrUndefined } from "util";

//网络
export let http = {
    hasPopRelinkNotify: false,
    networkNotifyUI: null,

    // netlinkerLong : netlinkerLong,
    SendHttpRequest(url, postData, from, ok_callback, fail_callback) {//, isAutoReSend
        // hxjs.module.ui.hub.ShowWaitingUI ();

        var xhr = new XMLHttpRequest(); //cc.loader.getXMLHttpRequest();

        ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
            xhr["on" + eventname] = function () {
                cc.log("Event : " + eventname);
            };
        });

        //因为IOS9版本上的CC引擎bug，无法post二进制，所以二进制数据统一编码成base64发送
        if (typeof postData === "string") {

        } else {
            postData = this.ArrayBufferToBase64(postData);
        }

        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function () {
            // cc.log('~~~~~~~nnnnnnnnnnn~~~~~~~~ xhr.readyState: ' + xhr.readyState);
            // cc.log('~~~~~~~nnnnnnnnnnn~~~~~~~~ xhr.status: ' + xhr.status);
            if (xhr.readyState === 4) {
                // hxjs.module.ui.hub.HideWaitingUI ();

                if (xhr.status >= 200 && xhr.status < 300)
                    ok_callback(xhr.response/*responseText*/);
                else {
                    //HACK (事实上应该反过来！！！)如果有错误回调，则在回调的函数里具体处理错误信息，以免重复弹框
                    if (fail_callback != null) {
                        fail_callback(xhr.readyState, xhr.status);
                    }
                    else {
                        this.FailedNetwork(xhr.readyState, xhr.status);
                    }
                }
            }
        }.bind(this);

        xhr.open("POST", url, true);
        xhr.timeout = 5000;// 5 seconds for timeout
        xhr.send(postData);
        xhr.onerror = () => {
            // hxjs.module.ui.hub.HideWaitingUI ();
            this.FailedNetwork();
        }
        // xhr.sendAsBinary(postData);
    },

    FailedNetwork: function (readyState, status) {
        // cc.log('!!! NotifyFailedNetwork http');
        // hxjs.module.ui.hub.LoadDlg_Info('服务器请求失败 错误码: ' + xhr.status, '提示');
        this.NotifyFailedNetwork();
    },

    NotifyFailedNetwork() {
        if (this.hasPopRelinkNotify) {
            hxjs.module.ui.hub.HideWaitingUI();
            return;
        }

        this.hasPopRelinkNotify = true;
        var str = '您的网络好像有点问题，重新连接一下试试吧？';
        this.NotifyRelink(str);
    },
    NotifyRelink: function (info) {
        // log.trace("net", "NotifyRelink!!!");
        //HACK 务必关掉waiting界面
        hxjs.module.ui.hub.HideWaitingUI();

        //1,选择重连：
        //2,选择不重连：退出到登陆界面
        hxjs.module.ui.hub.LoadDlg_Check(
            info,
            () => {
                this.hasPopRelinkNotify = false;
                hxfn.login.TryLoginByNetErr();
            },
            () => {
                this.hasPopRelinkNotify = false;
                hxfn.login.QuitByNetErr();
            },
            '网络提示',
            '重连',
            '退出',
            'UI_Dlg_Check',
            null,
            (prefab) => {
                this.networkNotifyUI = prefab;
            }
        );
    },

    CloseCurNetworkNotifyUI() {
        if (!isNullOrUndefined(this.networkNotifyUI)) {
            hxjs.module.ui.hub.Unload(this.networkNotifyUI);
            this.networkNotifyUI = null;
            http.hasPopRelinkNotify = false
        }
    },

    //2, 与本地代码互操作（比如：Object-C(中间件Cordova)）////////////////////////////////
    CallNative(method, params) {
        // case1
        // if (cc.sys.isNative&&cc.sys.os==cc.sys.OS_IOS) {
        //     let ret = jsb.reflection.callStaticMethod("JsBridgeObject","payment:",this.GetChargeItemID(this.itemIdx));
        // };

        // case2
        if ('gbxBridge' in window) {
            gbxBridge[method](params);
        };
    },

    CallNativePayment(item) {
        cc.log("~~~~~~~nnnnnnnnnnn~~~~~~~~ CallNativePayment");
        if ('gbxBridge' in window) {
            gbxBridge.payIng(item);
        };
    },
    SaveNetImage(url, fileName, callback) {
        var dirpath = jsb.fileUtils.getWritablePath();
        var filepath = dirpath + fileName;

        function loadEnd() {
            cc.loader.load(filepath, function (err, tex) {
                if (err) {
                    cc.error(err);
                } else {
                    if (callback != null)
                        callback(tex);
                }
            });

        }

        // if( jsb.fileUtils.isFileExist(filepath) ){
        //     cc.log('Remote is find' + filepath);
        //     loadEnd();
        //     return;
        // }

        var saveFile = function (data) {
            if (typeof data !== 'undefined') {
                if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
                    jsb.fileUtils.createDirectory(dirpath);
                }

                if (jsb.fileUtils.writeDataToFile(new Uint8Array(data), filepath)) {
                    cc.log('Remote write file succeed.');
                    loadEnd();
                } else {
                    cc.log('Remote write file failed.');
                }
            } else {
                cc.log('Remote download file failed.');
            }
        };

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            cc.log("xhr.readyState  " + xhr.readyState);
            cc.log("xhr.status  " + xhr.status);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    saveFile(xhr.response);
                } else {
                    saveFile(null);
                }
            }
        }.bind(this);

        xhr.responseType = 'arraybuffer';
        xhr.open("GET", url, true);
        xhr.send();
    },

    ArrayBufferToBase64(ab) {
        return base64js.fromByteArray(new Uint8Array(ab));
    },
    Base64ToArrayBuffer(b64) {
        return base64js.toByteArray(b64).buffer;
    },
}