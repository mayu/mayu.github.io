import xs from 'xstream'
import { div, h1, img, section } from '@cycle/dom'
import { getElementViewport } from '../utils/animation'


const intent = sources => ({
  content$: sources.content,
  viewport$: sources.viewport,
  $hero$: sources.viewport
    .compose(getElementViewport(sources, '#home', 'u-inViewport'))
})

const model = (action) => {
  // action
  //   .$hero$
  //   .addListener({ next: e => console.log('$hero$', e) })

  return xs.combine(
    action.content$
      .map(content => content.hero),
    action.viewport$,
    action.$hero$
  )
  .map(([content, viewport, thisEl]) => ({
    hero: content,
    viewport,
    thisEl
  }))
}

const view = state$ =>
  state$.map(state =>
    section('#home.FullViewSection', {}, [
      img('.Hero-image', {
        attrs: {
          src: state.hero.carousel[0].source
        },
        style: {
          right: state.hero.carousel[0].position[state.viewport.orientation].x,
          top: state.hero.carousel[0].position[state.viewport.orientation].y,
          transform: state.thisEl ? `translateY(${(state.thisEl.top) * 0.2}px)` : '',
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
        } }, state.hero.title)])])
    ]))


export default sources => ({
  DOM: view(model(intent(sources)))
})
