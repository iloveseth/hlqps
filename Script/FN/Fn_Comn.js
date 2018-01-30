import { hxdt } from "../DT/HXDT";
import { hxfn } from "./HXFN";
import { uwcontroller } from "../../HXJS/Module/UW/UWController";
import { hxjs } from "../../HXJS/HXJS";
import { enum_game } from "../DT/DD/Enum_Game";
import { log } from "../../HXJS/Util/Log";

export let comn = 
{
    ItemTyp : cc.Enum({
        gold: 300,            //金币房金币
        yuanbao : 301,        //金币房元宝
        diamond : 302,        //金币房钻石\房卡
        nameCard : 303,       //改名卡
        remedySignCard : 304, //补签卡
        smallHorn : 305,      //小喇叭
        vipLevel : 306,      //VIP等级
    }),
    safeGuradType:0,
    coinAtlas:'comn_item',
    notEnoughToLobby:false,
    CoinPath : cc.Enum({
        300 : 'coin_300',
        301 : 'coin_301',
        302 : 'coin_302',
        303 : 'coin_303',
        304 : 'coin_304',
        305 : 'coin_305',
        306 : 'coin_306',
    }),
    CoinPath4Battle : cc.Enum({
        300 : 'coin_battle_300',
        301 : 'coin_battle_301',
        302 : 'coin_battle_302',
    }),
    CoinPath4BattleXZ : cc.Enum({
        300 : 'coin_battlexz_300',
        301 : 'coin_battlexz_301',
        302 : 'coin_battlexz_302',
    }),

    CoinName: cc.Enum({
        300 : '金币',
        304 : '补签卡',
        305 : '小喇叭',
        301 : '元宝',
    }),

    OnInit() {
    },
    
    OnEnd () {
    },

    //TYPE 0-进入金币场提示  1-游戏内金币不足提示 2-游戏内元宝不足提示
    HandleSafeGuard (type,needToLobby){
        // cc.log('isOpen_SafeGuard');
        // cc.log(hxfn.comn.isOpen_SafeGuard);
        //HACK 暂时不开放
        if(!hxfn.comn.isOpen_SafeGuard)
            return;
        this.safeGuradType = type;
        this.notEnoughToLobby = needToLobby;
        cc.log('NoticeSafeGuard!!!');
        if(type ==0)//金币不足
        {
            hxjs.module.ui.hub.LoadPanel_Dlg('UI_Comn_Bankruptcy4Gold');
        }  
        else if(type == 1){
            hxjs.module.ui.hub.LoadPanel('UI_Comn_Bankruptcy4Gold');
        }
        else
        {
            this.IngotNotEnough(needToLobby);
        }
       

    },

    //元宝破产或者不足都提示,needToLobby如果为true则在其他按钮会退出，否则保留原始页面
    IngotNotEnough(needToLobby){
        this.notEnoughToLobby = needToLobby;
        hxjs.module.ui.hub.LoadPanel_DlgPop('UI_Dlg_Check_Bankruptcy4Ingot');
    },

    HandleServerResult(result){
        if(result != 0/*0:OK*/){
            var des = hxdt.errcode.codeToDesc(result);
            des = des !=null?des:'有错误哦！';

            hxjs.module.ui.hub.LoadDlg_Info(des, '友情提示');
            return true;
        }

        return false;
    },
    HandleClientResult(result){
        if(result != 0/*0:OK*/){
            var des = hxdt.clientError.codeToDesc(result);
            des = des !=null?des:'客户端发生错误哦！';

            hxjs.module.ui.hub.LoadDlg_Info(des, '友情提示');
            return true;
        }

        return false;
    },

    GetItemIcon:function(typ){
        // public static final int gold = 300;         //金币房金币
        // public static final int yuanbao = 301;      //金币房元宝
        // public static final int diamond = 302;      //金币房钻石\房卡
        var asset = '';
        switch (typ) {
            case this.ItemTyp.gold:
            asset = 'icon_coin_1';
            break;
            case this.ItemTyp.yuanbao:
            asset = 'ingot_6';//icon_coin_2';
            break;
            case this.ItemTyp.diamond:
            asset = 'icon_coin_3';
            break;
            case this.ItemTyp.vipLevel:
            asset = 'coin_306'
            break;
            case this.ItemTyp.remedySignCard:
            asset = 'coin_mission_304'
            break;
            default:
            break;
        }

        return asset;
    },

    GetTimeStyle(t){
        //！！！目前不会有超过99小时的情况出现，所以只需要处理00:00:00的格式
        var h = parseInt(t/3600);
        var m = parseInt((t-h*3600)/60);
        var s = parseInt((t-h*3600-m*60)%60);

        var hstr = '00';
        var mstr = '00';
        var sstr = '00';
        if(h>0) {
            hstr = this.GetTimeStyle2(h);
        }
        if(m>0) {
            mstr = this.GetTimeStyle2(m);
        }
        if(s>0) {
            sstr = this.GetTimeStyle2(s);
        } 
        cc.log(hstr+':' + mstr + ':' + sstr);
        return hstr+':' + mstr + ':' + sstr;
    },
    GetTimeStyle2:function (num){
        if(num < 10) {
            return '0' + num;
        }
        else if(num>99){
            return "99";
        }
        else return num+"";
    },

    JudgeIncluding(d,nums){
        for( var i=0;i!=nums.length;++i){
            if(nums[i] == d){
                return true;
            }
        }
        return false;
    },


    ///////////////////////////////////////////////////////////////////////////////
    // TODO 需要挪到合适的位置
    //!!! 一般只针对场景默认加载的面板，由于需要应付快速切换场景的情况（比较极端）
    //!!! 所有的UI面板有自身的环境配置，除通用的除外，只要异步加载完成都必须检测当前环境，如果不匹配，则销毁自身
    
    //（不是所有）XXXXXXXXXXXXXX 所有的延时加载必须判断自己的所处环境
    //比如，大厅延时加载的对象，如果生成时已经不在大厅，则需要销毁自身

    HandleDelayLoadObj (obj, state){
        var curState = hxjs.uwcontroller.curState;
        if(state !== curState){
            log.trace('ui', 'unload ui: ' + obj.name);
            hxjs.module.ui.hub.Unload(obj);
            return true;
        }

        return false;
    },


    //////////////////////////////////////////////////////////////////////////////
    //TEMP 搓牌，需要移动到fn_battle_pinshi
    OnReset4RubPokerTimer(){
        this.curcd = 0;
        if(this.timerHand){
            window.clearInterval(this.timerHand);
            this.timerHand=null;
        }
    },

    // 目前只是供战斗时搓牌的倒计时
    curcd:0,
    timerHandle:null,

    StartCD(maxTime){
        this.curcd = maxTime;
        if(this.timerHand){
            window.clearInterval(this.timerHand);
            this.timerHand=null;
        }
        this.timerHandle = window.setInterval(function(){
            --this.curcd;
            // cc.log('CD'+this.curcd);
            if(this.curcd<=0) {
                window.clearInterval(this.timerHandle);
                this.timerHand=null;
                this.curcd=0;
            }
        }.bind(this),1000);
    },
    StopCD(){
        window.clearInterval(this.timerHandle);
    },
    GetCurCD (){
        return parseInt(this.curcd);
    },



    //TEMP ///////////////////////////////////////
    //暂时用来开关功能
    isOpen_SafeGuard:true,
    //！！！XXX 服务端，领取破产奖励之后没有实际加到玩家身上
}