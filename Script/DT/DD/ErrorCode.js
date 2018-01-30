
export let ErrorCode = {
	OK				:	0, //成功
	DefaultError	:	1, //默认错误
	PermissionDenied :  10, //权限不足
	CantOpenAddress	:	100, //无法连接地址
	BadRequest		:	1000, //错误的请求消息
	ServerException :	1001, //服务器错误
	TimeOut			:	1002, //超时
	Disconnect		:	1003, //断开连接
	MessageError	:	1004, //消息错误
	RequestParaError :  1005, //请求参数异常
	ServerDataError	:	1006, //服务器数据错误
	ServerClosed    :   1007, //停服
	ServerOnlineCountMax : 1008, //达到在线人数上限
	ServerAllCountMax : 1009, //达到服务器总人数上限
	ServerUserIsGolden : 1010, //该玩家已经绑定代理
	ServerPhoneIsGolden  : 1011, //该手机号已经绑定代理
	ConditionNotMeet    :  1100,	//条件不满足
	UserAlreadyExist	:  1101,	//用户已存在
	AccountOrPwdError	:  1102,	//用户名或密码错
	PlayerNotCreate		:  1103,	//玩家未创建
	NameUsed            :  1104,   //名字已经存在
	NameLengthMax       :  1105,   //名字超过最大长度
	NameErrorCode       :  1106,   //名字有屏蔽字符
	GuildNameLengthMax  :  1107,   //工会名字超过最大长度
	GuildManifestoLengthMax : 1108, //工会宣言名字超过最大长度
	BeBaned                 : 1109, //您的账号存在异常不能登陆，请联系客服反馈问题
	ContainSensitiveWord 	: 1110, //包含敏感字符
	VersionLimit        : 1111, //版本限制
	LackMoney           : 1112, //筹码不足
	RoomIsFull			: 1113,	//房间已满
	LackRobot           : 1114, //机器人不足
	RoomNotFount        : 1115, //房间不存在
	InfoNotExist        : 1116, //信息不存在
	NoneToGet           : 1117, //没有可以领取的
	PasswordError       : 1118, //密码错误
	SMSCodeError        : 1119, //短信验证码验证错误
	SMSCodeTimeOut      : 1120, //短信验证码超时
	UserNotExist        : 1121, //用户不存在
	SMSCodeSendError    : 1122, //验证码发送失败
	PhoneUsed           : 1123, //电话号码已注册
	PlayerNotExist      : 1124, //玩家不存在
	RoomNotExist        : 1125, //房间不存在
	PlayerExist         : 1126, //玩家已经存在
	OperationTooOften   : 1127, //操作太频繁
	PhoneNotExist       : 1128, //电话号码没有注册
	PlayerInRoom        : 1129, //玩家正在房间内
	MailNotExist        : 1130, //邮件不存在
	MailNoAward         : 1131, //邮件奖励不存在或者已经领取
	SBInRoom            : 1132, //房间内有玩家
	HTTPError           : 1133, //http请求错误
	IDCardError         : 1134, //身份证号错误
	LackYuanbao         : 1135, //元宝不足
	LackGold            : 1136, //金币不足
	LackDiamond         : 1137, //房卡不足
	LackRemedySignCard  : 1138, //补签卡不足
	LackNameCard        : 1139, //改名卡不足
	DifenOutOfRange     : 1140, //底分超出限制
	LimitNotMatchDifen  : 1141, //入场离场不符合底分倍数
	PlayerRemainAtRoom  : 1142, //上一局还未结束，不能进入新房间
	RoomNotSuit         : 1143, //没有合适的房间
	LackVip             :   1144,   //VIP等级不足
	PlayerLockToDo  : 1145, //上一局还未结束，不能进行此操作
	LackBankYuanbao    : 1146,     //保险箱元宝不足
	BankLock           : 1147,     //牌局进行中，不可操作
	FriendMax           :   1160,   //好友数量达到上限
	PeerOffline         :   1161,   //对方不在线
	LackYuanbaoByUseInterEmoj   :   1162, //发送互动表情元宝不足
	LackGoldByUseInterEmoj      :   1163, //发送互动表情金币不足
	PhoneNumberError            :   1164, //手机号码错误
	CantJoinNewbie      : 1165,     //您无法加入新手房间
	RechargeGetTransitFail : 1200, //充值，获取transit失败
	RechargeQRFail : 1201, //充值，获取二维码失败
	RechargeServerClose : 1202, //充值服务器维护中
	RechargeHelp : 1203, //感谢您的配合
	GetServerRechargeChannelFailed : 1204, //获取充值渠道失败
	BindAgentNotExist   : 1300, //绑定的上线不存在
	BindAgentAlready    : 1301, //已经绑定了上线
	CantBindChild       : 1302, //不能绑定自己的下线用户
	CantFindChild		: 1303, //找不到下线用户
	CannotBindNormalPlayer: 1304, //不能绑定普通玩家为上级代理
	QueryPlayerInfoFailed : 1305, //未查询到对应玩家信息，请核对玩家ID或手机号
	HaveNoAgent       : 1306, //玩家没有绑定代理
	PlayerCannotBindHimself : 1307, //玩家不能绑定自己为上级代理
	BRChipinEnd : 2020,     //百人，下注已结束
	BRSeatBeTaken : 2021,   //百人，座位上已有玩家
	BRNotInSeat : 2022,     //百人，玩家不在座位上
	BRBankerCantChipin : 2023,  //百人，庄家不可下注
	BRNotValidInGamePlaying : 2024,   //游戏过程中，不可操作
	ActivityCodeError : 2400, //兑换码不存
	ActivityCodeServerError : 2401, //该服务器不能使用此兑换码
	ActivityCodeUsed : 2402, //已经使用过此兑换码
	ActivityOvertime : 2403, //活动超时
	ActivityNotCompleted : 2404, //活动未完成
	ActivityUsed : 2405, //奖励已经领取
	ActivityTimesMax : 2406, //活动领取次数上限
	ActivityHasOpenFund : 2407, //已经购买过开服基金
	ActivityNotHasOpenFund : 2408, //没有购买开服基金
	ActivityCodeTypeUsed : 2409, //已经使用过同类型的兑换码
	ActivityCodeOverTime : 2410, //激活码超时
	PlatformLoginCheckTryError : 2500, //渠道验证在try模块中出错
	PlatformLoginCheckUrlError : 2501, //渠道验证地址错误
	PlatformLoginCheckParError : 2502, //渠道验证参数错误
	PlatformLoginCheckFail : 2503, //渠道验证失败
	PlatformRechargeCheckFail : 2504, //充值验证失败
	PlatformOrderCheckFail : 2505, //订单请求失败
	PlatformRechargeSignFail : 2506, //生成sign失败
	PlatformRechargeLackMoney : 2507, //金额不足
	PlatformRechargePayFail : 2508, //支付失败
	PlatformRechargeCancelPayOK : 2509, //退款成功
	PlatformRechargeCancelPayFail : 2510, //退款失败
	PlatformRechargeQueryFail : 2511, //查询失败
	SuperAgentOperateErrorPlayerNotExist : 2580, //创建顶级代理玩家失败，该玩家不存在
	SuperAgentCreateErrorPlayerAlreadySuper : 2581, //创建顶级代理玩家失败，该玩家已经是顶级代理
	SuperAgentDeleteErrorPlayerNotSuper : 2582, //删除顶级代理玩家失败，该玩家不是顶级代理
	GMQueryConditionNull : 2583, //查询条件为空
	ParentAgentNotExist : 2584, //上级代理玩家不存在
	QueryConditionError : 2585, //查询下级代理的查询条件错误
	PlayerAlreadyBaned : 2586, //玩家已经被封号
	PlayerAlreadyDisbaned : 2587, //玩家已经被解封
	IPAlreadyInWhiteList : 2588, //该IP已经被加入白名单
	IPAlreadyDeletedFromWhiteList : 2589, //该IP已经从白名单移除
	PlayerAlreadyBeDistributorUser  : 2590,  //玩家已经是分销商
	DistributorUserStateError : 2591,       //分销商玩家状态错误
	OnlyBindSuperAgentAllowedToBeDistributor : 2592, //只有绑定顶级代理为直属上级的玩家才能成为分销商
	WithdrawAmountNotAllowed : 2593, //可提现金额需大于100元才能提现
	UserAccountCannotLogin : 2594,   //该账号无法登陆，请在游戏内绑定邀请人后再试
	DiscountExpireTimeCannotEarlyThanNow : 2595,   //玩家折扣信息设置的过期时间不能早于当前时间
	DiscountProceedTimeCannotOverlapWithOthers : 2596,   //玩家折扣信息的设置时间不能与其他已经生效或者将会生效的折扣设置重叠
	PlayerIsNotAgentUser : 2597,   //该玩家不是代理用户
	PlayerIsNotDistributor : 2598,      //该玩家不是分销商
	WechatWithdrawMustSubscribe : 2599,      //微信提现的玩家必须关注微信公众号
	WithdrawOrderApproveErrorE100 : 2600,   //商户未授权或没有开通API接口
	WithdrawOrderApproveErrorE101 : 2601,   //签名验证错误
	WithdrawOrderApproveErrorE102 : 2602,   //数据解密错误
	WithdrawOrderApproveErrorE103 : 2603,   //时间戳过期
	WithdrawOrderApproveErrorE104 : 2604,   //输入参数验证错误
	WithdrawOrderApproveErrorE105 : 2605,   //银行返回的具体错误描述
	WithdrawOrderApproveErrorE106 : 2606,   //风险控制错误
	WithdrawOrderApproveErrorE107 : 2607,   //授权过期
	WithdrawOrderApproveErrorE108 : 2608,   //限制错误
	WithdrawOrderApproveErrorE109 : 2609,   //商户账户资金不足，账户金额不足以支持此次批付
	WithdrawOrderApproveErrorE110 : 2610,   //单据号已经存在，调用查询接口确认订单状态
	WithdrawOrderApproveErrorU999 : 2611,   //未知错误，调用查询接口确认订单状态
	JuniorMarketingMustBeAgentUser : 2612,  //初级分销商用户的ID必须为玩家ID且该玩家必须为代理用户
	PlayerIdCanNotBeNull : 2613,            //玩家Id不能为空
	QueryDateCanNotBeNull : 2614,           //查询日期不能为空
	SuperAgentCannotBindToOthers : 2615,    //顶级代理不能绑定其他玩家为上级
	TaskNotFinish : 3000,    // 任务未完成
	TaskRewardRepeat : 3001, // 已经领取过
	TaskNoTask : 3002,       // 任务不存在
	TaskNoReward : 3003,     // 奖励不存在
	LotteryNoDiamond : 3010, // 房卡不足
	ConvertNoLottery : 3011, // 兑换券不足
	ConvertNoCost : 3012,    // 兑换消耗物品不存在
	ConvertNoAward : 3013,   // 兑换物品不存在
	ConvertNoConv : 3014,    // 兑换ID不存在
	GMAuthenticationFail : 5000, //认证失败
	GMServerError : 5001, //服务器出错
	GMPlayerNotExist : 5002, //玩家不存在
	GMLackCurrency : 5003, //金额不足
	GMLevelOutOfRange : 5004, //等级超出范围
	GMAccountOrPwdError : 5005, //账号密码错误
	GMServerIdExist : 5006, //服务器id已经存在
	GMLoginServerError : 5007, //登入服务器操作失败
	GMNoticeNotExist : 5008, //公告不存在
	GMNoticeExist : 5009, //公告已经存在
	GMServerIdNotExist : 5010, //服务器id不存在
	GMLackDate : 5011, //缺少时间
	GMUserExist : 5012, //用户已经存在
	GMUserNotExist : 5013, //用户已经存在
	GMRechargeServerError : 5014, //充值服务器操作失败
	GMFormatError : 5015, //输入格式错误
	GMGuildNotExist : 5016, //公会不存在
	GMOrderLockAccountError : 5017, //锁定账号不正确
	GMOrderUnlockAccountError : 5018, //解锁账号不正确
	GMOrderStatusError : 5019, //订单状态不能变更
	GMSVIPAlreadyApplied : 5020, //已经提出了申请
	GMSVIPRechargeRepeat : 5021, //订单号重复
	GMSVIPRechargeMin : 5022, //低于最小金额
	GMAlreadyAdd : 5023, //已经添加
	GMBoardCastNotExist : 5024,//跑马灯不存在
	ActivityRepeatSign : 6000, //重复签到
	ActivityRepeatGetSignReward : 6001, //重复领取签到奖励
	ActivityGetSignRewardLackOfDay : 6002, //签到天数不足
	ActivityRepeatGetVitalityReward : 6003, //重复领取活跃度奖励
	ActivityGetVitalityRewardLackOfVitality : 6004, //活跃度不足
	ActivityGetDailySafeguardNotNow : 6005, //领取破产补助未到时间
	HongbagGuessError : 7000,           //红包广场猜错数量
	HongbagLackVip : 7001,              //发红包VIP等级不够
	HongbagFriendLackVip : 7002,        //发好友红包VIP等级不够
	HongbagOutofYuanbaoSelf : 7003,     //发红包超出身上的元宝，最低要求2000
	HongbagOutofRange : 7004,           //发红包超出限制的元宝范围
	HongbagOutofNum : 7005,             //发红包超出数量
	GMXXX50200 : 50200, //缺少玩家ID
	GMXXX50201 : 50201, //请填写提现金额
	GMXXX50211 : 50211, //缺少玩家名字
	GMXXX50212 : 50212, //您的提现金额将于24小时之内到账，请及时查收
	GMXXX50222 : 50222, //缺少玩家名字或ID
	GMXXX50223 : 50223, //不要着急，管理员正在卖命审核您的账号
	GMXXX50233 : 50233, //请输入充值金额
	GMXXX50234 : 50234, //您的账号已通过审核
	GMXXX50235 : 50235, //请输入100的整数倍
	GMXXX50244 : 50244, //您的申请未能通过管理员的审核，请提交正确的个人资料
	GMXXX50245 : 50245, //超出最大充值金额
	GMAgentBindError : 51000,   //下级代理绑定失败
	AsyncResponse : 10000,	//异步处理消息,服务器内部使用,协调GameServer 与 BattleServer行为的特殊错误码
	RelayResponse : 10001,	//转发消息,服务器内部使用,协调GameServer 与 BattleServer行为的特殊错误码


	codeToDesc(code) {
		switch(code) {
			case 0:
				return "成功";
			case 1:
				return "默认错误";
			case 10:
				return "权限不足";
			case 100:
				return "无法连接地址";
			case 1000:
				return "错误的请求消息";
			case 1001:
				return "服务器错误";
			case 1002:
				return "超时";
			case 1003:
				return "断开连接";
			case 1004:
				return "消息错误";
			case 1005:
				return "请求参数异常";
			case 1006:
				return "服务器数据错误";
			case 1007:
				return "停服";
			case 1008:
				return "达到在线人数上限";
			case 1009:
				return "达到服务器总人数上限";
			case 1010:
				return "该玩家已经绑定代理";
			case 1011:
				return "该手机号已经绑定代理";
			case 1100:
				return "条件不满足";
			case 1101:
				return "用户已存在";
			case 1102:
				return "用户名或密码错";
			case 1103:
				return "玩家未创建";
			case 1104:
				return "名字已经存在";
			case 1105:
				return "名字超过最大长度";
			case 1106:
				return "名字有屏蔽字符";
			case 1107:
				return "工会名字超过最大长度";
			case 1108:
				return "工会宣言名字超过最大长度";
			case 1109:
				return "您的账号存在异常不能登陆，请联系客服反馈问题";
			case 1110:
				return "包含敏感字符";
			case 1111:
				return "版本限制";
			case 1112:
				return "筹码不足";
			case 1113:
				return "房间已满";
			case 1114:
				return "机器人不足";
			case 1115:
				return "房间不存在";
			case 1116:
				return "信息不存在";
			case 1117:
				return "没有可以领取的";
			case 1118:
				return "密码错误";
			case 1119:
				return "短信验证码验证错误";
			case 1120:
				return "短信验证码超时";
			case 1121:
				return "用户不存在";
			case 1122:
				return "验证码发送失败";
			case 1123:
				return "电话号码已注册";
			case 1124:
				return "玩家不存在";
			case 1125:
				return "房间不存在";
			case 1126:
				return "玩家已经存在";
			case 1127:
				return "操作太频繁";
			case 1128:
				return "电话号码没有注册";
			case 1129:
				return "玩家正在房间内";
			case 1130:
				return "邮件不存在";
			case 1131:
				return "邮件奖励不存在或者已经领取";
			case 1132:
				return "房间内有玩家";
			case 1133:
				return "http请求错误";
			case 1134:
				return "身份证号错误";
			case 1135:
				return "元宝不足";
			case 1136:
				return "金币不足";
			case 1137:
				return "房卡不足";
			case 1138:
				return "补签卡不足";
			case 1139:
				return "改名卡不足";
			case 1140:
				return "底分超出限制";
			case 1141:
				return "入场离场不符合底分倍数";
			case 1142:
				return "上一局还未结束，不能进入新房间";
			case 1143:
				return "没有合适的房间";
			case 1144:
				return "VIP等级不足";
			case 1145:
				return "上一局还未结束，不能进行此操作";
			case 1146:
				return "保险箱元宝不足";
			case 1147:
				return "牌局进行中，不可操作";
			case 1160:
				return "好友数量达到上限";
			case 1161:
				return "对方不在线";
			case 1162:
				return "发送互动表情元宝不足";
			case 1163:
				return "发送互动表情金币不足";
			case 1164:
				return "手机号码错误";
			case 1165:
				return "您无法加入新手房间";
			case 1200:
				return "充值，获取transit失败";
			case 1201:
				return "充值，获取二维码失败";
			case 1202:
				return "充值服务器维护中";
			case 1203:
				return "感谢您的配合";
			case 1204:
				return "获取充值渠道失败";
			case 1300:
				return "绑定的上线不存在";
			case 1301:
				return "已经绑定了上线";
			case 1302:
				return "不能绑定自己的下线用户";
			case 1303:
				return "找不到下线用户";
			case 1304:
				return "不能绑定普通玩家为上级代理";
			case 1305:
				return "未查询到对应玩家信息，请核对玩家ID或手机号";
			case 1306:
				return "玩家没有绑定代理";
			case 1307:
				return "玩家不能绑定自己为上级代理";
			case 2020:
				return "百人，下注已结束";
			case 2021:
				return "百人，座位上已有玩家";
			case 2022:
				return "百人，玩家不在座位上";
			case 2023:
				return "百人，庄家不可下注";
			case 2024:
				return "游戏过程中，不可操作";
			case 2400:
				return "兑换码不存";
			case 2401:
				return "该服务器不能使用此兑换码";
			case 2402:
				return "已经使用过此兑换码";
			case 2403:
				return "活动超时";
			case 2404:
				return "活动未完成";
			case 2405:
				return "奖励已经领取";
			case 2406:
				return "活动领取次数上限";
			case 2407:
				return "已经购买过开服基金";
			case 2408:
				return "没有购买开服基金";
			case 2409:
				return "已经使用过同类型的兑换码";
			case 2410:
				return "激活码超时";
			case 2500:
				return "渠道验证在try模块中出错";
			case 2501:
				return "渠道验证地址错误";
			case 2502:
				return "渠道验证参数错误";
			case 2503:
				return "渠道验证失败";
			case 2504:
				return "充值验证失败";
			case 2505:
				return "订单请求失败";
			case 2506:
				return "生成sign失败";
			case 2507:
				return "金额不足";
			case 2508:
				return "支付失败";
			case 2509:
				return "退款成功";
			case 2510:
				return "退款失败";
			case 2511:
				return "查询失败";
			case 2580:
				return "创建顶级代理玩家失败，该玩家不存在";
			case 2581:
				return "创建顶级代理玩家失败，该玩家已经是顶级代理";
			case 2582:
				return "删除顶级代理玩家失败，该玩家不是顶级代理";
			case 2583:
				return "查询条件为空";
			case 2584:
				return "上级代理玩家不存在";
			case 2585:
				return "查询下级代理的查询条件错误";
			case 2586:
				return "玩家已经被封号";
			case 2587:
				return "玩家已经被解封";
			case 2588:
				return "该IP已经被加入白名单";
			case 2589:
				return "该IP已经从白名单移除";
			case 2590:
				return "玩家已经是分销商";
			case 2591:
				return "分销商玩家状态错误";
			case 2592:
				return "只有绑定顶级代理为直属上级的玩家才能成为分销商";
			case 2593:
				return "可提现金额需大于100元才能提现";
			case 2594:
				return "该账号无法登陆，请在游戏内绑定邀请人后再试";
			case 2595:
				return "玩家折扣信息设置的过期时间不能早于当前时间";
			case 2596:
				return "玩家折扣信息的设置时间不能与其他已经生效或者将会生效的折扣设置重叠";
			case 2597:
				return "该玩家不是代理用户";
			case 2598:
				return "该玩家不是分销商";
			case 2599:
				return "微信提现的玩家必须关注微信公众号";
			case 2600:
				return "商户未授权或没有开通API接口";
			case 2601:
				return "签名验证错误";
			case 2602:
				return "数据解密错误";
			case 2603:
				return "时间戳过期";
			case 2604:
				return "输入参数验证错误";
			case 2605:
				return "银行返回的具体错误描述";
			case 2606:
				return "风险控制错误";
			case 2607:
				return "授权过期";
			case 2608:
				return "限制错误";
			case 2609:
				return "商户账户资金不足，账户金额不足以支持此次批付";
			case 2610:
				return "单据号已经存在，调用查询接口确认订单状态";
			case 2611:
				return "未知错误，调用查询接口确认订单状态";
			case 2612:
				return "初级分销商用户的ID必须为玩家ID且该玩家必须为代理用户";
			case 2613:
				return "玩家Id不能为空";
			case 2614:
				return "查询日期不能为空";
			case 2615:
				return "顶级代理不能绑定其他玩家为上级";
			case 3000:
				return " 任务未完成";
			case 3001:
				return " 已经领取过";
			case 3002:
				return " 任务不存在";
			case 3003:
				return " 奖励不存在";
			case 3010:
				return " 房卡不足";
			case 3011:
				return " 兑换券不足";
			case 3012:
				return " 兑换消耗物品不存在";
			case 3013:
				return " 兑换物品不存在";
			case 3014:
				return " 兑换ID不存在";
			case 5000:
				return "认证失败";
			case 5001:
				return "服务器出错";
			case 5002:
				return "玩家不存在";
			case 5003:
				return "金额不足";
			case 5004:
				return "等级超出范围";
			case 5005:
				return "账号密码错误";
			case 5006:
				return "服务器id已经存在";
			case 5007:
				return "登入服务器操作失败";
			case 5008:
				return "公告不存在";
			case 5009:
				return "公告已经存在";
			case 5010:
				return "服务器id不存在";
			case 5011:
				return "缺少时间";
			case 5012:
				return "用户已经存在";
			case 5013:
				return "用户已经存在";
			case 5014:
				return "充值服务器操作失败";
			case 5015:
				return "输入格式错误";
			case 5016:
				return "公会不存在";
			case 5017:
				return "锁定账号不正确";
			case 5018:
				return "解锁账号不正确";
			case 5019:
				return "订单状态不能变更";
			case 5020:
				return "已经提出了申请";
			case 5021:
				return "订单号重复";
			case 5022:
				return "低于最小金额";
			case 5023:
				return "已经添加";
			case 5024:
				return "跑马灯不存在";
			case 6000:
				return "重复签到";
			case 6001:
				return "重复领取签到奖励";
			case 6002:
				return "签到天数不足";
			case 6003:
				return "重复领取活跃度奖励";
			case 6004:
				return "活跃度不足";
			case 6005:
				return "领取破产补助未到时间";
			case 7000:
				return "红包广场猜错数量";
			case 7001:
				return "发红包VIP等级不够";
			case 7002:
				return "发好友红包VIP等级不够";
			case 7003:
				return "发红包超出身上的元宝，最低要求2000";
			case 7004:
				return "发红包超出限制的元宝范围";
			case 7005:
				return "发红包超出数量";
			case 50200:
				return "缺少玩家ID";
			case 50201:
				return "请填写提现金额";
			case 50211:
				return "缺少玩家名字";
			case 50212:
				return "您的提现金额将于24小时之内到账，请及时查收";
			case 50222:
				return "缺少玩家名字或ID";
			case 50223:
				return "不要着急，管理员正在卖命审核您的账号";
			case 50233:
				return "请输入充值金额";
			case 50234:
				return "您的账号已通过审核";
			case 50235:
				return "请输入100的整数倍";
			case 50244:
				return "您的申请未能通过管理员的审核，请提交正确的个人资料";
			case 50245:
				return "超出最大充值金额";
			case 51000:
				return "下级代理绑定失败";
			case 10000:
				return "异步处理消息,服务器内部使用,协调GameServer 与 BattleServer行为的特殊错误码";
			case 10001:
				return "转发消息,服务器内部使用,协调GameServer 与 BattleServer行为的特殊错误码";
			default:
				return "未知错误";
		}
	},

	codeToString(code) {
		switch(code) {
			case 0:
				return "OK";
			case 1:
				return "DefaultError";
			case 10:
				return "PermissionDenied";
			case 100:
				return "CantOpenAddress";
			case 1000:
				return "BadRequest";
			case 1001:
				return "ServerException";
			case 1002:
				return "TimeOut";
			case 1003:
				return "Disconnect";
			case 1004:
				return "MessageError";
			case 1005:
				return "RequestParaError";
			case 1006:
				return "ServerDataError";
			case 1007:
				return "ServerClosed";
			case 1008:
				return "ServerOnlineCountMax";
			case 1009:
				return "ServerAllCountMax";
			case 1010:
				return "ServerUserIsGolden";
			case 1011:
				return "ServerPhoneIsGolden";
			case 1100:
				return "ConditionNotMeet";
			case 1101:
				return "UserAlreadyExist";
			case 1102:
				return "AccountOrPwdError";
			case 1103:
				return "PlayerNotCreate";
			case 1104:
				return "NameUsed";
			case 1105:
				return "NameLengthMax";
			case 1106:
				return "NameErrorCode";
			case 1107:
				return "GuildNameLengthMax";
			case 1108:
				return "GuildManifestoLengthMax";
			case 1109:
				return "BeBaned";
			case 1110:
				return "ContainSensitiveWord";
			case 1111:
				return "VersionLimit";
			case 1112:
				return "LackMoney";
			case 1113:
				return "RoomIsFull";
			case 1114:
				return "LackRobot";
			case 1115:
				return "RoomNotFount";
			case 1116:
				return "InfoNotExist";
			case 1117:
				return "NoneToGet";
			case 1118:
				return "PasswordError";
			case 1119:
				return "SMSCodeError";
			case 1120:
				return "SMSCodeTimeOut";
			case 1121:
				return "UserNotExist";
			case 1122:
				return "SMSCodeSendError";
			case 1123:
				return "PhoneUsed";
			case 1124:
				return "PlayerNotExist";
			case 1125:
				return "RoomNotExist";
			case 1126:
				return "PlayerExist";
			case 1127:
				return "OperationTooOften";
			case 1128:
				return "PhoneNotExist";
			case 1129:
				return "PlayerInRoom";
			case 1130:
				return "MailNotExist";
			case 1131:
				return "MailNoAward";
			case 1132:
				return "SBInRoom";
			case 1133:
				return "HTTPError";
			case 1134:
				return "IDCardError";
			case 1135:
				return "LackYuanbao";
			case 1136:
				return "LackGold";
			case 1137:
				return "LackDiamond";
			case 1138:
				return "LackRemedySignCard";
			case 1139:
				return "LackNameCard";
			case 1140:
				return "DifenOutOfRange";
			case 1141:
				return "LimitNotMatchDifen";
			case 1142:
				return "PlayerRemainAtRoom";
			case 1143:
				return "RoomNotSuit";
			case 1144:
				return "LackVip";
			case 1145:
				return "PlayerLockToDo";
			case 1146:
				return "LackBankYuanbao";
			case 1147:
				return "BankLock";
			case 1160:
				return "FriendMax";
			case 1161:
				return "PeerOffline";
			case 1162:
				return "LackYuanbaoByUseInterEmoj";
			case 1163:
				return "LackGoldByUseInterEmoj";
			case 1164:
				return "PhoneNumberError";
			case 1165:
				return "CantJoinNewbie";
			case 1200:
				return "RechargeGetTransitFail";
			case 1201:
				return "RechargeQRFail";
			case 1202:
				return "RechargeServerClose";
			case 1203:
				return "RechargeHelp";
			case 1204:
				return "GetServerRechargeChannelFailed";
			case 1300:
				return "BindAgentNotExist";
			case 1301:
				return "BindAgentAlready";
			case 1302:
				return "CantBindChild";
			case 1303:
				return "CantFindChild";
			case 1304:
				return "CannotBindNormalPlayer";
			case 1305:
				return "QueryPlayerInfoFailed";
			case 1306:
				return "HaveNoAgent";
			case 1307:
				return "PlayerCannotBindHimself";
			case 2020:
				return "BRChipinEnd";
			case 2021:
				return "BRSeatBeTaken";
			case 2022:
				return "BRNotInSeat";
			case 2023:
				return "BRBankerCantChipin";
			case 2024:
				return "BRNotValidInGamePlaying";
			case 2400:
				return "ActivityCodeError";
			case 2401:
				return "ActivityCodeServerError";
			case 2402:
				return "ActivityCodeUsed";
			case 2403:
				return "ActivityOvertime";
			case 2404:
				return "ActivityNotCompleted";
			case 2405:
				return "ActivityUsed";
			case 2406:
				return "ActivityTimesMax";
			case 2407:
				return "ActivityHasOpenFund";
			case 2408:
				return "ActivityNotHasOpenFund";
			case 2409:
				return "ActivityCodeTypeUsed";
			case 2410:
				return "ActivityCodeOverTime";
			case 2500:
				return "PlatformLoginCheckTryError";
			case 2501:
				return "PlatformLoginCheckUrlError";
			case 2502:
				return "PlatformLoginCheckParError";
			case 2503:
				return "PlatformLoginCheckFail";
			case 2504:
				return "PlatformRechargeCheckFail";
			case 2505:
				return "PlatformOrderCheckFail";
			case 2506:
				return "PlatformRechargeSignFail";
			case 2507:
				return "PlatformRechargeLackMoney";
			case 2508:
				return "PlatformRechargePayFail";
			case 2509:
				return "PlatformRechargeCancelPayOK";
			case 2510:
				return "PlatformRechargeCancelPayFail";
			case 2511:
				return "PlatformRechargeQueryFail";
			case 2580:
				return "SuperAgentOperateErrorPlayerNotExist";
			case 2581:
				return "SuperAgentCreateErrorPlayerAlreadySuper";
			case 2582:
				return "SuperAgentDeleteErrorPlayerNotSuper";
			case 2583:
				return "GMQueryConditionNull";
			case 2584:
				return "ParentAgentNotExist";
			case 2585:
				return "QueryConditionError";
			case 2586:
				return "PlayerAlreadyBaned";
			case 2587:
				return "PlayerAlreadyDisbaned";
			case 2588:
				return "IPAlreadyInWhiteList";
			case 2589:
				return "IPAlreadyDeletedFromWhiteList";
			case 2590:
				return "PlayerAlreadyBeDistributorUser";
			case 2591:
				return "DistributorUserStateError";
			case 2592:
				return "OnlyBindSuperAgentAllowedToBeDistributor";
			case 2593:
				return "WithdrawAmountNotAllowed";
			case 2594:
				return "UserAccountCannotLogin";
			case 2595:
				return "DiscountExpireTimeCannotEarlyThanNow";
			case 2596:
				return "DiscountProceedTimeCannotOverlapWithOthers";
			case 2597:
				return "PlayerIsNotAgentUser";
			case 2598:
				return "PlayerIsNotDistributor";
			case 2599:
				return "WechatWithdrawMustSubscribe";
			case 2600:
				return "WithdrawOrderApproveErrorE100";
			case 2601:
				return "WithdrawOrderApproveErrorE101";
			case 2602:
				return "WithdrawOrderApproveErrorE102";
			case 2603:
				return "WithdrawOrderApproveErrorE103";
			case 2604:
				return "WithdrawOrderApproveErrorE104";
			case 2605:
				return "WithdrawOrderApproveErrorE105";
			case 2606:
				return "WithdrawOrderApproveErrorE106";
			case 2607:
				return "WithdrawOrderApproveErrorE107";
			case 2608:
				return "WithdrawOrderApproveErrorE108";
			case 2609:
				return "WithdrawOrderApproveErrorE109";
			case 2610:
				return "WithdrawOrderApproveErrorE110";
			case 2611:
				return "WithdrawOrderApproveErrorU999";
			case 2612:
				return "JuniorMarketingMustBeAgentUser";
			case 2613:
				return "PlayerIdCanNotBeNull";
			case 2614:
				return "QueryDateCanNotBeNull";
			case 2615:
				return "SuperAgentCannotBindToOthers";
			case 3000:
				return "TaskNotFinish";
			case 3001:
				return "TaskRewardRepeat";
			case 3002:
				return "TaskNoTask";
			case 3003:
				return "TaskNoReward";
			case 3010:
				return "LotteryNoDiamond";
			case 3011:
				return "ConvertNoLottery";
			case 3012:
				return "ConvertNoCost";
			case 3013:
				return "ConvertNoAward";
			case 3014:
				return "ConvertNoConv";
			case 5000:
				return "GMAuthenticationFail";
			case 5001:
				return "GMServerError";
			case 5002:
				return "GMPlayerNotExist";
			case 5003:
				return "GMLackCurrency";
			case 5004:
				return "GMLevelOutOfRange";
			case 5005:
				return "GMAccountOrPwdError";
			case 5006:
				return "GMServerIdExist";
			case 5007:
				return "GMLoginServerError";
			case 5008:
				return "GMNoticeNotExist";
			case 5009:
				return "GMNoticeExist";
			case 5010:
				return "GMServerIdNotExist";
			case 5011:
				return "GMLackDate";
			case 5012:
				return "GMUserExist";
			case 5013:
				return "GMUserNotExist";
			case 5014:
				return "GMRechargeServerError";
			case 5015:
				return "GMFormatError";
			case 5016:
				return "GMGuildNotExist";
			case 5017:
				return "GMOrderLockAccountError";
			case 5018:
				return "GMOrderUnlockAccountError";
			case 5019:
				return "GMOrderStatusError";
			case 5020:
				return "GMSVIPAlreadyApplied";
			case 5021:
				return "GMSVIPRechargeRepeat";
			case 5022:
				return "GMSVIPRechargeMin";
			case 5023:
				return "GMAlreadyAdd";
			case 5024:
				return "GMBoardCastNotExist";
			case 6000:
				return "ActivityRepeatSign";
			case 6001:
				return "ActivityRepeatGetSignReward";
			case 6002:
				return "ActivityGetSignRewardLackOfDay";
			case 6003:
				return "ActivityRepeatGetVitalityReward";
			case 6004:
				return "ActivityGetVitalityRewardLackOfVitality";
			case 6005:
				return "ActivityGetDailySafeguardNotNow";
			case 7000:
				return "HongbagGuessError";
			case 7001:
				return "HongbagLackVip";
			case 7002:
				return "HongbagFriendLackVip";
			case 7003:
				return "HongbagOutofYuanbaoSelf";
			case 7004:
				return "HongbagOutofRange";
			case 7005:
				return "HongbagOutofNum";
			case 50200:
				return "GMXXX50200";
			case 50201:
				return "GMXXX50201";
			case 50211:
				return "GMXXX50211";
			case 50212:
				return "GMXXX50212";
			case 50222:
				return "GMXXX50222";
			case 50223:
				return "GMXXX50223";
			case 50233:
				return "GMXXX50233";
			case 50234:
				return "GMXXX50234";
			case 50235:
				return "GMXXX50235";
			case 50244:
				return "GMXXX50244";
			case 50245:
				return "GMXXX50245";
			case 51000:
				return "GMAgentBindError";
			case 10000:
				return "AsyncResponse";
			case 10001:
				return "RelayResponse";
			default:
				return "null";
		}
	}
}

