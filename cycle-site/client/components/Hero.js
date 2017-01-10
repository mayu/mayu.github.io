import xs from 'xstream'
import { div, h1, img, section } from '@cycle/dom'

const intent = sources => ({
  content$: sources.content,
  viewport$: sources.viewport
})

const model = action =>
  xs.combine(
    action.content$
      .map(content => content.hero),
    action.viewport$
  )
  .map(([content, viewport]) => ({
    hero: content,
    viewport
  }))

const view = state$ =>
  state$.map(state =>
    div({ style: {
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
    } }, [
      img('.Hero-image', {
        attrs: {
          src: state.hero.carousel[0].source
        },
        style: {
          right: state.hero.carousel[0].position[state.viewport.orientation].x,
          top: state.hero.carousel[0].position[state.viewport.orientation].y
        }
      }),
      section('.Grid.u-Full', {
        style: {
        }
      }, [div('.Col.Hero-title-col', [h1('.Hero-title', state.hero.title)])])
    ]))

export default sources => ({
  DOM: view(model(intent(sources)))
})
