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
        editId:cc.EditBox,
        btnSearch:require('UIButton'),
    },

    // use this for initialization
    onLoad: function () {
        this.btnSearch.SetInfo(function(){
            hxjs.util.Notifier.emit('SearchRedPack',this.editId.string);
        }.bind(this));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
