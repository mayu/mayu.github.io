import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import {div, section, h2, input, span} from '@cycle/dom';
import isolate from '@cycle/isolate'

const getElementViewport = (sources, selector) =>
  viewportStream =>
    viewportStream
      .compose(sampleCombine( // query dom throttled by viewport stream.
        sources.DOM
          .select(selector)
          .elements()
      ))
      .map(streams => streams[1]) // take element Stream
      .map(el => el[0]) // select first option
      .filter(el => el) // make sure it exists
      .map(el => el.getBoundingClientRect()) // get viewport data
      .map(dim => ({
        top: parseInt(dim.top, 10),
        right: parseInt(dim.right, 10),
        bottom: parseInt(dim.bottom, 10),
        left: parseInt(dim.left, 10)
      }))
      .startWith({})

function detectIntersection() {
  const onViewportToggle = (entry) => {
    entry.forEach((change) => {
      // change.target.classList.toggle('u-inViewport')
    })
  }

  const options = {
    threshold: [0]
  }

  const observer = new IntersectionObserver(onViewportToggle, options)
  const elm = document.createElement('div')
  observer.observe(elm)
}


const AnimationContextComponent = (sources) => {
  // const viewport$ = sources.viewport

  // const vdom$ = state$
  //   .map(state =>
  //     div('.labeled-slider', {
  //       dataset: {
  //         state
  //       }
  //     }, [
  //       div('HELLO')
  //     ])
  //   )

  const sinks = {
    ...{
      // thisEl: viewport$.compose(getElementViewport(sources, ''))
      // tester: xs.of(0)
    },
    ...sources
  }

  return sources
}

export default (sources) => {
  const view$ = sources.DOM
    .map(view => section('#ds', {
      // style: { transform: 'scale(0.5)'}
    }, [view]))

  return {
    ...sources,
    ...{
      DOM: view$,
      thisEl: sources.viewport.compose(getElementViewport, '#home')
    },
  }
  // const weightProps$ = xs.of({
  //   label: 'Weight', unit: 'kg', min: 40, max: 150, value: 70
  // })
  //
  // const weightSources = { DOM: sources.DOM, props: weightProps$ }

  // return isolate(AnimationContextComponent)(sources)
}
