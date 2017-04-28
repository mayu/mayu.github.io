/* global window document */

// Listen for orientation changes
let orientation = (window.innerHeight > window.innerWidth) ? 'portrait'
: 'landscape'

window.addEventListener('orientationchange', () => {
  orientation = window.matchMedia('(orientation: portrait)').matches ? 'portrait'
  : 'landscape'
}, false)

export function getOrientation() {
  return orientation
}

export function getTime() {
  return Date.now()
}

export function isElementInViewport(el) {
  if (document.hidden) return false

  const rect = el.getBoundingClientRect()
  console.log(rect)
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export function shouldAnimate(id) {
  const $el = document.getElementById(id.substr(0, 1) === '#' ? id.substr(1, id.length + 1) : id)
  const inViewport = $el ? isElementInViewport($el) : false
  console.log(inViewport)
}
