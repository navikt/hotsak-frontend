import { useMemo } from 'react'

import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { Oppgavestatus, OppgaveV2, Statuskategori } from './oppgaveTypes.ts'

export interface UseOppgavereglerResponse {
  /**
   * Oppgaven er ikke ferdigstilt eller feilregistrert.
   */
  oppgaveErÅpen: boolean
  /**
   * Oppgaven er ferdigstilt eller feilregistrert.
   */
  oppgaveErAvsluttet: boolean
  /**
   * Oppgave er ikke tildelt ansatt.
   */
  oppgaveErKlarTilBehandling: boolean
  /**
   * Oppgaven er under behandling av ansatt.
   */
  oppgaveErUnderBehandling: boolean
  /**
   * Oppgaven er under behandling av innlogget ansatt.
   */
  oppgaveErUnderBehandlingAvInnloggetAnsatt: boolean
  /**
   * Oppgaver er under behandling av en annen ansatt.
   */
  oppgaveErUnderBehandlingAvAnnenAnsatt: boolean
  oppgaveErPåVent: boolean
}

const initialResponse: UseOppgavereglerResponse = {
  oppgaveErÅpen: false,
  oppgaveErAvsluttet: false,
  oppgaveErKlarTilBehandling: false,
  oppgaveErUnderBehandling: false,
  oppgaveErUnderBehandlingAvInnloggetAnsatt: false,
  oppgaveErUnderBehandlingAvAnnenAnsatt: false,
  oppgaveErPåVent: false,
}

export function useOppgaveregler(oppgave?: OppgaveV2): UseOppgavereglerResponse {
  const { id: ansattId } = useInnloggetAnsatt()
  return useMemo(() => {
    if (!oppgave) return initialResponse
    const { tildeltSaksbehandler } = oppgave
    const statuskategori = statuskategoriForOppgave(oppgave)
    const oppgaveErÅpen = statuskategori === Statuskategori.ÅPEN
    const oppgaveErAvsluttet = statuskategori === Statuskategori.AVSLUTTET
    const oppgaveErKlarTilBehandling = oppgaveErÅpen && tildeltSaksbehandler == null
    const oppgaveErUnderBehandling = oppgaveErÅpen && tildeltSaksbehandler != null
    const oppgaveErUnderBehandlingAvInnloggetAnsatt = oppgaveErUnderBehandling && tildeltSaksbehandler?.id === ansattId
    const oppgaveErUnderBehandlingAvAnnenAnsatt = oppgaveErUnderBehandling && tildeltSaksbehandler?.id !== ansattId
    const oppgaveErPåVent = oppgaveErÅpen && oppgave.isPåVent === true
    return {
      oppgaveErÅpen,
      oppgaveErAvsluttet,
      oppgaveErKlarTilBehandling,
      oppgaveErUnderBehandling,
      oppgaveErUnderBehandlingAvInnloggetAnsatt,
      oppgaveErUnderBehandlingAvAnnenAnsatt,
      oppgaveErPåVent,
    }
  }, [ansattId, oppgave])
}

function statuskategoriForOppgave(oppgave: OppgaveV2): Statuskategori {
  switch (oppgave.oppgavestatus) {
    case Oppgavestatus.OPPRETTET:
    case Oppgavestatus.ÅPNET:
    case Oppgavestatus.UNDER_BEHANDLING:
      return Statuskategori.ÅPEN
    case Oppgavestatus.FERDIGSTILT:
    case Oppgavestatus.FEILREGISTRERT:
      return Statuskategori.AVSLUTTET
  }
}
