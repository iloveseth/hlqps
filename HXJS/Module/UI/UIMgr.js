// import { AssetGroupLoader } from "../Asset/AssetGroupLoader";
// import { hxjs } from "../../HXJS";
// import { log } from "../../Util/Log";
// import { hxdt } from "../../../Script/DT/HXDT";
// import { isNullOrUndefined } from "util";

// export let uimgr = {
//     rootUI: cc.Node,
//     rootUI4Scene: cc.Node,
//     uiLoading: cc.Node,
//     uwLoading: cc.Node,
//     waiting: cc.Node,

//     panels: [],

//     //dlg型面板加载器（面板与背景配对）
//     dlgs: new Map(),
//     asyncPanels: new Map(),

//     //资源组加载器
//     assetGroupLoader: { default: null, serializable: false, visible: false },

//     // uiRootTest:cc.Node,

//     //全局模块只需要初始化，没有结束处理
//     OnInit() {
//         // 注册异步加载面板
//         let allPanels = hxdt.setting_ui.AsyncUIPanels;
//         if (isNullOrUndefined(allPanels))
//             return;

//         for (let i = 0; i < allPanels.length; i++) {
//             const scenePanels = allPanels[i];
//             let sceneid = i;
//             if (i <= 0)
//                 continue;

//             for (const panel of scenePanels) {
//                 this.RegistAsyncUIPanel(panel, sceneid)
//             }
//         }
//     },

//     /*可继续扩展一个参数：用来针对那些行为类似为CheckDialog，但是有自己额外定制信息的面板：必须继承UIDlgCheck脚本*/
//     LoadDlg_Check(info, confirmEvt, cancelEvt, title, confirmBtnName = '确认', cancelBtnName = '取消',
//         prefab = 'UI_Dlg_Check', moreInfo = null, callback = null) {
//         // hxjs.module.ui.hub.ShowLoadingUI();
//         this.LoadPanel_DlgPop(prefab, function (prefab) {
//             // hxjs.module.ui.hub.HideLoadingUI();
//             if (prefab !== null) {
//                 var dlg = prefab.getComponent('UIDlgCheck');
//                 cc.log('<++++++> load UI_Dlg_Check');
//                 dlg.SetInfo(info, confirmEvt, cancelEvt, title, confirmBtnName, cancelBtnName, moreInfo);
//                 if (callback != null) {
//                     callback(prefab);
//                 }
//             }
//             else {
//                 cc.log('===> no UI_Dlg_Check prefab reference found!');
//             }
//         });
//     },

//     LoadDlg_Info(info, title) {
//         // hxjs.module.ui.hub.ShowLoadingUI();

//         this.LoadPanel_DlgPop('UI_Dlg_Info', function (prefabRef) {
//             // hxjs.module.ui.hub.HideLoadingUI();

//             if (prefabRef !== null) {
//                 var dlg = prefabRef.getComponent('UIDlgInfo');
//                 dlg.SetInfo(info, title);
//             }
//             else {
//                 cc.log('===> no panel UI_Dlg_Info!');
//             }
//         });
//     },

//     //暂时不支持自定义
//     LoadTipFloat(info) {//,delay = 0
//         this.LoadPanel('UI_TipFloat', function (prefabRef) {
//             if (prefabRef != null) {
//                 var dlg = prefabRef.getComponent('UITipFloat');
//                 dlg.SetInfo(info);//delay
//             }
//             else {
//                 cc.log('===> no panel: UI_Tip!');
//             }
//         });
//     },

//     LoadDlg_Reward(info, title, rewards) {
//         // hxjs.module.ui.hub.ShowLoadingUI();

//         this.LoadPanel_DlgPop('UI_Dlg_Reward', function (prefabRef) {
//             // hxjs.module.ui.hub.HideLoadingUI();

//             if (prefabRef !== null) {
//                 var dlg = prefabRef.getComponent('UIDlgReward');
//                 dlg.SetInfo(info, title, rewards);
//             }
//             else {
//                 cc.log('===> no UI_Dlg_Reward prefab reference found!');
//             }
//         });
//     },

//     LoadPanel_DlgPop(prefabName, callback=null, bgName = 'UI_Bg_Dark') {
//         // this.LoadPanel_Dlg(prefabName, callback, bgName);

