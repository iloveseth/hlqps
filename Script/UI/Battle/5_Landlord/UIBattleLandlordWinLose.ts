import { hxfn } from "../../../FN/HXFN";
import { hxjs } from "../../../../HXJS/HXJS";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlordWinLose extends cc.Component 
{
    @property({type:cc.Node})
    private conWin: cc.Node = null;
    @property({type:cc.Node})
    private conLose: cc.Node = null;

    @property({type:require('UILst')})
    private lstRecords: cc.Component = null;

    @property({type:require('UIButton')})
    private btnConfirm: cc.Component = null;

    private hasInit:boolean = false;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // }

    private Hide () {
        hxjs.module.ui.hub.HideCom(this.node);
    }

    public SetInfo(records:any, isWinOrLose:boolean) {
        if(!this.hasInit) {
            this.hasInit = true;
            
            this.btnConfirm.SetInfo(this.Hide.bind(this));
        }

        this.conWin.active = isWinOrLose;
        this.conLose.active = !isWinOrLose;
        this.lstRecords.SetInfo(records);
    }
}