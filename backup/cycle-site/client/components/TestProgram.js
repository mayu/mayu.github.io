import xs from 'xstream'
import { div, h1, img, section } from '@cycle/dom'
import { getElementViewport } from '../utils/animation'

const intent = sources => ({
  content$: sources.content,
  viewport$: sources.viewport,
  $testprogram$: sources.viewport
    .compose(getElementViewport(sources, '#testprogram', 'u-inViewport'))
})

const model = (action) => {
  // action
  //   .$testprogram$
  //   .addListener({ next: e => console.log('$testprogram$', e) })
  //
  //   action
  //     .viewport$
  //     .addListener({ next: e => console.log('VIEWPORT', e) })

  return xs.combine(
    action.content$
      .map(content => content.testprogram),
    action.viewport$,
    action.$testprogram$
  )
  .map(([content, viewport, $testprogram]) => ({
    testprogram: content,
    viewport,
    $testprogram
  }))
}

const view = state$ =>
  state$.map(state =>
    section('#testprogram.FullViewSection', {}, [
      img('.Hero-image', {
        attrs: {
          src: state.testprogram.carousel[0].source
        },
        style: {
          right: state.testprogram.carousel[0].position[state.viewport.orientation].x,
          top: state.testprogram.carousel[0].position[state.viewport.orientation].y,
          transform: state.$testprogram ? `translateY(-${(state.$testprogram.top) * 0.2}px)` : '',
          opacity: state.viewport.ready ? '1' : '0'
        }
      }),
      div('.Grid.u-Full', {
        style: {
        }
      }, [div('.Col.Hero-title-col', [
        h1('.Hero-title', { style: {
          transition: 'opacity 0.3s linear 1.3s',
          opacity: state.viewport.ready ? '1' : '0',
          transform: `-translateY(${state.viewport.scroll.scrollTop * 1}px)`
        } }, state.testprogram.title)])])
    ]))


export default sources => ({
  DOM: view(model(intent(sources)))
})
