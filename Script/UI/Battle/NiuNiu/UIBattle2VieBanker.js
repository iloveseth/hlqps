import { hxdt } from '../../../DT/HXDT';
import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {
        btnCancelView: require('UIButton'),
        scr_GroupRatio:require('UIGroup'),
        lst_Ratio: cc.Node,

        arrVieBankerCon:[cc.Node],
        arrVieBankerPref:[cc.Node],
        arrVieBanker:[],

        // rations:{default:null, serializable: false, visible: false},
        limit:{default:-1, serializable: false, visible: false},
    },

    onLoad: function () {
        for (let i = 0; i < hxdt.setting_niuniu.maxUISeats; i++) {
            //取消内部预加载
            // this.Preload(i);
            this.arrVieBanker[i] = this.arrVieBankerPref[i].getComponent('UIItemVieBanker');
        }

        // // this.scr_GroupRatio.SetInfo (this.SelectRatio.bind(this), null, true);
        // this.lstRatio.SetInfo(this.rations, this.SelectRatio.bind(this));
        this.btnCancelView.SetInfo(this.CancelRation.bind(this));

        this.OnInit();
        hxfn.adjust.AdjustLabel(this.node);
    },

    // Preload:function (idx){
    //     hxjs.module.ui.hub.LoadPanel('UI_Item_VieBanker',function(prefab){
    //         this.arrVieBanker[idx] = prefab.getComponent('UIItemVieBanker');
    //     }.bind(this),this.arrVieBankerCon[idx]);
    // },

    onDestroy:function (){
        if(this.arrVieBanker == null) return;

        this.arrVieBanker.forEach(element => {
            if(element != null)
            hxjs.module.ui.hub.Unload(element.node);
        });
    },

    OnInit:function () {
        cc.log('UIBattle2QuickBanker on init!');
        this.OnReset();
    },

    OnReset(){
        // if(this.scr_GroupRatio)
        //     this.scr_GroupRatio.node.active = false;
        if(this.lst_Ratio)
            this.lst_Ratio.active = false;
            
        this.arrVieBanker.forEach(element => {
            if(element)
                element.ResetAll();
        });
    },

    OnEnd () {
        this.OnReset();
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CancelRation:function () {

        this.SendRatio(0);
    },
    SelectRatio:function (idx, isValid) {
        // var isValid = this.limit > idx;
        if(!isValid) {
            let desc = '';
            if(hxfn.map.curRoomTyp === hxfn.map.Enum_RoomTyp.Ingot) { 
                desc = hxdt.setting.lang.Battle_Tip_VieBankerDisable;
            }
            else if(hxfn.map.curRoomTyp === hxfn.map.Enum_RoomTyp.Gold) { 
                desc = hxdt.setting.lang.Battle_Tip_VieBankerDisableGold;
            }
            hxjs.module.ui.hub.LoadTipFloat(desc);
            return;
        }

        this.SendRatio(idx+1);
        hxjs.util.Notifier.emit('UI_Battle_UpdateCDEventName', hxfn.battle_pinshi.Enum_EventCD.HasBankerVie);
    },
    SendRatio:function (ratio) {
        // this.scr_GroupRatio.node.active = false;
        if(this.lst_Ratio)
            this.lst_Ratio.active = false;
        
        var postData = {
            multiple : ratio,
        };
        hxfn.net.Sync(
            postData,
            'QZInputVieBanker',
            hxdt.msgcmd.QZInputVieBanker,//20060,
        );
    },

    TipVieBanker (Multis,limit){
        if(!hxfn.battle.hasPlayedCurGame)
            return;
            
        // cc.log(Multis);
        // cc.log("limits4QiangZhuang: " + limit);

        if(Multis && Multis.length > 0) {
            // this.scr_GroupRatio.node.active = true;
            if(this.lst_Ratio) {
                this.lst_Ratio.active = true;
                this.lst_Ratio.getComponent('UILst').SetInfo(Multis, this.SelectRatio.bind(this));
            }
        }

        this.limit = limit;
        if(limit != null && limit >= 0) {
            // this.scr_GroupRatio.Setlimit (limit);
            if(this.lst_Ratio)
                this.lst_Ratio.getComponent('UILst').Setlimit (limit);
        }
        else{
            cc.log('[hxjs][err] TipVieBanker: wrong limit num: ' + limit);
        }
    },

    //如果是庄家则不隐藏倍率，并且显示庄家头套
    SetBanker (info) {
        // this.scr_GroupRatio.node.active = false;
        if(this.lst_Ratio)
            this.lst_Ratio.active = false;
        
        // this.scr_lstRatioTip.Reset();
        for (let i = 0; i < hxdt.setting_niuniu.maxUISeats; i++) {
            this.arrVieBanker[i].ResetRatioTip();
        }

        //1,先判断是否抢庄
        var bid = info.get('banker');
        // hxfn.battle.bankerId = bid;
        hxfn.battle_pinshi.bankerId = bid;
        var ratio = info.get('multiple');
        var candidates = info.get('candidate');
        if(candidates.length > 0) {
            //播放抢庄声音
            hxjs.module.sound.PlayBattle(hxdt.setting_niuniu.Enum_BattleSFX.QZ_Selecting);

            //播放抢庄动画
            for (var i = 0; i < candidates.length; i++) {
                var pid = candidates[i];
                var idx = hxfn.battle.GetUISeatIdx(pid);

                // //有可能不存在？重复进
                // cc.log(hxfn.battle.uiRoles);
                // cc.log('Play vie animation player pid: ' + pid);
                // cc.log('Play vie animation player idx: ' + idx);
                // this.scr_LstVieAnim.SetItem(idx,null);
                if(idx != null && this.arrVieBanker[idx] != null)
                    this.arrVieBanker[idx].ShowVieAnim();
            }

            // HACK 逻辑错误 应该根据服务器确定庄家的具体时间来停掉 抢庄动画
            this.scheduleOnce(function(){
                hxjs.module.sound.StopBattle(hxdt.setting_niuniu.Enum_BattleSFX.QZ_Selecting);

                // this.scr_LstVieAnim.Reset();
                for (let j = 0; j < hxdt.setting_niuniu.maxUISeats; j++) {
                    // this.arrVieBanker[i].ResetRatioTip();
                    this.arrVieBanker[j].ResetVieAnim();
                }

                this.SureBanker(bid, ratio);
            }.bind(this),info.get('cdMS') / 1000);//hxdt.setting_niuniu.Time_Anim_VieBanker
        }
        else {
            this.SureBanker(bid, ratio);
        }
    },

    SureBanker:function (bid, ratio) {
        // 确定庄家声音
        hxjs.module.sound.PlayBattle(hxdt.setting_niuniu.Enum_BattleSFX.QZ_Sure);

        //2,定格在庄家上
        var idx = hxfn.battle.GetUISeatIdx(bid);
        if(idx == null || idx == -1) {
            cc.log('[hxjs][err] cant find banker id in all battle players, bid: ' + bid);
        }
        else {
            // this.scr_LstBankerMark.SetItem(idx, null);
            this.arrVieBanker[idx].SureBanker();

            //3, 显示抢庄倍数
            this.ShowRatioTip(idx, ratio);
        }
    },

    //需要静默处理
    SureBanker_Recover (idx, ratio) {
        this.arrVieBanker[idx].SureBanker();
        this.ShowRatioTip(idx, ratio);
    },

    ShowVieRatioTip (info) {
        var playerid = info.get('playerId');
        var idx = hxfn.battle.GetUISeatIdx(playerid);
        var ratio = info.get('multiple');

        if(idx == null || idx == -1) {
            cc.log('[hxjs][err] cant find player id in all battle players, pid: ' + playerid);
        }
        else {
            this.ShowRatioTip(idx, ratio);
            
            //播放抢庄声音
            this.PlaySound(ratio, idx)
        }
    },

    ShowRatioTip_Recover(idx, mul) {
        this.ShowRatioTip(idx, mul);
    },
    ShowRatioTip: function(idx, mul) {
        cc.log('~~~~~~~~~~~~~~~~~~ Show vie RatioTip: ' + idx + ' /mul: ' + mul);
        //(注意：由系统决定庄家的模式里，不显示抢庄倍数)
        if(hxfn.battle_pinshi.IsAutoBanker())
            return;

        /////////////////////////////////////////////////////////////////////////
        //必须考虑到异步加载的问题，快速切战斗，对于那些延时加载对象，有可能表现逻辑触发时，其还没有初始化好！！！！！！
        //需要确保所有视觉对象预备完成才开始getRoomData!!!
        // this.scr_lstRatioTip.SetItem(idx, mul);
        if(this.arrVieBanker[idx]!= null)//快速切回战斗房间，有可能视觉对象还没好！！！
            this.arrVieBanker[idx].ShowRatioTip(idx,mul);
    },

    PlaySound:function (id,idx) {
        var sfxid = -1;
        
        // 根据座位号索引 推导出玩家性别
        
        var sex = hxfn.battle.GetSexBySeat(idx);//uiRoles[idx]['playerInfo']['userData'].get('sex');

        if(sex === 0 || sex === 1){
            if(id === 0){
                sfxid = hxdt.setting_niuniu.Enum_BattleSFX.QZNo_Male;
            }
            else {
                sfxid = hxdt.setting_niuniu.Enum_BattleSFX.QZ_Male;
            }
        }
        else if(sex === 2){
            if(id === 0) {
                sfxid = hxdt.setting_niuniu.Enum_BattleSFX.QZNo_Female;
            }
            else {
                sfxid = hxdt.setting_niuniu.Enum_BattleSFX.QZ_Female;
            }
        }

        hxjs.module.sound.PlayBattle(sfxid);
    }
});