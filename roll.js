;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.roll = factory(root);
  }
})(this, function (root) {
  'use strict';

  function roll(el,options){
    return new Roll(el,options);
  }

  var Roll = function (el,options){
    if(!el || !el.nodeName){throw "必须传递一个元素！";}
    options = options || {
      callback: function (){}
    };
    this._init(el,options);
  };
  Roll._count = 0;
  Roll._count2 = 0;
  Roll.eventBinded = false;
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
  //存储所有Roll的上下文对象（即this）
  Roll.prototype.contexts = [];
  Roll.prototype.debounceOrThrottle = function (context) {
    context = context || this;
    if(!context.useDebounce && !!context.poll) {
      return;
    }
    clearTimeout(context.poll);
    context.poll = setTimeout(function(){
      context.render();
      context.poll = null;
    }, context.delay);
  };
  
  Roll.prototype._init = function (el,opts) {
    opts = opts || {};
    this.offset = undefined;
    this.poll = undefined;
    this.delay = undefined;
    this.useDebounce = undefined;
    this.callback = undefined;
    this.el = el;
    this.id = "LYN_" + new Date().getTime() + (Roll._count2++);
    Roll._count++;

    var that = this,
        offsetAll = opts.offset || 0,
        offsetVertical = opts.offsetVertical || offsetAll,
        offsetHorizontal = opts.offsetHorizontal || offsetAll,
        optionToInt = function (opt, fallback) {
          return parseInt(opt || fallback, 10);
        };
    this.offset = {
      t: optionToInt(opts.offsetTop, offsetVertical),
      b: optionToInt(opts.offsetBottom, offsetVertical),
      l: optionToInt(opts.offsetLeft, offsetHorizontal),
      r: optionToInt(opts.offsetRight, offsetHorizontal)
    };
    this.delay = optionToInt(opts.throttle, 200);
    this.useDebounce = opts.debounce !== false;
    this.callback = opts.callback;
    
    this.render();
    
    this.contexts.push({
      id: this.id,
      context: this
    });

    //避免多次绑定同一事件
    if(!Roll.eventBinded){
      if (document.addEventListener) {
        
        root.addEventListener('scroll', (function (context){
          return eventFn
        })(this), false);
        root.addEventListener('resize', (function (context){
            return eventFn
        })(this), false);
        root.addEventListener('load', (function (context){
            return eventFn
        })(this), false);
      } else {
        root.attachEvent('onscroll', (function (context){
            return eventFn
        })(this));
        root.attachEvent('onresize', (function (context){
            return eventFn
        })(this));
        root.attachEvent('onload', (function (context){
            return eventFn
        })(this));
      }
      Roll.eventBinded = true;
    }
  };

  Roll.prototype.render = function () {
    var that = this,
        elem = this.el,
        view = {
          l: 0 - that.offset.l,
          t: 0 - that.offset.t,
          b: (root.innerHeight || document.documentElement.clientHeight) + that.offset.b,
          r: (root.innerWidth || document.documentElement.clientWidth) + that.offset.r
        };
    if (Roll.inView(elem, view)) {
      //如果用户手动设置停止了，则不再调用回调函数
      if (!elem._done) {
        if(!elem._pause){
          this.callback.call(elem, this, Roll.pause, Roll.done);  
        }
      }
    }

    if (Roll._count <= 0) {
      this.detach();
    }
  };
  //移除事件绑定
  Roll.prototype.detach = function () {
    if (document.removeEventListener) {
      root.removeEventListener('scroll', eventFn);
      root.removeEventListener('resize', eventFn);
    } else {
      root.detachEvent('onscroll', eventFn);
      root.detachEvent('onresize', eventFn);
    }
    clearTimeout(this.poll);
  };
  //调用该方法会移除传入的元素的data-Roll属性，移除该属性后就不会再执行传入的回调了
  Roll.done = function (elem){
    if(!elem || !elem.nodeName){return;}
    elem._done = true;
    Roll._count--;
  }
  /*暂停执行回调
    当拖动滚动条并且页面元素已经在视口时，再次拖动滚动条依然会触发callback回调函数，如果回调函数执行的是ajax操作
    那么就会导致发送了多个请求，这样是不好的，因此pause就是为了解决这个问题而产生的。
  */
  Roll.pause = function (elem, flag){
    if(!elem || !elem.nodeName){return;}
    if(flag == undefined){return;}
    elem._pause = !!flag; 
  }

  function eventFn(){
      var contexts = Roll.prototype.contexts;
      /*每个Roll对象都有自己的render、debounceOrThrottle等方法、offset、poll、delay、el等属性，所以在scroll、onload事件中
      最重要的是执行debounceOrThrottle该方法，而该方法中使用了Roll对象自己的render、debounceOrThrottle等，因此就在调用时的调用者就必须是
      Roll对象*/
      for(var i = 0,len = Roll.prototype.contexts.length; i < len; i ++){
        Roll.prototype.debounceOrThrottle.call(contexts[i].context);
      }
  }

  return roll;
});
