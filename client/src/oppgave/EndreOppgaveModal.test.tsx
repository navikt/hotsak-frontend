import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EndreOppgaveModal } from './EndreOppgaveModal.tsx'
import { type Oppgave, Oppgaveprioritet, Oppgavestatus, Oppgavetype, Statuskategori } from './oppgaveTypes.ts'
import { useOppgaveNøkkelord } from './useOppgave.ts'

const { trigger } = vi.hoisted(() => ({ trigger: vi.fn() }))

vi.mock('./useOppgave.ts', () => ({
  useOppgaveMapper: () => [],
  useOppgaveNøkkelord: vi.fn(() => ['Haster', 'Telefon']),
  mutateOppgave: vi.fn(),
}))
vi.mock('./useOppgavebehandlere.ts', () => ({
  useOppgavebehandlere: () => ({ behandlere: [] }),
}))
vi.mock('./useKodeverkOppgave.ts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./useKodeverkOppgave.ts')>()),
  useKodeverkGjelder: () => [],
}))
vi.mock('./useOppgaveActions.ts', () => ({
  useOppgaveActions: () => ({ patchOppgave: { trigger } }),
}))
vi.mock('../oppgaveliste/useMutateOppgaver.ts', () => ({
  useMutateOppgaver: () => vi.fn(),
}))
vi.mock('../felleskomponenter/toast/useToast.ts', () => ({
  useToast: () => ({ showSuccessToast: vi.fn(), showErrorToast: vi.fn() }),
}))

const oppgave: Oppgave = {
  oppgaveId: '1',
  versjon: 1,
  oppgavestatus: Oppgavestatus.OPPRETTET,
  statuskategori: Statuskategori.ÅPEN,
  prioritet: Oppgaveprioritet.NORMAL,
  kategorisering: { oppgavetype: Oppgavetype.JOURNALFØRING, tema: 'HJE' },
  tildeltEnhet: { nummer: '4700', navn: 'Testenhet' },
  aktivDato: '2026-11-17',
  nøkkelord: ['Eget nøkkelord'],
  isBehandlesAvApplikasjonHotsak: true,
  isJournalføringsoppgave: true,
}

describe('EndreOppgaveModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useOppgaveNøkkelord).mockReturnValue(['Haster', 'Telefon'])
  })

  it('filtrerer forslag fra nøkkelordhentingen og lagrer valget sammen med eksisterende nøkkelord', async () => {
    const user = userEvent.setup()
    render(<EndreOppgaveModal oppgave={oppgave} onClose={vi.fn()} />)

    await user.type(screen.getByRole('combobox', { name: 'Nøkkelord' }), 'has')

    expect(screen.getByRole('option', { name: 'Haster' })).toBeVisible()
    expect(screen.queryByRole('option', { name: 'Telefon' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Haster' }))
    await user.click(screen.getByRole('button', { name: 'Lagre endringer' }))

    await waitFor(() => expect(trigger).toHaveBeenCalledWith({ nøkkelord: ['Eget nøkkelord', 'Haster'] }))
  })

  it('viser feltene i riktig rekkefølge og bruker oppgavens prioritet som standard', () => {
    render(<EndreOppgaveModal oppgave={oppgave} onClose={vi.fn()} />)

    const fields = [
      screen.getByLabelText('Gjelder'),
      screen.getByLabelText('Aktiv dato'),
      screen.getByLabelText('Frist dato'),
      screen.getByLabelText('Prioritet'),
      screen.getByLabelText('Nøkkelord'),
      screen.getByLabelText('Tildelt saksbehandler'),
      screen.getByLabelText('Mappe'),
      screen.getByLabelText('Kommentar (valgfri)'),
    ]

    fields.slice(0, -1).forEach((field, index) => {
      expect(field.compareDocumentPosition(fields[index + 1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
    expect(screen.getByRole('combobox', { name: 'Prioritet' })).toHaveValue(Oppgaveprioritet.NORMAL)
  })

  it('sender bare prioritet når prioriteten endres', async () => {
    const user = userEvent.setup()
    render(<EndreOppgaveModal oppgave={oppgave} onClose={vi.fn()} />)

    await user.selectOptions(screen.getByRole('combobox', { name: 'Prioritet' }), Oppgaveprioritet.HØY)
    await user.click(screen.getByRole('button', { name: 'Lagre endringer' }))

    await waitFor(() => expect(trigger).toHaveBeenCalledWith({ prioritet: Oppgaveprioritet.HØY }))
  })

  it('beholder egne nøkkelord og tillater nye verdier når ingen forslag er tilgjengelige', async () => {
    vi.mocked(useOppgaveNøkkelord).mockReturnValue([])
    const user = userEvent.setup()
    render(<EndreOppgaveModal oppgave={oppgave} onClose={vi.fn()} />)

    const input = screen.getByRole('combobox', { name: 'Nøkkelord' })
    await user.click(input)
    expect(screen.getByRole('option', { name: 'Eget nøkkelord' })).toHaveAttribute('aria-selected', 'true')

    await user.type(input, 'Nytt nøkkelord')
    await user.keyboard('{Enter}')
    await user.click(screen.getByRole('button', { name: 'Lagre endringer' }))

    await waitFor(() => expect(trigger).toHaveBeenCalledWith({ nøkkelord: ['Eget nøkkelord', 'Nytt nøkkelord'] }))
  })
})
