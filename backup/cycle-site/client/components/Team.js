import xs from 'xstream'
import { div, h1, img, section } from '@cycle/dom'
import { getElementViewport } from '../utils/animation'

const intent = sources => ({
  content$: sources.content,
  viewport$: sources.viewport,
  $team$: sources.viewport
    .compose(getElementViewport(sources, '#team', 'u-inViewport'))
})

const model = (action) => {
  // action
  //   .$team$
  //   .addListener({ next: e => console.log('$team$', e) })
  //
  //   action
  //     .viewport$
  //     .addListener({ next: e => console.log('VIEWPORT', e) })

  return xs.combine(
    action.content$
      .map(content => content.team),
    action.viewport$,
    action.$team$
  )
  .map(([content, viewport, $team]) => ({
    team: content,
    viewport,
    $team
  }))
}

const view = state$ =>
  state$.map(state =>
    section('#team.FullViewSection', {}, [
      img('.Hero-image', {
        attrs: {
          src: state.team.carousel[0].source
        },
        style: {
          right: state.team.carousel[0].position[state.viewport.orientation].x,
          top: state.team.carousel[0].position[state.viewport.orientation].y,
          transform: state.$team ? `translateY(-${(state.$team.top) * 0.2}px)` : '',
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
        } }, state.team.title)])])
    ]))


export default sources => ({
  DOM: view(model(intent(sources)))
})
