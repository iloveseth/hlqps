cc.Class({
    extends: cc.Component,

    properties: {
       leftArrow:cc.Node,
       rightArrow:cc.Node,
       movingNode:cc.Node,
    },

    onLoad: function () {
        this.leftArrow.active=false;
        this.rightArrow.active=false;
        this.setArrow();
    },
    setArrow:function(){
        cc.log('@@'+this.movingNode.getPosition().x);
        if(this.movingNode.getPosition().x>=-310){
            this.leftArrow.active=false;
            this.rightArrow.active=true;
        }
        else if(this.movingNode.getPosition().x<=-800){
            this.leftArrow.active=true;
            this.rightArrow.active=false;
        }
        else{
            this.leftArrow.active=true;
            this.rightArrow.active=true;
        }
    },
    onScrollMoving:function(scrollview, eventType, customEventData){
        if(eventType ==cc.ScrollView.EventType.SCROLLING){ 
            this.setArrow();
        }
    }
});