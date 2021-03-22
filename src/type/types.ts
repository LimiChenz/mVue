export interface Options {
    el: string,
    data: () => object,    
} 

class Watch{
    $vm: any
    key: string | undefined
    update: (() => {}) | undefined 
}

export interface Dep {
    deps: Watch[]
}