const { ccclass, property } = cc._decorator;

@ccclass
//罗松操作面板
export default class UIBattleLuoSongPlay extends cc.Component {

    public static Instance: UIBattleLuoSongPlay;

    private listHandCard: cc.Node[] = [];//手牌

    public onLoad() {
        //单例
        if (UIBattleLuoSongPlay.Instance == null) {
            UIBattleLuoSongPlay.Instance = this;
        }
    }

    public start() {
        for (let index = 0; index < 13; index++) {
            var item = cc.find("HandCard/poker" + index)
            this.listHandCard.push(item);
        }
    }

    private RefreshListHandCard()
    {
        
    }
}