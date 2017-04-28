import xs from 'xstream'
import { div, h1, img, section } from '@cycle/dom'
import { getElementViewport } from '../utils/animation'

const intent = sources => ({
  content$: sources.content,
  viewport$: sources.viewport,
  $signup$: sources.viewport
    .compose(getElementViewport(sources, '#signup', 'u-inViewport'))
})

const model = (action) => {
  // action
  //   .$signup$
  //   .addListener({ next: e => console.log('$signup$', e) })
  //
  //   action
  //     .viewport$
  //     .addListener({ next: e => console.log('VIEWPORT', e) })

  return xs.combine(
    action.content$
      .map(content => content.signup),
    action.viewport$,
    action.$signup$
  )
  .map(([content, viewport, $signup]) => ({
    signup: content,
    viewport,
    $signup
  }))
}

const view = state$ =>
  state$.map(state =>
    section('#signup.FullViewSection', {}, [
      img('.Hero-image', {
        attrs: {
          src: state.signup.carousel[0].source
        },
        style: {
          right: state.signup.carousel[0].position[state.viewport.orientation].x,
          top: state.signup.carousel[0].position[state.viewport.orientation].y,
          transform: state.$signup ? `translateY(-${(state.$signup.top) * 0.2}px)` : '',
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
        } }, state.signup.title)])])
    ]))


export default sources => ({
  DOM: view(model(intent(sources)))
})
