// function Loader () {}

export class Loader2
{
    OnInit(p, callback) {
        this.p = p;
        this.callback = callback;

        //标记loader是否被占用
        this.isStartLoading = false;
    }

    OnLoad() {
        this.isStartLoading = true;

        var p = this.p;
        var callback = this.callback;

        cc.loader.loadRes(p, function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            if(callback != null){
                callback(newNode);
            }
            this.isStartLoading = false;
        }.bind(this));
    }

    IsFree () {
        return !this.isStartLoading;
    }
}

// module.exports = Loader;