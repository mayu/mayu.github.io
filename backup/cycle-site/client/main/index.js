import Router from './Router'

export default function Main(sources) {
  const router = Router({ ...sources })
  return {
    DOM: router.DOM,
    content: sources.content,
    viewport: sources.viewport
  }
}
