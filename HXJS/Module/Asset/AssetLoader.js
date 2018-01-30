// function Loader () {}

export class Loader
{
    OnInit(p, callback, con, isUI, dlgBG) {
        this.p = p;
        this.callback = callback;
        this.con = con;
        this.isUI = isUI;
        this.dlgBG = dlgBG;
    
        //标记loader是否被占用
        this.isStartLoading = false;
    }

    OnLoad() {
        this.isStartLoading = true;

        var p = this.p;
        var callback = this.callback;
        var isUI = this.isUI;
        var dlgBG = this.dlgBG;
        var con = this.con;

        cc.loader.loadRes(p, function (err, prefab) {
            var newNode = cc.instantiate(prefab);

            //有一部分面板需要在添加到舞台之前设置alpha 为0
            if(hxdt.setting_ui.alpha0Spawn.indexOf(prefab.name) != -1){
                newNode.opacity = 0;
            }

            prefab.x = 0;
            prefab.y = 0;

            if(this.con != null){
                //HACK
                if(this.con.name != '')
                    this.con.addChild(newNode);
            }
                
            if(hxdt.setting_ui.alpha0Spawn.indexOf(prefab.name) != -1){
                var action = cc.fadeIn(hxdt.setting_ui.time_PanelIn);
                newNode.runAction(action);
            }

            if(callback !== null){
                if(isUI)
                    callback(newNode, dlgBG);
                else
                    callback(newNode);
            }

            this.isStartLoading = false;
        }.bind(this));
    }

    IsFree () {
        return !this.isStartLoading;
    }

    //TOMARK
    // OnLoadProcess:function () {
    // },

    // OnLoadComplete:function (err, prefab) {
    //     var newNode = cc.instantiate(prefab);

    //     this.container.addChild(newNode);

    //     if(callback != null)
    //         callback(newNode);

        
    //     this.isStartLoading = true;
    // },
}

// module.exports = Loader;