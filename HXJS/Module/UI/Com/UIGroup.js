// ！！！ 所有组内按钮的名字必须不同

cc.Class({
    extends: cc.Component,

    properties: {
        btns: [cc.Button],

        btnsName: {
            default: [],
            serializable: false,
            visible: false,
        },

        //事实上这不是一个标准的组按钮控件，同时为了优化代码简洁度，提供了索引化的自由操作功能

        //标记为页签组，一旦开启，则意味着不同的页签之间的表现逻辑是关联的
        isSingleChoiceMode: false,
        //是否可以重复选择的3中情景（1，作为页签组时，优化为不可重复选择，2，计算器模式下必须可以重复选择，3，一个按钮多次点击分别响应自身的选择与取消选择状态时，必须可以重复选）
        // !!! 非页签组时，默认必须是可重复点击有效的
        isRepeatSelectEnable: true,
    },

    onLoad: function () {
        this.curIdx = -1;

        //如果单选模式，则重复点击上一次选择过的项时，是无效的
        if(this.isSingleChoiceMode){
            this.isRepeatSelectEnable = false;
        }
    },

    ClickBtn:function (evt) {
        //play sound
        hxjs.module.sound.PlayUI_Button();
        
        // cc.log('~~~~~~~~~~~~~~~~~~evt.target.name : ' + evt.target.name);
        // cc.log('~~~~~~~~~~~~~~~~~~evt.target.name : ' + typeof evt.target);
        // let str = evt.target.name;
        // let idx = parseInt(str.charAt(str.length - 1));//-1;
        let idx = this.btnsName.indexOf(evt.target.name);
        // cc.log('~~~~~~~~~~~~~~~~~~btns : ' + this.btns[0].name);
        // cc.log('~~~~~~~~~~~~~~~~~~btnsName : ' + this.btnsName[0]);
        // cc.log('~~~~~~~~~~~~~~~~~~idx : ' + idx);
        if(!this.isRepeatSelectEnable) {
            if(this.curIdx == idx)
                return;
        }

        this.curIdx = idx;

        // this.callback(idx);
        this.SetSelect(idx);
    },

    SetInfo (cb, names = null) {
        // this.Init();
        for (var j = 0; j < this.btns.length; j++) {
            let e = this.btns[j];
            if(e != null) {
                e.node.on('click', this.ClickBtn, this);
                let name = e.name.replace('<Button>','')
                this.btnsName[j] = name;
            }
        };

        if(names != null) {
            for (var i = 0; i < names.length; i++) {
                let e = this.btns[i];
                // cc.log('UIGroup names[i]: ' + names[i]);
                if(e != null)
                    e.getComponent('UIButton').SetName(names[i]);
            }
        }

        this.callback = cb;

        //默认选择第一项
        // this.callback(0);
        // if(this.isSingleChoiceMode)
        //     this.SetSelect(0);
    },

    SetSelect(idx) {
        if(this.isSingleChoiceMode) {
            var stateDis;

            for (var i = 0; i < this.btns.length; i++) {
                let e = this.btns[i];
                e.getComponent('UIButton').ToggleSelect(false);

                // stateDis = e.getComponent('UIStateDisplayer');
                // if(stateDis)
                //     stateDis.ToggleSelect(false);
            }

            if(idx >= 0) {
                this.btns[idx].getComponent('UIButton').ToggleSelect(true);

                // stateDis = this.btns[idx].getComponent('UIStateDisplayer');
                // if(stateDis)
                //     stateDis.ToggleSelect(true);
            }
        }
        this.curIdx = idx;
        if(idx >= 0)
            this.callback(idx);
    },

    //限制大于等于该索引的成员点击事件
    Setlimit (idx) {
        for (var i = 0; i < this.btns.length; i++) {
            let e = this.btns[i];
            if(e != null) {
                e.getComponent('UIButton').ToggleEnable(i<idx);

                // var stateDis = e.getComponent('UIStateDisplayer');
                // if(stateDis)
                //     stateDis.ToggleEnable(i<idx);
            }
        };
    },

    SetDefaultIdx(idx){
        // 如果传入的idx 小于0， 即通常为-1 则不选择任何一项
        this.SetSelect(idx);
    },


    //HACK 样式： 显示不同的最大个数
    SetMaxVisiable (max) {
        for (var i = 0; i < this.btns.length; i++) {
            this.btns[i].node.active = i<max;
        }
    }
});