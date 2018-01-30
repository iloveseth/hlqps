const {ccclass, property} = cc._decorator;

@ccclass
export default class UIBattleClock extends cc.Component 
{
    @property({type:cc.Node})
    private con: cc.Node = null;
    @property({type:cc.Label})
    private txtCD: cc.Label = null;

    // LIFE-CYCLE CALLBACKS: ///////////////////////////////////
    ////////////////////////////////////////////////////////////
    
    public Show (maxTime:number) {
        this.Hide();
        if(maxTime <=0) return;

        this.con.active = true;

        let cur = maxTime;
        this.txtCD.string = cur+'';

        this.schedule(function(){
            if(cur<=0) {
                this.Hide();
            }
            else {
                cur--;
                this.txtCD.string = cur+'';
            }
        }.bind(this),1,maxTime,1);
    }

    public Hide () {
        this.unscheduleAllCallbacks();
        this.con.active = false;
    }
}
