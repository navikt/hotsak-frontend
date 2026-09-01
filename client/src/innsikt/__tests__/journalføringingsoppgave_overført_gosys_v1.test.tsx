import '@testing-library/jest-dom'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { besvarelseToSvar, type IBesvarelse, type ISvar } from '../Besvarelse'
import { journalføringingsoppgave_overført_gosys_v1 as spørreundersøkelse } from '../journalføringingsoppgave_overført_gosys_v1'
import { SpørreundersøkelseStack } from '../SpørreundersøkelseStack'

const HOVEDSPØRSMÅL = 'Hvorfor overfører du oppgaven til Gosys?'

/**
 * Speiler innsendingen i SpørreundersøkelseModal uten Dialog-en, slik at spørsmålshierarkiet
 * og svartransformasjonen kan testes isolert.
 */
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

type Bruker = ReturnType<typeof userEvent.setup>

function renderSkjema() {
  const bruker = userEvent.setup()
  const onBesvar = vi.fn()
  render(<Skjema onBesvar={onBesvar} />)
  return { bruker, onBesvar }
}

function hovedgruppe() {
  return screen.getByRole('group', { name: new RegExp(HOVEDSPØRSMÅL) })
}

function velgHovedårsak(bruker: Bruker, navn: string) {
  return bruker.click(within(hovedgruppe()).getByRole('checkbox', { name: navn }))
}

function hentAlternativerFraGruppe(gruppenavn: RegExp) {
  return within(screen.getByRole('group', { name: gruppenavn }))
    .getAllByRole('checkbox')
    .map((checkbox) => checkbox.getAttribute('value'))
}

function overfør(bruker: Bruker) {
  return bruker.click(screen.getByRole('button', { name: 'Overfør til Gosys' }))
}

