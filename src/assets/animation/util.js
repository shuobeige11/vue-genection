import animation from './animation'

export default class _touch {
  constructor (el) {
    this.element = el.element
    this.sub = el.subElement
    this.subElement = null
    this.active = el.active
    this.fn = el.fn || ''
    this.pos = el.pos || 0
    this.startX = null//定义手指滑动前坐标
    this.curX = null//定义手指滑动后坐标
    this.flag = null//定义滑动对象滑动方向标记位
    this.countSrceen = 0//定义滑动屏数
    this.translateX = 0 //当前滚动距离
    this.moveX = 0 // touchmove 事件实际移动距离
    this.elHeight = 0 // 移动元素的高度
    this.posStart = 0
    this.all = 0
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)

    this.init()
  }

  init () {
    this.element.removeEventListener('touchstart',this.handleTouchStart, false)
    this.element.removeEventListener('touchmove', this.handleTouchMove, false)
    this.element.removeEventListener('touchend', this.handleTouchEnd, false)
    let box = this.element.querySelectorAll('dd')
    for (let i = 0; i < box.length; i++) {
      box[i].setAttribute('class', '')
    }
    let endMove = 0,
        sum = 0
    setTimeout(() => {
      let subElement = this.element.querySelectorAll(this.sub)
      this.elHeight = window.innerWidth
      
      for (let i = 0; i < this.pos; i++) {
        sum += this.elHeight
      }
      for (let i = 0; i < 12; i++) {
        this.all += this.elHeight
      }
      sum = 0 - sum
      this.translateX = sum
      subElement[this.pos].setAttribute('class', 'active')
      this.element.style.cssText = '-webkit-transform: translate3d(' + sum + 'px, 0, 0);' 
    }, 1)
    this.element.addEventListener('touchstart',this.handleTouchStart, false)
    this.element.addEventListener('touchmove', this.handleTouchMove, false)
    this.element.addEventListener('touchend', this.handleTouchEnd, false)
  }

  handleTouchStart () {
    this.subElement = this.element.querySelectorAll(this.sub)
    let event = window.event || event
    let target = event.target
    this.flag = null;
    if (target.nodeName !== "A" || target.nodeName !== "INPUT") {
      let touching = event.touches[0]
      this.startX = touching.clientX
      this.curX = 0
      event.preventDefault()
    }
    return false
  }

  handleTouchMove () {
    let event = window.event || event
    let target = event.target
    if (target.nodeName !== "A" || target.nodeName !== "INPUT") {
        let touching = event.touches[0],
            ls
        this.curX = touching.clientX
        ls = this.startX - this.curX
        this.moveX = this.translateX - ls
        console.log(this.element.style.cssText)
        animation(this.element, () => {
          return {
            cssText: "-webkit-transform: translate3d(" + Math.floor(this.moveX) + "px, 0, 0);",
            cssStart: this.element.style.cssText,
            timer: 100
          }
        })
    }
    return false
  }

  handleTouchEnd () {
    let event = window.event || event
    let target = event.target
    if (target.nodeName !== "A" || target.nodeName !== "INPUT") {
      let len = this.subElement.length - 1,
          sum,
          endMove
      sum = endMove = 0
      
      if (len > 0) {
        this.countSrceen = 0 - Math.floor(this.moveX / this.elHeight)

        if (this.countSrceen < 0) this.countSrceen = 0
        if (this.countSrceen > len) this.countSrceen = len - 1
        for (let i = 0; i < this.countSrceen; i++) {
          sum += this.elHeight
        }
        endMove = 0 - sum
        this.element.style.cssText = "-webkit-transform: translate3d(" + (endMove) + "px, 0, 0);"
        this.translateX = endMove
        this.subElement[this.countSrceen].setAttribute('class', this.active)
        for (let i = 0; i < this.subElement.length; i++) {
          if (i != this.countSrceen) this.subElement[i].setAttribute('class', '')
        }
        if (typeof this.fn == 'function') {
          this.fn(this.countSrceen)
        }
      } else {
         this.element.style.cssText = "-webkit-transform: translate3d(0, 0, ); "
      }

      this.element.setAttribute('data-pos', this.countSrceen)
      this.curX = null
      this.startX = null
      this.moveX = null
    }
    return false
  }
}