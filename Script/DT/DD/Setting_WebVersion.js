export let setting_webVersion =
    {
        GameEdition: cc.Enum({
            None: 0,
            OL: 1,
            RED: 2,
            BLACK: 3,
        }),

        // 服务发现url
        // url : 'http://testlogin.hx-game.com:35554/rest/user/serverInfo/',
        // url : 'http://service.jzsddh.com:35554/rest/user/serverInfo/',
        url: 'http://jj.itrainingame.com:35554/rest/user/serverInfo/',   //测试服地址
        gameType: "happy",
        platformID: "COM-OFF",//平台id//OS
        packageID: "GoldComOff",//包id
        version: "1.0.0",
        debugServerID: '',//C01, C02
        deviceId: '',//设备号
        OS: 'WEB',//"COMMON",
        review: false,
        resVersion: '1.0.0',
        // gameEdition: 
        get gameEdition() {
            return this.GameEdition.OL;
        },

        GetServerUrl() {
            return this.url;
        },

        GetDebugServerId() {
            return this.debugServerID;
        },

        GetDeviceId() {
            return this.deviceId;
        },
        GetGameVersion() {
            return this.version;
        },

        GetPlatformId() {
            return this.platformID;
        },

        GetPackageId() {
            return this.packageID;
        },

        GetOS() {
            return this.OS;
        },

        GetType() {
            return this.gameType;
        },

        GetResVersion() {
            return this.resVersion;
        },

        GetAssetPath() {
            let path = '';
            if (this.gameEdition == this.GameEdition.RED) {
                path = 'art_red';
            }
            else if (this.gameEdition == this.GameEdition.OL) {
                path = 'art';
            }
            return path;
        }
    }