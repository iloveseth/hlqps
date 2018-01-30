export let shop = {
    allTypGoods:null,
    isStartCharging: false,

    curShop: 0,
    goods:null,
    //userDataChanged: false,

    rechargePlatformId:null,
    
    givePlayerId:-1,

    playerDiscount: null,
    // OnInit(){
    //     // this.HandleServerInfo(true);
    // },
    OnStart(){},
    OnReset(){},
    OnEnd(){
        this.allTypGoods = null;
        // this.HandleServerInfo(false);
    },

    // HandleServerInfo:function(isHandle) {
    //     if(isHandle) {
    //     }
    //     else {
    //     }
    // },

    GetMarketList (cb) {
        this.callback_initData = cb;
        
        //如果已经初始化过商品数据，则不需要再次申请数据
        // if(this.allTypGoods != null){
        //     if(this.callback_initData != null)
        //         this.callback_initData();
        //
        //     return;
        // }
        
        // //hxjs.module.ui.hub.ShowWaitingUI ();
        this.allTypGoods = null;
        hxfn.netrequest.Req_GetMarketList(this.CallBack_Get.bind(this));
    },

    CallBack_Get: function(msg){
        //hxjs.module.ui.hub.HideWaitingUI ();
        
        // var msg = hxdt.builder.build('GetMarketListResp').decode(data);
        if(msg.get('result') == 0) {
            this.allTypGoods = msg.get('goodsList');
            this.rechargePlatformId = msg.get('rechargeChannel');
            this.playerDiscount = msg.playerDiscount;
            
            if(this.callback_initData != null)
                this.callback_initData();
        }
    },

    GetIngotGoods () {
        var gs = [];
        for (var i = 0; i < this.allTypGoods.length; i++) {
            var element = this.allTypGoods[i];
            if(element.get('goodsType') == 2) {
                gs.push(element);
            }
        } 

        return gs;
    },


    ///充值流程 ////////////////////////////////////////////////////
    // 发现充值服务器地址，以3种方式来充值（测试渠道，苹果，其他第三方）
    // 从服务器得到订单号
    // 走SDK第三方平台确认
    // 微信等，客户端只要响应（被动）服务端充值成功的推送，IOS平台，则需要再次主动请求服务器

    RequestRechargeOrder (goods) {
        if(this.isStartCharging) 
            return;

        this.goods = goods;
        hxjs.module.ui.hub.ShowWaitingUI ();
        this.isStartCharging = true;
        let rechargeChannel = this.rechargePlatformId;
        if(goods.overChannel){
            rechargeChannel = goods.overChannel;
        }

        var url = hxfn.account.urlDict['rechargeOrderUrl'];

        var postObj = {
            rechargePlatformId:rechargeChannel,
            rechargeId:goods.id,
            userId:hxfn.role.playerId,
            platformId:hxdt.setting_comn.GetPlatformId(),
            packageId:hxdt.setting_comn.GetPackageId(),
            OS:hxdt.setting_comn.GetOS(),//hxdt.setting_comn.GetOS(),//
            //ip:'180.173.144.58',
            //jsonData:'',
        };
        cc.log('RequestRechargeOrder:postObj:');
        cc.log(postObj);
        //cc.log(postObj);
        var msgInfo = hxdt.builder.build('RechargeOrderPostData');
        var postData = msgInfo.encode(postObj).toBuffer();

        hxjs.module.net.SendHttpRequest
        (
            url, 
            postData, 
            this,
            function (data) {
                hxjs.module.ui.hub.HideWaitingUI ();

                //this.userDataChanged = true;

                var msg = hxdt.builder.build('RechargeOrderResult').decode(data);

                this.isStartCharging = false;

                if(msg.get('result') == 0/*errcode: OK*/) {

                    if(rechargeChannel.toLowerCase() == 'any'){
                        // 0，测试时不需要往下走
                        this.isStartCharging = false;
                    }
                    else if(rechargeChannel.toLowerCase() == 'wechat'){
                        // 1，只需要调用SDK方法，然后等服务器通知成功信息（如wechat拥有服务端sdk）
                        // 调用壳里的方法
                        // hxjs.module.net.CallNativePayment (this.GetChargeItemID(this.itemIdx));
                    }
                    else if(rechargeChannel.toLowerCase() == 'ios'){
                        // 1，需要调用SDK
                        
                        var jsonObj = JSON.parse(msg.jsonData);
                        var orderId = jsonObj.orderId;
                        this.orderId = orderId;
                        cc.log(goods);
                        this.isStartCharging = false;

                        // 调用壳里的方法
                        hxfn.bridge.PayIOS(goods.iOSId);
                        //hxjs.module.net.CallNativePayment (goods.iOSId);
                        
                        // 2，成功之后显式通知服务端
                    }
                    else if(rechargeChannel.toLowerCase() == 'heepay'){
                        var url = JSON.parse(msg.jsonData);
                        cc.log(url);
                        cc.sys.openURL(url);
                        //hxfn.bridge.OpenUrl(url);
                    }

                    else if(rechargeChannel.toLowerCase() == 'heepayunion'){
                        var url = JSON.parse(msg.jsonData);
                        cc.log(url);
                        cc.sys.openURL(url);
                        //hxfn.bridge.OpenUrl(url);
                    }
                    else{
                    }
                }
                else {
                    //TODO 提示错误
                }
            }.bind(this), 
            function (status) {
                cc.log('~~~~~~~nnnnnnnnnnn~~~~~~~~ fail RequestRechargeOrder with status: ' + status);
                // hxjs.module.ui.hub.HideWaitingUI ();

                hxjs.module.ui.hub.LoadDlg_Info('向服务器发送商品信息错误(' + status + ')', '提示');
            }.bind(this), 
        );
    },
    SendRechargeOrderResult(receipt){
        var url = hxfn.account.urlDict['rechargeIOSUrl'];
        var jsonObject = {
            "userId": hxfn.role.curUserData.playerData.playerId,
            "cpOrderId" : this.orderId,
            "amount" : this.goods.goodsCost,
            "rechargeId" : this.goods.id,
            "receipt":receipt,
        };

        var postStr = JSON.stringify(jsonObject);
        cc.log(postStr);
        hxjs.module.net.SendHttpRequest
        (
            url,
            postStr,
            this,
            function(data){
            }.bind(this),
            function(status){
            }.bind(this),
        );
        hxjs.module.ui.hub.HideWaitingUI ();
        this.isStartCharging = false;

        //var postObj = 
    },
}