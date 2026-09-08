import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { HttpError } from '../io/HttpError.ts'
import { KobleTilSakKort } from './KobleTilSakKort.tsx'
import { MAKS_SAKER_SYNLIG, type SakvalgVisning } from './useKobleTilSak.ts'

function lagSak(sakId: string): SakvalgVisning {
  return {
    valg: { sakId, fagsaksystem: 'hotsak' },
    sakId,
    gjelder: 'Hjelpemidler',
    dato: '2024-08-21T07:54:14Z',
    fagsystemLabel: 'Hotsak',
  }
}

const énSak = [lagSak('9901')]

describe('KobleTilSakKort', () => {
  it('viser lasteindikator mens sakene hentes', () => {
    render(<KobleTilSakKort saker={[]} isLoading valgtSak={null} onChange={() => {}} />)

    expect(screen.getByText('Henter saker...', { selector: 'p' })).toBeInTheDocument()
  })

  it('viser feilmelding når hentingen feiler', () => {
    render(
      <KobleTilSakKort
        saker={[]}
        isLoading={false}
        error={HttpError.INTERNAL_SERVER_ERROR}
        valgtSak={null}
        onChange={() => {}}
      />
    )

    expect(screen.getByText('Feil med hending av saker')).toBeInTheDocument()
  })

  it('viser tom-melding når brukeren ikke har valgbare saker', () => {
    render(<KobleTilSakKort saker={[]} isLoading={false} valgtSak={null} onChange={() => {}} />)

    expect(screen.getByText('Ingen saker funnet for denne brukeren.')).toBeInTheDocument()
  })

  it('melder fra om valgt sak', async () => {
    const onChange = vi.fn()
    render(<KobleTilSakKort saker={énSak} isLoading={false} valgtSak={null} onChange={onChange} />)

    await userEvent.click(screen.getByRole('radio', { name: /Velg sak 9901/ }))

    expect(onChange).toHaveBeenCalledWith({ sakId: '9901', fagsaksystem: 'hotsak' })
  })

  it('begrenser listen og lar brukeren vise alle saker', async () => {
    const saker = Array.from({ length: MAKS_SAKER_SYNLIG + 2 }, (_, nr) => lagSak(`sak-${nr}`))
    render(<KobleTilSakKort saker={saker} isLoading={false} valgtSak={null} onChange={() => {}} />)

    expect(screen.getAllByRole('radio')).toHaveLength(MAKS_SAKER_SYNLIG)

    await userEvent.click(screen.getByRole('button', { name: `Vis alle (${saker.length})` }))

    expect(screen.getAllByRole('radio')).toHaveLength(saker.length)
    expect(screen.getByRole('button', { name: 'Vis færre' })).toBeInTheDocument()
  })
})
