import { hxfn } from "../../../FN/HXFN";

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        txtTitleRoomID:cc.Label,
        txtRoomID:cc.Label,
        txtTitleGameTyp:cc.Label,
        txtGameTyp:cc.Label,
        txtTitleGameMode:cc.Label,
        txtGameMode:cc.Label,
        // txtTitleRounds:cc.Label,
        // txtRounds:cc.Label,
        
        txtTitleDiFen:cc.Label,
        txtDiFen:cc.Label,
        txtTitleEnterCond:cc.Label,
        txtEnterCond:cc.Label,
        txtTitleEixtCond:cc.Label,
        txtEixtCond:cc.Label,
        
        conComnInfo:cc.Node,
        // txtOption:cc.Label,

        // [nondisplay]
        idx:{default: -1, serializable: false, visible: false},

        //元宝房特有参数
        // btnTipSpecial:require('UIButton'),
        // conSpecialParams:cc.Node,

        // titleCrazyDouble:cc.Label,
        // titleRub:cc.Label,
        // titleSpecTimes:cc.Label,
        // titleSpecType:cc.Label,
        // titleStrange:cc.Label,

        // txtCrazyDouble:cc.Label,
        // txtRub:cc.Label,
        // txtSpecTimes:cc.Label,
        // txtSpecType:cc.Label,
        // txtStrange:cc.Label,
    },

    onLoad: function () {
        if(this.txtTitleRoomID)
        this.txtTitleRoomID.string = '房号：';
        if(this.txtTitleGameTyp)
        this.txtTitleGameTyp.string = '玩法：';
        if(this.txtTitleGameMode)
        this.txtTitleGameMode.string = '模式：';
        if(this.txtTitleRounds)
        this.txtTitleRounds.string = '局数：';
        
        if(this.txtTitleDiFen)
        this.txtTitleDiFen.string = '底分：';
        if(this.txtTitleEixtCond)
        this.txtTitleEixtCond.string = '离场：';
        if(this.txtTitleEnterCond)
        this.txtTitleEnterCond.string = '入场：';


        //===========================================
        // if(this.titleSpecType){
        //     this.titleSpecType.string = '特殊牌型: ';
        // }
        // if(this.titleSpecTimes){
        //     this.titleSpecType.string = '特殊倍数: ';
        // }
        // if(this.titleCrazyDouble){
        //     this.titleCrazyDouble.string = '疯狂加倍: '
        // }
        // if(this.titleRub){
        //     this.titleRub.string = '搓   牌: ';
        // }
        // if(this.titleStrange){
        //     this.titleStrange.sring = '允许陌生人加入: ';
        // }
    },

    // info 是为UI专门定制的数据结构
    SetInfo (info, idx) {
        if(idx!= null)
            this.idx = idx;

        if(info==null) {
            cc.log('[hxjs][err]: battle room info is null!')
            return;
        }

        //是否金币房显示房号与否处理--------------------------
        var isGoldRoom = hxfn.map.curRoomTyp === 0;
        this.txtTitleRoomID.node.active = !isGoldRoom;
        this.txtRoomID.node.active = !isGoldRoom;
        //默认0,0，否则-145,0
        var pos = isGoldRoom?cc.p(-190,0):cc.p(-68,0);
        this.conComnInfo.setPosition(pos);
        //--------------------------------------------------

        //房号
        //玩法名称
        //玩法模式
        //局数、、、？？？

        //底分
        //入场要求
        //离场要求
        if(this.txtRoomID)
        this.txtRoomID.string = info['roomId'];
        if(this.txtGameTyp)
        this.txtGameTyp.string = hxfn.map.GetGameplayName(info['gameTyp']);
        if(this.txtGameMode)
        this.txtGameMode.string = hxfn.map.GetGameModeName(info['gameMode']);
        // this.txtRounds.string = info['curRound'] + " / " + info['maxRound'];

        if(this.txtDiFen)
        this.txtDiFen.string = info['difen'];
        if(this.txtEnterCond)
        this.txtEnterCond.string = info['enterLimit'];
        if(this.txtEixtCond)
        this.txtEixtCond.string = info['leftLimit'];

        // this.txtOption.string = this.GetOptStr();
        this.SetOptions();
    },
    
    SetVisibleFalse(){
        this.conSpecialParams.active = false;
    },

    SetOptions(){
        // this.txtSpecType.string = hxfn.battle_pinshi.haveSpecmodel? '开':'关';//createQiangzhuangRoomOption.haveSpecmodel ? '开':'关';
        // this.txtSpecTimes.string = hxfn.battle_pinshi.isCrazyBet?'开':'关';
        // this.txtCrazyDouble.string = this.GetCrazyDouble();
        // this.txtRub.string = hxfn.battle_pinshi.isRubPoker?'开':'关';
        // this.txtStrange.string = hxfn.battle_pinshi.isStranger?'开':'关';
    },

    GetCrazyDouble(){
        if(!hxfn.battle_pinshi.isBankerTuizhu || !hxfn.battle_pinshi.isXianTuizhu){
            return '关';
        }
        else if(hxfn.battle_pinshi.isBankerTuizhu){
            return '庄家推注';
        }
        else if(hxfn.battle_pinshi.isXianTuizhu){
            return '闲家推注';
        }
        else{
            return '';
        }
    },

    // GetOptStr:function (){
    //     var str1 = '';
    //     var str2 = '';
    //     var str3 = '';
        
    //     if(hxfn.battle_pinshi.haveSpecmodel) {
    //         str1 = '特殊牌型';
    //     }
    //     if(hxfn.battle_pinshi.isCrazyBet) {
    //         str2 = '特殊倍数';
    //     }
    //     if(hxfn.battle_pinshi.isBankerTuizhu) {
    //         str3 = '闲家加倍';
    //     }
    //     cc.log(';;;;;;;;;;;;;;;;;;;;;;;;;');
    //     cc.log(hxfn.battle_pinshi.haveSpecmodel);
    //     cc.log(hxfn.battle_pinshi.isCrazyBet);
    //     cc.log(hxfn.battle_pinshi.isBankerTuizhu);

    //     var str = '';
    //     str = str1;
        
    //     if(str == ''){
    //         str = str2;
    //     }
    //     else{
    //         str = '/ ' + str2;
    //     }

    //     if(str == ''){
    //         str = str3;
    //     }
    //     else{
    //         str = '/ ' + str3;
    //     }

    //     return str;
    // },


    Update4WC(){
        if(this.txtSpecType)
            this.txtSpecType.string = hxfn.battle_pinshi.haveSpecmodel? '开':'关';//createQiangzhuangRoomOption.haveSpecmodel ? '开':'关';
        if(this.txtSpecType)
            this.txtSpecType.string = hxfn.battle_pinshi.isCrazyBet?'开':'关';
        
        var isCrazy = false;
        if(hxfn.battle_pinshi.isBankerTuizhu || hxfn.battle_pinshi.isXianTuizhu)
            isCrazy = true;
        if(this.txtCrazyDouble)
            this.txtCrazyDouble.string = isCrazy?'开':'关';
        
        if(this.txtRub)
            this.txtRub.string = hxfn.battle_pinshi.isRubPoker?'开':'关';
    },
});