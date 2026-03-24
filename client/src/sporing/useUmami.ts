import { useCallback, useEffect, useState } from 'react'

import { useInnloggetAnsatt } from '../tilgang/useTilgang'
import { logDebug } from '../utvikling/logDebug.ts'
import { UmamiTaksonomi } from './UmamiTaksonomi.ts'

export type UmamiLogRecord = Record<string, boolean | number | string>

export type UmamiLogger<T = UmamiLogRecord> = (data?: T) => void

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
    (navn: UmamiTaksonomi, data?: UmamiLogRecord) => {
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

  const logKnappKlikket: UmamiLogger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.KNAPP_KLIKKET, data)
  }

  const logSkjemaFullført: UmamiLogger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.SKJEMA_FULLFØRT, data)
  }

  const logVinduStørrelse: UmamiLogger = (data) => {
    const { innerWidth: width, innerHeight: height } = window
    logUmamiHendelse(UmamiTaksonomi.CLIENT_INFO, {
      vinduBredde: width,
      vinduHoyde: height,
      ...data,
    })
  }

  const logTemaByttet: UmamiLogger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.TEMA_BYTTET, data)
  }

  const logUtfallLavereRangert: UmamiLogger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.UTFALL_LAVERE_RANGERT, data)
  }

  const logPostbegrunnelseEndret: UmamiLogger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.POSTBEGRUNNELSE_ENDRET, data)
  }

  const logProblemsammendragEndret: UmamiLogger = (data) => {
    logUmamiHendelse(UmamiTaksonomi.PROBLEMSAMMENDRAG_ENDRET, data)
  }

  return {
    logUmamiHendelse,
    logKnappKlikket,
    logSkjemaFullført,
    logVinduStørrelse,
    logTemaByttet,

    // oppgave
    logOppgaveSattPåVent() {
      logUmamiHendelse(UmamiTaksonomi.OPPGAVE_SATT_PÅ_VENT)
    },
    logOppgaveGjenopptatt() {
      logUmamiHendelse(UmamiTaksonomi.OPPGAVE_GJENOPPTATT)
    },
    logOppgaveGjelderEndret(data: { fra?: string; til?: string }) {
      logUmamiHendelse(UmamiTaksonomi.OPPGAVE_GJELDER_ENDRET, data)
    },
    logOppgaveOverførtTilMedarbeider() {
      logUmamiHendelse(UmamiTaksonomi.OPPGAVE_OVERFØRT_TIL_MEDARBEIDER)
    },
    logOppgaveLagtTilbake() {
      logUmamiHendelse(UmamiTaksonomi.OPPGAVE_LAGT_TILBAKE)
    },
    logOppgaveÅpnetIGosys() {
      logUmamiHendelse(UmamiTaksonomi.OPPGAVE_ÅPNET_I_GOSYS)
    },

    // oppgaveliste
    logOppgavelisteFiltrert(data: UmamiLogRecord) {
      logUmamiHendelse(UmamiTaksonomi.OPPGAVELISTE_FILTRERT, data)
    },
    logOppgavelisteSortert(data: UmamiLogRecord) {
      logUmamiHendelse(UmamiTaksonomi.OPPGAVELISTE_SORTERT, data)
    },
    logOppgavelisteTilpasset(data: UmamiLogRecord) {
      logUmamiHendelse(UmamiTaksonomi.OPPGAVELISTE_TILPASSET, data)
    },

    logUtfallLavereRangert,
    logPostbegrunnelseEndret,
    logProblemsammendragEndret,

    isReady,
  }
}
