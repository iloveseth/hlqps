import { hxjs } from "../../../HXJS/HXJS";
import { hxfn } from "../../FN/HXFN";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UILobbySendNotify extends cc.Component {
    @property({type:cc.Node})
    private btnSend:cc.Node=null;//发送广播按钮

    @property({type:cc.Node})
    private btnClose:cc.Node=null;//关闭按钮

    @property({type:cc.EditBox})
    private editNotify:cc.EditBox=null;//广播内容

    @property({type:cc.Label})
    private labelCost:cc.Label=null;//消耗描述

    start(){
        if(this.btnSend){
            let sendBtn=this.btnSend.getComponent('UIButton');
            if(sendBtn){
                sendBtn.SetInfo(()=>{
                    if(this.editNotify.string.length>0){
                        let content=hxfn.help.CheckSensitive(this.editNotify.string);
                        hxfn.lobby.PostBroadcast(content);
                        hxjs.module.ui.hub.Unload (this.node);
                    }else{
                        cc.log("广播为空");
                    }
                });
            }
        }

        if(this.btnClose){
            let closeBtn=this.btnClose.getComponent('UIButton');
            if(closeBtn){
                closeBtn.SetInfo(()=>{
                    hxjs.module.ui.hub.Unload (this.node);
                });
            };
        }

        if(this.editNotify){
            this.editNotify.string='';
        }
        
        if(this.labelCost){
            let cost=hxfn.lobby.broadcastCostNum;
            let type=hxfn.lobby.broadcastCostType;
            if(cost!=null&&type!=null){
                let typeName='元宝';
                if(type==0){
                    typeName='元宝';
                }else if(type==1){
                    typeName='金币';
                }
                this.labelCost.string=`发送全服广播，每次消耗 ${cost} ${typeName}`;
            }
        }
        
    }

}