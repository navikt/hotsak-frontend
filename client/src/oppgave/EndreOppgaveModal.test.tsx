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
vi.mock('./useKodeverkOppgave.ts', () => ({
  useGjelderOptions: () => [
    { label: 'Rullestol | Barn', value: 'ab0001|ae0001', searchTerms: 'rullestol barn' },
    { label: 'Rullestol | Voksen', value: 'ab0001|ae0002', searchTerms: 'rullestol voksen' },
    { label: 'Seng | Voksen', value: 'ab0002|ae0002', searchTerms: 'seng voksen' },
    { label: 'Voksen', value: '|ae0002', searchTerms: 'voksen' },
  ],
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
  kategorisering: {
    oppgavetype: Oppgavetype.JOURNALFØRING,
    tema: 'HJE',
    behandlingstema: { kode: 'ab0001', term: 'Rullestol' },
    behandlingstype: { kode: 'ae0001', term: 'Barn' },
  },
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
      screen.getByLabelText('Sett oppgaven på vent til'),
      screen.getByLabelText('Frist'),
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

  it('lagrer både behandlingstema og behandlingstype når Gjelder endres', async () => {
    const user = userEvent.setup()
    render(<EndreOppgaveModal oppgave={oppgave} onClose={vi.fn()} />)

    await user.click(screen.getByRole('combobox', { name: 'Gjelder' }))
    expect(screen.getByRole('option', { name: 'Rullestol | Barn' })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('option', { name: 'Seng | Voksen' }))
    await user.click(screen.getByRole('button', { name: 'Lagre endringer' }))

    await waitFor(() => expect(trigger).toHaveBeenCalledWith({ behandlingstema: 'ab0002', behandlingstype: 'ae0002' }))
  })

  it('lagrer behandlingstype når en annen type velges for samme behandlingstema', async () => {
    const user = userEvent.setup()
    render(<EndreOppgaveModal oppgave={oppgave} onClose={vi.fn()} />)

    await user.click(screen.getByRole('combobox', { name: 'Gjelder' }))
    await user.click(screen.getByRole('option', { name: 'Rullestol | Voksen' }))
    await user.click(screen.getByRole('button', { name: 'Lagre endringer' }))

    await waitFor(() => expect(trigger).toHaveBeenCalledWith({ behandlingstema: 'ab0001', behandlingstype: 'ae0002' }))
  })

  it('lagrer tomt behandlingstema når et Gjelder-alternativ bare har behandlingstype', async () => {
    const user = userEvent.setup()
    render(<EndreOppgaveModal oppgave={oppgave} onClose={vi.fn()} />)

    await user.click(screen.getByRole('combobox', { name: 'Gjelder' }))
    await user.click(screen.getByRole('option', { name: 'Voksen' }))
    await user.click(screen.getByRole('button', { name: 'Lagre endringer' }))

    await waitFor(() => expect(trigger).toHaveBeenCalledWith({ behandlingstema: '', behandlingstype: 'ae0002' }))
  })

  it('sender tildeltSaksbehandler som null når tildelt saksbehandler fjernes', async () => {
    const user = userEvent.setup()
    render(
      <EndreOppgaveModal
        oppgave={{
          ...oppgave,
          tildeltSaksbehandler: { id: 'S112233', navn: 'Silje' } as Oppgave['tildeltSaksbehandler'],
        }}
        onClose={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Fjern tildelt saksbehandler' }))
    expect(screen.getByText('(Ikke tildelt)', { selector: '.aksel-combobox__selected-options--no-bg' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Lagre endringer' }))

    await waitFor(() => expect(trigger).toHaveBeenCalledWith({ tildeltSaksbehandler: null }))
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

  it('viser feil og lagrer ikke når et nøkkelord er lengre enn 40 tegn', async () => {
    const user = userEvent.setup()
    render(<EndreOppgaveModal oppgave={oppgave} onClose={vi.fn()} />)

    await user.type(screen.getByRole('combobox', { name: 'Nøkkelord' }), 'a'.repeat(41))
    await user.keyboard('{Enter}')
    await user.click(screen.getByRole('button', { name: 'Lagre endringer' }))

    expect(await screen.findByText('Nøkkelord kan ikke være lengre enn 40 tegn')).toBeVisible()
    expect(trigger).not.toHaveBeenCalled()
  })
})
