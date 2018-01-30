import { hxdt } from '../../../DT/HXDT';

//1     红包广场
//2     目前还没有做的部分：
//3     出错提示
//4     元宝的加减，这个服务端还没有做好
//5     好友红包，服务端那边还没有做好
//6     软件结构：
//7     loadDlgPanel弹出UI_Lobby_Popup
//8     Con_Send,Con_SendNumber,Con_SendConfirm,Con_Guess,Con_GuessConfirm
//9     这五个是嵌入UI_Lobby_Popup的面板
//10    使用节点的active设置五个面板的显示和隐藏
//11    而不是loadPanel和unlooad函数


cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        groupTab:cc.Node,
        con1And2:cc.Node,
        con3Notice:cc.Node,
        rolPack:require('UIScrollView'),
        rolNotice:require('UIScrollView'),
        btnSend:cc.Button,
        conMain:cc.Node,
        conList:cc.Node,

        tabIdx:null,
        conSearch:require('UISearchRedPack'),
        playerId:null,

    },

    onLoad: function () {
        this.OnInit('红包广场');//'ui_lobby_fn_close', 

        this.playerId = hxfn.role.playerId;

        this.groupTab.getComponent('UIGroup').SetInfo(this.SelectTab.bind(this),['猜红包','已发红包','通知']);
        this.btnSend.getComponent('UIButton').SetInfo(
            function(){
                hxfn.redpack.curPanel = hxfn.redpack.Enum_Panel.Send;
                hxjs.module.ui.hub.LoadPanel_Dlg("Con_Popup", null,this.conMain);
            }.bind(this),'发红包',
        )
    },

    start:function (){
        this.groupTab.getComponent('UIGroup').SetDefaultIdx(0);
        this.tabIdx = 0;

        hxjs.util.Notifier.on('AgreeRedPack',this.AgreeRedPack,this);
        hxjs.util.Notifier.on('CancelRedPack',this.CancelRedPack,this);
        hxjs.util.Notifier.on('SearchRedPack',this.GetRedPackList,this);
    },

    onDestroy: function(){
        hxjs.util.Notifier.off('AgreeRedPack');
        hxjs.util.Notifier.off('CancelRedPack');
        hxjs.util.Notifier.off('SearchRedPack');
        
    },

    SelectTab(idx){
        this.con1And2.active = false;
        this.con3Notice.active = false;

        this.tabIdx = idx;
        switch(idx){
            case 0 : case 1 : {
                this.con1And2.active = true;
                //猜红包
                this.ClearList();
                this.GetRedPackList(this.playerId);
                break;
            }
            case 2:{
                this.con3Notice.active = true;
                this.GetRedPackNotice();
                break;
            }
            default: break;
        }
    },

    //获取红包列表
    GetRedPackList(id){
        cc.log('获取红包列表请求' + id);
        var postData = {
            playerId: this.playerId,
            isOwnHongbag: this.tabIdx == 1,
        };
        cc.log(id);
        cc.log(this.playerId);
        if(id!=this.playerId){
            postData.specPlayerId = id;
        }
        cc.log(postData);

        hxfn.netrequest.Req_GetHongbagList(
            postData,
            // 'GetHongbagListReq',
            // hxdt.msgcmd.GetHongbagList,//310,
            function(msg){
                // var msg = hxdt.builder.build('GetHongbagListResp').decode(data);   
                // cc.log(msg);                     
                if(msg.get('result')==0){
                    let redPackProto = msg.get('hongbagDataProto');
                    cc.log(redPackProto);
                    //if(this.tabIdx)
                    this.rolPack.populateList(redPackProto, 
                        function(idx){
                        //此处处理红包点击事件
                            switch(this.tabIdx){
                                case 0:{
                                    hxfn.redpack.guessRedPack = redPackProto[idx];
                                    hxfn.redpack.curPanel = hxfn.redpack.Enum_Panel.Guess;
                                    hxjs.module.ui.hub.LoadPanel_Dlg("Con_Popup", null,this.conMain);
                                    break;
                                }
                                case 1:{
                                    hxfn.redpack.myRedPack = redPackProto[idx];
                                    hxfn.redpack.curPanel = hxfn.redpack.Enum_Panel.Mine;
                                    hxjs.module.ui.hub.LoadPanel_Dlg('Con_Popup',null,this.conMain);
                                    break;
                                }
                                default:break;
                            }
                            
                        }.bind(this),
                    );
                }
                else{
                    hxjs.module.ui.hub.LoadDlg_Info(hxdt.errcode.codeToDesc(msg.result), "友情提示(来自服务器)");
                }
            }.bind(this)
        );   
    },

    //获取红包通知
    //首先更新用户数据
    GetRedPackNotice(){
        // hxfn.net.Request(
        hxfn.netrequest.Req_GetUserAllData(
            {},
            // 'GetUserAllDataReq',
            // hxdt.msgcmd.GetUserInfoCommand,//310,
            function(msg){
                // var msg = hxdt.builder.build('GetUserAllDataResp').decode(data);   
                // cc.log(msg);                     
                let userAllData = msg.get('userAllData');                    
                let redPackNotices = userAllData.playerHongbagInfo.playerHongbagNoticeProto;
                cc.log(redPackNotices);
                if(redPackNotices != null && redPackNotices.length > 0){
                    this.rolNotice.populateList(redPackNotices,
                    function(info){
                        //此处处理消息点击事件
                        switch(info.idy){
                            case 0:{
                                this.AgreeRedPack(redPackNotices[info.idx]);
                                break;
                            }
                            case 1:{
                                this.CancelRedPack(redPackNotices[info.idx]);
                                break;
                            }
                            default:break;
                        }
                    }.bind(this),);
                }
                //
            }.bind(this)
        );   
    },

    ClearList(){
        this.conList.removeAllChildren();
    },

    AgreeRedPack(redpack)
    {
        // hxfn.net.Request(
        hxfn.netrequest.Req_AgreeGiveHongbag(
            {
                playerId: this.playerId,
                hongbagId: redpack.hongbagId,
                guesserId: redpack.guesser,
            },
            // 'AgreeGiveHongbagReq',
            // hxdt.msgcmd.AgreeGiveHongbag,
            function(msg){
                // var msg = hxdt.builder.build('AgreeGiveHongbagResp').decode(data);
                var result = msg.result;
                cc.log(msg);
                if(!hxfn.comn.HandleServerResult(result)){
                    //同意给红包
                }
            }.bind(this),
        )
    },

    CancelRedPack(redpack){
        // hxfn.net.Request(
        hxfn.netrequest.Req_RefuseGiveHongbag(
            {
                playerId: this.playerId,
                hongbagId: redpack.hongbagId,
                guesserId: redpack.guesser,
            },
            // 'RefuseGiveHongbagReq',
            // hxdt.msgcmd.RefuseGiveHongbag,
            function(msg){
                // var msg = hxdt.builder.build('RefuseGiveHongbagResp').decode(data);
                var result = msg.result;
                cc.log(msg);
                if(!hxfn.comn.HandleServerResult(result)){
                    //拒绝给红包   
                }
            }.bind(this),
        )
    } 
});