// import { AssetGroupLoader } from "../Asset/AssetGroupLoader";
// import { hxjs } from "../../HXJS";
// import { log } from "../../Util/Log";
// import { uimgr as hub } from "./UIMgr";

// cc.Class({
//     extends: cc.Component,

//     properties: {
//         rootUI: cc.Node,
//         rootUI4Scene: cc.Node,
//         uiLoading: cc.Node,
//         uwLoading: cc.Node,
//         waiting: cc.Node,

//         //TEST
//         // uiRootTest:cc.Node,
        
//         panels:{default: null, serializable: false, visible: false},

//         //dlg型面板加载器（面板与背景配对）
//         dlgs:{default: null, serializable: false, visible: false},

//         //资源组加载器
//         assetGroupLoader:{default: null, serializable: false, visible: false},
//     },

//     onLoad:function () {
//         // this.dlgs = new Map();
//         // this.panels = [],
//         hub.OnInit();
//         hub.rootUI = this.rootUI;
//         hub.rootUI4Scene = this.rootUI4Scene;
//         hub.uiLoading = this.uiLoading;
//         hub.uwLoading = this.uwLoading;
//         hub.waiting = this.waiting;
//         hub.assetGroupLoader = this.assetGroupLoader;
//         // hub.uiRootTest = this.uiRootTest;

//         // hxjs.module.ui.hub = this;

//         hxjs.module.ui.history.Init(hub);
//         hub.HideWaitingUI();
//     },
// });