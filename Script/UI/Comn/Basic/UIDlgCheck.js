import { hxjs } from '../../../../HXJS/HXJS';

cc.Class({
    extends: require('UIPanelDlg'),

    properties: {
        btnConfirm: {
            default : null,
            type: cc.Node,
            override: true,
        },
        btnCancel: {
            default : null,
            type: cc.Node,
            override: true,
        },

        confirmEvt:{
            default:null,
            type:cc.callFunc,
            serializable: false,
            visible: false
        },
        // cancelEvt:{
        //     default:null,
        //     type:cc.callFunc,
        //     serializable: false,
        //     visible: false
        // },

        btn_Confirm:{default: null, serializable: false, visible: false,},
        btn_Cancel:{default: null, serializable: false, visible: false},
    },
    
    onLoad:function () {
        this.Init();

        if(this.btnConfirm){
            this.btn_Confirm = this.btnConfirm.getComponent('UIButton');
            this.btn_Confirm.SetInfo(this.Confirm.bind(this));
        }
        if(this.btnCancel){
            this.btn_Cancel = this.btnCancel.getComponent('UIButton');
            this.btn_Cancel.SetInfo(this.Cancel.bind(this));
        }
    },
    
    Confirm:function () {
        cc.log('~~~~~~~~~~~~~~~~Confirm');
        hxjs.module.ui.hub.Unload(this.node);
        
        if(this.confirmEvt != null) 
        this.confirmEvt();
    },
    
    Cancel:function () {
        cc.log('~~~~~~~~~~~~~~~~Cancel');
        hxjs.module.ui.hub.Unload(this.node);
        
        if(this.cancelEvt != null)
        this.cancelEvt();
    },
    
    SetInfo (info, confirmEvt, cancelEvt, title, confirmBtnName='确认', cancelBtnName='取消', extraData = null) {
        //Base func
        //??????
        // super.SetInfo(info, title);
        // Super.call(this, title, info);
        this.PlayOpenAnim();
        this.SetBasicInfo(info, title, cancelEvt);
        this.confirmEvt = confirmEvt;
        this.cancelEvt = cancelEvt;
        // cc.log('~~~~~~~~~~~~~~~~this.confirmEvt: ' + this.confirmEvt);

        if(this.btnConfirm){
            this.btn_Confirm.SetName(confirmBtnName);
        }
        if(this.btn_Cancel){
            this.btn_Cancel.SetName(cancelBtnName);
        }
    },

    // SetInfoBase(info, confirmEvt, cancelEvt, title, confirmBtnName='确认', cancelBtnName='取消', extraData = null) {
    //     this.SetInfo(info, confirmEvt, cancelEvt, title, confirmBtnName, cancelBtnName);
    // }
});