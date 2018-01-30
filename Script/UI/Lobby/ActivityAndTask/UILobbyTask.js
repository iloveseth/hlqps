import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {
        activeProg: cc.ProgressBar,
        activeToday: cc.Label,
        
        groupPackage:cc.Node,
        packages:[cc.Node],
        receiveList:null,

        playerInf:null,
        packageInf:null,
        //activeInf = {
        //      activeNum:活跃度
        //      activePack: 包裹信息
        //}
        // lstTaskTyp:require('UILst'),
        groupTask: require('UIGroup'),

        rolTask:require('UIScrollView'),
        rolGrowTask:require('UIScrollView'),
        
        userData:null,
        activeIdx:null,

        subTypId:-1,//任务类型：活动任务，成长任务

        activity : cc.Node,

        userDataChanged:false,
        needUpdateUserData:false,

        curPackClickedID: null,

    },

    ////////////////////////////////////////////////////////////////////////////////////////////////
    onLoad: function () {
        this.userData = hxfn.role.curUserData;
        this.activeIdx = this.userData.playerActivityInfo.vitality; 

        this.Reset();
        this.OnSignal();
        this.SetActivityState();

    },
    
    start(){
        this.GetTaskList();
        this.GetAvRewardList();
    
        this.needUpdateUserData = false;
    },

    Reset(){
        for(var i=0;i!=5;++i){
            this.packages[i].getComponent('UILobbyPacks').SetState(0);
        }
    },

    onDestroy:function () {
        hxfn.activityAndTask.UnRegistUIRefresh();
    },

    onEnable:function(){
        this.userDataChanged = false;
        hxjs.util.Notifier.on('ReceiveTaskAward',this.HandleReceive,this);
        hxjs.util.Notifier.on('PackClicked',this.HandlePack,this);
    },

    onDisable:function(){
        hxjs.util.Notifier.off('ReceiveTaskAward',this.HandleReceive,this);
        hxjs.util.Notifier.off('PackClicked',this.HandlePack,this);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////


    //领取任务奖励
    HandleReceive(taskItem){
        let item = taskItem;
        var postData = {
            taskType: this.subTypId,
            taskId:item.nodeInfo.taskId,
        };
        // hxfn.net.Request(
        hxfn.netrequest.Req_GetTaskReward(
            postData,
            // 'GetTaskRewardReq',
            // hxdt.msgcmd.GetTaskReward,//获取任务奖励
            function(msg){
                if(msg.result == 0){
                    
                    var info = taskItem.nodeInfo;
                    //info 即为领取的TaskDataProto
                    this.GetTaskReward(info);

                    //刷新所有当前类型任务状态
                    this.UpdateTaskTyp(this.subTypId);
                    hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Task, 1]);
                    hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Task]);
                    item.SetButtonState(2);
                }
            }.bind(this)
        )
    },

    HandlePack(pack){
        cc.log('领取活跃度奖励');

        this.curPackClickedID = pack.packInfo.id;

        // hxfn.net.Request(
        hxfn.netrequest.Req_PlayerGetAvReward(
            {id: pack.packInfo.id},
            // 'PlayerGetAvRewardReq',
            // hxdt.msgcmd.GetAvReward,//获取活跃度奖励

            function(msg){
                // var msg = hxdt.builder.build('PlayerGetAvRewardResp').decode(data);
                if(msg.result == 0){
                    pack.SetState(2);//领取成功

                    var info = pack.packInfo
                    this.GetAvReward(info);

                    var rewardInfo = hxfn.role.curUserData.playerActivityInfo.activityVitalityGetedRewardId;
                    rewardInfo = rewardInfo?rewardInfo:[];
                    rewardInfo.push(this.curPackClickedID);
                    hxfn.role.curUserData.playerActivityInfo.activityVitalityGetedRewardId = rewardInfo;
                    hxjs.util.Notifier.emit('UserData_Update');
                }
            }.bind(this)
        )
    },

    OnSignal(){
        //this.node.on('ReceiveTaskAward',this.HandleReceive.bind(this));
        //this.node.on('PackClicked',this.HandlePack.bind(this));
    },

    GetTaskList(){
        //由于需要一进大厅就开始获取任务与活动的数据，所以只需要去取
        //但也有可能快速打开界面时，尚未完成数据的获取，所以需要注册一个响应方法来获取响应
        hxfn.activityAndTask.RegistUIRefresh(this.InitTaskList.bind(this));
        if(hxfn.activityAndTask.hasInitData_Task) {
            this.InitTaskList();
        }

        // hxfn.activityAndTask.GetAllTasksFromServer(this.InitTaskList.bind(this));
    },
    
    InitTaskList:function (){
        this.groupTask.SetInfo(this.CheckTaskTyp.bind(this));
        this.groupTask.SetDefaultIdx(0);
    },

    CheckTaskTyp:function (idx) {
        // if(idx == this.subTypId){
        //     return;
        // }
        this.subTypId = idx;
        hxfn.activityAndTask.curTaskTypId = idx;
        
        if(idx == 0){
            //重新初始化活跃度信息
            this.Reset();
            this.SetActivityState();
            this.GetAvRewardList();
        }
        
        hxjs.module.ui.hub.ShowWaitingUI();
        hxfn.activityAndTask.GetTasksFromServerById(idx, function(){
            hxjs.module.ui.hub.HideWaitingUI();
            this.activity.active = this.subTypId == 0;
            
            var taskData = hxfn.activityAndTask.GetTaskData(idx);
            hxfn.activityAndTask.UpdateCurTypTasks(taskData,idx);
    
            if(idx == 0){
                this.rolGrowTask.node.active = false;
                this.rolTask.node.active = true;
                this.rolTask.populateList(taskData);
                
            }
            else if(idx == 1){
                this.rolGrowTask.node.active = true;
                this.rolTask.node.active = false;
                this.rolGrowTask.populateList(taskData);
            }
        }.bind(this));
    },

    UpdateTaskTyp: function(idx){
        var taskData = hxfn.activityAndTask.GetTaskData(idx);
        hxfn.activityAndTask.UpdateCurTypTasks(taskData,idx);
    },

    GetGrowTaskList(){
        var idx = 1;
        hxfn.activityAndTask.GetTasksFromServerById(idx, function(){
            // var taskData = hxfn.activityAndTask.allTasks.get(idx);
            var taskData = hxfn.activityAndTask.GetTaskData(idx);
            
            hxfn.activityAndTask.UpdateCurTypTasks(taskData,idx);

            this.rolTask.node.active = false;
            this.rolGrowTask.node.active = true;
            this.rolGrowTask.populateList(taskData);
        }.bind(this));
    },

    GetAvRewardList:function(){
        // hxfn.net.Request(
        hxfn.netrequest.Req_GetActivityVitality(
            {},
            function(msg){
                if(msg.result == 0){
                    for(var i = 0;i!= 5;++i){
                        var src_Packs = this.packages[i].getComponent('UILobbyPacks');
                        var info = msg.activityVitalityProto[i];
                        src_Packs.SetInfo(info);
                        if(this.activeIdx >= info.vitality){
                            src_Packs.SetState(1)
                        }
                        else{
                            src_Packs.SetState(0);
                        }
                        if(hxfn.comn.JudgeIncluding(info.id,hxfn.role.curUserData.playerActivityInfo.activityVitalityGetedRewardId)){
                            src_Packs.SetState(2);
                        }
                    }    
                }
            }.bind(this)
        )
    },

    SetActivityState(){
        
        //this.activeProg.progress = this.activeIdx/100;
        this.activeProg.getComponent('UIProg').SetProg(parseFloat(this.activeIdx/100));
        this.activeToday.string = this.activeIdx + '';
    },

    //领取任务奖励
    GetTaskReward(info){
        //TODO:领取任务奖励，info即为领取的奖励
        if(hxfn.activityAndTask.curTaskTypId == 0){
            this.activeIdx += info.awardVitality;//活跃度更新
            hxfn.role.curUserData.playerActivityInfo.vitality = this.activeIdx;
            this.SetActivityState();
            this.GetAvRewardList();
        }
        if(hxfn.activityAndTask.curTaskTypId == 1){
            this.GetGrowTaskList();
        }
        // this.userDataChanged = true;
        // this.needUpdateUserData = true;
        
    },

    //领取活跃度奖励
    GetAvReward(info){
        //TODO：领取活跃度奖励，info即为领取的奖励
        // this.userDataChanged = true;
        // this.needUpdateUserData = true;
    }
});
