import '@testing-library/jest-dom/vitest'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { besvarelseToSvar, type IBesvarelse, type ISvar } from '../Besvarelse'
import { journalføringingsoppgave_overført_gosys_v1 as spørreundersøkelse } from '../journalføringingsoppgave_overført_gosys_v1'
import { SpørreundersøkelseStack } from '../SpørreundersøkelseStack'

const HOVEDSPØRSMÅL = 'Hvorfor overfører du oppgaven til Gosys?'

function Skjema({ onBesvar }: { onBesvar(svar: ISvar[]): void }) {
  const form = useForm<IBesvarelse>({ defaultValues: {} })
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((besvarelse) => onBesvar(besvarelseToSvar(spørreundersøkelse, besvarelse)))}>
        <SpørreundersøkelseStack spørreundersøkelse={spørreundersøkelse} size="small" />
        <button type="submit">Overfør til Gosys</button>
      </form>
    </FormProvider>
  )
}

function renderSkjema() {
  const bruker = userEvent.setup()
  const onBesvar = vi.fn()
  render(<Skjema onBesvar={onBesvar} />)
  return { bruker, onBesvar }
}

function hovedgruppe() {
  return screen.getByRole('radiogroup', { name: new RegExp(HOVEDSPØRSMÅL) })
}

function velgHovedårsak(bruker: ReturnType<typeof userEvent.setup>, navn: string) {
  return bruker.click(within(hovedgruppe()).getByRole('radio', { name: navn }))
}

function hentRadioAlternativerFraGruppe(gruppenavn: RegExp) {
  return within(screen.getByRole('radiogroup', { name: gruppenavn }))
    .getAllByRole('radio')
    .map((radio) => radio.getAttribute('value'))
}

function overfør(bruker: ReturnType<typeof userEvent.setup>) {
  return bruker.click(screen.getByRole('button', { name: 'Overfør til Gosys' }))
}

describe('journalføringingsoppgave_overført_gosys_v1', () => {
  it('bruker riktig skjema-id', () => {
    expect(spørreundersøkelse.skjema).toBe('journalføringingsoppgave_overført_gosys_v1')
  })

  it('viser hovedårsakene som radioknapper', () => {
    renderSkjema()

    expect(hentRadioAlternativerFraGruppe(new RegExp(HOVEDSPØRSMÅL))).toEqual([
      'Behov for å sende brev',
      'Saken skal ikke behandles i Hotsak pr. i dag',
      'Saken skal ikke behandles av Nav hjelpemiddelsentral',
      'Saken er sendt inn på feil bruker eller inneholder dokumentasjon om flere brukere',
      'Annet',
    ])
  })

  it('krever at en hovedårsak er valgt', async () => {
    const { bruker, onBesvar } = renderSkjema()

    await overfør(bruker)

    expect(await screen.findByText('Du må velge minst én årsak')).toBeInTheDocument()
    expect(onBesvar).not.toHaveBeenCalled()
  })

  it('viser områdelisten under Saken skal ikke behandles i Hotsak', async () => {
    const { bruker } = renderSkjema()

    await velgHovedårsak(bruker, 'Saken skal ikke behandles i Hotsak pr. i dag')

    expect(hentRadioAlternativerFraGruppe(/Hvilket område gjelder saken/)).toEqual([
      'Arbeidsliv',
      'Utdanning',
      'AKT26',
      'Tilskudd',
      'Annet',
    ])
  })
})
