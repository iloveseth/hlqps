export enum Enum_ChatType {
    CHAT_MSG=0,     //固定文字
    CHAT_FACE=1,    //表情
    CHAT_TEXT=2,    //手输文字
    CHAT_VOICE=3    //语音
}

export class Setting_Battle
{
    //文字聊天列表
    public static readonly ChatMsgs:any[] = [
        {txt:'大家好，很高兴见到各位。',voice_m:'voice_djh_m',voice_f:'voice_djh_f'},
        {txt:'我是庄家，谁敢挑战我？',voice_m:'voice_wsz_m',voice_f:'voice_wsz_f'},
        {txt:'我加注了，你们敢不敢跟？',voice_m:'voice_wjz_m',voice_f:'voice_wjz_f'},
        {txt:'同志们，敢不敢火拼一把？',voice_m:'voice_tzm_m',voice_f:'voice_tzm_f'},
        {txt:'快点下注吧，一会就没机会了。',voice_m:'voice_kdxz_m',voice_f:'voice_kdxz_f'},
        {txt:'快点吧，我等的花也谢了。',voice_m:'voice_kdb_m',voice_f:'voice_kdb_f'},
        {txt:'君子报仇，下局不晚。这局暂且放过你。',voice_m:'voice_jzbc_m',voice_f:'voice_jzbc_f'},
        {txt:'风水轮流转，底裤都输光了。',voice_m:'voice_fsllz_m',voice_f:'voice_fsllz_f'},
        {txt:'你的牌打的也太好了。',voice_m:'voice_ndp_m',voice_f:'voice_ndp_f'},
        {txt:'怎么又掉线了，网络怎么这么差？',voice_m:'voice_zmydx_m',voice_f:'voice_zmydx_f'},
        {txt:'你们玩吧，我先走了。',voice_m:'voice_nmw_m',voice_f:'voice_nmw_f'},
    ];

    //表情聊天列表
    public static readonly ChatFaces:string[] = [
        'T_Emotion_1','T_Emotion_2','T_Emotion_3','T_Emotion_4','T_Emotion_5',
        'T_Emotion_6','T_Emotion_7','T_Emotion_8','T_Emotion_9','T_Emotion_10',
        'T_Emotion_11','T_Emotion_12','T_Emotion_13','T_Emotion_14','T_Emotion_15',
        'T_Emotion_16','T_Emotion_17','T_Emotion_18','T_Emotion_19','T_Emotion_20',
        'T_Emotion_21','T_Emotion_22','T_Emotion_23','T_Emotion_24','T_Emotion_25',
        'T_Emotion_26','T_Emotion_27','T_Emotion_28',
    ];

    
    //动画旋转表，-1为不旋转，按照顺序0-5排序
    public static readonly EmojFlipArr:Array<Array<number>> = [
        [-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1],
        [0 , 1, 2,-1,-1,-1],
        [0,  1, 2, 3,-1,-1],
        [0,  1, 2, 3, 4,-1]
    ];

    /*
        动画配置方法：分为前中后三段，每段都有控制
        {
            id：可以不管
            prefab：动画的prefab
            icon :显示的静态图
            beginAudio ：开始时播放的音频，-1为不播放
            moveTime：中间动画移动时间(秒)，0为不移动
            duration:动画总时间，控制最终显示隐藏
            moveNeedRotate：中间动画移动时是否需要旋转，如丘比特的箭和车
            beginNeedRotate：开始动画是否需要旋转，如丘比特
            beginNeedFlip：开始是否需要翻转(根据座位号旋转，旋转表见EmojFlipArr)，如丘比特就需要
            midNeedFlip：中间移动是否需要翻转(根据座位号旋转，旋转表见EmojFlipArr)，如车就需要
            endLeftFlip:左侧是否需要翻转播放
        }
        动画的prefab中AnimEmojFly脚本说明：
        {
            midImage:cc.Node,//中间动画
            endEff:cc.Animation,//结束动画
            beginEff:cc.Animation,//开始动画
            midEffPs:cc.ParticleSystem,//中间粒子
            midEff:cc.Animation//中间特效
        }
        Anim中可用事件：
        {
            FunPlayAudio//播放音频int参数
            FunPlayMid//播放中间动画 bool参数，表示是否隐藏起始动画
            FunPlayEnd//播放结束动画 bool参数，表示是否隐藏中间动画
        }
        Anim需要挂载AnimEmojFlyFunc脚本，并把带有AnimEmojFly的节点拖入参数
      

    */

    public static readonly EmojTypes:any[] = [
        {id: 0, prefab:'UI_Item_Emoj_Cool', icon:'Icon_Cool', beginAudio:0, moveTime:0.8, duration:7.5,moveNeedRotate:false,beginNeedRotate:false,beginNeedFlip:false,midNeedFlip:false,endLeftFlip:true},
        {id: 0, prefab:'UI_Item_Emoj_Cupid', icon:'Icon_Cupid',beginAudio:-1, moveTime:0,  duration:5.5,moveNeedRotate:true,beginNeedRotate:true,beginNeedFlip:true,midNeedFlip:true,endLeftFlip:false},
        {id: 0, prefab:'UI_Item_Emoj_Brawl', icon:'Icon_Brawl',beginAudio:-1, moveTime:0.8,  duration:8,moveNeedRotate:true,beginNeedRotate:false,beginNeedFlip:false,midNeedFlip:true,endLeftFlip:false},
        {id: 0, prefab:'UI_Item_Emoj_Missile', icon:'Icon_Missile',beginAudio:-1, moveTime:0,  duration:4.8,moveNeedRotate:false,beginNeedRotate:false,beginNeedFlip:false,midNeedFlip:false,endLeftFlip:false},
        {id: 0, prefab:'UI_Item_Emoj_SB', icon:'Icon_SB',beginAudio:-1, moveTime:0.8,  duration:8.0,moveNeedRotate:false,beginNeedRotate:false,beginNeedFlip:false,midNeedFlip:false,endLeftFlip:false},
        {id: 0, prefab:'UI_Item_Emoj_Bomb', icon:'Icon_bomb',beginAudio:0, moveTime:0.8,  duration:3,moveNeedRotate:false,beginNeedRotate:false,beginNeedFlip:false,midNeedFlip:false,endLeftFlip:false},
        {id: 0, prefab:'UI_Item_Emoj_Flower', icon:'Icon_flower',beginAudio:0, moveTime:0.8,  duration:3,moveNeedRotate:false,beginNeedRotate:false,beginNeedFlip:false,midNeedFlip:false,endLeftFlip:false},
        {id: 0, prefab:'UI_Item_Emoj_Hit', icon:'Icon_hit', beginAudio:0, moveTime:0.8, duration:3,moveNeedRotate:false,beginNeedRotate:false,beginNeedFlip:false,midNeedFlip:false,endLeftFlip:false},
        {id: 0, prefab:'UI_Item_Emoj_Kiss', icon:'Icon_kiss', beginAudio:0, moveTime:0.8, duration:3,moveNeedRotate:false,beginNeedRotate:false,beginNeedFlip:false,midNeedFlip:false,endLeftFlip:false},
        {id: 0, prefab:'UI_Item_Emoj_Tomato', icon:'Icon_tomato', beginAudio:0, moveTime:0.8, duration:3,moveNeedRotate:false,beginNeedRotate:false,beginNeedFlip:false,midNeedFlip:false,endLeftFlip:false},
    ];
}