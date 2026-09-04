import '@testing-library/jest-dom'

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
      'Feil førsteside - ikke 10-07.03-sak',
      'Feil i skanning',
      'Annet',
    ])
  })

  it('tillater bare ett valgt hovedalternativ og bytter underspørsmål når valget endres', async () => {
    const { bruker } = renderSkjema()

    await velgHovedårsak(bruker, 'Behov for å sende brev')
    expect(screen.getByRole('radiogroup', { name: /Hva har du behov for å sende brev om/ })).toBeInTheDocument()

    await velgHovedårsak(bruker, 'Feil i skanning')
    expect(within(hovedgruppe()).getByRole('radio', { name: 'Behov for å sende brev' })).not.toBeChecked()
    expect(within(hovedgruppe()).getByRole('radio', { name: 'Feil i skanning' })).toBeChecked()
    expect(screen.queryByRole('radiogroup', { name: /Hva har du behov for å sende brev om/ })).not.toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: /Hva er feil med skanningen/ })).toBeInTheDocument()
  })

  it('krever at en hovedårsak er valgt', async () => {
    const { bruker, onBesvar } = renderSkjema()

    await overfør(bruker)

    expect(await screen.findByText('Du må velge minst én årsak')).toBeInTheDocument()
    expect(onBesvar).not.toHaveBeenCalled()
  })

  it('krever at underspørsmål besvares når valgt hovedårsak har underspørsmål', async () => {
    const { bruker, onBesvar } = renderSkjema()

    await velgHovedårsak(bruker, 'Feil i skanning')
    await overfør(bruker)

    expect(await screen.findByText('Må fylles ut')).toBeInTheDocument()
    expect(onBesvar).not.toHaveBeenCalled()
  })

  it('viser områdelisten under Saken skal ikke behandles i Hotsak', async () => {
    const { bruker } = renderSkjema()

    await velgHovedårsak(bruker, 'Saken skal ikke behandles i Hotsak pr. i dag')

    expect(hentRadioAlternativerFraGruppe(/Hvilket område gjelder saken/)).toEqual([
      'Arbeidsliv',
      'Utdanning',
      'Tilskudd',
      'Annet',
    ])
  })

  it('krever fritekst når Feil førsteside velges og sender riktig payload', async () => {
    const { bruker, onBesvar } = renderSkjema()

    await velgHovedårsak(bruker, 'Feil førsteside - ikke 10-07.03-sak')

    const fritekst = screen.getByRole('textbox', { name: /Oppgi hva saken egentlig gjelder/ })
    expect(fritekst).toBeInTheDocument()

    await overfør(bruker)
    expect(await screen.findByText('Må fylles ut')).toBeInTheDocument()
    expect(onBesvar).not.toHaveBeenCalled()

    await bruker.type(fritekst, 'Saken gjelder en annen ytelse')
    await overfør(bruker)

    expect(onBesvar).toHaveBeenCalledTimes(1)
    expect(onBesvar.mock.calls[0][0]).toEqual([
      { type: 'enkeltvalg', spørsmål: HOVEDSPØRSMÅL, sti: [], svar: 'Feil førsteside - ikke 10-07.03-sak' },
      {
        type: 'fritekst',
        spørsmål: 'Oppgi hva saken egentlig gjelder.',
        sti: [HOVEDSPØRSMÅL],
        svar: 'Saken gjelder en annen ytelse',
      },
    ])
  })

  it('krever fritekst når Annet velges i underspørsmål', async () => {
    const { bruker, onBesvar } = renderSkjema()

    await velgHovedårsak(bruker, 'Feil i skanning')
    await bruker.click(
      within(screen.getByRole('radiogroup', { name: /Hva er feil med skanningen/ })).getByRole('radio', {
        name: 'Annet',
      })
    )

    await overfør(bruker)
    expect(await screen.findByText('Må fylles ut')).toBeInTheDocument()
    expect(onBesvar).not.toHaveBeenCalled()

    await bruker.type(
      screen.getByRole('textbox', { name: /Oppgi hva som er feil med skanningen/ }),
      'Skanning av feil dokument'
    )
    await overfør(bruker)

    expect(onBesvar).toHaveBeenCalledTimes(1)
    expect(onBesvar.mock.calls[0][0]).toEqual([
      { type: 'enkeltvalg', spørsmål: HOVEDSPØRSMÅL, sti: [], svar: 'Feil i skanning' },
      { type: 'enkeltvalg', spørsmål: 'Hva er feil med skanningen?', sti: [HOVEDSPØRSMÅL], svar: 'Annet' },
      {
        type: 'fritekst',
        spørsmål: 'Oppgi hva som er feil med skanningen.',
        sti: [HOVEDSPØRSMÅL, 'Hva er feil med skanningen?'],
        svar: 'Skanning av feil dokument',
      },
    ])
  })
})
