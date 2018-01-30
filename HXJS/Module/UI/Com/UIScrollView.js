import { isNullOrUndefined } from "util";

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        scrollView: cc.ScrollView,
        prefabRankItem: cc.Prefab,
        // rankCount: 0,
        className: cc.String,//itemScrName

        // [nondisplay]
        itemDisplayObjsCache:[],

        isInteractive:false,
        isSingleSelectMode:false,
        isImproved:false,

        callback_check:null,
    },

    onLoad: function () {
        // this.content = this.scrollView.content;
        // this.populateList();
    },

    SetInfo (iteminfos, callback_check = null) {
        this.populateList(iteminfos, callback_check);
    },
    populateList (iteminfos, callback_check = null) {
        if(this.isInteractive){
            this.callback_check = callback_check;
        }

        // HACK
        this.Clear();
        // TODO
        // this.ResetAllItems();

        // cc.log('===> UI ScrollView iteminfos.length: ' + iteminfos.length);
        if(isNullOrUndefined(iteminfos))
        return;
        
        for (var i = 0; i < iteminfos.length; ++i) {
            var info = iteminfos[i];
            // item.getComponent(className/*'RankItem'*/).init(i, info);
            var scr = this.GetDisplayObj().getComponent(this.className/*'RankItem'*/);

            if(scr){
                if(this.isInteractive){
                    if(callback_check == null){
                        cc.log('[hxjs][err] UIScrollView: callback_check must not be null!!!!!!');
                        return;
                    }
                    // scr.SetInfo(info,i, SetItemsState);
                    if(this.isSingleSelectMode && !this.isImproved){
                        scr.SetInfo(info,i, this.SetItemsState_Single.bind(this));
                    }
                    if(!this.isSingleSelectMode && !this.isImproved){
                        scr.SetInfo(info,i, this.SetItemsState_Mult.bind(this));
                    }
                    if(this.isSingleSelectMode && this.isImproved){
                        //scr.SetInfo(info,i,this.SetItemState_Single_Improved.bind(this));
                        scr.SetInfo(info,i,this.SetItemState_Single_Improved.bind(this));
                    }
                }
                else {
                    scr.SetInfo(info,i);
                }
            }
        }
    },

    //data表示一个数据结构  其中有一个名为idx的属性表示条目索引
    SetItemState_Single_Improved:function(data){
        cc.log(data);
        for (var i = 0; i < this.itemDisplayObjsCache.length; ++i) {
            var item = this.itemDisplayObjsCache[i];
            var scr = item.getComponent('UIStateDisplayer');//可优化
            if(scr!= null){
                scr.ToggleSelect(false);
            }
        }
        // this.itemDisplayObjsCache[idx].getComponent('UIStateDisplayer').ToggleSelect(true);
        var stater = this.itemDisplayObjsCache[data.idx].getComponent('UIStateDisplayer');
        if(stater)
            stater.ToggleSelect(true);

        this.callback_check(data);
    },

    SetItemsState_Single:function (idx) {
        for (var i = 0; i < this.itemDisplayObjsCache.length; ++i) {
            var item = this.itemDisplayObjsCache[i];
            var scr = item.getComponent('UIStateDisplayer');//可优化
            if(scr!= null){
                scr.ToggleSelect(false);
            }
        }
        // this.itemDisplayObjsCache[idx].getComponent('UIStateDisplayer').ToggleSelect(true);
        var stater = this.itemDisplayObjsCache[idx].getComponent('UIStateDisplayer');
        if(stater)
            stater.ToggleSelect(true);

        this.callback_check(idx);
    },

    SetItemsState_Mult:function (idx, isChecked) {
        var stater = this.itemDisplayObjsCache[idx].getComponent('UIStateDisplayer');
        if(stater)
            stater.ToggleSelect(isChecked);
        this.callback_check(idx, isChecked);
    },

    GetDisplayObj:function(){
        //1, get from cache

        //2, Create new 
        var item = cc.instantiate(this.prefabRankItem);
        // this.content.addChild(item);
        this.scrollView.content.addChild(item);
        this.itemDisplayObjsCache.push(item);

        return item;
    },

    setScrollEnabled (isEnable) {
        // this.scrollView.content.setScrollEnabled(isEnable);
        // this.scrollView.isEnable = isEnable;
        this.scrollView.enabled = isEnable;
    },

    // itemDisplayObjsCache

    ResetAllItems:function (){
        this.itemDisplayObjsCache.forEach(function(element) {
            element.active = false;
        }, this);
    },

    SetDefaultIdx (idx) {
        //如果单选，则必须实现Check方法
        this.itemDisplayObjsCache[idx].getComponent(this.className).Check();
    },

    Clear(){
        this.itemDisplayObjsCache.forEach(function(element) {
            element.destroy();
        }, this);

        // this.scrollView.content.removeAllChildren();
        this.itemDisplayObjsCache = [];
    },
    SetToBottom(){
        this.scrollView.scrollToBottom();
    }
});