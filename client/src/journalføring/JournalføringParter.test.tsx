import '@testing-library/jest-dom'

import { act, render, screen, waitFor } from '@testing-library/react'
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
const avsenderFnr = '03030399999'
const nyttAvsenderFnr = '04040499999'
const opprinneligPerson = { ...lagPerson(), fnr: opprinneligFnr }
const opprinneligAvsender = { ...lagPerson(), fnr: avsenderFnr }
const nyPerson = { ...lagPerson(), fnr: nyttFnr }
const nyAvsender = { ...lagPerson(), fnr: nyttAvsenderFnr }
const journalpost = {
  ...lagJournalpost('9006', 'Søknad om hjelpemidler', {
    brukerFnr: opprinneligFnr,
    avsenderFnr,
  }),
  dokumenter: [],
  bruker: { fnr: opprinneligFnr, navn: opprinneligPerson.navn },
}

function TestParter({
  initialAvsenderFnr = avsenderFnr,
  kanRedigere = true,
}: {
  initialAvsenderFnr?: string
  kanRedigere?: boolean
}) {
  const [fodselsnummer, setFodselsnummer] = useState(opprinneligFnr)
  const [gjeldendeAvsenderFnr, setGjeldendeAvsenderFnr] = useState(initialAvsenderFnr)

  return (
    <PersonContext value={{ fodselsnummer, setFodselsnummer }}>
      <output aria-label="Aktivt fødselsnummer">{fodselsnummer}</output>
      <output aria-label="Avsenders fødselsnummer">{gjeldendeAvsenderFnr}</output>
      <JournalføringParter
        journalpost={journalpost}
        tildeltEnhet="Testenhet"
        kanRedigere={kanRedigere}
        avsenderFnr={gjeldendeAvsenderFnr}
        onAvsenderChange={setGjeldendeAvsenderFnr}
        onBrukerChange={setFodselsnummer}
      />
    </PersonContext>
  )
}

