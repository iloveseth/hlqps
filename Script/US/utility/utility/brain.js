/**
 * Created by chuhaoyuan on 2017/9/28.
 */
import Neuron from './neuron'
import defines from './../defines'
const Brain = function () {
  let that = {};

  let _neuron = Neuron();


  let time = 0;
  let _behaviour = undefined;

  const BehaviourList = Object.keys(defines.tankBehaviourMap);


  that.getBehaviour = function () {
    let index = Math.floor(Math.random() * (BehaviourList.length - 1));
    _behaviour = BehaviourList[index];
    // console.log('index = ' + index);
    // console.log("behaviour" + _behaviour);
    return _behaviour;
  };
  return that;
};
export default Brain;