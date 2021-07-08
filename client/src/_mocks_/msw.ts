export const initMSW = () => {
  /* eslint-disable */
  const { worker } = require('./browser')
  worker.start({
    onUnhandledRequest: 'bypass',
  })
}
