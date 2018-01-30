import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: cc.Component,

    properties: {

        labelMonth: cc.Label,
        scrollDate: cc.ScrollView,

        txtSignNum: cc.Label,
        txtResignNum: cc.Label,
        txtResignCard: cc.Label,

        btnSign: cc.Button,
        btnResign: cc.Button,

        nodeSign: require('UIMultiState'),

        signList: null,//签到列表
        content: cc.Node,

        packages: [cc.Node],

        signNum: null,//本月累计签到
        resignCard: null,//补签卡
        resignNum: null,//本月可补签次数


        prefabDate: cc.Prefab,
        userData: null,

        sign0Reward: null,

        needSignNum: [],

        userDataChanged: false,

        needUpdate: false,

        txtAward: cc.Label,

        curPackClickedID: -1,

        //红色版本
        imgArrows: [cc.Node],
        txtDate: cc.Label,
    },

    onLoad: function () {
        //hxfn.role.curUserData
        this.userData = hxfn.role.curUserData;
        cc.log(this.userData);
        this.needSignNum = [3, 7, 15, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()];

        this.btnSign.getComponent('UIButton').SetInfo(this.Sign.bind(this), '签到');
        this.btnResign.getComponent('UIButton').SetInfo(this.Sign.bind(this), '补签');
    },

    start: function () {
        this.signList = hxfn.activityAndTask.signList;//InitCurMonthSignInfo();
        this.UpdateCalendar();
        this.InitSignData();
        this.UpdateSignState();

        this.HandleNotify(true);

        hxfn.activityAndTask.GetAllActivitysFromServer(this.UpdateSignRewardList.bind(this));

        //红色版本
        if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED) {
            if(this.txtDate){
                var date = new Date();
                var curYear = date.getFullYear();
                var curMonth = date.getMonth() + 1;
                var curDate = date.getDate();
                this.txtDate.string = curYear + '-' + curMonth + '-' + curDate;
            }
        }
    },

    onDestroy: function () {
        this.HandleNotify(false);

    },

    //??? ///////////////////////////////////////
    onEnable: function () {
        this.userDataChanged = false;
        hxjs.util.Notifier.on('PackClicked', this.HandlePackClicked, this);
    },

    onDisable: function () {
        hxjs.util.Notifier.off('PackClicked', this.HandlePackClicked, this);
        if (this.userDataChanged) {
        }
    },

    //签到
    Sign: function () {

        var postData = {
            isRemedy: this.signList[(new Date().getDate()) - 1],
        };

        //发出签到请求
        hxfn.netrequest.Req_PlayerActivitySign(
            postData,
            function (msg) {
                // var msg = hxdt.builder.build('PlayerActivitySignResp').decode(data);                
                var result = msg.get('result');
                if (result == 0) {
                    this.userDataChanged = true;
                    this.needUpdate = true;

                    //此处不需要再向服务器同步用户数据。
                    //签到
                    if (!this.signList[(new Date().getDate()) - 1]) {//不是补签
                        this.SignDate(new Date().getDate());
                        ++this.signNum;
                        this.ChangeSignActivity();
                        this.GetSign0Reward();
                        this.UpdateSignState();
                    }
                    //补签
                    else {
                        var resignDate = this.GetResignDate();
                        if (resignDate != 0 && resignDate != new Date().getDate()) {
                            this.SignDate(resignDate);
                            ++this.signNum;//签到天数+1
                            --this.resignCard;//扣除补签卡
                            --this.resignNum;//可补签次数-1
                            this.ChangeSignActivity();
                            this.UpdateSignState();

                        }
                        else {
                            this.nodeSign.SetState(2);
                        }
                    }
                }
            }.bind(this)
        );
    },

    //更新日历
    UpdateCalendar() {
        this.content.removeAllChildren();
        var date = new Date();
        var curYear = date.getFullYear();
        var curMonth = date.getMonth() + 1;
        var formatMonth = curMonth < 10 ? '0' + curMonth : curMonth;
        if (this.labelMonth) {
            this.labelMonth.string = curYear + '年' + formatMonth + '月';
        }


        var dateNum = new Date(curYear, curMonth, 0).getDate();

        var dates = new Array(dateNum);

        var day1 = new Date(curYear, curMonth - 1, 1).getDay();
        var displayNum = dateNum + day1;

        for (var i = 0; i != displayNum; ++i) {
            var preNode = cc.instantiate(this.prefabDate);
            preNode.tag = i >= day1 ? i + 1 - day1 : 0;
            var src_PrefabDate = preNode.getComponent('UIItemSign');
            src_PrefabDate.SetDate(i >= day1 ? i + 1 - day1 : 0);
            src_PrefabDate.SetSign(i >= day1 ? this.signList[i - day1] : false);
            this.content.addChild(preNode);
        }
    },

    //签到
    SignDate(date) {
        this.content.getChildByTag(date).getComponent('UIItemSign').SetSign(true);
        this.signList[date - 1] = true;
    },


    //更新签到状态
    UpdateSignState() {
        this.txtSignNum.string = this.signNum + '';
        this.txtResignNum.string = this.resignNum + '';
        this.txtResignCard.string = this.resignCard + '';

        //HACK
        hxfn.activityAndTask.UpdateSignState(this.signList[new Date().getDate() - 1]);

        //如果当天没有补签，显示签到按钮
        if (!this.signList[new Date().getDate() - 1]) {
            this.nodeSign.SetState(0);
        }
        //如果当天已经签到，并且补签卡大于0，当月还有未签的天数，显示补签按钮
        if (this.signList[new Date().getDate() - 1] && this.resignCard > 0 && this.resignNum > 0) {
            this.nodeSign.SetState(1);
        }
        //如果当天已经签到，并且补签卡为0，显示无法补签
        if (this.signList[new Date().getDate() - 1] && this.resignCard == 0) {
            this.nodeSign.SetState(2);
        }
        //如果当天已经签到，并且当月无未签到天数，显示无法补签
        if (this.signList[new Date().getDate() - 1] && this.resignNum == 0) {
            this.nodeSign.SetState(2);
        }
    },

    //更新签到奖励状态
    UpdateSignActivity() {
        //this.signNum = 20;
        for (var i = 0; i != 4; ++i) {
            this.packages[i].getComponent('UILobbyPacks').SetState(0);
        }

        //红色版本
        if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED) {
            this.imgArrows.forEach(element => {
                element.active = false;
            });
        }

        if (this.signNum >= 3) {
            this.packages[0].getComponent('UILobbyPacks').SetState(1);
        }
        if (this.signNum >= 7) {
            this.packages[1].getComponent('UILobbyPacks').SetState(1);
            //红色版本
            if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED)
                this.imgArrows[0].active = true;
        }
        if (this.signNum >= 15) {
            this.packages[2].getComponent('UILobbyPacks').SetState(1);
            //红色版本
            if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED)
                this.imgArrows[1].active = true;
        }
        if (this.signNum == new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()) {
            this.packages[3].getComponent('UILobbyPacks').SetState(1);
            //红色版本
            if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED)
                this.imgArrows[2].active = true;
        }
        for (var i = 0; i != 4; ++i) {
            if (hxfn.comn.JudgeIncluding(this.packages[i].getComponent('UILobbyPacks').packInfo.id, this.userData.playerActivityInfo.activitySignGetedRewardId)) {
                this.packages[i].getComponent('UILobbyPacks').SetState(2);
            }
        }
    },


    ChangeSignActivity() {
        for (var i = 0; i != 4; ++i) {
            if (this.packages[i].getComponent('UILobbyPacks').GetState() == 0) {

                if (this.signNum >= this.needSignNum[i]) {
                    this.packages[i].getComponent('UILobbyPacks').SetState(1);

                    //红色版本
                    if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED){
                        if(i > 0){
                            this.imgArrows[i-1].active = true;
                        }
                    }
                }
            }
        }
    },

    //处理领取签到奖励事件
    HandlePackClicked(pack) {
        this.curPackClickedID = pack.packInfo.id;
        var postData = {
            id: pack.packInfo.id
        };

        hxfn.netrequest.Req_Comn(
            postData,
            hxfn.netrequest.Msg_PlayerGetAsReward,
            function (msg) {
                if (msg.result == 0) {
                    pack.SetState(2);
                    var info = pack.packInfo;
                    this.GetSignReward(info);
                    //this.resignCard = this.userData.goldenInfo.remedySignCard;
                    // this.UpdateSignState();
                    this.userDataChanged = true;
                    this.needUpdate = true;
                    //info即为领取的签到信息

                    var rewardInfo = hxfn.role.curUserData.playerActivityInfo.activitySignGetedRewardId;
                    rewardInfo = rewardInfo ? rewardInfo : [];
                    rewardInfo.push(this.curPackClickedID);
                    hxfn.role.curUserData.playerActivityInfo.activitySignGetedRewardId = rewardInfo;
                    hxjs.util.Notifier.emit('UserData_Update');
                }
            }.bind(this),
        )
    },

    // onDestroy: function(){
    // },

    UpdateSignRewardList: function () {
        var activitySignProto = hxfn.activityAndTask.activitySignProto;

        this.sign0Reward = activitySignProto[0];

        this.txtAward.string = '( 本次签到可获得' + this.sign0Reward.activityRewardNum + '金币' + ' )';
        for (var i = 0; i != this.packages.length; ++i) {
            this.packages[i].getComponent('UILobbyPacks').SetInfo(activitySignProto[i + 1]);
        }
        this.UpdateSignActivity();
    },

    InitSignData() {
        var signNum = 0;
        for (var i = 0; i != this.signList.length; ++i) {
            if (this.signList[i] == true) {
                ++signNum;
            }
        }
        this.signNum = signNum;

        var curDate = new Date().getDate();
        this.resignNum = curDate - signNum - (this.signList[curDate - 1] == true ? 0 : 1) > 0 ? curDate - signNum - (this.signList[curDate - 1] == true ? 0 : 1) : 0;

        this.resignCard = this.userData.goldenInfo.remedySignCard;
    },

    //获取当日签到奖励
    //更新累计签到，补签次数，补签卡
    GetSign0Reward() {
        cc.log(this.sign0Reward);
    },

    //获取签到奖励
    //补签卡
    GetSignReward(info) {

        cc.log(info);
    },

    //获取补签日期
    GetResignDate() {
        for (var i = 0; i != new Date().getDate() - 1; ++i) {
            if (this.signList[i] == false) {
                return i + 1;
            }
        }
        return 0;
    },

    HandleNotify: function (isHandle) {
        if (isHandle) {
            hxjs.util.Notifier.on('UserData_Update', this.UpdateInfo, this);
        }
        else {
            hxjs.util.Notifier.off('UserData_Update', this.UpdateInfo, this);
        }
    },

    UpdateInfo() {
        this.resignCard = hxfn.role.curUserData.goldenInfo.remedySignCard;
        this.UpdateSignState();
    }
});
