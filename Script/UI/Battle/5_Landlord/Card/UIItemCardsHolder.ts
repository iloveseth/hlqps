import { hxfn } from "../../../../FN/HXFN";
import { setting_landlord } from "../../../../DT/DD/Setting_Battle_Landlord";
import { log } from "../../../../../HXJS/Util/Log";
import { isNullOrUndefined } from "util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIItemCardsHolder extends cc.Component 
{
    @property({type:cc.Layout})
    protected layout:cc.Layout = null;

    @property
    protected prefix:string = 'c_';
    @property
    protected isReverse:boolean = false;

    protected cards: cc.Sprite[] = [];
    private hasInit:boolean = false;

    // LIFE-CYCLE CALLBACKS: //////////////////////////////////////////
    public OnInit(): void {
        if(this.hasInit) return;
        this.hasInit = true;

        if(this.layout)
        this.layout.spacingX = setting_landlord.cardOffset1;

        for (let i = 0; i < setting_landlord.maxCards1; i++) {
            let n = cc.find(this.prefix + (i+1), this.node);
            if(n){
                let s = n.getComponent(cc.Sprite);
                if(s) this.cards.push(s);
            }
        }

        // log.trace('ui', 'Get cards holder s cards in con: ' + this.name);
        // cc.log(this.cards);
    }
    
    public OnReset(): void{
        this.ResetAllCards();
    }
    public OnEnd(): void{
        this.hasInit = false;
    }
    ///////////////////////////////////////////////////////////////////


    public SetCards(info:number[], cardAtlas?:string){
        this.ResetAllCards();

        if(!info) return;

        let atlas = isNullOrUndefined(cardAtlas) ? 'battle_cards' : cardAtlas;

        if(this.isReverse) {
            for (let i = info.length-1; i >= 0; i--) {
                if(this.cards[i]) {
                    this.cards[i].node.active = true;
                    hxfn.battle.SetCard(info[i], this.cards[(info.length-1)-i], atlas);
                }
            }
        }
        else {
            for (let i = 0; i < info.length; i++) {
                if(this.cards[i]) {
                    this.cards[i].node.active = true;
                    hxfn.battle.SetCard(info[i], this.cards[i], atlas);
                }
            }
        }
    }

    public ResetAllCards () {
        for (const c of this.cards) {
            c.node.active = false;
        }
    }
}