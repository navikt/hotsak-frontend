import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { http } from '../io/HttpClient.ts'
import { lagPerson } from '../mocks/data/PersonStore.ts'
import { lagJournalpost } from '../mocks/data/lagJournalpost.ts'
import { PersonContext } from '../personoversikt/PersonContext.tsx'
import { usePerson } from '../personoversikt/usePerson.ts'
import { JournalføringParter } from './JournalføringParter.tsx'

vi.mock('../io/HttpClient.ts', () => ({ http: { post: vi.fn() } }))
vi.mock('../personoversikt/usePerson.ts', () => ({ usePerson: vi.fn() }))

const opprinneligFnr = '01010199999'
const nyttFnr = '02020299999'
const opprinneligPerson = { ...lagPerson(), fnr: opprinneligFnr }
const nyPerson = { ...lagPerson(), fnr: nyttFnr }
const journalpost = {
  ...lagJournalpost('9006', 'Søknad om hjelpemidler'),
  dokumenter: [],
  bruker: { fnr: opprinneligFnr, navn: opprinneligPerson.navn },
}

function TestParter() {
  const [fodselsnummer, setFodselsnummer] = useState(opprinneligFnr)

  return (
    <PersonContext value={{ fodselsnummer, setFodselsnummer }}>
      <output aria-label="Aktivt fødselsnummer">{fodselsnummer}</output>
      <JournalføringParter journalpost={journalpost} tildeltEnhet="Testenhet" kanRedigere />
    </PersonContext>
  )
}

describe('JournalføringParter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePerson).mockImplementation((fnr) => ({
      personInfo: fnr === nyttFnr ? nyPerson : opprinneligPerson,
      isLoading: false,
    }))
  })

  it('oppdaterer aktiv person etter vellykket oppslag', async () => {
    vi.mocked(http.post).mockResolvedValue(nyPerson)
    const user = userEvent.setup()
    render(<TestParter />)

    await user.click(screen.getByRole('button', { name: 'Endre bruker' }))
    await user.clear(screen.getByRole('textbox', { name: 'Fødselsnummer' }))
    await user.type(screen.getByRole('textbox', { name: 'Fødselsnummer' }), nyttFnr)
    await user.click(screen.getByRole('button', { name: 'Velg' }))

    await waitFor(() => expect(screen.getByRole('status', { name: 'Aktivt fødselsnummer' })).toHaveTextContent(nyttFnr))
    expect(screen.queryByRole('textbox', { name: 'Fødselsnummer' })).not.toBeInTheDocument()
  })

  it('beholder aktiv person ved mislykket oppslag', async () => {
    vi.mocked(http.post).mockRejectedValue(new Error('Person ikke funnet'))
    const user = userEvent.setup()
    render(<TestParter />)

    await user.click(screen.getByRole('button', { name: 'Endre bruker' }))
    await user.clear(screen.getByRole('textbox', { name: 'Fødselsnummer' }))
    await user.type(screen.getByRole('textbox', { name: 'Fødselsnummer' }), nyttFnr)
    await user.click(screen.getByRole('button', { name: 'Velg' }))

    expect(await screen.findByText('Bruker ikke funnet i PDL')).toBeVisible()
    expect(screen.getByRole('status', { name: 'Aktivt fødselsnummer' })).toHaveTextContent(opprinneligFnr)
  })
})
