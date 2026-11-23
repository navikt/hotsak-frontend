import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { lagJournalpost } from '../mocks/data/lagJournalpost.ts'
import { type Journalpost } from '../types/types.internal.ts'
import { JournalføringDokumenter } from './JournalføringDokumenter.tsx'
import { type JournalføringSkjemaVerdier } from './journalføringTypes.ts'

const journalpost: Journalpost = { ...lagJournalpost('1', 'Søknad'), dokumenter: [] }
const innsynSelect = { name: 'Skal bruker ha innsyn i dokumentene på nav.no?' }
const overføringFeil = 'Hvis dokumentet inneholder informasjon om andre brukere, skal dokumentet skjules for bruker'

function TestSkjema({ onSubmit = vi.fn() }: { onSubmit?: () => void }) {
  const form = useForm<JournalføringSkjemaVerdier>({
    mode: 'onChange',
    defaultValues: { dokumentkontroll: '', dokumentavvik: '', overstyrInnsynsregler: '' },
  })
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
  it('gir valideringsfeil når kontrollspørsmålet ikke er besvart', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(
      await screen.findByText('Du må svare på om du kan bekrefte at dokumentene ligger på riktig bruker')
    ).toBeVisible()
  })

  it('foreslår innsyn og viser melding når dokumentene er bekreftet', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('radio', { name: 'Ja' }))

    expect(screen.getByText(/Foreslått fordi du bekreftet/)).toBeVisible()
    await waitFor(() => expect(screen.getByRole('combobox', innsynSelect)).toHaveValue('VISES_MANUELT_GODKJENT'))
  })

  it('foreslår å skjule innhold ved overføring og avviser bare synlige dokumenter', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('radio', { name: /^Nei/ }))
    await user.click(screen.getByRole('radio', { name: /^Overføring av hjelpemiddel/ }))

    const select = screen.getByRole('combobox', innsynSelect)
    await waitFor(() => expect(select).toHaveValue('BRUK_STANDARDREGLER'))
    expect(screen.getByText(/Foreslått fordi du bekreftet at dokumentene gjelder overføring/)).toBeVisible()

    await user.selectOptions(select, 'SKJULES_BRUKERS_ONSKE')
    expect(screen.queryByText(/gjelder overføring/)).not.toBeInTheDocument()
    expect(screen.queryByText(overføringFeil)).not.toBeInTheDocument()

    await user.selectOptions(select, 'VISES_MANUELT_GODKJENT')
    expect(await screen.findByText(overføringFeil)).toBeVisible()
  })

  it('viser ikke overføringsfeil når kontrollen endres til Ja', async () => {
    const user = userEvent.setup()
    render(<TestSkjema />)

    await user.click(screen.getByRole('radio', { name: /^Nei/ }))
    await user.click(screen.getByRole('radio', { name: /^Overføring av hjelpemiddel/ }))
    await user.click(screen.getByRole('radio', { name: 'Ja' }))

    await waitFor(() => expect(screen.getByRole('combobox', innsynSelect)).toHaveValue('VISES_MANUELT_GODKJENT'))
    expect(screen.queryByText(overføringFeil)).not.toBeInTheDocument()
  })

  it('ber om overføring til Gosys og blokkerer innsending når det ikke gjelder overføring', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<TestSkjema onSubmit={onSubmit} />)

    await user.click(screen.getByRole('radio', { name: /^Nei/ }))
    await user.click(screen.getByRole('radio', { name: /men gjelder ikke overføring/ }))

    expect(screen.getByText('Du må overføre saken til Gosys')).toBeVisible()
    expect(screen.queryByRole('combobox', innsynSelect)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('radio', { name: /men gjelder ikke overføring/ })).toHaveFocus()
  })
})
