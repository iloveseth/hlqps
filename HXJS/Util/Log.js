
// modfied by ming.lei at 2018/01/29

export let log = {
    tags: new Map(),

    openTag(tag) {
        this.tags[tag] = tag;
    },

    error(msg) {
        cc.error('[hx][err] ' + msg);
    },

    warn(msg) {
        cc.warn('[hx][warn] ' + msg);
    },

    // mType(msg, mColor) {
    //     if ([typeof msg] == 'string')
    //         return  msg 
    //     else if ([typeof msg] == 'number')
    //         return msg
    //     else if ([typeof msg] == 'object')
    //         return  JSON.stringify(msg) 
    //     else if ([typeof msg] == 'function')
    //         return  msg.toString() 
    //     else if ([typeof msg] == 'boolean')
    //         return  ('' + msg) 
    //     else if ([typeof msg] == 'undefined')
    //         return  ('' + msg) 
    //     return "";
    // },

    //扩展时间方法 
    getDateString() {
        Date.prototype.format = function (format) {
            var o = {
                "M+": this.getMonth() + 1,                      //month 
                "d+": this.getDate(),                           //day 
                "h+": this.getHours(),                          //hour 
                "m+": this.getMinutes(),                        //minute 
                "s+": this.getSeconds(),                        //second 
                "q+": Math.floor((this.getMonth() + 3) / 3),    //quarter 
                "S": this.getMilliseconds()                     //millisecond 
            }

            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1,
                    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] : ("00" +
                            o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }

        return new Date().format("yyyy/MM/dd hh:mm:ss")
    },

    trace(tag, msg) {
        this.mPrint(tag, msg, "")
    },

    red(tag, msg) {
        this.mPrint(tag, msg, "color:red;")
    },

    green(tag, msg) {
        this.mPrint(tag, msg, "color:green;")
    },

    orange(tag, msg) {
        this.mPrint(tag, msg, "color:#ee7700;")
    },

    gray(tag, msg) {
        this.mPrint(tag, msg, "color:gray;")
    },

    blue(tag, msg) {
        this.mPrint(tag, msg, "color:#3a5fcd;")
    },

    mPrint(tag, msg, color) {
        if (!this.tags[tag])
            return;

        let detail = null;
        if(typeof msg === 'object')  detail = JSON.stringify(msg);
        else detail = msg;


        var backLog = console.log || cc.log || log;
        backLog.call(this, "%c%s:" + cc.js.formatStr.apply(cc, arguments), color, '【' + this.getDateString() + '】' + '【' + tag + '】' + detail);
    }
}