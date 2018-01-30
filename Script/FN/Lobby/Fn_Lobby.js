import { hxdt } from "../../DT/HXDT";
import { hxfn } from "./../HXFN";
import { hxjs } from "../../../HXJS/HXJS";

export let lobby = 
{
    //==============================================================
    //当前场景所需要的基础显示数据
    allPlayerCount:0,
    allGameplays:[],
    //==============================================================

    //请求跑马灯（广播）信息
    uiloop:null,
    broadcastinfos:null,

    cacheLeaveBattleReason:null,

    activityMsg: null,

    needPop: true,

    //==============================================================
    // OnInit() {
    // },
    
    OnStart(){
        this.HandleServerInfo(true);

        this.OnReset();
        //预加载图集
        hxjs.module.asset.PreloadAtlases(hxdt.setting_comn.atlases);
        if(this.activityMsg){
            hxjs.util.Notifier.emit('NewActivity',true);
        }
        if(!this.needPop){
            return;
        }
        this.needPop = false;
        //window.setTimeout(()=>{
        hxfn.msg.Req_Comn(
            {},
            hxfn.msg.Msg_NewPlayerAndShareActivity,
            function(msg){
                if(msg.resultCode == 0){
                    this.activityMsg = msg;
                    if(!msg){
                        return;
                    }
                    hxjs.util.Notifier.emit('NewActivity',true);
                    if(msg.newPlayerreward && msg.newPlayerGiveYuanBaoNum > 0){
                        hxjs.module.ui.hub.LoadDlg_Check(
                            '活动期间，新人首次登录，赠送%0元宝。祝你人旺财旺手气旺'.replace(/%0/,msg.newPlayerGiveYuanBaoNum.toString()),
                            ()=>{
                                //先发起领新用户元宝请求，然后等到回应之后再判断分享奖励
                                hxfn.msg.Req_Comn(
                                    {
                                        activityId:this.activityMsg.activityId,
                                        rewardName:'newPlayer',
                                    },
                                    hxfn.msg.Msg_NewPlayerAndShareReward,
                                    function(msg1){
                                        window.setTimeout(()=>{
                                            if(this.activityMsg.sharereward && this.activityMsg.shareGiveYuanBaoNum > 0 ){
                                                this.PopShare();
                                            }
                                        },1000)

                                    }.bind(this),
                                );

                            },
                            null,
                            '提示',
                            '确定',
                            '',
                            'UI_Lobby_Activity1',
                        );
                    }
                    else{
                        if(msg.sharereward && msg.shareGiveYuanBaoNum > 0 ){

                            this.PopShare();
                        }
                    }
                }
            }.bind(this),
        )
        //},200);
    },

    PopShare(){
        hxjs.module.ui.hub.LoadDlg_Check(
            '活动期间，分享游戏到朋友圈就能获得%0元宝奖励，每天1次哦'.replace(/%0/,this.activityMsg.shareGiveYuanBaoNum),
            ()=>{
                let url = hxfn.role.curUserData.wxShareUrl.timelineUrl;
                if (hxfn.role.curRole.inviteId) {
                    url += '?nick_name=' + hxfn.role.curRole.nickName;
                    url += ("&id=" + hxfn.role.curRole.inviteId);
                }

                let encodeUrl = encodeURI(url);
                hxfn.bridge.shareType = 1;
                hxfn.bridge.WXShareWeb(1,'欢乐棋牌室-最刺激的牛牛玩法','玩法最全，体验超燃，快加入能创造财富的棋牌游戏！',encodeUrl,'respath');
            },
            null,
            '提示',
            '立即分享',
            '',
            'UI_Lobby_Activity2',
        );
    },

    OnReset (){
        //获取Lobby主界面必须的数据
        //1,在线玩家人数
        this.GetAllPlayerCount();
        
        //2,所有游戏玩法
        hxfn.map.GetAllGameplays ((gameplays)=>{
            this.allGameplays = gameplays;
            //广播
            hxjs.util.Notifier.emit('lobby_allGameplays');
        });

        //刷新
        hxjs.util.Notifier.emit('Role_Update-Coin');
    },

    OnEnd () {
        this.HandleServerInfo(false);
        
        this.uiloop = null;
        this.broadcastinfos = null;

        this.cacheLeaveBattleReason = null;
    },
    //==============================================================


    HandleServerInfo:function(isHandle) {
        if(isHandle) {
            hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.BroadcastPost, this.Sync_BroadcastPost.bind(this));
        }
        else {
            hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.BroadcastPost);
        }
    },

    GetAllPlayerCount:function(){
        var postData = {};
        hxfn.netrequest.Req_GetAllPlayerCount(postData,(msg)=>{
            this.allPlayerCount = msg.playerCount;
            hxjs.util.Notifier.emit('lobby_allPlayerCount');
        });
    },

    RegistLobbyBroadcastUI (uiloop,cb=null){
        if(uiloop == null) 
        return;
        
        this.uiloop = uiloop;
        this.GetBroadcastList();
        this.LoopCallback=cb;
        if(this.broadcastinfos != null && this.broadcastinfos.length > 0) {
            this.uiloop.SetInfo(this.broadcastinfos,cb);
            this.uiloop.Play();
        }
    },
    UnregistLobbyBroadcastUI (){
        this.uiloop = null;
    },
    GetBroadcastList:function(){
        var postData = {
        }
        hxfn.netrequest.Req_GetBroadCastListReq(postData,this.Sync_BroadcastPost.bind(this));
    },
 
    Sync_BroadcastPost: function(data){
        var infos = data.get('infos');

        if(this.uiloop != null) {
            if(infos != null && infos.length > 0) {
                this.broadcastinfos = infos;
                this.uiloop.SetInfo(infos,(isShow)=>{
                    if(this.LoopCallback!=null){
                        this.LoopCallback(isShow);
                    }
                    hxjs.util.Notifier.emit('Broadcast',isShow);
                });
                this.uiloop.Play();
            }
        }
    },

    //大厅通用返回按钮
    // var btn_back = this.btnBack.getComponent('UIButton');
    // btn_back.SetInfo(function (){
    //     cc.log('lobby back to normal!!!');
    //     //TEMP
    //     // if(this.curState == Enum_LobbyUIState.NormalFn || this.curState == Enum_LobbyUIState.LevelSelect)
    //     hxjs.module.ui.hub.Pop();
    //     if(hxjs.module.ui.hub.HasAllPoped())
    //         this.SetState(Enum_LobbyUIState.Default);
    // }.bind(this),'返回');
}