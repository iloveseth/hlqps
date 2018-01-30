export let setting_uiscene = 
{
    /**
     * XXX 由于精简了场景资源加载流程（只加载一个默认加载的Prefab看作传统意义上的Scene文件来使用），所以该功能暂时不用！！！
     * 异步加载没有回调顺序，需要框架层控制显示的先后顺序
     * 索引最小（深度最深），最先被渲染到屏幕上
     */
    Battle_NiuNiu:[
        "UI_Battle_NiuNiu_Main",
    ],
    Battle_BoYanZi:[
        "UI_Scene_Battle_BoYanZi",
    ],
    Battle_SanGong:[
        "UI_Scene_Battle_SanGong",
    ],
    Battle_Gobang:[
        "UI_Battle_Gobang_Main",
    ],
    Battle_Landlord:[
        "UIScene_Battle_Landlord",//battle_landlord/
    ],
    Battle_LuoSong:[
        "UIScene_Battle_LuoSong",  //罗松
    ],
    Lobby:[
        "UI_Lobby_Basic",
        // 延时
        // "UI_Lobby_FnEntrys",
        // UI_Role_Info_S
    ],
    Login:[
         "UI_Login_Basic",
    ],

    AllSceneUI:[],
    // get AllSceneUI() {
    //     return hxdt.setting.uiscene.Login
    //     .concat(hxdt.setting.uiscene.Lobby)
    //     .concat(hxdt.setting.uiscene.Battle_NiuNiu)
    //     .concat(hxdt.setting.uiscene.Battle_BoYanZi)
    //     .concat(hxdt.setting.uiscene.Battle_SanGong)
    //     .concat(hxdt.setting.uiscene.Battle_Gobang)
    //     .concat(hxdt.setting.uiscene.Battle_Landlord);
    // },

    OnInit(){
        // cc.log(hxfn.review.reviewPrefab);
        if(hxdt.setting_comn.review){
            var groups = [this.Battle_NiuNiu,this.Battle_BoYanZi,this.Battle_SanGong,this.Lobby,this.Login];
            groups.forEach(element => {
                this.HandlePrefabs(element);
            });
        }
        
        this.AllSceneUI = hxdt.setting.uiscene.Login
        .concat(hxdt.setting.uiscene.Lobby)
        .concat(hxdt.setting.uiscene.Battle_NiuNiu)
        .concat(hxdt.setting.uiscene.Battle_BoYanZi)
        .concat(hxdt.setting.uiscene.Battle_SanGong)
        .concat(hxdt.setting.uiscene.Battle_Gobang)
        .concat(hxdt.setting.uiscene.Battle_Landlord);
    },

    HandlePrefabs(prefabs){
        for(var i=0;i!=prefabs.length;++i){
            if(hxfn.review.reviewPrefab.indexOf(prefabs[i] + '_Review') != -1){
                prefabs[i] += '_Review';
            }
        }
    }
};