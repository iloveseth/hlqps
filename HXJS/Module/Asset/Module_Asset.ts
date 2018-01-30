import { Loader } from "./AssetLoader";
import { Loader2 } from "./AssetLoader2";
import { log } from "../../Util/Log";
import { hxjs } from "../../HXJS";
import { hxfn } from "../../../Script/FN/HXFN";
import { hxdt } from "../../../Script/DT/HXDT";
import { isNullOrUndefined, isArray } from "util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Module_Asset extends cc.Component 
{
    @property({type:cc.Node})
    private rootUW: cc.Node = null;

    //缓存prefab资源Load管道（池化），如果现有管道都被占用，则生成新的管道
    private cacheLoaders:Array<Loader> = [];
    private cacheLoaders4SceneDefaultGroup:Array<Loader2> = [];
    
    //图集缓存
    private cacheAtlases:Map<string, cc.SpriteAtlas> = new Map<string, cc.SpriteAtlas>();//:Object = {};

    private callback_loadRawsComplete: Function = null;

    private progress:Number = 0;
    private resource:object = null;
    private completedCount:Number = 0;
    private totalCount:Number = 0;

    onLoad () {
        if(hxjs.module.asset == null) {
            log.trace('asset','hxjs.module.asset. init');
            
            hxjs.module.asset = this;
            this.Init();
            cc.game.addPersistRootNode(this.node);
        }
    }

    private Init() {
        this.callback_loadRawsComplete = null;
    }

    //prefab资源Load管道//////////////////////////////////////////////////////////////////////////////
    private GetNewLoader():Loader {
        let loader:Loader = null;

        let hasAllUsed = true;

        this.cacheLoaders.forEach(function(element) {
            if(element.IsFree()) {
                hasAllUsed = false;
                loader = element;
                return false;// break;
            }
        }, this);

        if(hasAllUsed) {
            loader = new Loader();
            this.cacheLoaders.push(loader);
        }

        return loader;
    }

    private GetNewLoader2():Loader2 {
        var loader:Loader2 = null;

        var hasAllUsed = true;

        this.cacheLoaders4SceneDefaultGroup.forEach(function(element) {
            if(element.IsFree()) {
                hasAllUsed = false;
                loader = element;
                return false;// break;
            }
        }, this);

        if(hasAllUsed) {
            loader = new Loader2();
            this.cacheLoaders4SceneDefaultGroup.push(loader);
        }

        return loader;
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////

    public LoadUIPrefab (path:string, callback?:Function, con?:cc.Node, dlgBG?:cc.Node) {
        if(hxdt.setting_comn.review){
            // cc.log('hxfn.review.reviewPrefab:');
            // cc.log(hxfn.review.reviewPrefab);
            if(hxfn.review.reviewPrefab.indexOf(path + '_Review') !== -1){
                path += '_Review';
            }
        }
        log.trace('asset','[ui] +++ load: ' + path);
        this.LoadPrefab(path, callback, con, true, dlgBG);
    }

    public LoadUWPrefab (path:string, callback?:Function) {
        this.LoadPrefab(path, callback, this.rootUW);
    }

    private LoadPrefab (path:string, callback?:Function, con?:cc.Node, isUI?:Boolean, dlgBG?:cc.Node/*必须是UI才可能有*/) {
        let p = hxdt.setting_webVersion.GetAssetPath()+'/prefab/' + path;

        let loader = this.GetNewLoader();
        loader.OnInit(p, callback, con, isUI, dlgBG);
        loader.OnLoad();
    }

    public LoadPrefab_Sfx (path:string, callback?:Function, con?:cc.Node){
        let p = 'audio/' + path;
        
        let loader = this.GetNewLoader();
        loader.OnInit(p, callback, con, false, null);
        loader.OnLoad();
    }

    // public LoadPrefab4SceneDefaultGroup (path:string, callback:Function) {//, con = null, isUI = false
    //     // if(hxdt.setting_comn.review){
    //     //     cc.log('hxfn.review.reviewPrefab:');
    //     //     cc.log(hxfn.review.reviewPrefab);
    //     //     if(hxfn.review.reviewPrefab.indexOf(path + '_Review') !== -1){
    //     //         path += '_Review';
    //     //     }
    //     // }
    //     let p = 'art/prefab/' + path;
    //     log.trace('ui', '+++ load: ' + p);

    //     let loader = this.GetNewLoader2();
    //     loader.OnInit(p, callback);
    //     loader.OnLoad();
    // }

    public LoadPrefab4SceneUI (path:string, callback:Function) {
        let p = hxdt.setting_webVersion.GetAssetPath()+'/prefab/' + path;
        log.trace('ui', '+++ load SceneUI: ' + p);

        let loader = this.GetNewLoader2();
        loader.OnInit(p, callback);
        loader.OnLoad();

        // cc.loader.loadRes(p, function (err, prefab) {
        //     var newNode = cc.instantiate(prefab);
        //     if(callback != null){
        //         callback(newNode);
        //     }
        // }.bind(this));
    }

    // LoadRaws (raws, callback) {
    //     this.callback_loadRawsComplete = callback;

    //     this._urls = [];
    //     for (var i = 0; i < prefabs.length; i++) {
    //         this._urls.push(cc.url.raw(raws[i]));
    //     }
    //     this.ClearTempRaws();
        
    //     this.resource = null;
    //     this.node.on(cc.Node.EventType.TOUCH_START, function () {
    //         if (this.resource) { return; }
    //         cc.loader.load(this._urls, this.ProgressCallback.bind(this), this.CompleteCallback.bind(this));
    //     }, this);
    // },

    // ClearTempRaws:function () {
    //     for (var i = 0; i < this._urls.length; ++i) {
    //         var url = this._urls[i];
    //         cc.loader.release(url);
    //     }
    // },

    ProgressCallback (completedCount, totalCount, res) {
        this.progress = completedCount / totalCount;
        this.resource = res;
        this.completedCount = completedCount;
        this.totalCount = totalCount;
    }

    CompleteCallback (error, res) {
        if(this.callback_loadRawsComplete)
            this.callback_loadRawsComplete();
    }

    //TODO: 
    //1, 清理临时缓存游离资源
    //2, 清理未引用镜像资源（通过引用计数）

    //此外，你也可以使用 cc.loader.releaseAsset 来释放一个具体的 Asset 实例。
    //cc.loader.releaseAsset(spriteFrame);

    //loadRes 加载进来的单个资源如果需要释放，可以调用 cc.loader.releaseRes，releaseRes 只能传入一个和 loadRes 相同的路径，不支持类型参数。
    //cc.loader.releaseRes("test assets/anim");


    //!!! 必须提前判断是否网络图片
    public LoadNetImg (imgName:string, obj:cc.Sprite, dummy?:string) {
        //TODO: 如果imgName包含'http://'开头 则加载网络图片
        if(this.CheckNetUrl(imgName)) {
            // cc.log('loading http pic');
            cc.loader.load({url: imgName, type: 'jpg'},function (err, pic) {
                if (err) {
                    log.warn('url [' + err + ']');
                    if(dummy) {
                        this.UseDummy(dummy, obj)
                    }
                    return;
                }
                
                let spriteFrame = new cc.SpriteFrame(pic);
                obj.spriteFrame = spriteFrame;
            });
        }
        else{
            this.LoadSprite(imgName,obj);
        }
    }

    private CheckNetUrl(imgName:string) {
        let newName = imgName.replace(/^\s*/g,"");
        if(newName.indexOf('http') == 0){
            return true;
        }

        return false;
    }

    //THINKING 统一化为一个方法，优先从图集加载资源，如果没有找到，则再从非图集对象查找
    public LoadSprite (imgName:string, obj:cc.Sprite, dummy?:string) {
        if(obj==null){
            log.warn('LoadAtlasSprite no obj');
            return;
        }

        if(imgName == null || imgName == ''){
            log.warn('LoadAtlasSprite imgName is null or empty');
            return;
        }

        let p = hxdt.setting_webVersion.GetAssetPath()+'/texture/' + imgName;

        cc.loader.loadRes(p, cc.SpriteFrame, function (err, sf) {
            if (err) {
                log.warn(' url [' + err + ']');
                if(dummy) {
                    this.UseDummy(dummy, obj)
                }
                return;
            }

            if(obj != null && obj.spriteFrame!= null) {
                obj.spriteFrame = sf;
            }
            else {
                log.warn('no sprite for img asset loaded to with name: ' + imgName);
            }
        }.bind(this));
    }

    private UseDummy (dummy:string, obj:cc.Sprite){
        //如果有提供候选图，则当不成功时用候选图替换
        this.LoadSprite(dummy, obj);
    }

    //首先检测已经预加载好的的图集，如果没有则加载图集，再从图集中获取元素,并且缓存该图集
    public LoadAtlasSprite (atlasName, imgName, obj, cb = null, dummy = null) {
        if(obj == null){
            log.warn('LoadAtlasSprite no valid obj');
            return;
        }

        if(imgName == null || imgName == ''){
            log.warn('LoadAtlasSprite imgName is null or empty');
            if(dummy) {
                this.UseDummy(dummy, obj);
            }
            return;
        }

        let p = hxdt.setting_webVersion.GetAssetPath()+'/texture/' + atlasName;

        //----------------------------------------------------------------------
        //如果已缓存图集，则直接回调（资源已完成加载）
        let at = this.cacheAtlases.get(p);//[p];
        if(at!= null) {
            if(cb) cb();
            
            let frame = at.getSpriteFrame(imgName);
            if(obj!= null) {
                obj.spriteFrame = frame;
            }
            else {
                log.warn('no sprite for img asset loaded to with name: ' + imgName);
            }
            return;
        }
        //----------------------------------------------------------------------

        cc.loader.loadRes(p, cc.SpriteAtlas, function (err, atlas) {
            if(cb) cb();
            
            if (err) {
                log.warn('url [' + err + ']');
                if(dummy) {
                    this.UseDummy(dummy, obj);
                }
                return;
            }

            let frame = atlas.getSpriteFrame(imgName);
            if(obj!= null && obj.spriteFrame != null) 
                obj.spriteFrame = frame;
            else 
                log.warn('no sprite for img asset loaded to with name: ' + imgName);

            // this.cacheAtlases[p] = atlas;
            this.cacheAtlases.set(p,atlas);
        }.bind(this));
    }

    //预加载图集（最好从进入大厅开始，登录前的资源不重）
    public PreloadAtlases(atlases){
        if(isNullOrUndefined(atlases) || !isArray(atlases)){
            log.warn('atlases setting is invalid');
            return;
        }

        atlases.forEach(element => {
            let p =hxdt.setting_webVersion.GetAssetPath()+ '/texture/' + element;
            if(this.cacheAtlases.has(p) && this.cacheAtlases.get(p)){
                log.trace('asset', '已缓存图集：' + p);
            }
            else {
                cc.loader.loadRes(p, cc.SpriteAtlas, function (err, atlas) {
                    if (err) {
                        log.warn('url [' + err + ']');
                        return;
                    }
    
                    // this.cacheAtlases[p] = atlas;
                    this.cacheAtlases.set(p,atlas);
                }.bind(this));
            }
        });
    }
}