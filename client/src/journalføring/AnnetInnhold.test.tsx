import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { AnnetInnhold } from './AnnetInnhold.tsx'

function RedigerbartAnnetInnhold({ onChipsChange }: { onChipsChange(chips: string[]): void }) {
  const [valgteChips, setValgteChips] = useState<string[]>([])
  return (
    <AnnetInnhold
      alternativer={['Opprinnelig tittel', 'Ny tittel']}
      valgteChips={valgteChips}
      onChipsChange={(chips) => {
        setValgteChips(chips)
        onChipsChange(chips)
      }}
    />
  )
}

describe('AnnetInnhold', () => {
  it('lukker listen ved valg med Enter, beholder fokus og åpner ved neste søk', async () => {
    const user = userEvent.setup()
    const onChipsChange = vi.fn()
    render(<RedigerbartAnnetInnhold onChipsChange={onChipsChange} />)
    const input = screen.getByRole('combobox', { name: 'Annet innhold' })

    await user.click(input)
    await user.type(input, 'Ny tittel')
    await user.keyboard('{ArrowDown}{Enter}')

    expect(onChipsChange).toHaveBeenLastCalledWith(['Ny tittel'])
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('listbox').parentElement).toHaveClass('aksel-combobox__list--closed')
    expect(input).toHaveValue('')

    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    await user.type(input, 'Opprinnelig')
    expect(input).toHaveValue('Opprinnelig')
    expect(input).toHaveAttribute('aria-expanded', 'true')
  })

  it('lukker listen når en ny fritekstverdi legges til med Enter', async () => {
    const user = userEvent.setup()
    const onChipsChange = vi.fn()
    render(<RedigerbartAnnetInnhold onChipsChange={onChipsChange} />)
    const input = screen.getByRole('combobox', { name: 'Annet innhold' })

    await user.click(input)
    await user.type(input, 'Egen verdi{Enter}')

    expect(onChipsChange).toHaveBeenLastCalledWith(['Egen verdi'])
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('listbox').parentElement).toHaveClass('aksel-combobox__list--closed')
    await user.type(input, 'Ny')
    expect(input).toHaveValue('Ny')
    expect(input).toHaveAttribute('aria-expanded', 'true')
  })

  it('holder listen åpen ved musevalg av flere elementer', async () => {
    const user = userEvent.setup()
    const onChipsChange = vi.fn()
    render(<RedigerbartAnnetInnhold onChipsChange={onChipsChange} />)
    const input = screen.getByRole('combobox', { name: 'Annet innhold' })

    await user.click(input)
    await user.type(input, 'Ny')
    await user.click(screen.getByRole('option', { name: 'Ny tittel' }))
    expect(onChipsChange).toHaveBeenLastCalledWith(['Ny tittel'])
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toBeVisible()

    await user.click(screen.getByRole('option', { name: 'Opprinnelig tittel' }))
    expect(onChipsChange).toHaveBeenLastCalledWith(['Ny tittel', 'Opprinnelig tittel'])
    expect(input).toHaveAttribute('aria-expanded', 'true')
  })
})
