import { hxdt } from '../../DT/HXDT';

cc.Class({
    extends: cc.Component,

    properties: {
        imgIcon:cc.Sprite,
        imgTxt:cc.Label,
        imgPayIcon:cc.Sprite,
        btnSelect:require('UIButton'),
        idx:-1,
        base:require('UIPanelStack'),

        id:0,
        payGold:0
    },

    onLoad: function () {
        this.btnSelect.getComponent('UIButton').SetInfo(this.SendEmoj.bind(this));
    },
    SetInfo (info, idx) {
        this.idx = idx;
        if(info!= null) {
            this.id=info['id'];
           var yb =info['payYuanbao'];
           if(yb>0){
            this.imgTxt.string ="x"+info['payYuanbao']; 
            this.payGold=info['payYuanbao']; 
            hxjs.module.asset.LoadAtlasSprite("comn_item","coin_301", this.imgPayIcon);
           }
           else{
            this.imgTxt.string ="x"+info['payGold']; 
            this.payGold=info['payGold']; 
            hxjs.module.asset.LoadAtlasSprite("comn_item","coin_300", this.imgPayIcon);
           }
  
           
            //hxjs.module.asset.LoadAtlasSprite("comn_item", info['icon'], this.imgIcon);
            this.node.active=true;
        }
        else {
            this.node.active=false;
        }
    },
    SendEmoj:function(btn){
       
        //本地临时判断金币是否不足
        //if(this.payGold> hxfn.role.curGold){
        //    hxjs.module.ui.hub.LoadDlg_Info('元宝不足！','提示');
        //}
       
        //else{
            //获取目标用户ID
        var uiseatIdx = hxfn.battle.curSelectSeatIdx;
        var info = hxfn.battle.uiRoles[uiseatIdx];
        var playerInfo = info['playerInfo']['userData'];
        cc.info('send emoj to '+playerInfo['playerId']);
        if(playerInfo['playerId']==hxfn.role.playerId){
            hxjs.module.ui.hub.LoadDlg_Info('不能发送给自己哦！','提示');
        }
        else{
            //发送请求
            var postData = {
                id :this.id,
                toPlayerId : playerInfo['playerId'], 
            };

            hxfn.netrequest.Req_UseInterEmoj(postData, this.Callback_UseInterEmojReq.bind(this));
            // hxfn.net.Request(
            //     postData,
            //     'UseInterEmojReq',
            //     hxdt.msgcmd.UseInterEmoj,//1700,
            //     this.Callback_UseInterEmojReq.bind(this)
            // );
        }
        //}
        
        // hxjs.module.asset.LoadUIPrefab('UI_Bg_Dark', function(dlgBg) {
        // });
    },

    Callback_UseInterEmojReq:function(msg){
        // var msg_OpenMailResp = hxdt.builder.build('UseInterEmojResp');
        // var msg = msg_OpenMailResp.decode(data);

        var result= msg.get('result');
        if(result ==hxdt.errcode.LackYuanbaoByUseInterEmoj){
            //hxjs.module.ui.hub.LoadDlg_Info('保险箱元宝不足！','提示');
            hxfn.comn.IngotNotEnough(false);
        }
        else if(result ==hxdt.errcode.LackGoldByUseInterEmoj){
           // hxfn.comn.HandleSafeGuard(0,false);
           hxjs.module.ui.hub.LoadDlg_Info('金币不足！','提示');
        }
        else{
            this.base.Close();
        }
        // this.UpdateMailBox();
    },
});