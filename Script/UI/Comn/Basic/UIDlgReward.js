cc.Class({
    extends: require('UIPanelDlg'),

    properties: {
        rolReward:require('UIScrollView'),
        rolContent: cc.Node,
        preReward: cc.Prefab,
        rolView: cc.Node,
        // lstReward:require('UILst'),
        tipTxt:cc.Label,
        viewWidth: 550,
        itemWidth: 120,
    },

    onLoad: function () {
        this.Init();
        this.tipTxt.node.active=false;
    },
    
    SetInfo (info, title, rewards) {
        //Base func
        this.PlayOpenAnim();
        this.SetBasicInfo(info, title);

        

        this.rolContent.width = 0;
        var rewardsNum = rewards.length;
        var hasYuanbao=false;
        for(var idx = 0;idx != rewardsNum;++idx){
            var node = cc.instantiate(this.preReward);
            // node.x = 275 + 120*(idx + 1 -(rewardsNum+1)/2);
            node.x = this.viewWidth/2 + this.itemWidth*(idx + 1 -(rewardsNum+1)/2);
            node.getComponent('UIItemItem').SetInfo(rewards[idx]);
            this.rolContent.addChild(node);
            if(rewards[idx]['typ']==hxfn.comn.ItemTyp.yuanbao){
                hasYuanbao=true;
            }
        }

        // if(hasYuanbao){
        //     this.tipTxt.node.active=true;
        // }

        //this.rolReward.SetInfo(rewards);
        
    },

});