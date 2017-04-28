import xs from 'xstream'
import { div, h1, section } from '@cycle/dom'
import { getElementViewport } from '../utils/animation'

const intent = sources => ({
  content$: sources.content,
  viewport$: sources.viewport,
  $process$: sources.viewport
    .compose(getElementViewport(sources, '#process', 'u-inViewport'))
})

const model = (action) => {
  // action
  //   .$process$
  //   .addListener({ next: e => console.log('$process$', e) })

  return xs.combine(
    action.content$
      .map(content => content.process),
    action.viewport$,
    action.$process$
  )
  .map(([content, viewport, $process]) => ({
    process: content,
    viewport,
    $process
  }))
}

const view = state$ =>
  state$.map(state =>
    section('#process.FullViewSection', {}, [
      div('.Grid.u-Full.Process-skin', {
        style: {
        }
      }, [div('.Col.Hero-title-col', [
        h1('.Process-title', { style: {
          transition: 'all 0.3s ease 0.0s',
          right: state.process.carousel[0].position[state.viewport.orientation].x,
          top: state.process.carousel[0].position[state.viewport.orientation].y,
          transform: state.$process ? `translateY(-${(state.$process.top) * 0.2}px)` : '',
          opacity: state.viewport.ready ? '1' : '0'
        } }, state.process.title)])])
    ]))


export default sources => ({
  DOM: view(model(intent(sources)))
})
