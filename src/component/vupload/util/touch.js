
window.requestAnimFrame = (function () {
   return function (callback) {
      window.setTimeout(callback, 6000 / 60);
   };
})();

(function() {
  var root = this
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(arg) {
      var self = this
      return function() {
        if (!arg) return 
        return self.call(arg, null)
      }    
    }
  }

  function touch(option) {
    //if (!option.el) return
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
    this.wt = window.innerWidth
    this.max = 0
    this.sx = 0
    this.el = option.el
    this.flag = null
    this.trans = 0
  }

  touch.prototype = {
    remveEvent: function() {
      this.el.removeEventListener('touchstart', this.touchStart, false)
      this.el.removeEventListener('touchmove', this.touchMove, false)
      this.el.removeEventListener('touchend', this.touchEnd, false)
      return this
    },
    init: function() {
      this.max = this.wt * (this.el.querySelectorAll('img').length - 1)
      this.el.addEventListener('touchstart', this.touchStart, false)
      this.el.addEventListener('touchmove', this.touchMove, false)
      this.el.addEventListener('touchend', this.touchEnd, false)
    },
    touchStart: function() {
      var event = window.event || event
      var target = event.target
      if (target.nodeName !== "A" || target.nodeName !== "INPUT") {
        var touching = event.touches[0]
        this.sx = touching.clientX
  
        this.trans = touch.transform(this.el) || 0
        event.preventDefault()
      }
    },
    touchMove: function() {
      var event = window.event || event
      var target = event.target
      if (target.nodeName !== "A" || target.nodeName !== "INPUT") {
        var touching = event.touches[0]
        var mx = touching.clientX 
        this.move = this.sx - mx + Math.abs(this.trans)

        this.el.style['WebkitTransform'] = 'translate3d('+ (0 - this.move) +'px, 0, 0)'
        this.flag = this.move > 0 ?  1 : 2
        event.preventDefault()
      }
    },
    touchEnd: function() {
      var event = window.event || event
      var target = event.target
      var f
      var touching = event.changedTouches[0]
      var mx = touching.clientX 
      if (this.sx === mx) {
        this.el['click']()
        this.remveEvent()
        return
      }
      
      if (target.nodeName !== "A" || target.nodeName !== "INPUT") {
        var move = touch.transform(this.el)
        var cache = move
        f = Math.round(Math.abs(move) / this.wt)
        move = f * this.wt
        if (!move || (this.trans === 0 && cache > 0)) {
          this.el.style['WebkitTransform'] = 'translate3d('+ 0 +'px, 0, 0)'
          return
        }
        if (move >= this.max) {
          this.el.style['WebkitTransform'] = 'translate3d('+ (0 - this.max) +'px, 0, 0)'
          return
        }
        touch.animation(move, this.trans, this.el)
        event.preventDefault()
      }  
    }
  }

  touch.animation = function(end, trans, el) {
    var k = (end - trans) / 1000,
        x = 1
    animation(trans, end, k, x, el)
  }
  touch.transform = function(el) {
    var trans = el.style['WebkitTransform']
    if (!trans) return
    return Math.round(/translate3d\((([+-])?\d+)/.exec(trans)[1])
  }
  
  function animation(trans, end, k, x, el) {
    var move = trans + k * x
    if (move > end) return
    x++
    el.style['WebkitTransform'] = 'translate3d('+ (0 - move) +'px, 0, 0)'
    return requestAnimFrame(animation(trans, end, k, x, el))
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = touch
    }
    exports.touch = touch
  } else {
    root.touch = touch
  }

  if (typeof define === 'function' && define.amd) {
    define('touch', [], function () {
      return touch
    })
  }
}.call(this))