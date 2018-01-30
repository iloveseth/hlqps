import { hxdt } from "../HXDT";

export let setting_comn = 
{
    review:         false,
    os :            null,
    deviceId:       null,
    debugServerId:  null,
    gameVersion :   null,
    platformId:     null,
    packageId:      null,
    isWebVersion:   null,
    resVersion:     null,

    requestMap :    null,

    clientTimeout:  60000,//60秒 1分钟,//客户端超时时间

    protoFile : "AllProto.proto",
    assetPath : {
        prefab: 'art/prefab/',
        atlas: 'art/texture/',
        uiaudio: 'audio/ui/',
        audio: 'audio/',
        config: 'data/config/',
        setting: 'data/setting/',
        l10n: 'data/l10n/',
    },
    atlases:[
        //指登录之后用到的资源，即大厅和房间内两部分

        //1, 通用部分（大厅和房间内共有）
        'comn_item',//comn_item
        'comn_com',//comn_com
        

        //2, 大厅部分（独有）
        'lobby_main',
        'lobby_main2',
        'lobby_room',
        'lobby_room2',
        'lobby_activity_mission',
        'lobby_activity_mission2',//lobby_activity_mission
        'lobby_setting',
        'lobby_shop',
        'lobby_shop2',
        'lobby_mail_rank_redpack',
        'lobby_mail_rank_redpack2',//lobby_mail_rank_redpack
        'lobby_invte_detail_bankruptcy',//大小写注意一下

        //3, 房间内部分（独有）
        //战斗
        'battle_main',//battle_main
        'battle_main2',
        'battle_cards',//battle_card
        'battle_scores',//battle_score
        
        //机器人图标
        // 'avatars_1',
        // 'avatars_2',
        // 'avatars_3',
        // 'avatars_4',
        // 'avatars_5',

        // 'effect',
        // 'expression'
    ],

    //背景音乐枚举
    Enum_BGMId : cc.Enum({
        Lobby:1,//hall_bg
        Battle_PinShi:2,//pinshi_bg

        Lobby_CN:5,
        Battle_PinShi_Cn:6,
    }),

    //音乐风格
    Enum_BGMStyleIdx : cc.Enum({
        Cn:1,
        Jazz:2,
    }),


    //Version//////////////////////////////////////////////////////////////////////////////////////////////////
    // // 服务发现url
    // // var url = 'http://testlogin.hx-game.com:35554/rest/user/serverInfo/';
    // url : 'http://review.jzsddh.com:35554/rest/user/serverInfo/',
    // gameType : "baccarat",
    // platformID : "COMMON",//平台id//OS
    // packageID : "BLACK",//包id
    // version : "1.0.0",
    // debugServerID : '',//C01, C02
    // deviceId: '',//设备号
    // OS : "COMMON",
    GetServerUrl4WebVer (){
        return hxdt.setting_webVersion.GetServerUrl();
    },
    
    GetDebugServerId(){
        return this.debugServerId;
        //return this.IsWebVersion() ? hxdt.setting_webVersion.GetDebugServerId():hxfn.bridge.GetDebugServerId();
    },
    
    GetDeviceId (){
        return this.deviceId;
        //return this.IsWebVersion() ? hxdt.setting_webVersion.GetDeviceId():hxfn.bridge.GetDeviceId();
    },
    GetGameVersion(){
        return this.gameVersion;
        //return this.IsWebVersion() ? hxdt.setting_webVersion.GetGameVersion():hxfn.bridge.GetGameVersion();
    },
    GetResVersion(){
        return this.resVersion;
    },
    GetPlatformId(){
        return this.platformId;
        //return this.IsWebVersion() ? hxdt.setting_webVersion.GetPlatformId():hxfn.bridge.GetPlatformId();
    },
    GetPackageId(){
        return this.packageId;
        //return this.IsWebVersion() ? hxdt.setting_webVersion.GetPackageId():hxfn.bridge.GetPackageId();
    },
    GetOS () {
        return this.OS;
        //return this.IsWebVersion() ? hxdt.setting_webVersion.GetOS():hxfn.bridge.GetOS();
    },

    GetType () {
        return this.type;
        //return this.IsWebVersion() ? hxdt.setting_webVersion.GetType() : hxfn.bridge.GetType();
    },

    GetRechargePlatformId () {
        return 'Any';//测试 充值渠道(iOS, Wechat, Any)
    },

    // 需要移到 fn_setting 
    IsWebVersion(){
        if('jsb' in window){
            return false;
        }
        else{
            return true;
        }
    },

    GetGameInform(){
        this.isWebVersion = this.IsWebVersion();
        this.type = hxdt.setting_webVersion.GetType();
        this.OS = this.isWebVersion ? hxdt.setting_webVersion.GetOS():hxfn.bridge.GetOS();
        this.platformId = this.isWebVersion ? hxdt.setting_webVersion.GetPlatformId():hxfn.bridge.GetPlatformId();
        this.gameVersion = this.isWebVersion ? hxdt.setting_webVersion.GetGameVersion():hxfn.bridge.GetGameVersion();
        this.resVersion = this.isWebVersion ? hxdt.setting_webVersion.GetResVersion() : hxfn.bridge.GetResVersion();
        this.packageId = this.isWebVersion ? hxdt.setting_webVersion.GetPackageId():hxfn.bridge.GetPackageId();
        this.deviceId = this.isWebVersion ? hxdt.setting_webVersion.GetDeviceId():hxfn.bridge.GetDeviceId();
        this.debugServerId = this.isWebVersion ? hxdt.setting_webVersion.GetDebugServerId():hxfn.bridge.GetDebugServerId();
    },

    LogGameInform(){
        hxfn.bridge.PrintLog('isWebVersion:' + this.isWebVersion);
        hxfn.bridge.PrintLog('type:' + this.type);
        hxfn.bridge.PrintLog('OS:' + this.OS);
        hxfn.bridge.PrintLog('platformId:' + this.platformId);
        hxfn.bridge.PrintLog('gameVersion:' + this.gameVersion);
        hxfn.bridge.PrintLog('packageId:' + this.packageId);
        hxfn.bridge.PrintLog('deviceId:' + this.deviceId);
        hxfn.bridge.PrintLog('debugServerId:' + this.debugServerId);
    },

    ResetRequestMap(){
        this.requestMap = new Map();
    },

    GetClientTimeout(){
        return this.clientTimeout;//通信延时超过n秒，即断开连接
    },

    OnInit(){
        //this.review = true;
        this.GetGameInform();
        this.LogGameInform();
        this.ResetRequestMap();
    },

    CloseTimeout(){
        this.timeout = false;
    },
    
    // isOL:false,
    
    isTest:false,
    
    gameType: 0,
    // isUseNet: true,//为了在不使用网络请求的情况下实现功能

    
}

