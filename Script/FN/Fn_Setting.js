import { hxjs } from "../../HXJS/HXJS";
import { uwcontroller } from "../../HXJS/Module/UW/UWController";
import { hxdt } from "../DT/HXDT";
import { hxfn } from "./HXFN";

export let setting = 
{
    GetBgmId () {
        var id = 0;
        var stateId = this.GetSoundMusicState();

        if(uwcontroller.curState == hxdt.enum_game.Enum_GameState.Battle){
            if(stateId == hxdt.setting_comn.Enum_BGMStyleIdx.Cn) {
                if(hxfn.map.curGameTypId == hxfn.map.Enum_GameplayId.QiangZhuang)
                    id = hxdt.setting_comn.Enum_BGMId.Battle_PinShi_Cn;
            }
            else if(stateId == hxdt.setting_comn.Enum_BGMStyleIdx.Jazz) {
                id = hxdt.setting_comn.Enum_BGMId.Battle_PinShi;
            }
        }
        else if(uwcontroller.curState == hxdt.enum_game.Enum_GameState.Lobby){
            if(stateId == hxdt.setting_comn.Enum_BGMStyleIdx.Cn) {
                id = hxdt.setting_comn.Enum_BGMId.Lobby_CN;
            }
            else if(stateId == hxdt.setting_comn.Enum_BGMStyleIdx.Jazz) {
                id = hxdt.setting_comn.Enum_BGMId.Lobby;
            }
        }

        return id;
    },
    // GetSoundMusicState(){
    //     var isSoundMusicChecked = cc.sys.localStorage.getItem('isSoundMusicChecked');
        
    //     if(isSoundMusicChecked == null){
    //         isSoundMusicChecked = 'true';
    //         cc.sys.localStorage.setItem('isSoundMusicChecked', isSoundMusicChecked);
    //     }
        
    //     return isSoundMusicChecked.toBool();
    // },

    GetSoundMusicState(){
        var soundMusicStateId = cc.sys.localStorage.getItem('id4SoundMusic');
        
        if(soundMusicStateId == null){
            soundMusicStateId = hxdt.setting_comn.Enum_BGMStyleIdx.Jazz;
            cc.sys.localStorage.setItem('id4SoundMusic', soundMusicStateId);
        }
        
        return soundMusicStateId;
    },
    
    GetSoundEffectState(){
        var isSoundEffectChecked = cc.sys.localStorage.getItem('isSoundEffectChecked');

        if(isSoundEffectChecked == null) {
            isSoundEffectChecked = 'true';
            cc.sys.localStorage.setItem('isSoundEffectChecked', isSoundEffectChecked);
        }
        
        return isSoundEffectChecked.toBool();
    },

    GetShakeState(){
        var isShakeChecked = cc.sys.localStorage.getItem('isShakeChecked');
        if(isShakeChecked == null) {
            isShakeChecked = 'true';
            cc.sys.localStorage.setItem('isShakeChecked', isShakeChecked);
        }

        return isShakeChecked.toBool();
    },
    
    UpdateSoundMusicState(styleID){
        if(styleID == cc.sys.localStorage.getItem('id4SoundMusic'))
        return;

        // 保存状态值
        cc.sys.localStorage.setItem('id4SoundMusic',styleID);

        // 处理音乐
        //即时切换
        if(styleID > 0) {
            hxjs.module.sound.StopAllBGM();
            var stateId = this.GetBgmId();
            cc.warn('stateId: ' + stateId);
            if(stateId > 0) hxjs.module.sound.PlayBGM(stateId);
        }

        hxjs.module.sound.ToggleSoundMusic(styleID > 0);
    },
    // UpdateSoundMusicState(isCheck){
    //     // 保存状态值
    //     cc.sys.localStorage.setItem('isSoundMusicChecked',isCheck);
        
    //     // 处理音乐
    //     hxjs.module.sound.ToggleSoundMusic(isCheck);
    // },
    
    UpdateSoundEffectState(isCheck){
        cc.sys.localStorage.setItem('isSoundEffectChecked',isCheck);

        hxjs.module.sound.ToggleSoundEffct(isCheck);
    },

    UpdateShakeState(isCheck){
        // TODO
        cc.sys.localStorage.setItem('isShakeChecked',isCheck);
    },

    ClearLocalRecord () {
        cc.sys.localStorage.removeItem('isSoundEffectChecked');
        // cc.sys.localStorage.removeItem('isSoundMusicChecked');
        cc.sys.localStorage.removeItem('id4SoundMusic');
        cc.sys.localStorage.removeItem('isShakeChecked');
    }
}