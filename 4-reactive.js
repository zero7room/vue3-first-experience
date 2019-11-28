function reactive(data) {
    if (typeof data !== 'object' || data === null) {
        return data
    }
    // Proxy相当于在对象外层加拦截
    // http://es6.ruanyifeng.com/#docs/proxy
    const observed = new Proxy(data, {
        // 获取拦截
        get(target, key, receiver) {
            console.log(`获取${key}：${Reflect.get(target, key, receiver)}`)
            // Reflect用于执行对象默认操作，Proxy的方法它都有对应方法
            // Reflect更规范、更友好
            // http://es6.ruanyifeng.com/#docs/reflect
            const val = Reflect.get(target, key, receiver)
            // 若val为对象则定义代理
            return typeof val === 'object' ? reactive(val) : val
        },
        // 新增、更新拦截
        set(target, key, value, receiver) {
            console.log(`设置${key}为：${value}`)
            return Reflect.set(target, key, value, receiver)
        },
        // 删除属性拦截
        deleteProperty(target, key) {
            console.log(`删除${key}`)
            return Reflect.deleteProperty(target, key)
        }
    })
    return observed
}
const data = {
    foo: 'foo',
    obj: { a: 1 },
    arr: [1, 2, 3]
}
const react = reactive(data)
// get
react.foo
react.obj.a
react.arr[0]
// set
react.foo = 'fooooo'
react.obj.a = 10
react.arr[0] = 100
// add
react.bar = 'bar'
react.obj.b = 10
react.arr.push(4)
react.arr[4] = '5'
// delete
delete react.bar
delete react.obj.b
react.arr.splice(4, 1)
delete react.arr[3]
