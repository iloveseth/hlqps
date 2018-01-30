
export let timer = {
    GetCurTime : function (){
        var info = '';
    
        // 1,时间
        var dt = new Date();
        var t1 = dt.getMonth();   //获取当前月份(0-11,0代表1月)
        var t2 = dt.getDate();    //获取当前日(1-31)
        var t3 = dt.getHours();   //获取当前小时数(0-23)
        var t4 = dt.getMinutes(); //获取当前分钟数(0-59)
    
        info = (t1+1)+'月'+t2+'日\n'+t3+':'+t4;
        
        return info;
    },
    
    GetCurTime_S : function (){
        var info = '';
    
        // 1,时间
        var dt = new Date();
        // var t1 = dt.getMonth();   //获取当前月份(0-11,0代表1月)
        // var t2 = dt.getDate();    //获取当前日(1-31)
        var t3 = dt.getHours();   //获取当前小时数(0-23)
        var t4 = dt.getMinutes(); //获取当前分钟数(0-59)
        var t5 = dt.getSeconds(); //获取当前秒数(0-59)
    
        info = t3+':'+t4+':'+t5;
        
        return info;
    }
}