describe('JournalføringParter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePerson).mockImplementation((fnr) => ({
      personInfo:
        fnr === nyttFnr
          ? nyPerson
          : fnr === nyttAvsenderFnr
            ? nyAvsender
            : fnr === avsenderFnr
              ? opprinneligAvsender
              : opprinneligPerson,
      isLoading: false,
    }))
  })

  it('viser ulike bruker- og avsendernumre og begge endreknappene', () => {
    render(<TestParter />)

    expect(screen.getByRole('status', { name: 'Aktivt fødselsnummer' })).toHaveTextContent(opprinneligFnr)
    expect(screen.getByRole('status', { name: 'Avsenders fødselsnummer' })).toHaveTextContent(avsenderFnr)
    expect(screen.getByText(/ - 01010199999$/)).toBeVisible()
    expect(screen.getByText(/ - 03030399999$/)).toBeVisible()
    expect(screen.getByRole('button', { name: 'Endre bruker' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Endre avsender' })).toBeInTheDocument()
  })

  it('viser begge endreknappene også når partene er like', () => {
    render(<TestParter initialAvsenderFnr={opprinneligFnr} />)

    expect(screen.getByRole('button', { name: 'Endre bruker' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Endre avsender' })).toBeInTheDocument()
  })

  it('skjuler redigeringsknappene når oppgaven er skrivebeskyttet', () => {
    render(<TestParter kanRedigere={false} />)

    expect(screen.queryByRole('button', { name: 'Endre bruker' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Endre avsender' })).not.toBeInTheDocument()
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
    expect(screen.getByRole('status', { name: 'Avsenders fødselsnummer' })).toHaveTextContent(avsenderFnr)
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

  it('endrer avsender uten å endre bruker eller aktiv person', async () => {
    vi.mocked(http.post).mockResolvedValue(nyAvsender)
    const user = userEvent.setup()
    render(<TestParter />)

    await user.click(screen.getByRole('button', { name: 'Endre avsender' }))
    await user.clear(screen.getByRole('textbox', { name: 'Avsenders fødselsnummer' }))
    await user.type(screen.getByRole('textbox', { name: 'Avsenders fødselsnummer' }), nyttAvsenderFnr)
    await user.click(screen.getByRole('button', { name: 'Velg avsender' }))

    expect(screen.getByRole('status', { name: 'Aktivt fødselsnummer' })).toHaveTextContent(opprinneligFnr)
    expect(screen.getByRole('status', { name: 'Avsenders fødselsnummer' })).toHaveTextContent(nyttAvsenderFnr)
  })

  it('beholder begge parter ved mislykket avsenderoppslag', async () => {
    vi.mocked(http.post).mockRejectedValue(new Error('Person ikke funnet'))
    const user = userEvent.setup()
    render(<TestParter />)

    await user.click(screen.getByRole('button', { name: 'Endre avsender' }))
    await user.clear(screen.getByRole('textbox', { name: 'Avsenders fødselsnummer' }))
    await user.type(screen.getByRole('textbox', { name: 'Avsenders fødselsnummer' }), nyttAvsenderFnr)
    await user.click(screen.getByRole('button', { name: 'Velg avsender' }))

    expect(await screen.findByText('Avsender ikke funnet i PDL')).toBeVisible()
    expect(screen.getByRole('status', { name: 'Aktivt fødselsnummer' })).toHaveTextContent(opprinneligFnr)
    expect(screen.getByRole('status', { name: 'Avsenders fødselsnummer' })).toHaveTextContent(avsenderFnr)
  })

  it('beholder avsender når brukeren endres fra samme fødselsnummer', async () => {
    vi.mocked(http.post).mockResolvedValue(nyPerson)
    const user = userEvent.setup()
    render(<TestParter initialAvsenderFnr={opprinneligFnr} />)

    await user.click(screen.getByRole('button', { name: 'Endre bruker' }))
    await user.clear(screen.getByRole('textbox', { name: 'Fødselsnummer' }))
    await user.type(screen.getByRole('textbox', { name: 'Fødselsnummer' }), nyttFnr)
    await user.click(screen.getByRole('button', { name: 'Velg' }))

    expect(screen.getByRole('status', { name: 'Aktivt fødselsnummer' })).toHaveTextContent(nyttFnr)
    expect(screen.getByRole('status', { name: 'Avsenders fødselsnummer' })).toHaveTextContent(opprinneligFnr)
    expect(screen.getByRole('button', { name: 'Endre avsender' })).toBeInTheDocument()
  })

  it('avbryter bare eget oppslag og ignorerer et sent svar', async () => {
    let svarBruker!: (person: typeof nyPerson) => void
    let svarAvsender!: (person: typeof nyAvsender) => void
    const brukeroppslag = new Promise<typeof nyPerson>((resolve) => {
      svarBruker = resolve
    })
    const avsenderoppslag = new Promise<typeof nyAvsender>((resolve) => {
      svarAvsender = resolve
    })
    vi.mocked(http.post).mockReturnValueOnce(brukeroppslag).mockReturnValueOnce(avsenderoppslag)
    const user = userEvent.setup()
    render(<TestParter />)

    await user.click(screen.getByRole('button', { name: 'Endre bruker' }))
    await user.clear(screen.getByRole('textbox', { name: 'Fødselsnummer' }))
    await user.type(screen.getByRole('textbox', { name: 'Fødselsnummer' }), nyttFnr)
    await user.click(screen.getByRole('button', { name: 'Velg' }))

    await user.click(screen.getByRole('button', { name: 'Endre avsender' }))
    await user.clear(screen.getByRole('textbox', { name: 'Avsenders fødselsnummer' }))
    await user.type(screen.getByRole('textbox', { name: 'Avsenders fødselsnummer' }), nyttAvsenderFnr)
    await user.click(screen.getByRole('button', { name: 'Velg avsender' }))

    await user.click(screen.getAllByRole('button', { name: 'Avbryt' })[0])
    await act(async () => svarAvsender(nyAvsender))
    expect(screen.getByRole('status', { name: 'Avsenders fødselsnummer' })).toHaveTextContent(nyttAvsenderFnr)

    await act(async () => svarBruker(nyPerson))
    expect(screen.getByRole('status', { name: 'Aktivt fødselsnummer' })).toHaveTextContent(opprinneligFnr)
    expect(screen.getByRole('status', { name: 'Avsenders fødselsnummer' })).toHaveTextContent(nyttAvsenderFnr)
  })
})
