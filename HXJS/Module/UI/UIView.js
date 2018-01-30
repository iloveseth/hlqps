
export let scene = 
{
    SetGameState : function (state) 
    {
        switch (state) {
            case hxdt.enum_game.Enum_GameState.Login:
            // hxjs.util.log("~~~~~~~~~~~~~~~~~~~~~~~UIScene set game state: Login");
                // load ui:
                // UILoginBasic
            break;
            case hxdt.enum_game.Enum_GameState.Lobby:
            // hxjs.util.log("~~~~~~~~~~~~~~~~~~~~~~~UIScene set game state: Lobby");
                // load ui:
                // UI_Lobby_Basic
                // UI_Role_Info
            break;
            case hxdt.enum_game.Enum_GameState.Battle:
            // hxjs.util.log("~~~~~~~~~~~~~~~~~~~~~~~UIScene set game state: Battle");
                // do Nothing
            break;
            default:
                break;
        }
    }
}