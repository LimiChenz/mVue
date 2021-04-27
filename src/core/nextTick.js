/** queueWatcher函数*/
let has = {};
let queue = [];
let waiting = false;

function queueWatcher (watcher) {
  const id = watcher.id
  // 防止queue队列wachter对象重复
  if (has[id] == null) {
    has[id] = true
    queue.push(watcher)
    
    // 传递本次的更新任务
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}

/** flushSchedulerQueue函数 */
function flushSchedulerQueue () {
    let watcher, id;
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        id = watcher.id;
        has[id] = null;
        // 执行更新
        watcher.run();
    }
    // 更新完毕恢复标志位
    waiting = false;
}



let callbacks = [];
let pending = false;
let timerFunc;

/**----- nextTick -----*/
function nextTick (cb) {
    // 把传进来的回调函数放到callbacks队列里
    callbacks.push(cb);

    // pending代表一个等待状态 等这个tick执行
    if (!pending) {
        pending = true
        timerFunc()
    }
    
    // 如果没传递回调 提供一个Promise化的调用
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
          _resolve = resolve
        })
    }
}

/**----- timerFunc ----*/

// 1、优先考虑Promise实现
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]')) {
  // 2、降级到MutationObserver实现
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // 3、降级到setImmediate实现
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // 4、如果以上都不支持就用setTimeout来兜底了
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

function flushCallbacks () {
  // 将callbacks中的cb依次执行
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

