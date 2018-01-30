const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPanelItem extends cc.Component 
{
    @property({type:require('UIButton')})
    protected btnCheck: cc.Component = null;
    
    protected idx: number = -1;
    private callback_check: Function = null;
    private isEnable: boolean = true;
    private isEnableInvalidClick: boolean = false;
    
    private isSelected:boolean = false;
    
    // LIFE-CYCLE CALLBACKS: //////////////////////////////////////

    // onLoad () {},

    public ResetSelected () {
        this.isSelected = false;
        if(this.callback_check)
                this.callback_check(this.idx, this.isSelected);
    }

    ///////////////////////////////////////////////////////////////

    public OnInit (){
        if(this.btnCheck)
        this.btnCheck.SetInfo(this.Check.bind(this));
        this.ToggleEnable(this.isEnable);
    }

    public ToggleEnable (isEnable) {
        this.isEnable = isEnable;

        //!!! Lst需要处理不能点的对象的信息，所以必须有反馈，至于反馈之后怎么处理看具体的业务需求
        if(!this.isEnableInvalidClick) {
            if(this.btnCheck)
            this.btnCheck.node.active = this.isEnable;
        }

        var scr = this.getComponent('UIStateDisplayer');//可优化
        if(scr!= null){
            scr.ToggleEnable(isEnable);
        }
    }

    protected Check () {
        if(this.isEnableInvalidClick){
            if(this.callback_check)
            this.callback_check(this.idx, this.isEnable);
        }
        else {
            this.isSelected = !this.isSelected;

            if(this.callback_check)
                this.callback_check(this.idx, this.isSelected);
        }
    }

    public SetInfoBase (idx, callback, isEnableInvalidClick = false){
        this.idx = idx;
        this.callback_check = callback;
        this.isEnableInvalidClick = isEnableInvalidClick;
    }
}
