import Kefir from 'kefir'

export default () => {
  const keyPressed = Kefir.fromEvents(document, 'keydown')

  const macKeyPrintRequested = keyPressed
    .filter(e => e.keyCode === 80 && e.metaKey === true) // Command P pressed

  const windowsKeyPrintRequested = keyPressed
    .filter(e => e.keyCode === 80 && e.ctrlKey === true)

  const printRequested = Kefir.merge([macKeyPrintRequested, windowsKeyPrintRequested])

  // Download pdf on command P
  printRequested.onValue(e => {
    e.preventDefault()
    document.getElementById('download-resume').click()
  })
}
