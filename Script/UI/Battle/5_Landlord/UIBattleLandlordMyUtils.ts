import UIBattleCardMemory from "./Card/UIBattleCardMemory";
import { hxjs } from "../../../../HXJS/HXJS";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlordMyUtils extends cc.Component implements IUISub
{
    @property({type:require('UIButton')})
    private btnTogCardMem: cc.Component = null;
    @property({type:require('UIButton')})
    private btnAuto: cc.Component = null;
    @property({type:UIBattleCardMemory})
    private uiCardMem: UIBattleCardMemory = null;

    // LIFE-CYCLE CALLBACKS://////////////////////////////////////
    public OnInit(): void{
        this.btnTogCardMem.SetInfo(()=>{
            if(this.uiCardMem.node.activeInHierarchy)
                hxjs.module.ui.hub.HideCom(this.uiCardMem.node);
            else
                hxjs.module.ui.hub.ShowCom(this.uiCardMem.node);
        });

        this.btnAuto.SetInfo(()=>{
            //请求托管
        });

        this.uiCardMem.OnInit ();

        this.OnReset();
    }
    public OnStart(): void{

    }
    public OnReset(): void{
        this.btnTogCardMem.node.active = false;
        this.btnAuto.node.active = false;
        this.uiCardMem.node.active = false;
    }
    public OnEnd(): void{}
    public OnStartReal(): void{}
    //////////////////////////////////////////////////////////////

    public ShowAutoBtn (){
        this.btnAuto.node.active = true;
    }
    
    public ShowTogCardMemBtn (){
        this.btnTogCardMem.node.active = true;
        this.uiCardMem.node.active = false;
    }
}