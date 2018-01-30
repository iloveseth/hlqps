cc.Class({
    extends: cc.Component,

    properties: {
        txtMyName:cc.Label,
        txtRedPackName:cc.Label,
        txtRemainTime:cc.Label,
        txtMoney:cc.Label,
        txtGuessNum:cc.Label,
        avatar:cc.Node,


        redPack:null,
        timer:null,
    },

    // use this for initialization
    onLoad: function () {
        this.avatar.getComponent('UIAvatar').SetInfo(hxfn.role.curRole);
        this.redPack = hxfn.redpack.myRedPack;

        this.txtMyName.string = hxfn.role.curUserData.playerData.nickName;
        this.txtRedPackName.string = hxfn.redpack.myRedPack.content;
       
        this.txtMoney.string = this.redPack.yuanbao;
        this.txtGuessNum.string = this.redPack.guessertimes;
        var invalidStamp = this.redPack.invalidDate;

        this.timer =  setInterval(function(){
            var nowStamp = new Date().getTime();

            var interval = invalidStamp - nowStamp;
            if(interval < 0){
                this.txtRemainTime.string = '已过期';
            }
            else{
                var seconds = Math.floor(interval / 1000);
                var hour = Math.floor(seconds/60/60);
                var minute = Math.floor((seconds - hour * 60 * 60 ) /60);
                var second = seconds % 60;
                this.txtRemainTime.string = hour + ':' + minute + ':' + second;
            }
        }.bind(this),1)
    },

    onDestroy:function(){
        clearInterval(this.timer);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
