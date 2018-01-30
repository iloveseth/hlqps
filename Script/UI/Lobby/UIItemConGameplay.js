cc.Class({
    extends: cc.Component,

    properties: {
        // conStyle_1: cc.Node,
        conStyle1Item: cc.Node,
        
        // conStyle_2: cc.Node,
        // conStyle2Item1: cc.Node,
        // conStyle2Item2: cc.Node,
    },

    onLoad: function () {

    },

    /**
     * 
     * @param {[]} games 
     * @param {Number} style 
     */
    SetInfo(info,idx) {
        let games = info.games;
        let style = info.style;

        if(style == 1){
            // this.conStyle_1.active = true;
            // this.conStyle_2.active = false;

            this.conStyle1Item.getComponent('UIItemGameplay').SetInfo (games[0]/*length must be one*/,idx);
        }
        // else if(style == 2){
        //     this.conStyle_1.active = false;
        //     this.conStyle_2.active = true;
        //     this.conStyle2Item1.active = false;
        //     this.conStyle2Item2.active = false;

        //     if(games.length>0){
        //         if(games[0] != null){
        //             this.conStyle2Item1.active = true;
        //             this.conStyle2Item1.getComponent('UIItemGameplay').SetInfo (games[0]);
        //         }

        //         if(games[1] != null){
        //             this.conStyle2Item2.active = true;
        //             this.conStyle2Item2.getComponent('UIItemGameplay').SetInfo (games[1]);
        //         }
        //     }

        //     // if(games.length>1){
        //     //     this.conStyle2Item2.active = true;
        //     //     this.conStyle2Item2.getComponent('UIItemGameplay').SetInfo (games[1]);
        //     // }
        // }
    }
});