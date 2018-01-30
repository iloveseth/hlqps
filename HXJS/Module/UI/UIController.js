import { hxdt } from "../../../Script/DT/HXDT";
import { hxjs } from "../../HXJS";
import { log } from "../../Util/Log";

export let uicontroller = {
    curState: hxdt.enum_game.Enum_GameState.None,
    
    defaultPrefabs: null,//支持多个UI面板组合作为场景的默认UI界面
    curUWCtrl: null,

    //THINKING 使用TS重构，基类为UIPanelScene，实际使用时进行具体子类型的判断
    curSceneUIMgr:null,//绑定在场景唯一主UI上的脚本,可视化类对象??或者逻辑类对象，当前所有场景相关UI的管理器，相当于UI的View层（MVC）或者VM层（MVVM）

    SetInfo (prefabs, ctrl) {
        this.defaultPrefabs = prefabs;
        this.curUWCtrl = ctrl;
    },

    SetState (state) {
        if(state == hxdt.enum_game.Enum_GameState.None)//??
            return;
        if(state == this.curState)
            return;

        this.LeaveState(this.curState);

        this.curState = state;
        this.LoadSceneDefault();
    },

    LeaveState: function (state) {
        if(state==hxdt.enum_game.Enum_GameState.None || state != this.curState)
            return;
            
        hxjs.module.ui.hub.Clear();
        this.curSceneUIMgr = null;
    },

    LoadSceneDefault () {
        log.trace('ui', '---> uiscene load start: ' + this.curState);
        hxjs.module.ui.hub.ShowLoadingUI();
        //TODO: 统一为只加载一个场景主UI，由其管理其他类型UI
        hxjs.module.ui.hub.LoadPanels(this.defaultPrefabs, function () {
            hxjs.module.ui.hub.HideLoadingUI();
            this.curUWCtrl.ReadyUI();
            log.trace('ui', '<--- uiscene load end: ' + this.curState);
        }.bind(this));
    },
    
    //newest：不会有简单的只是重置表现，而是从登陆验证开始重新跑一遍流程！！！！！！！！！！！！！！
    //为了解决进程挂起与唤醒时，客户端的表现同步问题，必须支持表现的重置操作
    // OnResetState () {
    //     hxjs.util.Notifier.emit('Reset_UI');
    // }
        
    //THINKING （层次有点多！！！）构造一个UIView层，专门管理全局（可能）和当前场景UI面板的加载卸载与逻辑处理，使Fn成为纯逻辑的功能对象
    RegistSceneUI (sceneui){
        if(sceneui) {
            this.curSceneUIMgr = sceneui.getComponent('UIPanelScene');
            //TODO 如果拼十牌局UI重构完成，则可以清理此处
            if(!this.curSceneUIMgr) {
                this.curSceneUIMgr = sceneui.getComponent('UIPanelSceneJS');
            }
        }
    },
    ToggleSceneBaseUI(isShow){
        if(this.curSceneUIMgr)
        this.curSceneUIMgr.ToggleSceneBaseUI(isShow);
    }
}