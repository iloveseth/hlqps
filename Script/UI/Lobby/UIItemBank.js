import { hxfn } from '../../FN/HXFN';


cc.Class({
    extends: cc.Component,

    properties: {
        txtCarry:cc.Label,
        txtBank:cc.Label, 
        editInput:cc.EditBox, 
        btnGet: require('UIButton'),
        btnSave: require('UIButton'),
    },

    onLoad: function () {
        this.txtCarry.string = hxfn.role.curIngot.toCoin()+'';
        this.txtBank.string = hxfn.role.curBankYuanbao.toCoin()+'';
        this.btnGet.SetInfo(function(){
            if(this.editInput.string.length==0||isNaN(this.editInput.string)){
                hxjs.module.ui.hub.LoadDlg_Info('请输入数字','提示');
            }
            else if(parseInt(this.editInput.string)<=0){
                hxjs.module.ui.hub.LoadDlg_Info('请输入大于0的数字','提示');
            }
            else{
                //hxjs.module.ui.hub.ShowWaitingUI();
                var postData = { 
                    money:parseInt(this.editInput.string)
                }
                hxfn.netrequest.Req_BankWithdrawReq(postData,this.Callback_BankWithdrawReq.bind(this));
            }
        }.bind(this));
        this.btnSave.SetInfo(function(){
            if(this.editInput.string.length==0||isNaN(this.editInput.string)){
                hxjs.module.ui.hub.LoadDlg_Info('请输入数字','提示');
            }
            else if(parseInt(this.editInput.string)<=0){
                hxjs.module.ui.hub.LoadDlg_Info('请输入大于0的数字','提示');
            }
            else{ 
                var postData = {
                    money:parseInt(this.editInput.string)
                }
                hxfn.netrequest.Req_BankSaveReq(postData,this.Callback_BankSaveReq.bind(this));
            }
        }.bind(this));

        hxjs.util.Notifier.on('Role_Update-Coin',this.UpdateCoin, this);
    },
    onDestroy:function(){
        hxjs.util.Notifier.off('Role_Update-Coin',this.UpdateCoin, this);
    },
    UpdateCoin:function(){
        this.txtCarry.string = hxfn.role.curCarryYuanbao.toCoin()+'';
        this.txtBank.string = hxfn.role.curBankYuanbao.toCoin()+'';
    },
    Callback_BankWithdrawReq: function (msg) {    
        var result = msg.get('result');
        this.txtCarry.string = hxfn.role.curCarryYuanbao.toCoin()+'';
        this.txtBank.string = hxfn.role.curBankYuanbao.toCoin()+'';
        if(result==0){
            
            hxjs.module.ui.hub.LoadDlg_Info(hxdt.setting.lang.Bank_Get_Success+Number(msg.get('money')).toCoin()+'元宝','提示');
        }
    },
    Callback_BankSaveReq: function (msg) {    
        var result = msg.get('result');
        this.txtCarry.string = hxfn.role.curCarryYuanbao.toCoin()+'';
        this.txtBank.string = hxfn.role.curBankYuanbao.toCoin()+'';
        if(result==0){
            hxjs.module.ui.hub.LoadDlg_Info(hxdt.setting.lang.Bank_Save_Succes+Number(msg.get('money')).toCoin()+'元宝','提示');
        }
    }
});