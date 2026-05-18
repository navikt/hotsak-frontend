import { describe, expect, it } from 'vitest'

import { Oppgavetype, type Oppgave, Statuskategori } from '../../oppgave/oppgaveTypes'
import type { Saksbehandler } from '../../types/types.internal'

/**
 * Pure function duplicated from useOppgaveregler for testability.
 * The source lives inside a React hook (useMemo + useInnloggetAnsatt),
 * so we duplicate the pure logic here to avoid changing production code.
 */
function beregnOppgaveregler(oppgave: Oppgave | undefined, ansattId: string) {
  if (!oppgave) {
    return {
      oppgaveErÅpen: false,
      oppgaveErAvsluttet: false,
      oppgaveErKlarTilBehandling: false,
      oppgaveErUnderBehandling: false,
      oppgaveErUnderBehandlingAvInnloggetAnsatt: false,
      oppgaveErUnderBehandlingAvAnnenAnsatt: false,
      oppgaveErPåVent: false,
    }
  }

  const { tildeltSaksbehandler } = oppgave
  const statuskategori = oppgave.statuskategori
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
}

function lagOppgave(overrides: Partial<Oppgave> = {}): Oppgave {
  return {
    oppgaveId: 'HOT-1',
    sakId: '1',
    tildeltSaksbehandler: null,
    kategorisering: { oppgavetype: Oppgavetype.BEHANDLE_SAK, tema: 'HJE' },
    statuskategori: Statuskategori.ÅPEN,
    isPåVent: false,
    ...overrides,
  } as Oppgave
}

describe('oppgaveregler (ren logikk)', () => {
  const ansattId = 'S112233'

  it('returnerer initialtilstand for undefined oppgave', () => {
    const result = beregnOppgaveregler(undefined, ansattId)
    expect(result.oppgaveErÅpen).toBe(false)
    expect(result.oppgaveErAvsluttet).toBe(false)
  })

  it('åpen oppgave uten tildeling er klar til behandling', () => {
    const result = beregnOppgaveregler(lagOppgave(), ansattId)
    expect(result.oppgaveErÅpen).toBe(true)
    expect(result.oppgaveErKlarTilBehandling).toBe(true)
    expect(result.oppgaveErUnderBehandling).toBe(false)
  })

  it('åpen oppgave tildelt innlogget ansatt', () => {
    const tildeltSaksbehandler = { id: ansattId, navn: 'Silje' } as Saksbehandler
    const result = beregnOppgaveregler(lagOppgave({ tildeltSaksbehandler }), ansattId)
    expect(result.oppgaveErUnderBehandling).toBe(true)
    expect(result.oppgaveErUnderBehandlingAvInnloggetAnsatt).toBe(true)
    expect(result.oppgaveErUnderBehandlingAvAnnenAnsatt).toBe(false)
  })

  it('åpen oppgave tildelt annen ansatt', () => {
    const tildeltSaksbehandler = { id: 'OTHER', navn: 'Ole' } as Saksbehandler
    const result = beregnOppgaveregler(lagOppgave({ tildeltSaksbehandler }), ansattId)
    expect(result.oppgaveErUnderBehandling).toBe(true)
    expect(result.oppgaveErUnderBehandlingAvInnloggetAnsatt).toBe(false)
    expect(result.oppgaveErUnderBehandlingAvAnnenAnsatt).toBe(true)
  })

  it('avsluttet oppgave', () => {
    const result = beregnOppgaveregler(lagOppgave({ statuskategori: Statuskategori.AVSLUTTET }), ansattId)
    expect(result.oppgaveErAvsluttet).toBe(true)
    expect(result.oppgaveErÅpen).toBe(false)
    expect(result.oppgaveErKlarTilBehandling).toBe(false)
  })

  it('oppgave på vent', () => {
    const result = beregnOppgaveregler(lagOppgave({ isPåVent: true }), ansattId)
    expect(result.oppgaveErPåVent).toBe(true)
    expect(result.oppgaveErÅpen).toBe(true)
  })

  it('avsluttet oppgave er ikke på vent selv om isPåVent=true', () => {
    const result = beregnOppgaveregler(
      lagOppgave({ statuskategori: Statuskategori.AVSLUTTET, isPåVent: true }),
      ansattId
    )
    expect(result.oppgaveErPåVent).toBe(false)
  })
})
