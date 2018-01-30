import { login } from "./Fn_Login";
import { account } from "./Fn_Account";
import { activityAndTask } from "./Lobby/Fn_ActivityAndTask";
import { battle } from "./Battle/Fn_Battle";
import { bridge } from "./Fn_Bridge";
import { chess } from "./Fn_Chess";
import { comn } from "./Fn_Comn";
import {global} from "./Fn_Global";
import { level } from "./Lobby/Fn_Map_Level";
import { lobby } from "./Lobby/Fn_Lobby";
import { mail } from "./Lobby/Fn_Mail";
import { msg } from "./Fn_Msg";
import { map } from "./Lobby/Fn_Map";
import { net } from "./Fn_Net";
import { netrequest } from "./Fn_NetRequest";
import { newtip } from "./Fn_NewTip";
import { notice } from "./Lobby/Fn_Notice";
import { redpack } from "./Fn_RedPack";
import { review } from "./Fn_Review";
import { role } from "./Fn_Role";
import { setting } from "./Fn_Setting";
import { shop } from "./Lobby/Fn_Shop";
import { test } from "./Fn_Test";
import { help } from "../UI/Comn/Chat/Fn_Help";
import { rank } from "./Lobby/Fn_Rank";
import { battle_five } from "./Battle/Fn_Battle_Five";
import { battle_pinshi } from "./Battle/Fn_Battle_PinShi";
import { battle_pinshi_zyqz } from "./Battle/Fn_Battle_PinShi_ZYQZ";
import { battle_pinshi_kpqz } from "./Battle/Fn_Battle_PinShi_KPQZ";
import { battle_pinshi_sssz } from "./Battle/Fn_Battle_PinShi_SSSZ";
import { battle_pinshi_tbps } from "./Battle/Fn_Battle_PinShi_TBPS";
import { Fn_Battle_Landlord } from "./Battle/Fn_Battle_Landlord";
import { lable } from "../../HXJS/Util/Label";
import { Fn_Battle_Landlord_Classic } from "./Battle/Fn_Battle_Landlord_Classic";
import { Fn_BattleCardMem } from "./Battle/Fn_BattleCardMem";
import { Fn_Battle_LuoSong } from "./Battle/Fn_Battle_LuoSong";


export let hxfn = {
    //XXX 设置
    review : review,

    // 通用
    comn : comn,
    bridge : bridge,
    adjust : lable,
    global : global,
    msg : msg,
    net : net,
    netrequest : netrequest,
    newtip : newtip,
    test : test,

    // 全局
    account : account,
    role : role,
    

    // 场景：登录 --------------------------
    login : login,
    // login_social : login_social,
    

    // 场景：大厅 --------------------------
    lobby : lobby,
    activityAndTask : activityAndTask,
    mail : mail,
    notice : notice,
    setting : setting,
    shop : shop,
    help : help,
    rank : rank,
    redpack : redpack,
    
    // 地图关卡 = 房间
    map : map,
    level : level,
    

    // 场景：战斗 --------------------------
    // 战斗 = 牌局
    battle : battle,

    //功能
    battle_cardmem:new Fn_BattleCardMem(),

    //玩法
    five : battle_five,
    chess : chess,
    battle_pinshi : battle_pinshi,
    battle_pinshi_kpqz : battle_pinshi_kpqz,
    battle_pinshi_zyqz : battle_pinshi_zyqz,
    battle_pinshi_sssz : battle_pinshi_sssz,
    battle_pinshi_tbps : battle_pinshi_tbps,
    battle_landlord: new Fn_Battle_Landlord(),
    battle_landlord_classic: new Fn_Battle_Landlord_Classic(),
    //battle_LuoSong:new Fn_Battle_LuoSong(),
}