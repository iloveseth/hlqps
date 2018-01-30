import { hxfn } from "./../HXFN";

export let activityAndTask = 
{
    EnumPack:cc.Enum({
        CannotReceive:0,
        ToBeReceived:1,
        HasReceived:2,
    }),

    Enum_Menu:cc.Enum({
        Activity:0,
        Task:1,
    }),

    curSelectMenu: 0,

    //activity
    activitySignProto:null,
    hasSignedToday: false,
    signList:null,

    //task
    curTypTasks:null,
    allTasks:new Map(),

    //因为是用来获取任务类型，所以只需要初始化一次即可（一次刷新）
    //任务子类，每次切换会自行获取自己所需数据（需要每次刷新）
    hasInitData_Task:false,
    activityTypsInfo : [{name:'每日签到', clas: 1}],
    taskTypsInfo:[{name:'日常任务', clas: 2},{name:'成长任务', clas: 2}],
    taskTyps: [0,1],
    countGetTaskTypData:0,

    curTaskTypId: null,

    // OnInit(){
        
    // },
    
    OnStart(){
        //this.curSelectMenu = this.Enum_Menu.Activity;

        //1, 签到：预获取数据
        this.signList = this.InitCurMonthSignInfo();
        this.CheckTodayHasSigned ();
        
        this.OnReset();
    },

    OnReset(){
        //---------------------------------------------------
        //为了New的提示
        //1, 签到：预获取数据
        // this.signList = this.InitCurMonthSignInfo();
        // this.CheckTodayHasSigned ();
        // this.GetAllActivitysFromServer(null);
        
        //2, 任务：预获取数据，改为打开界面的时候再获取
        this.hasInitData_Task = false;
        this.GetAllTasksFromServer();
        //---------------------------------------------------
    },

    OnEnd(){
        this.curSelectMenu=0;
        this.curTypTasks=null;
        this.allTasks.clear();
        this.hasSignedToday = false;

        this.hasInitData_Task = false;
        this.countGetTaskTypData = 0;
        // this.callback_openUI = null,
        this.callback_refreshTaskUI = null,
        this.isStartingGetTaskData = false;
    },

    callback_refreshTaskUI:null,
    RegistUIRefresh(cb_task){
        this.callback_refreshTaskUI = cb_task;
    },
    UnRegistUIRefresh(){
        this.callback_refreshTaskUI = null;
    },

    /// 签到 分割线
    ////////////////////////////////////////////////////////////////////////////////
    GetAllActivitysFromServer(callback_ui){
        cc.log('GetAllActivitysFromServer');

        var postData = {};

        hxjs.module.ui.hub.ShowWaitingUI ();
        hxfn.netrequest.Req_GetActivitySign(postData, function(msg){
            hxjs.module.ui.hub.HideWaitingUI ();
            // var msg = hxdt.builder.build('GetActivitySignResp').decode(data);
            if(msg.get('result') == 0){
                this.activitySignProto = msg.get('activitySignProto'); 
                cc.log(this.activitySignProto);

                if(callback_ui != null)
                    callback_ui();
            }
        }.bind(this));

        // hxfn.net.Request(
        //     postData,
        //     'GetActivitySignReq',
        //     hxdt.msgcmd.GetAsRewardList,
        //     function(data){
        //         var msg = hxdt.builder.build('GetActivitySignResp').decode(data);
        //         if(msg.get('result') == 0){
        //             this.activitySignProto = msg.get('activitySignProto'); 
        //             cc.log(this.activitySignProto);

        //             if(callback_ui != null)
        //                 callback_ui();
        //         }
        //     }.bind(this),
        // );
    },

    CountAllUndoneActivity(){
        // TODO: 所有子类型相加
        //HACK
        var n = this.CountUndoneActivityByTyp(0/*签到*/);

        return n;
    },

    CountUndoneActivityByTyp (subTypId) {
        var n = 0;

        if(subTypId === 0){
            n = this.CountUnsigndDays();
        }
        else {
            // TODO 活动的类型，除签到的类型比较特殊之外
            // n = 
        }

        return n;
    },

    //sub type : 只记住 今日未签到
    CountUnsigndDays:function () {
        if(this.hasSignedToday)
            return 0;
        else
            return 1;
    },
    
    

    //检测今天是否已签到
    CheckTodayHasSigned:function () {
        var t = new Date().getDate();
        this.UpdateSignState(this.signList[t-1]);
    },

    UpdateSignState (isSignedToday) {
        this.hasSignedToday = isSignedToday;
        
        hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Activity]);
        hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Activity, 0]);
    },

    
    //初始化本月所有天签到信息
    InitCurMonthSignInfo() {
        var signList = new Array(new Date(new Date().getFullYear(),new Date().getMonth() + 1,0).getDate());//这句话的含义是建立一个长度为本月天数的数组
        for(var i=0;i!=signList.length;++i)
        {
            signList[i] = this.CheckHasSigned(i+1);
        }

        return signList;
    },

    //检测该天是否已签到
    CheckHasSigned:function (d) {
        return this.GetGold(d) > 0;
    },

    //获取领取的金币数
    GetGold:function(date){
        this.userData = hxfn.role.curUserData;
        var dailySignInfo = this.userData.playerActivityInfo.dailySignInfo;
        for(var i =0;i!=dailySignInfo.length;++i){
            if(dailySignInfo[i].day == date){
                return parseInt(dailySignInfo[i].gold);
            }
        }
        return 0;
    },


    /// 任务 分割线
    ////////////////////////////////////////////////////////////////////////////////////////
    Callback_GetTaskTypeData:function(){
        this.countGetTaskTypData += 1;
        cc.log('Callback_GetTaskTypeData: ' + this.countGetTaskTypData);

        if(this.countGetTaskTypData >= this.taskTyps.length) {
            hxjs.module.ui.hub.HideWaitingUI ();

            this.isStartingGetTaskData = false;
            this.countGetTaskTypData = 0;
            
            this.hasInitData_Task = true;

            // if(this.callback_openUI!= null) {
            //     this.callback_openUI();
            // }
            if(this.callback_refreshTaskUI) {
                this.callback_refreshTaskUI();
            }
        }
    },
    
    GetAllTasksFromServer () {
        if(this.hasInitData_Task) {
            if(this.callback_refreshTaskUI) {
                this.callback_refreshTaskUI();
            }
            return;
        }

        //如果已经开始加载数据，则只需要等待完成
        //如果还没开始，则开始请求数据
        if(!this.isStartingGetTaskData) {
            hxjs.module.ui.hub.ShowWaitingUI ();
            this.GetAllTasksFromServer2();
        }
    },

    // GetAllTasksFromServer (cb) {
    //     this.callback_openUI = cb;
        
    //     if(this.hasInitData_Task) {
    //         if(this.callback_openUI!= null) {
    //             this.callback_openUI();
    //         }
    //         return;
    //     }

    //     //如果已经开始加载数据，则只需要等待完成
    //     //如果还没开始，则开始请求数据
    //     if(!this.isStartingGetTaskData) {
    //         hxjs.module.ui.hub.ShowWaitingUI ();
    //         this.GetAllTasksFromServer2();
    //     }
    // },

    GetAllTasksFromServer2:function (){
        if(this.isStartingGetTaskData)
            return;
        this.isStartingGetTaskData = true;

        this.GetTasksFromServerById(0, this.Callback_GetTaskTypeData.bind(this));
        this.GetTasksFromServerById(1, this.Callback_GetTaskTypeData.bind(this));
    },

    GetTasksFromServerById (taskTypId, callback_ui){
        var postData = {
            taskType:taskTypId,
        };

        hxfn.netrequest.Req_GetTaskList(postData, function(msg){
            // var msg= hxdt.builder.build('GetTaskListResp').decode(data);
            var taskData = msg.get('taskData');
            hxfn.activityAndTask.UpdateCurTypTasks(taskData, taskTypId);

            if(callback_ui!= null){
                callback_ui();
            }
        }.bind(this));

        // hxfn.net.Request(
        //     postData,
        //     'GetTaskListReq',//获取任务列表
        //     hxdt.msgcmd.GetTaskList,
        //     function(data){
        //         var msg= hxdt.builder.build('GetTaskListResp').decode(data);
        //         var taskData = msg.get('taskData');
        //         hxfn.activityAndTask.UpdateCurTypTasks(taskData, taskTypId);

        //         if(callback_ui!= null){
        //             callback_ui();
        //         }
        //     }.bind(this),
        // )
    },

    UpdateCurTypTasks (ts, typid) {
        // this.allTasks[typid] = ts;
        this.allTasks.set(typid,ts);
        this.curTypTasks = ts;

        hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Task, typid]);
        hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Task]);
    },

    //所有类型总数：已完成但未领取的任务
    CountAllUnawardTasks () {
        var n = 0;

        // for (var Key in this.allTasks){
        //     n+= this.CountUnawardTasksByTyp(Key);
        // }
        this.allTasks.forEach((val,key,map)=>{
            n+= this.CountUnawardTasksByTyp(key);
        });

        return n;
    },

    //子类型：已完成但未领取的任务
    CountUnawardTasksByTyp (subTypId) {
        //HACK
        // var tasks = this.curTypTasks;
        // var tasks = this.allTasks[subTypId];
        var tasks = this.allTasks.get(subTypId);

        if(tasks == null)
            return 0;
    
        var n = 0;
        tasks.forEach(function(element) {
            if(element){
                if(element.get('progress') >= element.get('taskNum') && !element.get('haveGetReward'))
                n+=1;
            }
        }, this);

        return n;
    },

    GetTaskData (id){
        return this.allTasks.get(id);
    }
}