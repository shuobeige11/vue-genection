import Scroller from './Scroller'

export default class _touch {
  constructor (el) {
    this.parent = el.parElement
    this.element = el.element
    this.sub = el.subElement
    this.subElement = null
    this.active = el.active
    this.fn = el.fn || ''
    this.pos = el.pos || 0
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.scroller = null
    this.flag = false
    this.init()
  }

  reflow() {
     this.scroller.setDimensions(this.parent.clientWidth, this.parent.clientHeight, this.element.offsetWidth, this.element.offsetHeight)
     let rect = this.parent.getBoundingClientRect();
     this.scroller.setPosition(rect.left + this.parent.clientLeft, rect.top + this.parent.clientTop);
  }

  scrollingComplete() {
    this.flag = false
    let box = this.element.querySelectorAll('dd') 
    let _zscroller$scroller$g = this.scroller.getValues(),
        top = _zscroller$scroller$g.top
    let subElement = this.element.querySelectorAll(this.sub)
    let n = (top/this.elHeight).toFixed(1)
    let t = Math.round(top/this.elHeight)
    if (t < 0) {
      t = 0
    } else if (t > subElement.length - 1) {
      t = subElement.length - 1
    }
    let tops = t * this.elHeight
    setTimeout(() => {
      for (let i = 0; i < box.length; i++) {
        box[i].setAttribute('class', '')
      }
      this.scroller.scrollTo(0, tops, 1, undefined, this.fn && this.fn(this.scroller, subElement[t]))
    }, 30)
  }
  
  init () {
    
    let endMove = 0,
        sum = 0
    
    setTimeout(() => {  
      let subElement = this.element.querySelectorAll(this.sub)
      this.elHeight = Math.ceil(subElement[0].clientHeight)
      //this.element.style['height'] = this.element.clientHeight + (4 * this.elHeight) + 'px'
      this.element.style.cssText ='padding: ' + this.elHeight + 'px ' + '0 ' + (4 * this.elHeight) + 'px ' + '0'
      //this.element.style['paddingBottom'] =  (2 * this.elHeight) + 'px'
      for (let i = 0; i < this.pos; i++) {
        sum += this.elHeight
      }
      //this.parent.style['marginTop'] = (0 - sum) + 'px'
      //const renders = render(window, this.element, sum)
      this.translateY = sum
      let _this = this
      this.scroller = new Scroller(function(left, top, zoom) {
        _this.element.style['WebkitTransform'] = 'translate3d(0px, '+ (0 - top) +'px, 0) scale(1)'
      }, {
        scrollingX: false,
        paging: false,
        penetrationDeceleration: .1,
        minVelocityToKeepDecelerating: 0.5,
        scrollingComplete: () => { if (this.flag) { this.scrollingComplete() }}
      });

      this.reflow()
      if (this.pos > 0 && this.pos < subElement.length && this.elHeight) {
          this.scroller.scrollTo(0, sum)
      }
      subElement[this.pos].setAttribute('class', this.active)

    }, 1)

    this.parent.addEventListener('touchstart',this.handleTouchStart, false)
    this.parent.addEventListener('touchmove', this.handleTouchMove, false)
    this.parent.addEventListener('touchend', this.handleTouchEnd, false)
  }

  handleTouchStart () {
    let box = this.element.querySelectorAll('dd')
    for (let i = 0; i < box.length; i++) {
      box[i].setAttribute('class', '')
    }
    let event = window.event || event
    let target = event.target
    if (target.nodeName !== "A" || target.nodeName !== "INPUT") {
      let touching = event.touches[0]
      this.reflow()
      this.scroller.doTouchStart(event.touches, event.timeStamp)
      event.preventDefault()
    }
    return false
  }

  handleTouchMove () {
    let event = window.event || event
    let target = event.target
    if (target.nodeName !== "A" || target.nodeName !== "INPUT") {
      this.scroller.doTouchMove(event.touches, event.timeStamp)
      event.preventDefault()  
    }
    return false
  }

  handleTouchEnd () {
    this.flag = true
    let event = window.event || event
    let target = event.target
      if (target.nodeName !== "A" || target.nodeName !== "INPUT") {
        this.scroller.doTouchEnd(event.timeStamp)
        event.preventDefault()
      }
    return false
  }
}