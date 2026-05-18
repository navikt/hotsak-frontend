import { describe, expect, it } from 'vitest'

import { type Oppgave, Oppgaveprioritet, Statuskategori } from '../../oppgave/oppgaveTypes'
import {
  selectBrukerAlder,
  selectBrukerFødselsdato,
  selectBrukerFødselsnummer,
  selectBrukerKommuneNavn,
  selectIsHastesak,
  selectIsPåVent,
  selectIsUlest,
  selectMappenavn,
  selectOppgaveId,
  selectOppgavetype,
  selectPrioritet,
  selectSakId,
  selectTildeltSaksbehandlerNavn,
} from '../oppgaveSelectors'
import { OPPGAVE_FILTER_OPTION_TOMME } from '../useOppgaveFilterOptions'

function lagOppgave(overrides: Partial<Oppgave> = {}): Oppgave {
  return {
    oppgaveId: 'HOT-123',
    sakId: '456',
    tildeltSaksbehandler: null,
    kategorisering: {
      oppgavetype: 'BEHANDLE_SØKNAD',
    } as unknown as Oppgave['kategorisering'],
    prioritet: Oppgaveprioritet.NORMAL,
    statuskategori: Statuskategori.ÅPEN,
    mappenavn: undefined,
    innsender: undefined,
    bruker: undefined,
    sak: undefined,
    isPåVent: false,
    isUlest: false,
    ...overrides,
  } as Oppgave
}

describe('oppgaveSelectors', () => {
  it('selectOppgaveId returnerer oppgaveId', () => {
    expect(selectOppgaveId(lagOppgave())).toBe('HOT-123')
  })

  it('selectSakId returnerer sakId', () => {
    expect(selectSakId(lagOppgave())).toBe('456')
  })

  it('selectSakId returnerer tom streng for manglende sakId', () => {
    expect(selectSakId(lagOppgave({ sakId: undefined }))).toBe('')
  })

  it('selectTildeltSaksbehandlerNavn returnerer navn når tildelt', () => {
    expect(
      selectTildeltSaksbehandlerNavn(
        lagOppgave({
          tildeltSaksbehandler: { id: '1', navn: 'Silje' } as unknown as Oppgave['tildeltSaksbehandler'],
        })
      )
    ).toBe('Silje')
  })

  it('selectTildeltSaksbehandlerNavn returnerer fallback når ikke tildelt', () => {
    expect(selectTildeltSaksbehandlerNavn(lagOppgave())).toBe(OPPGAVE_FILTER_OPTION_TOMME)
  })

  it('selectOppgavetype returnerer oppgavetype', () => {
    expect(selectOppgavetype(lagOppgave())).toBe('BEHANDLE_SØKNAD')
  })

  it('selectMappenavn returnerer fallback for undefined', () => {
    expect(selectMappenavn(lagOppgave())).toBe(OPPGAVE_FILTER_OPTION_TOMME)
  })

  it('selectPrioritet returnerer prioritet', () => {
    expect(selectPrioritet(lagOppgave())).toBe(Oppgaveprioritet.NORMAL)
  })

  it('selectIsHastesak er true for KRITISK', () => {
    expect(selectIsHastesak(lagOppgave({ prioritet: Oppgaveprioritet.KRITISK }))).toBe(true)
  })

  it('selectIsHastesak er true for HØY', () => {
    expect(selectIsHastesak(lagOppgave({ prioritet: Oppgaveprioritet.HØY }))).toBe(true)
  })

  it('selectIsHastesak er false for NORMAL', () => {
    expect(selectIsHastesak(lagOppgave())).toBe(false)
  })

  it('selectIsPåVent returnerer riktig verdi', () => {
    expect(selectIsPåVent(lagOppgave({ isPåVent: true }))).toBe(true)
    expect(selectIsPåVent(lagOppgave())).toBe(false)
  })

  it('selectIsUlest returnerer riktig verdi', () => {
    expect(selectIsUlest(lagOppgave({ isUlest: true }))).toBe(true)
    expect(selectIsUlest(lagOppgave())).toBe(false)
  })

  it('selectBrukerFødselsnummer returnerer fnr', () => {
    expect(
      selectBrukerFødselsnummer(lagOppgave({ bruker: { fnr: '12345678901' } as unknown as Oppgave['bruker'] }))
    ).toBe('12345678901')
  })

  it('selectBrukerFødselsnummer returnerer undefined uten bruker', () => {
    expect(selectBrukerFødselsnummer(lagOppgave())).toBeUndefined()
  })

  it('selectBrukerFødselsdato parser dato', () => {
    const oppgave = lagOppgave({ bruker: { fødselsdato: '1990-01-15' } as unknown as Oppgave['bruker'] })
    const date = selectBrukerFødselsdato(oppgave)
    expect(date).toBeInstanceOf(Date)
    expect(date?.getFullYear()).toBe(1990)
  })

  it('selectBrukerAlder returnerer alder', () => {
    expect(selectBrukerAlder(lagOppgave({ bruker: { alder: 35 } as unknown as Oppgave['bruker'] }))).toBe(35)
  })

  it('selectBrukerKommuneNavn returnerer fallback for manglende kommune', () => {
    expect(selectBrukerKommuneNavn(lagOppgave())).toBe(OPPGAVE_FILTER_OPTION_TOMME)
  })
})
