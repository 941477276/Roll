;(function (factory){
  if ( typeof define === "function" && define.amd ) {
    define( ["Roll"], factory );
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory( window );
  } else {
    window.Roll = factory( window );
    try{
      if(typeof define === "function"){
        define(function (require){
          return factory(window);
        });
      }
    }catch(e){console.log(e);}
  }
})(function (root) {
  var Roll = function (options){
    options = options || {
      callback: function (){}
    };
    this._init(options);
  };
  Roll._count = 0;
  Roll._count2 = 0;
  //判断元素是否隐藏，只对display: none;的元素有效，visibility: hidden;无效
  Roll.isHidden = function (element) {
    return (element.offsetParent === null);
  };
  //判断元素是否在可视范围之内
  Roll.inView = function (element, view) {
    if (Roll.isHidden(element)) {
      return false;
    }
    var box = element.getBoundingClientRect();
    return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
  };
  // 计算offset值
  Roll.optionToInt = function (opt, fallback) {
    return parseInt(opt || fallback, 10);
  };

  Roll.prototype._init = function (opts) {
    opts = opts || {};
    this.offset = undefined;
    this.pollTimer = undefined;
    this.delay = undefined;
    this.useDebounce = undefined;
    //this.callback = undefined;
    this.id = "LYN_roll_";
    this.options = opts;

    var that = this,
      offsetAll = opts.offset || 0,
      offsetVertical = opts.offsetVertical || offsetAll,
      offsetHorizontal = opts.offsetHorizontal || offsetAll;
    this.offset = {
      t: Roll.optionToInt(opts.offsetTop, offsetVertical),
      b: Roll.optionToInt(opts.offsetBottom, offsetVertical),
      l: Roll.optionToInt(opts.offsetLeft, offsetHorizontal),
      r: Roll.optionToInt(opts.offsetRight, offsetHorizontal)
    };
    this.delay = Roll.optionToInt(opts.throttle, 100);
    this.useDebounce = typeof opts.debounce !== 'undefined' ? !!opts.debounce : true;
    // 待执行元素列表
    this.rollEles = [];

    var that = this;
    var eventFn = function (){
      var rollEles = that.rollEles;
      var len = rollEles.length;

      if(len === 0){
        return;
      }
      if(that.useDebounce) {
        clearTimeout(that.pollTimer);
        that.pollTimer = setTimeout(function(){
          for(var i = 0; i < len; i++){
            that.execute(rollEles[i]);
          }
          clearTimeout(that.pollTimer);
        }, that.delay);
      }else{
        for(var i = 0; i < len; i++){
          that.execute(rollEles[i]);
        }
      }
    }

    this._eventFn = eventFn;

    on(root, 'scroll', eventFn);
    on(root, 'resize', eventFn);
    on(root, 'load', eventFn);
  };

  /**
   * 将元素添加进执行队列
   * @param ele dom元素
   * @param executeImmediate 添加进队列后是否立即执行判断
   * @param options 其他参数
   */
  Roll.prototype.push = function (ele, cb, options){
    if(!ele || !ele.nodeName){
      console.error('push方法第一个参数必须是一个dom元素');
      return;
    }
    if(!options){
      options = {};
    }
    if(typeof options.immediate === 'undefined'){
      options.immediate = true;
    }
    if(typeof cb === 'function'){
      options.callback = cb;
    }
    var id = this.id + (++Roll._count2);
    var obj = {
      id: id,
      el: ele,
      options: options
    };
    ele.setAttribute('data-rull-id', id);
    this.rollEles.push(obj);
    if(options.immediate){
      this.execute(obj);
    }
    obj = null;
    return this;
  }

  /**
   * 执行滚动监听
   */
  Roll.prototype.execute = function (rollItem) {
    if(typeof rollItem === 'undefined' || typeof rollItem.el === 'undefined'){
      return;
    }
    var options = this.options,
      offsetAll = options.offset || 0,
      offsetVertical = options.offsetVertical || offsetAll,
      offsetHorizontal = options.offsetHorizontal || offsetAll;
    var that = this,
      elem = rollItem.el,
      elOption = rollItem.options,
      view = {
        l: 0 - that.offset.r,
        t: 0 - that.offset.b,
        b: (root.innerHeight || document.documentElement.clientHeight) + that.offset.t,
        r: (root.innerWidth || document.documentElement.clientWidth) + that.offset.l
      };
    // 优先使用当前元素定义的边界值
    if(typeof elOption.offsetTop !== 'undefined'){
      view.b = (root.innerHeight || document.documentElement.clientHeight) + Roll.optionToInt(elOption.offsetTop, offsetVertical);
    }
    if(typeof elOption.offsetLeft !== 'undefined'){
      view.r = (root.innerWidth || document.documentElement.clientWidth) + Roll.optionToInt(elOption.offsetLeft, offsetHorizontal);
    }
    if(typeof elOption.offsetBottom !== 'undefined'){
      view.t = 0 - Roll.optionToInt(elOption.offsetBottom, offsetVertical);
    }
    if(typeof elOption.offsetRight !== 'undefined'){
      view.l = 0 - Roll.optionToInt(elOption.offsetRight, offsetHorizontal);
    }
    console.log('rollItem in vide', Roll.inView(elem, view), elem, view)
    if (Roll.inView(elem, view)) {
      // 如果用户手动设置停止了，则不再调用回调函数
      if (!elem._done) {
        if(!elem._pause){
          // 先执行自身回调，再执行全局回调
          if(typeof elOption.callback === 'function'){
            elOption.callback.call(elem, this, this.done);
          }
          if(typeof options.callback === 'function'){
            options.callback.call(elem, this, this.done);
          }
        }
      }
    }

    return this;
  };

  // 移除事件绑定
  Roll.prototype.destroy = function () {
    off(root, 'scroll', this._eventFn);
    off(root, 'resize', this._eventFn);
    off(root, 'load', this._eventFn);
    this.offset = null;
    this.options = null;
    this.offset = null;
    // 待执行元素列表
    this.rollEles = null;
    this._eventFn = null;
    clearTimeout(this.pollTimer);
    this.pollTimer = null;
  };

  /**
   * 滚动条滚动时不再监听elem元素，移除后不再执行回调
   * @param elem dom元素
   * @param context Roll对象
   */
  Roll.prototype.done = function (elem, context){
    if(!elem || !elem.nodeName){return;}
    if(!(this instanceof Roll) && !(context instanceof Roll)){
      console.log('检测到done方法内的this不是Roll实例！done(elem, context)方法需要context参数，context参数必须是Roll实例');
      return;
    }else if(!(context instanceof Roll) && (this instanceof Roll)){
      context = this;
    }

    var rollId = elem.getAttribute('data-rull-id');
    var rollEles = context.rollEles;
    var index = getIndex(rollEles, function (item){
      return item.id == rollId;
    });
    if(index > -1){
      // 移除Roll对象，以免占用内存
      rollEles.splice(index, 1);
    }
    console.log('完成操作')
    elem._done = true;
    elem.setAttribute('data-done', 'true');
    elem = null;
  };

  /**
   * 获取数组中符合条件的元素的索引
   * @param arr 数组
   * @param fn 一个函数，如果函数返回true，则返回该项的下标，如果没有找到则返回-1
   */
  function getIndex (arr, fn) {
    if (!arr || arr.length === 0 || !fn || (typeof fn !== 'function')) {
      return -1;
    }

    if (arr.findIndex) {
      return arr.findIndex(fn);
    }
    var len = arr.length;
    var i = 0;
    var index = -1;
    for (; i < len; i++) {
      var item = arr[i];
      if (fn(item, index, arr) === true) {
        index = i;
        break;
      }
    }
    return index;
  }
  /**
   * 绑定事件
   * @param ele dom元素
   * @param eventName 事件名称
   * @param fn 事件回调函数
   */
  function on(ele, eventName, fn) {
    if (!ele) {
      console.error('on(ele, eventName, fn)函数第一个参数必须是一个dom元素!');
      return this;
    }
    if (!eventName || typeof eventName !== 'string') {
      console.error('on(ele, eventName, fn)函数第二个参数必须是一个字符串!');
      return this;
    }
    if (!fn || typeof fn !== 'function') {
      console.error('on(ele, eventName, fn)函数第三个参数必须是一个函数!');
      return this;
    }
    if (!ele._events) {
      ele._events = {};
    }

    if (!(eventName in ele._events)) {
      ele._events[eventName] = [fn];
      if (document.addEventListener) {
        var eventFn = function (e) {
          var events = ele._events[eventName];
          if (events && events.length > 0) {
            for (var i = 0, len = events.length; i < len; i++) {
              if (events[i]) {
                events[i].call(ele, e);
              }
            }
          }
        };
        ele.addEventListener(eventName, eventFn, false);
        // 把事件回调函数也存起来，这样在移除事件的时候才能真正的把该事件移除掉
        ele._events[eventName + '_fn'] = eventFn;
      } else if (window.attachEvent) {
        var eventFn = function () {
          var events = ele._events[eventName];
          var e = window.event;
          e.preventDefault = function () {
            e.returnValue = false;
          };
          e.stopPropagation = function () {
            e.cancelBubble = true;
          };
          for (var i = 0, len = events.length; i < len; i++) {
            events[i].call(ele, e);
          }
        };
        ele.attachEvent('on' + eventName, eventFn);
        ele._events[eventName + '_fn'] = eventFn;
      }
    } else {
      //ele._events[eventName] = [fn];
      var index = this.getIndex(ele._events[eventName], function (item) {
        return item === fn;
      });
      if (index < 0 || typeof index === 'undefined') {
        ele._events[eventName].push(fn);
      }
    }
    return this;
  };
  /**
   * 解绑事件
   * @param ele dom元素
   * @param eventName 事件名称
   * @param fn 事件回调函数
   */
  function off(ele, eventName, fn) {
    if (!ele) {
      console.error('off(ele, eventName, fn)函数第一个参数必须是一个dom元素!');
      return;
    }
    if (!eventName || typeof eventName !== 'string') {
      console.error('off(ele, eventName, fn)函数第二个参数必须是一个字符串!');
      return;
    }
    if (!ele._events) {
      return this;
    }
    if (!eventName) {
      return this;
    }
    console.log('off', eventName, ele);
    var events = ele._events[eventName];
    var eventFn = ele._events[eventName + '_fn'];
    // 如果只传递了事件名称而未传递具体的事件，则将指定事件名称的所有回调函数全部清除
    if (eventName && !fn) {
      if (document.removeEventListener) {
        //for(var i = 0, len = events.length; i < len; i++){
        ele.removeEventListener(eventName, eventFn, false);
        //}
      } else if (window.detachEvent) {
        //for(var i = 0, len = events.length; i < len; i++){
        ele.detachEvent('on' + eventName, eventFn);
        //}
      }
      delete ele._events[eventName];
      delete ele._events[eventName + '_fn'];
    } else if (eventName && fn) {
      if (!events) {
        return;
      }
      if (document.removeEventListener) {
        var index = this.getIndex(events, function (item) {
          return item === fn;
        });
        if (index > -1) {
          events.splice(index, 1);
        }
        if (events.length === 0) {
          delete ele._events[eventName];
          delete ele._events[eventName + '_fn'];
        }
      } else if (window.detachEvent) {
        if (!events) {
          return;
        }
        var index = this.getIndex(events, function (item) {
          return item === fn;
        });
        if (index > -1) {
          events.splice(index, 1);
        }
        if (events.length === 0) {
          delete ele._events[eventName];
          delete ele._events[eventName + '_fn'];
        }
      }
    }
    events = null;
    return this;
  };

  return Roll;
});
