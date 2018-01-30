import { hxdt } from "../../../DT/HXDT";
import { hxjs } from "../../../../HXJS/HXJS";

cc.Class({
    extends: cc.Component,

    properties: {
        //对象素材
        itemObj: cc.Prefab,
        //容器
        anchorChipToss: cc.Node,

        curGroupIdx: -1,

        //缓存
        allChipsCache:[],
        chipArrCache:[],

        hasPreCreate:{ default: false, serializable: false, visible: false},
    },
    
    ////////////////////////////////////////////////////////////////////////
    onLoad: function () {
        this.PreCache(hxdt.setting_niuniu.Count_CoinPreCreate);
        hxfn.adjust.AdjustLabel(this.node);
    },

    OnReset () {
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器

        this.curGroupIdx = -1;
        this.hasPreCreate = false;
        this.chipArrCache = [];
        this.allChipsCache.forEach(function(element) {
            this.DeleteCoin(element);
            // element.getComponent ('AnimCoinFly').OnReset();
            // this.Cycle(element);
        }.bind(this), this);
        this.allChipsCache = [];
    },

    OnEnd () {
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
        
        this.allChipsCache.forEach(function(element) {
            element.destroy();
        }, this);

        this.allChipsCache = null;
        this.hasPreCreate  = false;
    },
    ////////////////////////////////////////////////////////////////////////

    
    //位置1：开始位置，位置2：目标位置，金币数量，时间，
    SetInfo (groups) {//time, num, 
        this.PreCache(hxdt.setting_niuniu.Count_CoinPreCreate);
        
        // this.flyTime = time;
        // this.objNum = num;
        // this.flyGroups = groups;

        //初始化参数完成，开始执行效果
        this.StartFly(groups);
    },

    StartFly:function (flyGroups) {
        if (!flyGroups)
            return;
            
        if (flyGroups.length >= 1) {
            let group = flyGroups[0];
            group.forEach(function(element) {
                if(element!= null && element[0] != null && element[1] != null) {
                    this.MgrEmit(element[0], element[1]);
                }
            }.bind(this), this);
        }

        if (flyGroups.length >= 2) {
            this.scheduleOnce(function(){
                let group = flyGroups[1];
                group.forEach(function(element) {
                    //HACK  由于最多5个玩家变成6个玩家
                    if(element!= null && element[0] != null && element[1] != null) {
                        this.MgrEmit(element[0], element[1]);
                    }
                }.bind(this), this);
            }.bind(this), hxdt.setting_niuniu.Time_ResultCoinFlyPerPhase);
        }
    },

    MgrEmit(originPos, targetPos) {
        // 间隔时间不固定
        // var deltaTime = (this.duration-this.chipDuration)/(this.coinNum-1)/2;
        // 间隔时间
        var deltaTime = hxdt.setting_niuniu.deltaSpawncoin;
        // cc.log('deltaTime: ' + deltaTime);

        this.schedule(function(){
            this.EmitOnce(originPos, targetPos);
        }.bind(this),deltaTime,hxdt.setting_niuniu.Count_GroupCoin/hxdt.setting_niuniu.Count_SpawnOnce,0);
    },

    EmitOnce:function(originPos, targetPos){
        // for (let i = 0; i < hxdt.setting_niuniu.Count_SpawnOnce.length; i++) {
            this.Emit(originPos, targetPos);
            this.Emit(originPos, targetPos);
            this.Emit(originPos, targetPos);
            this.Emit(originPos, targetPos);
        // }
    },

    Emit:function (p1,p2) {
        var chip = null;

        if(this.chipArrCache.length > 0){
            chip = this.chipArrCache.shift();
            // chip.active = true;
            // hxjs.module.ui.hub.ShowCom(chip);
        } else {
            return;
        }


        //HACK should random one position
        var originPos = p1;
        var targetPos = p2;
        // cc.log('~~~~~~~~~~~~~ cc.randomMinus1To1(): ' + cc.randomMinus1To1());
        var neworiginPos = originPos;//cc.p(originPos.x+cc.randomMinus1To1() * 20, originPos.y+cc.randomMinus1To1() * 20);
        var newtargetPos = cc.p(targetPos.x+cc.randomMinus1To1() * hxdt.setting_niuniu.Radius4TarCoin, targetPos.y+cc.randomMinus1To1() * hxdt.setting_niuniu.Radius4TarCoin);
        // cc.log(cc.randomMinus1To1() * 120);
        this.Fly(chip, neworiginPos, newtargetPos, hxdt.setting_niuniu.Time_PerCoinFlyDuration);
    },

    Fly (chip, pos1, pos2, duration) {
        var scr = chip.getComponent ('AnimCoinFly');
        scr.OnInit (pos1, pos2, duration, this.Cycle.bind(this));
        hxjs.module.ui.hub.ShowCom(chip);
        scr.PlayNextFrame();
        // scr.Play ();
    },

    Cycle (chip) {
        // chip.active = false;
        hxjs.module.ui.hub.HideCom(chip);
        if(this.chipArrCache.indexOf(chip) == -1)
            this.chipArrCache.push(chip);
    },

    PreCache(num) {
        if(!this.hasPreCreate) {
            this.hasPreCreate = true;
            
            for (let i = 0; i < num; i++) {
                var chip = this.CreateCoin();
                this.allChipsCache.push(chip);
            }

            this.chipArrCache = [];
            this.allChipsCache.forEach(function(element) {
                element.getComponent ('AnimCoinFly').OnReset();
                this.Cycle(element);
            }.bind(this), this);
        }
    },

    CreateCoin() {
        var chip = cc.instantiate(this.itemObj);
        this.anchorChipToss.addChild(chip);
        hxjs.module.ui.hub.HideCom(chip);
        return chip;
    },

    DeleteCoin(chip) {
        chip.destroy();
    }
});