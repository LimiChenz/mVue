(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
   typeof define === 'function' && define.amd ? define(factory) :
   (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.mVue = factory());
}(this, (function () { 'use strict';

   function isObject(value) {
      return typeof value === 'object' && Object.prototype.toString(value) === '[object Object]'
   }

   function Dep() {
       this.subs = {};
   }

   Dep.prototype.addSub = function (key, sub) {
       if (Array.isArray(this.subs[key])) ; else {
           this.subs[key] = [];
       }
       this.subs[key].push(sub);
   };

   Dep.prototype.depend = function (key, sub) {
       if (Array.isArray(this.subs[key])) ; else {
           this.subs[key] = [];
       }
       this.subs[key].push(Dep.target);
   };

   Dep.prototype.notify = function (key) {
       // console.log(key, this.subs[key]);
       if (Array.isArray(this.subs[key])) {
           this.subs[key].forEach(element => {
               element.update();
           });
       }
       
   };

   Dep.taget = null;

   // 观察者Watcher类
   function Watcher(vm,key,node,attrs){
       this.vm = vm;
       this.key = key;
       this.node = node;
       this.attrs = attrs;
       Dep.target = this;  // new Watcher的时候把观察者存放到Dep.target里面
   }
   Watcher.prototype.update = function(){
       // queueWatcher(this) // 异步更新策略
       this.node[this.attrs] = this.vm[this.key];
   };
   Watcher.prototype.run = function(){
       //  dom在这里执行真正的更新

   };

   function Observe(vm, data) {
       // 3.0
       // this._proxy(data);
       // 2.0
       // if (!isObject(data)) {
       //     return
       // }
       if (!vm._ob_) {
           def(vm, '_ob_', this);
       }
       this.walk(vm, data);
       this.dep = new Dep();

   }

   function def(vm, key, value) {
       Object.defineProperty(vm, key, {
           value: value,
           enumerable: true,
           writable: true,
           configurable: true
       });
   }

   Object.prototype.walk = function (vm, data) {
       for (const key in data) {
           if (Object.hasOwnProperty.call(data, key)) {
               // console.log(key, data[key]);
               this.definReactive(vm, data, key, data[key]);

           }
       }
   };
   // 3.0
   Observe.prototype._proxy = function (data) {
       let result = new Proxy(data, {
           get(target, key, receiver) {
               console.log('getting', key);
               return Reflect.get(target, key, receiver);
           },
           set(target, key, value, resceiver) {
               console.log('setting', key);
               return Reflect.set(target, key, value, receiver);
           }
       });
       return result;
   };

   Observe.prototype.definReactive = function (vm, data, key, value) {
       if (isObject(value) && !Array.isArray(value)) {
           new Observe(vm, value);
       }

       Object.defineProperty(vm, key, {
           configurable: false, //不可删除
           enumerable: true, //可迭代
           get: () => {
               console.log('getter', key);
               return value
           },
           set: (newValue) => {
               if (value === newValue) return
               console.log('setter', key, newValue);
               value = newValue;

               if (isObject(newValue) && !Array.isArray(newValue)) {
                   new Observe(vm, newValue);
               }

               // notify
               const ob = vm._ob_;
               ob.dep.notify(key);
           }
       });
   };

   function Vue(options) {
       this._init(options);
   }
   Vue.prototype._init = function (options) {
       this.$options = options;
       this.$el = options.el;

       // 初始化数据
       let data = this.$options.data;
       if (typeof this.$options.data === 'function') {
           data = this.$options.data();
       }
       this.$data = data;
       this._observe();

       console.log(this);

       // 暂时这样实现 - 非虚拟dom
       this._complieDom(this);

   };
   Vue.prototype._observe = function () {
       new Observe(this, this.$data);
   };
   Vue.prototype._render = function (vm, app) {
       if (!app) return;
       app.childNodes.forEach(node => {
           if (node.nodeType === 1) {
               if (node.attributes.length > 0) {
                   for (const { nodeName, value } of node.attributes) {
                       // console.log(nodeName, /^@/g.test(nodeName));
                       if (/^v-html/g.test(nodeName)) {
                           node.innerHTML = this[value];
                           pushDep(vm, value, node, 'innerHTML');
                           node.removeAttribute(nodeName);
                       }

                       if (/^v-model/g.test(nodeName)) {
                           node.value = this[value];
                           pushDep(vm, value, node, 'value');
                           // node.removeAttribute(nodeName)
                       }

                       if (/^@/g.test(nodeName)) {
                           let eventName = nodeName.split('@')[1];
                           node.addEventListener(eventName, (e) => {
                               this.eventFn = this.$options.methods[value].bind(this);
                               this.eventFn(e);
                           });
                           node.removeAttribute(nodeName);
                       }
                   }
               }

           }

           if (node.nodeType === 3) {
               let text = node.textContent;
               node.textContent = text.replace(/\{\{(.*?)\}\}/g, (match, key) => {
                   let value = this[key].trim();
                   pushDep(vm, key, node, 'textContent');
                   return value
               });
           }

           if (node.childNodes.length > 0) {
               this._render(vm, node);
           }
       });
   };
   Vue.prototype._update = function () {

   };
   Vue.prototype._complieDom = function (vm) {
       let app = document.querySelector(this.$el);
       this._render(vm, app);
       // app && app.appendChild(container);
   };

   function pushDep(vm, key, node, attr) {
       let watcher = new Watcher(vm, key, node, attr);
       const ob = vm._ob_;
       ob.dep.depend(key, watcher);
   }

   return Vue;

})));
