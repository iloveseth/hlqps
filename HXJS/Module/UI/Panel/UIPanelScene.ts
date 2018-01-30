import { log } from "../../../Util/Log";
import { hxfn } from "../../../../Script/FN/HXFN";
import { hxjs } from "../../../HXJS";
import { hxdt } from "../../../../Script/DT/HXDT";
import { isNullOrUndefined } from "util";

const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class UIPanelScene extends cc.Component 
{
    private allSubUI:Array<IUISub> = [];//所有子面板的脚本实例
    private allSubUI_Dynamic:Array<cc.Node> = [];//所有异步加载的子面板
    protected allRoundClearSubUI:Array<IUISub> = [];//所有每个回合需要重置的子面板脚本实例
    protected dynamicSubUI:Array<Array<any>> = [];// 需要动态载入当前主场景UI的子对象
    private initCompleteCallback: Function = null;// 场景UI加载完成之后通知UWController的回调

    //设置需要动态加载的子UI
    protected abstract SetDynamicSubUI():void;
    //缓存每个回合需要清理的子UI
    protected abstract SetAllRoundClearSubUI():void;

    // 1，XXX 初始化默认界面显示(废弃：由于主场景UI只是一个容器，所有的具体功能都由子级面板实现，即应该初始化所有子对象外观)
    // protected DefaultLayout():void{}
    // 2，获取所有静态嵌入的子面板
    protected abstract GetSubFn_Static():void;
    // protected abstract GetSubFn_Dynamic():void;
    // 3，消息的注册与绑定
    protected abstract DefaultNotify(isHandle:Boolean):void;
    
    
    // LIFE-CYCLE CALLBACKS: /////////////////////////////////////////
    onLoad () {
        hxfn.adjust.AdjustLabel(this.node);
        
        this.OnInit();
    }
    start () {
        this.OnStart();
    }
    // update (dt) {},
    
    protected OnInit(){
        this.SetDynamicSubUI();
        this.DefaultNotify(true);
        // this.DefaultLayout();
    }
    public OnStart () {
        //注册当前场景主UI，以便直接引用
        hxjs.module.ui.controller.RegistSceneUI(this);
        
        this.GetSubFn_Static();
        this.GetSubFn_Dynamic();
        // this.DefaultNotify(true);

        //在start被调用时, 1,静态子功能界面必定初始化完成，2，自身加载完成！！！
        this.CheckCompleteDelayLoad();

        this.GetDynamicAsyncUI();
    }
    //真正的UI逻辑起点
    public OnStartReal():void {
        //InitAllSubUI
        this.SetAllRoundClearSubUI();

        this.allSubUI.forEach((item)=>{
            if(item) item.OnInit();
        });
    }
    public OnReset () {
        this.unscheduleAllCallbacks();

        //清理所有的子UI
        this.allSubUI.forEach((item)=>{
            if(item) item.OnReset();
        });
    }
    public OnEnd(){
        this.unscheduleAllCallbacks();//停止某组件的所有计时器
        
        this.DefaultNotify(false);

        //EndAllSubUI
        this.allSubUI.forEach((item)=>{
            if(item) {
                if(item.OnEnd)
                    item.OnEnd();
                item = null;
            }
        });
        //卸载所有动态载入的UI UnloadAllSubUI_Dynamic
        this.allSubUI_Dynamic.forEach((item)=>{
            if(item) hxjs.module.ui.hub.Unload(item);
        });
    }
    //////////////////////////////////////////////////////////////////

    //由外部环境设置主场景加载完成的回调
    public SetInitCompleteCallback(cb){
        this.initCompleteCallback = cb;
    }
    //开关主场景UI的可视状态
    public ToggleSceneBaseUI (isShow:boolean){}

    private LoadDynamicSubUI (path:string, scrName:string, cb:Function) {
        hxjs.module.ui.hub.LoadSceneSub(path,(prefab)=>{//LoadPanel
            this.allSubUI_Dynamic.push(prefab);
            let scr:IUISub = prefab.getComponent(scrName);
            this.allSubUI.push(scr);
            if(cb)cb(scr);
            
            this.CheckCompleteDelayLoad();
        });
    }

    //加载动态载入的子面板
    private GetSubFn_Dynamic():void{
        this.dynamicSubUI.forEach((item)=>{
            if(item)
            this.LoadDynamicSubUI(item[0],item[1],src=>{if(item[2])item[2](src)})
        })
    }
    //场景可异步延时UI
    protected GetDynamicAsyncUI():void{}

    //判断场景主UI是否加载完成，标志是所有动态面板加载完成
    private CheckCompleteDelayLoad () {
        if(isNullOrUndefined(this.dynamicSubUI) || this.dynamicSubUI.length == 0) {
            this.initCompleteCallback();
            return;
        }

        if(this.allSubUI_Dynamic.length >= this.dynamicSubUI.length)
            this.initCompleteCallback();
    }

    //收集所有的静态嵌入UI，合并到所有当前场景子UI的缓存
    protected CollectAllStaticSubUI(arr:IUISub[]) {
        this.allSubUI = this.allSubUI.concat(arr);
    }

    //清理的是场景UI在初始化之后的表现，重置到场景的初始状态！！！！！！！！！！！！！！！
    protected ClearInstantObjs () {
        this.allRoundClearSubUI.forEach((item)=>{
            if(item) item.OnReset();
        });
    }
}
