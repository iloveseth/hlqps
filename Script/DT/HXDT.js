import { setting_webVersion } from "./DD/Setting_WebVersion";
import { enum_game } from "./DD/Enum_Game";
import { ErrorCode } from "./DD/ErrorCode";
import { MessageCommand } from "./DD/MessageCommand";
import { setting_comn } from "./DD/Setting_Comn";
import { setting_ui } from "./DD/Setting_UI";
import { dataIniter } from "./DataIniter";
import { pdModifier } from "./PDModifier";
import { ErrorCodeClient } from "./DD/ErrorCodeClient";
import { setting_lang } from "./DD/setting.lang";
import { setting_uwscene } from "./DD/setting.uw.scene";
import { setting_uiscene } from "./DD/setting.ui.scene";

import { setting_niuniu } from "./DD/Setting_Battle_PinShi";



export let hxdt = {
    builder:null,
    setting : {
        lang:setting_lang,
        uwscene:setting_uwscene,
        uiscene:setting_uiscene,
    },
    setting_webVersion : setting_webVersion,
    enum_game : enum_game,
    errcode : ErrorCode,
    clientError : ErrorCodeClient,
    msgcmd : MessageCommand,
    setting_comn : setting_comn,
    setting_ui : setting_ui,
    dataIniter : dataIniter,
    pdModifier : pdModifier,

    setting_niuniu : setting_niuniu,
}