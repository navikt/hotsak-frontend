import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { JournalføringSakvalg } from './JournalføringSakvalg.tsx'

describe('JournalføringSakvalg', () => {
  it('viser antall saker i parentes bak «Koble til sak»', () => {
    render(<JournalføringSakvalg sakType="ny" kanRedigere antallSaker={3} onSakTypeChange={() => {}} />)

    expect(screen.getByRole('radio', { name: 'Koble til sak (3)' })).toBeInTheDocument()
  })

  it('viser «(0)» når brukeren ikke har valgbare saker', () => {
    render(<JournalføringSakvalg sakType="ny" kanRedigere antallSaker={0} onSakTypeChange={() => {}} />)

    expect(screen.getByRole('radio', { name: 'Koble til sak (0)' })).toBeInTheDocument()
  })

  it('viser teksten uten parentes når antallet er ukjent', () => {
    render(<JournalføringSakvalg sakType="ny" kanRedigere onSakTypeChange={() => {}} />)

    expect(screen.getByRole('radio', { name: 'Koble til sak' })).toBeInTheDocument()
  })

  it('skjuler sakvalget når saksbehandleren ikke kan redigere', () => {
    render(<JournalføringSakvalg sakType="ny" kanRedigere={false} antallSaker={3} onSakTypeChange={() => {}} />)

    expect(screen.queryByRole('radio', { name: /Koble til sak/ })).not.toBeInTheDocument()
  })
})
