import { hxfn } from "../../../FN/HXFN";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIItemBattleLandlordScore extends cc.Component 
{
    @property({type:cc.Label})
    private playerName: cc.Label = null;
    @property({type:cc.Node})
    private conLordFlag: cc.Node = null;
    @property({type:cc.Label})
    private txtDiFen: cc.Label = null;
    @property({type:cc.Label})
    private txtMulti: cc.Label = null;
    @property({type:cc.Label})
    private ringCoin: cc.Label = null;

    // LIFE-CYCLE CALLBACKS://///////////////////////////////
    // onLoad () {},
    start () {

    }
    // update (dt) {},
    /////////////////////////////////////////////////////////

    public SetInfo(info:any) {
        this.playerName.string = hxfn.battle.GetNameByPlayerId(info.get('playerId'));
        this.conLordFlag.active = info.get('isLord');
        let coin = info.get('ringCoin');
        this.ringCoin.string = coin>0?'+' + coin : coin;

        this.txtDiFen.string = hxfn.map.curRoom['difen'] +'';
        this.txtMulti.string = hxfn.battle_landlord.ringMulti + '';
    }
}
