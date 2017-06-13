import animation from './animation'

export default class _touch {
  constructor (el) {
    this.element = el.element
    this.sub = el.subElement
    this.subElement = null
    this.active = el.active
    this.fn = el.fn || ''
    this.pos = el.pos || 0
    this.startY = null//定义手指滑动前坐标
    this.curY = null//定义手指滑动后坐标
    this.flag = null//定义滑动对象滑动方向标记位
    this.countSrceen = 0//定义滑动屏数
    this.translateY = 0 //当前滚动距离
    this.moveY = 0 // touchmove 事件实际移动距离
    this.elHeight = 0 // 移动元素的高度
    this.posStart = 0
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
        sum = 0;
    setTimeout(() => {
      let subElement = this.element.querySelectorAll(this.sub)
      
      this.elHeight = Math.ceil(subElement[0].clientHeight)
      for (let i = 0; i < this.pos; i++) {
        sum += this.elHeight
      }
      sum = 0 - sum
      this.element.style.cssText = "-webkit-transform: translateY(" + sum + "px)"
      this.translateY = sum
      subElement[this.pos].setAttribute('class', 'active')
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
      this.startY = touching.clientY
      this.curY = 0
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
        this.curY = touching.clientY
        ls = this.startY - this.curY
        this.moveY = this.translateY - ls

        animation(this.element, () => {
          return {
            cssText: "-webkit-transform: translateY(" + Math.ceil(this.moveY) + "px)",
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
        this.countSrceen = 0 - Math.ceil(this.moveY / this.elHeight)

        if (this.countSrceen < 0) this.countSrceen = 0
        if (this.countSrceen > len) this.countSrceen = len - 1
        for (let i = 0; i < this.countSrceen; i++) {
          sum += this.elHeight
        }
        endMove = 0 - sum
        this.element.style.cssText = "-webkit-transform: translateY(" + (endMove) + "px)"
        this.translateY = endMove
        this.subElement[this.countSrceen].setAttribute('class', this.active)
        for (let i = 0; i < this.subElement.length; i++) {
          if (i != this.countSrceen) this.subElement[i].setAttribute('class', '')
        }
        if (typeof this.fn == 'function') {
          this.fn()
        }
      } else {
         this.element.style.cssText = "-webkit-transform: translateY(0px)"
      }

      this.element.setAttribute('data-pos', this.countSrceen)
      this.curY = null
      this.startY = null
      this.moveY = null
    }
    return false
  }
}