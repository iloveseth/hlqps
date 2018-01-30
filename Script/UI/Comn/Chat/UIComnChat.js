import { Enum_ChatType, Setting_Battle } from '../../../DT/DD/Setting_Battle';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // [display]
        groupMenu: require('UIGroup'),
        labelName: cc.Label,
        imgAvatar: cc.Sprite,
        scrollChatMsg: require('UIScrollView'),
        scrollChatFace: require('UIScrollView'),
        scrollChatHistory: require('UIScrollView'),
        btnSend: require('UIButton'),
        editMsg: cc.EditBox
    },
    SelectChatMsg(idx) {

        //发送请求
        var postData = {
            chatMsg: Setting_Battle.ChatMsgs[idx].txt,
            chatType: Enum_ChatType.CHAT_MSG,
        };
        hxfn.net.Sync(
            postData,
            'PrimChat',
            hxdt.msgcmd.PrimChat//150
        );
        this.Close();
    },
    SelectChatFace(idx) {
        //发送请求
        var postData = {
            chatMsg: Setting_Battle.ChatFaces[idx],
            chatType: Enum_ChatType.CHAT_FACE,
        };
        hxfn.net.Sync(
            postData,
            'PrimChat',
            hxdt.msgcmd.PrimChat//150
        );
        this.Close();
    },
    SelectChatHistory(idx) {

    },
    GetAtalas(icon) {
        if (parseInt(icon) > 0 && parseInt(icon) <= 20) {
            return 'avatars_self'
        }
        var sex = icon.substr(5, 1);
        var idx = parseInt(icon.substr(7));
        if (sex === 'F' && idx >= 1 && idx < 256) {
            return 'avatars_1'
        }
        if (sex === 'M' && idx >= 1 && idx <= 256) {
            return 'avatars_2';
        }
        if (sex === 'M' && idx >= 266 && idx <= 512) {
            return 'avatars_3';
        }
        if (sex === 'F' && idx >= 257 && idx <= 383) {
            return 'avatars_4'
        }
        if (sex === 'M' && idx >= 513 && idx <= 641) {
            return 'avatars_4'
        }
        if (sex === 'F' && idx >= 384 && idx <= 471) {
            return 'avatars_5'
        }
    },
    onLoad: function () {
        this.OnInit('');// base func
        hxfn.adjust.AdjustLabel(this.node);



        this.labelName.string = hxfn.role.curUserData.playerData.nickName;
        var strAvatar = hxfn.role.curUserData.playerData.playerIcon;
        if (strAvatar.indexOf('icon') == 0) {
            hxjs.module.asset.LoadAtlasSprite(this.GetAtalas(strAvatar), strAvatar, this.imgAvatar);
        }
        else {
            hxjs.module.asset.LoadNetImg(strAvatar, this.imgAvatar);
        }


        this.btnSend.SetInfo(function () {
            if (this.editMsg.string == null || this.editMsg.string.length == 0) {
                hxjs.module.ui.hub.LoadDlg_Info('聊天内容不能为空！', '提示');
            }
            else {
                //发送请求
                var postData = {
                    chatMsg: hxfn.help.CheckSensitive(this.editMsg.string),
                    chatType: Enum_ChatType.CHAT_TEXT,
                };
                hxfn.net.Sync(
                    postData,
                    'PrimChat',
                    hxdt.msgcmd.PrimChat//150
                );
                this.Close();
            }
        }.bind(this)
        );


        //初始历史聊天

        this.scrollChatMsg.SetInfo(Setting_Battle.ChatMsgs, this.SelectChatMsg.bind(this));
        this.scrollChatFace.SetInfo(Setting_Battle.ChatFaces, this.SelectChatFace.bind(this));
        this.groupMenu.SetInfo(function (idx) {

            if (idx == 0) {
                this.scrollChatMsg.node.active = true;
                this.scrollChatFace.node.active = false;
                this.scrollChatHistory.node.active = false;
            }
            else if (idx == 1) {
                this.scrollChatMsg.node.active = false;
                this.scrollChatFace.node.active = true;
                this.scrollChatHistory.node.active = false;
            }
            else if (idx == 2) {
                this.scrollChatMsg.node.active = false;
                this.scrollChatFace.node.active = false;
                this.scrollChatHistory.node.active = true;
                this.scrollChatHistory.SetInfo(hxfn.help.historys, this.SelectChatHistory.bind(this));
                this.scrollChatHistory.SetToBottom();
            }
        }.bind(this));
    },
})