cc.Class({
    extends: require('UIPanelStack'),//cc.Component,

    properties: {

        cons:[cc.Node],

    },

    // use this for initialization
    onLoad: function () {

        this.OnInit('');
        this.node.on('ClosePop',this.Close.bind(this));
        this.node.on('SwitchState',this.ConfigureState.bind(this));
        this.ConfigureState();
    },

    ConfigureState(){
        this.Reset();
        this.cons[hxfn.redpack.curPanel].active = true;
    },

    Reset(){
        for(var i=0;i!=this.cons.length;++i){
            this.cons[i].active = false;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
