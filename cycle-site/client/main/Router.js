import xs from 'xstream'
import { div } from '@cycle/dom'
import { merge, prop } from 'ramda'

import Container from '../components/Container'
import NotFound from '../components/NotFound'

import JoinUs from '../components/JoinUs'
import TestProgram from '../components/TestProgram'
import SignUp from '../components/SignUp'
import Hero from '../components/Hero'
import Product from '../components/Product'
import Process from '../components/Process'
import Team from '../components/Team'
import City from '../components/City'

export default function Router(sources) {
  const { router } = sources

  const match$ = router.define({
    '/joinus': JoinUs,
    '/testprogram': TestProgram,
    '/signup': SignUp,
    '/': Hero,
    '/glove': Product,
    '/process': Process,
    '/team': Team,
    '/city': City,
    // '/internal/onboarding': Onboarding,
    '*': NotFound
  })

  const page$ = match$.map(({ path, value }) => value(merge(sources, {
    path: router.path(path)
  })))

  const pages$ = page$.map(prop('DOM')).flatten()

  const container$ = Container().DOM

  const vdom$ = xs.combine(container$, pages$)
    .map(([containerDom, viewDom]) => div([containerDom, viewDom]))

  const sinks = merge(sources, { DOM: vdom$ })

  return sinks
}
