cc.Class({
    extends: require('UIPanelDlg'),

    properties: {
        txtUsrTitle: {
            default: null,
            type: cc.Label,
        },
        txtPsw1Title: {
            default: null,
            type: cc.Label,
        },
        txtPsw2Title: {
            default: null,
            type: cc.Label,
        },
        btnOK: cc.Node,

        IptUsr: {
            default: null,
            type: cc.EditBox,
        },
        IptPsw1: {
            default: null,
            type: cc.EditBox,
        },
        IptPsw2: {
            default: null,
            type: cc.EditBox,
        },

        usr : null,
        psw1 : null,
        psw2 : null,
    },
    
    // use this for initialization
    onLoad () {
        this.Init();

        this.txtUsrTitle.string = '用户名';
        this.txtPsw1Title.string = '密码';
        this.txtPsw2Title.string = '密码';

        this.usr = null;
        this.psw1 = null;
        this.psw2 = null;

        var btn_OK = this.btnOK.getComponent('UIButton');
        btn_OK.SetInfo(this.Confirm.bind(this),'注册');
        // btn_OK.SetName(GameSetting.ACCOUNT_REGIST);
    },

    Confirm () {
        if(this.usr == null)
            hxjs.module.ui.hub.LoadDlg_Info('用户名输入无效','提示');
        else {
            if(this.psw1 == null || this.psw2 == null) {
                hxjs.module.ui.hub.LoadDlg_Info('密码输入无效！','提示');
            }
            else {
                if(this.psw1 === this.psw2){
                    hxjs.module.ui.hub.Unload(this.node);
                    // cc.log('~~~~~~~ usr: ' + this.usr);
                    // cc.log('~~~~~~~ psw1: ' + this.psw1);
                    // cc.log('~~~~~~~ psw2: ' + this.psw2);
                    cc.sys.localStorage.setItem('Usr',this.usr);
                    cc.sys.localStorage.setItem('Psw',this.psw1);

                    hxjs.module.ui.hub.LoadDlg_Info('注册成功！','提示');
                }
                else {
                    hxjs.module.ui.hub.LoadDlg_Info('两次密码输入不一致，请重新输入！','提示');
                }
            }
        }
    },

    InputUsrEnd (evt) {
        this.usr = this.IptUsr.string;
    },
    InputPsw1End (evt) {
        this.psw1 = this.IptPsw1.string;
    },
    InputPsw2End (evt) {
        this.psw2 = this.IptPsw2.string;
    },
});