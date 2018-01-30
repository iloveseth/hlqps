import { log } from "../../../Util/Log";

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        items: [cc.Node],
        //TODO 默认item一定是一个UIPanelItem基类派生的对象
        itemScrName: '',
        isInteractive:false,
        //以下参数为有交互的情况下适用
        isSingleSelectMode:false,
        isEnableInvalidClick: false,

        // [nondisplay]
        callback_check:{ default: null, serializable: false, visible: false},
    },

    onLoad: function () {
        // 当绑定的可视对象active状态改变时，会调用此方法（很不符合世俗约定）
        // this.Reset();
    },

    SetItem(idx, info/*如果为Null,则针对那些不需要赋值的对象*/) {
        var item = this.items[idx];
        if(item != null) {
            // item.active = true;
            hxjs.module.ui.hub.ShowCom(item);

            if(this.itemScrName == null || this.itemScrName == '') {
                cc.log("[hxjs][warn]: list element's script name can not be null or empty!!!");
            }
            else {
                var scr = item.getComponent(this.itemScrName);
                scr.SetInfo(info, idx);
            }
        }
        else {
            cc.log("[hxjs][err]: UILst has no enough items for show: " + idx);
            cc.log(this.name);
        }
    },
    
    // SetInfo(infos, itemScrName) {
    SetInfo(infos, callback_check = null) {
        if(this.isInteractive){
            this.callback_check = callback_check;
        }
        this.Reset();

        if(infos == null)
        return;
        
        for (var i = 0; i < infos.length; ++i) {
            var info = infos[i];
            
            if(i< this.items.length) {
                var item = this.items[i];
                // cc.log(item);
                hxjs.module.ui.hub.ShowCom(item);
                // cc.log('show'+ i);
                var scr = item.getComponent(this.itemScrName);
                
                if(this.isInteractive){
                    if(callback_check == null){
                        log.error('UILst: callback_check must not be null!!!!!!');
                        return;
                    }

                    if(scr) {
                        // scr.SetInfo(info,i, SetItemsState);
                        if(this.isSingleSelectMode){
                            scr.SetInfo(info,i, this.SetItemsState_Single.bind(this), this.isEnableInvalidClick);
                        }
                        else{
                            scr.SetInfo(info,i, this.SetItemsState_Mult.bind(this), this.isEnableInvalidClick);
                        }
                    }
                    else {
                        log.error("UILst: lst item panel'script is null or name is uncorrect!!!!!!");
                    }

                    //TEST
                    // if(item.getComponent('UIPanelItem') == null){
                    //     log.error('UILst: script must be UIPanelItem type!!!!!!');
                    // }
                }
                else {
                    if(scr) scr.SetInfo(info,i);
                }
            }
            else {
                //TODO: 显示对象不足,生成新的显示对象
                //cc.instantiate(this.prefabRankItem);
            }
        }
    },

    SetItemsState_Single:function (idx) {
        for (var i = 0; i < this.items.length; ++i) {
            var item = this.items[i];
            var scr = item.getComponent('UIStateDisplayer');//可优化
            if(scr!= null){
                scr.ToggleSelect(false);
            }
        }

        var stater = this.items[idx].getComponent('UIStateDisplayer');
        if(stater)
            stater.ToggleSelect(true);

        this.callback_check(idx);
    },

    SetItemsState_Mult:function (idx, isChecked) {
        var stater = this.items[idx].getComponent('UIStateDisplayer');
        if(stater)
            stater.ToggleSelect(isChecked);

        this.callback_check(idx,isChecked);
    },

    SetDefaultIdx (idx) {
        //单选,必须实现Check方法
        this.items[idx].getComponent(this.itemScrName).Check();
    },

    //默认选中多个子成员（支持多选， isSingleSelectMode = true）
    SetDefaultIdxs (idxs) {
        //多选 必须实现Check方法
        idxs.forEach(idx=>{
            if(this.items[idx])
                this.items[idx].getComponent(this.itemScrName).Check();
            else cc.error('[ui] wrong idx: ' + idx);    
        });
    },

    //专门重置选中态
    ResetSelectedStates (){
        this.items.forEach(item=>{
            // var stater = item.getComponent('UIStateDisplayer');
            // if(stater)
            //     stater.ToggleSelect(false);
            item.getComponent(this.itemScrName).ResetSelected();
        });
    },

    Reset () {
        this.items.forEach(function(element) {
            hxjs.module.ui.hub.HideCom(element);
            // cc.log('reset--------');
        }, this);
    },

    Setlimit (limitIdx){
        for (var i = 0; i < this.items.length; ++i) {
            var item = this.items[i];

            var scr = item.getComponent(this.itemScrName);
            if(scr!= null){
                scr.ToggleEnable(i<limitIdx);
            }
        }
    },
});