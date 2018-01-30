import { hxfn } from '../../../FN/HXFN';
import { hxjs } from '../../../../HXJS/HXJS';
import { log } from '../../../../HXJS/Util/Log';

cc.Class({
    extends: require('UIPanelStack'),

    properties: {
        // [display]

        btnStart:require('UIButton'),

        groupPattern: require('UIGroup'),
        nodePattern:[cc.Node],

        patternIdx: null,

        txtCost:cc.Label,

    },

    onLoad: function () {
        // base func
        this.OnInit('创建房间');//'ui_lobby_fn_close', 
        
        this.btnStart.SetInfo(function(){
            log.trace("LuoSong","TryCreateGame ");
            hxjs.util.Notifier.emit('TryCreateGame',this.patternIdx);
            
            
        }.bind(this));

        this.groupPattern.SetInfo(this.SelectPattern.bind(this));
        this.txtCost.string = parseInt(hxfn.role.curCarryYuanbao).toCoin();

    },

    start:function () {
        this.patternIdx = 0;
        this.groupPattern.SetDefaultIdx(0);
        
    },

    SelectPattern(idx){
        this.ResetPattern();
        this.patternIdx = idx;
        hxjs.util.Notifier.emit('SelectGameMode',this.patternIdx);
        this.nodePattern[idx].active = true;
    },

    ResetPattern(){
        hxfn.global.HandleNodes(this.nodePattern,false);
    },
});