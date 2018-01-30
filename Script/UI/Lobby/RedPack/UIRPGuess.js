cc.Class({
    extends: cc.Component,

    properties: {
        avatar:cc.Node,
        txtWord:cc.Label,
        txtMoney:cc.EditBox,
        btnGuess:cc.Button,
    },

    // use this for initialization
    onLoad: function () {
        this.btnGuess.getComponent('UIButton').SetInfo(
            function(){
                this.GuessRedPack();
            }.bind(this),
        )
    },

    onEnable: function(){
        this.Reset();
        this.txtWord.string = hxfn.redpack.guessRedPack.content;
        //this.avatar.getComponent('UIAvatar').SetInfo(hxfn.role.curRole);        
    },

    GuessRedPack(){
        let money = parseInt(this.txtMoney.string);
        if(money == "")
        {
            HandleClientResult(1)
        }
        if(!isNaN(money)){
            var postData = {
                playerId: hxfn.role.playerId,
                hongbagId: hxfn.redpack.guessRedPack.hongbagId,
                guessyuanbao: money,
            };
            cc.log(postData);

            hxfn.netrequest.Req_GuessHongbag(
                postData,
                function(msg){
                    // var msg = hxdt.builder.build('GuessHongbagResp').decode(data);
                    // cc.log(msg);
                    var result = msg.result;
                    if(!hxfn.comn.HandleServerResult(result)){
                        hxfn.redpack.guessMoney = money;
                        hxfn.redpack.SwitchState(this.node,4);
                    }
                }.bind(this),
            );
            //猜红包
            // hxfn.net.Request(
            //     postData,
            //     'GuessHongbagReq',
            //     hxdt.msgcmd.GuessHongbag,//312,
            //     function(data){
            //         var msg = hxdt.builder.build('GuessHongbagResp').decode(data);
            //         cc.log(msg);
            //         var result = msg.result;
            //         if(!hxfn.comn.HandleServerResult(result)){
            //             hxfn.redpack.guessMoney = money;
            //             hxfn.redpack.SwitchState(this.node,4);
            //         } 
            //     }.bind(this),
            // );   
        }
    },

    Reset(){
        this.txtMoney.string = '';
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
