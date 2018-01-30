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

        delay: {
            default: 3,
        },
        efx: cc.ParticleSystem,
    },

    // use this for initialization
    onLoad: function () {
        var _this = this;
        this.scheduleOnce(function(){
            //this.doSomething();
            _this.efx.resetSystem();
            hxjs.module.effect.efxMgr.LoadParticle();
        }, _this.delay);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
