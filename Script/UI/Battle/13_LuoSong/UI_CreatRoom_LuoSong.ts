import { log } from "../../../../HXJS/Util/Log";


const { ccclass, property } = cc._decorator;
@ccclass
export default class UI_CreatRoom_LuoSong extends cc.Component implements IUISub {

    private _btnClose: cc.Component = null;

    public OnInit(): void {
        //this._btnClose = cc.find("BtnClose").getComponent("UIButton");
    }

    public OnStart(): void {
        //this._btnClose.SetInfo(this.OnBtnCloseClick.bind(this));
    }

    public OnReset(): void {

    }

    public OnEnd(): void {

    }

    public OnStartReal(): void {

    }


    private OnBtnCloseClick(): void {
        log.trace("LuoSong", "UI_CreatRoom_LuoSong -> OnBtnCloseClick");

        
    }

}