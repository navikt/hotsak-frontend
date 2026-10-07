import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { lagPerson } from '../../mocks/data/PersonStore.ts'
import { PersonContext } from '../../personoversikt/PersonContext.tsx'
import { Personlinje } from './Personlinje.tsx'

const opprinneligPerson = { ...lagPerson(), fnr: '01010199999' }
const nyttFnr = '02020299999'

function TestPersonlinje({ lasterNyPerson = false, vis = true }: { lasterNyPerson?: boolean; vis?: boolean }) {
  const [fodselsnummer, setFodselsnummer] = useState(opprinneligPerson.fnr)

  return (
    <MemoryRouter>
      <PersonContext value={{ fodselsnummer, setFodselsnummer }}>
        <output aria-label="Aktivt fødselsnummer">{fodselsnummer}</output>
        <button type="button" onClick={() => setFodselsnummer(nyttFnr)}>
          Velg ny bruker
        </button>
        {vis && <Personlinje person={lasterNyPerson ? undefined : opprinneligPerson} loading={lasterNyPerson} />}
      </PersonContext>
    </MemoryRouter>
  )
}

describe('Personlinje', () => {
  it('tømmer ikke valgt fødselsnummer når person byttes', async () => {
    const { rerender } = render(<TestPersonlinje />)
    await userEvent.click(screen.getByRole('button', { name: 'Velg ny bruker' }))

    rerender(<TestPersonlinje lasterNyPerson />)

    expect(screen.getByRole('status', { name: 'Aktivt fødselsnummer' })).toHaveTextContent(nyttFnr)
  })

  it('tømmer fødselsnummeret ved unmount etter at personen er vist', () => {
    const { rerender } = render(<TestPersonlinje />)

    rerender(<TestPersonlinje vis={false} />)

    expect(screen.getByRole('status', { name: 'Aktivt fødselsnummer' })).toBeEmptyDOMElement()
  })
})
