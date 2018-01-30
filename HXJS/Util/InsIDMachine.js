export let insidMachine = 
{
    // 应该支持为不同类型的对象创建ID！！！
    //1,net请求
    //2,ui面板 为所有的dialog型资源

    insids:new Map(),

    //HACK 目前只为网络请求创建唯一ID
    // insid : 0,

    OnInit() {
        this.insids.set('net', 0);
        this.insids.set('ui', 0);
    },

    GetInsid (typ/*应该传类型*/) 
    {
        // this.insid += 1;
        // return this.insid;

        var id = this.insids.get(typ);
        id+=1;
        this.insids.set(typ, id);
        return id;
    }
}