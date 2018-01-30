import { hxfn } from "../../../FN/HXFN";

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        txtEvent:cc.RichText,//rich text ui

        txtTitleDiFen:cc.Label,
        txtTitleEnter:cc.Label,
        txtTitleLeave:cc.Label,

        txtTitleType:cc.Label,
        txtTitleSpecialMultiples:cc.Label,
        txtTitleCrazyDouble:cc.Label,
        txtTitleRubPoker:cc.Label,
        
        txtDiFen:cc.Label,
        txtEnter:cc.Label,
        txtLeave:cc.Label,

        txtType:cc.Label,
        txtSpecialMultiples:cc.Label,
        txtCrazyDouble:cc.Label,
        txtRubPoker:cc.Label,
        
        txtTitleMode:cc.Label,
        txtMode:cc.Label,
    },

    onLoad: function () {
        this.txtTitleDiFen.string = '底分:';
        this.txtTitleEnter.string = '入场:';
        this.txtTitleLeave.string = '离场:';

        this.txtTitleType.string = '特殊牌型:';
        this.txtType.string = '开';

        this.txtTitleSpecialMultiples.string = '特殊倍数:';
        this.txtSpecialMultiples.string = '关';

        this.txtTitleCrazyDouble.string = '疯狂加倍:';

        this.txtTitleRubPoker.string = '搓牌:';
        
        this.txtTitleMode.string = '模式:';
        this.txtMode.string = '看牌抢庄';

    },

    SetInfo(info){
        // message InviteJoinRoomInform {
        //     required PlayerNameProto host = 1;  //邀请人
        //     optional InviteRoomInfoProto roomInfo = 2;         //邀请加入的房间
        // }
        
        var inviter = info.host;
        var roomInfo = info.roomInfo.createRoomOption;

        //基本信息---------------------------------------------------
        var nickName = inviter.get('nickName');
        var roomType = roomInfo.get('roomType');//肯定是元宝房
        var gameType = roomInfo.get('gameType');
        // var gameMode = roomInfo.get('gameMode');

        // this.txtEvent.string = nickName + '邀请加入房间：' +　this.roomId;
        //富文本标签设置
        var gameplayName = hxfn.map.GetGameplayName(gameType);
        this.txtEvent.string = '<color=#00ff00>'+nickName+'</c>邀请您进入<color=#00ff00>【'+gameplayName+'】</c>游戏';
        this.txtDiFen.string = roomInfo.get('difen');
        this.txtEnter.string = roomInfo.get('enterLimit');
        this.txtLeave.string = roomInfo.get('leftLimit');


        //额外信息---------------------------------------------------
        // 抢庄信息
        let qzOption = roomInfo.createQiangzhuangRoomOption;
        if(!qzOption) return;

        var crazyDouble = qzOption.iscrazyMulti;
        this.txtCrazyDouble.string=crazyDouble?'开':'关';

        this.txtRubPoker.string=roomInfo.rubPoker?'开':'关';


        var haveSpecmodel = qzOption.haveSpecmodel;
        this.txtType.string = haveSpecmodel?'开':'关';
        
        var isXianTuizhu = qzOption.isXianTuizhu;
        var isBankerTuizhu = qzOption.isBankerTuizhu;
        
        this.txtSpecialMultiples.string = isXianTuizhu || isBankerTuizhu ?'开':'关';

        if(this.txtMode){
            this.txtMode.string = hxfn.battle_pinshi.Enum_QZModelName[qzOption.qiangzhuangmodel];
        }
    },
});