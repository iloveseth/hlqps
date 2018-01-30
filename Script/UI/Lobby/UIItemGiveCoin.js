
cc.Class({
    extends: cc.Component,

    properties: {
        detailNode:cc.Node,
        imgAvatar:cc.Sprite,
        txtName:cc.Label,
        txtID:cc.Label,
        txtVIP:cc.Label,
        btnSearch: require('UIButton'),
        btnGive: require('UIButton'),
        inputId:cc.EditBox,
        inputCount:cc.EditBox
    },

    onLoad: function () {
        this.detailNode.active=false;
        if(hxfn.shop.givePlayerId>=0){ 
            this.inputId.string = hxfn.shop.givePlayerId+'';
            hxjs.module.ui.hub.ShowWaitingUI();
            var postData = {
                searchTxt:this.inputId.string,
            }
            hxfn.shop.givePlayerId =-1;
            hxfn.netrequest.Req_SearchPlayerReq(postData,this.Callback_SearchPlayerReq.bind(this));
        }
        this.btnSearch.SetInfo(function(){
            var playerInfo = hxfn.role.curUserData.playerData; 
            if(this.inputId.string.length==0){
                hxjs.module.ui.hub.LoadDlg_Info('ID位数不对，请重试','提示');
            }
            else if(this.inputId.string==playerInfo.playerId){
                hxjs.module.ui.hub.LoadDlg_Info('不能赠送给自己','提示');
            }
            else{
                hxjs.module.ui.hub.ShowWaitingUI();
                var postData = {
                    searchTxt:this.inputId.string,
                }
                hxfn.netrequest.Req_SearchPlayerReq(postData,this.Callback_SearchPlayerReq.bind(this));
            }
        }.bind(this));
        this.btnGive.SetInfo(function(){
            if(this.inputCount.string.length==0||isNaN(this.inputCount.string)){
                hxjs.module.ui.hub.LoadDlg_Info('请输入数字','提示');
            }
            else if(this.detailNode.active===false){
                hxjs.module.ui.hub.LoadDlg_Info('请先查询玩家后再试','提示');
            }
            else if(Number(this.inputCount.string<=0)){
                hxjs.module.ui.hub.LoadDlg_Info('请输入大于0 的数字','提示');
            }
            else{
                // message PlayerGoldenInfo {
                //     optional int64 gold = 1;        //金币
                //     optional int32 diamond = 2;     //钻石
                //     optional int64 yuanbao = 3;     //元宝
                //     optional int32 nameCard = 4;    //改名卡
                //     optional int32 remedySignCard = 5;  //补签卡
                //     optional int64 bankYuanbao = 6;    //保险箱元宝数
                // }
                if(parseInt(this.inputCount.string) > 0 && parseInt(hxfn.role.curUserData.goldenInfo.yuanbao) + parseInt(hxfn.role.curUserData.goldenInfo.bankYuanbao) - parseInt(this.inputCount.string)< 3000){
                    hxjs.module.ui.hub.LoadDlg_Info('自身元宝余额不能低于3000','赠送失败');
                    return;
                }
                hxjs.module.ui.hub.ShowWaitingUI();

                var postData = {
                    toPlayer:this.txtID.string,
                    giveCount:Number(this.inputCount.string),
                    giveDType:301
                }
                hxfn.netrequest.Req_PlayerGiveYBReq(postData,this.Callback_PlayerGiveYBReq.bind(this));
            }
        }.bind(this));
    },
    Callback_SearchPlayerReq: function (msg) {    
        var result = msg.get('searchResult');
        hxjs.module.ui.hub.HideWaitingUI();
        if(result.length>0){
            var info =result[0];
            this.detailNode.active=true;
            this.txtName.string = info.playerName.nickName;
            this.txtID.string = info.playerName.playerId;
            this.txtVIP.string =info.playerName.vipLevel;
            var strAvatar =info.playerName.playerIcon;
            //不成功时使用此候选图
            if(strAvatar.indexOf('icon') == 0 || (parseInt(strAvatar) > 0 && parseInt(strAvatar) <= 20)){
                hxjs.module.asset.LoadAtlasSprite(this.GetAtalas(strAvatar), strAvatar, this.imgAvatar, null, 'icon_avatar_dummy');
            }
            else{
                hxjs.module.asset.LoadNetImg(strAvatar,this.imgAvatar, 'icon_avatar_dummy');
            }
        }
        else{
            hxjs.module.ui.hub.LoadDlg_Info('没有找到该玩家，请检查ID','提示');
        }
    },
    Callback_PlayerGiveYBReq: function (msg) {    
        hxjs.module.ui.hub.HideWaitingUI();
        var result = msg.get('result');
        
        if(result==0){
            hxjs.module.ui.hub.LoadDlg_Info('赠送成功','提示');
            this.inputId.string = '';
            this.inputCount.string = '';
            this.detailNode.active=false;
        }
        else{
            hxjs.module.ui.hub.LoadDlg_Info('赠送失败，请稍后重试','提示');
        }
    },
    GetAtalas(icon){
        if(parseInt(icon) > 0 && parseInt(icon) <= 20){
            return 'avatars_self'
        }
        var sex = icon.substr(5,1);
        var idx = parseInt(icon.substr(7));
        if(sex === 'F' && idx >= 1 && idx < 256){
            return 'avatars_1'
        }
        if(sex === 'M' && idx >= 1 && idx <= 256 ){
            return 'avatars_2';
        }
        if(sex === 'M' && idx >= 266 && idx <= 512){
            return 'avatars_3';
        }
        if(sex === 'F' && idx >= 257 && idx <= 383){
            return 'avatars_4'
        }
        if(sex === 'M' && idx >= 513 && idx <= 641){
            return 'avatars_4'
        }
        if(sex === 'F' && idx >= 384 && idx <= 471){
            return 'avatars_5'
        }
    }
});