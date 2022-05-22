export const initMSW = async () => {
  const { worker } = await import('./browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
