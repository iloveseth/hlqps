import UIItemRoleInfo from "./UIItemRoleInfoTS";
import { hxjs } from "../../../../HXJS/HXJS";
import { hxfn } from "../../../FN/HXFN";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIRoleInfo extends cc.Component 
{
    @property({type:UIItemRoleInfo})
    private conItemRole:UIItemRoleInfo = null;

    @property({type:cc.Node})
    private btnGold: cc.Node = null;
    @property({type:cc.Node})
    private btnYuanbao: cc.Node = null;
    @property({type:cc.Node})
    private btnRoomCard: cc.Node = null;
    @property({type:cc.Node})
    private btnBank: cc.Node = null;

    private scrItemRole:UIItemRoleInfo = null;

    
    // LIFE-CYCLE CALLBACKS://///////////////////////////////////////////////////
    // onLoad () {},
    start () {
        this.scrItemRole = this.conItemRole;//.getComponent('UIItemRoleInfoTS');
        
        this.btnGold.getComponent('UIButton').SetInfo(function(){hxjs.util.Notifier.emit('open_shop',1)});
        this.btnBank.getComponent('UIButton').SetInfo(function(){hxjs.util.Notifier.emit('open_shop',3)});//btnYuanbao
        // this.btnRoomCard.getComponent('UIButton').SetInfo(function(){hxjs.util.Notifier.emit('open_shop')});
        this.btnYuanbao.getComponent('UIButton').SetInfo(function(){hxjs.util.Notifier.emit('open_shop')});//btnBank
        
        this.UpdateInfo();
        
        this.HandleNotify(true);
    }
    // update (dt) {},

    onDestroy(){
        this.HandleNotify(false);
    }
    /////////////////////////////////////////////////////////////////////////////

    
    //  by  lzh
    private HandleNotify (isHandle:Boolean){
        if(isHandle) {
            hxjs.util.Notifier.on('Role_Update-Coin', this.UpdateInfo, this);
            hxjs.util.Notifier.on('Role_Update', this.UpdateInfo, this);
            hxjs.util.Notifier.on('UserData_Update',this.UpdateUserData,this);
        }
        else {
            hxjs.util.Notifier.off('Role_Update-Coin', this.UpdateInfo, this);
            hxjs.util.Notifier.off('Role_Update', this.UpdateInfo, this);
            hxjs.util.Notifier.off('UserData_Update',this.UpdateUserData,this);
        }
    }

    private UpdateInfo (){
        this.scrItemRole.SetInfo ({'userData': hxfn.role.curRole, 'goldenInfo': hxfn.role.curGoldenInfo});
    }

    private UpdateUserData(){
        this.scrItemRole.SetInfo({'userData': hxfn.role.curUserData.playerData, 'goldenInfo': hxfn.role.curUserData.goldenInfo});
    }
}
