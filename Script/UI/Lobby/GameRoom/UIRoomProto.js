import { hxfn } from '../../../FN/HXFN';
import { log } from '../../../../HXJS/Util/Log';

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        // txtTitleStranger:cc.Label,

        //togEnableCrazyRatio:require('UIToggle'),

        iptDiFen: cc.EditBox,
        iptEnterLimit: cc.EditBox,
        iptExitLimit: cc.EditBox,
//-----------------------------------------------------------------------pinshi
        togSpecialCard: require('UIToggle'),
        togSpecialTimes: require('UIToggle'),
        togXJTZ: require('UIToggle'),
        togQZTZ: require('UIToggle'),
        togRubPoker: require('UIToggle'),

        togDownBanker: require('UIToggle'),

        btnTipXJTZ: require('UIButton'),
        btnTipQZTZ: require('UIButton'),
        btnTip3: require('UIButton'),
//---------------------------------------------------------------------landlord
        togExhibit:require('UIToggle'),
        togIP:require('UIToggle'),
        togAutoDeploy: require('UIToggle'),
        togDouble:require('UIToggle'),
//------------------------------------------------------------------------

        togEnableStrange: require('UIToggle'),

        conTipXJTZ: cc.Node,
        conTipQZTZ: cc.Node,
        conTip3: cc.Node,

        difenLimits: null,

        isStrangerEnabled: { default: true, serializable: false, visible: false },
        isEnableCrazyRatio: { default: false, serializable: false, visible: false },

        difen: { default: 0, serializable: false, visible: false },
        enterLimit: { default: 0, serializable: false, visible: false },
        leftLimit: { default: 0, serializable: false, visible: false },

        difenMax: { default: 5000, serializable: false, visible: false },//底分上限
        difenMin: { default: 10, serializable: false, visible: false },//底分下限

        enterTimes: { default: 30, serializable: false, visible: false },//入场底分倍数
        exitTimes: { default: 30, serializable: false, visible: false },//离场底分倍数

        notifiers: null,

        modeIdx: cc.Integer,

        nodeBg: cc.Node,

        activeIdx: 0,


    },

    onLoad() {
        hxfn.adjust.AdjustLabel(this.node);
        this.iptDiFen.node.on('text-changed', function (event) {
            var edit = event.detail;
            var difen = parseInt(edit.string);
            if (difen < 0 || isNaN(difen)) difen = 0;
            this.iptEnterLimit.string = difen * this.enterTimes;
            this.iptExitLimit.string = difen * this.exitTimes;
        }.bind(this));
        this.iptDiFen.node.on('editing-did-ended', function (event) {
            this.GetDifenLimit();
            var edit = event.detail;
            var difen = parseInt(edit.string);
            if (difen < this.difenMin || isNaN(difen)) difen = this.difenMin;
            if (difen > this.difenMax) difen = this.difenMax;
            this.iptDiFen.string = difen
            this.iptEnterLimit.string = difen * this.enterTimes;
            this.iptExitLimit.string = difen * this.exitTimes;
        }.bind(this));
        this.nodeBg.on('touchend', this.HideTips.bind(this), this);
        if (this.btnTipQZTZ) {
            this.btnTipQZTZ.SetInfo(this.TipQZTZ.bind(this));
        }
        if (this.btnTipXJTZ) {
            this.btnTipXJTZ.SetInfo(this.TipXJTZ.bind(this));
        }
        if (this.btnTip3) {
            this.btnTip3.SetInfo(this.Tip3.bind(this));
        }

        if (this.togQZTZ) {
            this.togQZTZ.SetInfo(this.CheckQZTZ.bind(this), '抢庄加倍');
        }
        if (this.togXJTZ) {
            this.togXJTZ.SetInfo(this.CheckXJTZ.bind(this), '闲家加倍');
        }

        this.notifiers = [
            'TryCreateGame',
            'SelectGameMode',
        ];

        eval(hxfn.global.HandleNotifiersStr(this.notifiers, true));

        hxfn.netrequest.Req_Comn(
            {},
            hxfn.netrequest.Msg_GetQZRoomDifenLimitList,
            function (msg) {
                cc.log(msg);
                if (msg.result == 0) {
                    this.difenLimits = msg.qZRoomDifenLimitProto;
                    this.GetDifenLimit();
                }
            }.bind(this),
        );

        //this.LoadData();

    },

    onEnable() {
        this.LoadData();
    },

    onDisable() {
        this.SaveData();
    },

    onDestroy() {
        eval(hxfn.global.HandleNotifiersStr(this.notifiers, false));
        //this.SaveData();
    },

    SelectGameMode(idx) {
        cc.log('this.modeIdx');
        cc.log(this.modeIdx)
        //this.curModeIdx
        // if(this.modeIdx == this.activeIdx){
        //     this.SaveData();
        // }
        // if(this.modeIdx == idx){
        //     this.LoadData();
        // }
        this.activeIdx = idx;

    },

    HideTips() {
        if (this.conTipQZTZ) {
            this.conTipQZTZ.active = false;
        }
        if (this.conTipXJTZ) {
            this.conTipXJTZ.active = false;
        }
        if (this.conTip3) {
            this.conTip3.active = false;
        }
    },

    CheckEnableCreate: function () {
        var isEnable = true;

        if (hxfn.role.curCarryYuanbao < this.difen || hxfn.role.curCarryYuanbao < this.enterLimit) {
            // hxjs.module.ui.hub.LoadDlg_Info('元宝不足，不能创建房间！','提示');
            hxfn.comn.IngotNotEnough(true);
            return false;
        }

        if (isNaN(this.difen) || isNaN(this.enterLimit) || isNaN(this.leftLimit)) {
            hxjs.module.ui.hub.LoadDlg_Info('必须填写完整！', '元宝房创建提示');
            return false;
        }

        //底分不能高于自身元宝数，不能高于入场设定，入场设定不能高于自身所拥有的元宝数量，离场设定不能高于入场设定
        if (this.difen > hxfn.role.curCarryYuanbao) {
            hxjs.module.ui.hub.LoadDlg_Info('底分不能高于自身所拥有的元宝数量！', '元宝房创建提示');
            // return;
            isEnable = false;
        }
        else {
            if (this.difen > this.enterLimit) {
                hxjs.module.ui.hub.LoadDlg_Info('底分不能高于入场设定！', '元宝房创建提示');
                // return;
                isEnable = false;
            }
            else {
                if (this.enterLimit > hxfn.role.curCarryYuanbao) {
                    hxjs.module.ui.hub.LoadDlg_Info('入场设定不能高于自身所拥有的元宝数量', '元宝房创建提示');
                    // return;
                    isEnable = false;
                } else {
                    if (this.leftLimit > this.enterLimit) {
                        hxjs.module.ui.hub.LoadDlg_Info('离场设定不能高于入场设定', '元宝房创建提示');
                        // return;
                        isEnable = false;
                    }
                }
            }
        }

        //新增元宝房开房规则
        //元宝房底分下限50，上限5000。入场设定≥底分*30，离场设定≥底分*30
        //by lzh

        if (isEnable == false) {
            return;
        }

        if (this.difen < this.difenMin) {
            hxjs.module.ui.hub.LoadDlg_Info('底分下限为' + this.difenMin, '元宝房创建提示');
            return false;
        }

        if (this.difen > this.difenMax) {
            hxjs.module.ui.hub.LoadDlg_Info('底分上限为' + this.difenMax, '元宝房创建提示');
            return false;
        }

        if (this.enterLimit < this.difen * this.enterTimes) {
            hxjs.module.ui.hub.LoadDlg_Info('入场设定必须至少为底分的' + this.enterTimes + '倍', '元宝房创建提示');
            return false;
        }

        if (this.enterLimit < this.difen * this.enterTimes) {
            hxjs.module.ui.hub.LoadDlg_Info('离场设定必须至少为底分的' + this.exitTimes + '倍', '元宝房创建提示');
            return false;
        }

        return isEnable;
    },

    CheckXJTZ(isChecked) {
        //cc.sys.localStorage.setItem('Room_IsXJTZ',isChecked);
        if (isChecked && this.togQZTZ && this.togQZTZ.GetChecked()) {
            this.togQZTZ.SetChecked(false);
            //cc.sys.localStorage.setItem('Room_IsQZTZ',false);
        }
    },

    CheckQZTZ(isChecked) {
        // cc.sys.localStorage.setItem('Room_IsQZTZ',isChecked);
        if (isChecked && this.togXJTZ && this.togXJTZ.GetChecked()) {
            this.togXJTZ.SetChecked(false);
            //cc.sys.localStorage.setItem('Room_IsXJTZ',false);
        }
    },

    TipQZTZ() {
        this.conTipQZTZ.active = !this.conTipQZTZ.active;
        if (this.conTipXJTZ) this.conTipXJTZ.active = false;
        if (this.conTip3) this.conTip3.active = false;
    },

    TipXJTZ() {
        this.conTipXJTZ.active = !this.conTipXJTZ.active;
        if (this.conTipQZTZ) this.conTipQZTZ.active = false;
        if (this.conTip3) this.conTip3.active = false;
    },

    Tip3() {
        this.conTip3.active = !this.conTip3.active;
        if (this.conTipQZTZ) this.conTipQZTZ.active = false;
        if (this.conTipXJTZ) this.conTipXJTZ.active = false;
    },

    GetDifenLimit() {
        let isCrazyMulti = this.togSpecialTimes.GetChecked();
        let isQZTZ = this.togQZTZ ? this.togQZTZ.GetChecked() : false;
        let isXJTZ = this.togXJTZ ? this.togXJTZ.GetChecked() : false;

        this.difenLimits.forEach(element => {
            if (element.createQiangzhuangRoomOption.isBankerTuizhu == isQZTZ
                && element.createQiangzhuangRoomOption.isXianTuizhu == isXJTZ
                && element.createQiangzhuangRoomOption.iscrazyMulti == isCrazyMulti) {
                this.difenMin = element.difenMin;
                this.difenMax = element.difenMax;
            }
        });
    },

    LoadData() {
        cc.log('loadData');
        cc.log(this.modeIdx)
        if (this.togRubPoker) {
            var isRubPoker = cc.sys.localStorage.getItem('Room_IsRubPoker_' + this.modeIdx);
            if (isRubPoker == null) isRubPoker = false;
            else isRubPoker = isRubPoker.toBool();
            this.togRubPoker.SetChecked(isRubPoker);
            cc.log('Room_IsRubPoker_' + this.modeIdx);
        }

        var isSpecialTimes = cc.sys.localStorage.getItem('Room_IsSpecialTimes_' + this.modeIdx);
        if (isSpecialTimes == null) isSpecialTimes = false;
        else isSpecialTimes = isSpecialTimes.toBool();
        this.togSpecialTimes.SetChecked(isSpecialTimes);

        var isSpecialCard = cc.sys.localStorage.getItem('Room_IsSpecialCard_' + this.modeIdx);
        if (isSpecialCard == null) isSpecialCard = true;
        else isSpecialCard = isSpecialCard.toBool();
        this.togSpecialCard.SetChecked(isSpecialCard);

        var isEnableStrange = cc.sys.localStorage.getItem('Room_IsEnableStrange_' + this.modeIdx);
        if (isEnableStrange == null) isEnableStrange = true;
        else isEnableStrange = isEnableStrange.toBool();
        this.togEnableStrange.SetChecked(isEnableStrange);

        if (this.togXJTZ) {
            var isXJTZ = cc.sys.localStorage.getItem('Room_IsXJTZ_' + this.modeIdx);
            if (isXJTZ == null) isXJTZ = false;
            else isXJTZ = isXJTZ.toBool();
            this.togXJTZ.SetChecked(isXJTZ);
        }
        if (this.togQZTZ) {
            var isQZTZ = cc.sys.localStorage.getItem('Room_IsQZTZ_' + this.modeIdx);
            if (isQZTZ == null) isQZTZ = false;
            else isQZTZ = isQZTZ.toBool();
            this.togQZTZ.SetChecked(isQZTZ);
        }
        if (this.togDownBanker) {
            var isDownBanker = cc.sys.localStorage.getItem('Room_IsDownBanker_' + this.modeIdx);
            if (isDownBanker == null) isDownBanker = false;
            else isDownBanker = isDownBanker.toBool();
            this.togDownBanker.SetChecked(isDownBanker);
        }

        // togExhibit:require('UIToggle'),
        //     togIP:require('UIToggle'),
        //     togAutoDeploy: require('UIToggle'),
        //     togDouble:require('UIToggle'),
        if (this.togExhibit) {
            var isExhibit = cc.sys.localStorage.getItem('Room_IsExhibit_' + this.modeIdx);
            if (isExhibit == null) isExhibit = false;
            else isExhibit = isExhibit.toBool();
            this.togExhibit.SetChecked(isExhibit);
        }

        if (this.togIP) {
            var isIP = cc.sys.localStorage.getItem('Room_IsIP_' + this.modeIdx);
            if (isIP == null) isIP = false;
            else isIP = isIP.toBool();
            this.togIP.SetChecked(isIP);
        }

        if (this.togAutoDeploy) {
            var isAutoDeploy = cc.sys.localStorage.getItem('Room_IsAutoDeploy_' + this.modeIdx);
            if (isAutoDeploy == null) isAutoDeploy = false;
            else isAutoDeploy = isAutoDeploy.toBool();
            this.togAutoDeploy.SetChecked(isAutoDeploy);
        }

        if (this.togDouble) {
            var isDouble = cc.sys.localStorage.getItem('Room_IsDouble_' + this.modeIdx);
            if (isDouble == null) isDouble = false;
            else isDouble = isDouble.toBool();
            this.togDouble.SetChecked(isDouble);
        }

        var txtDifen = cc.sys.localStorage.getItem('Room_TxtDifen_' + this.modeIdx);

        if (parseInt(txtDifen) < this.difenMin) {
            txtDifen = this.difenMin;
        }
        if (parseInt(txtDifen) > this.difenMax) {
            txtDifen = this.difenMax;
        }
        if (isNaN(parseInt(txtDifen))) {
            txtDifen = this.difenMin;
        }
        this.iptDiFen.string = txtDifen;

        this.iptEnterLimit.string = txtDifen * this.enterTimes;
        this.iptExitLimit.string = txtDifen * this.exitTimes;

        // this.togEnableStrange.SetChecked(true);
        // this.togSpecialCard.SetChecked(true);
    },

    SaveData() {

        cc.sys.localStorage.setItem('Room_IsRubPoker_' + this.modeIdx, this.togRubPoker.GetChecked());
        cc.sys.localStorage.setItem('Room_IsSpecialTimes_' + this.modeIdx, this.togSpecialTimes.GetChecked());
        cc.sys.localStorage.setItem('Room_IsSpecialCard_' + this.modeIdx, this.togSpecialCard.GetChecked());
        cc.sys.localStorage.setItem('Room_IsEnableStrange_' + this.modeIdx, this.togEnableStrange.GetChecked());
        cc.sys.localStorage.setItem('Room_IsXJTZ_' + this.modeIdx, this.togXJTZ ? this.togXJTZ.GetChecked() : false);
        cc.sys.localStorage.setItem('Room_IsQZTZ_' + this.modeIdx, this.togQZTZ ? this.togQZTZ.GetChecked() : false);
        cc.sys.localStorage.setItem('Room_TxtDifen_' + this.modeIdx, this.iptDiFen.string);
        cc.sys.localStorage.setItem('Room_IsDownBanker_' + this.modeIdx, this.togDownBanker ? this.togDownBanker.GetChecked() : false);
        cc.sys.localStorage.setItem('Room_Exhibit_' + this.modeIdx, this.togExhibit ? this.togExhibit.GetChecked() : false);
        cc.sys.localStorage.setItem('Room_IsIP_' + this.modeIdx, this.togIP ? this.togIP.GetChecked() : false);
        cc.sys.localStorage.setItem('Room_IsAutoDeploy_' + this.modeIdx, this.togAutoDeploy ? this.togAutoDeploy.GetChecked() : false);
        cc.sys.localStorage.setItem('Room_IsDouble_' + this.modeIdx, this.togDouble ? this.togDouble.GetChecked() : false);
    },

    TryCreateGame: function (idx) {

        log.trace("LuoSong", "[UIRoomProto -> TryCreateGame], curGameTypId=" + hxfn.map.curGameTypId);

        if (this.modeIdx != idx) {

            log.error("[UIRoomProto -> TryCreateGame] , this.modeIdx != idx")
            log.error("[UIRoomProto -> TryCreateGame], idx=" + idx);
            log.error("[UIRoomProto -> TryCreateGame], this.modeIdx=" + this.modeIdx);
            return;
        }


        this.difen = parseInt(this.iptDiFen.string);
        this.enterLimit = parseInt(this.iptEnterLimit.string);
        this.leftLimit = parseInt(this.iptExitLimit.string);

        if (!this.CheckEnableCreate())
            return;

        // 不同游戏玩法，使用不用的模板
        if (hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.FightLandlords) {
            this.StartCreateRoom_Landlord();
        }
        else {
            // TODO 博眼子和三公，和抢庄可以继承自同一个创建房间模板！！！
            this.StartCreateRoom();
        }

    },

    StartCreateRoom: function () {
        log.trace("LuoSong", "[UIRoomProto -> StartCreateRoom]");
        var combatEyeOption = {
            qiangzhuangmodel: this.byzGamemode,
        };
        var sangongOption = {
            gamemodel: this.sgGameType,
            qiangzhuangmodel: this.sgGamemode,
        };

        var qzRoomOption = {
            // optional bool haveSpecmodel = 1;          //是否包含特殊牌型(葫芦，顺子，同花) 
            // optional bool iscrazyMulti  = 2;          //是否疯狂加倍计算方法(散牌*1...五小*17)   
            // optional int32 qiangzhuangmodel = 3;      //玩法:抢庄类型(0-看牌抢庄，1-自由抢庄，2-双十上庄，3-通比拼十，4-疯狂拼十) 
            // optional bool isXianTuizhu = 4;           //是否闲家推注  
            // optional bool isBankerTuizhu = 5;         //是否庄家推注
            // optional bool isBankerOutOfTen = 6;       //是否没十下庄，此选项在双十上庄才有
            iscrazyMulti: this.togSpecialTimes.GetChecked(),
            haveSpecmodel: this.togSpecialCard.GetChecked(),
            qiangzhuangmodel: parseInt(this.modeIdx),
            isXianTuizhu: this.togXJTZ ? this.togXJTZ.GetChecked() : false,
            isBankerTuizhu: this.togQZTZ ? this.togQZTZ.GetChecked() : false,
            isBankerOutOfTen: this.togDownBanker ? this.togDownBanker.GetChecked() : false,
        };

        //创建罗松房间配置
        var createLuoSongRoomOption =
            {
                luosongmodel: 0,    //玩法:罗松类型(0-经典罗松，1-加一色罗松，2-永康罗松，3-乐清罗松，4-八人罗松，5-百人罗松) 
            };


        // optional bool openCard = 1;     //明牌选项
        // optional bool addMulti = 2;     //出牌前加倍
        // optional bool autoModel = 3;    //自动配牌
        // optional bool checkIP = 4;
        var landlordRoomOption = {
            openCard: this.togExhibit ? this.togExhibit.GetChecked() : false,
            addMulti: this.togDouble? this.togDouble.GetChecked() : false,
            autoModel: this.togAutoDeploy? this.togAutoDeploy.GetChecked() : false,
            checkIP: this.togIP? this.togIP.GetChecked() : false,
        }


        //CreateRoomOptionProto
        var postDataOption = {
            roomType: hxfn.map.curRoomTyp,
            gameType: hxfn.map.curGameTypId,
            subGame: parseInt(this.modeIdx),
            stranger: this.togEnableStrange.GetChecked(),
            difen: parseInt(this.iptDiFen.string),
            enterLimit: parseInt(this.iptEnterLimit.string),
            leftLimit: parseInt(this.iptExitLimit.string),
            // createCombatEyeRoomOption : combatEyeOption, //博眼子房间的特殊设置
            // createSangongRoomOption : sangongOption, //三公房间的特殊设置
            createQiangzhuangRoomOption: qzRoomOption,
            CreateLuoSongRoomOption: createLuoSongRoomOption, //创建罗松房间配置
            CreateLandLordRoomOption: landlordRoomOption,
            rubPoker: this.togRubPoker.GetChecked(),
            //tuition
        };

        // TEST ============================================================
        // //TEST 1 自由抢庄
        // var qzRoomOption = {
        //     haveSpecmodel: true,
        //     iscrazyMulti: true,
        //     qiangzhuangmodel: 1,
        //     isXianTuizhu: true,
        //     isBankerTuizhu: false,
        // };
        //TEST 2 双十上庄
        // var qzRoomOption = {
        //     haveSpecmodel: true,
        //     iscrazyMulti: true,
        //     qiangzhuangmodel: 2,
        //     isXianTuizhu: true,
        //     isBankerOutOfTen: true,
        // };
        // //TEST 3 通比拼十
        // var qzRoomOption = {
        //     haveSpecmodel: true,
        //     iscrazyMulti: true,
        //     qiangzhuangmodel: 3,
        // };
        // var postDataOption = {
        //     stranger : this.togEnableStrange.GetChecked(),
        //     difen : parseInt(this.iptDiFen.string),
        //     enterLimit : parseInt(this.iptEnterLimit.string),
        //     leftLimit : parseInt(this.iptExitLimit.string),
        //     // createCombatEyeRoomOption : combatEyeOption, //博眼子房间的特殊设置
        //     // createSangongRoomOption : sangongOption, //三公房间的特殊设置
        //     createQiangzhuangRoomOption:qzRoomOption,
        //     rubPoker:true,
        //     //tuition
        // };
        // TEST ============================================================


        log.trace("net", "【UIRoomProto ->StartCreateRoom -> CreateRoomOptionProto】 postDataOption: " + JSON.stringify(postDataOption));
        var postDataOptionMsg = hxjs.module.data.proto.Pack('CreateRoomOptionProto', postDataOption);

        hxfn.level.CreateRoom(postDataOption, () => {
            this.SaveData();
        });
    },

    StartCreateRoom_Landlord: function () {
        var postDataOption = {
            roomType: hxfn.map.curRoomTyp,
            gameType: hxfn.map.curGameTypId,
            subGame: parseInt(this.modeIdx),
            stranger: this.togEnableStrange.GetChecked(),
            difen: parseInt(this.iptDiFen.string),
            enterLimit: parseInt(this.iptEnterLimit.string),
            leftLimit: parseInt(this.iptExitLimit.string),
            // createCombatEyeRoomOption : combatEyeOption, //博眼子房间的特殊设置
            // createSangongRoomOption : sangongOption, //三公房间的特殊设置
            // createQiangzhuangRoomOption:qzRoomOption,
            // rubPoker:this.togRubPoker.GetChecked(),
            //tuition
        };

        var postDataOptionMsg = hxjs.module.data.proto.Pack('CreateRoomOptionProto', postDataOption);

        hxfn.level.CreateRoom(postDataOption, () => {
            this.SaveData();
        });
    }
});