// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        conRoles:[cc.Node],
        groupTabs: require('UIGroup'),
        btnBindSetting: require('UIButton'),
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.OnInit('个人信息');//'ui_lobby_fn_close', 

        this.groupTabs.SetInfo(this.SelectPanels.bind(this));
        if(hxfn.global.detailIndex && hxfn.global.detailIndex!=0){
            this.groupTabs.SetDefaultIdx(hxfn.global.detailIndex);
        }
        else{
            this.groupTabs.SetDefaultIdx(0);
        }
        
        this.btnBindSetting.node.active = hxfn.role.curUserData.playerData.inviteId ? true : false;
    },
    
    SelectPanels(idx){
        cc.log(idx);
        this.Reset();
        this.conRoles[idx].active = true;
    },

    Reset(){
        hxfn.global.HandleNodes(this.conRoles,false);
    },

    // update (dt) {},
});
