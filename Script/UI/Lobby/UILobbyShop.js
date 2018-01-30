cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // [display]
        btnCharge: require('UIButton'),
        groupMenuBtns: cc.Node,
        // rolItemLst:cc.Node,
        lstPrice:cc.Node,

        viewYuanbao:cc.Node,
        viewGold:cc.Node,
        viewGive:cc.Node,
        viewBank:cc.Node,
        txtBuy:cc.Label,
        txtAds:cc.RichText,//原价￥200
        conGoodsDetailInfo:cc.Node,
        btnGive: require('UIButton'),
        img_Cutoff2:cc.Node,
        // [nondisplay]
        src_GroupMenuBtns:null,
        src_LstPrice:null,
        
        itemIdx: -1,
        priceIdx: -1,

        typIngotInfo:null,

        groupBuyGoods: require('UIGroup'),
    },

    onLoad: function () {
        this.OnInit('商城');// base func//'ui_lobby_fn_close', 

        this.src_LstPrice = this.lstPrice.getComponent('UILst');
        this.src_GroupMenuBtns = this.groupMenuBtns.getComponent('UIGroup');
        

        var playerInfo = hxfn.role.curUserData.playerData;
        var serviceInfo = hxfn.role.curUserData.serviceOption;
        if((playerInfo.vipLevel>=hxdt.setting_niuniu.GiveVipLevel)&&(serviceInfo.giveYB==true)){
            this.btnGive.node.active=true;
            this.src_GroupMenuBtns.SetInfo(this.SelectButton.bind(this),['元宝','金币','赠送','保险箱']);
        }
        else{
            this.btnGive.node.active=false;
            this.img_Cutoff2.active=false;
            this.src_GroupMenuBtns.SetInfo(this.SelectButton.bind(this),['元宝','金币','保险箱']); 
        }
        //this.btnCharge.SetInfo(this.StartCharge.bind(this));

        // hxjs.module.ui.hub.HideCom(this.btnCharge.node);
        hxjs.module.ui.hub.HideCom(this.conGoodsDetailInfo);
        this.groupBuyGoods.SetInfo(this.BuyGoods.bind(this));
      
    },

    onDestroy: function(){
        // if(hxfn.shop.userDataChanged){
        //     //hxfn.role.UpdateUserDataAndNotify();
        // }
    },
    
    start:function () {
        this.src_GroupMenuBtns.SetDefaultIdx(hxfn.shop.curShop/*索引，0元宝，1金币*/);
        hxfn.shop.GetMarketList(this.InitData.bind(this));
    },
    
    InitData:function (){
        this.curGoodsLst = hxfn.shop.GetIngotGoods();
        this.src_LstPrice.SetInfo(this.curGoodsLst, this.SelectItemIdx.bind(this));
    },

    SelectButton: function(idx){
        switch(idx){
            case 0:
            {
                hxjs.module.ui.hub.HideCom(this.viewGive);
                hxjs.module.ui.hub.HideCom(this.viewGold);
                hxjs.module.ui.hub.HideCom(this.viewBank);
                hxjs.module.ui.hub.ShowCom(this.viewYuanbao);
                break;
            }
            case 1:
            {
                hxjs.module.ui.hub.HideCom(this.viewGive);
                hxjs.module.ui.hub.HideCom(this.viewYuanbao);
                hxjs.module.ui.hub.HideCom(this.viewBank);
                hxjs.module.ui.hub.ShowCom(this.viewGold);
                break;
            }
            case 2:
            {
                hxjs.module.ui.hub.HideCom(this.viewGold);
                hxjs.module.ui.hub.HideCom(this.viewYuanbao);
                hxjs.module.ui.hub.HideCom(this.viewBank);
                hxjs.module.ui.hub.ShowCom(this.viewGive);
                break;
            }
            case 3:
            {
                hxjs.module.ui.hub.HideCom(this.viewGold);
                hxjs.module.ui.hub.HideCom(this.viewYuanbao);
                hxjs.module.ui.hub.HideCom(this.viewGive);
                hxjs.module.ui.hub.ShowCom(this.viewBank);
                break;
            }
            default:
            break;
        }
    },

    SelectItemIdx:function (idx) {
        if(idx === -1) {
            cc.log('===> idx can not be -1');
            return;
        }

        this.itemIdx = idx;
        
        this.ShowCurCheckedGoodsDetail();
    },

    ShowCurCheckedGoodsDetail:function () {
        // hxjs.module.ui.hub.ShowCom(this.conGoodsDetailInfo);
        // var g = this.curGoodsLst[this.itemIdx];
        // this.txtBuy.string = '购买￥' + g.get('goodsCost');
        // this.txtAds.string = g.get('goodsRemark');
    },

    StartCharge:function () {
        if(this.itemIdx < 0) {
            hxjs.module.ui.hub.LoadDlg_Info('请先选择购买数量！', '提示');
            return;
        }

        var goods = this.curGoodsLst[this.itemIdx];
        hxfn.shop.RequestRechargeOrder(goods);
    },

    BuyGoods(idx){
        cc.log('this.idx');
        cc.log(idx);
        cc.log('this.curGoodsLst');
        cc.log(this.curGoodsLst);
        var goods = this.curGoodsLst[idx];
        cc.log('goods');
        cc.log(goods);
        hxfn.shop.RequestRechargeOrder(goods);
    }
});