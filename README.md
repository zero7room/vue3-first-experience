## 爱之初体验
体验vue3.0之前，先为大家点上一首经典老歌 [爱之初体验](https://music.163.com/#/song?id=185792&market=baiduqk)  
开不开心，快不快乐，废话不说，开启正题，让我们来边听歌边学习！

## 新技术新方向
首先我们先来看一下vue3.0在哪些方面有所更新：

- 使用`Typescript`
- 放弃`class`采用`function-based API`
- 重构`complier`
- 重构`virtual DOM`
- 新的响应式机制


## 环境搭建
- 迁出Vue3源码： `git clone https://github.com/vuejs/vue-next.git`
- 安装依赖：`yarn`
    >注意只能yarn装，别用npm   
- 添加SourceMap文件：
    - rollup.config.js
    ```
        // 76行添加如下代码
        output.sourcemap = true
    ```
    - 修改ts配置，tsconfig.json
    ```
        "sourceMap": true
    ```
- 编译：`yarn dev`
    > 生成结果：packages\vue\dist\vue.global.js
## vue3尝鲜体验
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>hello vue3</title>
    <script src="../dist/vue.global.js"></script>
</head>

<body>
    <div id='app'></div>
    <script>
        const App = {
            template: `<h1>{{message}}</h1>`,
            data: { message: 'Hello Vue 3!' }
        }
        Vue.createApp().mount(App, '#app')
    </script>
</body>

</html>
```
## Composition API
### 背景
**Composition API**字面意思是组合**API**，它是为了实现基于函数的逻辑复用机制而产生的。   

2019年2月6号，**React**发布**16.8.0**版本，新增**Hooks**特性。随即，**Vue**在**2019**的各大**JSConf**中也宣告了**Vue3.0**最重要的** RFC**，即**Function-based API**。**Vue3.0**将抛弃之前的**Class API** 的提案，选择了**Function API**。目前，[vue官方](https://github.com/vuejs) 也提供了**Vue3.0** 特性的尝鲜版本，前段时间叫**vue-function-api**，目前已经改名叫 **composition-api**。   
### 设计初衷
首先，我们得了解一下，Composition API 设计初衷是什么？
![](https://user-gold-cdn.xitu.io/2019/11/28/16eafc5c1327c7c8?w=1280&h=499&f=webp&s=12150)

1. 逻辑组合和复用
2. 类型推导：**Vue3.0**最核心的点之一就是使用**TS**重构，以实现对**TS**丝滑般的支持。而基于函数的**API**则天然对类型推导很友好。
3. 打包尺寸：每个函数都可作为**named ES export**被单独引入，对** tree-shaking**很友好；其次所有函数名和**setup** 函数内部的变量都能被压缩，所以能有更好的压缩效率。

### 对比vue2.0
我们再来具体了解一下**逻辑组合和复用**这块。

开始之前，我们先回顾下目前**Vue2.x**对于逻辑复用的方案都有哪些？如图
![](https://user-gold-cdn.xitu.io/2019/11/28/16eafc703e77534e?w=1280&h=536&f=webp&s=11824)

其中**Mixins**和**HOC**都可能存在**①**模板数据来源不清晰 的问题。   
并且在**mixin**的属性、方法的命名以及**HOC**的**props** 注入也可能会产生 ②命名空间冲突的问题。   
最后，由于**HOC**和**Renderless Components** 都需要额外的组件实例来做逻辑封装，会导致**③**无谓的性能开销。


## vue3响应式原理
### 背景
- Vue2响应式的一些问题：
    - 响应化过程需要遍历data,props等，消耗较大
    - 不支持Set/Map、Class、数组等类型
    - 新加或删除属性无法监听
    - 数组响应化需要额外实现
    - 对应的修改语法有限制
- Vue3响应式原理：使用ES6的Proxy来解决这些问题。

### 实现代码
```
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
```
测试代码
```
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
```
## 重构后的响应式机制带来了哪些改变
### 对数组的全面监听
Vue2.x 中被大家吐槽的最多的一点就是针对数组只实现了`push,pop,shift,unshift,splice,sort,reverse'`这七个方法的监听，以前通过数组下标改变值的时候，是不能触发视图更新的。这里插一个题外话，很多人认为 Vue2.x 中数组不能实现全方位监听是 Object.defineProperty 不能监听数组下标的改变，这可就冤枉人家了，人家也能侦听数组下标变化的好吗，不信你看
```
const arr = ["2019","云","栖","音","乐","节"];
arr.forEach((val,index)=>{
    Object.defineProperty(arr,index,{
        set(newVal){
            console.log("赋值");
        },
        get(){
            console.log("取值");
            return val;
        }
    })
})
let index = arr[1];
//取值
arr[0] = "2050";
//赋值


```
没毛病，一切变化都在人家的掌握中。上面这段代码，有没有人没看懂，我假装你们都不懂，贴张图

![](https://user-gold-cdn.xitu.io/2019/11/28/16eb0319bed04189?w=602&h=420&f=webp&s=10832)

从数组的数据结构来看，数组也是一个 Key-Value 的键值对集合，只是 Key 是数字罢了，自然也可以通过 Object.defineProperty 来实现数组的下标访问和赋值拦截了。其实 Vue2.x 没有实现数组的全方位监听主要有两方面原因：  

1.数组和普通对象相比，JS 数组太"多变"了。比如：`arr.length=0`，可以瞬间清空一个数组；`arr[100]=1`又可以瞬间将一个数组的长度变为 100（其他位置用空元素填充），等等骚操作。对于一个普通对象，我们一般只会改变 Key 对应的 Value 值，而不会连 key 都改变了,而数组就不一样了 Key 和 Value 都经常增加或减少，因此每次变化后我们都需要重新将整个数组的所有 key 递归的使用 Object.defineProperty 加上 setter 和 getter，同时我们还要穷举每一种数组变化的可能，这样势必就会带来性能开销问题，有的人会觉得这点性能开销算个 x 呀，但是性能问题都是由小变大的，如果数组中存的数据量大而且操作频繁时，这就会是一个大问题。React16.x 在就因为在优化 textNode 的时候，移除了无意义的 span 标签，性能据说都提升了多少个百分点，所以性能问题不可小看。

2.数组在应用中经常会被操作，但是通常`push,pop,shift,unshift,splice,sort,reverse`这 7 种操作就能达到目的。因此，出于性能方面的考虑 Vue2.x 做出了一定的取舍。

那么 Vue3.0 怎么又走回头路去实现了数组的全面监听了呢？答案就是 Proxy 和 Reflet 这一对原生 CP 的出现，Vue3.0 使用 Proxy 作为响应式数据实现的核心，用 Proxy 返回一个代理对象，通过代理对象来收集依赖和触发更新。大概的原理像这段代码一样：
```
const arr = ["2019","云","栖","音","乐","节"];
let ProxyArray = new Proxy(arr,{
    get:function(target, name, value, receiver) {
        console.log("取值")
        return Reflect.get(target,name);
    },
    set: function(target, name, value, receiver) {
       console.log("赋值")
       Reflect.set(target,name, value, receiver);;
    }
 })
 const index = ProxyArray[0];
 //取值
 ProxyArray[0]="2050"
 //赋值

作者：政采云前端团队
链接：https://juejin.im/post/5db808e2e51d452a05505af3
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

效果和 Object.defineProperty 一样一样的，又显得清新脱俗有没有？而且 Proxy 只要是对象都能代理，后面还会提到。当然 Vue3.0 是虽然有了新欢，但也没忘记旧爱，对于在之前版本中数组的几种方法的监听还是照样支持的。

### 惰性监听
#### 什么是"惰性监听"?
简单讲就是"偷懒"，开发者可以选择性的生成可观察对象。在平时的开发中常有这样的场景，一些页面上的数据在页面的整个生命周期中是不会变化的，这时这部分数据不需要具备响应式能力，这在 Vue3.0 以前是没有选择余地的，所有在模板中使用到的数据都需要在 data 中定义，组件实例在初始化的时候会将 data 整个对象变为可观察对象。
#### 惰性监听有什么好处？
1.提高了组件实例初始化速度   

Vue3.0 以前组件实例在初始化的时候会将 data 整个对象变为可观察对象，通过递归的方式给每个 Key 使用 Object.defineProperty 加上 getter 和 settter ，如果是数组就重写代理数组对象的七个方法。而在 Vue3.0 中，将可响应式对象创建的权利交给了开发者，开发者可以通过暴露的 reactive , compted , effect 方法自定义自己需要响应式能力的数据，实例在初始化时不需要再去递归 data 对象了，从而降低了组件实例化的时间。

2.降低了运行内存的使用   

Vue3.0 以前生成响应式对象会对对象进行深度遍历，同时为每个 Key 生成一个 def 对象用来保存 Key 的所有依赖项，当 Key 对应的 Value 变化的时候通知依赖项进行 update 。但如果这些依赖项在页面整个生命周期内不需要更新的时候，这时 def  对象收集的依赖项不仅没用而且还会占用内存，如果可以在初始化 data 的时候忽略掉这些不会变化的值就好了。Vue3.0 通过暴露的 reactive 方法，开发者可以选择性的创建可观察对象，达到减少依赖项的保存，降低了运行内存的使用。

### Map、Set、WeakSet、WeakMap的监听

前面提到 Proxy 可以代理所有的对象，立马联想到了 ES6 里面新增的集合 Map、Set， 聚合类型的支持得益于 Proxy 和 Reflect。讲真的这之前还真不知道 Proxy 这么刚啥都能代理，二话不说直接动手用 Proxy 代理了一个 map 试试水
```
let map = new Map([["name","zhengcaiyun"]])
let mapProxy = new Proxy(map, {
  get(target, key, receiver) {
    console.log("取值:",key)
    return Reflect.get(target, key, receiver)
  }
})
mapProxy.get("name")
```
> Uncaught TypeError: Method Map.prototype.get called on incompatible receiver [object Object]

一盆凉水泼来，报错了。原来 `Map、Set` 对象赋值、取值和他们内部的 this 指向有关系，但这里的 this 指向的是其实是 Proxy 对象，所以得这样干
```
let map = new Map([['name','wangyangyang']])
let mapProxy = new Proxy(map, {
  get(target, key, receiver) {
    var value = Reflect.get(...arguments)
     console.log("取值:",...arguments)
    return typeof value == 'function' ? value.bind(target) : value
  }
})
mapProxy.get("name")
```
当获取的是一个函数的时候，通过作用域绑定的方式将原对象绑定到 `Map、Set` 对象上就好了。
## 相关链接
[皮卡丘搬砖日志](https://github.com/zero7room/blog)

[vue3-first-experience](https://github.com/zero7room/vue3-first-experience)
[Vue Function-based API RFC](https://zhuanlan.zhihu.com/p/68477600)
[vue-next](https://github.com/vuejs/vue-next)

[Composition API](https://vue-composition-api-rfc.netlify.com/api.html#setup)

[开课吧vue3.0公开课](https://www.kaikeba.com/opencourses)   

[探秘 Vue3.0 - Composition API 在真实业务中的尝鲜姿势](https://juejin.im/post/5d6e4986518825267a756a8d#heading-3)   

[茶余饭后聊聊 Vue3.0 响应式数据那些事儿](https://juejin.im/post/5db808e2e51d452a05505af3#heading-3)