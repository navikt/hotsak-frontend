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
  useOppgavebehandlere: () => ({ behandlere: [] }),
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

  return (
    <FormProvider {...form}>
      <TilordneOppgave tildeltEnhet="Testenhet - 2970" />
      <output aria-label="Valgt mappe-ID">{mappeId ?? ''}</output>
    </FormProvider>
  )
}

describe('TilordneOppgave', () => {
  it('lagrer OppgaveMappe.id direkte som mappeId', async () => {
    render(<TestSkjema />)

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Enhetsmappe' }), '663')

    expect(screen.getByLabelText('Valgt mappe-ID')).toHaveTextContent('663')
  })

  it('tømmer mappeId når oppgaven flyttes bort fra enhetens oppgaveliste', async () => {
    render(<TestSkjema />)

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Enhetsmappe' }), '663')
    await userEvent.click(screen.getByRole('radio', { name: /Min oppgaveliste/ }))

    expect(screen.getByLabelText('Valgt mappe-ID')).toBeEmptyDOMElement()
  })

  it('tømmer mappeId når Enhetens liste velges', async () => {
    render(<TestSkjema />)

    const enhetsmappe = screen.getByRole('combobox', { name: 'Enhetsmappe' })
    await userEvent.selectOptions(enhetsmappe, '663')
    await userEvent.selectOptions(enhetsmappe, '')

    expect(screen.getByLabelText('Valgt mappe-ID')).toBeEmptyDOMElement()
  })
})
