import xs from 'xstream';
import {div, h3, p} from '@cycle/dom';

export default function NotFound(sources) {
  const vdom$ = xs.of(div([
    h3('Page not found'),
    p('Please click on the links above to check the examples.')
  ]));

  return {
    DOM: vdom$
  };
}
