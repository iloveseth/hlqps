import { hxdt } from "../HXDT";

export let setting_ui =
    {
        //面板淡入时间
        time_PanelIn: 0.15,
        //面板淡出时间
        time_PanelOut: 0.1,
        //面板真正卸载延时
        time_PanelDelayClose: 0.15,

        //填写在这里的面板在打开时默认会附加一个全屏底板 "UI_Bg_Custom"
        //注意：这里填写的是资源路径（全）
        ScreenPanels_OL: [
            'UI_Role_DetailNew',
            'UI_Lobby_ActivityAndMission_new2',
            'UI_Lobby_Help',
            'UI_Lobby_MailBox',
            'UI_Lobby_Notice',
            'UI_Lobby_Rank_Main',
            'UI_Lobby_RoomDirectFind',
            'UI_Lobby_RoomTypMgr_new2',
            'UI_Lobby_RoomTyp_Ingot_Create_NiuNiu',
            'UI_Lobby_Shop_new2',
            // 'UI_Lobby_Setting',//TEST

            'battle_landlord/UI_Lobby_RoomIngot_Create_Landlord',
            'Battle_LuoSong/UI_Lobby_RoomTyp_Ingot_Create_LuoSong',
        ],

        ScreenPanels_Red: [
            'UI_Role_DetailNew',
            'UI_Lobby_ActivityAndMission_new2',
            'UI_Lobby_Help',
            'UI_Lobby_MailBox',
            'UI_Lobby_Notice',
            'UI_Lobby_Rank_Main',
            'UI_Lobby_RoomDirectFind',
            'UI_Lobby_RoomTypMgr_new2',
            'UI_Lobby_RoomTyp_Ingot_Create_NiuNiu',
            'UI_Lobby_Shop_new2',
            'UI_Lobby_Setting',

            'battle_landlord/UI_Lobby_RoomIngot_Create_Landlord',
            'Battle_LuoSong/UI_Lobby_RoomTyp_Ingot_Create_LuoSong',
        ],

        get ScreenPanels () {
            //红色版本
            if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED) {
                return this.ScreenPanels_Red;
            }
            else if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.OL) {
                return this.ScreenPanels_OL;
            }
        },
       
        alpha0Spawn: [
            'UI_Lobby_Setting',
            //'UI_Lobby_Shop',
            'UI_Lobby_Shop_new2',
            'UI_Lobby_Rank_Main',
            'UI_Lobby_ActivityAndMission_new2',
            'UI_Lobby_MailBox',
            'UI_Lobby_Notice',
            'UI_Lobby_Share',
            'UI_Lobby_RoomDirectFind',
            'UI_Role_DetailNew',
            // 'UI_Lobby_RoomTypMgr_new2',
            'UI_Lobby_FeedBack',
            //'UI_Comn_Bankruptcy4Gold',
            'UI_Comn_Bankruptcy4Ingot',
            'UI_Dlg_Check',
            'UI_Lobby_Invited',
            'UI_Lobby_MailBox_Detail',
            // 'UI_Lobby_RoomTyp_Ingot_Create_BoYanZi',
            // 'UI_Lobby_RoomTyp_Ingot_Create',
            //'UI_Lobby_Basic',
        ],

        // 把所有延时加载的UI配置在这里，这样，在快速切换状态的时候，如果延时加载的面板处于非匹配的游戏场景中，则即可自销毁
        AsyncUIPanels: [
            null,
            //Login ----------------------
            [
            ],
            //Lobby ----------------------
            [
                'UI_Lobby_RoomTypMgr_new2',
                'UI_Lobby_ActivityAndMission_new2',
                'UI_Role_DetailNew',

                'UI_Role_Info_S',
                'UI_Lobby_FnEntrys',
            ],
            //Battle ---------------------
            [
                // 'UI_Battle_NiuNiu_Basic',
                // 'UI_Battle_NiuNiu_Hud',
                // 'UI_Battle_0CardMgr',
                // 'UI_Battle_2VieBanker',
                // 'UI_Battle_3Bet',
                // 'UI_Battle_4Open',
                // 'UI_Battle_5Result',
                'UI_Battle_Chat',
                'UI_Battle_Chat_Landlord',

                'UI_Battle_RubPoker',

                //TEST
                // 'UI_Role_DetailNew',
            ]
        ],

        // Enum_Atlas: cc.Enum({
        //     Battle_Cards: 'battle_cards',
        // }),
    }