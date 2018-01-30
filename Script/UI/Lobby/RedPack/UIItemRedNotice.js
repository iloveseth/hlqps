cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        idx:null,
        callback:null,
        txtMoney:cc.Label,
        txtWord:cc.Label,
        imgLogo:cc.Node,
        btnAgree:require('UIButton'),
        btnCancel:require('UIButton'),

    },

    // use this for initialization
    onLoad: function () {
        // this.node.on(cc.Node.EventType.TOUCH_END,function(){
        //     this.callback(this.idx);
        // }.bind(this));
        // this.btnAgree.SetInfo(function(){hxjs.util.Notifier.emit('AgreeRedPack')});
        // this.btnCancel.SetInfo(function(){hxjs.util.Notifier.emit('CancelRedPack')});

        // var agreeData = {
        //     idx:this.idx,
        //     idy:0,
        // }

        // var cancelData = {
        //     idx:this.idx,
        //     idy:1
        // }
        // cc.log(this.btnAgree);
        // cc.log(this.btnCancel);
        // this.btnAgree.SetInfo(function(){this.callback(agreeData);}.bind(this));
        // this.btnCancel.SetInfo(function(){this.callback(cancelData);}.bind(this));
    },

    SetInfo(info, idx, callback){
        this.idx = idx;
        this.callback = callback;
        this.txtWord.string = info.content;
        this.txtMoney.string = info.yuanbao + '元宝';
        var agreeData = {
            idx:this.idx,
            idy:0,
        }
        var cancelData = {
            idx:this.idx,
            idy:1
        }
        this.btnAgree.SetInfo(function(){this.callback(agreeData);}.bind(this));
        this.btnCancel.SetInfo(function(){this.callback(cancelData);}.bind(this));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
