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

        state:[cc.Node],
        stateNum: null,
    },

    // use this for initialization
    onLoad: function () {
        this.stateNum = this.state.length;
    },

    SetState(idx){
        if(idx >= this.stateNum){
            return;
        }
        this.Reset();
        this.state[idx].active = true;
    },

    Reset(){
        this.state.forEach(function(e) {
            e.active = false;
        }, this);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
