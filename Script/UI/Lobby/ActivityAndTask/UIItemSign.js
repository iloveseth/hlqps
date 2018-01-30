import { hxdt } from "../../../DT/HXDT";

cc.Class({
    extends: cc.Component,

    properties: {
        labelDate: cc.Label,
        imgSign: cc.Node,
        imgToday: cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    SetInfo(inf,idx){
        if(inf.date == 0)
        {
            this.labelDate.node.active = false;
            this.imgSign.active = false;
        }
        else
        {
            this.imgSign.active = inf.sign == true;
            this.labelDate.node.active = true;
            this.labelDate.string = inf.date;
        }
    },

    SetDate(date){
        if(date == 0)
        {
            this.labelDate.node.active = false;
            this.imgSign.active = false;
        }

        else
        {
            this.imgSign.active = false;
            this.labelDate.node.active = true;
            this.labelDate.string = date + '';

            //红色版本
            if(hxdt.setting_webVersion.gameEdition == hxdt.setting_webVersion.GameEdition.RED) {
                if(date == new Date().getDate()){
                    this.imgToday.active = true;
                }
                else{
                    if(date < new Date().getDate()){
                        this.labelDate.node.color = new cc.Color().fromHEX('#FFD97B');
                    }
                    this.imgToday.active = false;
                }
            }
        }
    },

    SetSign(isSign){
        this.imgSign.active = isSign;
    }

});
