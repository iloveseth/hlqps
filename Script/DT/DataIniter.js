//0, load data difinition

//1, config data Init
//2, profile data Init


var ProtoBuf = require('protobuf');
var protoFile = "AllProto.proto";

export let dataIniter = 
{
    OnInit: function (callback) 
    {
        //零散的Proto 合并为单个Proto
        cc.loader.loadRes(protoFile, function (err, data){  
            hxdt.builder = ProtoBuf.loadProto(data);
            if(callback != null)
                callback(this);
        }.bind(this));
    }
}