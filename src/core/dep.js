function Dep() {
    this.subs = {}
}

Dep.prototype.addSub = function (key, sub) {
    if (Array.isArray(this.subs[key])) {
    } else {
        this.subs[key] = []
    }
    this.subs[key].push(sub)
}

Dep.prototype.depend = function (key, sub) {
    if (Array.isArray(this.subs[key])) {
    } else {
        this.subs[key] = []
    }
    this.subs[key].push(Dep.target)
}

Dep.prototype.notify = function (key) {
    if (Array.isArray(this.subs[key])) {
        this.subs[key].forEach(element => {
            element.update()
        });
    }
    
}

Dep.taget = null

export default Dep