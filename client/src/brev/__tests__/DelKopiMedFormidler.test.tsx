import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { type Brevmottaker, Mottakertype } from '../brevTyper.ts'
import { DelKopiMedFormidler } from '../DelKopiMedFormidler.tsx'

vi.mock('../../saksbilde/useSak', () => ({ useSak: () => ({}) }))
vi.mock('../../saksbilde/useBehovsmelding', () => ({ useBehovsmelding: () => ({}) }))
vi.mock('../useBrev', () => ({
  useBrevmottakerActions: () => ({
    leggTilBrevmottaker: { isMutating: false, reset: vi.fn(), trigger: vi.fn() },
    endreBrevmottaker: { isMutating: false, reset: vi.fn(), trigger: vi.fn() },
    slettBrevmottaker: { isMutating: false, trigger: vi.fn() },
  }),
}))

afterEach(cleanup)

describe('DelKopiMedFormidler', () => {
  it('viser påkrevde adressefelt uten avhuking eller avbryt når obligatorisk formidler mangler', () => {
    render(
      <DelKopiMedFormidler brevId="brev-1" mottakere={{ brevmottakere: [] }} kanRedigere formidlerErObligatorisk />
    )

    expect(screen.getByText('Formidler er obligatorisk mottaker av brevet')).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'Formidlers navn' })).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'Adresselinje 1' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Lagre mottaker' })).toBeVisible()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Avbryt' })).not.toBeInTheDocument()
  })

  it('beholder frivillig kopi til formidler for andre brevmaler', async () => {
    render(<DelKopiMedFormidler brevId="brev-1" mottakere={{ brevmottakere: [] }} kanRedigere />)
    expect(screen.queryByRole('textbox', { name: 'Adresselinje 1' })).not.toBeInTheDocument()

    await userEvent.setup().click(screen.getByRole('checkbox', { name: /Del kopi med formidler/ }))

    expect(screen.getByRole('textbox', { name: 'Adresselinje 1' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible()
  })

  it('lar ikke en eksisterende obligatorisk formidler velges bort', () => {
    const formidler: Brevmottaker = {
      id: 'formidler-1',
      mottakertype: Mottakertype.FORMIDLER,
      navn: 'Formidler',
      brevId: 'brev-1',
      opprettet: '2026-11-25T12:00:00Z',
      opprettetAv: 'Z123456',
      kanSlettes: false,
    }
    render(<DelKopiMedFormidler brevId="brev-1" mottakere={{ brevmottakere: [formidler] }} kanRedigere />)

    expect(screen.getByText('Formidler er obligatorisk mottaker av brevet')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Endre' })).toBeVisible()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('viser ikke redigerbare adressefelt når brevet ikke kan redigeres', () => {
    render(
      <DelKopiMedFormidler
        brevId="brev-1"
        mottakere={{ brevmottakere: [] }}
        kanRedigere={false}
        formidlerErObligatorisk
      />
    )

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
