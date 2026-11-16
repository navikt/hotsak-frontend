import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { lagJournalpost } from '../mocks/data/lagJournalpost.ts'
import { type Journalpost } from '../types/types.internal.ts'
import { JournalføringDokumenter } from './JournalføringDokumenter.tsx'
import { type JournalføringV2SkjemaVerdier } from './journalføringTypes.ts'

const journalpost: Journalpost = { ...lagJournalpost('1', 'Søknad'), dokumenter: [] }

function TestSkjema() {
  const form = useForm<JournalføringV2SkjemaVerdier>({
    defaultValues: { dokumenterKontrollert: false, overstyrInnsynsregler: '' },
  })
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <JournalføringDokumenter
          journalpost={journalpost}
          dokumentTitler={{}}
          onTittelChange={vi.fn()}
          onChipsChange={vi.fn()}
          readOnly={false}
          visTittelFeil={false}
        />
        <button type="submit">Send</button>
      </form>
    </FormProvider>
  )
}

describe('JournalføringDokumenter innsyn', () => {
  it('gir valideringsfeil når dokumentene ikke er kontrollert', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(
      await screen.findByText(
        'Dersom dokumentene er feilsendt må du overføre saken til Gosys og følge rutinen for håndtering av avvik'
      )
    ).toBeVisible()
  })

  it('foreslår innsyn og viser melding når dokumentene er kontrollert', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('checkbox'))

    expect(screen.getByText(/Foreslått fordi du bekreftet/)).toBeVisible()
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Skal bruker ha innsyn i dokumentene på nav.no?' })).toHaveValue(
        'VISES_MANUELT_GODKJENT'
      )
    )
  })
})
