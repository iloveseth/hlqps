const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlord2Dispatch extends cc.Component implements IUISub
{
    // @property(cc.Label)
    // label: cc.Label = null;

    @property
    private text: string = 'hello';

    // LIFE-CYCLE CALLBACKS: //////////////////////////////////////////
    public OnInit(): void{}
    public OnStart(): void{}
    public OnReset(): void{}
    public OnEnd(): void{}
    public OnStartReal(): void{}
}