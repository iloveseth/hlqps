import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        tankNode: {
            default: null,
            type: cc.Node
        },
        tankPrefab: {
            default: null,
            type: cc.Prefab
        },
        worldBg: {
            default: null,
            type: cc.Node
        }

    },
    onLoad: function () {
        global.event.on("shoot_one_bullet", this.addOneBullet.bind(this));
        let collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        collisionManager.enabledDebugDraw = true;
        collisionManager.debugDraw = true;
        collisionManager.enabledDrawBoundingBox = true;
        //初始化 是个坦克
        for (let i = 0; i < 10; i++) {
            let tank = cc.instantiate(this.tankPrefab);
            tank.parent = this.node;
            tank.getComponent("tank").initWithData({
                id: i
            })
        }


        //
        var X = [
            [0,0,1],
            [0,1,1],
            [1,0,1],
            [1,1,1]
        ];
        var y = [
            [0],
            [0],
            [1],
            [1]
        ];

        function nonlin(x, deriv) {
            if (deriv){
                return numeric.mul(x, numeric.sub(1, x));
            }
            return numeric.div(1, numeric.add(1, numeric.exp(numeric.neg(x))));
        }
        function train_neural(X, y, iteration) {
            var syn0 = numeric.sub(numeric.mul(2, numeric.random([3, 1])),1);
            console.log("syn0 = " + JSON.stringify(syn0));
            var i = 0 ;
            for (; i < iteration ; i ++){
                var l0 = X;
                var l1 = nonlin(numeric.dot(l0, syn0));
                var l1_error = numeric.sub(y, l1);
                var l1_delta = numeric.mul(l1_error, nonlin(l1, true));
                syn0 = numeric.add(syn0, numeric.dot(numeric.transpose(l0), l1_delta));
            }


            console.log("syn0 = " + JSON.stringify(syn0));

            var result = nonlin(numeric.dot(X, syn0));
            console.log("resylt" + JSON.stringify(result));

        }



        train_neural(X, y, 5000);


        // function nonlin(x, deriv) {
        //     if (deriv) {
        //         return numeric.mul(x, numeric.sub(1, x));
        //     }
        //     return numeric.div(1, numeric.add(1, numeric.exp(numeric.neg(x))));
        // }
        // //
        // function train_neural(x, y, iteration) {
        //     var syn0 = numeric.sub(numeric.mul(2, numeric.random([2, 1])), 1);
        //     for (let i = 0; i < iteration; i++) {
        //         var l1 = nonlin(numeric.dot(x, syn0));
        //         var l1_error = numeric.sub(y, l1);
        //         var l1_delta = numeric.mul(l1_error, nonlin(l1, true));
        //
        //         let transpose = numeric.transpose(l1);
        //         let dot = numeric.dot(transpose, l1_delta);
        //         cc.log("lq delta = " + JSON.stringify(transpose));
        //         cc.log("l1_delta = " + JSON.stringify(l1_delta));
        //         cc.log("dot = " + JSON.stringify(dot));
        //         syn0 = numeric.add(syn0, dot);
        //
        //         cc.log("syn0 = " + JSON.stringify(syn0));
        //         // syn0 = numeric.add(syn0, numeric.dot(numeric.transpose(l1), l1_delta));
        //     }
        //
        //     cc.log("syn0 = " + JSON.stringify(syn0));
        // }
        // //
        // let irisX = [
        //     [3, 1],
        //     [3, 2],
        //     [1, 2]
        // ];
        // let irisY = [
        //     [3],
        //     [2],
        //     [1]
        // ];
        //
        // //
        // train_neural(irisX, irisY, 1000);
    },
    addOneBullet: function (data) {
        //添加一颗子弹
        let bullet = cc.instantiate(this.bulletPrefab);
        bullet.parent = this.node;
        bullet.getComponent("bullet").initWithData(data);

    }


});
