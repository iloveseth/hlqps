
export let ErrorCodeClient = {
    InputCantBeNull : 1,

    codeToDesc(code) {
        switch (code) {
            case 1:
                return "输入不能为空！";
            default:
                return "未知错误";
        }
    }
}
