cc.Class({
    extends: cc.Component,

    properties: {
        // [display] 
        node_mask:cc.Node,
        img_face:cc.Node,//Mask,
        img_back:cc.Node,
        img_hidden:cc.Node,
        arrCards:[cc.Sprite],
        node_bg:cc.Node,
        // [nondisplay]
        //详细参数  
        _lastProgress:-1,
        _fixedProgress:-1,
        cHalfWidth:{default: 349/*698/2*/, serializable: false, visible: false},
        cHalfHeight:{default: 252.5/*505/2*/, serializable: false, visible: false},
        cWidth:{default: 698, serializable: false, visible: false},
        cHeight:{default: 505, serializable: false, visible: false},

        hasComplete:false,

        isStartRubEnable:false, 

        //鼠标移动位置记录
        // getPosition(): Vec2;
        curMousePos:cc.p,
        beginMousePos:cc.p
        // curMousePos:{default: null,type:cc.Vec2, serializable: false, visible: false},
    },

    //直接内嵌的对象的脚本由外部初始化（根据初始化的时机）
    // onLoad: function () {
    //     this.OnInit(null);
    // },

    OnInit() {//info
        this.img_back.active=true;
        this.img_hidden.active=true;
        this._lastProgress = 0;
        this._fixedProgress = 0;
 

        this.node_bg.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            this.isStartRubEnable = false; 
        }, this);
        this.node_bg.on(cc.Node.EventType.TOUCH_END, this.MouseEnd.bind(this), this); 
        this.node_bg.on(cc.Node.EventType.TOUCH_START, this.MouseStart.bind(this), this);
        this.node_bg.on(cc.Node.EventType.TOUCH_MOVE, this.MouseMove.bind(this), this);
        for(var i=0;i<4;i++){
            var card = hxfn.battle.GetCardPointInfo(hxfn.battle.myAllCards[i]);
            hxjs.module.asset.LoadSprite('Card_Big/'+card['point'] + '_'+ card['suit'],this.arrCards[i]);
        }
        hxjs.module.asset.LoadSprite('Card_Big/back',this.arrCards[4]);
        var cardRub = hxfn.battle.GetCardPointInfo(hxfn.battle.myAllCards[4]);
        cc.log("card="+cardRub['point'] + '_'+ cardRub['suit']);
        hxjs.module.asset.LoadSprite('Card_Big/'+cardRub['point'] + '_'+ cardRub['suit'],this.img_face.getComponent("cc.Sprite"));
    },

    OnEnd () {
        this.isStartRubEnable = false;
        this.unscheduleAllCallbacks(this);
    },

    MouseEnd:function(touch,event){
        this.isStartRubEnable = false; 
  
    },
    MouseStart:function(touch,event){
        this.isStartRubEnable = true;
        this._fixedProgress = this._lastProgress;
        //只保留一次起始位置
        this.beginMousePos= touch.getLocation();
    },
    MouseMove:function (touch, event) {
        if(this.isStartRubEnable && !this.hasComplete) {
            var pos = touch.getLocation();
 

            var dx = pos.x-this.beginMousePos.x;
            var dy = pos.y-this.beginMousePos.y; 
            if(dx==0&&dy==0){
                return;
            }
            this.realMove(dx, dy);  
        }
    },

    flipProcess: function (progress, radian) {
        if (this.hasComplete)
            return null;  
        progress += this._fixedProgress;
        var angle = 180 / Math.PI * radian; 
       
        this.node_mask.rotation = angle;
        this.img_back.rotation=90-angle;
        this.img_face.rotation=90+angle; 

        var dx = Math.sin(radian ) * progress;
        var dy = Math.cos(radian ) * progress;
        
        //自由翻开效果
        this.node_mask.y = progress;
        this.img_back.x = dx;
        this.img_back.y = -dy; 
        this.img_face.x  = dx; 
        this.img_face.y  = dy;

        if (dy > this.cHeight * 0.3)
           this.finishMiFun(false);

        if (dx > this.cWidth * 0.3)
            this.finishMiFun(false);

        this._lastProgress = progress;
 
    },

    realMove: function (deltaX, deltaY) {  
        //向右增大，向下增大
        if (deltaY <= 0)
            deltaY = 0;
        //计算需要转动的角度
        var PI2 = Math.PI * 0.5;
        var PIA = Math.PI / 3;
        var radian = 0;
        if (deltaX > 0) {
            radian = Math.atan(deltaY / deltaX);
            radian = PI2 - radian;
            radian = radian*0.3;
        } 
        //限定转动角度不超过 
        radian = radian > PIA ? PIA : radian;  
        var delta = Math.sqrt(deltaY * deltaY + deltaX * deltaX); 
        delta=Math.ceil(delta*0.5);
        return this.flipProcess(delta, radian);
    },

    finishMiFun:function () {
        this.hasComplete = true;

        this.node_mask.y=0;
        this.img_back.active=false;
        this.img_back.x=0;
        this.img_back.y=0;
        this.img_face.x=0;
        this.img_face.y=this.cHeight;
       
      
       
        this.node_mask.rotation = 0;
        this.img_back.rotation=90;
        this.img_face.rotation=90;
 
        var cardRub = hxfn.battle.GetCardPointInfo(hxfn.battle.myAllCards[4]);
        hxjs.module.asset.LoadSprite('Card_Big/'+cardRub['point'] + '_'+ cardRub['suit'],this.arrCards[4]);

        this.img_hidden.active=true;
        this.img_hidden.runAction(cc.fadeOut(0.1));
        this.scheduleOnce(function(){ 
           
            var postData = {
                playerId:hxfn.role.playerId,
                open : true,
            };
            hxfn.net.Sync(
                postData,
                'QZInputRubPoker',
                hxdt.msgcmd.QZInputRubPoker,
            );
    
            hxjs.util.Notifier.emit('[NiuNiu]_BattleUI-LightCard');
            hxjs.util.Notifier.emit('UI_Battle_UpdateCDEventName', hxfn.battle_pinshi.Enum_EventCD.HasLightPoker);
            
            hxjs.util.Notifier.emit('UI_Battle_CD4RunPokerOver');
        }.bind(this),0.8); 
    },



    // backup
    ////////////////////////////////////////////////////////////////////////
    // flipProcess: function (progress, radian) {
    //     if (this.hasComplete)
    //         return null;

    //     progress += this._fixedProgress;

    //     var angle = 180 / Math.PI * radian;

    //     var face = this.con_face;//this.getChildByName("container", "face");
    //     var mask = this.mask_Poker;//this.getChildByName("container").mask;
    //     face.visible = true;

    //     mask.rotation = angle;
    //     face.rotation = angle * 2;

    //     if (this._dir === "h") {
    //         mask.x = cHalfWidth - progress;

    //         var dy = progress + Math.cos(radian * 2) * progress;
    //         var dx = Math.sin(radian * 2) * progress;

    //         face.x = cWidth - dy;
    //         face.y = cHeight - dx;

    //         if (dy > cWidth * 1.2)
    //             this.finishMiFun(false);

    //         if (dx > cHeight * 1.2)
    //             this.finishMiFun(false);

    //     } else {
    //         mask.y = cHalfHeight - progress;

    //         var dy = progress + Math.cos(radian * 2) * progress;
    //         var dx = Math.sin(radian * 2) * progress;

    //         face.x = 0 + dx;
    //         face.y = cHeight - dy;

    //         if (dy > cHeight * 1.2)
    //             this.finishMiFun(false);

    //         if (dx > cWidth * 1.2)
    //             this.finishMiFun(false);
    //     }

    //     this._lastProgress = progress;
    //     return [progress, radian];
    // },

    // realMove: function (deltaX, deltaY) {
    //     //向右增大，向下增大
    //     if (deltaY >= 0)
    //         deltaY = 0;

    //     //计算需要转动的角度
    //     var PI2 = Math.PI * 0.5;
    //     var PIA = Math.PI / 3;
    //     var radian = 0;
    //     if (deltaX > 0) {
    //         radian = Math.atan(-deltaY / deltaX);
    //         radian = PI2 - radian;
    //     }
    //     radian = radian > PIA ? PIA : radian;

    //     //gbx.log("cardMI realMove " + "dx:" + deltaX + " dy:" + deltaY + " ra:" + radian);

    //     var delta = Math.sqrt(deltaY * deltaY + deltaX * deltaX);
    //     var progress = Math.ceil(delta * 0.4);
    //     return this.flipProcess(progress, radian);
    // },
    ////////////////////////////////////////////////////////////////////////
});
