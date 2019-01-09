# Roll是一个轻量级的页面元素滚动监听js插件，当元素出现在视口时可以执行指定的操作！Roll支持IE8+浏览器。<small style="color: #f90;">(注：该插件借用了<a href="https://github.com/toddmotto/echo" target="_blank">echo.js</a>代码)</small>
> 注意：一个页面最多只能`new`一个实例，因为在`Roll`初始化时给浏览器绑定了`scroll`、`resize`、`laod`事件，如果new 多个实例，则会给浏览器绑定多次相同事件
## Roll用法
```
<body>
    <p class="p1" data-asyncload><img src="images/2.jpg" alt="" /></p>
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <p class="p2" data-asyncload><img src="images/3.jpg" alt="" /></p>
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <p class="p3" data-asyncload><img src="images/4.jpg" alt="" /></p>
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <p class="p4" data-asyncload><img src="images/img1.jpg" alt="" /></p>
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <br /><br /><br /><br /><br /><br /><br />
    <script>
        var roll = new Roll({
          offsetTop: 100
        });
        console.log(roll);
        roll.push(document.querySelector(".p1"), function (context, done){
            console.log('图片1出现在视口，可以执行操作了！');
            done(this, context);
        });
        roll.push(document.querySelector(".p2"), function (context, done){
          console.log('图片2出现在视口，可以执行操作了！');
          done(this, context);
          //roll.destroy();
        });
        roll.push(document.querySelector(".p3"), function (context, done){
          console.log('图片3出现在视口，可以执行操作了！');
          done(this, context);
        });
        roll.push(document.querySelector(".p4"), function (context, done){
          console.log('图片4出现在视口，可以执行操作了！');
          done(this, context);
        });
    </script>
</body>
```
## new Roll(options) options可用参数说明
> `callback`

回调函数。当监听的元素出现在视口时会被执行，并且调用时会传递2个参数给使用者。该函数的this指向当前出现在视口的元素。

    参数一: context

        context 为 Roll 对象实例
    
    参数二: done

        done为一个函数，调用该方法即可停止监听当前元素

> `offsetTop`

设置元素顶部距离视口多少就开始执行回调函数，默认值为0
> `offsetLeft`

设置元素左侧距离视口多少就开始执行回调函数，默认值为0
> `offsetRight`

设置元素右侧距离视口多少就开始执行回调函数，默认值为0
> `offsetBottom`

设置元素底部距离视口多少就开始执行回调函数，默认值为0
## Roll实例方法
> `push(ele, cb, option)`

将元素添加进监听队列，`Roll`在初始化时给浏览器绑定了`scroll`、`resize`、`laod`事件，因此当触发这些事件时都会计算队列中的元素是否出现在视口内，如果出现在视口内则执行回调函数。
1. `ele`：dom元素[必填]
2. `cb`：回调函数[可选]，如果传递了则先执行此回调，再执行全局的回调函数，该函数接收2个参数

    + `context`: Roll对象实例
    + `done`：一个函数，执行该函数则表示不需要再监听当前元素了。done函数用法：`done(当前dom元素, context)`;
3. `options`：可选参数，这个参数里面的值会覆盖`new Roll(options)`中的options值
    
    + `immediate`

        表示元素添加进队列后是否立即执行一遍，默认值为true
    + `offsetTop`
        设置元素顶部距离视口多少就开始执行回调函数，默认值为0
    + `offsetLeft`

        设置元素左侧距离视口多少就开始执行回调函数，默认值为0
    + `offsetRight`

        设置元素右侧距离视口多少就开始执行回调函数，默认值为0
    + `offsetBottom`
        
        设置元素底部距离视口多少就开始执行回调函数，默认值为0
    
> `destroy`

销毁当前`Roll`实例

