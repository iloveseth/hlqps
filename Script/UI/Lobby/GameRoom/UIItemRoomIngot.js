import {hxjs} from "../../../../HXJS/HXJS";

cc.Class({
    extends: cc.Component,

    properties: {
        //TODO: 使用通用的'UIItemRoomComn'
        //--------------------------------------------------
        // [display]
        //--------------------------------------------------
        //由通用信息+功能按钮
        btnEnter:require('UIButton'),

        // [nondisplay]
        idx:{ default: -1, serializable: false, visible: false},
        roomId:{ default: null, serializable: false, visible: false},

        srcRoomInfo:cc.Node,

        conSpecType: cc.Node,
        conSpecTimes: cc.Node,
        conCrazyDouble: cc.Node,
        conNone:cc.Node,
        //conS

        difen:{ default: -1, serializable: false, visible: false},
        enterCond:{ default: -1, serializable: false, visible: false},
        eixtCond:{ default: -1, serializable: false, visible: false},
    },

    onLoad: function () {
        hxfn.adjust.AdjustLabel(this.node);
        if(this.btnEnter){
            this.btnEnter.SetInfo(this.TryEnterRoom.bind(this));
        }
    },

    SetInfo (info, idx) {
        this.idx = idx;

        if(info==null) {
            cc.log('[hxjs][err]: battle room info is null!')
            return;
        }
        
        this.roomId = info.get('roomId');

        this.difen = info.get('difen');
        this.enterCond = info.get('enterLimit');
        this.eixtCond = info.get('leftLimit');
        
        hxfn.map.UpdateCoinInfo(this.difen, this.enterCond, this.eixtCond);
        this.srcRoomInfo.getComponent('UIItemRoomInfo').SetInfoS(info);

        // this.txtRoomID.string = this.roomId;
        // this.txtMembers.string = info.get('nowPlayer') + " / " + info.get('maxPlayer');
        // this.txtChipin.string = difen;
        // this.txtEnterCond.string = enterCond;
        // this.txtEixtCond.string = eixtCond;

        
        // 抢庄信息 ///////////////////////////////////////////////////////
        var option = info.roomInfo.createQiangzhuangRoomOption;
        if(!option) return;

        var isCrazyDouble = option.iscrazyMulti;//info.get('crazyDouble');
        // this.txtCrazyDouble.string = isCrazyDouble?"开":'关';

        var isBankerZhu = option.isBankerTuizhu;
        var isPlayerZhu = option.isXianTuizhu;

        this.conCrazyDouble.active = (isBankerZhu || isPlayerZhu) ? true : false;
        this.conSpecType.active = option.haveSpecmodel;
        this.conSpecTimes.active = option.iscrazyMulti;
        

        if(this.conSpecType){
            this.conSpecType.active = option.haveSpecmodel;
        }
        if(this.conSpecTimes){
            this.conSpecTimes.active = option.iscrazyMulti;
        }
        if(this.conCrazyDouble){
            this.conCrazyDouble.active = option.isXianTuizhu || option.isBankerTuizhu;
        }
        if(this.conNone){
            this.conNone.active = !(option.haveSpecmodel || option.isBankerTuizhu || option.isXianTuizhu || option.iscrazyMulti);
        }
    },

    TryEnterRoom:function () {
        // TODO: 通过是否还在上一局牌局中未结束来判断,如果点的是和上次一样的房间（有最近房间提示！）则直接进入，否则弹出提示
        // 玩家在牌局中退出牌局，此后再点击加入其它任何牌局，都弹出提示：之前的牌局还未结束，是否继续？ 点击【确定】进入牌局，点击【取消】则停留在原界面
        
        if(this.enterCond> hxfn.role.curCarryYuanbao){
            // hxjs.module.ui.hub.LoadDlg_Info('元宝数未达到房间要求的最低限度！','货币不足提示');
            //hxfn.comn.IngotNotEnough(true);
            hxjs.module.ui.hub.LoadPanel_DlgPop('UI_Dlg_Check_Bankruptcy4Ingot');
        }
        else {
            //请求进入房间，若成功则跳转到战斗界面
            hxfn.level.JoinRoom(this.roomId);
        }
    }
});