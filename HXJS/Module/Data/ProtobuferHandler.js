import { hxdt } from "../../../Script/DT/HXDT";



export let protoHandler = {
    dict : {},

    Get (dataDef, field, data) 
    {
        if(dataDef in this.dict) {
            var result = this.dict[dataDef].get(field);
            return result;
        }
        else {
            var msg_Def = hxdt.builder.build(dataDef);
            var msg = msg_Def.decode(data);
            this.dict[dataDef] = msg;

            var result = msg.get(field);
            return result;
        }
    },

    Pack (dataDef, info) {
        var msg = hxdt.builder.build(dataDef);
        var inf = msg.encode(info);

        return inf;
    },

    UnPack(dataDef, data) {
        var msg = hxdt.builder.build(dataDef);
        var info = msg.decode(data);
        return info;
    }
};