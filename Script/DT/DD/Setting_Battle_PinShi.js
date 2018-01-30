export let setting_niuniu = 
{
    /**
     * Battle 战斗部分
     */

    // 最大玩家数量
    // maxRole:6,
    // 最多的座位数
    maxUISeats:6,

    //下注倍数
    // ratios:[1,5,10],
    // ratiosCrazy:[1,5,10,-1/*无效状态*/],

    bankerTuizhuRatio: [2,5,10,25,50],

    timeForFee: 4,

    //牌组相关
    //-----------------------------------------------------------------------
    //单词发牌时长
    Time_Anim_DispatchOnce: 1,

    //发牌立即显示当前玩家的前4张手牌时间
    Time_Anim_DispatchToShow4: 0.6,

    //玩家自己亮出5张牌到推出去的间隔时间
    Time_Anim_DelayPushMyCards: 0,

    //发每张牌的飞行动画时间【由动画制作人员调整】
    Card_DispathDuration:0.1,
    //非搓牌模式下，玩家自己获得最后一张牌到自动显示的间隔时间
    Card_DispathDelayToShow:0.3,

    // 重置因为推牌带来的位置与缩放变化
    // 1，玩家自己
    MyCardConPos:cc.p(0,-140),
    MyPushedPos:[
        cc.p(-110,0),//-240
        cc.p(-55,0),//-120
        cc.p(0,0),
        cc.p(55,0),
        cc.p(110,0),
    ],
    // 2，其他玩家
    //散牌/非散牌
    OthersCardPushedPos:[
        -60,//-34,
        -30,//-17,
        0,
        30,
        60
    ],
    //-----------------------------------------------------------------------


    //抢庄动画时长度
    // Time_Anim_VieBanker: 2,

    //动画播放1s，停留1s, 消失(瞬间/动画0.3s) = 2.3s
    Anim_Delay_Opening: 0.5,
    Anim_Stay_Opening: 1.5,
    Anim_Close_Opening: 0.3,

    Anim_Delay_Victory: 0,//胜利之后延时播放金币飞的delay时间
    Anim_Stay_Victory: 3.5,
    // Anim_Close_Opening: 0.3,

    Anim_Delay_Failure: 1,
    Anim_Stay_Failure: 2,
    //互动表情时间
    Anim_Emoj_Fly_Duration:0.3,
    Anim_Emoj_Play_Duration:1,

    //聊天文字持续时间
    Anim_Chat_Play_Duration:1,
    Anim_Chat_Dismiss_Duration:2,
    Anim_Chat_Shake_Distance:20,
    Anim_Chat_Shake_Times:5,

    //录音最长时间
    Anim_Voice_Record_Time:10,
    //录音取消距离
    Anim_Voice_Record_Cancel_Distance:100,
    //////////////////////////////////////////////////////////////////////////
    //预生成的金币总数量
    Count_CoinPreCreate:100,
    //每段(胜利和失败，两段)金币飞翔时间
    Time_ResultCoinFlyPerPhase:  1.2,//！！！应该大于等于 Time_PerCoinFlyDuration + Time_HackDelayShowCoinEff

    //一组金币生成时，一次生成几个金币
    Count_SpawnOnce: 4,
    //单个金币的飞行时间
    Time_PerCoinFlyDuration : 0.4,//-------------------
    //每组金币的总数量
    Count_GroupCoin :36,
    //金币出发 间隔恒定
    deltaSpawncoin:0.02,//--------------------------
    //金币飞行曲线缓动强度
    Rate4CoinMove:3.0,

    //金币目标位置随机半径范围
    Radius4TarCoin:40,

    //////////////////////////////////////////////////////////////////////////
    //!!! 加上Time_PerCoinFlyDuration之后，不要超过Time_ResultCoinFlyPerPhase时间
    //金币飞到之后延时多少时间显示亮光
    Time_HackDelayShowCoinEff:0,

    GiveVipLevel:0,//赠送功能需要的VIP等级

    GlobalLightDelay:5,//大厅闪光延迟

    BroadCastDelayPixel:2,//跑马灯每帧走动时间

    //玩家头像位置坐标,//按照索引顺序
    SeatPoses:[
        cc.p(-481,-230.5),
        cc.p(-505.5,-18.5),
        cc.p(-441,174),
        cc.p(-107.5,229),
        cc.p(435.5,176),
        cc.p(509,-15)
    ],

    //战斗通用音效枚举
    Enum_BattleSFX : cc.Enum({
        Card_Dispath: 1,//fapai
        Coin_Fly: 2,//getmoney XXX get_golds_few get_gold_middle get_golds_much
        QZ_Selecting:3,//banker_roll
        QZ_Sure:4,//banker_ensure
        QZ_XiaZhu:5,
        Card_DispathLast:6,
        
        QZ_Male: 11,// 抢庄 qiangzhuang_nan
        QZ_Female: 12,// qiangzhuang_nv
        QZNo_Male: 13,// 不抢庄 nan_buqiang
        QZNo_Female: 14, //nv_qiang
        CrazyChipin_Male:15,//疯狂加倍
        CrazyChipin_Female:16,
    }),
    //音效
    Enum_GiftSFX : cc.Enum({
        Fly: 0,
        Kiss: 1,
        Hit: 2,
        Bomb: 3,
        Flower: 4,
        Tomato: 5,
        Proud_1:6,
        Proud_2:7,
        Car_1:8,
        Car_2:9,
        Car_3:10,
        Car_4:11,
        Car_5:12,
        Car_6:13,
        Cupid_1:14,
        Cupid_2:15,
        Cupid_3:16,
        Face_1:17,
        Face_2:18,
        Face_3:19,
        Face_4:20,
        Missile_1:21,
        Missile_2:22
    }),
}