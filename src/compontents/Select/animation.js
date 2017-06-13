export default (el, cb) => {
  let obj = cb && cb(),
      k = 0, 
      posY1 = !obj.cssStart ? 0 : Math.ceil(obj.cssStart.match(/-?\d+/)[0]),
      posY2 = Math.ceil(obj.cssText.match(/-?\d+/)[0]),
      i = 0,
      y = 0
  k = (posY2 / obj.timer).toFixed(3)
  return animation(k, obj.timer, posY1, el, i, y) 
}

function animation(k, timer, posY1, el, i, y) {
  if (i > timer) return y
  y = k * i
  el.style.cssText = "-webkit-transform: translateY(" + Math.ceil(y) + "px)"
  i++
  return animation(k, timer, posY1, el, i, y)
}