//         hxjs.module.ui.hub.ShowLoadingUI();
//         hxjs.module.asset.LoadUIPrefab(bgName, function (dlgBg) {
//             hxjs.module.asset.LoadUIPrefab(prefabName, function (dlgPrefab, dBG) {
//                 hxjs.module.ui.hub.HideLoadingUI();
//                 //最好采用实例ID作为Key，如果不能得到对象的实例ID，可以考虑自己实现一套运行时ID配置机制
//                 var strid = dlgPrefab.name + '$' + hxjs.util.insidMachine.GetInsid('ui');
//                 dlgPrefab.name = strid;//后面可以通过获取面板的唯一标示名称作为key
//                 this.dlgs.set(strid, dBG);

//                 this.panels.push(dlgPrefab);

//                 if (!this.CheckSceneDefault(prefabName))
//                     hxjs.module.ui.history.Push(dlgPrefab);

//                 //如果是异步UI，且其匹配的环境已经发生变化，则直接销毁，不做处理
//                 if (!hxjs.module.ui.hub.HandleAsync(prefabName, dlgPrefab)) {
//                     if (callback != null)
//                         callback(dlgPrefab);
//                 }

//                 //把dlg类型面板的主面板设置到其通用背景的节点上，防止同时加载其他面板导致的穿插！！！
//             }.bind(this), dlgBg/*this.rootUI,|*/, dlgBg);

//         }.bind(this), this.rootUI);
//     },

//     LoadPanel_Dlg(prefabName, callback) {
//         if (hxdt.setting_ui.ScreenPanels.indexOf(prefabName) != -1) {
//             this.LoadPanelStack(prefabName);
//             return;
//         }

//         this.LoadPanel_DlgPop(prefabName, callback);
//     },

//     /**
//      * 加载[(ui prefab) = panel]
//      * @param {string} prefabName 
//      * @param {Function(cc.Node)} callback 
//      * @param {cc.Node} con 如果root不为null，则加载到指定的父节点下
//      */
//     LoadPanel(prefabName, callback = null, con = null) {
//         if (hxdt.setting_ui.ScreenPanels.indexOf(prefabName) != -1) {
//             this.LoadPanelStack(prefabName);
//             return;
//         }

//         var isEmbed = con != null;
//         // con = con ==null?this.rootUI:con;
//         if (con == null) {
//             con = this.rootUI;
//         }

//         hxjs.module.asset.LoadUIPrefab(prefabName, function (prefab) {//, con
//             this.panels.push(prefab);
//             if (!this.CheckSceneDefault(prefabName) && !isEmbed)
//                 hxjs.module.ui.history.Push(prefab);

//             //如果是异步UI，且其匹配的环境已经发生变化，则直接销毁，不做处理
//             if (!hxjs.module.ui.hub.HandleAsync(prefabName, prefab)) {
//                 if (callback != null)
//                     callback(prefab);
//             }
//         }.bind(this), con);
//     },

//     //for loading asset group
//     LoadPanel4SceneDefaultGroup: function (prefabName, callback = null) {
//         //Old //LoadPrefab4SceneDefaultGroup
//         hxjs.module.asset.LoadPrefab4SceneUI(prefabName, function (prefab) {
//             this.panels.push(prefab);
//             if (callback != null)
//                 callback(prefab);
//         }.bind(this));
//     },

//     //HACK 需要修改，同时只支持加载一组，未完成之前无法加载其他组
//     LoadPanels(prefabsNames, callback) {
//         if (this.assetGroupLoader == null)
//             this.assetGroupLoader = new AssetGroupLoader();

//         if (!this.assetGroupLoader.IsFree())
//             return;

//         this.assetGroupLoader.OnInit(prefabsNames, callback, this.rootUI4Scene);
//         this.assetGroupLoader.OnLoad();
//     },

//     LoadSceneSub: function (prefabName, callback = null) {
//         //Old //LoadPrefab4SceneDefaultGroup
//         hxjs.module.asset.LoadPrefab4SceneUI(prefabName, function (prefab) {
//             this.panels.push(prefab);
//             this.rootUI4Scene.addChild(prefab);
//             if (callback != null)
//                 callback(prefab);
//         }.bind(this));
//     },

//     // Pop () {
//     //     hxjs.module.ui.history.Pop();
//     // },

//     HasAllPoped() {
//         return hxjs.module.ui.history.HasAllPoped();
//     },

//     Unload(panel) {
//         if (!hxjs.module.ui.history.Sync(panel))
//             this.JustUnload(panel);
//     },

//     JustUnload(panel) {
//         //TODO: 极限条件下有可能为null
//         if (panel == null) return;

//         this.CheckAllScreenPanelsPoped();

//         //检测：如果是dlg型面板，则需要先卸载它的背景板------------
//         var key = panel.name;

