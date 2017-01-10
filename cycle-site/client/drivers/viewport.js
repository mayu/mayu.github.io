/* global window */
import xs from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import throttle from 'xstream/extra/throttle'
import dropRepeats from 'xstream/extra/dropRepeats'

export default function () {
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

  return () => xs.combine(orientation$)
    .map(([orientation]) => ({
      orientation
    }))
}
