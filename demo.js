// bind 实现
Function.prototype.bind2 = function (context) {
    var self = this;
    // console.log(this);
    var args = Array.prototype.slice.call(arguments, 1)

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments)
        // console.log(this instanceof fBound);
        return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs))
    }

    fBound.prototype = this.prototype
    return fBound
}
let foo = {
    value: 1
}
function f() {
    // console.log(this.value)
    // console.log(arguments)
}
var bindFn = f.bind2(foo, '123456', '654321')
let aaa = new bindFn('789', 'abc')
// console.log(aaa);



// 函数柯里化
function curry(fn, args) {
    var length = fn.length;
    var args = args || []

    return function () {
        var _args = args.slice(0)
        for (let index = 0; index < arguments.length; index++) {
            const element = arguments[index];
            _args.push(element)
        }
        if (_args.length < length) {
            return curry.call(this, fn, _args)
        } else {
            return fn.apply(this, _args)
        }
    }

}

var fn = curry(function (a, b, c) {
    console.log([a, b, c]);
});

// fn("a1", "b", "c") // ["a", "b", "c"]
// fn("a2", "b")("c") // ["a", "b", "c"]
// fn("a3")("b")("c") // ["a", "b", "c"]
// fn("a4")("b", "c") // ["a", "b", "c"]

// 



// new
function objectFactory() {
    var obj = new Object()
    var Constructor = Array.prototype.shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    var ret = Constructor.apply(obj, arguments);

    return obj
    // return typeof ret === 'object' ? ret :  obj;
};


function App(value){
    this.value = value
    this.name = 'CCCCC'
}

let oo = objectFactory(App,'123')

console.log(oo);


























