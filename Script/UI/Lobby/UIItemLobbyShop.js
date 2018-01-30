
cc.Class({
    extends: require('UIPanelItem'),

    properties: {
        imgGoods:cc.Sprite,
        txtPrice:cc.Label,
        txtIngot:cc.Label,

        txtGift: cc.Label,
        // txtDiscount: cc.Label,
        conDiscount: cc.Node,
        conOrigin: cc.Node,
        txtOrigin: cc.Label,
    },

    onLoad: function () {
        this.OnInit();
    },

    SetInfo(info, idx, callback){
        this.SetInfoBase(idx, callback);

        
        // message GoodsProto {
            //     optional int32 goodsType = 1;    //商品类型
            //     optional string goodsName = 2;   //商品名称
            //     optional string goodsRemark = 3; //额外说明
            //     optional string goodsTag = 4;    //商品标签，说明
            //     optional float goodsCost = 5;    //商品价格
            //     optional string goodsCostUnit = 6; //价格单位 
            //     optional int32 menuIndex = 7;   //在菜单中的索引，依照从上往下，从左往右的规则排布
            //     optional string goodsIcon = 8;  //商品图标
            // }

        // hxfn.shop.playerDiscount = {
        //     discount: 0.05,
        //     donate:0.9,
        // }
        this.txtGift.string = '';
        hxjs.module.asset.LoadAtlasSprite('comn_item',info.get('goodsIcon'),this.imgGoods);
        var goodsNum = parseInt(info.goodsName.substr(0,info.goodsName.length - 2));
        var goodsTyp = info.goodsName.substr(-2);
        this.txtIngot.string = info.get('goodsName');//数量 + 单位：'元宝';
        this.txtPrice.string =  '￥' + info.get('goodsCost') + '.00';

        this.Reset();
        if(!hxfn.shop.playerDiscount){
            return;
        }
        if(hxfn.shop.playerDiscount.discount < 1 || hxfn.shop.playerDiscount.donate > 0 ){
            this.conDiscount.active = true;
        }
        //打折
        if(hxfn.shop.playerDiscount.discount < 1 ){
            this.conOrigin.active = true;
            this.txtOrigin.string = '￥' + info.get('goodsCost');
            var nowPriceStr = (info.goodsCost * hxfn.shop.playerDiscount.discount).toString();
            cc.log(nowPriceStr);
            var part = nowPriceStr.split('.');
            if(part.length == 1){
                part.push('00');
            }
            else{
                if(part[1].length == 0){
                    part[1] += '00';
                }
                if(part[1].length == 1){
                    part[1] += '0';
                }
            }

            this.txtPrice.string = '￥' + part[0] + '.' + part[1].substr(0,2);
            if((info.goodsCost * hxfn.shop.playerDiscount.discount) <= 0.01){
                this.txtPrice.string = '￥' + '0.01';
            }
        }
        //赠送
        if(hxfn.shop.playerDiscount.donate > 0){
            this.txtGift.string = '+' + parseInt(hxfn.shop.playerDiscount.donate * goodsNum);
        }
    },

    Reset(){
        this.conDiscount.active = false;
        this.conOrigin.active = false;
        this.txtGift.string = '';
    }
});