//         if (this.dlgs.has(key)) {
//             log.trace('ui', '--- unload dlg typ ui panel with name: ' + key);
//             var dlg = this.dlgs.get(key);
//             dlg.destroy();
//             this.dlgs.delete(key);
//         }
//         else {
//             log.trace('ui', '--- unload normal typ ui panel with name: ' + key);
//         }
//         //------------------------------------------------------


//         var idx = this.panels.indexOf(panel);
//         if (idx > -1) this.panels.splice(idx, 1);
//         if (panel.isValid) {
//             if (hxdt.setting_ui.alpha0Spawn.indexOf(panel.name) != -1) {
//                 var action = cc.fadeOut(hxdt.setting_ui.time_PanelOut);
//                 panel.runAction(action);
//                 // this.scheduleOnce(function(){
//                 //     panel.destroy();
//                 // }, 0.25);
//                 window.setTimeout(function () {
//                     panel.destroy();
//                 }, (hxdt.setting_ui.time_PanelOut + hxdt.setting_ui.time_PanelDelayClose) * 1000/*卸载时机*/);
//             }
//             else {
//                 panel.destroy();
//             }
//         }
//     },

//     Clear() {
//         //unload all panels
//         var toRemove = this.panels.slice(0);
//         for (var i = 0; i < toRemove.length; i++) {
//             var element = toRemove[i];
//             this.Unload(element);
//         }

//         toRemove = [];
//     },

//     ShowLoadingUI() {
//         if (this.uiLoading != null) {
//             // this.uiLoading.active = true;
//             this.ShowCom(this.uiLoading);
//         }
//     },

//     HideLoadingUI() {
//         if (this.uiLoading != null) {
//             // this.uiLoading.active = false;
//             this.HideCom(this.uiLoading);
//         }
//     },

//     // ShowLoadingUW(){
//     //     if(this.uwLoading != null)
//     //         this.uwLoading.active = true;
//     // },

//     // HideLoadingUW(){
//     //     if(this.uwLoading != null)
//     //         this.uwLoading.active = false;
//     // },

//     ShowWaitingUI() {
//         if (this.waiting != null) {
//             // this.waiting.active = true;
//             this.ShowCom(this.waiting);
//         }
//     },

//     HideWaitingUI() {
//         if (this.waiting != null) {
//             // this.waiting.active = false;
//             this.HideCom(this.waiting);
//         }
//     },

//     CheckSceneDefault(panelName) {
//         var idx = hxdt.setting.uiscene.AllSceneUI.indexOf(panelName);
//         return idx > -1;
//     },

//     /**
//      * 废弃！！！
//      * !!!与LoadUI不同之处在于，在语义上开关的面板是被看作为宿主面板原生的一部分来理解的。
//      * if the prefab has not been load, load it, otherwise show or hide it, instead of reload asset.
//      * @param {object} 引用对象，有可能未初始化，则自动加载资源并赋值给引用对象 
//      * @param {string} name 
//      * @param {string} scrname 
//      * @param {bool} isShow
//      * @param {function} callback//必须通过callback,让触发者记录新实例化面板对象的引用
//      * @param {bool} stayTime//可选：如果为undefined或者<=0 则面板必须手动关闭，否则依据所填时间cd，达到时间则自动关闭
//      */
//     // TogglePanel (ref, name, scrname, isShow, callback, stayTime = -1) {
//     //     var scr = null;
//     //     cc.log('~~~~~~~~~~~~~~~~~~~~~~~~~~TogglePanel  ref: ' + ref);
//     //     if(isShow){
//     //         if(ref != null) {
//     //             this.CheckToggleVisible(ref, scrname, true, stayTime);
//     //         }
//     //         else {
//     //             hxjs.module.ui.hub.LoadPanel(name, function (p){
//     //                 if(callback!= null)
//     //                     callback(p);
//     //                 else
//     //                     cc.log('[hxjs][err] callback should not be null!!!');

//     //                 this.CheckToggleVisible(p, scrname, true, stayTime);
//     //             }.bind(this));
//     //         }
//     //     }
//     //     else{
//     //         if(ref != null) {
//     //             this.CheckToggleVisible(ref, scrname, false);
//     //         }
//     //     }
//     // },

//     // CheckToggleVisible: function (ref, scrname, isShow, stayTime = -1) {
//     //     if(scrname == '' || scrname == null)
//     //         scrname = 'Empty';

//     //     if(ref == null){
//     //         cc.log('[hxjs][err] ref must not be null!!!!!!');
//     //         return;
//     //     }

//     //     var scr = ref.getComponent(scrname);

