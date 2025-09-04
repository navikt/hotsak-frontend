import { useMemo } from 'react'

export function useMiljø() {
  const miljø = window.appSettings.NAIS_CLUSTER_NAME
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
