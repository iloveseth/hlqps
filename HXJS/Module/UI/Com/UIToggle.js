import { log } from "../../../Util/Log";

cc.Class({
    extends: cc.Component,

    properties: {
        // [display]
        tog: cc.Toggle,
        txt: cc.Label,
    },

    onLoad: function () {

    },

    SetInfo (func, name = '') {
        this.callback_click = func;
        // this.btn.node.on('click', this.ClickThis.bind(this));
        this.tog.node.on('toggle',this.TogThis.bind(this),this);

        if(name == null)
            name = '';
        this.SetName(name);
    },

    TogThis: function (evt){
        //play sound
        hxjs.module.sound.PlayUI_Button();
        
        // var toggle = evt.detail;
        // this.callback_click(toggle.isChecked);

        // this.callback_click(this.tog.isChecked);
        this.SetChecked(this.tog.isChecked);
    },

    SetChecked (isChecked) {
        this.tog.isChecked = isChecked;

        //额外的视觉表现
        var stateDis = this.getComponent('UIStateDisplayer');
        if(stateDis)
            stateDis.ToggleSelect(isChecked);
        
        if(this.callback_click){
            this.callback_click(isChecked);
        }
        else {
            log.trace("ui",'ui toggle has not been inited!!!!!! with name: ' + this.tog.name);
        }
    },

    GetChecked () {
        return this.tog.isChecked;
    },

    ///////////////////////////////////////////////////
    SetName (name) {
        if(this.txt)
            this.txt.string = name;
    },

    ToggleEnable(isEnable){
        this.interactable = isEnable;
    },
});