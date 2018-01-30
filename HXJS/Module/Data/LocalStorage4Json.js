import { log } from "../../Util/Log";
import { isNullOrUndefined } from "util";



export let localStorage4Json = 
{
    /*
    * 写入数据，将数据存储在本地
    * @param jsonName:json文件名字
    */
    //   var baseData = [{a:1, aa:2, cc:3},{b:2},{c:3},{d:4},{e:5},{f:6},{g:7}];
    SetItem (key, jsonName) {
        var baseData = JSON.stringify(jsonName); // 将json格式转换成string
        if (baseData)
            cc.sys.localStorage.setItem(key, baseData); // 将数据存储在本地
        else {
            log.error("localStorage4Json setError key="+key+", data="+jsonName);
        }
    },
    /*
    * 读取基础数据
    * 还回json格式数据
    */
    GetItem (key) {
        var baseData = cc.sys.localStorage.getItem(key); //从本地读取数据
        if (isNullOrUndefined(baseData))
            return null;
        
        try {
            return JSON.parse(baseData);
        } catch (e) {
            return null;
        }
        return null;
    },
    /*
    * 删除数据
    */
    RmvItem (key) {
        cc.sys.localStorage.removeItem(key);
    }
}