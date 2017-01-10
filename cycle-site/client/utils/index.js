/* global window */

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
