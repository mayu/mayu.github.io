import xs from 'xstream'
import { div, article } from '@cycle/dom'
import isolate from '@cycle/isolate';
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
  // const { router } = sources

  // const match$ = router.define({
  //   '/joinus': JoinUs,
  //   '/testprogram': TestProgram,
  //   '/signup': SignUp,
  //   '/': Hero,
  //   '/glove': Product,
  //   '/process': Process,
  //   '/team': Team,
  //   '/city': City,
  //   // '/internal/onboarding': Onboarding,
  //   '*': NotFound
  // })

  // const page$ = match$.map(({ path, value }) => value(merge(sources, {
  //   path: router.path(path)
  // })))

  // const pages$ = page$.map(prop('DOM')).flatten()
  const nav$ = isolate(Container)(sources).DOM

  // const navMousedOver$ = nav$.select('nav').events('onmouseover')

  const vdom$ = xs.combine(
    JoinUs(sources).DOM,
    TestProgram(sources).DOM,
    SignUp(sources).DOM,
    nav$,
    isolate(Hero)(sources).DOM,
    Product(sources).DOM,
    Process(sources).DOM,
    Team(sources).DOM
  )
    .map(([ContainerView, ...rest]) => div('#container', [ContainerView, article('#content', [...rest])]))

  const sinks = merge(sources, { DOM: vdom$ })

  return sinks
}
