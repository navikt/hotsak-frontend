import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { useState } from 'react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { lagPerson } from '../../mocks/data/PersonStore.ts'
import { PersonContext } from '../../personoversikt/PersonContext.tsx'
import { Personlinje } from './Personlinje.tsx'

const opprinneligPerson = { ...lagPerson(), fnr: '01010199999' }
const valgtFnr = '02020299999'

function TestPersonlinje({ vis = true }: { vis?: boolean }) {
  const [fodselsnummer, setFodselsnummer] = useState(valgtFnr)

  return (
    <MemoryRouter>
      <PersonContext value={{ fodselsnummer, setFodselsnummer }}>
        <output aria-label="Aktivt fødselsnummer">{fodselsnummer}</output>
        {vis && <Personlinje person={opprinneligPerson} loading={false} />}
      </PersonContext>
    </MemoryRouter>
  )
}

describe('Personlinje', () => {
  it('endrer ikke valgt fødselsnummer når en person vises eller fjernes', () => {
    const { rerender } = render(<TestPersonlinje />)
    const aktivt = () => screen.getByRole('status', { name: 'Aktivt fødselsnummer' })

    expect(aktivt()).toHaveTextContent(valgtFnr)

    rerender(<TestPersonlinje vis={false} />)
    expect(aktivt()).toHaveTextContent(valgtFnr)
  })
})
