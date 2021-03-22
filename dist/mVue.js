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

   function def(vm, key, value){
       Object.defineProperty(vm, key, {
           value: value,
           enumerable: true,
           writable: true,
           configurable: true
       });
   }

   Object.prototype.walk = function (vm, data) {
       for (const key in data) {
           if (Object.hasOwnProperty.call(data,key)) {
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
               const ob = vm._ob_;
               ob.dep.depend(key, new Watcher(vm,key));
               console.log('getter', key);
               return value
           },
           set: (newValue) => {
               if (value === newValue) return
               console.log('setter', key, newValue);
               data[key] = newValue;
               
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
   Vue.prototype._init = function(options) {
       this.$option = options;
       this.$el = options.el;

       // 初始化数据
       let data = this.$option.data;
       if (typeof this.$option.data === 'function') {
           data = this.$option.data();
       }
       this._observe(data);


       
       console.log(this);
       // 
       // this._complieDom()
   };
   Vue.prototype._observe = function(data) {
       new Observe(this, data);
   };
   Vue.prototype._render = function() {
       
   };
   Vue.prototype._update = function() {

   };
   Vue.prototype._complieDom = function() {
       let app = document.querySelector(this.$el);
       let container = this._render();
       app && app.appendChild(container);
   };

   return Vue;

})));
