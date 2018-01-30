/**
 * Created by chuhaoyuan on 2017/9/27.
 */
import EventListener from './utility/eventlistener'
const global = {} || global;
global.event = EventListener({});
export default global;