import { hxfn } from "./../HXFN";

export let map = {
    curRoomTyeIdxSet: 0,//按钮组的索引，0号位为元宝房
    curRoomTyp: -1,// 0 金币房 // 1 元宝房
    // 游戏玩法
    Enum_RoomTyp: cc.Enum({
        Gold: 0,
        Ingot: 1,
    }),

    curGameTypId: -1,

    // 游戏玩法
    Enum_GameplayName: cc.Enum({
        None: '',
        QiangZhuang: '拼十',
        CombatEye: '博眼子',
        SanGong: '三公',
        Gobang: '五子棋',
        FightLandlords: '斗地主',
        GoldenFlower: '扎金花',
        Majiang: '麻将',
        BlackJack: '21点',
        Fivecardtud: '梭哈',
        Baccarat: '百家乐',
        RedPack: '红包广场',
        LuoSong: '罗松',
    }),

    Enum_GameplayId: cc.Enum({
        None: 0,
        QiangZhuang: 1,//(牛牛的默认玩法)拼十/看牌抢庄
        CombatEye: 2,//博眼子
        SanGong: 3,//三公
        Gobang: 4,//五子棋
        FightLandlords: 5,//斗地主
        GoldenFlower: 6,//扎金花
        Majiang: 7,//麻将
        BlackJack: 8,//21点
        Fivecardtud: 9,//梭哈
        Baccarat: 10,//百家乐
        RedPack: 11,//红包广场

        LuoSong: 13 //罗松
    }),

    // 游戏类型（玩法）
    GetGameplayName: function (id) {
        var name = null;
        switch (id) {
            case 1:
                name = this.Enum_GameplayName.QiangZhuang;//'拼十';
                break;
            case 2:
                name = this.Enum_GameplayName.CombatEye;//'博眼子';
                break;
            case 3:
                name = this.Enum_GameplayName.SanGong;//'三公';
                break;
            case 4:
                name = this.Enum_GameplayName.Gobang;//'五子棋';
                break;
            case 5:
                name = this.Enum_GameplayName.FightLandlords;
                break;
            case 6:
                name = this.Enum_GameplayName.GoldenFlower;
                break;
            case 7:
                name = this.Enum_GameplayName.Majiang;
                break;
            case 8:
                name = this.Enum_GameplayName.BlackJack;
                break;
            case 9:
                name = this.Enum_GameplayName.Fivecardtud;
                break;
            case 10:
                name = this.Enum_GameplayName.Baccarat;
                break;
            case 11:
                name = this.Enum_GameplayName.RedPack;
                break;
            case 13:
                name = this.Enum_GameplayName.LuoSong;
                break;
            default:
                break;
        }

        return name;
    },

    // 游戏玩法：拼十，游戏模式
    GetGameModeName(id) {
        var name = 'null';
        switch (id) {
            case 0:
                name = '看牌抢庄';
                break;
            case 1:
                name = '自由抢庄';
                break;
            case 2:
                name = '双十上庄';
                break;
            case 3:
                name = '通比拼十';
                break;
            case 4:
                name = '疯狂拼十';
                break;
            default:
                break;
        }

        return name;
    },

    GetRoomTypeName(typ) {
        var name = '';
        switch (typ) {
            case 0:
                name = '金币场';
                break;
            case 1:
                name = '元宝场';
                break;
            default:
                break;
        }
        return name;
    },

    //////////////////////////////////////////////////////////////////
    OnInit() {
        this.HandleServerInfo(true);
    },

    OnEnd() {
        this.HandleServerInfo(false);
    },
    //////////////////////////////////////////////////////////////////

    // HandleNotify
    HandleServerInfo: function (isHandle) {
        if (isHandle) {
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.InviteJoinRoomInform, this.InviteJoinRoomInform.bind(this));
        }
        else {
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.InviteJoinRoomInform);
        }
    },

    InviteJoinRoomInform: function (info) {
        var uiname = null;
        var uiscrname = null;

        hxfn.map.curGameTypId = info.roomInfo.createRoomOption.gameType;//玩法

        if (hxfn.map.curGameTypId === this.Enum_GameplayId.QiangZhuang) {
            uiname = 'UI_Lobby_Invited_PinShi';
            uiscrname = 'UILobbyInvited';
        }
        else if (hxfn.map.curGameTypId === this.Enum_GameplayId.FightLandlords) {
            uiname = 'battle_landlord/UI_Lobby_Invited_Landlord';
            uiscrname = 'UILobbyInvited';
        }


        hxjs.module.ui.hub.LoadPanel_DlgPop(uiname, function (prefab) {
            if (prefab != null) {
                var scr = prefab.getComponent(uiscrname);
                if (scr != null) {
                    scr.SetInfo(info);
                }
                else {
                    cc.log('[hxjs][err] wrong script name for prefab: ' + uiname);
                }
            }
        }.bind(this));
    },

    curRoom: {
        'roomId': 666666,
        'roomTyp': -1,
        'gameTyp': -1,
        'gameMode': 0,
        'curRound': -1,//
        'maxRound': -1,//

        'difen': -1,
        'enterLimit': -1,
        'leftLimit': -1,
    },

    UpdateRoomId(p) {
        this.curRoom['roomId'] = p;
    },
    UpdateRoomTyp(p) {
        this.curRoom['roomTyp'] = p;
    },
    UpdateGameTyp(p) {
        this.curGameTypId = p;
        this.curRoom['gameTyp'] = p;
    },

    UpdateCoinInfo(difen, enterLimit, leftLimit) {
        this.curRoom['difen'] = difen;
        this.curRoom['enterLimit'] = enterLimit;
        this.curRoom['leftLimit'] = leftLimit;
    },


    callback_gameplays: null,
    GetAllGameplays(cb) {
        this.callback_gameplays = cb;

        hxfn.netrequest.Req_GetGoldenHall(this.Callback_GetGoldenHall.bind(this));
    },

    Callback_GetGoldenHall(msg) {
        //检测房间ID是否有效 > 0???
        if (msg.result == 0/*OK*/) {
            //input 
            var visibleGameplays = hxfn.level.GetVisibleGameplayers(msg.menuList);
            var inGameplays = hxfn.level.RecordGameplays(visibleGameplays);
            //output
            var outGameplayers = hxfn.level.GetClientGameplay_New(inGameplays);

            if (this.callback_gameplays != null) {
                this.callback_gameplays(outGameplayers);
            }
            // this.InitGamePage(outGameplayers);
        }
        else {
            cc.log('======================== 搜索失败，或者无有效房间！！！');
            hxjs.module.ui.hub.LoadDlg_Info('获取游戏列表失败！！！', '提示');
        }
    },
}