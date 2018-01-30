// 全局广播实现
export let Notifier = {
    _eventMap: [],

    on: function(type, callback, target) {
        if (this._eventMap[type] === undefined) {
            this._eventMap[type] = [];
        }
        this._eventMap[type].push({ callback: callback, target: target });
    },

    emit: function(type, parameter) {
        cc.log('[EmitSignals] -----> '+type);
        var array = this._eventMap[type];
        if (array === undefined) return;
        
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element) element.callback.call(element.target, parameter);
        }
    },

    off: function(type, callback, target = null) {
        var array = this._eventMap[type];
        if (array === undefined) return;

        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element && element.callback === callback) {
                // var cb = array[i];
                array[i] = undefined;
                // array.removeAt(i);
                // cb = null;
                break;
            }
        }
    },

    offType: function(type) {
        this._eventMap[type] = undefined;
    },
};

// hxjs.util.Notifier = 
// {
//     handles: {},

//     //发送事件
//     emit: function (eventName, data) {
//         var returns = []; //返回值

//         for ( var findEvenName in this.handles ){
//             if (findEvenName == eventName) {
//                 // if(this.handles[findEvenName] != null/*???HACK*/){
//                     for (var i = 0; i < this.handles[findEvenName].length; i++) {
//                         var re = this.handles[findEvenName][i](data);
//                         if(re!= null)
//                             returns.push(re);
//                     }
//                 // }
//                 // else {
//                 //     //HACK
//                 //     this.handles[eventName] = null;
//                 //     delete this.handles.eventName;
//                 // }
//             }
//         }

//         return returns;
//     },

//     //添加事件
//     on: function (eventName, callback, target) {
//         // console.log('收到事件', eventName);
//         this.handles[eventName] = this.handles[eventName] || [];
//         this.handles[eventName].push(callback.bind(target));
//     },

//     //通过事件名和target移除一个监听器
//     off: function (eventName, cb, target) {
//         // var callback = cb.bind(target);
//         // var callback = target;

//         if(eventName in this.handles) {
//             target.callback = null;

//             var cbs = this.handles[eventName];
//             if(cbs == null || cbs.length == 0)
//                 delete this.handles.eventName;

//             // var cbs = this.handles[eventName];
//             // var idx = cbs.indexOf(callback);

//             // if(cbs != null && idx > -1)
//             //     cbs.remove(callback);

//             // if(cbs == null || cbs.length == 0)
//             //     delete this.handles.eventName;
//         }
//         else {
//             cc.log('[hxjs][warn] remove a unregisted notify: ' + eventName);
//         }
//     },

//     clear () {

//     }
// }


/////////////////////////////////// Sample ////////////////////////////////////////
//发送通知
// onmsg: function (msg) {
//     // console.log('收到消息', msg.scene, msg.type, msg);
//     cc.director.GlobalEvent.emit('getNetMsg',  msg.content)
// },
// //收到同步消息
// cc.director.GlobalEvent.on('getNetMsg', function (data) {
//     //收到同步消息
//     console.log('收到同步消息', data);
// }, this)