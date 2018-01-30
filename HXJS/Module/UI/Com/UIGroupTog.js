// ！！！ 所有组内按钮的名字必须不同
cc.Class({
    extends: cc.Component,

    properties: {
        togs: [cc.Toggle],

        btnsName: {
            default: [],
            serializable: false,
            visible: false,
        },

        //单选模式时，选中之后不能对同一个toggle取消选择
        isSingleChoiceMode: false,
        isRepeatSelectEnable: {default: true, serializable: false, visible: false,},
        cacheCheckedOnes: {default: null,serializable: false,visible: false,},
    },

    Init:function(){
        //如果单选模式，则重复点击上一次选择过的项时，是无效的
        this.isRepeatSelectEnable = !this.isSingleChoiceMode;
        
        //单选和多选模式的默认状态初始化
        this.SeDefaultIdx4Multi(null);
        //单选
        this.SetDefaultIdx(-1);
    },

    ClickBtn:function (evt) {
        //play sound
        hxjs.module.sound.PlayUI_Button();

        let idx = this.btnsName.indexOf(evt.target.name);
        
        // if(!this.isRepeatSelectEnable) {
        //     if(this.curIdx == idx)
        //         return;
        // }
        this.curIdx = idx;
        this.SetSelect(idx);
    },

    SetInfo (cb, names = null) {
        // ！！！ ！！！初始化必须在SetInfo的开始，因为脚本的SetInfo方法执行先于视觉对象的onLoad方法
        this.Init();

        for (var j = 0; j < this.togs.length; j++) {
            let e = this.togs[j];
            if(e != null) {
                e.node.on('toggle', this.ClickBtn, this);
                let name = e.name.replace('<Toggle>','')
                this.btnsName[j] = name;
            }
        };

        if(names != null) {
            for (var i = 0; i < names.length; i++) {
                let e = this.togs[i];
                // cc.log('UIGroup names[i]: ' + names[i]);
                if(e != null)
                    e.getComponent('UIToggle').SetName(names[i]);
            }
        }

        this.callback = cb;

        //XXX 默认选择第一项
        //!!! 必须通过SetDefaultIdx进行显式设置
        // if(this.isSingleChoiceMode)
        //     this.SetSelect(0);
    },

    SetSelect(idx) {
        if(this.isSingleChoiceMode) {
            // var stateDis;

            for (var i = 0; i < this.togs.length; i++) {
                let e = this.togs[i];
                e.getComponent('UIToggle').SetChecked(false);
                e.getComponent('UIToggle').ToggleEnable(true);
                // e.interactable = true;

                // stateDis = e.getComponent('UIStateDisplayer');
                // if(stateDis)
                //     stateDis.ToggleSelect(false);
            }

            if(idx >= 0) {
                this.togs[idx].getComponent('UIToggle').SetChecked(true);
                this.togs[idx].getComponent('UIToggle').ToggleEnable(false);
                // this.togs[idx].interactable = false;

                // stateDis = this.togs[idx].getComponent('UIStateDisplayer');
                // if(stateDis)
                //     stateDis.ToggleSelect(true);
            }

            if(this.callback == null){
                cc.log('[hxjs][err] UITogRroup has not been inited!!!!!! with name: ' + this.name);
                return;
            }
            this.callback(idx);
        }
        else {
            if(idx >= 0) {
                var isChecked = this.togs[idx].getComponent('UIToggle').GetChecked()
                this.UpdateCheckedOnes(idx, isChecked);

                // stateDis = this.togs[idx].getComponent('UIStateDisplayer');
                // if(stateDis)
                //     stateDis.ToggleSelect(isChecked);
            }

            if(this.callback == null){
                cc.log('[hxjs][err] UITogRroup has not been inited!!!!!! with name: ' + this.name);
                return;
            }
            this.callback(this.GetAllChecked());
        }
    },

    SetDefaultIdx(idx){
        // 如果传入的idx 小于0， 即为-1 则不选择任何一项
        if(idx === -1) {
            this.curIdx = -1;
            this.togs.forEach(function(element) {
                element.isChecked = false;
            }, this);
        }
        else {
            this.SetSelect(idx);
        }
    },
    SeDefaultIdx4Multi (idxs){
        if(idxs == null) idxs = [];
        this.cacheCheckedOnes = idxs;
        this.togs.forEach(function(element) {
            element.getComponent('UIToggle').SetChecked(false);
        }, this);

        idxs.forEach(function(idx) {
            this.SetSelect(idx);
        }.bind(this), this);
    },

    /////////////////////////////////////////////////////////////////////////////////////
    //for 多选模式，取得所有所选的Idxs
    UpdateCheckedOnes:function (togidx, isChecked) {
        if(isChecked) {
            if(this.cacheCheckedOnes.indexOf(togidx) === -1)
                this.cacheCheckedOnes.push(togidx);
        }
        else {
            if(this.cacheCheckedOnes.indexOf(togidx) !== -1)
                this.cacheCheckedOnes.remove(togidx);
        }
    },
    GetAllChecked:function (){
        return this.cacheCheckedOnes;
    }
});