//!!!!!! 临时的，只是为了在牛牛选牌算分时处理多个对象的选择与取消选择操作

cc.Class({
    extends: cc.Component,

    properties: {
        toggles: [cc.Toggle],

        togglesName: {
            default: [],
            serializable: false,
            visible: false,
        },

        //多选模式：即比如6项里最多选择3项
        isSingleOrMultSelect: {
            default: false,
            serializable: false,
            visible: false,
        },

        //多选模式下需要记录的参数
        maxSelected: -1,
        curSelecteds: 0,
    },

    onLoad: function () {

    },

    ClickBtn:function (evt) {
        //play sound
        hxjs.module.sound.PlayUI_Button();
        
        // cc.log('~~~~~~~~~~~~~~~~~~evt.target.name : ' + evt.target.name);
        // cc.log('~~~~~~~~~~~~~~~~~~evt.target.name : ' + typeof evt.target);
        // let str = evt.target.name;
        // let idx = parseInt(str.charAt(str.length - 1));//-1;
        let idx = this.togglesName.indexOf(evt.target.name);
        // cc.log('~~~~~~~~~~~~~~~~~~toggles : ' + this.toggles[0].name);
        // cc.log('~~~~~~~~~~~~~~~~~~togglesName : ' + this.togglesName[0]);
        // cc.log('~~~~~~~~~~~~~~~~~~idx : ' + idx);
        
        // if(this.curIdx == idx)
        //     return;

        var toggle = evt.detail;
        // cc.log('evt.idx: ' + this.toggles.indexOf(toggle));
        // cc.log('evt.target: ' + toggle);
        // cc.log('evt.target: ' + toggle.name);
        cc.log('toggle.isChecked: ' + toggle.isChecked);

        
        // this.callback(idx, toggle.isChecked);
        // // this.UpdateCheckedNum(toggle.isChecked);
        this.SetSelectIdxInternal(idx, toggle.isChecked);
    },

    SetInfo (cb, names = null) {
        this.curSelecteds = 0;
        
        // this.Init();
        for (var j = 0; j < this.toggles.length; j++) {
            let e = this.toggles[j];
            if(e != null) {
                e.node.on('toggle', this.ClickBtn, this);
                let name = e.name.replace('<Toggle>','')
                this.togglesName[j] = name;
            }
        };

        // if(names != null) {
        //     for (var i = 0; i < names.length; i++) {
        //         let e = this.toggles[i];
        //         cc.log('UIGroupToggle names[i]: ' + names[i]);
        //         if(e != null){
        //             // e.getComponent('UIButton').SetName(names[i]);
        //         }
        //     }
        // }

        for (var i = 0; i < this.toggles.length; i++) {
            let e = this.toggles[i];
            if(e != null){
                e.isChecked = false;
            }
        }

        this.callback = cb;
    },

    SetAllUnChecked () {
        for (var i = 0; i < this.toggles.length; i++) {
            let e = this.toggles[i];
            if(e != null){
                e.isChecked = false;
            }
        }
        this.curSelecteds = 0;
    },

    //限制大于等于该索引的成员点击事件
    // Setlimit (idx) {
    //     for (var i = 0; i < this.toggles.length; i++) {
    //         let e = this.toggles[i];
    //         if(e != null) {
    //             e.getComponent('UIButton').ToggleEnable(i<idx);
    //         }
    //     };
    // }

    SetEnable (isEnable) {
        this.toggles.forEach(function(element) {
            element.interactable = isEnable;
        }, this);
    },

    SetSelectIdxInternal:function (idx, isChecked) {
        if(this.callback!=null) {
            this.callback(idx, isChecked);
        }
        // cc.log("SetSelectIdxInternal this.isSingleOrMultSelect: " + this.isSingleOrMultSelect);
        // cc.log("SetSelectIdxInternal this.maxSelected: " + this.maxSelected);
        // if(!this.isSingleOrMultSelect && this.maxSelected != -1/*已经初始化*/)
            this.UpdateCheckedNum(isChecked);
    },

    UpdateSelectIdx (idx, isChecked) {
        this.toggles[idx].isChecked = isChecked;
        // this.callback(idx, isChecked);

        //HACK: 实现最多选3（n）张的功能
        cc.log("SetSelectIdx this.isSingleOrMultSelect: " + this.isSingleOrMultSelect);
        cc.log("SetSelectIdx this.maxSelected: " + this.maxSelected);
        if(!this.isSingleOrMultSelect && this.maxSelected != -1/*已经初始化*/)
            this.UpdateCheckedNum(isChecked);
    },

    OnReset () {
        // this.maxSelected = -1;
        this.curSelecteds = 0;
        this.SetEnable(true);
    },


    //HACK: 实现最多选3（n）张的功能
    GetToggle (idx) {
        return this.toggles[idx];
    },

    SetMaxSelected (max) {
        this.maxSelected = max;
    },

    UpdateCheckedNum(isChecked) {
        if(isChecked)
            this.curSelecteds+=1;
        else
            this.curSelecteds-=1;

        var isEnable = !(this.curSelecteds>=this.maxSelected);
        // cc.log("UIGroupToggle curSelected items: " + this.curSelecteds);
        // cc.log("UIGroupToggle curSelected items: " + this.maxSelected);
        // cc.log("UIGroupToggle isEnable: " + isEnable);
        this.ToggleRestEnable(isEnable);
    },

    ToggleRestEnable:function(isEnable){
        for (var i = 0; i < this.toggles.length; i++) {
            var element = this.toggles[i];

            //如果允许，则所有的tog皆可以点击
            if(isEnable) {
                element.interactable = true;
            }
            //如果不允许，则只有已经选中的可以点击，从而撤销选中之后，其他的才可以点击
            else {
                if(!element.isChecked){
                    element.interactable = false;
                    cc.log("@@@@@@ element(isChecked:false) name: " + element.name);
                }
                else {
                    element.interactable = true;
                    cc.log("@@@@@@ element name(isChecked:true): " + element.name);
                }
            }
            // if(!element.isChecked)
            //      element.interactable = isEnable;
        }
    },
});