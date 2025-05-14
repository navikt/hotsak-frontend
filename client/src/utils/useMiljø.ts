import { useMemo } from 'react'

export function useMiljø() {
  const miljø = window.appSettings.MILJO
  return useMemo(() => {
    const erLocal = miljø === 'local'
    const erDev = miljø === 'dev-gcp'
    return {
      erLocal,
      erDev,
      erProd: miljø === 'prod-gcp',
      erIkkeProd: erLocal || erDev,
    }
  }, [miljø])
}
