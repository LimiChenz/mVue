import Observe from './observe';
import Watcher from './watch';


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
    this._complieDom(this)

    // this is dev branch
}
Vue.prototype._observe = function () {
    new Observe(this, this.$data)
}
Vue.prototype._render = function (vm, app) {
    if (!app) return
    let methodsReg = /^@/g
    let reg = /\{\{(.*?)\}\}/g
    app.childNodes.forEach(node => {
        if (node.nodeType === 1) {
            if (node.attributes.length > 0) {
                for (const { nodeName, value } of node.attributes) {
                    // console.log(nodeName, /^@/g.test(nodeName));
                    if (/^v-html/g.test(nodeName)) {
                        node.innerHTML = this[value]
                        pushDep(vm, value, node, 'innerHTML')
                        node.removeAttribute(nodeName)
                    }

                    if (/^v-model/g.test(nodeName)) {
                        node.value = this[value]
                        pushDep(vm, value, node, 'value')
                        // node.removeAttribute(nodeName)
                    }

                    if (/^@/g.test(nodeName)) {
                        let eventName = nodeName.split('@')[1]
                        node.addEventListener(eventName, (e) => {
                            this.eventFn = this.$options.methods[value].bind(this)
                            this.eventFn(e)
                        })
                        node.removeAttribute(nodeName)
                    }
                }
            }

        }

        if (node.nodeType === 3) {
            let text = node.textContent
            node.textContent = text.replace(/\{\{(.*?)\}\}/g, (match, key) => {
                let value = this[key].trim()
                pushDep(vm, key, node, 'textContent')
                return value
            })
        }

        if (node.childNodes.length > 0) {
            this._render(vm, node)
        }
    })
}
Vue.prototype._update = function () {

}
Vue.prototype._complieDom = function (vm) {
    let app = document.querySelector(this.$el);
    let container = this._render(vm, app);
    // app && app.appendChild(container);
}

function pushDep(vm, key, node, attr) {
    let watcher = new Watcher(vm, key, node, attr)
    const ob = vm._ob_
    ob.dep.depend(key, watcher)
}

export default Vue