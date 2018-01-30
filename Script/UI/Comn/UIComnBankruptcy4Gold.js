import { hxfn } from '../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {
        txtSummary:cc.Label,
        txtFreeGoldSupply:cc.Label,
        txtCD4FreeGet:cc.Label,
        btnGetGold:require('UIButton'),
        btnGoRoomIngot:require('UIButton'),
        btnGotoTask:require('UIButton'),
        btnClose:require('UIButton'),
        timer:{ default: null, serializable: false, visible: false},
    },

    onLoad: function () {
        // base func
        hxjs.module.ui.hub.ShowWaitingUI(); 
        this.txtCD4FreeGet.string="N/A";
        this.txtFreeGoldSupply.string = 'N/A金币';
        // this.safeGuardType = ['金币','元宝'];
        this.btnGoRoomIngot.SetInfo(this.GoIngotRoom.bind(this),'前往元宝场');
        this.btnGetGold.SetInfo(this.GetGold.bind(this),'领取金币');
        this.btnGotoTask.SetInfo(this.GotoTask.bind(this),'去做任务');
        this.btnClose.SetInfo(this.CloseSelf.bind(this),'关闭');
        
        this.btnGotoTask.node.active=true;
        this.btnGetGold.node.active=false;
        //layout
        this.txtCD4FreeGet.string = hxfn.comn.GetTimeStyle(0);
        hxfn.netrequest.Req_GetSafaGuardInfoReq(function(msg){ 
            hxfn.role.safeGuard=msg.safeGuard;
            this.showInfo();
            hxjs.module.ui.hub.HideWaitingUI();
        }.bind(this));
    },
    
    showInfo: function () {
        //开始倒计时
        //如果可以领取免费金币，则点亮按钮！！！
        var safeGuard = hxfn.role.safeGuard;
        this.safeGuradType = hxfn.comn.safeGuradType;
        if(safeGuard != null) {
            this.txtFreeGoldSupply.string = safeGuard.safeGuardGold + '金币';
            var nextTime = safeGuard.safeGuardNextTime;
            //cc.log("@@time"+nextTime);
            if(nextTime<=0/*表示可以领取补助*/) {
                this.EnableSafeGuard(safeGuard);
            }
            else {
                this.CD4SafeGuard(safeGuard);
            }
        }
        else {
            hxjs.module.ui.hub.LoadDlg_Info('破产补助数据有异常！','提示');
        }
    },

    EnableSafeGuard:function (safeGuard){
        this.btnGotoTask.node.active=false;
        this.btnGetGold.node.active=true;
        this.txtCD4FreeGet.string = hxfn.comn.GetTimeStyle(0);
    },

    CD4SafeGuard:function (safeGuard){
        this.btnGotoTask.node.active=true;
        this.btnGetGold.node.active=false;
        //倒计时下次可领取的时间
        var time = safeGuard.safeGuardNextTime; 
 
        this.schedule(function(){
            time --;
            if(time <= 0){
                this.EnableSafeGuard(safeGuard);
                this.unscheduleAllCallbacks(this);
            }
            else{ 
                this.txtCD4FreeGet.string = hxfn.comn.GetTimeStyle(time);
            }
        },1/*每秒执行一次*/);
 
    },
    CloseSelf:function(noRoomList){
        this.txtCD4FreeGet.string = hxfn.comn.GetTimeStyle(0);
  
        // this.txtCD4FreeGet.string = '已过期';
        this.btnGotoTask.node.active=true;
        this.btnGetGold.node.active=false;
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
        hxjs.module.ui.hub.Unload (this.node);
        if(noRoomList==false){
            if(this.safeGuradType==1){ 
                // hxjs.util.Notifier.emit('UI_BattleQuit'); 
                hxfn.battle.QuitNormal();
            } 
        }

    },

    
    GoIngotRoom:function () {
        //预设置房间选择界面为元宝房
        hxfn.map.curRoomTyeIdxSet = 0/*元宝房UI索引*/;
        this.CloseSelf(false);
        //再离开金币房 
        hxjs.util.Notifier.emit('UI_Lobby_RoomTypMgr_Select_Ingot');
        
        //由于离开战斗界面后会自动打开房间选择界面
        //hxjs.module.ui.hub.LoadPanel('UI_Lobby_RoomTypMgr');
    },
    GotoTask:function(){
        //hxjs.module.ui.hub.LoadDlg_Info('暂未开放，敬请期待','');
        this.CloseSelf(true);
        hxfn.battle.QuitFastToTask(hxfn.activityAndTask.Enum_Menu.Task);   
    },
    GetGold(){
        hxfn.netrequest.Req_GetSafaGuardRewardReq(
            function(msg){
                var result = msg.get('result');
                if(!hxfn.comn.HandleServerResult(result)){
                    //领取成功
                    if(this.safeGuradType==0){
                        this.CloseSelf(false);
                    }
                    else if(this.safeGuradType==1){
                        this.CloseSelf(false);
                        hxfn.level.StartJoinGoldFlow();
                    }
                   
                    
                    //由playerinfochange通知刷新玩家货币信息
                }
            }.bind(this)
        )
    }
});