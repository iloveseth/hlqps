import { log } from "../../HXJS/Util/Log";


export let SyncPing = {
  
    _pingTick: 0,
    _endTick: 0,


    PingStart() {
        //log.trace("net",">>>>>>>>>>>>>>SyncPing pingStart")
        this._pingTick = new Date().getTime();
    },

    PingEnd() {
        //log.trace("net",">>>>>>>>>>>>SyncPing PingEnd")
        this._endTick = new Date().getTime();
    },

    //Ping发 与 ping收 的时间差
    NetDelay() {
        var delay = Math.abs(this._pingTick - this._endTick)
        //cc.error("sync_ping  delay =" + delay)
        return delay;
    },

    //当前时间 距离 上一次收到心跳 的时间差
    CurNetDelay() {
        if (this._endTick <= 0) {
            return 0;
        }
        return new Date().getTime() - this._endTick;
    },

    // OnRoomPingPong() {
    //     this.PingEnd();
    // },

    GetNetIntensity() {
        if (this.NetDelay() < 150) {
            return 3;
        }

        if (this.NetDelay() < 300) {
            return 2;
        }

        return 1;
    }
}