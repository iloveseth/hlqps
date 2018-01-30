import { hxfn } from "../../../FN/HXFN";

cc.Class({
    extends: cc.Component,

    properties: {
        // img1: cc.Sprite,
        // img2: cc.Sprite,
        // img3: cc.Sprite,
        // img4: cc.Sprite,
        // img5: cc.Sprite,

        txtRatio:cc.Label,
        conBg:cc.Node,
        imgMoney: cc.Sprite,

    },

    onLoad: function () {

    },
    
    SetInfo (id, idx) {

        if(id> 0) {
            this.conBg.active = true;
            this.txtRatio.node.active = true;

            // cc.log('hxfn.map.curRoomTyp'),
            // cc.log(hxfn.map.curRoomTyp);
            if(hxfn.map.curRoomTyp === hxfn.map.Enum_RoomTyp.Gold){
                hxjs.module.asset.LoadAtlasSprite(hxfn.comn.coinAtlas,hxfn.comn.CoinPath4BattleXZ[hxfn.comn.ItemTyp.gold],this.imgMoney);
            }
            if(hxfn.map.curRoomTyp === hxfn.map.Enum_RoomTyp.Ingot){
                hxjs.module.asset.LoadAtlasSprite(hxfn.comn.coinAtlas,hxfn.comn.CoinPath4BattleXZ[hxfn.comn.ItemTyp.yuanbao],this.imgMoney);
            }
            this.imgMoney.node.active = true;
            this.txtRatio.string = "X" + id+'$';
        }
        else {
            this.txtRatio.node.active = false;
            this.conBg.active = false;
            this.imgMoney.node.active = false;
        }

        // this.img1.node.active = false;
        // this.img2.node.active = false;
        // this.img3.node.active = false;
        // this.img4.node.active = false;
        // this.img5.node.active = false;

        // // this.txtRatio.node.active = true;
        // // this.txtRatio.string = id+'倍';

        // switch (id) {
        //     case 5:
        //     this.img1.node.active = true;
        //     break;
        //     case 10:
        //     this.img2.node.active = true;
        //     break;
        //     case 15:
        //     this.img3.node.active = true;
        //     break;
        //     case 20:
        //     this.img4.node.active = true;
        //     break;
        //     case 25:
        //     this.img5.node.active = true;
        //     break;
        //     default:
        //     this.img1.node.active = false;
        //     this.img2.node.active = false;
        //     this.img3.node.active = false;
        //     this.img4.node.active = false;
        //     this.img5.node.active = false;
        //         break;
        // }
    }
});
