import { hxfn } from "./HXFN";
import { login, LoginInfo, LoginWay } from "./Fn_Login";
import {hxjs} from "../../HXJS/HXJS";

//这个脚本处理js和Java之间的相互调用

export let bridge = {
    // @property({type:[cc.Label]})
    // private counts: cc.Label[] = [];

    needShutImage : true,

    classPath: null,

    shareErrcode: null,

    shareType: null,

    OnInit(){
        this.needShutImage = true;
        this.classPath = 'org/cocos2dx/javascript/AppActivity';
        //var wxAppId = "wx0087fb14de7435ad";
        //hxfn.bridge.RegToWx(wxAppId)
    },

    //wechat step 3, SDK回调JS
    SendWxLoginReq(info){
        var loginInfo = new LoginInfo();
        loginInfo.channel = LoginWay.WECHAT;
        loginInfo.wx.token = info;
        loginInfo.wx.refreshToken = "";

        hxfn.login.lTryLogin4WC(loginInfo);
    },


    //获取新人好礼&分享活动
    // message ShareSuccessResp {
    // required int32 ShareGiveYuanBaoNum = 1;//领取元宝
    // required int32 resultCode = 2;//返回码
//}

    WXShareCallback(errCode){
        this.shareErrcode = errCode;
        cc.log('WXShareCallback:' + errCode.toString());
        // if(hxfn.bridge.shareErrcode == 0 && hxfn.lobby.activityMsg && hxfn.lobby.activityMsg.sharereward && hxfn.lobby.activityMsg.shareGiveYuanBaoNum > 0) {
        //     cc.log('Send:Msg_NewPlayerAndShareReward');
        //     hxfn.bridge.shareErrcode = null;
        //     hxfn.msg.Req_Comn(
        //         {
        //             rewardName: 'share',
        //         },
        //         hxfn.msg.Msg_NewPlayerAndShareReward,
        //         (msg) => {
        //             if(msg.resultCode == 0 && msg.giveYuanBaoNum > 0){
        //                 //window.setTimeout(()=>{
        //                 hxjs.module.ui.hub.LoadTipFloat('分享有礼已经发到您的邮箱，请注意查收哦');
        //                 //},500);
        //             }
        //         }
        //     )
        // }
    },

    payCallBackiOS(receiptData){
        hxfn.shop.SendRechargeOrderResult(receiptData);
    },

    payFailedCallBackiOS(){
        hxjs.module.ui.hub.HideWaitinsssgUI ();
        
        hxjs.module.ui.hub.LoadDlg_Info('商品订单处理不成功', '提示');
        hxfn.shop.isStartCharging = false;
    },
    
    //JS调用壳函数
    //wechat step 2
    LoginByWx(){
        cc.log(hxfn.bridge.classPath);
        if('jsb' in window){
            if(cc.sys.os == cc.sys.OS_IOS ){
                jsb.reflection.callStaticMethod("AppController", 'loginByWx');
            }
            else if((cc.sys.os == cc.sys.OS_ANDROID )){
                jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'loginByWx','()V');
            }  
        } 
    },

    //extern "C" void WXShareText(int session,const char * content)
    WXShareText(session,content){
        try{
            cc.log('WXShareText');
            if('jsb' in window){
                if(cc.sys.os == cc.sys.OS_IOS ){
                    jsb.reflection.callStaticMethod("AppController", 'WXShareText:content:',session,content);
                }
                else if((cc.sys.os == cc.sys.OS_ANDROID )){
                    jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'WXShareText','(ILjava/lang/String;)V');
                }  
            }
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
        }
    },

    //+ (void) WXShareImage:(int)session resPath:(NSString*)resPath
    WXShareImage(session,resPath){
        cc.log('WXShareImage');
        try{
            if('jsb' in window){
                if(cc.sys.os == cc.sys.OS_IOS ){
                    jsb.reflection.callStaticMethod("AppController", 'WXShareImage:resPath:',session,resPath);
                }
                else if((cc.sys.os == cc.sys.OS_ANDROID )){
                    jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'WXShareImage','(ILjava/lang/String;)V',session,resPath);
                }  
            }
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
        }
    },

    WXShareWeb(session,title,content,webpageUrl,resPath){
        cc.log('WXShareWeb');
        try{
            if('jsb' in window){
                if(cc.sys.os == cc.sys.OS_IOS ){
                    jsb.reflection.callStaticMethod("AppController", 'WXShareWeb:title:content:webpageUrl:resPath:',session,title,content,webpageUrl,resPath);
                }
                else if((cc.sys.os == cc.sys.OS_ANDROID )){
                    jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'WXShareWeb','(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V',session,title,content,webpageUrl,resPath);
                }  
            }
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
        }
    },

    PayIOS(item){
        if('jsb' in window){
            if(cc.sys.os == cc.sys.OS_IOS ){
                jsb.reflection.callStaticMethod("AppController", 'payIng:',item);
            }
        } 
    },

    //录音相关
    StartRecord(){
        cc.log('StartRecord');
        try{
            if ('jsb' in window) {
                if(cc.sys.os == cc.sys.OS_IOS )
                {
                    return jsb.reflection.callStaticMethod("AppController", 'startRecord');
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    return jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'startRecord','()Z');
                }
            }
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
        }
    },

    StopRecord(){
        cc.log('StopRecord');
        try{
            if ('jsb' in window) {
                if(cc.sys.os == cc.sys.OS_IOS )
                {
                    return jsb.reflection.callStaticMethod("AppController", 'stopRecord');
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'stopRecord','()Z');
                }
            }
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
        }  
    },

    PlayRecord(fileID){
        cc.log('PlayRecord');
        try{
            if ('jsb' in window) {
                if(cc.sys.os == cc.sys.OS_IOS )
                {
                    jsb.reflection.callStaticMethod("AppController", 'playRecord:',fileID);
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'playRecord','(Ljava/lang/String;)Z',fileID);
                }
            }
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
        }
    },
    DownloadRecord(fileID){
        cc.log('DownloadRecord');
        try{
            if ('jsb' in window) {
                if(cc.sys.os == cc.sys.OS_IOS )
                {
                    jsb.reflection.callStaticMethod("AppController", 'downloadRecord:',fileID);
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'downloadRecord','(Ljava/lang/String;)Z',fileID);
                }
            }
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
        }
    },
    onPlayerLoginSuccess(playerID){
        cc.log('onPlayerLoginSuccess');
        try{
            if ('jsb' in window) {
                if(cc.sys.os == cc.sys.OS_IOS )
                {
                    return jsb.reflection.callStaticMethod("AppController", 'onPlayerLoginSuccess:',playerID);
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    return jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'onPlayerLoginSuccess','(Ljava/lang/String;)V',playerID);
                }
            }
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
        }
    },

    OpenUrl(url){
        cc.log('openurl');
        try{
            if ('jsb' in window) {
                if(cc.sys.os == cc.sys.OS_IOS )
                {
                    //return jsb.reflection.callStaticMethod("AppController", 'onPlayerLoginSuccess:',playerID);
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    // return jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'openUrl','(Ljava/lang/String;)V',url);
                    jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'openUrl','(Ljava/lang/String;)V',url);
                }
            }
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
        }
    },
 
     
    OnRecordUploadSuccess(data){
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-RecordUploadSuccess', data);
        hxfn.battle.OnRecordUploadSuccess(data);
    },
    OnRecordDownloadSuccess(data){
        // hxjs.util.Notifier.emit('[NiuNiu]_BattleModle-RecordDownloadSuccess', data); 
        hxfn.battle.OnRecordDownloadSuccess(data);
    },
    GetServerInfo(){
        if('hx' in window && 'jsb' in window){
            return hx.Client.getSingleton().getServerInfoString();            
        }
        return '';
    },

    
    IsNetAvailable(){
        if('hx' in window && 'jsb' in window){
            return hx.Client.getSingleton().getIsNetAvailable();
        }
        else{
            return true;
        }  
    },
    
    GetOS(){   
        if('hx' in window && 'jsb' in window){
            return hx.Client.getSingleton().getOSTag();            
        }
        return '';
    },

    GetPlatformId(){
        if('hx' in window && 'jsb' in window){
            return hx.Client.getSingleton().getPlatformId();            
        }
        return '';
    },

    GetGameVersion(){
        if('hx' in window && 'jsb' in window){
            return hx.Client.getSingleton().getGameVersion();            
        }
        return '';
    },

    GetResVersion(){
        if('jsb' in window){
            var resPath = jsb.fileUtils.getWritablePath() + "patch/project.manifest";
            if(!jsb.fileUtils.isFileExist(resPath)){
                resPath = 'project.manifest';
            }
            var resStr = jsb.fileUtils.getStringFromFile(resPath);
            cc.log(resStr);
            var jsonObj = JSON.parse(resStr);
            return jsonObj.version;
        }
        return '';
    },

    GetPackageId(){
        if('hx' in window && 'jsb' in window){
            return hx.Client.getSingleton().getPackageId();            
        } 
        return '';
    },

    GetDeviceId(){
        if('jsb' in window){
            if(cc.sys.os == cc.sys.OS_IOS )
            {
                return jsb.reflection.callStaticMethod("AppController", 'getDeviceId');
            }
            else if(cc.sys.os == cc.sys.OS_ANDROID )
            {
                return jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'getDeviceId','()Ljava/lang/String;');
            }
        }
        return '';
    },

    GetDebugServerId(){
        if('jsb' in window){
            if(cc.sys.os == cc.sys.OS_IOS )
            {
                return jsb.reflection.callStaticMethod("AppController", 'getDebugServerId');
            }
            else if(cc.sys.os == cc.sys.OS_ANDROID )
            {
                return jsb.reflection.callStaticMethod(hxfn.bridge.classPath, 'getDebugServerId','()Ljava/lang/String;');
            }
        }
        return '';
    },

    PrintLog(msg){
        cc.log(msg);
    },

    GetUrl(){
        cc.log('geturl');
        try{
            if('jsb' in window){
                if(cc.sys.os == cc.sys.OS_IOS )
                {
                    return jsb.reflection.callStaticMethod("AppController", 'getUrl');
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    return jsb.reflection.callStaticMethod(hxfn.bridge.classPath,'getUrl','()Ljava/lang/String;');
                }
            }
            return '';
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
            return '';
        }
    },

    //获取电量0到100
    GetBattery(){
        cc.log('GetBattery');
        try{
            if('jsb' in window){
                if(cc.sys.os == cc.sys.OS_IOS )
                { 
                    return jsb.reflection.callStaticMethod("AppController", 'getBattery');
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    return jsb.reflection.callStaticMethod(hxfn.bridge.classPath,'getBattery','()I');
                }
            }
            return -100;
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
            return -100;
        }
        //return -100;
    },
    //获取网络状态  >=0 <4 wifi  -1  4G  -2 3G   -3 LTG 
    GetNetState(){
        cc.log('GetNetState');
        try{
            if('jsb' in window){
                if(cc.sys.os == cc.sys.OS_IOS )
                {
                    //return -100;
                    return jsb.reflection.callStaticMethod("AppController", 'getNetState');
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    return jsb.reflection.callStaticMethod(hxfn.bridge.classPath,'getNetState','()I');
                }
            }
            return -100; 
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
            return -100;
        }

        //return 2;//wifiLevel 0-3 ,-1为4G
    },

    //获取剪切板内容
    GetPasteBoardContent(){
        cc.log('GetPasteBoardContent');
        try{
            if('jsb' in window){
                if(cc.sys.os == cc.sys.OS_IOS )
                {
                    return jsb.reflection.callStaticMethod("AppController", 'getPasteBoardContent');
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    return jsb.reflection.callStaticMethod(hxfn.bridge.classPath,'getPasteBoardContent','()Ljava/lang/String;');
                }
            } 

            return "";
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
            return '';
        }
    },

    //设置剪切板
    SetPasteBoardContent(data){
        cc.log('SetPasteBoardContent');
        try{
            if('jsb' in window){
                if(cc.sys.os == cc.sys.OS_IOS )
                {
                    jsb.reflection.callStaticMethod("AppController", 'setPasteBoardContent:',data);
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    jsb.reflection.callStaticMethod(hxfn.bridge.classPath,'setPasteBoardContent','(Ljava/lang/String;)V',data);
                }
            }
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
        }  
    },

    RegToWx(wxAppId){
        cc.log('RegToWx');
        try{
            if('jsb' in window){
                if(cc.sys.os == cc.sys.OS_IOS )
                {
                    jsb.reflection.callStaticMethod("AppController", 'regToWx:',wxAppId);
                }
                else if(cc.sys.os == cc.sys.OS_ANDROID )
                {
                    jsb.reflection.callStaticMethod(hxfn.bridge.classPath,'regToWx','(Ljava/lang/String;)V',wxAppId);
                }
            }
        }catch(err){
            cc.log("错误名称: " + err.name+" ---> ");
            cc.log("错误信息: " + err.message+" ---> ");
        }
    },
}