import { run } from '@cycle/xstream-run'
import { makeDOMDriver } from '@cycle/dom'
import { createHistory } from 'history'
import { makeRouterDriver } from 'cyclic-router'
import switchPath from 'switch-path'

import makeContentDriver from './drivers/content'
import makeViewPortDriver from './drivers/viewport'

import Main from './main'

const drivers = {
  DOM: makeDOMDriver('#root'),
  router: makeRouterDriver(createHistory(), switchPath),
  content: makeContentDriver(),
  viewport: makeViewPortDriver()
}

run(Main, drivers)
