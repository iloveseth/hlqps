import { hxjs } from "../../../../HXJS/HXJS";
import { hxfn } from "../../../FN/HXFN";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIItemRoleInfo extends cc.Component 
{
    @property({type:cc.Sprite})
    private imgRoleIcon:cc.Sprite = null;
    @property({type:cc.Label})
    private txtRoleName: cc.Label = null;
    @property({type:cc.Label})
    private txtRoleId: cc.Label = null;
    
    @property({type:cc.Label})
    private txtRoleGold: cc.Label = null;
    @property({type:cc.Label})
    private txtRoleYuanbao:cc.Label = null;
    @property({type:cc.Label})
    private txtRoleCarryYuanbao:cc.Label = null;
    

    @property({type:cc.Label})
    private txtPlayerLevel: cc.Label = null;
    @property({type:cc.Label})
    private txtVIPLevel:cc.Label = null;
    @property({type:cc.Label})
    private txtVIPExp:cc.Label = null;

    @property({type:cc.Label})
    private txtSign:cc.Label = null;//签名

    @property({type:cc.Node})
    private btnCheck:cc.Node = null;
    @property({type:cc.Node})
    private btnGive:cc.Node = null;
    @property({type:cc.Label})
    private txtVIPLevel2:cc.Label = null;
    @property({type:cc.Node})
    private conLogoVIP:cc.Node = null;

    @property({type:cc.Node})
    private conAvatar:cc.Node = null;

    //  by  lzh
    //男女图标
    @property({type:cc.Node})
    private logoMale: cc.Node = null;
    @property({type:cc.Node})
    private logoFemale:cc.Node = null;

    // //for update player self coin info by notifies
    @property({type:cc.Label})
    private txtRealGold:cc.Label = null;
    @property({type:cc.Label})
    private txtRealYuanbao:cc.Label = null;
    @property({type:cc.Label})
    private txtRealCarry:cc.Label = null;
    
    private hasInit:Boolean = false;
    private playerId:string = null;

    // LIFE-CYCLE CALLBACKS://///////////////////////////////////////////////////////////////
    onLoad () {
        if(this.btnCheck != null) {
            this.btnCheck.getComponent('UIButton').SetInfo(function(){
                // hxjs.module.ui.hub.LoadPanel_Dlg('UI_Role_DetailNew');
                hxjs.module.ui.hub.LoadPanel_Dlg('UI_Role_DetailNew');
            });
        }
        if(this.btnGive != null) {
            this.btnGive.getComponent('UIButton').SetInfo(function(){ 
                hxfn.shop.givePlayerId =this.playerId;
                hxfn.shop.curShop = 2;//赠送
                hxfn.shop.GetMarketList(
                    function(){
                        hxjs.module.ui.hub.LoadPanel_Dlg('UI_Lobby_Shop_new2');
                    }.bind(this)
                );
            }.bind(this));
        }
    }

    start (){
        if(this.btnGive)
            this.btnGive.active = hxfn.role.curUserData.serviceOption.giveYB;
    }

    onDestroy (){
        if(this.hasInit){
            this.HandleNotify(false);
            
            this.hasInit = false;
        }
    }

    // update (dt) {},
    /////////////////////////////////////////////////////////////////////////////////////////

    //根据客户端角色信息之货币信息的变化来更新UI对象显示
    private HandleNotify (isHandle:Boolean){
        if(!this.IsPlayerSelf()) return;

        if(isHandle){
            hxjs.util.Notifier.on('Role_Update-Coin',this.UpdateCoin, this);
        }
        else {
            hxjs.util.Notifier.off('Role_Update-Coin',this.UpdateCoin, this);
        }
    }

    private UpdateCoin (){
        this.SetInfo_Coin(hxfn.role.curGolden);
    }

    private SetInfo_Coin (goldenInfo:any){
        if(goldenInfo == null){
            if(this.txtRoleGold != null)
                this.txtRoleGold.string = '0';
            if(this.txtRoleYuanbao != null)
                this.txtRoleYuanbao.string = '0';
            if(this.txtRoleCarryYuanbao != null)
                this.txtRoleCarryYuanbao.string = '0';
        }
        else {
            //XXXXXX 两种情况
            //1，非战斗界面：每种货币信息都有对应的文本来显示
            //XXXXXX 2，战斗界面：txtGold用来显示与当前战斗房间类型相匹配的货币
    
            //数据源
            // let goldenInfo = hxfn.role.curGolden;
            let gold:Number = parseInt(goldenInfo.get('gold'));//金币
            let diamond:Number = parseInt(goldenInfo.get('diamond'));//钻石
            let yuanbao:Number = parseInt(goldenInfo.get('bankYuanbao'));//元宝
            let carryYuanbao:Number = parseInt(goldenInfo.get('yuanbao'));//元宝
            if(this.txtRoleGold != null){
                this.txtRoleGold.string = gold.toCoin();
            }
            if(this.txtRoleYuanbao != null){
                this.txtRoleYuanbao.string = carryYuanbao.toCoin();
            }
            if(this.txtRoleCarryYuanbao != null){
                this.txtRoleCarryYuanbao.string = yuanbao.toCoin();
            }
        }
    }
    
    private IsPlayerSelf():Boolean{
        if(this.playerId == null)
            return false;

        return this.playerId === hxfn.role.playerId;
    }

    public SetInfo (infodata:any, idx?:Number) {
        if(infodata==null)
        {
            return;
        }
        //更新基本信息
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        let playerInfo = infodata['userData'];
        
        if(playerInfo != null) {
            this.playerId = playerInfo.get('playerId');
            let nickName = playerInfo.get('nickName');
            // let personalSign = playerInfo.get['personalSign'];
            let sex = playerInfo.get('sex');
            let icon = playerInfo.get('playerIcon');
            let level = playerInfo.get('level');
            let levelExp = playerInfo.get('levelExp');
            let vipLevel = playerInfo.get('vipLevel');
            let vipExp = playerInfo.get('vipExp');
            let sign = playerInfo.get('personalSign');
            // let vipLevel = goldenInfo.get('vipLevel');
            // let vipExp = goldenInfo.get('vipExp');

            //display
            // imgRoleIcon: cc.Sprite, = icon
            if(this.txtSign!= null){
                this.txtSign.string =sign!=null?sign:'这家伙很懒,什么都没有留下...';
            }
            if(this.txtRoleName != null){
                this.txtRoleName.string = nickName;
            }
            if(this.txtRoleId != null){
                this.txtRoleId.string = this.playerId;
            }
            if(this.conAvatar != null){
                // cc.log('~~~~~~~~~~~~~~Set Role Icon: UIAvatar');
                // cc.log(playerInfo); 
                this.conAvatar.getComponent('UIAvatar').SetInfo(playerInfo);
            }
            // if(this.imgRoleIcon != null){
            //     var murl = icon;
            //     hxjs.module.asset.LoadNetImg(murl,this.imgRoleIcon);
                
            // //     cc.loader.load({url:'https://www.baidu.com/img/bd_logo1.png', type: 'png'},function (err, pic) {
            // //         var spriteFrame = new cc.SpriteFrame(pic);
            // //         this.imgRoleIcon.spriteFrame = spriteFrame;
            // //    }.bind(this));
            //     //hxjs.module.asset.LoadSprite(murl,this.imgRoleIcon);
            // } 
            if(this.logoMale != null && this.logoFemale != null)
            {
                if(sex == 1)
                {
                    cc.log('显示男性图标');
                    this.logoFemale.active = false;
                    this.logoMale.active = true;
                }
                
                else if(sex == 2)
                {
                    cc.log('显示女性图标');
                    this.logoMale.active = false;
                    this.logoFemale.active = true;
                }
                else{
                    this.logoMale.active = false;
                    this.logoFemale.active = false;
                }
            }
            if(this.txtVIPExp != null){
                this.txtVIPExp.string = vipExp;
            }

            if(this.txtVIPLevel != null){
                this.txtVIPLevel.string = vipLevel;
            }

            if(this.conLogoVIP != null){
                this.conLogoVIP.active = vipLevel > 0;
                if(vipLevel > 0 && this.txtVIPLevel2 != null){
                    this.txtVIPLevel2.string = vipLevel;
                }
            }
            
            if(this.txtPlayerLevel != null){
                this.txtPlayerLevel.string = level;
            }

            // this.txtRoleVIPL.string = vipLevel;
            // this.txtVIPExp.string = vipExp;
        }

        let goldenInfo = infodata['goldenInfo'];
        this.SetInfo_Coin(goldenInfo);
        this.SetInfo_RealCoin(goldenInfo);

        //根据role info 是否是玩家自己的信息来响应自身货币的变化/////////////////////////////////////////////
        if(!this.hasInit){
            this.hasInit = true;

            this.HandleNotify(true);
        }
    }

    public SetInfoR(info:any) {
        let sex = info.get('sex');
        this.txtRoleId.string = info.playerId;
        this.txtRoleName.string = info.nickName;
        this.txtRoleGold.string = info.gold + '';
        this.txtRoleYuanbao.string = info.yuanbao + '';
        this.txtSign.string = info.personalSign ? info.personalSign:'这家伙很懒,什么都没有留下...';
        this.txtVIPLevel.string = info.vipLevel;
        if(this.conAvatar != null){
            this.conAvatar.getComponent('UIAvatar').SetInfo(info);
        }
        if(this.logoMale != null && this.logoFemale != null)
        {
            if(sex == 1)
            {
                cc.log('显示男性图标');
                this.logoFemale.active = false;
                this.logoMale.active = true;
            }
            
            else if(sex == 2)
            {
                cc.log('显示女性图标');
                this.logoMale.active = false;
                this.logoFemale.active = true;
            }
            else{
                this.logoMale.active = false;
                this.logoFemale.active = false;
            }
        }
    }

    private SetInfo_RealCoin (goldenInfo:any){
        if(goldenInfo == null){
            if(this.txtRealGold != null)
                this.txtRealGold.string = '0';
            if(this.txtRealYuanbao != null)
                this.txtRealYuanbao.string = '0';
            if(this.txtRealCarry != null)
                this.txtRealCarry.string = '0';
        }
        else {
            //XXXXXX 两种情况
            //1，非战斗界面：每种货币信息都有对应的文本来显示
            //XXXXXX 2，战斗界面：txtGold用来显示与当前战斗房间类型相匹配的货币

            //数据源
            // let goldenInfo = hxfn.role.curGolden;
            let gold = parseInt(goldenInfo.get('gold'));//金币
            let diamond = parseInt(goldenInfo.get('diamond'));//钻石
            let yuanbao = parseInt(goldenInfo.get('bankYuanbao'));//元宝
            let carryYuanbao = parseInt(goldenInfo.get('yuanbao'));//元宝
            if(this.txtRealGold != null){
                this.txtRealGold.string = gold+'';
            }
            if(this.txtRealYuanbao != null){
                this.txtRealYuanbao.string = carryYuanbao+'';
            }
            if(this.txtRealCarry != null){
                this.txtRealCarry.string = yuanbao+'';
            }
        }
    }
}