//     //     if(scr != null){
//     //         if(isShow) scr.Show(stayTime);
//     //         else       scr.Hide();//may delay to hide
//     //     }
//     //     else {
//     //         ref.active = isShow;
//     //     }
//     // },
//     ToggleComs(uis, isShow, isNode = true) {
//         for (const ui of uis) {
//             if (isShow) this.ShowCom(isNode ? ui : ui.node);
//             else this.HideCom(isNode ? ui : ui.node);
//         }
//     },
//     ShowCom(uiCom, cb = null/*如果有动画，如果需要在动画结束有回调*/) {
//         if (uiCom == null) {
//             cc.log('[hxjs][err] ui hub show a component which can not be null!!!');
//             return;
//         }

//         //TEST 需测试
//         //---预处理，如果有动画组件，且自动播放勾选，则先勾掉，显示之后再主动播放
//         var anim = uiCom.getComponent(cc.Animation);
//         if (anim) anim.playOnLoad = false;
//         //----------------------------------------------------------------

//         if (!uiCom.activeInHierarchy)
//             uiCom.active = true;

//         //1，如果是组合多个对象的复杂动画
//         //2，否则为独立个体简单动画
//         var animObjsCtrl = uiCom.getComponent('UIAnimObjs');
//         if (animObjsCtrl != null) {
//             animObjsCtrl.Show(cb);
//         }
//         else {
//             this.ShowObjAnim(uiCom, cb);
//         }
//     },

//     //TODO 待扩展
//     HideCom(uiCom, cb = null) {
//         if (uiCom == null) {
//             cc.log('[hxjs][warn] ui hub hide a component which can not be null!!!');
//             return;
//         }

//         if (uiCom.activeInHierarchy) {
//             // var animCtrl = uiCom.getComponent('UIAnim');
//             // if(animCtrl != null) {
//             //     this.conCards[this.timer].node.getComponent('UIAnim').Play("Hide"); 
//             // }
//             uiCom.active = false;
//         }
//     },

//     ShowObjAnim: function (uiCom, cb = null) {
//         // 如果有UIAnim脚本，则可以定制延时等，否则
//         var animCtrl = uiCom.getComponent('UIAnim');
//         if (animCtrl != null) {
//             animCtrl.Show(cb);
//         }
//         else {
//             animCtrl = uiCom.getComponent(cc.Animation);
//             if (animCtrl) {
//                 var clips = animCtrl.getClips();
//                 clips.forEach(function (element) {
//                     animCtrl.play(element.name);
//                 }, this);
//             }
//         }
//     },

//     //注册异步UI面板，用来处理当UI加载完成时，环境是否与其匹配，如果不匹配则需要自动卸载
//     RegistAsyncUIPanel(prefabName, sceneID) {
//         if (!this.asyncPanels.has(prefabName)) {
//             this.asyncPanels.set(prefabName, sceneID);
//         }
//         else {
//             if (this.asyncPanels.get(prefabName) != sceneID) {
//                 log.warn('The panel with name: ' + prefabName + ' set to a new scene: ' + sceneID);
//             }
//         }
//     },
//     HandleAsync(prefabName, prefab) {
//         if (this.asyncPanels.has(prefabName)) {
//             return this.HandleDelayLoadObj(prefab, this.asyncPanels.get(prefabName));
//         }

//         return false;
//     },
//     HandleDelayLoadObj(obj, state) {
//         var curState = hxjs.uwcontroller.curState;
//         if (state !== curState) {
//             // log.trace('ui', '<------> unload ui: ' + obj.name);
//             hxjs.module.ui.hub.Unload(obj);
//             return true;
//         }

//         return false;
//     },

//     //THINKING 处理栈类型面板，应该根据UI类型配置来自动处理
//     LoadPanelStack(fnPanelName, cb) {
//         hxjs.module.ui.hub.ShowLoadingUI();
//         hxjs.module.ui.hub.LoadPanel_DlgPop(fnPanelName, (prefab) => {
//             hxjs.module.ui.hub.HideLoadingUI();

//             if (cb) cb();
//             hxjs.uicontroller.ToggleSceneBaseUI(false);
//         }, 'UI_Bg_Custom');
//     },

//     CheckAllScreenPanelsPoped() {
//         let hasScreenPanel = false;
//         // let screens = hxjs.module.ui.history.panels.filter(item=>item instanceof )
//         hxjs.module.ui.history.panels.some((item) => {
//             let namestrs = item.name.split("$");
//             if (namestrs.length > 0 && hxdt.setting_ui.ScreenPanels.indexOf(namestrs[0]) != -1) {
//                 hasScreenPanel = true;
//                 return true;
//             }
//         });

//         if (!hasScreenPanel) {
//             hxjs.uicontroller.ToggleSceneBaseUI(true);
//         }
//     }
// }