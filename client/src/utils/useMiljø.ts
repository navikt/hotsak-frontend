import { useMemo } from 'react'

const mswAktivert = window.appSettings.USE_MSW || false

export function useMiljø() {
  return useMemo(() => {
    const erLocal = isLocal()
    const erDev = isDev()

    return {
      erLocal,
      erDev,
      erProd: isProd(),
      erIkkeProd: erLocal || erDev,
      mswAktivert,
    }
  }, [])
}

export function isLocal(): boolean {
  return window.appSettings.NAIS_CLUSTER_NAME === 'local'
}

export function isDev(): boolean {
  return window.appSettings.NAIS_CLUSTER_NAME === 'dev-gcp'
}

export function isProd(): boolean {
  return window.appSettings.NAIS_CLUSTER_NAME === 'prod-gcp'
}
