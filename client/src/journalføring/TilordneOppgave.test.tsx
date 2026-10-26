import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { type JournalføringV2SkjemaVerdier } from './journalføringTypes.ts'
import { TilordneOppgave } from './TilordneOppgave.tsx'

vi.mock('../oppgave/useOppgave.ts', () => ({
  useOppgaveMapper: () => [{ id: 663, navn: 'Enhetsmappe A' }],
}))

vi.mock('../oppgave/useOppgavebehandlere.ts', () => ({
  useOppgavebehandlere: () => ({
    behandlere: [
      { id: 'ansatt-1', navn: 'Kari Nordmann' },
      { id: 'ansatt-2', navn: 'Ola Hansen' },
      { id: 'ansatt-3', navn: 'Silje Saksbehandler' },
      { id: 'ansatt-4', navn: 'Vurder Vilkårsen' },
      { id: 'ansatt-5', navn: 'Lese Visingsrud' },
      { id: 'ansatt-6', navn: 'Per Ove Olsen' },
    ],
  }),
}))

vi.mock('../tilgang/useTilgang.ts', () => ({
  useInnloggetAnsatt: () => ({
    gjeldendeEnhet: { nummer: '2970' },
    navn: 'Test Testesen',
  }),
}))

function TestSkjema() {
  const form = useForm<JournalføringV2SkjemaVerdier>({
    defaultValues: {
      tilordnetEnhet: 'enhetensOppgaveliste',
    },
  })
  const mappeId = form.watch('mappeId')
  const medarbeider = form.watch('medarbeider')

  return (
    <FormProvider {...form}>
      <TilordneOppgave tildeltEnhet="Testenhet - 2970" />
      <output aria-label="Valgt mappe-ID">{mappeId ?? ''}</output>
      <output aria-label="Valgt medarbeider-ID">{medarbeider ?? ''}</output>
    </FormProvider>
  )
}

describe('TilordneOppgave', () => {
  it('lagrer OppgaveMappe.id direkte som mappeId', async () => {
    render(<TestSkjema />)

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Legg i mappe (frivillig)' }), '663')

    expect(screen.getByLabelText('Valgt mappe-ID')).toHaveTextContent('663')
  })

  it.each([
    ['Min oppgaveliste', /Min oppgaveliste/],
    ['medarbeiders oppgaveliste', /Medarbeider sin oppgaveliste/],
    ['Min enhet', /Min enhet/],
  ])('viser mappevalg ved valg av %s', async (_label, radioName) => {
    render(<TestSkjema />)

    await userEvent.click(screen.getByRole('radio', { name: radioName }))

    expect(screen.getByRole('combobox', { name: 'Legg i mappe (frivillig)' })).toBeVisible()
  })

  it('beholder mappeId når oppgaven flyttes bort fra enhetens oppgaveliste', async () => {
    render(<TestSkjema />)

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Legg i mappe (frivillig)' }), '663')
    await userEvent.click(screen.getByRole('radio', { name: /Min oppgaveliste/ }))

    expect(screen.getByLabelText('Valgt mappe-ID')).toHaveTextContent('663')
  })

  it('tømmer mappeId når Enhetens liste velges', async () => {
    render(<TestSkjema />)

    const enhetsmappe = screen.getByRole('combobox', { name: 'Legg i mappe (frivillig)' })
    await userEvent.selectOptions(enhetsmappe, '663')
    await userEvent.selectOptions(enhetsmappe, '')

    expect(screen.getByLabelText('Valgt mappe-ID')).toBeEmptyDOMElement()
  })

  it('lagrer valgt medarbeiders ID i skjemaet', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('radio', { name: /Medarbeider sin oppgaveliste/ }))
    await user.type(screen.getByRole('combobox', { name: 'Medarbeider' }), 'Kari')
    await user.click(screen.getByRole('option', { name: 'Kari Nordmann' }))

    expect(screen.getByLabelText('Valgt medarbeider-ID')).toHaveTextContent('ansatt-1')
    expect(screen.getByRole('option', { name: 'Kari Nordmann' })).toHaveAttribute('aria-selected', 'true')
  })

  it('finner medarbeider med deler av fornavn og etternavn', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('radio', { name: /Medarbeider sin oppgaveliste/ }))
    await user.type(screen.getByRole('combobox', { name: 'Medarbeider' }), 'si sa')

    expect(screen.getByRole('option', { name: 'Silje Saksbehandler' })).toBeVisible()
    expect(screen.queryByRole('option', { name: 'Kari Nordmann' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Silje Saksbehandler' }))

    expect(screen.getByLabelText('Valgt medarbeider-ID')).toHaveTextContent('ansatt-3')
  })

  it('krever at søkeordene treffer hver sin navnedel', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('radio', { name: /Medarbeider sin oppgaveliste/ }))
    await user.type(screen.getByRole('combobox', { name: 'Medarbeider' }), 'v vi')

    expect(screen.getByRole('option', { name: 'Vurder Vilkårsen' })).toBeVisible()
    expect(screen.queryByRole('option', { name: 'Lese Visingsrud' })).not.toBeInTheDocument()
  })

  it('finner medarbeider når søkeordene er inne i navnedelene', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('radio', { name: /Medarbeider sin oppgaveliste/ }))
    await user.type(screen.getByRole('combobox', { name: 'Medarbeider' }), 'urd års')

    expect(screen.getByRole('option', { name: 'Vurder Vilkårsen' })).toBeVisible()
    expect(screen.queryByRole('option', { name: 'Lese Visingsrud' })).not.toBeInTheDocument()
  })

  it('finner etternavnet selv om medarbeideren har mellomnavn', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('radio', { name: /Medarbeider sin oppgaveliste/ }))
    await user.type(screen.getByRole('combobox', { name: 'Medarbeider' }), 'er ol')

    expect(screen.getByRole('option', { name: 'Per Ove Olsen' })).toBeVisible()
  })

  it('tømmer medarbeider når valget fjernes', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('radio', { name: /Medarbeider sin oppgaveliste/ }))
    await user.click(screen.getByRole('combobox', { name: 'Medarbeider' }))
    await user.click(screen.getByRole('option', { name: 'Kari Nordmann' }))
    await user.click(screen.getByRole('combobox', { name: 'Medarbeider' }))
    await user.click(screen.getByRole('option', { name: 'Kari Nordmann' }))

    expect(screen.getByLabelText('Valgt medarbeider-ID')).toBeEmptyDOMElement()
  })

  it('lar ikke fritekst bli til en medarbeider-ID', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('radio', { name: /Medarbeider sin oppgaveliste/ }))
    await user.type(screen.getByRole('combobox', { name: 'Medarbeider' }), 'Ukjent medarbeider')

    expect(screen.queryByRole('option', { name: 'Ukjent medarbeider' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Valgt medarbeider-ID')).toBeEmptyDOMElement()
  })
})
