import { hxjs } from '../../../../HXJS/HXJS';
import { hxfn } from '../../../FN/HXFN';


cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        btnStartGame: require('UIButton'),
        togStranger: require('UIToggle'),
        txtDifen: cc.EditBox,
        txtMoney: cc.Label,
    },

    ////////////////////////////////////////////////////////////////////////////////
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    // update (dt) {},
    start () {
        this.OnInit('创建房间');// base func//'ui_lobby_fn_close', 
        this.btnStartGame.SetInfo(this.StartGame.bind(this),'开始游戏');
        
        this.txtMoney.string = hxfn.role.curCarryYuanbao.toCoin();
    },
    ////////////////////////////////////////////////////////////////////////////////

    StartGame(){
        //var money = parseInt(this.txtDifen.string);
        // var fee = parseInt(this.txtDifen.string);
        //
        // if(fee < 0 || isNaN(fee)){
        //     hxjs.module.ui.hub.LoadDlg_Info('请输入正确的学费！','提示');
        //     return;
        // }
        //if(fee>hxfn.role.curCarryYuanbao){
        //    hxfn.comn.IngotNotEnough();
        //    return;
        //}
        var postData = {
            crOption: {
                roomType: 1,
                gameType: 4,
                stranger: this.togStranger.GetChecked(),
                tuition: 0,
            }
        }
        hxfn.level.CreateRoomFive(postData);
    }
});
