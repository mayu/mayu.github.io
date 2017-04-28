import xs from 'xstream'
import { div, h1, img, section } from '@cycle/dom'
import { getElementViewport } from '../utils/animation'

const intent = sources => ({
  content$: sources.content,
  viewport$: sources.viewport,
  $product$: sources.viewport
    .compose(getElementViewport(sources, '#product', 'u-inViewport'))
})

const model = (action) => {
  // action
  //   .$product$
  //   .addListener({ next: e => console.log('$product$', e) })
  //
  //   action
  //     .viewport$
  //     .addListener({ next: e => console.log('VIEWPORT', e) })

  return xs.combine(
    action.content$
      .map(content => content.product),
    action.viewport$,
    action.$product$
  )
  .map(([content, viewport, $product]) => ({
    product: content,
    viewport,
    $product
  }))
}

const view = state$ =>
  state$.map(state =>
    section('#product.FullViewSection', {}, [
      img('.Hero-image', {
        attrs: {
          src: state.product.carousel[0].source
        },
        style: {
          right: state.product.carousel[0].position[state.viewport.orientation].x,
          top: state.product.carousel[0].position[state.viewport.orientation].y,
          transform: state.$product ? `translateY(-${(state.$product.top) * 0.2}px)` : '',
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
        } }, state.product.title)])])
    ]))


export default sources => ({
  DOM: view(model(intent(sources)))
})
