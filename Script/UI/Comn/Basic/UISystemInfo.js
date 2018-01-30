import { hxfn } from "../../../FN/HXFN";
import { SyncPing } from "../../../FN/Fn_Ping";
//import { log } from "../../HXJS/Util/Log";
import { http } from "../../../FN/Fn_Http";
import { log } from "../../../../HXJS/Util/Log";

cc.Class({
    extends: cc.Component,

    properties: {
        txtTime: cc.Label,
        progressBattery: cc.ProgressBar,
        imgWifi: [cc.Sprite],
        wifiNode: cc.Node,
        netNode: cc.Node,
        txtNet: cc.Label
        // animObjs:[cc.Node],//如果延时处理，则需要获取具体的引用
    },



    onLoad: function () {
        if (cc.sys.isNative && cc.sys.isMobile) {
            this.progressBattery.active = true;
            this.setBatteryAndNet();
            this.schedule(function () {
                //设置电量和网络状态
                this.setBatteryAndNet();
            }.bind(this), 5);
        }
        else {
            this.progressBattery.node.active = false;
            this.wifiNode.active = false;
            this.netNode.active = false;
        }
        this.schedule(function () {
            //设置时间
            this.txtTime.string = this.getTimeString();
            //检测丢失    
            this.CheckLost()
        }.bind(this), 0.5);
    },
    setBatteryAndNet: function () {
        var battery = hxfn.bridge.GetBattery();
        let net = hxfn.net.GetNetIntensity();
        if (battery == undefined || battery == -100) {
            this.progressBattery.node.active = false;

        }
        else {
            this.progressBattery.progress = battery / 100.0;
        }
        if (net == undefined || net == -100) {
            this.wifiNode.active = false;
            this.netNode.active = false;
        }
        else {

            if (net >= 0) {
                this.wifiNode.active = true;
                if (net > 3)
                    net = 3;
                for (var i = 0; i < 4; i++) {
                    if (i == net) {
                        this.imgWifi[i].node.active = true;
                    }
                    else {
                        this.imgWifi[i].node.active = false;
                    }
                }
                this.netNode.active = false;
            }
            else {
                if (net == -1) {
                    this.txtNet.string = "4G";
                }
                else if (net == -2) {
                    this.txtNet.string = "3G";
                }
                else {
                    this.txtNet.string = "LTE";
                }
                this.wifiNode.active = false;
                this.netNode.active = true;
            }
        }

    },
    getTimeString: function () {
        var now = new Date;
        var h = now.getHours();
        var mm = now.getMinutes();
        var str;
        if (h > 12) {
            h -= 12;
            str = "PM ";
        } else {
            str = "AM ";
        }
        h = h < 10 ? "0" + h : h;
        mm = mm < 10 ? "0" + mm : mm;
        return str + h + ":" + mm;
    },
    onDestroy: function () {
        this.unscheduleAllCallbacks(this);
    },


    CheckLost: function () {
        // log.trace("ui", "【SystemInfo -> CheckLost】 curNetDelay=" + SyncPing.CurNetDelay());

        if (SyncPing.CurNetDelay() > 10000)  //10 秒丢失
        {
            //cc.error("丢包超时，弹出重连框")
            hxjs.module.net.NotifyFailedNetwork();
            
        }
        //如要重连弹框存在，且重连上了(小于5秒)
        else if (SyncPing.CurNetDelay() < 5000 && http.hasPopRelinkNotify) {
            //cc.error("又双重连上了")
            hxjs.module.net.CloseCurNetworkNotifyUI()
        };
    }
});