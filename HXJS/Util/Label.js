export let lable = {
    fontMultiple : 3/2,
    
    AdjustLabel(node){
        var labelList = node.getComponentsInChildren(cc.Label);
        if(labelList.length == 0){
            return;
        }
        labelList.forEach(function(element) {
            if(element.useSystemFont){
                let node = element.node;
                if(node.scaleX == 1 && node.scaleY == 1){
                    node.scaleX = 1/this.fontMultiple;
                    node.scaleY = 1/this.fontMultiple;
                    node.width *= this.fontMultiple;
                    node.height *= this.fontMultiple;
                    element.fontSize *= this.fontMultiple;
                    element.lineHeight *= this.fontMultiple;
                }
            } 
        }, this);
    }
}