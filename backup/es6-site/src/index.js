// const DATA_SOURCE = '../data/index.js'
import model from '../data/index.js'
import view from './view'
import intent from './intent.js'

intent()

const CONTAINER_ID = '#container'

const $container = document.querySelector(CONTAINER_ID)
$container.innerHTML = view(model)
