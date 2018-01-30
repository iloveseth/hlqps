import { hxfn } from '../../../FN/HXFN';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // display ----------------
        // btnEnter:cc.Node,
        //groupNums:cc.Node,
        //txtFee:cc.Label,
        editFee:cc.EditBox,
        btnOk:require('UIButton'),
        // nondisplay -------------
        //arrayFee:{default: null, serializable: false, visible: false,},
        //MAXNUM:{default: null, serializable: false, visible: false,},
    },

    onLoad: function () {
        // base func
        this.OnInit('设置学费');//'ui_lobby_fn_close', 
        
        hxfn.adjust.AdjustLabel(this.node);
        this.editFee.string='';
        //this.groupNums.getComponent('UIGroup').SetInfo(this.SelectButton.bind(this),['0','1','2','3','4','5','6','7','8','9','确定','删除']);
        // this._labelIdx = 0;
        //this.arrayFee = new Array();
        //this.txtFee.string = '';
        //this.MAXNUM = 6;
        this.btnOk.SetInfo(function(){
            this.ConfirmFee();

        }.bind(this));
    },

    SelectButton: function (idx) {

        if(idx == 10){//确定
            this.ConfirmFee();
            this.Close();
            return;
        }
        if(idx == 11) {//删除
            this.arrayFee.pop();
            this.txtFee.string = this.arrayFee.join('');
            return;
        }
        if(this.arrayFee.length == this.MAXNUM){
            return;
        }
        this.arrayFee.push(idx);
        this.txtFee.string = this.arrayFee.join('');
    },

    ConfirmFee(){
        cc.log(this.editFee.string);
        var tuition = parseInt(this.editFee.string);
        if(tuition > hxfn.role.curUserData.goldenInfo.yuanbao){
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Dlg_Check_Bankruptcy4Ingot');
            return;
        }
 
        if(tuition < 0 || isNaN(tuition)){
            hxjs.module.ui.hub.LoadDlg_Info('请输入正确的学费！','提示');
            return;
        }
        // if(parseInt(hxfn.role.curUserData.goldenInfo.yuanbao) + parseInt(hxfn.role.curUserData.goldenInfo.bankYuanbao) < 3000){
        //     hxjs.module.ui.hub.LoadDlg_Info('自身元宝余额不能低于3000','提示');
        //     return;
        // }
        //if(tuition>hxfn.role.curCarryYuanbao){
        //    hxfn.comn.IngotNotEnough();
        //    return;
       // }


        hxfn.five.SetFee(tuition);
        this.Close();
    },
});