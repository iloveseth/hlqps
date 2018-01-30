import { hxjs } from '../../../HXJS/HXJS';



cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // [display]
        groupMenu: cc.Node,
        labelGY:cc.Label,
        scrollRank:cc.ScrollView,
        labelRank:cc.Label,
        content:cc.Node,

        btnShop:require('UIButton'),
        imgMoney:cc.Sprite,
        

        // [nondisplay]
        scr_scrollRank:null,
        scr_groupMenu:null,
        _tabIdx:0,

        txtMyName:cc.Label,
        txtMyRank:cc.Label,
        txtMoney:cc.Label,
        txtBankYuanBao:cc.Label,
        imgBankYuanBao:cc.Node,

        conAvatar: require('UIAvatar'),

        btnMyInfo: require('UIButton'),
        
    },

    onLoad: function () {
        this.OnInit('排行榜');// base func //'ui_lobby_fn_close', 

        this.labelGY.string = '元宝';
        this._tabIdx = 1;
        this.scrollRank.scrollToTop();
        this.scr_scrollRank = this.scrollRank.getComponent('UIScrollView');
        this.scr_groupMenu = this.groupMenu.getComponent('UIGroup');
        this.scr_groupMenu.SetInfo (this.SelectMenu.bind(this),['金币榜','元宝榜']);
        // this.btnShop.SetInfo(function(){hxjs.util.Notifier.emit('open_shop',this._tabIdx)});
        this.btnShop.SetInfo(function(){
            hxfn.shop.curShop = 1 - this._tabIdx;
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Shop_new2');
        }.bind(this));

        this.txtMyName.string = hxfn.role.curUserData.playerData.nickName;
        this.conAvatar.SetInfo(hxfn.role.curUserData.playerData);
        this.btnMyInfo.SetInfo(this.MyInfo.bind(this));
        
        //this.scrollRank.scrollToTop();
        // this.InitRankLst();
    },
    
    start:function () {
        this.scr_groupMenu.SetDefaultIdx(1);
    },

    MyInfo(){
        // hxjs.module.ui.hub.LoadPanel_Dlg('UI_Role_DetailNew');
        hxjs.module.ui.hub.LoadPanel_Dlg('UI_Role_DetailNew');
    },

    SelectMenu: function(idx){

        this._tabIdx = idx;

        var tabName = ['金币','元宝'];

        this.labelGY.string = tabName[idx];

        if(idx == 0){
            // this.SetCoinStyle(0);
            hxjs.module.asset.LoadAtlasSprite(hxfn.comn.coinAtlas,hxfn.comn.CoinPath[hxfn.comn.ItemTyp.gold],this.imgMoney);
            this.txtMoney.string = parseInt(hxfn.role.curUserData.goldenInfo.gold).toCoin();
            this.imgBankYuanBao.active = false;
            this.txtBankYuanBao.node.active = false;
        }
        else if(idx == 1){
            // this.SetCoinStyle(1);
            hxjs.module.asset.LoadAtlasSprite(hxfn.comn.coinAtlas,hxfn.comn.CoinPath[hxfn.comn.ItemTyp.yuanbao],this.imgMoney);
            this.txtMoney.string = parseInt(hxfn.role.curUserData.goldenInfo.yuanbao).toCoin();
            this.imgBankYuanBao.active = true;
            this.txtBankYuanBao.node.active = true;
            this.txtBankYuanBao.string = parseInt(hxfn.role.curGoldenInfo.bankYuanbao).toCoin();
        }

        hxfn.adjust.AdjustLabel(this.node);
        this.content.removeAllChildren();
        
        
        var postData = {
            'rankingType':idx,//
        };
        hxfn.netrequest.Req_GetGoldRank(postData,this.Callback_GetGoldRankReq.bind(this));
    },

    // SetCoinStyle:function (idx){
    //     this.imgGold.node.active = true;
    //     var coinid = -1;
    //     if(idx === 0){
    //         coinid = 300;
    //     }
    //     if(idx === 1){
    //         coinid = 301;
    //     }
    //     hxjs.module.asset.LoadAtlasSprite(hxfn.comn.coinAtlas,hxfn.comn.CoinPath.coinid,this.imgMoney);
    // },

    Callback_GetGoldRankReq: function(msg) {
        var rankInfo = msg.get('rankInfo');

        if(msg.selfRank != 0){ 
            this.txtMyRank.string = '我的排名：' + msg.selfRank;
        }
        else{
            this.txtMyRank.string = '我的排名：未上榜';
        }

        var uiRankInfo = [];
        for(var i =0;i<rankInfo.length;++i)
        {
            // rankInfo[i]['type'] = this._tabIdx;
            uiRankInfo.push({'type':this._tabIdx, 'info': rankInfo[i]});
        }

        if(uiRankInfo !== null && uiRankInfo.length > 0) {
            this.scr_scrollRank.populateList(uiRankInfo);
        }

        this.scrollRank.scrollToTop();
        this.labelRank.string = '名次';
    
        // var playerId = msg.get('playerId');
        // var playName = msg.get('playName');
        // var playerIcon = msg.get('playerIcon');
        // var gold = msg.get('gold');
        // var serverId = msg.get('serverId');
    
        //cc.log('请求排行结果 rankInfo: ');
        
    },

});