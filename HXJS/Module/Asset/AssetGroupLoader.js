import { hxjs } from "../../HXJS";

/**
 * 1.0版本，暂时只提供给UI面板组使用，且只在切换场景的时机使用
 */
// function GroupLoader () {}

export class AssetGroupLoader 
{
    count = 0;

    OnInit(prefabsNames, callback, con) {
        if(this.isInProcess) {
            cc.log('[xhjs][err] this group asset loader is in process!');
            return;
        }

        this.count = 0;

        this.prefabsNames = prefabsNames;
        this.callback = callback;
        this.con = con;

        this.loadPanels_curLoaded = [];
        //深度记录：舞台的资源个数
        //当前可添加深度，从0开始
        this.depthEnable = 0;
        // //1,当前最大可添加
        // this.depthMax = 0;
        // //2,已经添加到
        // this.depthCur = 0;

        //标记loader是否被占用
        this.isInProcess = false;
    }

    OnLoad() {
        this.isInProcess = true;

        var prefabsNames = this.prefabsNames;
        var callback = this.callback;
        for (var i = 0; i < prefabsNames.length; i++) {
            var p = prefabsNames[i];
            hxjs.module.ui.hub.LoadPanel4SceneDefaultGroup(p, this.CheckLoadAllPrefabs.bind(this));
        }
    }

    CheckLoadAllPrefabs(prefab) {
        var scr = prefab.getComponent('UIPanelSceneJS');
        var scrTS = prefab.getComponent('UIPanelScene');
        if(scr != null) {
            scr.SetInitCompleteCallback(this.CheckCompleteNew.bind(this));
            this.loadPanels_curLoaded.push(prefab);//prefab.name
            if(this.loadPanels_curLoaded.length >= this.prefabsNames.length){
                //有序添加
                this.CheckAddToStage();
            }
        }
        else if(scrTS != null) {
            scrTS.SetInitCompleteCallback(this.CheckCompleteNew.bind(this));
            this.loadPanels_curLoaded.push(prefab);//prefab.name
            if(this.loadPanels_curLoaded.length >= this.prefabsNames.length){
                //有序添加
                this.CheckAddToStage();
            }
        }
        else {
            // cc.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CheckLoadAllPrefabs max: '+ this.loadPanels_names.length);
            // cc.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CheckLoadAllPrefab name: ' + prefab.name);
            this.loadPanels_curLoaded.push(prefab);//prefab.name
            if(this.loadPanels_curLoaded.length >= this.prefabsNames.length){
                this.OnLoadComplete();
            }
        }
    }

    //修改完成时机！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    CheckCompleteNew() {
        this.count +=1;

        if(this.count >= this.prefabsNames.length){
            this.prefabsNames = null;
            this.loadPanels_curLoaded = [];
            this.depthEnable = 0;
            this.isInProcess = false;

            this.callback();
            this.callback = null;
        }
    }

    CheckAddToStage () {        
        this.loadPanels_curLoaded.forEach(function(element) {
            var idx = this.prefabsNames.indexOf(element.name);
            if(idx === this.depthEnable) {
                //添加到舞台
                this.con.addChild(element);
                this.depthEnable += 1;
                //递归
                this.CheckAddToStage();
            }
        }.bind(this), this);
    }

    IsFree () {
        return !this.isInProcess;
    }

    //TOMARK
    // OnLoadProcess:function () {
    // },

    OnLoadComplete (err, prefab) {
        //有序添加
        this.CheckAddToStage();
        //TEST： 不保序添加
        // this.loadPanels_curLoaded.forEach(function(element) {
        //     //添加到舞台
        //     this.con.addChild(element);
        // }.bind(this));

        this.callback();

        this.callback = null;
        this.prefabsNames = null;

        this.loadPanels_curLoaded = [];
        this.depthEnable = 0;
        this.isInProcess = false;
    }
}

// module.exports = GroupLoader;