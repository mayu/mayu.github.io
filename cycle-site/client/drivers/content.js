import xs from 'xstream'
import content from '../../content'

export default function makeContentDriver() {
  return () => xs.of(content)
}
