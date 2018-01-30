import { hxfn } from "../../Script/FN/HXFN";
import { enum_game } from "../../Script/DT/DD/Enum_Game";
import { hxjs } from "../HXJS";
import { hxdt } from "../../Script/DT/HXDT";


var Enum_GameState = enum_game.Enum_GameState;
// var Enum_GameEdition = enum_game.GameEdition;
var Enum_GameType = enum_game.GameType;

cc.Class({
    extends: cc.Component,

    properties: {
        //version
        // gameEdition: {
        //     default: Enum_GameEdition.OL,
        //     type: Enum_GameEdition,
        // },
        gameType: {
            default: Enum_GameType.Release,
            type: Enum_GameType,
        },
        //全局设置
        beginState: {
            default: Enum_GameState.Lobby,
            type: Enum_GameState,
        },
        
        //TEST
        isClearLocalData:false,
        isTest:false,//供客户端临时使用
    },
        

    // onLoad: function () {},
    start: function () {
        //调试之用
        if(this.isClearLocalData){
            hxfn.login.ClearLocalRecord();
            hxfn.setting.ClearLocalRecord();
        }

        hxdt.setting_comn.isTest = this.isTest;
        // hxdt.setting_comn.gameEdition = this.gameEdition;
        hxdt.setting_comn.gameType = this.gameType;

        this.InitData();
    },
    
    onDestroy: function () {
        // needn't do anything
    },
    
    InitData:function () {
        hxdt.dataIniter.OnInit(
            function(){
                //框架
                this.InitUtil();
                this.InitModule();
                //业务
                this.InitFeature();
                //启动
                this.OnStart();
            }.bind(this)
        );
    },
    
    InitUtil:function(){
        hxjs.util.insidMachine.OnInit();
    },
    
    InitModule:function(){
        // hxjs.module.asset.OnInit();
        // hxjs.module.ui.hub.OnInit();
        hxjs.module.sound.OnInit();
    },

    InitFeature:function () {
        // hxfn.initer.OnStart();
        // 全局的Feature，只需要实现初始化，不需要实现清理
        hxfn.comn.OnInit();
        hxfn.global.OnInit();
        hxfn.bridge.OnInit();
        hxfn.test.OnInit();
        hxfn.net.OnInit();
        hxfn.account.OnInit();
        hxfn.role.OnInit();
        hxfn.map.OnInit();
        hxfn.chess.OnInit();
        hxfn.newtip.OnInit();

        //初始化Java回调接口
        //hxfn.bridge.RegistBridgeCallback();   
    },

    OnStart:function () {
        cc.log('//////////////// Project Start //////////////////');
        
        hxdt.setting_comn.OnInit();
        hxdt.setting.uiscene.OnInit();

        //默认显示在登录界面
        hxjs.uwcontroller.SetState(this.beginState);

        //并且开始获取服务信息
        hxfn.account.OnStart();
    },
});