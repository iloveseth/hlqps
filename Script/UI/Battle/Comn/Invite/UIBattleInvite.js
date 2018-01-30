import { hxfn } from '../../../../FN/HXFN';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // [display]
        groupPlayerTyp:cc.Node,
        conWeChat:cc.Node,
        conGameFriend:cc.Node,
        conGameFree:cc.Node,

        // [nondisplay]
        scr_groupPlayerTyp:null,

        scr_conWeChat:null,
        scr_conGameFriend:null,
        scr_conGameFree:null,
    },

    onLoad: function () {
        this.OnInit('邀请好友');// base func

        this.scr_groupPlayerTyp = this.groupPlayerTyp.getComponent('UIGroup');
        this.scr_groupPlayerTyp.SetInfo(this.SelectTyp.bind(this),['微信好友','空闲玩家']);//,'邀请牌友'

        this.conWeChat.active = true;
        this.conGameFriend.active = true;
        this.conGameFree.active = true;
        this.scr_conWeChat = this.conWeChat.getComponent('UIBattleInvite_WeChat');
        // this.scr_conGameFriend = this.conGameFriend.getComponent('UIBattleInvite_InGame');
        this.scr_conGameFree = this.conGameFree.getComponent('UIBattleInvite_InGame');
    },

    start:function () {
        this.scr_conWeChat.OnInit();
        // this.scr_conGameFriend.OnInit(hxfn.battle.Enum_PlayerTyp.Friend);//,'随机查找10名牌友'
        this.scr_conGameFree.OnInit(hxfn.battle.Enum_PlayerTyp.Free);//,'随机查找10名空闲玩家'

        this.scr_groupPlayerTyp.SetDefaultIdx(0);
    },

    SelectTyp:function (idx){
        this.conWeChat.active = false;
        this.conGameFriend.active = false;
        this.conGameFree.active = false;

        switch (idx) {
            case 0:
            this.conWeChat.active = true;
            break;
            // case 1:
            // this.conGameFriend.active = true;
            // this.scr_conGameFriend.UpdateInfo();
            // break;
            case 1:
            this.conGameFree.active = true;
            this.scr_conGameFree.UpdateInfo();
            break;
            default:
            break;
        }
    }
});
