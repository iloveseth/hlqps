cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {

        var arr = [1,2,3,4,5];
        arr.removeAt(2);
        cc.log(arr); 

        hxjs.util.Notifier.on('UI_BattleQuit', this.OnEnd, this);
        hxjs.util.Notifier.off('UI_BattleQuit', this.OnEnd, this);

        var arr = [this.OnEnd, this.OnGame];

        var idx = arr.indexOf(this.OnGame);
        var b = cmp(this.OnEnd, this.OnGame);

        var f1= new TTT(111);
        var f2= new TTT(222);

        var b2 = cmp(f1.OnInit, f2.OnInit);
        // var b3 = equal(f1, f2);

        
        cc.log(f1.name);
        cc.log(f2.name);
        cc.log(f1.OnInit.name);
        cc.log(f2.OnInit.name);
        cc.log(idx);
        cc.log(b);
        cc.log(b2);
        // cc.log(b3);
    },

    OnEnd:function () {

    },

    OnGame :function () {

    }
});


function TTT() {
    // this.curState = Enum_BattleState.None;
    // this.ctrl = null;
    // this.lastPos = cc.p(-1, -1);//Nice API
}

TTT.prototype = {
    OnInit (iii) {
    }
}

// function equal(objA, objB)
// {
//     if (typeof arguments[0] != typeof arguments[1])
//         return false;

//     // //数组
//     // if (arguments[0] instanceof Array)
//     // {
//     //     if (arguments[0].length != arguments[1].length)
//     //         return false;
        
//     //     var allElementsEqual = true;
//     //     for (var i = 0; i < arguments[0].length; ++i)
//     //     {
//     //         if (typeof arguments[0][i] != typeof arguments[1][i])
//     //             return false;

//     //         if (typeof arguments[0][i] == 'number' && typeof arguments[1][i] == 'number')
//     //             allElementsEqual = (arguments[0][i] == arguments[1][i]);
//     //         else
//     //             allElementsEqual = arguments.callee(arguments[0][i], arguments[1][i]);            //递归判断对象是否相等                
//     //     }
//     //     return allElementsEqual;
//     // }
    
//     //对象
//     if (arguments[0] instanceof Object && arguments[1] instanceof Object)
//     {
//         var result = true;
//         var attributeLengthA = 0, attributeLengthB = 0;
//         for (var o in arguments[0])
//         {
//             //判断两个对象的同名属性是否相同（数字或字符串）
//             if (typeof arguments[0][o] == 'number' || typeof arguments[0][o] == 'string'){
//                 result = eval("arguments[0]['" + o + "'] == arguments[1]['" + o + "']");

//                 if(!result)
//                 return false;
//             }
//             else {
//                 //如果对象的属性也是对象，则递归判断两个对象的同名属性
//                 //if (!arguments.callee(arguments[0][o], arguments[1][o]))
//                 if (!arguments.callee(eval("arguments[0]['" + o + "']"), eval("arguments[1]['" + o + "']")))
//                 {
//                     result = false;
//                     return result;
//                 }
//             }
//             ++attributeLengthA;
//         }
        
//         for (var o in arguments[1]) {
//             ++attributeLengthB;
//         }
        
//         //如果两个对象的属性数目不等，则两个对象也不等
//         if (attributeLengthA != attributeLengthB)
//             result = false;
//         return result;
//     }
//     return arguments[0] == arguments[1];
// }

var cmp = function( x, y ) { 
    // If both x and y are null or undefined and exactly the same 
    if ( x === y ) { 
     return true; 
    } 
     
    // If they are not strictly equal, they both need to be Objects 
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) { 
     return false; 
    } 
     
    //They must have the exact same prototype chain,the closest we can do is
    //test the constructor. 
    if ( x.constructor !== y.constructor ) { 
     return false; 
    } 
      
    for ( var p in x ) { 
     //Inherited properties were tested using x.constructor === y.constructor
     if ( x.hasOwnProperty( p ) ) { 
     // Allows comparing x[ p ] and y[ p ] when set to undefined 
     if ( ! y.hasOwnProperty( p ) ) { 
      return false; 
     } 
     
     // If they have the same strict value or identity then they are equal 
     if ( x[ p ] === y[ p ] ) { 
      continue; 
     } 
     
     // Numbers, Strings, Functions, Booleans must be strictly equal 
     if ( typeof( x[ p ] ) !== "object" ) { 
      return false; 
     } 
     
     // Objects and Arrays must be tested recursively 
     if ( ! Object.equals( x[ p ], y[ p ] ) ) { 
      return false; 
     } 
     } 
    } 
     
    for ( p in y ) { 
     // allows x[ p ] to be set to undefined 
     if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) { 
     return false; 
     } 
    } 
    return true; 
    };