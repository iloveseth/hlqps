export let redpack = {

    money:null,
    word:null,
    friend:null,
    guessRedPack:null,
    guessMoney:null,
    myRedPack:null,

    Enum_Panel:cc.Enum({
        Send:0,
        SendNumber:1,
        SendConfirm:2,
        Guess:3,
        GuessConfirm:4,
        Mine:5,
    }),

    Enum_RedPackState:cc.Enum({
        Sent:0,
        Guessed:1,
        Received:2,
    }),

    curPanel:null,

    SwitchState(node,state){
        var event = new cc.Event.EventCustom('SwitchState', true);
        this.curPanel = state;
        node.dispatchEvent(event);
    },

    ClosePop(node){
        var event = new cc.Event.EventCustom('ClosePop', true);
        node.dispatchEvent(event);
    },
}