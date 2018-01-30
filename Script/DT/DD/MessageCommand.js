
export let MessageCommand = {
	LoginCommand            :	1,  //登录
	SetUserInfo             :   2,  //设置用户信息
	NetHeartbeatCommand     :   3,  //心跳
	NetBeKickedCommand      :   4,  //踢人下线
	GetUserInfoCommand      :   5,  //获取用户信息
	CreateRoom              :   10, //开房间
	JoinRoom                :   11, //加入房间
	QuitRoom                :   12, //退出房间
	GetRoomData             :   13, //玩家在房间中确认就位，并获取当前房间状态数据(SyncRequest)
	GetRoomDataHead         :   14, //加入房间之前，获取房间基本信息
	IdVerifyReq             :   15, //验证身份证请求
	GetLoginDiamond         :   16, //获取每日登录钻石
	SMSGetAuthCode          :   20, //获取绑定手机时候的短信验证码
	SMSAuthBind             :   21, //使用验证码进行验证绑定
	SMSAuthResetPassword    :   22, //使用验证码进行密码重置
	SMSRealNameAuthentication : 23, //使用验证码进行实名认证
	GetNewPlayerActivityInfoCommand : 40,  //获取新人好礼
	NewPlayerAndShareRewardCommand  : 41,  //分享成功
	SyncPlayerJoinRoom      :   110,    //同步，玩家加入房间
	SyncRingBegin           :   111,    //一轮开局，同步消息
	SyncError               :   112,    //同步，错误消息
	SyncPlayerQuitRoom      :   113,    //同步，玩家退出房间
	SyncRingEnd             :   114,    //同步，一轮结束
	SyncPlayerReady         :   115,    //同步(麻将)玩家准备确认状态
	SyncRoomChat            :   116,    //房间聊天
	SyncForceLeft           :   117,    //强迫玩家离开房间，比如踢人
	SyncHeartBeat           :   118,    //房间心跳消息
	SyncHeartBeatAck        :   119,    //房间心跳服务器回应
	SyncPlayerLost          :   120,    //玩家掉线消息
	SyncMatchRingEnd        :   121,    //同步，比赛一轮结束
	SyncRoomCoin            :   122,    //同步房间币
	PrimChat                :   150,    //聊天输入
	SyncPlayerSendInterEmoj :   151,    //互动表情
	GetMailList             :   300,    //获取邮件列表
	OpenMail                :   301,    //打开邮件
	DelMail                 :   302,    //删除邮件
	GetMailAward            :   303,    //领取邮件附件
	GetAllMailAward         :   304,    //领取所有邮件附件
	GetHongbagList          :   310,    //获取红包列表
	GiveHongbag             :   311,    //发红包
	GuessHongbag            :   312,    //猜红包
	AgreeGiveHongbag        :   313,    //同意给红包
	NoticeAgreeHongbag      :   314,    //提醒同意给红包
	NoticeOpenHongbag       :   315,    //提醒打开红包
	RefuseGiveHongbag       :   316,    //拒绝给红包
	SetPlayerInfo           :   320,    //设置用户信息(头像、性别、昵称，等等)
	PlayerInfoChanged       :   321,    //玩家信息改变通知
	GetMajiangCount         :   322,    //获取麻将统计信息
	GetMJRoomCreatePrice    :   323,    //获取麻将创建房间价格表
	GetMJRechargeTable      :   324,    //获取麻将充值物品表
	SetPlayerNickName       :   325,    //设置用户昵称（消耗改名卡）
	GetFriendListCommand    :   350,    //获取好友列表
	SearchPlayerCommand     :   351,    //搜索用户
	AddFriendReqCommand     :   352,    //添加好友请求
	AckFriendReq            :   353,    //确认好友申请(接收、拒绝)
	InviteJoinRoomReq       :   354,    //邀请加入房间的请求
	InviteJoinRoomInform    :   355,    //服务器向客户端推送的邀请加入房间消息
	AddFriendInform         :   356,    //被添加好友请求推送
	AckFriendInform         :   357,    //申请被对方通过，自己会收到通知
	DeleteFriendCommand     :   358,    //删除好友
	DeleteFriendInform      :   359,    //删除好友的通知
	GetMsgTipCommand        :   370,    //获取提示消息
	GetNoticeCommand        :   371,    //获取公告消息
	BroadcastPost           :   372,    //广播推送
	ReadNoticeCommand       :   373,    //读公告
	KillBroadcastPost       :   374,    //取消广播
	GetBroadcastList        :   375,    //获取跑马灯列表
	GetBroadCastQual        :   376,    //获取玩家是否有广播资格
	PostBroadcast           :   377,    //玩家发送广播
	ActivitySign            :   380,    //玩家签到
	GetAsRewardList         :   381,    //获取活动签到奖励列表
	GetAsReward             :   382,    //兑换签到奖励
	GetAvRewardList         :   390,    //获取活跃度奖励列表
	GetAvReward             :   391,    //兑换活跃度奖励
	BankWithdrawReq         :   400,    //保险箱提款
	BankSaveReq             :   401,    //保险箱存款
	GetBankStateReq         :   402,    //获取保险箱是否锁定状态
	GetRanking              :   500,    //获取排行榜
	GetBalanceHistoryReq    :   501,    //获取历史战绩
	BindAgent               :   510, //绑定代理
	GetAgent                :   511, //获得玩家当前代理
	GetAgentChildren        :   512, //获得牌友(一级代理下线)
	BindSuggestAgent        :   513, //绑定官方推荐代理
	GetSuggestAgentInfo     :   514, //获取官方推荐代理信息
	RechargeNotify          :   600,     //充值通知客户端
	Recharge                :   601,     //充值
	Exchange                :   602,     //兑换商品
	QueryPlayerName         :   700,     //查询玩家名字
	GetTaskList				:   800,	// 获取任务列表
	GetTaskReward			:   801,	// 获取任务奖励
	GetLotteryData			:  	802,	// 获取抽奖信息
	DoLottery				: 	803,	// 抽奖
	GetConvertData			:  	804,	// 获取兑换信息
	DoConvert				: 	805,	// 兑换
	NoticeSafeGuard         :   810,    //提示领补助
	GetSafeGuardReward      :   811,    //玩家领补助
	GetSafeGuardInfo        :   812,    //玩家获取破产补助信息
	MaJiangGetOldRoom       :   1500,   //麻将，获取正在玩的房间,掉线玩家重新进房间使用
	GoldGetOldRoom          :   1501,   //金币房，获取正在玩的房间,掉线玩家重新进房间使用
	GoldGetLatestRoom       :   1502,   //金币房，获取最近玩的房间
	MatchSignUp             :   1600,   //报名比赛
	MatchJoin               :   1601,   //加入比赛
	MatchReady              :   1602,   //比赛准备
	MatchQuit               :   1603,   //退出比赛
	MatchLeft      			:   1604,  	//player离开比赛
	GetMatchList            :   1605,   //获取比赛信息
	MatchRoomRingEnd        :   1606,   //比赛房间一轮结束
	MatchStartNotice		:	1607,	//比赛开始提醒
	MatchStart				:   1608,   //比赛开始-由服务器下发给客户端
	MatchPlayerNumChange	:   1609,	//比赛玩家数量变更
	MatchPromotion			:   1610,	//比赛晋级
	MatchKnockout			:   1611,	//比赛淘汰
	MatchFinish				:	1612,	//比赛结束
	MatchRankingQuery       :   1613,   //查询比赛排行
	JoinMatchRoom           :   1614,   //加入比赛房
	QuitMatchRoom           :   1615,   //退出比赛房
	UseInterEmoj            :   1700,   //使用互动表情
	PlayerGiveYBReq         :   1800,   //玩家赠送元宝
	GetGoldenHall           :   10001,  //金币场大厅
	SearchRoomReq           :   10002,  //搜索可加入的房间
	GetQiangZhuangMenu      :   10100,  //获取抢庄玩法的选场列表
	GetMarketdList          :   10101,  //获取商城内的商品列表
	GetQZRoomDifenLimitList :   10102,  //获取抢庄的房间底分限制
	GetYBRoomListReq        :   10200,  //获取元宝房间列表
	GetGoldEntryInfoReq     :   10201,  //获取金币房入口信息(玩家人数，底分，进入限制)
	SearchIdlePlayerReq     :   10202,  //搜索空闲玩家
	GetAllPlayerCountReq    :   10203,  //获取在线玩家人数
	QZSyncRingCountdown     :   20001,  //抢庄开局倒数
	QZSyncRingCDBreak       :   20002,  //开局倒数被中断(新玩家加入等原因)
	QZSyncRingBegin         :   20003,  //抢庄开局
	QZSyncRingEnd           :   20004,  //一局结算
	QZActDispatch           :   20020,  //牛牛抢庄，发牌
	QZActVieBanker          :   20021,  //抢庄
	QZActBanker             :   20022,  //确定庄家
	QZActChipin             :   20023,  //下注动作
	QZActShowHand           :   20024,  //翻底牌
	QZActNiuNiu             :   20025,  //选牛
	QZActRubPoker          :   20026,  //挫牌
	QZTipVieBanker          :   20040,  //提示抢庄
	QZTipChipin             :   20041,  //提示下注
	QZTipNiuNiu             :   20042,  //提示选牛
	QZTipRubPoker          :   20043,  //提示挫牌
	QZInputVieBanker        :   20060,  //输入，抢庄
	QZInputChipin           :   20061,  //闲家下注动作
	QZInputNiuNiu           :   20062,  //动作
	QZInputRubPoker         :   20063,  //搓牌或亮底牌
	QZInputReady            :   20064,  //房间内准备
	BRSyncRingCountdown     :   20201,  //百人开局倒数
	BRSyncRingBegin         :   20202,  //百人开局
	BRSyncRingEnd           :   20203,  //百人一局结束
	BRSyncSeat              :   20204,  //百人同步座位变化
	BRSyncChipPlace         :   20205,  //同步下注位的下注量
	BRTipChipin             :   20220,  //百人提示下注
	BRTipChipinEnd          :   20221,  //提示下注结束
	BRActChipin             :   20240,  //百人, 下注动作
	BRActDispatch           :   20241,  //百人, 发牌
	BRActShowhand           :   20242,  //百人, 开牌
	BRActBalance            :   20243,  //百人, 整个房间的结算
	BRActPlayerBalance      :   20244,  //百人, 玩家自己的结算
	BRInputChipin           :   20260,  //百人, 玩家下注输入
	BRInputTakeSeat         :   20261,  //百人, 坐下
	BRAck                   :   20270,  //百人, 客户端输入的响应(比如不能下注，原因)
	DZSyncRingBegin         :   21000,  //斗地主开局
	DZSyncRingEnd           :   21001,  //斗地主结算
	DZSyncRingCountdown     :   21002,  //斗地主开局倒数
	DZSyncPlayerReady       :   21003,  //通过玩家确认状态
	DZSyncRingMulti         :   21004,  //同步牌局倍数
	DZSyncPlayerJoin        :   21005,  //斗地主，同步玩家进入
	DZSyncRingCDBreak       :   21006,  //开局倒数被中断(玩家退出等原因)
	DZTipCallLord           :   21100,  //斗地主，提示叫地主
	DZTipOpenCard           :   21101,  //斗地主，提示明牌
	DZTipVieLord            :   21102,  //斗地主，提示抢地主
	DZTipMultiple           :   21103,  //斗地主，提示加倍
	DZTipDiscard            :   21104,  //斗地主，提示出牌
	DZInputCallLord         :   21200,  //斗地主，输入叫地主
	DZInputOpenCard         :   21201,  //斗地主，输入明牌
	DZInputVieLord          :   21202,  //斗地主，输入抢地主
	DZInputMultiple         :   21203,  //斗地主, 输入加倍
	DZInputDiscard          :   21204,  //斗地主，输入出牌
	DZInputReady            :   21205,  //斗地主，玩家确认开局
	DZActCallLord           :   21300,  //斗地主, 动作 叫地主
	DZActShowLordCard       :   21301,  //斗地主，抽地主牌
	DZActDispatch           :   21302,  //斗地主，发牌
	DZActDispatchLordCard   :   21303,  //斗地主，下发地主牌
	DZActOpenCard           :   21304,  //斗地主，明牌动作
	DZActVieLord            :   21305,  //斗地主，动作抢地主
	DZActMultiple           :   21306,  //斗地主，动作 加倍
	DZActConfirmLord        :   21307,  //斗地主，确定地主
	DZActDiscard            :   21308,  //斗地主，出牌动作
	DZActionTurn            :   21309,  //斗地主，轮到谁动作，用于客户端在对应座位显示动作倒数
	DZActRefreshOpenCard    :   21310,  //斗地主，刷新明牌玩家的手牌
	DZInputACK              :   21400,  //斗地主，输入响应
	SKSyncRingBegin         :   22000,  //双扣，开局
	SKSyncRingEnd           :   22001,  //双扣，结算
	SKSyncRingCountdown     :   22002,  //双扣，开局倒数
	SKSyncPlayerReady       :   22003,  //双扣，同步玩家确认状态
	SKSyncPlayerJoin        :   22004,  //双扣，同步玩家进入
	SKSyncRingCDBreak       :   22005,  //双扣，开局倒数被中断(玩家退出等原因)
	SKSyncShowSeatPoker     :   22006,  //双扣，展示座位牌
	SKSyncChangeSeat        :   22007,  //双扣，换位置
	SKSyncGroupPlayerCard   :   22008,  //双扣，同步对家手牌
	SKTipDiscard            :   22100,  //双扣，提示出牌
	SKInputDiscard          :   22200,  //双扣，输入出牌
	SKInputReady            :   22201,  //双扣，玩家确认开局
	SKActDispatch           :   22300,  //双扣，发牌
	SKActDiscard            :   22301,  //双扣，出牌动作
	SKActionTurn            :   22302,  //双扣，轮到谁动作，用于客户端在对应座位显示动作倒数
	SKInputACK              :   22400,  //输入响应
	GBSyncRingBegin         :   30000,  //五子棋，同步开局
	GBTipChessDown          :   30001,  //五子棋，提示操作，等待输入开始
	GBActChessDown          :   30002,  //五子棋，同步-玩家落子
	GBActionTurn            :   30003,  //五子棋，同步-时间倒数
	GBInputChessDown        :   30004,  //五子棋，输入-玩家落子
	GBSyncRingEnd           :   30005,  //五子棋，同步-一局结束
	GBPlayerGiveup          :   30006,  //五子棋，输入-玩家认输
	GBSyncPlayerGiveup      :   30007,  //五子棋，同步-玩家认输
	GBSetTuition            :   30008,  //五子棋，设置学费
	GBSyncSetTuition        :   30009,  //五子棋，同步设置学费
	GBConfirmResult         :   30010,  //五子棋，玩家确认退出
	LSSyncRingCountdown     :   40001,  //罗松,开局倒数
	LSSyncRingCDBreak       :   40002,  //罗松，开局倒数被中断(新玩家加入等原因)
	LSSyncRingBegin         :   40003,  //罗松,开局
	LSSyncRingEnd           :   40004,  //罗松，一局结算
	LSInputReady            :   40020,  //罗松，房间内准备
	LSInputSuitSort         :   40021,  //罗松，花色
	LSInputFreePlaceCard    :   40022,  //罗松，自由摆牌
	LSInputDirectlyPlaceCard   :   40023,  //罗松，一键摆牌
	LSInputEnterPier        :   40024,  //罗松，选牌入墩
	LSActDispatch           :   40040,  //罗松，发牌
	LSActRefreshHand        :   40041,  //罗松，刷新牌
	LSActRefreshModel       :   40042,  //罗松，刷新牌型
	LSActRefreshPier        :   40043,  //罗松，刷新墩位相应的牌
	LSActTouFighting        :   40044,  //罗松，比较头墩牌
	LSActZhongFighting      :   40045,  //罗松，比较中墩牌
	LSActWeiFighting        :   40046,  //罗松，比较尾墩牌
	LSActShowSpecialMosel   :   40047,  //罗松，显示特殊牌型
	LSActExchangePier       :   40048,  //罗松，墩位牌交换
	LSTipModel              :   40060,  //罗松，提示牌型
	LSTipEnterPier          :   40061,  //罗松，提示选牌入墩



	codeToString(code) {
		switch(code) {
			case 1:
				return "LoginCommand";
			case 2:
				return "SetUserInfo";
			case 3:
				return "NetHeartbeatCommand";
			case 4:
				return "NetBeKickedCommand";
			case 5:
				return "GetUserInfoCommand";
			case 10:
				return "CreateRoom";
			case 11:
				return "JoinRoom";
			case 12:
				return "QuitRoom";
			case 13:
				return "GetRoomData";
			case 14:
				return "GetRoomDataHead";
			case 15:
				return "IdVerifyReq";
			case 16:
				return "GetLoginDiamond";
			case 20:
				return "SMSGetAuthCode";
			case 21:
				return "SMSAuthBind";
			case 22:
				return "SMSAuthResetPassword";
			case 23:
				return "SMSRealNameAuthentication";
			case 40:
				return "GetNewPlayerActivityInfoCommand";
			case 41:
				return "NewPlayerAndShareRewardCommand";
			case 110:
				return "SyncPlayerJoinRoom";
			case 111:
				return "SyncRingBegin";
			case 112:
				return "SyncError";
			case 113:
				return "SyncPlayerQuitRoom";
			case 114:
				return "SyncRingEnd";
			case 115:
				return "SyncPlayerReady";
			case 116:
				return "SyncRoomChat";
			case 117:
				return "SyncForceLeft";
			case 118:
				return "SyncHeartBeat";
			case 119:
				return "SyncHeartBeatAck";
			case 120:
				return "SyncPlayerLost";
			case 121:
				return "SyncMatchRingEnd";
			case 122:
				return "SyncRoomCoin";
			case 150:
				return "PrimChat";
			case 151:
				return "SyncPlayerSendInterEmoj";
			case 300:
				return "GetMailList";
			case 301:
				return "OpenMail";
			case 302:
				return "DelMail";
			case 303:
				return "GetMailAward";
			case 304:
				return "GetAllMailAward";
			case 310:
				return "GetHongbagList";
			case 311:
				return "GiveHongbag";
			case 312:
				return "GuessHongbag";
			case 313:
				return "AgreeGiveHongbag";
			case 314:
				return "NoticeAgreeHongbag";
			case 315:
				return "NoticeOpenHongbag";
			case 316:
				return "RefuseGiveHongbag";
			case 320:
				return "SetPlayerInfo";
			case 321:
				return "PlayerInfoChanged";
			case 322:
				return "GetMajiangCount";
			case 323:
				return "GetMJRoomCreatePrice";
			case 324:
				return "GetMJRechargeTable";
			case 325:
				return "SetPlayerNickName";
			case 350:
				return "GetFriendListCommand";
			case 351:
				return "SearchPlayerCommand";
			case 352:
				return "AddFriendReqCommand";
			case 353:
				return "AckFriendReq";
			case 354:
				return "InviteJoinRoomReq";
			case 355:
				return "InviteJoinRoomInform";
			case 356:
				return "AddFriendInform";
			case 357:
				return "AckFriendInform";
			case 358:
				return "DeleteFriendCommand";
			case 359:
				return "DeleteFriendInform";
			case 370:
				return "GetMsgTipCommand";
			case 371:
				return "GetNoticeCommand";
			case 372:
				return "BroadcastPost";
			case 373:
				return "ReadNoticeCommand";
			case 374:
				return "KillBroadcastPost";
			case 375:
				return "GetBroadcastList";
			case 376:
				return "GetBroadCastQual";
			case 377:
				return "PostBroadcast";
			case 380:
				return "ActivitySign";
			case 381:
				return "GetAsRewardList";
			case 382:
				return "GetAsReward";
			case 390:
				return "GetAvRewardList";
			case 391:
				return "GetAvReward";
			case 400:
				return "BankWithdrawReq";
			case 401:
				return "BankSaveReq";
			case 402:
				return "GetBankStateReq";
			case 500:
				return "GetRanking";
			case 501:
				return "GetBalanceHistoryReq";
			case 510:
				return "BindAgent";
			case 511:
				return "GetAgent";
			case 512:
				return "GetAgentChildren";
			case 513:
				return "BindSuggestAgent";
			case 514:
				return "GetSuggestAgentInfo";
			case 600:
				return "RechargeNotify";
			case 601:
				return "Recharge";
			case 602:
				return "Exchange";
			case 700:
				return "QueryPlayerName";
			case 800:
				return "GetTaskList";
			case 801:
				return "GetTaskReward";
			case 802:
				return "GetLotteryData";
			case 803:
				return "DoLottery";
			case 804:
				return "GetConvertData";
			case 805:
				return "DoConvert";
			case 810:
				return "NoticeSafeGuard";
			case 811:
				return "GetSafeGuardReward";
			case 812:
				return "GetSafeGuardInfo";
			case 1500:
				return "MaJiangGetOldRoom";
			case 1501:
				return "GoldGetOldRoom";
			case 1502:
				return "GoldGetLatestRoom";
			case 1600:
				return "MatchSignUp";
			case 1601:
				return "MatchJoin";
			case 1602:
				return "MatchReady";
			case 1603:
				return "MatchQuit";
			case 1604:
				return "MatchLeft";
			case 1605:
				return "GetMatchList";
			case 1606:
				return "MatchRoomRingEnd";
			case 1607:
				return "MatchStartNotice";
			case 1608:
				return "MatchStart";
			case 1609:
				return "MatchPlayerNumChange";
			case 1610:
				return "MatchPromotion";
			case 1611:
				return "MatchKnockout";
			case 1612:
				return "MatchFinish";
			case 1613:
				return "MatchRankingQuery";
			case 1614:
				return "JoinMatchRoom";
			case 1615:
				return "QuitMatchRoom";
			case 1700:
				return "UseInterEmoj";
			case 1800:
				return "PlayerGiveYBReq";
			case 10001:
				return "GetGoldenHall";
			case 10002:
				return "SearchRoomReq";
			case 10100:
				return "GetQiangZhuangMenu";
			case 10101:
				return "GetMarketdList";
			case 10102:
				return "GetQZRoomDifenLimitList";
			case 10200:
				return "GetYBRoomListReq";
			case 10201:
				return "GetGoldEntryInfoReq";
			case 10202:
				return "SearchIdlePlayerReq";
			case 10203:
				return "GetAllPlayerCountReq";
			case 20001:
				return "QZSyncRingCountdown";
			case 20002:
				return "QZSyncRingCDBreak";
			case 20003:
				return "QZSyncRingBegin";
			case 20004:
				return "QZSyncRingEnd";
			case 20020:
				return "QZActDispatch";
			case 20021:
				return "QZActVieBanker";
			case 20022:
				return "QZActBanker";
			case 20023:
				return "QZActChipin";
			case 20024:
				return "QZActShowHand";
			case 20025:
				return "QZActNiuNiu";
			case 20026:
				return "QZActRubPoker";
			case 20040:
				return "QZTipVieBanker";
			case 20041:
				return "QZTipChipin";
			case 20042:
				return "QZTipNiuNiu";
			case 20043:
				return "QZTipRubPoker";
			case 20060:
				return "QZInputVieBanker";
			case 20061:
				return "QZInputChipin";
			case 20062:
				return "QZInputNiuNiu";
			case 20063:
				return "QZInputRubPoker";
			case 20064:
				return "QZInputReady";
			case 20201:
				return "BRSyncRingCountdown";
			case 20202:
				return "BRSyncRingBegin";
			case 20203:
				return "BRSyncRingEnd";
			case 20204:
				return "BRSyncSeat";
			case 20205:
				return "BRSyncChipPlace";
			case 20220:
				return "BRTipChipin";
			case 20221:
				return "BRTipChipinEnd";
			case 20240:
				return "BRActChipin";
			case 20241:
				return "BRActDispatch";
			case 20242:
				return "BRActShowhand";
			case 20243:
				return "BRActBalance";
			case 20244:
				return "BRActPlayerBalance";
			case 20260:
				return "BRInputChipin";
			case 20261:
				return "BRInputTakeSeat";
			case 20270:
				return "BRAck";
			case 21000:
				return "DZSyncRingBegin";
			case 21001:
				return "DZSyncRingEnd";
			case 21002:
				return "DZSyncRingCountdown";
			case 21003:
				return "DZSyncPlayerReady";
			case 21004:
				return "DZSyncRingMulti";
			case 21005:
				return "DZSyncPlayerJoin";
			case 21006:
				return "DZSyncRingCDBreak";
			case 21100:
				return "DZTipCallLord";
			case 21101:
				return "DZTipOpenCard";
			case 21102:
				return "DZTipVieLord";
			case 21103:
				return "DZTipMultiple";
			case 21104:
				return "DZTipDiscard";
			case 21200:
				return "DZInputCallLord";
			case 21201:
				return "DZInputOpenCard";
			case 21202:
				return "DZInputVieLord";
			case 21203:
				return "DZInputMultiple";
			case 21204:
				return "DZInputDiscard";
			case 21205:
				return "DZInputReady";
			case 21300:
				return "DZActCallLord";
			case 21301:
				return "DZActShowLordCard";
			case 21302:
				return "DZActDispatch";
			case 21303:
				return "DZActDispatchLordCard";
			case 21304:
				return "DZActOpenCard";
			case 21305:
				return "DZActVieLord";
			case 21306:
				return "DZActMultiple";
			case 21307:
				return "DZActConfirmLord";
			case 21308:
				return "DZActDiscard";
			case 21309:
				return "DZActionTurn";
			case 21310:
				return "DZActRefreshOpenCard";
			case 21400:
				return "DZInputACK";
			case 22000:
				return "SKSyncRingBegin";
			case 22001:
				return "SKSyncRingEnd";
			case 22002:
				return "SKSyncRingCountdown";
			case 22003:
				return "SKSyncPlayerReady";
			case 22004:
				return "SKSyncPlayerJoin";
			case 22005:
				return "SKSyncRingCDBreak";
			case 22006:
				return "SKSyncShowSeatPoker";
			case 22007:
				return "SKSyncChangeSeat";
			case 22008:
				return "SKSyncGroupPlayerCard";
			case 22100:
				return "SKTipDiscard";
			case 22200:
				return "SKInputDiscard";
			case 22201:
				return "SKInputReady";
			case 22300:
				return "SKActDispatch";
			case 22301:
				return "SKActDiscard";
			case 22302:
				return "SKActionTurn";
			case 22400:
				return "SKInputACK";
			case 30000:
				return "GBSyncRingBegin";
			case 30001:
				return "GBTipChessDown";
			case 30002:
				return "GBActChessDown";
			case 30003:
				return "GBActionTurn";
			case 30004:
				return "GBInputChessDown";
			case 30005:
				return "GBSyncRingEnd";
			case 30006:
				return "GBPlayerGiveup";
			case 30007:
				return "GBSyncPlayerGiveup";
			case 30008:
				return "GBSetTuition";
			case 30009:
				return "GBSyncSetTuition";
			case 30010:
				return "GBConfirmResult";
			case 40001:
				return "LSSyncRingCountdown";
			case 40002:
				return "LSSyncRingCDBreak";
			case 40003:
				return "LSSyncRingBegin";
			case 40004:
				return "LSSyncRingEnd";
			case 40020:
				return "LSInputReady";
			case 40021:
				return "LSInputSuitSort";
			case 40022:
				return "LSInputFreePlaceCard";
			case 40023:
				return "LSInputDirectlyPlaceCard";
			case 40024:
				return "LSInputEnterPier";
			case 40040:
				return "LSActDispatch";
			case 40041:
				return "LSActRefreshHand";
			case 40042:
				return "LSActRefreshModel";
			case 40043:
				return "LSActRefreshPier";
			case 40044:
				return "LSActTouFighting";
			case 40045:
				return "LSActZhongFighting";
			case 40046:
				return "LSActWeiFighting";
			case 40047:
				return "LSActShowSpecialMosel";
			case 40048:
				return "LSActExchangePier";
			case 40060:
				return "LSTipModel";
			case 40061:
				return "LSTipEnterPier";
			default:
				return "unkown";
		}
	}
}

