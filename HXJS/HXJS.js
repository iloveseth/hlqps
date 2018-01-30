import { netlinkerLong } from "./Module/Net/Linker_Long";
import { efxMgr } from "./Module/Effect/EfxMgr";
import { protoHandler } from "./Module/Data/ProtobuferHandler";
import { localStorage4Json } from "./Module/Data/LocalStorage4Json";
import { uicontroller } from "./Module/UI/UIController";
import { history } from "./Module/UI/UIHistory";
import { view } from "./Module/UI/UIView";
// import { battleController } from "./Module/UW/BattleController";
// import { lobbyController } from "./Module/UW/LobbyController";
// import { loginController } from "./Module/UW/LoginController";
import { uwcontroller } from "./Module/UW/UWController";
import { insidMachine } from "./Util/InsIDMachine";
import { Notifier } from "./Util/Notify/Notifier";
import { sort } from "./Util/Sort";
import { timer } from "./Util/Timer";
import { http } from "../Script/FN/Fn_Http";
// import { uimgr } from "./Module/UI/UIMgr";
import { soundmgr } from "./Module/Sound/Module_Sound";

//[2] Core //////////////////////////////////////////////////////
export let hxjs = 
{
    /**
     * [入口]
     * 项目工程环境配置，包括：
     * 1, 数据的初始化
     * 2, 装配业务子系统（X）自动化
     * 3, 装配模块     （X）自动化
     */
    entry: {},

    /**
     * [模块]
     * 各种通用功能模块
     */
    module : {
        asset: null,  //资源 加载，管理，更新
        data: {       //提供不同类型数据加载到内存中的存储支持
            cd: null, //配置数据管理中心（静态）
            pd: null, //档案数据管理中心（持久化）

            //以上，通常所说的配置和档案是由策划对项目的理解进行制定的部分
            //以下，由程序员根据当前的编码需求自我决定
            td: null, //临时数据（只在应用程序生命周期内被需要，可即时创建与销毁）
            proto : protoHandler,
            localStorage4Json : localStorage4Json,
        },
        effect: {     //各种效果：动画，粒子，Shader
            efxMgr: efxMgr,
            animMgr: null,
            shaderMgr: null,
        }, 
        locale: null, //本地化
        net: http,
        netlinkerLong : netlinkerLong,
        sound: soundmgr,  //音效
        //......

        //LowoUI-JS框架
        ui: {
            //用户态
            hub: null,     //常用API
            
            //内核态
            asset: null,   //界面资源 加载与运行时节点控制
            view: view,   //场景管理
            history: history, //界面浏览历史记录，常用来实现通用返回
            controller : uicontroller,
            //... ...
        },

        uw: {
            controller : uwcontroller,
        },
    },
    uicontroller : uicontroller,
    uwcontroller : uwcontroller,
    /**
     * [功能]
     * 各种基础功能，有完整的自我实现，不依赖平台外的第三方
     */
    util: {
        // log: log,
        // logWarn : logWarn,
        // logErr : logErr,
        insidMachine: insidMachine,
        timer: timer,
        Notifier : Notifier,
        sort : sort,
    },

    /**
     * [工具]
     * 各种编辑器，如技能，地图编辑器，测试工具
     * 不会被打包到发布程序
     */
    tool: {
        tst_unit: null,//单元测试
    },

    /**
     * protobuf 打包、解包
     */
    proto : protoHandler,
}