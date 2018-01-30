//1，读文本
//2，本地持久化

// import {baiyi} from '../Frame/baiyi';

// class LogSystem {
//     constructor() {
//         this.recordType = {
//             CONSOLE 	: 1,
//             FILE        : 2,
//             ALL 	    : 3,
//         };
//         this.logType = {
//             DEBUG 	: 1,
//             RELEASE : 2,
//             ERROR 	: 3,
//             FATAL 	: 4
//         }
//         this.recordLv = this.recordType.CONSOLE;
//         this.logLv = this.logType.DEBUG;

//         this.contentBuffer = "";
//         this.strLogDirectory = "log/";
//         this.strLogFileName = "log";
//         this.strLogExtName = ".txt";
//         this.strLogExtTime = "";
//         this.strLogFilePath = "";
//         this.maxSize = 1024*1024;
//         this.bAddTime = true; 

//     }
//     static getInstance() {
//         if (!LogSystem.instance) {
//         LogSystem.instance = new LogSystem();
//         }
//         return LogSystem.instance;
//     }

//     init(){
//         var self = this;
//         //cc.log(jsb.fileUtils.getWritablePath());
//          //var realUrl = cc.url.raw("resources/config/config.json");
//         cc.loader.loadRes("config/config", function (error, content) {
//             if (error) {
//                 cc.log(error);
//             }
//             else {
//                 cc.log("get config sucess");
//                 cc.log(content);
//                 self.strLogDirectory = content["Directory"];
//                 self.strLogFileName = content["FileName"];
//                 self.strLogExtName = content["ExtName"];
//                 self.bAddTime = content["AddTime"];
//                 self.logLv = self.logType[content["RecordLevel"]];
//                 self.maxSize = content["MaxSize"];
//                 self.createLogFile();
//             }
//         });
//     }

//     createLogFile() {
//         if(cc.sys.isNative){
//             this.strLogDirectory = jsb.fileUtils.getWritablePath() + this.strLogDirectory;
//             //this.strLogFileName = "log";
//             //this.strLogExtName = ".txt";
//             var date = new Date();
//             if (this.bAddTime){
//                 this.strLogExtTime = "_" + (date.getYear() + 1900) + "_" + (date.getMonth() + 1) + "_" + date.getDate();
//             }
//             else {
//                 this.strLogExtTime = "";
//             }
//             this.strLogFilePath = this.strLogDirectory + this.strLogFileName + this.strLogExtTime + this.strLogExtName;
//             this.contentBuffer = "";

//             if(!jsb.fileUtils.isDirectoryExist(this.strLogDirectory)){
//                 jsb.fileUtils.createDirectory(this.strLogDirectory);
//             }
//         }
//     };

//     logError(str) {
//         var buffer = "[ERROR]" + new Date().toLocaleTimeString() + ": " + str;
//         this.writeToFile(buffer,this.logType.ERROR);
//         this.writeToConsole(buffer,this.logType.ERROR);
//     };
//     logFatal(str) {
//         var buffer = "[FATAL]" + new Date().toLocaleTimeString() + ": " + str;
//         this.writeToFile(buffer,this.logType.FATAL);
//         this.writeToConsole(buffer,this.logType.FATAL);
//     };
//     logRelease(str) {
//         var buffer = "[TRACE]" + new Date().toLocaleTimeString() + ": " + str;
//         this.writeToFile(buffer,this.logType.TRACE);
//         this.writeToConsole(buffer,this.logType.TRACE);
//     };
//     logDebug(str) {
//         var buffer = "[DEBUG]" + new Date().toLocaleTimeString() + ": " + str;
//         this.writeToFile(buffer,this.logType.DEBUG);
//         this.writeToConsole(buffer,this.logType.DEBUG);
//     };

//     writeToFile(buffer,logLevel) {
//         if(cc.sys.isNative){
//             if(this.recordLv == this.recordType.FILE || this.recordLv == this.recordType.toLocaleTimeString){
//                 if(this.logLv >= logLevel){
//                     this.contentBuffer += buffer + "\n";
//                     jsb.fileUtils.writeStringToFile(this.contentBuffer,this.strLogFilePath);
//                 }
//             }
//         }
//     };
//     writeToConsole(buffer,logLevel) {
//         if(this.recordLv == this.recordType.CONSOLE || this.recordLv == this.recordType.toLocaleTimeString){
//             if(this.logLv >= logLevel){
//                 cc.log(buffer);
//             }
//         }
//     };
// }

// export default LogSystem.getInstance();