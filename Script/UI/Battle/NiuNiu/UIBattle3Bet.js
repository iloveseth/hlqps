import { hxfn } from '../../../FN/HXFN';
import { hxjs } from '../../../../HXJS/HXJS';
import { hxdt } from '../../../DT/HXDT';

cc.Class({
    extends: cc.Component,

    properties: {
        lstTip: require('UILst'),

        conRatioBg:cc.Node,
        lstRatio: require('UILst'),
        lstRatioCrazy: require('UILst'),
        lstRatioCrazy2: require('UILst'),

        rations:{default:null, serializable: false, visible: false},
        limit:{default:-1, serializable: false, visible: false},
        
        markServerRations:{default:-1, serializable: false, visible: false},
    },

    ////////////////////////////////////////////////////////////////////////////
    onLoad: function () {
        //矫正Label字体控件
        hxfn.adjust.AdjustLabel(this.node);
        
        this.OnInit ();
    },
    
    OnInit:function () {
        cc.log('UIBattle3Bet on init!');
        
        this.OnReset();
    },
    
    OnReset () {
        this.HideChipinPanel();
        this.lstTip.Reset();
    },
    
    OnEnd () {
        this.OnReset();
    },
    ////////////////////////////////////////////////////////////////////////////
    SelectRatio (ratioIdx, isValid) {
        // var isValid = this.limit > ratioIdx;
        ////////////////////////////////////////////////////////////////////////
        // 这里有两种情况 1,有资格没钱（会下发该倍数，但是被limit限制住的） 2，没资格（不会下发该倍数）
        ////////////////////////////////////////////////////////////////////////
        if(!isValid) {
            if(ratioIdx > this.markServerRations-1)//超出索引
                hxjs.module.ui.hub.LoadTipFloat(hxdt.setting.lang.Battle_Tip_ChipinNoCond);
            else {
                let desc = '';
                if(hxfn.map.curRoomTyp === hxfn.map.Enum_RoomTyp.Ingot) { 
                    desc = hxdt.setting.lang.Battle_Tip_ChipinDisable;
                }
                else if(hxfn.map.curRoomTyp === hxfn.map.Enum_RoomTyp.Gold) { 
                    desc = hxdt.setting.lang.Battle_Tip_ChipinDisableGold;
                }
                hxjs.module.ui.hub.LoadTipFloat(desc);
            }
            return;
        }

        //一旦做出倍数选择，则关闭选择面板
        this.HideChipinPanel();

        var mul = this.rations[ratioIdx];//5 * (ratioIdx+1);

        var postData = {
            multiple : mul,
        };
        hxfn.net.Sync(
            postData,
            'QZInputChipin',
            hxdt.msgcmd.QZInputChipin,//20061,
        );

        hxjs.util.Notifier.emit('UI_Battle_UpdateCDEventName', hxfn.battle_pinshi.Enum_EventCD.HasChipin);
    },

    SetOver (){
        this.HideChipinPanel();
    },

    //理论上不可能是null，否则为了保险，和服务器一样的规则：最小可选（即 = 1）
    ShowChipinPanel (rations, limit, cd = -1) {
        //最后一步验证，如果不在牌局中，则不显示
        if(!hxfn.battle.hasPlayedCurGame)
            return;

        cc.log("ShowChipinPanel: " + limit);
            
        //HACK 理论上不可能
        if(limit==null)
            limit = 1;

            
        this.HideChipinPanel();

        // cc.log('==========================');
        // cc.log('rations4Chipin: ' + rations);
        // cc.log("limits4Chipin: " + limit);
        this.rations = rations;
        this.limit = limit;

        if(rations)
            this.markServerRations = rations.length;
        else
            this.markServerRations = 0;

        if(hxfn.battle_pinshi.isBankerTuizhu) {
            // cc.log('isBankerTuizhu');
            // cc.log('==========================');
            this.Handle3XianJia();
            return;
        }
        
        if(hxfn.battle_pinshi.isXianTuizhu) {
            // cc.log('isXianTuizhu');
            // cc.log('==========================');
            this.Handle2XianJia();
            return;
        }

        // cc.log('isNormal');
        // cc.log('==========================');
        this.HandleNormal();

        //THINKING 倒计时结束，如果没有操作也要关闭面板，也有可能操作了立即关闭
        // this.scheduleOnce(function(){
        //     this.HideChipinPanel();
        // }.bind(this),cd);
    },
    
    HideChipinPanel:function () {
        if(this.conRatioBg)
        this.conRatioBg.active = false;

        this.lstRatio.node.active = false;
        this.lstRatioCrazy.node.active = false;
        this.lstRatioCrazy2.node.active = false;
    },

    // 1，普通
    HandleNormal:function (){
        if(this.conRatioBg)
        this.conRatioBg.active = true;

        this.lstRatio.node.active = true;

        this.SetRatioLst(this.lstRatio);
    },
    // 2，闲家推注
    Handle2XianJia:function(){
        if(this.conRatioBg)
        this.conRatioBg.active = true;

        this.lstRatioCrazy.node.active = true;

        //客户端凑齐4张，利用-1来显示不可选状态
        var rs = [-1,-1,-1,-1];
        for (let i = 0; i < this.rations.length; i++) {
            if(this.rations[i] > 0)
            rs[i] = this.rations[i];
        }
        this.rations = rs;

        this.SetRatioLst(this.lstRatioCrazy);
    },
    // 3，庄家推注
    Handle3XianJia:function(){
        if(this.conRatioBg)
        this.conRatioBg.active = true;
        
        this.lstRatioCrazy2.node.active = true;

        //客户端凑齐5张，利用limit索引来显示不可选状态
        var rs = hxdt.setting_niuniu.bankerTuizhuRatio;
        for (let i = 0; i < this.rations.length; i++) {
            if(this.rations[i] > 0)
            rs[i] = this.rations[i];
        }
        this.rations = rs;

        this.SetRatioLst(this.lstRatioCrazy2);
    },

    SetRatioLst:function (ratioLst){
        ratioLst.SetInfo(this.rations, this.SelectRatio.bind(this));

        if(this.limit != null && this.limit >= 0) {
            // cc.log('-----------> ratioLst.Setlimit: ' + this.limit);
            ratioLst.Setlimit (this.limit);
        }
        else{
            cc.log('[hxjs][err] ShowChipinPanel: wrong limit num');
        }
    },
    

    //////////////////////////////////////////////////////////////////////////////////////
    //理论上，服务器逻辑正确的话，正常流程中，不会给观战中的玩家发牌
    ShowRatio (info) {
        //闲家下注
        // message QZActChipin {
        //     optional string playerId = 1;   //下注的玩家
        //     optional int32 multiple = 2;    //下注倍数
        // }

        var playerId = info.get('playerId');

        //玩家不在牌局中不显示倍数
        if(!hxfn.battle.CheckJoinedCurrentRingById(playerId))
            return;
        //庄家不显示下注倍数
        if(hxfn.battle_pinshi.IsBanker(playerId))
            return;

        var idx = hxfn.battle.GetUISeatIdx(playerId);
        var ratio = info.get('multiple');

        // cc.log('####################### Bet idx: ' + idx);
        // cc.log('####################### Bet ratio: ' + ratio);
        this.lstTip.SetItem(idx, ratio);

        // 播放下注音效
        hxjs.module.sound.PlayBattle(hxdt.setting_niuniu.Enum_BattleSFX.QZ_XiaZhu);
        // 播放疯狂加倍音效
        //HACK:闲家推注 庄家推注 目前来说，前三个一定是2 5 10 倍
        if(ratio > 10) {
            this.PlayBattleCrazyChipin(idx);
        }
    },

    PlayBattleCrazyChipin(idx){
        var sfxid = -1;

        var sex = hxfn.battle.GetSexBySeat(idx);

        if(sex === 0 || sex === 1){
            sfxid = hxdt.setting_niuniu.Enum_BattleSFX.CrazyChipin_Male;
        }
        else if(sex === 2){
            sfxid = hxdt.setting_niuniu.Enum_BattleSFX.CrazyChipin_Female;
        }

        hxjs.module.sound.PlayBattle(sfxid);
    },

    //重连时，如果是tip chipin 阶段回来的话，如果不在牌局中，则首先就不会发本条消息，不应该弹提示
    ShowRatio_Recover (idx, ratio) {
        var role = hxfn.battle.uiRoles[idx];
        if(role) {
            //再次确认是否已加入本局
            if(!hxfn.battle.CheckJoinedCurrentRing(role))
                return;
            
            this.lstTip.SetItem(idx, ratio);
        }
    }
});