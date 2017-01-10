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
        transform: `scale(${isActive ? '2' : '1'}) translate(${TAB_SPACE * tab}rem)`
      }
    },
      label
    )
  ])

const nav$ = xs.of(nav([ul([
  makeLink('/joinus', 'Join Our Design Team', 1),
  makeLink('/testprogram', 'Become A Tester', 1),
  makeLink('/signup', 'Sign Up For Updates', 1),
  makeLink('/mayu', 'Mayu', 0, true),
  makeLink('/glove', 'Our Glove', 1),
  makeLink('/process', 'Our E-Textile Process', 1),
  makeLink('/team', 'Our Design Team', 1),
])]))

export default function () {
  return {
    DOM: nav$
  }
}
