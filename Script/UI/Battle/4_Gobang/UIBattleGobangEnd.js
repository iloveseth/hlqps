import { hxfn } from '../../../FN/HXFN';
import { log } from '../../../../HXJS/Util/Log';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        btnConfirm:require('UIButton'),
        txtTuition: cc.Label,
        conFee:cc.Node,
        txtLeft: cc.Label,
        txtRight: cc.Label,
        txtTime: cc.Label,
        lstRole: cc.Node,
        
        src_lstRole: {default: null, serializable: false, visible: false,}, 
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        this.OnInit('结算');//'ui_lobby_fn_close', 

        this.src_lstRole = this.lstRole.getComponent('UILst');
        this.btnConfirm.SetInfo(this.Confirm.bind(this),'确认');
        this.txtLeft.string = '负';
        this.txtRight.string = '胜';

        if(hxfn.five.resultRoles) {
            this.src_lstRole.SetInfo(hxfn.five.resultRoles); 
            hxfn.five.resultRoles = null;
        }
        else {
            log.error('Gobang result resultRoles should be not null!!!');
        }
        
        //正常打完不扣学费，即只有在一方认输的情况下才会发生费用的加减
        if(hxfn.five.isGiveup) {
            var result = Math.abs(hxfn.five.msgResult.playerRecords[0].ringCoin);
            this.conFee.active = true;
            this.txtTuition.string = result+'';
            cc.log(this.txtTuition.string);
        }
        else {
            this.conFee.active = false;
        }
    },
    
    start:function () {
        
    },

    // update (dt) {},

    Confirm(){
        // if(!hxfn.five.IsMaster(hxfn.role.curUserData.playerData.playerId)){
        //     hxfn.level.QuitRoom();
        // }
        this.Close();
    },
});
