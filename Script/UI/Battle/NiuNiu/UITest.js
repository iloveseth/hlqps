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

        testUnit:[cc.Node],
        scrollTest:cc.ScrollView,
        prefabItem:cc.Prefab,
        btnApply:require('UIButton'),
        btnCancel:require('UIButton'),
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad: function () {
        this.OnInit('测试');

        this.btnClose.getComponent('UIButton').SetInfo(this.Quit.bind(this));
        this.btnApply.SetInfo(this.Apply.bind(this),'应用');
        this.btnCancel.SetInfo(this.Cancel.bind(this),'取消');
    },
    start () {
        hxfn.test.LogInfo();
        for(var idx = 0;idx!=hxfn.test.testName.length;++idx){
            var item = cc.instantiate(this.prefabItem);
            this.scrollTest.content.addChild(item);
            item.getComponent('UIItemTest').SetName(hxfn.test.testName[idx]);
            item.getComponent('UIItemTest').SetValue(hxfn.test.testValue[idx]);
        }
    },

    Quit: function(){
        this.Apply();
        this.Close();
    },

    Apply (){
        var idx = 0;
        this.scrollTest.content.children.forEach(function(element){
            var value = parseFloat(element.getComponent('UIItemTest').GetValue());
            hxfn.test.testValue[idx++] = value;
        },this);
        hxfn.test.SetInfo();
    },
    Cancel () {
        
    }

    // update (dt) {},
});
