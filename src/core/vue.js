import Observe from './observe';

function Vue(options) {
    this._init(options);
}
Vue.prototype._init = function(options) {
    this.$option = options;
    this.$el = options.el;

    let data = this.$option.data;
    // 初始化数据
    if (typeof this.$option.data === 'function') {
        data = this.$option.data();
    }
    this._observe(data);

    console.log(this);
    // 
    // this._complieDom()
}
Vue.prototype._observe = function(data) {
    new Observe(this, data)
}
Vue.prototype._render = function() {
    
}
Vue.prototype._update = function() {

}
Vue.prototype._complieDom = function() {
    let app = document.querySelector(this.$el);
    let container = this._render();
    app && app.appendChild(container);
}
export default Vue