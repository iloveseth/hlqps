var ASObj = require('ASObj');

cc.Class({
    extends: cc.Component,

    properties: {
        ases: [ASObj],

        //
        asesCache:null,
    },

    onLoad: function () {
        this.asesCache = {},

        this.ases.forEach(function(element) {
            var key = element.idxName;
            this.asesCache[key] = element.as;
        }.bind(this), this);
    },

    Play(idxStr){
        // if(this.ases.hasOwnProperty(idxStr))
        //     this.ases[idxStr].play();

        this.ases.forEach(function(element) {
            if(element.idxName == idxStr)
                element.as.play();
        }, this);
    }
});