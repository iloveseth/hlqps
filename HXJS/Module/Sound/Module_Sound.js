import { hxfn } from "../../../Script/FN/HXFN";
import { hxjs } from "../../HXJS";

export let soundmgr = {

        // [nondisplay]
        isMusicEnable:false,
        isEffectEnable:false,
        isEffectEnableTemp:false,//临时用来记住isEffectEnable的当前设置值，以便恢复
        
        ases_ui_com:null,
        ases_niu_score_Male:null,
        ases_niu_score_Female:null,
        ases_battle:null,
        ases_gift:null,
        ases_chat:null,
        // ases_battle_male:{default: null, serializable: false, visible: false},
        // ases_battle_female:{default: null, serializable: false, visible: false},
        ases_bgm:null,

        //背景音乐唯一
        curBGMId:-1,
        preBGMId:-1,//由于可能默认就没有开启播放音乐的选线，但是仍然要记住本来要播放的bgm

    OnInit (){
        this.InitAllSoundRes();

        this.CheckSettings();
    },

    InitAllSoundRes:function(){
        //定好优先级，一级一级加载
        //1,UI
        //2,BGM
        //3,Battle

        //1
        hxjs.module.asset.LoadPrefab_Sfx('Sfx_UI_Com',function(prefab){
            this.ases_ui_com = prefab.getComponent('SoundSet2');

            //2,
            hxjs.module.asset.LoadPrefab_Sfx('Sfx_BGM',function(prefab){
                this.ases_bgm = prefab.getComponent('SoundSet');
                this.ases_bgm.OnInit();
    
                // //检测是否已经播放背景音乐，需恢复现场
                // if(this.curBGMId != -1)
                //     this.ases_bgm.PlayBGM(this.curBGMId);
                this.CheckBGMPlay();

                //3,
                this.Load4Battle();

            }.bind(this), this.node);

        }.bind(this), this.node);
    },

    CheckSettings:function (){
        this.isMusicEnable = hxfn.setting.GetSoundMusicState() > 0;

        this.isEffectEnable = hxfn.setting.GetSoundEffectState();
        this.isEffectEnableTemp = this.isEffectEnable;

        this.CheckBGMPlay();
    },

    CheckBGMPlay:function(){
        if(!this.isMusicEnable) return;

        //检测是否已经有设置播放背景音乐，有则需恢复现场
        if(this.curBGMId != -1) {
            // cc.log('CheckBGMPlay');
            this.PlayBGMReal(this.curBGMId);
        }
    },

    Load4Battle:function (){
        hxjs.module.asset.LoadPrefab_Sfx('Sfx_Battle_PinShi_Score_Male',function(prefab){
            this.ases_niu_score_Male = prefab.getComponent('SoundSet');
            this.ases_niu_score_Male.OnInit();
        }.bind(this), this.node);

        hxjs.module.asset.LoadPrefab_Sfx('Sfx_Battle_PinShi_Score_Female',function(prefab){
            this.ases_niu_score_Female = prefab.getComponent('SoundSet');
            this.ases_niu_score_Female.OnInit();
        }.bind(this), this.node);

        hxjs.module.asset.LoadPrefab_Sfx('Sfx_Battle',function(prefab){
            this.ases_battle = prefab.getComponent('SoundSet');
            this.ases_battle.OnInit();
        }.bind(this), this.node);

        hxjs.module.asset.LoadPrefab_Sfx('Sfx_UI_Gift',function(prefab){
            this.ases_gift = prefab.getComponent('SoundSet');
            this.ases_gift.OnInit();
        }.bind(this), this.node);

        hxjs.module.asset.LoadPrefab_Sfx('Sfx_UI_Chat',function(prefab){
            this.ases_chat = prefab.getComponent('SoundSet');
            this.ases_chat.OnInit();
        }.bind(this), this.node);
    },

    // Effect type =======================================
    PlayUI_Button () {
        if(!this.isEffectEnable) return;
        
        // this.audioSource.play();
        if(this.ases_ui_com != null)
            this.ases_ui_com.Play('Btn_Click');
        // this.ases_ui_com.play('Tog_Check');
    },
    
    //HACK /////////////////////////////////////////////////////////////////////////////////
    //拼十专有////////////////////////////
    //0 无牛， 1-9 牛一 到 牛九 10牛牛 ......
    PlayNiuScore (score,isMale) {
        if(!this.isEffectEnable) return;

        if(isMale){
            if(this.ases_ui_com != null)
                this.ases_niu_score_Male.Play(score);
        }
        else{
            if(this.ases_niu_score_Female != null)
                this.ases_niu_score_Female.Play(score);
        }
    },

    //战斗通用////////////////////////////
    //抢庄
    // PlayVieBanker (isQZ,isMale) {
    //     if(!this.isEffectEnable) return;

    //     if(isMale){
    //         this.ases_battle_male.Play(hxdt.setting_niuniu.Enum_BattleSFX.QZ);
    //     }
    //     else{
    //         this.ases_battle_female.Play(hxdt.setting_niuniu.Enum_BattleSFX.QZ);
    //     }
    // },

    //发牌
    //飞金币

    PlayBattle(battleSfxId){
        if(!this.isEffectEnable) return;

        if(this.ases_battle != null)
            this.ases_battle.Play(battleSfxId);
    },

    StopBattle(battleSfxId){
        if(!this.isEffectEnable) return;

        if(this.ases_battle != null)
            this.ases_battle.Stop(battleSfxId);
    },



    //背景音乐 /////////////////////////////////////////////////////////////////////////////
    //大厅

    //玩法：拼十
    PlayBGM(bgmId){
        this.preBGMId = bgmId;

        if(!this.isMusicEnable) return;
        
        this.curBGMId = bgmId;

        // if(this.ases_bgm != null)
        //     this.ases_bgm.PlayBGM(bgmId);
        this.PlayBGMReal(bgmId);
    },

    PlayBGMReal:function(id){
        if(this.ases_bgm != null)
            this.ases_bgm.PlayBGM(id);
    },

    StopBGM(bgmId){
        if(!this.isMusicEnable) return;

        if(this.ases_bgm != null)
            this.ases_bgm.StopBGM(bgmId);

        this.curBGMId = -1;
        this.preBGMId = -1;
    },
    StopAllBGM(){
        if(!this.isMusicEnable) return;
        
        if(this.ases_bgm != null)
            this.ases_bgm.StopAllBGM();

        this.curBGMId = -1;
        this.preBGMId = -1;
    },

    //////////////////////////////////////////////////////////////////////////////////////
    ToggleSoundMusic(isEnable){
        this.isMusicEnable = isEnable;

        if(isEnable){
            // recover bg music
            if(this.curBGMId != -1){
                if(this.ases_bgm != null)
                    this.ases_bgm.RecoverBGM(this.curBGMId);
            }
            else {
                if(this.preBGMId != -1) {
                    this.PlayBGM(this.preBGMId);
                    // this.ases_bgm.PlayBGM(this.preBGMId);
                }
            }
        }
        else{
            // this.StopAllBGM();
            
            if(this.ases_bgm != null)
            this.ases_bgm.StopAllBGM();

            this.curBGMId = -1;
            this.preBGMId = -1;
        }
    },

    ToggleBGM4GameResume(isEnable){
        this.isMusicEnable = isEnable;

        if(isEnable){
            // recover bg music
            if(this.curBGMId != -1){
                if(this.ases_bgm != null)
                    this.ases_bgm.RecoverBGM(this.curBGMId);
            }
            else {
                if(this.preBGMId != -1) {
                    this.PlayBGM(this.preBGMId);
                    // this.ases_bgm.PlayBGM(this.preBGMId);
                }
            }
        }
        else{
            // silence all bg musics
            if(this.curBGMId != -1) {
                if(this.ases_bgm != null)
                    this.ases_bgm.SilenceBGM(this.curBGMId);
            }
        }
    },

    ToggleSoundEffct(isEnable){
        this.isEffectEnable = isEnable;
        this.isEffectEnableTemp = this.isEffectEnable;

        if(!isEnable){
            // 不需要
            //stop all currect effects
        }
    },

    StopAllEffcts(){
        // 主要针对循环音效

        //战斗部分
        this.StopBattle(hxdt.setting_niuniu.Enum_BattleSFX.Card_Dispath);
        this.StopBattle(hxdt.setting_niuniu.Enum_BattleSFX.Coin_Fly);
        this.StopBattle(hxdt.setting_niuniu.Enum_BattleSFX.QZ_Selecting);
        this.StopBattle(hxdt.setting_niuniu.Enum_BattleSFX.QZ_Sure);
        this.StopBattle(hxdt.setting_niuniu.Enum_BattleSFX.QZ_XiaZhu);
        this.StopBattle(hxdt.setting_niuniu.Enum_BattleSFX.Card_DispathLast);
        this.StopBattle(hxdt.setting_niuniu.Enum_BattleSFX.QZ_Male);
        this.StopBattle(hxdt.setting_niuniu.Enum_BattleSFX.QZ_Female);
        this.StopBattle(hxdt.setting_niuniu.Enum_BattleSFX.QZNo_Male);
        this.StopBattle(hxdt.setting_niuniu.Enum_BattleSFX.QZNo_Female);

        //大厅部分
    },

    PlayGift(giftSfxId){
        if(!this.isEffectEnable) return;

        if(this.ases_gift != null)
            this.ases_gift.Play(giftSfxId);
    },
    PlayChat(chatSfxId){
        if(!this.isEffectEnable) return;
        
        if(this.ases_chat != null)
            this.ases_chat.Play(chatSfxId);
    },



    //////////////////////////////////////////////////
    Recover(){
        var isPlay = hxfn.setting.GetSoundMusicState() > 0;
        if(isPlay)
            hxjs.module.sound.ToggleBGM4GameResume(isPlay);

        //如果允许音效，则恢复
        if(this.isEffectEnableTemp) {
            this.isEffectEnable = true;
        }
    },
    Silence(){
        var isPlay = hxfn.setting.GetSoundMusicState() > 0;
        if(isPlay)
            hxjs.module.sound.ToggleBGM4GameResume(false);

        //临时阻止音效
        this.isEffectEnable = false;
    },
}