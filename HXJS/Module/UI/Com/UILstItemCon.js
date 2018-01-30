import { hxjs } from "../../../HXJS";

cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefabName: '',
        itemScrName: '',

        item:null,

        hasInit:{ default: false, serializable: false, visible: false},
    },

    // onLoad: function () {
    //     this.hasInit();
    // },

    OnInit(){
        if(this.hasInit) return;

        this.hasInit = true;

        hxjs.module.ui.hub.LoadPanel(this.itemPrefabName,function(prefab){
            this.item = prefab;
            prefab.active = false;
            this.InitItemRole();
        }.bind(this),this.node);
    },

    onDestroy(){
        this.hasInit = false;

        if(this.item) {
            hxjs.module.ui.hub.Unload(this.item);
            // this.item.destroy();
        }
    },

    InitItemRole:function(){
        if(this.item != null && this.info != null && this.idx != -1) {
            this.item.active = true;
            this.item.getComponent(this.itemScrName).SetInfo(this.info, this.idx);
        }
    },

    SetInfo(info,idx) {
        this.OnInit();

        this.idx = idx;
        this.info = info;

        if(info!= null) {
            this.InitItemRole();
        }
    }
});
