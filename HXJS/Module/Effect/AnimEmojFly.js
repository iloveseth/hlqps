import { Setting_Battle } from "../../../Script/DT/DD/Setting_Battle";

cc.Class({
    extends: cc.Component,

    properties: {
        midImage:cc.Node,//中间动画，如果有此则默认就直接飞此动画 
        endEff:cc.Animation,
        beginEff:cc.Animation,
        midEffPs:cc.ParticleSystem,
        midEff:cc.Animation
    },

    onLoad: function () { 

    },

    OnInit(info,originPos, targetPos,fromIndex,toIndex) {
        this.info =info;
        this.originPos = originPos;
        this.targetPos = targetPos; 
        this.fromIndex= fromIndex;
        this.toIndex =toIndex; 
        this.moveTime =parseFloat(this.info['moveTime']);
        this.node.setPosition(originPos);
        this.moveNeedRotate = this.info['moveNeedRotate'];
        this.beginNeedRotate = this.info['beginNeedRotate'];
        this.beginNeedFlip = this.info['beginNeedFlip'];
        this.midNeedFlip = this.info['midNeedFlip'];
        this.endLeftFlip = this.info['endLeftFlip'];
        cc.log('@@'+this.endLeftFlip);
    },
    Play () { 
        var beginAudio =parseInt(this.info['beginAudio']);
        if(beginAudio>=0){
            hxjs.module.sound.PlayGift(this.info['beginAudio']);
        }
    
        if(this.midImage!=null&&this.beginEff==null){
            if(this.moveNeedRotate){
                this.RotateNode(this.midImage,this.midNeedFlip);
                
            }
            var mt = cc.moveTo(this.moveTime, this.targetPos);
            this.node.runAction(mt).easing(cc.easeInOut(hxdt.setting_niuniu.Rate4CoinMove));
    
            this.scheduleOnce(function(){
                this.midImage.active=false;
                this.endEff.node.active=true;
                this.endEff.play();
                if(this.endLeftFlip&&this.toIndex<2){
                    this.endEff.node.scaleX = -1* this.endEff.node.scaleX;
                }
    
            }.bind(this),this.moveTime);
        }
        else{
            if(this.beginEff!=null){
                this.beginEff.node.active=true;
                if(this.beginNeedRotate){ 
                    this.RotateNode(this.beginEff.node,this.beginNeedFlip);
                   
                }
                this.beginEff.play();
            }
        }
        this.scheduleOnce(function(){
            hxjs.module.ui.hub.Unload(this.node);
        }.bind(this), parseFloat(this.info['duration']));
    },
    HiddenAll(){
        if(this.beginEff!=null){
            this.beginEff.node.active=false;
        } 
        if(this.midImage!=null){
            this.midImage.active=false;
        } 
        if(this.midEffPs!=null){
            this.midEffPs.node.active=false;
        } 
        if(this.midEff!=null){
            this.midEff.node.active=false;
        } 
        if(this.endEff!=null){
            this.endEff.node.active=false;
        } 
        
    },
    onDestroy () {
        this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
    }
    ,
    FunPlayAudio(id){
        hxjs.module.sound.PlayGift(id);
    },
    RotateNode(node,flip){
        var currentP = cc.p(this.targetPos.x, this.targetPos.y);
        var deltaP = currentP.sub(this.originPos); 
      
        var angle = cc.pToAngle(deltaP) / Math.PI * 180;
   
        node.rotation = -angle;

        if(flip){
            var arrFlip = Setting_Battle.EmojFlipArr[this.fromIndex];
            var flip = arrFlip[this.toIndex];
            if(flip>=0){
                node.scaleY = -node.scaleY;
            }
        }
    },
    FunPlayMid(isKeepBegin){  
        if(this.beginEff!=null&&(isKeepBegin ==undefined ||isKeepBegin==false)){
            this.beginEff.node.active=false;
        } 
        if(this.midEffPs==null&&this.midEff==null&&this.midImage==null){
            return;
        }
        if(this.midEffPs!=null){
            
            this.midEffPs.node.active=true;
            if(this.moveNeedRotate){
                this.RotateNode(this.midEffPs.node,this.midNeedFlip);
            }
            if(this.moveTime>0){
                var mt = cc.moveTo(this.moveTime, cc.p(this.targetPos.x-this.originPos.x,this.targetPos.y-this.originPos.y));
                this.midEffPs.runAction(mt).easing(cc.easeInOut(hxdt.setting_niuniu.Rate4CoinMove));
            }

        }
        if(this.midEff!=null){
            this.midEff.node.active=true;
            this.midEff.play();
            if(this.moveNeedRotate){
                this.RotateNode(this.midEff.node,this.midNeedFlip);
            }
            if(this.moveTime>0){
                var mt = cc.moveTo(this.moveTime, cc.p(this.targetPos.x-this.originPos.x,this.targetPos.y-this.originPos.y));
                this.midEff.runAction(mt).easing(cc.easeInOut(hxdt.setting_niuniu.Rate4CoinMove));
            }
        }
        if(this.midImage!=null){
            this.midImage.active=true;
            if(this.moveNeedRotate){
                this.RotateNode(this.midImage,this.midNeedFlip);
            }
            if(this.moveTime>0){
                var mt = cc.moveTo(this.moveTime, cc.p(this.targetPos.x-this.originPos.x,this.targetPos.y-this.originPos.y));
                this.midImage.runAction(mt).easing(cc.easeInOut(hxdt.setting_niuniu.Rate4CoinMove));
            }
            
            this.scheduleOnce(function(){
                this.midImage.active=false;
                if(this.endEff!=null){
                    this.endEff.node.active=true;
                    this.endEff.node.setPosition(cc.p(this.targetPos.x-this.originPos.x,this.targetPos.y-this.originPos.y));
                    this.endEff.play();
                }  
    
            }.bind(this),this.moveTime);
        }
        
    },
    FunPlayEnd(isKeepMid){
        if(this.midEffPs!=null&&(isKeepMid ==undefined ||isKeepMid==false)){
            this.midEffPs.node.active=false;
        } 
        if(this.midEff!=null&&(isKeepMid ==undefined ||isKeepMid==false)){
            this.midEff.node.active=false;
        } 
        if(this.endEff==null){
            return;
        }
        
        if(this.endEff!=null){ 
            this.endEff.node.active=true;
            if(this.endLeftFlip&&this.toIndex<2){
                this.endEff.node.scaleX = -1* this.endEff.node.scaleX;
            }
            this.endEff.play();
      
            this.endEff.node.setPosition(cc.p(this.targetPos.x-this.originPos.x,this.targetPos.y-this.originPos.y));
        }
    }

});
