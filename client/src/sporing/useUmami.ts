import { useCallback, useEffect, useMemo, useState } from 'react'

import { useInnloggetAnsatt } from '../tilgang/useTilgang'
import { logDebug } from '../utvikling/logDebug.ts'
import { UmamiTaksonomi } from './UmamiTaksonomi.ts'

export type UmamiLogData = Record<string, boolean | number | string>

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
    (navn: UmamiTaksonomi, data?: UmamiLogData) => {
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

  return useMemo(
    () => ({
      logUmamiHendelse,

      // generelle
      logKnappKlikket(data: UmamiLogData) {
        logUmamiHendelse(UmamiTaksonomi.KNAPP_KLIKKET, data)
      },
      logSkjemaFullført(data: UmamiLogData) {
        logUmamiHendelse(UmamiTaksonomi.SKJEMA_FULLFØRT, data)
      },

      // brukerinnstillinger
      logVinduStørrelse(data: UmamiLogData) {
        const { innerWidth: vinduBredde, innerHeight: vinduHoyde } = window
        logUmamiHendelse(UmamiTaksonomi.CLIENT_INFO, {
          vinduBredde,
          vinduHoyde,
          ...data,
        })
      },
      logTemaByttet(data: UmamiLogData) {
        logUmamiHendelse(UmamiTaksonomi.TEMA_BYTTET, data)
      },

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
      logOppgavelisteFiltrert(data: UmamiLogData) {
        logUmamiHendelse(UmamiTaksonomi.OPPGAVELISTE_FILTRERT, data)
      },
      logOppgavelisteSortert(data: { kolonne: string; rekkefølge: string }) {
        logUmamiHendelse(UmamiTaksonomi.OPPGAVELISTE_SORTERT, data)
      },
      logOppgavelisteTilpasset(data: UmamiLogData) {
        logUmamiHendelse(UmamiTaksonomi.OPPGAVELISTE_TILPASSET, data)
      },

      // saksbehandling
      logUtfallLavereRangert(data: UmamiLogData) {
        logUmamiHendelse(UmamiTaksonomi.UTFALL_LAVERE_RANGERT, data)
      },
      logPostbegrunnelseEndret(data: UmamiLogData) {
        logUmamiHendelse(UmamiTaksonomi.POSTBEGRUNNELSE_ENDRET, data)
      },
      logProblemsammendragEndret(data: UmamiLogData) {
        logUmamiHendelse(UmamiTaksonomi.PROBLEMSAMMENDRAG_ENDRET, data)
      },

      isReady,
    }),
    [logUmamiHendelse, isReady]
  )
}
