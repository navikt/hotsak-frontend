import { useEffect, useState } from 'react'

import { useInnloggetAnsatt } from '../tilgang/useTilgang'
import { UmamiTaksonomi } from './UmamiTaksonomi.ts'

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

  const logUmamiHendelse = (navn: UmamiTaksonomi, data?: object) => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(navn, {
        appnavn: 'hotsak',
        enhetsnavn,
        ...data,
      })
    }
  }

  const logKnappKlikket = (data: object) => {
    logUmamiHendelse(UmamiTaksonomi.KNAPP_KLIKKET, data)
  }

  const logSkjemaFullført = (data: object) => {
    logUmamiHendelse(UmamiTaksonomi.SKJEMA_FULLFØRT, data)
  }

  const logModalÅpnet = (data: object) => {
    logUmamiHendelse(UmamiTaksonomi.MODAL_ÅPNET, data)
  }

  const logVinduStørrelse = (data: object) => {
    const { innerWidth: width, innerHeight: height } = window

    logUmamiHendelse(UmamiTaksonomi.CLIENT_INFO, {
      vinduBredde: width,
      vinduHoyde: height,
      ...data,
    })
  }

  const logTemaByttet = (data: object) => {
    logUmamiHendelse(UmamiTaksonomi.TEMA_BYTTET, data)
  }

  const logOverføringMedarbeider = () => {
    logUmamiHendelse(UmamiTaksonomi.OVERFØRING_MEDARBEIDER)
  }

  return {
    logUmamiHendelse,
    logKnappKlikket,
    logSkjemaFullført,
    logModalÅpnet,
    logVinduStørrelse,
    logTemaByttet,
    logOverføringMedarbeider,
    isReady,
  }
}
