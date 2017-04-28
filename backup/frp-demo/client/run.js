/* global document window */
import Kefir from 'kefir'

const sliderClickStart$ = Kefir
  .fromEvents(document.querySelector('#slider'), 'mousedown')

const sliderClickEnd$ = Kefir
  .fromEvents(document, 'mouseup')

const mouseMoved$ = Kefir
  .fromEvents(document, 'mousemove')
  .throttle(10)

const sliderDragged$ = sliderClickStart$
  .flatMap(() => mouseMoved$
    .takeUntilBy(sliderClickEnd$)
  )
  .map(e => parseInt((e.clientX / e.screenX)*100))

const keyboardPressed$ = Kefir
  .fromEvents(window, 'keyup')

const slideLeft$ = keyboardPressed$
  .filter(e => e.code === 'ArrowLeft')
  .map(e => parseInt(e.target.querySelector('#slider').style.left) || 0)

const slideRight$ = keyboardPressed$
  .filter(e => e.code === 'ArrowRight')
  .map(e => parseInt(e.target.querySelector('#slider').style.left) || 0)

slideLeft$.log()
slideRight$.log()

const slideRightChanged$ = slideRight$
  .map(leftPosition => leftPosition + 1)

const slideLeftChanged$ = slideLeft$
  .map(leftPosition => leftPosition - 1)

const sliderChanged$ = Kefir.merge([
  slideRightChanged$,
  slideLeftChanged$,
  sliderDragged$
])

sliderChanged$.onValue((leftPosition) => {
  document.querySelector('body').style.background = `rgba(0,0,0,${leftPosition/100})`
  document.querySelector('#slider').style.left = `${leftPosition}vw`
})
