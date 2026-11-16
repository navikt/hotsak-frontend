import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { GjelderCombobox } from './GjelderCombobox.tsx'

vi.mock('../../oppgave/useKodeverkOppgave.ts', () => ({
  useGjelderOptions: () => [
    { label: 'Rullestol | Barn', value: 'ab0001|ae0001', searchTerms: 'rullestol barn' },
    { label: 'Seng | Voksen', value: 'ab0002|ae0002', searchTerms: 'seng voksen' },
  ],
}))

const tom = { behandlingstema: '', behandlingstype: '' }

describe('GjelderCombobox', () => {
  it('filtrerer på flere søkeord på tvers av tema og type', async () => {
    render(<GjelderCombobox value={tom} onChange={() => {}} />)

    await userEvent.type(screen.getByRole('combobox', { name: 'Gjelder' }), 'rullestol barn')

    expect(screen.getByRole('option', { name: 'Rullestol | Barn' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Seng | Voksen' })).not.toBeInTheDocument()
  })

  it('kaller onChange med tema og type ved valg', async () => {
    const onChange = vi.fn()
    render(<GjelderCombobox value={tom} onChange={onChange} />)

    await userEvent.click(screen.getByRole('combobox', { name: 'Gjelder' }))
    await userEvent.click(screen.getByRole('option', { name: 'Seng | Voksen' }))

    expect(onChange).toHaveBeenCalledWith({ behandlingstema: 'ab0002', behandlingstype: 'ae0002' })
  })

  it('kaller onChange med tomme verdier når valget fjernes', async () => {
    const onChange = vi.fn()
    render(<GjelderCombobox value={{ behandlingstema: 'ab0001', behandlingstype: 'ae0001' }} onChange={onChange} />)

    await userEvent.click(screen.getByRole('combobox', { name: 'Gjelder' }))
    await userEvent.click(screen.getByRole('option', { name: 'Rullestol | Barn' }))

    expect(onChange).toHaveBeenCalledWith(tom)
  })
})
