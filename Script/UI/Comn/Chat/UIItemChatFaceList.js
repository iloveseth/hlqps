
cc.Class({
    extends: cc.Component,

    properties: {
        emotion:[cc.Animation],
    },

    onLoad: function () { 
    },
    getEmotion:function(index){ 
        if(index<this.emotion.length){
            return this.emotion[index];
        }
        return null;
        
    }

    
});