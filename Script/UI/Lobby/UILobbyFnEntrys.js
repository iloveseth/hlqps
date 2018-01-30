cc.Class({
    extends: cc.Component,

    properties: {
        btnShare:require('UIButton'),//分享
        btnAfterSale:require('UIButton'),//客服
        btnSetting:require('UIButton'),//设置
        
        btnShop: require('UIButton'),//商店
        btnIptRoom: require('UIButton'),//输入房号

        btnRank: require('UIButton'),//排行榜
        btnActivity: require('UIButton'),//活动
        btnMission: require('UIButton'),//任务
        btnMail: require('UIButton'),//消息
        btnAnnouncement: require('UIButton'),//公告

        //TEMP/////////////////////////////////////
        btnFive:require('UIButton'),

        // [nondisplay]
    },
    
    onLoad:function () {
        //this.btnShare.SetInfo(function(){hxjs.module.ui.hub.LoadPanel_Dlg ('UI_Lobby_Share');});
        //this.btnAfterSale.SetInfo(function(){hxjs.module.ui.hub.LoadPanel_Dlg ('UI_Lobby_FeedBack');});
        this.btnShare.SetInfo(function(){this.LoadFn("UI_Lobby_Share")}.bind(this),'分享');
        //this.btnAfterSale.SetInfo(function(){this.LoadFn("UI_Lobby_FeedBack")}.bind(this),'客服');
        this.btnAfterSale.SetInfo(function(){this.LoadFn("UI_Lobby_Record")}.bind(this),'客服');

        this.btnSetting.SetInfo(function(){this.LoadFn("UI_Lobby_Setting")}.bind(this),'设置');

        this.btnShop.SetInfo(this.OpenShop.bind(this),'充值');
        this.btnIptRoom.SetInfo(function(){this.LoadFn("UI_Lobby_RoomDirectFind")}.bind(this),'输入房间号');

        this.btnRank.SetInfo(function(){this.LoadFn("UI_Lobby_Rank_Main")}.bind(this),'排行榜');

        //this.btnActivity.SetInfo(this.OpenActivity.bind(this),'活动');
        this.btnMission.SetInfo(this.OpenTask.bind(this),'任务');

        this.btnActivity.SetInfo(this.OpenActivity.bind(this),'活动');
        // this.btnMission.SetInfo(function(){
        //     hxjs.module.ui.hub.LoadDlg_Info(jsb.fileUtils.getWritablePath() + "patch/project.manifest",'');
        // }.bind(this),'任务');

        // this.btnActivity.SetInfo(function(){
        //     hxjs.module.ui.hub.LoadDlg_Info('暂未开放，敬请期待','');
        // }.bind(this),'活动');
      
        this.btnMail.SetInfo(function(){this.LoadFn("UI_Lobby_MailBox")}.bind(this),'邮箱');
        this.btnAnnouncement.SetInfo(function(){this.LoadFn("UI_Lobby_Notice")}.bind(this),'公告');

        this.btnFive.SetInfo(function(){
            //Create
            // hxjs.module.ui.hub.LoadPanel_Dlg ('UI_Lobby_RoomTypMgr_Gobang');
            // var gid = 4;//conf.get('gameType');
            // hxfn.map.curGameTypId = gid;
            // hxfn.five.CreateRoom();
        });
    },

    start: function () {
        hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Activity]);
        hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Task]);
        hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Mail]);
        hxjs.util.Notifier.emit('Update_Tip_New', [hxfn.newtip.Enum_TipNew.Fn_Notice]);

        //最后
        hxjs.util.Notifier.on('open_shop', this.OpenShop, this);
    },

    OnEnd () {
        //最优先
        hxjs.util.Notifier.off('open_shop', this.OpenShop, this);

    },

    onDestroy: function () {
        this.OnEnd();
    },

    OnReset:function () {
    },

    LoadFn:function (fnPanelName) {
        hxjs.module.ui.hub.LoadPanel_Dlg(fnPanelName);
    },

    // ！！！对于商店，活动，任务，邮件，公告，排行榜都采取类似的流程
    // 如果已经初始化数据完成，则直接打开界面
    // 如果还未完成，则需要调用初始化数据的方法，等待数据获取成功，则回调打开界面

    // ！！！开发此界面，需要先向服务器请求数据，待到数据成功返回再加载界面，否则打开界面流程失败！！！
    // ！！！事关游戏大厅的多个类似类型的界面操作！！！
    OpenShop:function(idx){
        //先准备好数据，完成之后再加载界面
        // hxfn.shop.GetMarketList(
        //     function(){
        //         if(idx == 1){
        //             hxfn.shop.curShop = 1;
        //         }
        //         else{
        //             hxfn.shop.curShop = 0;
        //         }
        //         this.LoadFn("UI_Lobby_Shop")
        //     }.bind(this)
        // );

        //先直接响应界面打开，然后等待数据，体验更好！！！
        if(idx == 1){
            hxfn.shop.curShop = 1;
        }
        else if(idx==3){
            hxfn.shop.curShop = 3;
        }
        else{
            hxfn.shop.curShop = 0;
        }
        this.LoadFn("UI_Lobby_Shop_new2");
    },

    OpenActivity:function (){
        hxfn.activityAndTask.curSelectMenu = hxfn.activityAndTask.Enum_Menu.Activity;
        this.LoadFn("UI_Lobby_ActivityAndMission_new2");
    },

    OpenTask:function (){
        // if(hxfn.activityAndTask.hasInitData_Task) {
        //     this.LoadTaskPanel();
        // } else{
        //     hxfn.activityAndTask.GetAllTasksFromServerByClickBtn(this.LoadTaskPanel.bind(this));
        // }

        this.LoadTaskPanel();
    },

    LoadTaskPanel:function () {
        hxfn.activityAndTask.curSelectMenu = hxfn.activityAndTask.Enum_Menu.Task;
        this.LoadFn("UI_Lobby_ActivityAndMission_new2");
    },
});