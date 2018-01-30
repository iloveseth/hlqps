const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleCardMemory extends cc.Component implements IUISub
{
    @property({type:[cc.Label]})
    private counts: cc.Label[] = [];

    // LIFE-CYCLE CALLBACKS: ////////////////////////
    public OnInit (){
        this.counts.forEach(element => {
            if(element)
            element.string = '';
        });
    }
    public OnStart (){}
    public OnReset(): void{}
    public OnEnd(): void{}
    public OnStartReal(): void{}
    ////////////////////////////////////////////////

    public UpdateCardCount(idx:number, count:number){
        this.counts[idx].string = count + '';
    }

}
