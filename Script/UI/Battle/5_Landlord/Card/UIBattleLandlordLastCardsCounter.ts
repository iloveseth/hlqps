const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleLandlordLastCardsCounter extends cc.Component
{
    @property({type:cc.Node})
    private conCardFlag: cc.Node = null;
    @property({type:cc.Label})
    private label: cc.Label = null;


    // LIFE-CYCLE CALLBACKS://////////////////////////////////////
    // onLoad () {},
    start () {
    }
    // update (dt) {},
    //////////////////////////////////////////////////////////////

    public OnReset(){
        this.Hide();
    }

    public Show(remainCards:number){
        this.conCardFlag.active = true;
        this.label.node.active = true;

        if(isNaN(remainCards))
        return;

        if(remainCards > 0)
            this.label.string = remainCards+'';
        else
            this.Hide();
    }

    private Hide(){
        this.conCardFlag.active = false;
        this.label.node.active = false;
    }
}
