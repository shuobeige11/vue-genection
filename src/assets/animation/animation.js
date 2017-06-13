export default (el, cb) => {
  
  let obj = cb && cb();

  let k = 0, 
      posY1 = !obj.cssStart ? 0 : Math.floor(obj.cssStart.match(/-?\d+(px)/)[0].split('px')[0]),
      posY2 = Math.floor(obj.cssText.match(/-?\d+(px)/)[0].split('px')[0]),
      i = 0,
      y = 0
  posY2 = posY2 || 10
  k = (posY2 / obj.timer).toFixed(3)
  return animation(k, obj.timer, posY1, el, i, y) 
}

function animation(k, timer, posY1, el, i, y) {
  
  if (i > timer) return y
  y = k * i
  setTimeout(() => {
    if (Math.floor(y) == 9) y = 0
    el.style.cssText = "-webkit-transition-duration: 0ms; -webkit-transform: translate3d(" + Math.floor(y) + "px, 0, 0);"
  }, 1)
  i++
  return animation(k, timer, posY1, el, i, y)
}