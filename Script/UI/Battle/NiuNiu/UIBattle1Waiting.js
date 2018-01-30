import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        btnReady:require('UIButton'),
        readyMarks:[cc.Node],

        hasMyReady:{default:false, serializable:false, visible:false},
    },

    /////////////////////////////////////////////////////////////////
    // onLoad: function () {},
    OnInit () {
        this.btnReady.SetInfo(this.ClickReady.bind(this),'准备');
        
        //1,layout
        this.btnReady.node.active = false;

        //2,data
        cc.log('UIBattle1Waiting on init!');
        this.hasMyReady = false;
    },

    CheckReadyBtn(){
        this.btnReady.node.active = !this.hasMyReady;
    },

    OnReset () {
        this.hasMyReady = false;
        this.btnReady.node.active = false;//true;

        this.readyMarks.forEach(element => {
            if(element)
                element.active = false;
        });
    },

    OnEnd () {
        this.OnReset();
    },
    /////////////////////////////////////////////////////////////////
    

    ClickReady:function() {
        var postData = {
            playerId:hxfn.role.playerId,
            ready : true,
        };
        hxfn.netrequest.Sync_QZInputReady(postData);

        this.hasMyReady = true;
        this.btnReady.node.active = false;

        hxjs.util.Notifier.emit('UI_Battle_UpdateCDEventName', hxfn.battle_pinshi.Enum_EventCD.HasReady);        
    },

    SetReady (pid) {
        //1, 处理头像上的已准备标记，标记已准备的玩家------------
        var idx = hxfn.battle.GetUISeatIdx(pid);
        
        if(idx == -1) {
            cc.log('[hxjs][err] cant find player id in all battle players, bid: ' + pid);
        }
        else {
            cc.log('SetReady: ' + idx)
            // this.lstReadyMark.SetItem(idx, null);
            if(this.readyMarks[idx])
                this.readyMarks[idx].active = true;
        }

        //2, 处理玩家自己的已准备按钮---------------------------
        if(pid == hxfn.role.playerId) {
            this.HasReady();
        }
    },

    // 当QuitRoom时的处理
    ClearReadyFlag(pid){
        //清理已准备的玩家
        var idx = hxfn.battle.GetUISeatIdx(pid);
        var mark = this.readyMarks[idx];
        if(mark)
            mark.active = false;
    },

    RingBegin(){
        this.HasReady();

        this.readyMarks.forEach(element => {
            if(element)
                element.active = false;
        });
    },

    HandleWaitOtherOne (isWait) {
        if(isWait) {
            this.btnReady.node.active = false;
        }
        else {
            this.CheckReadyBtn();
        }
    },


    HasReady:function(){
        this.hasMyReady = true;
        this.CheckReadyBtn();
    },
    
    /////////////////////////////////////////////////////////////////
    // PlayStartEff () {
    //     // hxjs.module.ui.hub.TogglePanel(this.startUI, 'UI_Battle_NiuNiu_Start','UIBattle1StartEff' , true, function(prefab){
    //     //     this.startUI = prefab;
    //     // }.bind(this));

    //     hxjs.module.ui.hub.TogglePanel(this.startUI, 'UI_Battle_NiuNiu_Start','UIPanelAnim' , true, function(prefab){
    //         this.startUI = prefab;
    //     }.bind(this), hxdt.setting_niuniu.Anim_Stay_Opening);
    // },
});