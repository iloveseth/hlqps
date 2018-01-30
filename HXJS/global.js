import { hxjs } from "./HXJS";
import { hxdt } from "../Script/DT/HXDT";
import { hxfn } from "../Script/FN/HXFN";
import { log } from "./Util/Log";


/**
 * HTML5项目核心框架 By Javascript
 * Copyright (c) 2017-2019 上海宏煦网络科技有限公司
 * Author: WangLiang(loywongcom@gmail.com)
 * Date: 2017.09
 */

/**
 * 术语解释
 * dt: 业务数据 = data technology
    * cd: config data
    * pd: profile data
    * dd: definition data
    * sd: setting data
    * td: temp data
 * 
 * fn: 为feature的缩写
 * 
 * ui: user interface 用户界面
 * 
 * uw: user world 用户世界，同通俗说法 ingame
 */

/**
 * 设计思路：
 * 
 * 整个工程分为2个大部分：1，具体项目业务 2，核心框架
 * 
 * //1：【Proj】具体项目业务，分为4大子系统
 *   1，DT(Data) 所有业务相关数据
 *   2，FN(Feature) 子业务系统
 *   3，UW
 *   4, UI
 * 
 * //2：【Core】核心框架，分为4大子系统
 * 1，Entry 入口流程
 * 2，Module 通用的功能模块
 * 3，Util 通用的完全独立功能
 * 4，Tool 辅助工具，只存在开发测试环境，不被打包到正式的发布版本
 * 
 * hxjs框架里所有的单例对象列举如下：
 * ps1: 大部分高层次的概念在具体的表现上都是以（单例/静态）对象的形式存在
 * ps2：单例对象存在的抽象深度最深为第三级，比如module.ui.hub
 */



/**
 * [业务]
 * 具体项目的业务代码
 */
// proj: {
//     dt: {
//         // builder: null,
//         // dataIniter: null,     // 数据初始化器，包括：配置，档案，设置
//         // pdModifier: null,     // 档案修改器

//         // // 设置数据 和 定义数据，从代码逻辑需求出发，由程序员个人决定，不需要持久化，可以理解为一种配置
//         // // 可以离散化（分布式）到相应的子业务系统（Feature）中去
//         // // sd：数据模块不需要sd管理器（因为只能静态定义）
//         // setting_comn: null,   // 通用全局设置
//         // setting_niuniu: null, // 修改为: setting_battle_niuniu
//         // // dd：数据模块不需要dd管理器（因为只能静态定义）
//         // dd_global:null,//全局静态定义，1，类；2，枚举
//         // dd_battle:null,//enum_battle_niuniu
//     },
//     fn:{ 
//         //---func：方法
//         //OnInit

//         //---var：子对象
//         // account: null,
//         // role: null,
//         // mail: null,
//         // mission: null,
//         // recharge: null,
//         // guild: null,
//         // setting: null,
//         // login: null,
//         // net: null,
//         // battle_niuniu: null,
//     },
//     //ui
//     uiController: null,
//     //uw
//     uwController: null,
//     uw: {
//         loginController:null,
//         lobbyController:null,
//         //BattleController非单例，可以有多种类型的实例
//     }
// },


//[1] Core //////////////////////////////////////////////////////
window.hxjs = hxjs;

//[2] Proj //////////////////////////////////////////////////////
var base64js = require('base64js');
window.base64js = base64js;

var md5 = require("md5");
window.md5 = md5;

window.hxdt = hxdt;
window.hxfn = hxfn;
// window.hxui = hxui;
// window.hxuw = hxuw;

log.openTag("net");
log.openTag("ui");
log.openTag("asset");

log.openTag("LuoSong");