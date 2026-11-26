import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { BrevHeaderInnstillinger } from '../BrevHeader.tsx'
import { type BrukerSomMottaker } from '../useBrukerSomMottaker.ts'

vi.mock('../DelKopiMedFormidler.tsx', () => ({ DelKopiMedFormidler: () => null }))

function lagMottakervalg(): BrukerSomMottaker {
  return {
    valgt: false,
    lagrer: false,
    kanEndre: true,
    kanSende: true,
    velgBruker: vi.fn<(skalMotta: boolean) => Promise<void>>().mockResolvedValue(undefined),
  }
}

function innstillinger(brukerSomMottaker?: BrukerSomMottaker) {
  return (
    <BrevHeaderInnstillinger
      valgtBrevId="brev-1"
      mottakere={{ brevmottakere: [] }}
      kanRedigere
      vedtaksbrev={false}
      brukerSomMottaker={brukerSomMottaker}
    />
  )
}

afterEach(cleanup)

describe('BrevHeaderInnstillinger', () => {
  it('viser ikke mottakervalget for andre brevmaler', () => {
    render(innstillinger())
    expect(screen.queryByRole('checkbox', { name: 'Send også til bruker' })).not.toBeInTheDocument()
  })

  it('viser lagret valg og lar bruker med verger legges til og fjernes', async () => {
    const user = userEvent.setup()
    const mottakervalg = lagMottakervalg()
    const { rerender } = render(innstillinger(mottakervalg))
    const checkbox = screen.getByRole('checkbox', { name: 'Send også til bruker' })
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(mottakervalg.velgBruker).toHaveBeenLastCalledWith(true)

    rerender(innstillinger({ ...mottakervalg, valgt: true }))
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(mottakervalg.velgBruker).toHaveBeenLastCalledWith(false)
  })

  it('deaktiverer mottakervalget når det ikke kan endres', async () => {
    const user = userEvent.setup()
    const mottakervalg = { ...lagMottakervalg(), kanEndre: false }
    render(innstillinger(mottakervalg))
    const checkbox = screen.getByRole('checkbox', { name: 'Send også til bruker' })

    expect(checkbox).toBeDisabled()
    await user.click(checkbox)
    expect(mottakervalg.velgBruker).not.toHaveBeenCalled()
  })
})
