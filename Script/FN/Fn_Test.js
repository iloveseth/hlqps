export let test = {
    testName:null,
    testValue:null,
    testKey:null,
    OnInit(){
        this.testName = []; 
        this.testKey = [];
        this.testValue = [];
    },

    SetInfo(){
        for(var idx=0;idx != this.testName.length;++idx ){
            var jsString = this.testKey[idx] + ' = ' + this.testValue[idx] + ';';
            eval(jsString);
        }
        this.LogInfo();
    },

    LogInfo(){
        for(var idx=0;idx!=this.testName.length;++idx){
            eval('cc.log(' + this.testValue[idx] + ')');
        }
    },

}
