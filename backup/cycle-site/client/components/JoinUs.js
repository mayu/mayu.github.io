import xs from 'xstream'
import { div, h1, img, section } from '@cycle/dom'
import { getElementViewport } from '../utils/animation'

const intent = sources => ({
  content$: sources.content,
  viewport$: sources.viewport,
  $joinus$: sources.viewport
    .compose(getElementViewport(sources, '#joinus', 'u-inViewport'))
})

const model = (action) => {
  // action
  //   .$joinus$
  //   .addListener({ next: e => console.log('$joinus$', e) })

  //   action
  //     .viewport$
  //     .addListener({ next: e => console.log('VIEWPORT', e) })

  return xs.combine(
    action.content$
      .map(content => content.joinus),
    action.viewport$,
    action.$joinus$
  )
  .map(([content, viewport, $joinus]) => ({
    joinus: content,
    viewport,
    $joinus
  }))
}

const view = state$ =>
  state$.map(state =>
    section('#joinus.FullViewSection', {}, [
      img('.Hero-image', {
        attrs: {
          src: state.joinus.carousel[0].source
        },
        style: {
          right: state.joinus.carousel[0].position[state.viewport.orientation].x,
          top: state.joinus.carousel[0].position[state.viewport.orientation].y,
          transform: state.$joinus ? `translateY(-${(state.$joinus.top) * 0.2}px)` : '',
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
        } }, state.joinus.title)])])
    ]))


export default sources => ({
  DOM: view(model(intent(sources)))
})
