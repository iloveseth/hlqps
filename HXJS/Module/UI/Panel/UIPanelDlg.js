cc.Class({
    extends: cc.Component,

    properties: {
        txtTitle: {
            default: null,
            type: cc.Label,
            override: true,
        },
        txtInfo: {
            default: null,
            type: cc.Label,
            override: true,
        },
        btnClose: {
            default: null,
            type: require('UIButton'),//cc.Button,
            override: true,
        },
        
        cancelEvt:{
            default:null,
            type:cc.callFunc,
            serializable: false,
            visible: false,
            override: true,
        },
    },

    onLoad: function () {
    },

    Init () {
        if(this.btnClose)
            this.btnClose.getComponent('UIButton').SetInfo(this.Close.bind(this));
        
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        //     this.opacity = 128;
        //     var delta = event.touch.getDelta();
        //     this.x += delta.x;
        //     this.y += delta.y;
        // }, this.node);

        // this.node.on(cc.Node.EventType.TOUCH_END, function () {
        //     this.opacity = 255;
        // }, this.node);
    },
    
    Close:function () {
        cc.log('===> close dialog ui!');
          
        // setTimeout(function () {
        //   this.node.destroy();
        // }.bind(this), 5000);
        
        hxjs.module.ui.hub.Unload (this.node);

        if(this.cancelEvt)
            this.cancelEvt();
    },

    SetBasicInfo (info,title, cancelEvt) {
        var titlestr = title==null?'提示':title;
        if(this.txtTitle)
        this.txtTitle.string = title;
        if(this.txtInfo)
        this.txtInfo.string = info;
    },

    PlayOpenAnim(){
        var animation = this.node.getComponent(cc.Animation);
        if(animation != null)
            animation.play('Popup');
    }
});