describe('journalføringingsoppgave_overført_gosys_v1', () => {
  it('bruker riktig skjema-id slik at payloaden til overføringsendepunktet er uendret', () => {
    expect(spørreundersøkelse.skjema).toBe('journalføringingsoppgave_overført_gosys_v1')
  })

  it('viser alle hovedårsakene som avkryssingsbokser', () => {
    renderSkjema()

    expect(hentAlternativerFraGruppe(new RegExp(HOVEDSPØRSMÅL))).toEqual([
      'Behov for å sende brev',
      'Saken skal ikke behandles i Hotsak pr. i dag',
      'Feil førsteside - ikke 10-07.03-sak',
      'Feil i skanning',
      'Annet',
    ])
  })

  it('viser og skjuler underspørsmål når hovedårsaker hukes av og av', async () => {
    const { bruker } = renderSkjema()

    await velgHovedårsak(bruker, 'Behov for å sende brev')
    expect(screen.getByRole('group', { name: /Hva har du behov for å sende brev om/ })).toBeInTheDocument()

    await velgHovedårsak(bruker, 'Saken skal ikke behandles i Hotsak pr. i dag')
    expect(screen.getByRole('group', { name: /Hvilket område gjelder saken/ })).toBeInTheDocument()

    await velgHovedårsak(bruker, 'Feil i skanning')
    expect(screen.getByRole('group', { name: /Hva er feil med skanningen/ })).toBeInTheDocument()

    expect(within(hovedgruppe()).getByRole('checkbox', { name: 'Behov for å sende brev' })).toBeChecked()
    expect(within(hovedgruppe()).getByRole('checkbox', { name: 'Feil i skanning' })).toBeChecked()

    await velgHovedårsak(bruker, 'Saken skal ikke behandles i Hotsak pr. i dag')
    expect(screen.queryByRole('group', { name: /Hvilket område gjelder saken/ })).not.toBeInTheDocument()
  })

  it('krever at minst én hovedårsak er valgt', async () => {
    const { bruker, onBesvar } = renderSkjema()

    await overfør(bruker)

    expect(await screen.findByText('Du må velge minst én årsak')).toBeInTheDocument()
    expect(onBesvar).not.toHaveBeenCalled()
  })

  it('krever at underspørsmålet besvares når en hovedårsak med underspørsmål er valgt', async () => {
    const { bruker, onBesvar } = renderSkjema()

    await velgHovedårsak(bruker, 'Feil i skanning')
    await overfør(bruker)

    expect(await screen.findByText('Må fylles ut')).toBeInTheDocument()
    expect(onBesvar).not.toHaveBeenCalled()
  })

  it('krever begrunnelse når Annet velges på toppnivå', async () => {
    const { bruker, onBesvar } = renderSkjema()

    await velgHovedårsak(bruker, 'Annet')
    const begrunnelse = screen.getByRole('textbox', { name: /Hva er grunnen til at du vil overføre oppgaven/ })
    expect(begrunnelse).toBeInTheDocument()

    await overfør(bruker)
    expect(await screen.findByText('Må fylles ut')).toBeInTheDocument()
    expect(onBesvar).not.toHaveBeenCalled()

    await bruker.type(begrunnelse, 'Oppgaven hører hjemme i en annen ytelse')
    await overfør(bruker)

    expect(onBesvar).toHaveBeenCalledTimes(1)
    expect(onBesvar.mock.calls[0][0]).toEqual([
      { type: 'flervalg', spørsmål: HOVEDSPØRSMÅL, sti: [], svar: 'Annet' },
      {
        type: 'fritekst',
        spørsmål: 'Hva er grunnen til at du vil overføre oppgaven?',
        sti: [HOVEDSPØRSMÅL],
        svar: 'Oppgaven hører hjemme i en annen ytelse',
      },
    ])
  })

  it('flater ut flere valgte grener til svar med riktig sti', async () => {
    const { bruker, onBesvar } = renderSkjema()

    await velgHovedårsak(bruker, 'Feil førsteside - ikke 10-07.03-sak')
    await bruker.click(
      within(screen.getByRole('group', { name: /Hva gjelder saken/ })).getByRole('checkbox', { name: 'Tilskudd' })
    )
    await velgHovedårsak(bruker, 'Feil i skanning')
    await bruker.click(
      within(screen.getByRole('group', { name: /Hva er feil med skanningen/ })).getByRole('checkbox', {
        name: 'Bilder med for dårlig kvalitet (reskanning)',
      })
    )

    await overfør(bruker)

    expect(onBesvar).toHaveBeenCalledTimes(1)
    expect(onBesvar.mock.calls[0][0]).toEqual([
      { type: 'flervalg', spørsmål: HOVEDSPØRSMÅL, sti: [], svar: 'Feil førsteside - ikke 10-07.03-sak' },
      { type: 'flervalg', spørsmål: HOVEDSPØRSMÅL, sti: [], svar: 'Feil i skanning' },
      {
        type: 'flervalg',
        spørsmål: 'Hva gjelder saken?',
        sti: [HOVEDSPØRSMÅL],
        svar: 'Tilskudd',
      },
      {
        type: 'flervalg',
        spørsmål: 'Hva er feil med skanningen?',
        sti: [HOVEDSPØRSMÅL],
        svar: 'Bilder med for dårlig kvalitet (reskanning)',
      },
    ])
  })

  it('viser områdespørsmålet under Saken skal ikke behandles i Hotsak uten Tilskudd', async () => {
    const { bruker } = renderSkjema()

    await velgHovedårsak(bruker, 'Saken skal ikke behandles i Hotsak pr. i dag')

    expect(hentAlternativerFraGruppe(/Hvilket område gjelder saken/)).toEqual(['Arbeidsliv', 'Utdanning', 'Annet'])
  })

  it('viser en egen liste med Tilskudd og Annet under Feil førsteside', async () => {
    const { bruker } = renderSkjema()

    await velgHovedårsak(bruker, 'Feil førsteside - ikke 10-07.03-sak')

    expect(hentAlternativerFraGruppe(/Hva gjelder saken/)).toEqual(['Tilskudd', 'Annet'])
    expect(screen.queryByRole('group', { name: /Hvilket område gjelder saken/ })).not.toBeInTheDocument()
  })

  it('krever fritekst når Annet velges under Feil førsteside', async () => {
    const { bruker, onBesvar } = renderSkjema()

    await velgHovedårsak(bruker, 'Feil førsteside - ikke 10-07.03-sak')
    await bruker.click(
      within(screen.getByRole('group', { name: /Hva gjelder saken/ })).getByRole('checkbox', { name: 'Annet' })
    )

    const fritekst = screen.getByRole('textbox', { name: /Oppgi hva saken gjelder/ })
    expect(fritekst).toBeInTheDocument()

    await overfør(bruker)
    expect(await screen.findByText('Må fylles ut')).toBeInTheDocument()
    expect(onBesvar).not.toHaveBeenCalled()

    await bruker.type(fritekst, 'Saken gjelder en annen ytelse')
    await overfør(bruker)

    expect(onBesvar).toHaveBeenCalledTimes(1)
    expect(onBesvar.mock.calls[0][0]).toEqual([
      { type: 'flervalg', spørsmål: HOVEDSPØRSMÅL, sti: [], svar: 'Feil førsteside - ikke 10-07.03-sak' },
      { type: 'flervalg', spørsmål: 'Hva gjelder saken?', sti: [HOVEDSPØRSMÅL], svar: 'Annet' },
      {
        type: 'fritekst',
        spørsmål: 'Oppgi hva saken gjelder.',
        sti: [HOVEDSPØRSMÅL, 'Hva gjelder saken?'],
        svar: 'Saken gjelder en annen ytelse',
      },
    ])
  })
})
