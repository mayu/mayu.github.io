/* global window document r*/
import xs from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import throttle from 'xstream/extra/throttle'
import debounce from 'xstream/extra/debounce'
import dropRepeats from 'xstream/extra/dropRepeats'

/*
  Detect when section is in viewport
*/

  function onViewportToggle(entry) {
    entry.forEach((change) => {
      change.target.classList.toggle('u-inViewport')
    })
  }

  // list of options
  const options = {
    threshold: [0]
  }

  const observer = new IntersectionObserver(onViewportToggle, options)

  setTimeout(() => {
    const elements = document.querySelectorAll('section')

    // loop through all elements
    // pass each element to observe method
    // ES2015 for-of loop can traverse through DOM Elements
    for (let elm of elements) {
      observer.observe(elm)
    }
  }, 0)


export default function () {
  // Orientation

  const orientation$ = xs.merge(
    fromEvent(window, 'resize'),
    fromEvent(window, 'orientationchange')
  )
    .compose(throttle(100))
    .map(() => (
      window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape'
    ))
    .compose(dropRepeats())
    .startWith((window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape')

  // Scroll
  const scrollThrottled$ = fromEvent(window, 'scroll')
  .compose(throttle(16))

  const scrollDebounced$ = scrollThrottled$
    .compose(debounce(200))

  const scroll$ = xs.merge(scrollThrottled$, scrollDebounced$)
    .map(() => ({
      scrollTop: parseFloat(window.scrollY.toFixed(2)),
      total: window.innerHeight
    }))
    .startWith({})

  const ready$ = fromEvent(document, 'DOMContentLoaded')
    .map(() => true)
    .startWith(false)

  return () => xs.combine(orientation$, scroll$, ready$)
    .map(([orientation, scroll, ready]) => ({
      orientation,
      scroll,
      ready
    }))
    .startWith({ ready: false }) // force dom to not be ready at first.
}
