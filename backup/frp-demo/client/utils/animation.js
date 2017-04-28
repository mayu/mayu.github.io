/* global window document */
import sampleCombine from 'xstream/extra/sampleCombine'

export const getElementViewport = (sources, selector, inViewClass) =>
  mainViewportStream =>
    mainViewportStream
      .compose(sampleCombine( // query dom throttled by viewport stream.
        sources.DOM
          .select(selector)
          .elements()
      ))
      .map(streams => streams[1]) // take element Stream
      .map(el => el[0]) // select first option
      .filter(el => el) // make sure it exists
      .filter(el => el.classList.contains(inViewClass)) // Make sure it's in viewport
      .map(el => el.getBoundingClientRect()) // get viewport data
      .map(dim => ({
        top: parseInt(dim.top, 10),
        right: parseInt(dim.right, 10),
        bottom: parseInt(dim.bottom, 10),
        left: parseInt(dim.left, 10)
      }))
      .startWith({})

export default { getElementViewport }
