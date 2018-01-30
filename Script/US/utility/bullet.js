import global from './global'
const BulletState = {
    Invalide: -1,
    Running: 1,
    OutScreen: 2,
    HitedEnemy: 3
};
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.speed = 1000;
        this.state = BulletState.Invalide;

    },
    initWithData: function (data) {
        //位置  方向
        console.log("init with data  =" + JSON.stringify(data));
        this.node.position = data.position;
        this.direction = data.direction;
        this.setState(BulletState.Running);
        this.masterUid = data.master;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        if (this.state === BulletState.Running){
            this.node.position = cc.pAdd(this.node.position, cc.pMult(this.direction, this.speed * dt));
        }
    },
    setState: function (state) {
        if (this.state === state){
            return
        }
        switch (state){
            case BulletState.Running:
                cc.log("bullet state running");
                break;
            case BulletState.OutScreen:
                this.node.destroy();
                break;
            case BulletState.HitedEnemy:
                global.event.fire("killed_one", {
                    uid: this.masterUid
                });
                this.node.destroy();
                break;
            default:
                break;
        }
        this.state = state;
    },
    onCollisionEnter: function (other, self) {


        if (other.getComponent(cc.CircleCollider)){
            if (other.getComponent(cc.CircleCollider).tag === 3){
                cc.log("击中了坦克");
                this.setState(BulletState.HitedEnemy);
            }
        }
    },
    onCollisionStay: function (other, self) {

    },
    onCollisionExit: function (other, self) {
        if (other.getComponent(cc.BoxCollider)){
            if (other.getComponent(cc.BoxCollider).tag === 1){
                console.log("离开了墙体");
                this.setState(BulletState.OutScreen);
            }
        }
    }
    ,
    onDestroy: function () {
        console.log("on destroy");
    }
});
