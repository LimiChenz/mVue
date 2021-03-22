
import { isObject } from './common';
import Watcher from './watch';
import Dep from './dep';
function Observe(vm, data) {
    // 3.0
    // this._proxy(data);
    // 2.0
    // if (!isObject(data)) {
    //     return
    // }
    if (!vm._ob_) {
        def(vm, '_ob_', this)
    }
    this.walk(vm, data)
    this.dep = new Dep()

}

function def(vm, key, value){
    Object.defineProperty(vm, key, {
        value: value,
        enumerable: true,
        writable: true,
        configurable: true
    })
}

Object.prototype.walk = function (vm, data) {
    for (const key in data) {
        if (Object.hasOwnProperty.call(data,key)) {
            // console.log(key, data[key]);
            this.definReactive(vm, data, key, data[key])

        }
    }
}
// 3.0
Observe.prototype._proxy = function (data) {
    let result = new Proxy(data, {
        get(target, key, receiver) {
            console.log('getting', key)
            return Reflect.get(target, key, receiver);
        },
        set(target, key, value, resceiver) {
            console.log('setting', key)
            return Reflect.set(target, key, value, receiver);
        }
    })
    return result;
}

Observe.prototype.definReactive = function (vm, data, key, value) {
    if (isObject(value) && !Array.isArray(value)) {
        new Observe(vm, value)
    }

    Object.defineProperty(vm, key, {
        configurable: false, //不可删除
        enumerable: true, //可迭代
        get: () => {
            const ob = vm._ob_
            ob.dep.depend(key, new Watcher(vm,key))
            console.log('getter', key)
            return value
        },
        set: (newValue) => {
            if (value === newValue) return
            console.log('setter', key, newValue)
            data[key] = newValue
            
            if (isObject(newValue) && !Array.isArray(newValue)) {
                new Observe(vm, newValue)
            }
            
            // notify
            const ob = vm._ob_
            ob.dep.notify(key)
        }
    })
}




export default Observe