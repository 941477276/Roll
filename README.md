#Roll

 Roll是一个轻量级的页面元素出现在视口时执行指定操作的js插件！Roll支持IE8+浏览器。<small style="color: #f90;">(注：该插件借用了<a href="https://github.com/toddmotto/echo" target="_blank">echo.js</a>代码)</small>

###Roll用法

    <!DOCTYPE html>
    <html lang="en">
    <head>

        <meta charset="UTF-8" />
        <title>Document</title>
        <style>
            body,p{margin: 0;padding: 0;}
        </style>
        <script src="roll.js"></script>
    </head>
    <body>
        <p class="p1">我是第一个p标签</p>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <p class="p2">我是第二个p标签</p>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <p class="p3">我是第三个p标签</p>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <p class="p4">我是第四个p标签</p>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <script>
            roll(document.querySelector(".p3"),{
                callback: function (obj, pause, done){
                    console.log(this);//这个this指向 .p3 这个元素
                    console.log("我出现在视口了！");
                    var that = this;
        
                    setTimeout(function (){
                        /*调用done()方法后，当该元素再次出现在视口时不会再执行callback回调函数了！*/
                        done(that);
                    }, 3000);
                }
            });
        </script>
    </body>
    </html>

###roll(dom,options)
#####dom
Type: <code>dom object</code>  Default: <code>undefined</code>
<code>dom</code>参数必须为一个dom对象，该参数为必填参数，如果未传递该参数则会自己抛出异常
#####options
Type: <code>object</code> Default: <code>{}</code>
######callback
Type: <code>function</code>  Default: <code>function (){}</code>
callback为回调函数，当元素出现在视口时会调用该函数并传递三个参数：<code>obj</code>、<code>pause</code>、<code>done</code>
>● obj

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;该参数为Roll对象实例，Roll使用了工厂模式，每调用一次roll()方法就好会创建一个Roll实例.
>● pause

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;该参数为一个函数，调用该方法可以暂时停止调用callback，该方法当你在用用ajax请求数据时可以调用，如果不调用它则会出现拖动滚动条时回调函数执行多遍，这样就造成了请求发送了多次的问题。该方法接收两个参数，参数一为当前dom元素对象，参数二为Boolean值，如果值为true则暂停，值为false则取消暂停。取消后当元素再次出现在视口时回调函数又会被调用。
>● done

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;该参数为一个函数，调用该方法将结束监听该元素，此后不该元素再次出现在视口时将不再调用回调函数。该方法必须传递一个元素进去。
######offset

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置上下左右距离视口到多少就开始执行回调，默认为0，即只会执行出现在视口的元素的回调函数
######throttle

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;元素出现在视口后延迟多少毫秒执行回调函数
######offsetVertical

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;垂直方向距离视口多少就开始执行回调函数，默认值为0
######offsetHorizontal

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;水平方向距离视口多少就开始执行回调函数，默认值为0
######offsetTop

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;顶部方向距离viewport多少就开始执行回调函数，默认值为offsetVertical
######offsetButton

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;底部方向距离viewport多少就开始执行回调函数，默认值为offsetVertical
######offsetLeft

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;左边方向距离viewport多少就开始执行回调函数，默认值为offsetHorizontal
######offsetRight

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;右边方向距离viewport多少就开始执行回调函数，默认值为ooffsetHorizontal