export enum Enum_AckTyp {
    //1 叫地主, 2 抢地主, 3 出牌
    None  = 0,
    CallLord = 1,
    VieLord = 2,
    Discard = 3,
}

export enum Enum_AckResult {
    OK  = 0,
    NotModel = 1,//输入的不是任何牌型
    NotValidModel = 2,//输入的牌型不适合
}

export class setting_landlord
{
    //玩家头像位置坐标,//按照索引顺序
    public static readonly SeatPoses:any[]=[
        cc.p(-511,-95),
        cc.p(-508,132),
        cc.p(497,135),
        cc.p(-35,231),
    ];

    // 最多的座位数
    public static readonly maxUISeats: number = 3;

    // 牌
    public static readonly dipai1: number = 3;
    public static readonly maxCards1: number = 20;//17+3 1副牌3个人：3X17+3
    public static readonly cardOffset1: number = -48;
    
    public static readonly dipai2: number = 8;
    public static readonly maxCards2: number = 33;//25+8 2副牌4个人：4X25+8
    public static readonly cardOffset2: number = -68.4;

    //少牌警报
    public static readonly cardIsLess: number = 2;
    
    
    //动画时间
    //-----------------------------------------------------------------------

    //牌组相关
    //-----------------------------------------------------------------------
}