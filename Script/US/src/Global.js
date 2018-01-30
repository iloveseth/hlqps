window.Global = {
    playerName:'',  //玩家名称
    roomWaitType:'create',
    roomNum:0,   //房间号
    allPokers:[],  //所有牌
    selectPokers:[],    //选择的牌
    isPass:false,       //是否点了不出
    roomIndex: -1,      //当前玩家座位号 (0,1,2);
};


/**
 * Custom
 */
cc.Component.prototype.$ = cc.Component.prototype.getComponent;
cc.Node.prototype.$ = cc.Node.prototype.getComponent;
cc.Node.prototype.gn = cc.Node.prototype.getChildByName;
cc.Component.prototype.$$ = cc.Node.prototype.$$ = function(component,value){
    let com = this.$(component);
    if(component == cc.Label){
        com.string = value;
    }else if(component == cc.Sprite){
        com.spriteFrame = value;
    }
    return com;
};
cc.Node.prototype.gns = function(...value){
    let node = this;
    for(let i = 0;i<value.length;i++){
        node = node.gn(value[i]);
    }
    return node;
};

