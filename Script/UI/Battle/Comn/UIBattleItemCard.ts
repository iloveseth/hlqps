import UIPanelItem from "../../../../HXJS/Module/UI/Panel/UIPanelItemTS";
import { hxfn } from "../../../FN/HXFN";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleItemCard extends UIPanelItem
{
    @property({type:cc.Sprite})
    private card: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:///////////////////////////////////
    onLoad () {
        super.OnInit();
    }
    ///////////////////////////////////////////////////////////

    public SetInfo(info:any, idx:number, callback:Function, isEnableInvalidClick:boolean = false){
        super.SetInfoBase(idx, callback, isEnableInvalidClick);
        
        //handle info[0] card [1]select cb
        //1,
        hxfn.battle.SetCard(info,this.card,'battle_cards');
        //2,
        // this.cb_selected = info[1];
    }
}