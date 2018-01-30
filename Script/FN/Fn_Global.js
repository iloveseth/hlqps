import { hxjs } from "../../HXJS/HXJS";

export let global = {
    OnInit() {
        var lostFocus = false;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            if (lostFocus)
                return;
            lostFocus = true;

            hxjs.uwcontroller.GameStop();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            if (!lostFocus)
                return;
            lostFocus = false;

            hxjs.uwcontroller.GameResume();
        })
    },


    HandleServerInvokesStr(invokes, tag, isHandle) {
        var jsStr = '';
        if (isHandle) {
            for (var idx = 0; idx != invokes.length; ++idx) {
                jsStr += 'hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.' + invokes[idx] + ', function(data){\n';
                jsStr += '\thxjs.util.Notifier.emit(\'' + tag + '_' + invokes[idx] + '\', data);\n';
                jsStr += '});\n';
            }
        }
        else {
            for (var idx = 0; idx != invokes.length; ++idx) {
                jsStr += 'hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.' + invokes[idx] + ');';
            }
        }
        cc.log(jsStr);
        return jsStr;
    },

    HandleServerInvokes(invokes, tag, isHandle) {
        if (isHandle) {
            for (var idx = 0; idx != invokes.length; ++idx) {
                var jsStr1 = 'hxfn.net.Regist4ServerInvoke(hxdt.msgcmd.' + invokes[idx] + ', function(data){\n';
                var jsStr2 = '\thxjs.util.Notifier.emit(\'' + tag + '_' + invokes[idx] + '\', data);\n';
                var jsStr3 = '});';
                var jsStr = jsStr1 + jsStr2 + jsStr3;
                cc.log(jsStr);
                eval(jsStr);
            }
        }
        else {
            for (var idx = 0; idx != invokes.length; ++idx) {
                var jsStr = 'hxfn.net.Unregist4ServerInvoke(hxdt.msgcmd.' + invokes[idx] + ');';
                cc.log(jsStr);
                eval(jsStr);
            }
        }
    },

    HandleNotifiersStr(notifiers, isHandle) {
        var jsStr = '';
        if (isHandle) {
            var jsStr = '';
            for (var idx = 0; idx != notifiers.length; ++idx) {
                jsStr += 'hxjs.util.Notifier.on(\'' + notifiers[idx] + '\', this.' + notifiers[idx] + ',this );\n';
            }
        }
        else {
            for (var idx = 0; idx != notifiers.length; ++idx) {
                jsStr += 'hxjs.util.Notifier.off(\'' + notifiers[idx] + '\', this.' + notifiers[idx] + ',this );\n';
            }
        }
        cc.log(jsStr);
        return jsStr;
    },

    HandleNotifiers(notifiers, isHandle) {
        var jsStr = '';
        if (isHandle) {
            var jsStr = '';
            for (var idx = 0; idx != notifiers.length; ++idx) {
                jsStr += 'hxjs.util.Notifier.on(\'' + notifiers[idx] + '\', this.' + notifiers[idx] + ',this );\n';
            }
        }
        else {
            for (var idx = 0; idx != notifiers.length; ++idx) {
                jsStr += 'hxjs.util.Notifier.off(\'' + notifiers[idx] + '\', this.' + notifiers[idx] + ',this );\n';
            }
        }
        cc.log(jsStr);
        return jsStr;
    },

    HandleNodes(nodes, isVisible) {
        nodes.forEach(element => {
            if (element != null)
                element.active = isVisible;
        });
    },

    // HideNode(nodes){
    //     cc.log('hxdt.setting_comn.review:')
    //     cc.log(hxdt.setting_comn.review);
    //     cc.log(nodes.length);
    //     if(hxdt.setting_comn.review){
    //         nodes.forEach(element => {
    //             element.active = false;
    //         });
    //     }   
    // },
}