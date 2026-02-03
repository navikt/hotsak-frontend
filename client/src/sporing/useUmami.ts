import { useCallback, useEffect, useState } from 'react'

import { useInnloggetAnsatt } from '../tilgang/useTilgang'
import { logDebug } from '../utvikling/logDebug.ts'
import { UmamiTaksonomi } from './UmamiTaksonomi.ts'

type Logger<T = Record<string, any>> = (data?: T) => void

export function useUmami() {
  const [isReady, setIsReady] = useState(false)

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

  const { gjeldendeEnhet } = useInnloggetAnsatt()
  const logUmamiHendelse = useCallback(
    (navn: UmamiTaksonomi, data?: Record<string, any>) => {
      const { nummer: enhetsnummer, navn: enhetsnavn } = gjeldendeEnhet
      if (typeof window !== 'undefined' && window.umami) {
        window.umami.track(navn, {
          appnavn: 'hotsak',
          enhetsnummer,
          enhetsnavn,
          ...data,
        })
      } else {
        logDebug(navn, enhetsnavn, data)
      }
    },
    [gjeldendeEnhet]
  )

  const logKnappKlikket: Logger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.KNAPP_KLIKKET, data)
  }

  const logSkjemaFullført: Logger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.SKJEMA_FULLFØRT, data)
  }

  const logModalÅpnet: Logger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.MODAL_ÅPNET, data)
  }

  const logVinduStørrelse: Logger = (data) => {
    const { innerWidth: width, innerHeight: height } = window

    logUmamiHendelse(UmamiTaksonomi.CLIENT_INFO, {
      vinduBredde: width,
      vinduHoyde: height,
      ...data,
    })
  }

  const logTemaByttet: Logger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.TEMA_BYTTET, data)
  }

  const logOverføringMedarbeider: Logger = () => {
    logUmamiHendelse(UmamiTaksonomi.OVERFØRING_MEDARBEIDER)
  }

  const logNyOppgavelisteValgt: Logger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.NY_OPPGAVELISTE_VALGT, data)
  }

  const logGammelOppgavelisteValgt: Logger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.GAMMEL_OPPGAVELISTE_VALGT, data)
  }

  const logOppgavelisteFiltrert: Logger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.OPPGAVELISTE_FILTRERT, data)
  }

  const logOppgavelisteSortert: Logger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.OPPGAVELISTE_SORTERT, data)
  }

  const logOppgavelisteTilpasset: Logger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.OPPGAVELISTE_TILPASSET, data)
  }

  const logUtfallLavereRangert: Logger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.UTFALL_LAVERE_RANGERT, data)
  }

  const logPostbegrunnelseEndret: Logger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.POSTBEGRUNNELSE_ENDRET, data)
  }

  return {
    logUmamiHendelse,
    logKnappKlikket,
    logSkjemaFullført,
    logModalÅpnet,
    logVinduStørrelse,
    logTemaByttet,
    logOverføringMedarbeider,

    // oppgaveliste
    logNyOppgavelisteValgt,
    logGammelOppgavelisteValgt,
    logOppgavelisteFiltrert,
    logOppgavelisteSortert,
    logOppgavelisteTilpasset,

    logUtfallLavereRangert,
    logPostbegrunnelseEndret,

    isReady,
  }
}
