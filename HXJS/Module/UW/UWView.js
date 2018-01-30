export class UWView
{
    OnInit (ctrl, originPrefabNames) {
        this.prefabs = [];
        this.originPrefabNames = originPrefabNames;
        this.ctrl = ctrl;

        this.HandleNotify(true);

        this.InitPrefabs();
        //场景资源在当前项目中只是背景，不影响逻辑，固可以不care其何时完成
        this.ctrl.ReadyUW();
    }
    
    OnReset () {
        
    }
    
    OnStart () {
        
    }

    OnEnd () {
        this.HandleNotify(false);
        this.ClearAssets();
    }

    HandleNotify(isHandle) {
        if(isHandle) {

        }
        else {

        }
    }

    InitPrefabs() {
        // hxjs.module.ui.hub.ShowLoadingUW();
        this.LoadPrefabs(this.originPrefabNames, function () {
            // hxjs.module.ui.hub.HideLoadingUW();
            // this.ctrl.ReadyUW();
        }.bind(this));
    }

    ClearAssets() {
        for (var i = 0; i < this.prefabs.length; i++) {
            var element = this.prefabs[i];
            element.destroy();
        }
    
        this.prefabs = [];
    }

  
    //TODO: 需要记录当所有的资源加载完成才进行回调
    LoadPrefabs (prefabs, callback) {
        for (var i = 0; i < prefabs.length; i++) {
            var element = prefabs[i];
            hxjs.module.asset.LoadUWPrefab(element, function(prefab){
                this.prefabs.push(prefab);
                // cc.log('UW Asset loaded: ' + prefab.name);

                // if(callback != null)
                //     this.callback();
            }.bind(this));
        }
    }
};

// module.exports = View;