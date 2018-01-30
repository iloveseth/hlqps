cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        groupMenu: cc.Node,
        src_GroupMenu:null,
        menuSign:cc.Node,
        scrollButton:cc.ScrollView,

        activityLeft: cc.Node,
        activityRight:cc.Node,
        taskLeft:cc.Node,
        taskRight:cc.Node,


        activity: cc.Node,
        task:cc.Node,

        actIdx:null,

        groupActivity: cc.Node,
        groupTask:  cc.Node,

        //红色版本
        btnSign: cc.Node,
        btnDaily:cc.Node,
        btnGrown: cc.Node,
    },

    onLoad: function () {
        cc.log('UILobbyActivityAndMission.onLoad');
        this.OnInit('每日奖励');//'ui_lobby_fn_close', 
        
        this.groupMenu.getComponent('UIGroup').SetInfo(function(idx){
            cc.log('groupMenu');
            this.activity.active = idx==0;
            this.task.active = !idx== 0;
            this.groupActivity.active = idx == 0;
            this.groupTask.active = !idx == 0;

            //红色版本
            if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED) {
                this.btnSign.active = idx == 0;
                this.btnDaily.active = !idx == 0;
                this.btnGrown.active = !idx == 0;
            }

        }.bind(this),['活动','任务']);

        hxfn.adjust.AdjustLabel(this.node);
        this.Reset();
    },

    start:function () {
        this.groupMenu.getComponent('UIGroup').SetDefaultIdx(hxfn.activityAndTask.curSelectMenu);
    },

    Reset(){
        this.activity.active = false;
        this.task.active = false;
    },
});
