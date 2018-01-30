/**
 * Created by chuhaoyuan on 2017/9/27.
 */
const EventListener = function (obj) {
  let Regisiter = {};
  obj.on = function (name, method) {
    if (!Regisiter.hasOwnProperty(name)){
      Regisiter[name] = [];
    }
    Regisiter[name].push(method);
  };
  obj.fire = function (name) {
    if (Regisiter.hasOwnProperty(name)){
      let handlerList = Regisiter[name];
      for (let i = 0 ; i < handlerList.length ; i ++){
        let handler = handlerList[i];
        let args = [];
        for (let j = 1 ; j < arguments.length ; j ++){
          args.push(arguments[j]);
        }
        handler.apply(this, args);
      }
    }
  };
  obj.off = function (name, method) {
    if (Regisiter.hasOwnProperty(name)){
      let handlerList = Regisiter[name];
      for (let i = 0 ; i < handlerList.length ; i ++){
        if (handlerList[i] === method){
          handlerList.splice(i, 1);
        }
      }
    }
  };

  obj.removeAllListeners = function () {
    Regisiter = {};
  };

  return obj
};
export default EventListener;