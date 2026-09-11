import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { type AlternativeProduct } from '../../../saksbilde/hjelpemidler/useAlternativeProdukter.ts'
import { PunchetHjelpemiddelV2 } from './PunchetHjelpemiddelV2.tsx'

vi.mock('../../../saksbilde/hjelpemidler/endreHjelpemiddel/EndreHjelpemiddelModal.tsx', () => ({
  EndreHjelpemiddelModal: () => null,
}))

describe('PunchetHjelpemiddelV2', () => {
  it('viser beste rangering, alternativliste, min/max og produktbilde', () => {
    const alternativtProdukt: AlternativeProduct = {
      id: 'alternativ-1',
      hmsArtNr: '654321',
      title: 'Alternativ',
      articleName: 'Alternativ',
      supplier: { id: 'leverandor-1', name: 'Leverandør' },
      isoCategory: '12',
      alternativeFor: ['123456'],
      media: [],
      wareHouseStock: [],
    }

    render(
      <PunchetHjelpemiddelV2
        hjelpemiddel={{ id: '1', hmsnummer: '123456', antall: 2 }}
        produkt={{
          hmsArtNr: '123456',
          artikkelnavn: 'Rullestol',
          isotittel: 'Manuelle rullestoler',
          produktUrl: '',
          produktbildeUri: '/rullestol.png',
          delkontrakter: [
            { rangering: 3, posttittel: 'Delkontrakt 3' },
            { rangering: 1, posttittel: 'Delkontrakt 1' },
          ],
        }}
        alternativeProdukter={[alternativtProdukt]}
        minmaxStyrt
        onEndre={vi.fn()}
        onSlett={vi.fn()}
      />
    )

    expect(screen.getByText('Rangering 1')).toBeInTheDocument()
    expect(screen.getByText('Har alternativliste')).toBeInTheDocument()
    expect(screen.getByText('Min/max lagervare')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Rullestol' })).toHaveAttribute('src', '/rullestol.png')
  })
})
