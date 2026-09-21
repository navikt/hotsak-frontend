import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { Oppgaveprioritet } from '../oppgave/oppgaveTypes.ts'
import { type JournalføringV2SkjemaVerdier } from './journalføringTypes.ts'
import { NySakSkjema } from './NySakSkjema.tsx'

vi.mock('../oppgave/useKodeverkOppgave.ts', () => ({
  useGjelderOptions: () => [
    { label: 'Bare behandlingstema', value: 'ab0550|', searchTerms: 'bare behandlingstema' },
    { label: 'Bare behandlingstype', value: '|ae0034', searchTerms: 'bare behandlingstype' },
  ],
}))

vi.mock('./TilordneOppgave.tsx', () => ({
  TilordneOppgave: () => null,
}))

function TestSkjema({ onSubmit }: { onSubmit(): void }) {
  const form = useForm<JournalføringV2SkjemaVerdier>({
    mode: 'onChange',
    defaultValues: {
      tema: 'HJE',
      behandlingstype: '',
      behandlingstema: '',
      stønadsklassifisering: 'DA',
      stønadsUnderkategori: '',
      stønadType: 'S',
      prioritet: Oppgaveprioritet.NORMAL,
      kommentar: '',
      mottattDato: '2026-09-18',
      aktivFra: '2026-09-18',
      frist: '2026-10-16',
      journalføresPåFnr: '',
      tilordnetEnhet: 'enhetensOppgaveliste',
      medarbeider: '',
    },
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <NySakSkjema kanRedigere tildeltEnhet="Testenhet" setFrist={() => {}} fristProps={{}} fristInputProps={{}} />
        <button type="submit">Journalfør</button>
      </form>
    </FormProvider>
  )
}

describe('NySakSkjema', () => {
  it('viser valideringsfeil og stopper innsending når gjelder ikke er valgt', async () => {
    const onSubmit = vi.fn()
    render(<TestSkjema onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: 'Journalfør' }))

    expect(await screen.findByText('Du må velge hva saken gjelder')).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('godtar valgt gjelder med bare behandlingstema', async () => {
    const onSubmit = vi.fn()
    render(<TestSkjema onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('combobox', { name: 'Gjelder' }))
    await userEvent.click(screen.getByRole('option', { name: 'Bare behandlingstema' }))
    await userEvent.click(screen.getByRole('button', { name: 'Journalfør' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    expect(screen.queryByText('Du må velge hva saken gjelder')).not.toBeInTheDocument()
  })

  it('godtar valgt gjelder med bare behandlingstype', async () => {
    const onSubmit = vi.fn()
    render(<TestSkjema onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: 'Journalfør' }))
    expect(await screen.findByText('Du må velge hva saken gjelder')).toBeVisible()

    await userEvent.click(screen.getByRole('combobox', { name: 'Gjelder' }))
    await userEvent.click(screen.getByRole('option', { name: 'Bare behandlingstype' }))
    await waitFor(() => expect(screen.queryByText('Du må velge hva saken gjelder')).not.toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: 'Journalfør' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
  })
})
