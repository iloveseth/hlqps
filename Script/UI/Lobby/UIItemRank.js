cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        imgFrame:cc.Node,

        txtRank: cc.Label,
        txtName: cc.Label,
        btnCheck:require('UIButton'),
        // callback_check: null,
        idx:-1,
        txtGY: cc.Label,
        //123名次的图标显示
        Img_Rank1: cc.Node,
        Img_Rank2: cc.Node,
        Img_Rank3: cc.Node,

        imgMoney: cc.Sprite,

        // imgPlayerIcon:cc.Sprite,

        playerId:null,

    },

    onLoad: function () {
        // this.btnCheck.SetInfo(function(){
        // this.callback_check(this.idx);
        // }.bind(this));
        this.btnCheck.SetInfo(this.ShowDetail.bind(this));
    },

    start: function(){
        //cc.log('Start');
    },

    SetInfo (inf,idx/*,callback*/) {
        // cc.log('SetInfo');
        var typ = inf['type'];
        var info = inf['info'];

        this.idx = idx;

        this.txtRank.string = idx + 1;
        // this.callback_check = callback;
        this.txtName.string = info.playerName;
        this.playerId = info.playerId;
        
        if(typ == 0)//金币房
        {
            // cc.log('金币榜');
            hxjs.module.asset.LoadAtlasSprite(hxfn.comn.coinAtlas,hxfn.comn.CoinPath[hxfn.comn.ItemTyp.gold],this.imgMoney);
            this.txtGY.string = info.gold;
            //hxfn.module
        }
        else if(typ == 1)//元宝房
        {
            // cc.log('元宝榜');
            hxjs.module.asset.LoadAtlasSprite(hxfn.comn.coinAtlas,hxfn.comn.CoinPath[hxfn.comn.ItemTyp.yuanbao],this.imgMoney);
            this.txtGY.string = info.yuanbao;
        }

        //TODO: 123名显示对应的图标
        
        if(idx == 0)
        {
            this.Img_Rank1.active = true;
            this.txtRank.node.active = false;
            // cc.log('第一名');
        }
        else if(idx == 1)
        {
            this.Img_Rank2.active = true; 
            this.txtRank.node.active = false;
            // cc.log('第二名');
        }
        else if(idx == 2)
        {
            this.Img_Rank3.active = true;
            this.txtRank.node.active = false;
            // cc.log('第三名');
        }
        
        // var icon = info.get('playerIcon');
        // if(icon == null)
        //     icon = 'icon_avatar_dummy';

        // hxjs.module.asset.LoadAtlasSprite('avatars', icon, this.imgPlayerIcon);

        //排列项的背景间隔显示
        this.imgFrame.active = idx%2 === 0
        // cc.log('SetInfo:out');
        hxfn.adjust.AdjustLabel(this.node);
    },

    ShowDetail(){
        //return;

        //不是自己
        if(this.playerId != hxfn.role.curRole.playerId){
            var postData = {
                searchTxt:this.playerId,
            };
            
            hxfn.netrequest.Req_SearchPlayer(postData, function(msg){
                // var curRankRole=null,
                if(msg.searchResult.length > 0){
                    hxfn.rank.curRankDetail = msg.searchResult[0].playerName;
                
                    hxjs.module.ui.hub.LoadPanel_DlgPop('UI_Role_Rank_Other');
                }
            }.bind(this),);
        }
        //自己
        else{
            // hxjs.module.ui.hub.LoadPanel_Dlg('UI_Role_DetailNew');
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Role_DetailNew');
        }
    },

    
});