cc.Class({
    extends: cc.Component,

    properties: {
        ases: [cc.AudioSource],

        cacheVolume:{ default: [], serializable: false, visible: false},

        hasPlaybgm:{ default: false, serializable: false, visible: false},
        hasSilencebgm:{ default: false, serializable: false, visible: false},

        hasCacheVolume:{ default: false, serializable: false, visible: false},
    },

    onLoad: function () {
    },
    
    OnInit:function (){
        this.CheckCacheVolumes();
    },

    CheckCacheVolumes:function (){
        if(!this.hasCacheVolume) {
            for (var i = 0; i < this.ases.length; i++) {
                var element = this.ases[i];
                if(element != null) {
                    // cc.log('~~~~~~~~~~~~~~~~~element: ' + element.clip);
                    // cc.log('~~~~~~~~~~~~~~~~~element.volume: ' + element.volume);
                    this.cacheVolume[i] = element.volume;
                }
            }

            this.hasCacheVolume = true;
        }
    },

    onDestroy:function (){
        if(this.hasCacheVolume) {
            this.cacheVolume = null;
            this.hasCacheVolume = false;
        }
    },

    Play(idx){
        if(idx<this.ases.length && this.ases[idx] != null)
            this.ases[idx].play();
    },
    Stop(idx){
        if(idx<this.ases.length && this.ases[idx] != null)
            this.ases[idx].stop();
    },

    PlayBGM(idx){
        //!!! 不能加否定判断，否则有可能因为资源加载没有完成，则下次再进就不播放了
        //!!! 应该在上一级进行处理：如果资源未完成，则return掉
        if(!this.hasPlaybgm) {
            // cc.log('PlayBGM');
            // this.ases[idx].play();
            this.Play(idx);
            this.hasPlaybgm = true;
            this.hasSilencebgm = false;
        }
    },
    StopBGM(idx){
        this.Stop(idx);
        this.hasPlaybgm = false;
        this.hasSilencebgm = true;
    },
    StopAllBGM (){
        this.ases.forEach(element => {
            if(element != null){
                element.stop();
            }
        });
        
        this.hasPlaybgm = false;
        this.hasSilencebgm = true;
    },


    RecoverBGM (idx) {
        if(this.hasPlaybgm && this.hasSilencebgm) {
            if(idx<this.ases.length && this.ases[idx] != null) {
                // cc.log('this.cacheVolume[idx]');
                // cc.log(this.cacheVolume[idx]);
                this.ases[idx].volume = this.cacheVolume[idx];//需要缓存起audioSource的默认音量值
            }
            
            this.hasSilencebgm = false;
        }
    },

    SilenceBGM (idx) {
        this.CheckCacheVolumes();

        if(!this.hasSilencebgm) {
            if(idx<this.ases.length && this.ases[idx] != null)
                this.ases[idx].volume = 0;

            this.hasSilencebgm = true;
        }
    },
});
