const {ccclass, property} = cc._decorator;

@ccclass
export default class AnimMgr
{


    // LIFE-CYCLE CALLBACKS: ///////////////////////////////////////

    // onLoad () {},

    start () {

    }

    // update (dt) {},
    ////////////////////////////////////////////////////////////////


    // Stop Animation
    // let anim = this.conCardsPush.getComponent(cc.Animation);
    //     if(anim && anim.currentClip)
    //         anim.stop(anim.currentClip.name);


    // PlayAnim(){
    //     this.conCardsHolders.forEach(function(element) {
    //         element.node.active = true;
    //     }, this);
        
    //     var animation = this.node.getComponent(cc.Animation);
    //     // animation.addClip(clip);
    //     var anims = animation.getClips();

    //     anims.forEach(function(element) {
    //         animation.play(element.name);
    //     }, this);
    // }
}
