import { useEffect, useState } from 'react'
import { useInnloggetAnsatt } from '../tilgang/useTilgang'
import { UMAMI_TAKSONOMI } from './umamiTaksonomi'

export function useUmami() {
  const [isReady, setIsReady] = useState(false)
  const { gjeldendeEnhet } = useInnloggetAnsatt()
  const enhetsnavn = gjeldendeEnhet.navn

  useEffect(() => {
    const checkReady = () => {
      if (typeof window !== 'undefined' && window.umami) {
        setIsReady(true)
      } else {
        setTimeout(checkReady, 200)
      }
    }
    checkReady()
  }, [])

  const logUmamiHendelse = (navn: UMAMI_TAKSONOMI, data?: object) => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(navn, {
        appnavn: 'hotsak',
        enhetsnavn,
        ...data,
      })
    }
  }

  const logKnappKlikket = (data: object) => {
    logUmamiHendelse(UMAMI_TAKSONOMI.KNAPP_KLIKKET, data)
  }

  const logSkjemaFullført = (data: object) => {
    logUmamiHendelse(UMAMI_TAKSONOMI.SKJEMA_FULLFØRT, data)
  }

  const logModalÅpnet = (data: object) => {
    logUmamiHendelse(UMAMI_TAKSONOMI.MODAL_ÅPNET, data)
  }

  const logVinduStørrelse = (data: object) => {
    const { innerWidth: width, innerHeight: height } = window

    logUmamiHendelse(UMAMI_TAKSONOMI.CLIENT_INFO, {
      vinduBredde: width,
      vinduHoyde: height,
      ...data,
    })
  }

  const logTemaByttet = (data: object) => {
    logUmamiHendelse(UMAMI_TAKSONOMI.TEMA_BYTTET, data)
  }

  const logOverføringMedarbeider = () => {
    logUmamiHendelse(UMAMI_TAKSONOMI.OVERFØRING_MEDARBEIDER)
  }

  return { logUmamiHendelse, logKnappKlikket, logSkjemaFullført, logModalÅpnet, logVinduStørrelse, logTemaByttet, logOverføringMedarbeider, isReady }
}
