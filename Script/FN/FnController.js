// import { hxdt } from "../DT/HXDT";
// import { hxfn } from "./HXFN";

// export let initer = 
// {
//     //=======================================
//     // 全局的Feature，只需要实现初始化，不需要实现清理
//     OnStart(){
//         hxfn.newtip.OnInit();
//         hxfn.comn.OnInit();
//         hxfn.account.OnInit();
//         hxfn.role.OnInit();
//         hxfn.map.OnInit();
//         hxfn.net.OnInit();
//         hxfn.global.OnInit();
//         hxfn.bridge.OnInit();
//         hxfn.test.OnInit();
//         hxfn.chess.OnInit();

//         //初始化Java回调接口
//         //hxfn.bridge.RegistBridgeCallback();   
//     },

//     //=======================================
//     // 各个场景独有的Feature，作用周期仅仅为当前场景，需要同时实现初始化和清理操作
//     OnStartScene (id) {
//         switch (id) {
//             case hxdt.enum_game.Enum_GameState.Login:
//                 break;
//             case hxdt.enum_game.Enum_GameState.Lobby:
//                 hxfn.lobby.OnInit();
//                 hxfn.mail.OnInit();
//                 hxfn.notice.OnInit();
//                 hxfn.activityAndTask.OnInit();
//                 break;
//             case hxdt.enum_game.Enum_GameState.Battle:
//                 // hxfn.battle.OnStart();
//                 // if(hxfn.map.curGameTypId === 1)
//                 //     hxfn.battle_pinshi.OnStart();
//                 // // else if(this.gameplay === 1)
//                 // //     hxfn.battle_pinshi.OnInit();
//                 break;
//             default:
//                 break;
//         }
//     },

//     OnResetScene (id) {
//         switch (id) {
//             case hxdt.enum_game.Enum_GameState.Login:
//                 break;
//             case hxdt.enum_game.Enum_GameState.Lobby:
//                 hxfn.lobby.OnReset();
//                 // hxfn.mail.OnInit();
//                 // hxfn.notice.OnInit();
//                 // hxfn.activityAndTask.OnInit();
//                 break;
//             case hxdt.enum_game.Enum_GameState.Battle:
//                 // hxfn.battle.OnStart();
//                 // if(hxfn.map.curGameTypId === 1)
//                 //     hxfn.battle_pinshi.OnStart();
//                 // // else if(this.gameplay === 1)
//                 // //     hxfn.battle_pinshi.OnInit();
//                 break;
//             default:
//                 break;
//         }
//     },

//     OnEndScene (id) {
//         switch (id) {
//             case hxdt.enum_game.Enum_GameState.Login:
//                 break;
//             case hxdt.enum_game.Enum_GameState.Lobby:
                
//                 break;
//             case hxdt.enum_game.Enum_GameState.Battle:
//                 // hxfn.battle.OnEnd();
//                 // if(hxfn.map.curGameTypId === 1)
//                 //     hxfn.battle_pinshi.OnEnd();
//                 // // else if(this.gameplay === 1)
//                 // //     hxfn.battle_pinshi.OnEnd();
//                 break;
//             default:
//                 break;
//         }
//     }
// }