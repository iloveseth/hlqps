cc.Class({
    extends: cc.Component,

    properties: {
        con:cc.Node,
        txt:cc.Label,
    },

    onLoad: function () {

    },

    SetInfo(num){
        this.con.active = num > 0;

        if(this.txt) {
            this.txt.string = num;            
        }
    }
});