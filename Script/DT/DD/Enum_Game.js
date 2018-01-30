
// // hxdt.df = 
// // {
// //     //收益来源
// //     // source:来源
// //     // public static final int RegisterPresent = 1;    //注册赠送
// //     // public static final int Recharge = 2;           //充值
// //     // public static final int GroupMail = 3;          //群发邮件
// //     // public static final int SingleMail = 4;         //单发邮件
// //     // public static final int GameResult = 5;         //游戏赢取
// //     // public static final int DailyLogin = 7;         //每日赠送钻石
// //     // public static final int TaskReward = 8;         //任务奖励
// //     // public static final int Lottery = 9;            //抽奖
// //     // public static final int Exchange = 10;          //商城兑换
// //     // public static final int RobotRequest = 11;      //机器人使用
// //     // public static final int ActivitySign = 12;      //签到
// //     // public static final int ActivityRemedySign = 13;//补签
// //     // public static final int GetSafeGuard = 14;      //补助
// //     // public static final int FinishTask = 15;        //完成任务

// // };


// var Enum_GameState = cc.Enum({
//     None: 0,
//     Login: 1,
//     Lobby: 2,
//     Battle: 3,
// });

// var Enum_GameplayId = cc.Enum({
//     None : 0,
//     QiangZhuang : 1,//(牛牛的默认玩法)拼十/看牌抢庄
//     CombatEye : 2,//博眼子
//     SanGong : 3,//三公
//     Gobang : 4,//五子棋
//     FightLandlords : 5,//斗地主
//     GoldenFlower : 6,//扎金花
//     Majiang : 7,//麻将
//     BlackJack : 8,//21点
//     Fivecardtud : 9,//梭哈
//     Baccarat : 10,//百家乐
//     RedPack : 11,//红包广场
// });

// var Enum_GameplayName = cc.Enum({
//     None : '',
//     QiangZhuang : '拼十',
//     CombatEye : '博眼子',
//     SanGong : '三公',
//     Gobang : '五子棋',
//     FightLandlords : '斗地主',
//     GoldenFlower : '扎金花',
//     Majiang : '麻将',
//     BlackJack : '21点',
//     Fivecardtud : '梭哈',
//     Baccarat : '百家乐',
//     RedPack : '红包广场',
// });

// // // 角色类型
// var BattleRoleTyp = cc.Enum({
//     None: 0,
//     Banker: 2,//庄家
//     Player: 1,// 未抢到庄的玩家
// });

// // 货币类型
// var Enum_Coin_Typ = cc.Enum({
//     Gold : 1,
//     Gem  : 2,  
//     InGot: 3,
// });

// module.exports = {
//     Enum_GameplayId: Enum_GameplayId,
//     Enum_GameplayName: Enum_GameplayName,
//     Enum_GameState: Enum_GameState,
//     BattleRoleTyp: BattleRoleTyp,
//     Enum_Coin_Typ: Enum_Coin_Typ,
// };

export let enum_game =
{
    // GameEdition: cc.Enum({
    //     None: 0,
    //     OL: 1,
    //     RED: 2,
    //     BLACK: 3,
    // }),

    GameType: cc.Enum({
        Default: 0,
        Release:1,
        Test:2,
        Review:3
    }),

    Enum_GameState : cc.Enum({
        None: 0,
        Login: 1,
        Lobby: 2,
        Battle: 3,
    }),

    // // 角色类型
    BattleRoleTyp : cc.Enum({
        None: 0,
        Banker: 2,//庄家
        Player: 1,// 未抢到庄的玩家
    }),

    // 货币类型
    Enum_Coin_Typ : cc.Enum({
        Gold : 1,
        Gem  : 2,  
        InGot: 3,
    }),

    //收益来源
    Enum_ItemSource : cc.Enum({
        RegisterPresent : 1,    //注册赠送
        Recharge : 2,           //充值
        GroupMail : 3,          //群发邮件
        SingleMail : 4,         //单发邮件
        GameResult : 5,         //游戏赢取
        DailyLogin : 7,         //每日赠送钻石
        TaskReward : 8,         //任务奖励
        Lottery : 9,            //抽奖
        Exchange : 10,          //商城兑换
        RobotRequest : 11,      //机器人使用
        ActivitySign : 12,      //签到
        ActivityRemedySign : 13,//补签
        GetSafeGuard : 14,      //补助
        FinishTask : 15,        //完成任务
    }),

    Enum_Dtype : cc.Enum({
        gold : 300,                 //金币
        yuanbao : 301,              //元宝
        diamond : 302,              //房卡、钻石
        nameCard : 303,             //改名卡
        remedySignCard : 304,       //补签卡
        smallHorn : 305,            //小喇叭
        vipLevel :306,              //vip等级
        bankYuanbao : 308,          //保险箱元宝
    }),

    Enum_GameType : cc.Enum({
        QiangZhuang : 1,    //1.拼十
        CombatEye : 2,      //2.博眼子
        SanGong : 3,        //3.三公
        Gobang : 4,         //4.五子棋
        FightLandlords : 5, //5.斗地主
        GoldenFlower : 6,   //6.扎金花
        Majiang : 7,        //7.麻将
        BlackJack : 8,      //8. 21点
        Fivecardtud : 9,    //9. 梭哈
        Baccarat : 10,       //10. 百家乐
        BairenDazhan : 11,   //11. 百人大战
    }),

    Enum_SubGame : cc.Enum({
        MPQiangzhuang : 0,      //0.明牌抢庄
        ZYQiangzhuang : 1,      //1.自由抢庄
        SSShangzhuang : 2,      //2.双十上庄
        Tongbi : 3,             //3.通比

    }),
}