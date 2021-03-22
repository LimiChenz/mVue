import Dep from './dep'
// 观察者Watcher类
function Watcher(vm,key,node,attrs){
    
    this.vm = vm
    this.key = key
    this.node = node
    this.attrs = attrs
    Dep.target = this  // new Watcher的时候把观察者存放到Dep.target里面
}
Watcher.prototype.update = function(){
    // queueWatcher(this) // 异步更新策略
    this.node[this.attrs] = this.vm[this.key]
}
Watcher.prototype.run = function(){
    //  dom在这里执行真正的更新

}

export default Watcher