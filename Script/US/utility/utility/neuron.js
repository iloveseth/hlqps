/**
 * Created by chuhaoyuan on 2017/9/28.
 */
const Neuron = function () {
  let that = {};

  let _c = Math.random();


  that.getValue = function (x1,x2) {
    if (x1 < _c){
      return x1;
    }
    return x2;
  };

  return that;
};
export default Neuron;