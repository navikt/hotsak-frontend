import '@testing-library/jest-dom'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { SearchableSelect } from './SearchableSelect.tsx'

const suggestions = ['Første tittel', 'Andre tittel']

function TestForm({ onSubmit = vi.fn() }: { onSubmit?: () => void }) {
  const form = useForm()
  const [title, setTitle] = useState('Opprinnelig tittel')

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SearchableSelect label="Dokumenttittel" suggestions={suggestions} value={title} onChange={setTitle} />
        <button type="submit">Send inn</button>
      </form>
    </FormProvider>
  )
}

describe('SearchableSelect', () => {
  it('viser kontrollert verdi, filtrerer forslag og velger med tastaturet', async () => {
    const user = userEvent.setup()
    render(<TestForm />)
    const input = screen.getByRole('combobox', { name: 'Dokumenttittel' })
    expect(input).toHaveValue('Opprinnelig tittel')

    await user.clear(input)
    await user.type(input, 'Andre')
    expect(input).toHaveValue('Andre')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: 'Andre tittel' })).toBeVisible()

    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option').id)
    await user.keyboard('{Enter}')
    expect(input).toHaveValue('Andre tittel')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('lukker listen med Escape og lar Enter i tittelfeltet ikke sende inn skjemaet', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const { container } = render(<TestForm onSubmit={onSubmit} />)
    expect(container.querySelectorAll('form')).toHaveLength(1)
    const input = screen.getByRole('combobox', { name: 'Dokumenttittel' })
    await user.click(input)
    expect(input).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard('{Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Send inn' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('gir hvert tekstfelt egen forslagsliste og støtter musevalg', async () => {
    const user = userEvent.setup()
    function TwoFields() {
      const [first, setFirst] = useState('')
      const [second, setSecond] = useState('')
      return (
        <>
          <SearchableSelect label="Første" suggestions={suggestions} value={first} onChange={setFirst} />
          <SearchableSelect label="Andre" suggestions={suggestions} value={second} onChange={setSecond} />
        </>
      )
    }
    render(<TwoFields />)
    const first = screen.getByRole('combobox', { name: 'Første' })
    const second = screen.getByRole('combobox', { name: 'Andre' })
    expect(first.getAttribute('aria-controls')).not.toBe(second.getAttribute('aria-controls'))
    await user.click(first)
    const list = screen.getByRole('listbox')
    expect(first).toHaveAttribute('aria-controls', list.id)
    await user.click(within(list).getByRole('option', { name: 'Første tittel' }))
    expect(first).toHaveValue('Første tittel')
    expect(second).toHaveValue('')
  })
})
