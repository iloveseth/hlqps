import global from './global'
import Brain from './utility/brain'
import defines from './defines'
const TankState = {
    Invalide: -1,
    Running: 1,
    OutScreen: 2,
    BeKilled: 3,
    GetBehaviuor: 4
};
cc.Class({
    extends: cc.Component,

    properties: {

        scoreLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        this.direction = cc.p(0,1);
        this.speed = 0;
        this.brain = Brain();
        this.score = 0;
        this.runBehaviourTime = 0;

        global.event.on("killed_one", this.tankKillOne.bind(this));


    },
    initWithData: function (data) {
        this.uid = data.id;
        this.node.position = cc.p(Math.random() * 1000 - 500, Math.random() * 800 - 400);
        this.state = TankState.Invalide;
        this.setState(TankState.GetBehaviuor);

    },

    moveForword: function () {
        // console.log("move forword");
        this.speed = 1;
        this.move();
    },
    moveBack: function () {
        // console.log("move back");
        this.speed = -1;
        this.move()
    },
    move: function () {
        this.node.position = cc.pAdd(this.node.position, cc.pMult(this.direction, this.speed));
    },
    rotationLeft: function () {
        // console.log("rotation left");
        this.direction = cc.pRotateByAngle(this.direction, cc.p(0,0), Math.PI * 0.02);
        let angle = cc.pAngleSigned(this.direction, cc.p(0,1));
        this.node.rotation = 180 /Math.PI * angle;
    },
    rotationRight: function () {
        // console.log("rotation right");
        this.direction = cc.pRotateByAngle(this.direction, cc.p(0,0), Math.PI * -0.02);
        let angle = cc.pAngleSigned(this.direction, cc.p(0,1));
        this.node.rotation = 180 /Math.PI * angle;
    },
    shoot: function () {
        this.shootBullet();
    },
    shootBullet: function () {
        // cc.log("shoot on bullet");
        global.event.fire("shoot_one_bullet", {
            position: cc.pAdd(this.node.position,cc.pMult(cc.pNormalize(this.direction), 160)),
            direction: this.direction,
            master: this.uid
        })
    },

    update: function (dt) {
        if (this.state === TankState.GetBehaviuor){
            //如果现在的状态是获取大脑习惯的操作
            this.behavior = this.brain.getBehaviour();
            switch (this.behavior){
                case defines.tankBehaviourMap.moveforword:
                    this.duractionTime = Math.random() * 2 + 1; //随机一个时间
                    break;
                case defines.tankBehaviourMap.moveback:
                    this.duractionTime = Math.random() * 2 + 1; //随机一个时间
                    break;
                case defines.tankBehaviourMap.rotationleft:  //随机一个角度
                    this.targetAngle = Math.random() * 90 ;
                    break;
                case defines.tankBehaviourMap.rotationright:
                    this.targetAngle = Math.random() * 90 * -1 ;
                    break;
                case defines.tankBehaviourMap.kill:   //杀死一个坦克
                    break;
            }
            this.setState(TankState.Running);
        }
        if (this.state === TankState.Running){

            switch (this.behavior){
                case defines.tankBehaviourMap.moveforword:
                    if (this.runBehaviourTime > this.duractionTime){
                        //行为结束，进行下一个行为
                        this.runBehaviourTime = 0;
                        this.setState(TankState.GetBehaviuor);
                    }else {
                        this.runBehaviourTime += dt;
                        this.moveForword();
                    }
                    break;
                case defines.tankBehaviourMap.moveback:
                    if (this.runBehaviourTime > this.duractionTime){
                        //行为结束，进行下一个行为
                        this.runBehaviourTime = 0;
                        this.setState(TankState.GetBehaviuor);
                    }else {
                        this.runBehaviourTime += dt;
                        this.moveBack();
                    }
                    break;
                case defines.tankBehaviourMap.rotationleft:
                    this.rotationLeft();
                    // cc.log("node angle = " + this.node.rotation);
                    // cc.log("angle= " + Math.abs(this.node.rotation - this.targetAngle));
                    if (Math.abs(this.node.rotation - this.targetAngle) < 5){
                        this.setState(TankState.GetBehaviuor);
                    }
                    break;
                case defines.tankBehaviourMap.rotationright:
                    // cc.log("node angle = " + this.node.rotation);
                    // cc.log("angle= " + Math.abs(this.node.rotation - this.targetAngle));
                    this.rotationRight();
                    if (Math.abs(this.node.rotation - this.targetAngle) < 5){
                        this.setState(TankState.GetBehaviuor);
                    }
                    break;
                case defines.tankBehaviourMap.kill:

                    //杀死
                    this.setState(TankState.GetBehaviuor);
                    break;
            }
        }


    },
    onCollisionEnter: function (other, self) {
        // if (other.){
        //
        // }

        if (other.getComponent(cc.CircleCollider)){
            if (other.getComponent(cc.CircleCollider).tag === 2){
                this.setState(TankState.BeKilled);
            }
        }
    },
    onCollisionStay: function (other, self) {

    },
    onCollisionExit: function (other, self) {

        // if (other.name === "world_bg"){
        //     console.log("跑出去了");
        // }
        if (other.getComponent(cc.BoxCollider)){
            if (other.getComponent(cc.BoxCollider).tag === 1){
                // console.log("tank  out screen");
                this.setState(TankState.OutScreen);
            }
        }


    }
    ,
    setState: function (state) {
        if (this.state === state){
            return;
        }
        switch (state){
            case TankState.Running:
                // cc.log("tank runing");
                break;
            case TankState.OutScreen:
                cc.log("世界外面去了");
                this.offListener();
                this.node.destroy();
                break;
            case TankState.BeKilled:
                this.offListener();
                this.node.destroy();
                break;
        }
        this.state = state;
    },
    tankKillOne: function (data) {
        if (data.uid === this.uid){
            //我杀死的
            this.score ++;
        }
    },
    onDestroy: function () {

    },
    offListener: function () {
        global.event.off("killed_one", this.tankKillOne);
    }
});
