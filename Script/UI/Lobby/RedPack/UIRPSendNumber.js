cc.Class({
    extends: cc.Component,

    properties: {
        
        txtMoney:cc.EditBox,
        txtWord:cc.EditBox,
        BtnSendNumber:cc.Button,
        //togFriend:cc.Toggle,

        money:null,
    },

    // use this for initialization
    onLoad: function () {
        this.BtnSendNumber.getComponent('UIButton').SetInfo(
            function(){
                this.SendRedPack();
            }.bind(this),
        )
    },

    onEnable:function(){
        this.Reset();
    },

    //发红包
    SendRedPack(){
        let money = parseInt(this.txtMoney.string);
        let word = this.txtWord.string.length != 0 ? this.txtWord.string : this.txtWord.placeholder;
        if(!isNaN(money)){
            var postData = {
                playerId: hxfn.role.curUserData.playerData.playerId,
                content: word,
                time: Date.parse(new Date()),
                yuanbao: money,
                //isfriendHongbag: this.togFriend.isChecked,
            };
            cc.log(postData);

            hxfn.netrequest.Req_GiveHongbag(
                postData,
                function(msg){
                    // var msg = hxdt.builder.build('GiveHongbagResp').decode(data);
                    // cc.log(msg);
                    var result = msg.result;
                    if(!hxfn.comn.HandleServerResult(result)){
                        this.money = money;
                        this.UpdateUserData();
                        hxfn.redpack.SwitchState(this.node,2);
                    }
                    //此处处理其他错误的返回值
                    // HongbagGuessError = 7000;       //红包广场猜错数量
                    // HongbagLackVip = 7001;          //发红包VIP等级不够
                    // HongbagFriendLackVip =7002;     //发好友红包VIP等级不够    
                    // HongbagOutofYuanbaoSelf = 7003;    //发红包超出身上的元宝，最低要求2000
                    // HongbagOutofRange =7004;           //发红包超出限制数量
                }.bind(this),
            );
            // hxfn.net.Request(
            //     postData,
            //     'GiveHongbagReq',
            //     hxdt.msgcmd.GiveHongbag,//311,
            //     function(data){
            //         var msg = hxdt.builder.build('GiveHongbagResp').decode(data);
            //         cc.log(msg);
            //         var result = msg.result;
            //         if(!hxfn.comn.HandleServerResult(result)){
            //             this.money = money;
            //             this.UpdateUserData();
            //             hxfn.redpack.SwitchState(this.node,2);
            //         }
            //         //此处处理其他错误的返回值
            //         // HongbagGuessError = 7000;       //红包广场猜错数量
            //         // HongbagLackVip = 7001;          //发红包VIP等级不够
            //         // HongbagFriendLackVip =7002;     //发好友红包VIP等级不够    
            //         // HongbagOutofYuanbaoSelf = 7003;    //发红包超出身上的元宝，最低要求2000
            //         // HongbagOutofRange =7004;           //发红包超出限制数量
            //     }.bind(this),
            // );   
        }
        else{
            hxfn.comn.HandleClientResult(1);
        }
    },

    //更新用户数据
    UpdateUserData(){
        //扣除发红包所需的金币，元宝等资源
    },

    Reset(){
        this.txtMoney.string = '';
        this.txtWord.string = '';
        //this.togFriend.isChecked = false;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
