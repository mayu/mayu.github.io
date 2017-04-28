import xs from 'xstream'
import { nav, a, ul, li } from '@cycle/dom'

const TAB_SPACE = 3
const makeLink = (path, label, tab = 0, isActive = null) =>
  li([
    a({
      props: {
        href: path,
        className: isActive ? 'isActive' : ''
      },
      style: {
        transform: `
        `
        // scale(${isActive ? '2' : '1'})
        // translate(-${TAB_SPACE * tab}rem)
      }
    },
      label
    )
  ])

const intent = sources => ({
  viewport$: sources.viewport
})

const model = action =>
  action.viewport$

const view = state$ =>
  state$.map(state =>
    nav({
      style: {
        opacity: state.ready ? '1' : '0',
        // transform: state.ready ? 'scale(1)' : 'scale(5)',
        // transition: 'all 0.3s ease 1s',
        // 'transform-origin': 'right'
      }
    }, [ul({ style: {
      // transform: `translateY(-${4*2.2}rem)`
    } }, [
      makeLink('/joinus', 'Join Our Design Team', 1),
      makeLink('/testprogram', 'Become A Tester', 1),
      makeLink('/signup', 'Sign Up For Updates', 1),
      makeLink('/mayu', 'Mayu', 0, true),
      makeLink('/glove', 'Our Glove', 1),
      makeLink('/process', 'Our E-Textile Process', 1),
      makeLink('/team', 'Our Design Team', 1),
    ])])
  )

export default sources => ({
  DOM: view(model(intent(sources)))
})
