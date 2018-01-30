import { hxjs } from "../../../HXJS";
import { hxdt } from "../../../../Script/DT/HXDT";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPanelOverlay extends cc.Component 
{
    @property({type:cc.Button})
    private btnClose: cc.Button = null;

    // LIFE-CYCLE CALLBACKS://////////////////////////////////////////////////////
    // onLoad () {},

    start () {
        if(this.btnClose){
            this.btnClose.getComponent('UIButton').SetInfo(this.Close.bind(this));
        }
    }

    private Close () {
        var anim = null;

        //TODO 结束动画
        // if(this.srcAnimPanel != null && this.srcAnimPanel.eff != null) {
        //     // var anim = this.node.getComponent(cc.Animation);
        //     anim = this.srcAnimPanel.eff.getComponent(cc.Animation);
        // }
        
        if(anim) {
            anim.play('out_slide_panel');

            this.scheduleOnce(function(){
                this.RealClose();
            }.bind(this),hxdt.setting_ui.time_PanelDelayClose);
        }
        else {
            this.RealClose();
        }
    }

    private RealClose () {
        // hxjs.module.ui.hub.Pop();
        hxjs.module.ui.hub.Unload(this.node);
    }
}