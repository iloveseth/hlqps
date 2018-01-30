cc.Class({
    extends: cc.Component,

    properties: {
        txtTotal: cc.Label,
        txtPoint1: cc.Label,
        txtPoint2: cc.Label,
        txtPoint3: cc.Label,
    },

    onLoad: function () {
        this.OnReset();
        hxfn.adjust.AdjustLabel(this.node);
    },

    OnReset () {
        this.txtTotal.string = '';
        this.txtPoint1.string = '';
        this.txtPoint2.string = '';
        this.txtPoint3.string = '';
    },

    UpdateNiuNiuPanel (cardids, total) {
        this.txtTotal.string = total + '';

        if(cardids[0] == -1){
            this.txtPoint1.node.active = false;
        }
        else{
            this.txtPoint1.node.active = true;
            var point1 = hxfn.battle.GetCardPointInfo(cardids[0])['point'];
            this.txtPoint1.string = hxfn.battle_pinshi.GetScoreByPoint(point1) + '';
        }

        if(cardids[1] == -1){
            this.txtPoint2.node.active = false;
        }
        else{
            this.txtPoint2.node.active = true;
            var point2 = hxfn.battle.GetCardPointInfo(cardids[1])['point'];
            this.txtPoint2.string = hxfn.battle_pinshi.GetScoreByPoint(point2) + '';
        }

        if(cardids[2] == -1){
            this.txtPoint3.node.active = false;
        }
        else{
            this.txtPoint3.node.active = true;
            var point3 = hxfn.battle.GetCardPointInfo(cardids[2])['point'];
            this.txtPoint3.string = hxfn.battle_pinshi.GetScoreByPoint(point3) + '';
        }
    }
});