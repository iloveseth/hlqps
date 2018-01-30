import { log } from "../../Util/Log";
import { hxjs } from "../../HXJS";
import { hxfn } from "../../../Script/FN/HXFN";



export let netlinkerLong = {
    ws : null,
    timer: null,
    timeout:50000,

    OnClose(){
        if(this.ws) {
            this.ws.close();
            this.ws = null;
        }
    },

    OnInit(url, callback) {
        this.requestId = 0;
        this.OnClose();

        //断开之后必须重新建立连接！！！
        if (this.ws) {
            this.ws.onclose = null;
            this.ws.close();
        }

        hxfn.net.OnReset();
        this.ws = new WebSocket(url);
        this.ws.binaryType  = "arraybuffer";
        this.ws.onopen = function (event) {
            log.trace("net", "<<<<<== websocket onopen!  ==<<<<<");
    
            if(callback != null)
                callback();
        },
    
        this.ws.onmessage = function (event) {
            /**
             * request 和 syncRequest 是主动由客户端发起的
             * ServerInfo 服务器主动推送通知
             * Sync 房间与我的同步信息
             */
            // else(not for battle)
            // public class PacketType {
            //     public static final int RequestResponse = 1; //客户端向gameServer发起请求，gameServer对客户端响应，双向
            //     public static final int ServerInform = 2; //gameServer向客户端发送消息，单向
            //     public static final int Forward = 3;
            //     public static final int Report = 4; //客户端向gameServer上报错误等，单向
            //     public static final int Sync = 5;   //客户端向roomServer发送消息或者roomServer向客户端发送消息，单向
            //     public static final int IPC = 6; //服务器之间发送消息，单向
            //     public static final int IPCRequest = 7;  //服务器之间发送请求，单向
            //     public static final int IPCResponse = 8; //服务器之间响应，单向
            //     public static final int SyncRequest = 9; //客户端向roomServer发起请求，roomServer对客户端响应，双向
            // }
            
            // TODO 应该用消息广播
            hxfn.net.HandleServer (event.data);
        };
    
        this.ws.onerror = function (event) 
        {
            if (!Object.is(this, netlinkerLong.ws))
                return;
            cc.log("============ longlink: Send Text fired an error");
            // hxjs.module.net.NotifyRelink('您的网络好像有点问题，重新连接一下试试吧？');//网络连接错误
            hxjs.module.net.NotifyFailedNetwork();
        };
    
        this.ws.onclose = function (event) 
        {
            if (!Object.is(this, netlinkerLong.ws))
                return;
            cc.log("============ longlink: WebSocket instance closed.");
            cc.log(hxfn.account.closeNetAuto);

            //如果是自动断开，则弹出对话框
            if(hxfn.account.closeNetAuto) {
                // hxjs.module.net.NotifyRelink('您的网络好像有点问题，重新连接一下试试吧？');//网络连接断开
                hxjs.module.net.NotifyFailedNetwork();
            }
            else {
                //重置当前操作的标记
                hxfn.account.closeNetAuto = true;
            }
        };
    },
    
    OnSend:function(typ, msg) {
        // if(typ !== 'SyncHeartBeat') {
        //     cc.log('=========ws send msg typ: ' + typ);
        //     cc.log('=========ws send msg ins: ' + msg);
        // }

        if(this.ws == null) {
            cc.log('[hxjs][warn]=========ws is null!');
            return;
        }

        if (this.ws.readyState == WebSocket.OPEN) {
            this.ws.send(msg);
            return true;
        } else {
            cc.log("连接没有开启.");
            return false;
        }

        // cc.log(hxdt.setting_comn.requestMap);
    },
    
    SendRequest : function () {
    
    },
    
    SendSyncRequest : function () {
        
    },
}