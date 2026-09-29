import '@testing-library/jest-dom/vitest'

import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { useForm } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type Sak, OppgaveStatusType, SaksstatusKategori, Sakstype } from '../../types/types.internal.ts'
import { type VedtakFormHandle, VedtakForm } from './VedtakForm.tsx'

const { papirsøknad, laster, dialogFokusFerdig } = vi.hoisted(() => ({
  papirsøknad: { current: false },
  laster: { current: false },
  dialogFokusFerdig: vi.fn(),
}))

vi.mock('../../saksregler/useSaksregler.ts', () => ({
  useSaksregler: () => ({ erPapirsøknad: papirsøknad.current }),
}))

vi.mock('./useVedtak.ts', () => ({
  useVedtak: () => ({
    form: useForm({ defaultValues: { problemsammendrag: 'Problemsammendrag' } }),
    sammendragMedLavere: false,
    utleveringsmerknad: '',
    logTilUmami: vi.fn(),
    isLoading: laster.current,
  }),
}))

const sak: Sak = {
  sakId: 'sak-1',
  sakstype: Sakstype.SØKNAD,
  saksstatus: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
  saksstatusGyldigFra: '2026-01-01',
  statuskategori: SaksstatusKategori.ÅPEN,
  opprettet: '2026-01-01',
  søknadGjelder: 'Hjelpemidler',
  bruker: {
    fnr: '00000000000',
    navn: { fornavn: 'Test', etternavn: 'Bruker' },
    fødselsdato: '2000-01-01',
  },
  innsender: { fnr: '00000000000', navn: { fornavn: 'Test', etternavn: 'Innsender' } },
  enhet: { nummer: '0000', navn: 'Testenhet' },
}

describe('VedtakForm', () => {
  beforeEach(() => {
    papirsøknad.current = false
    laster.current = false
    dialogFokusFerdig.mockClear()
  })

  it('gir problemsammendraget fokus med markøren først for papirsøknader', () => {
    papirsøknad.current = true

    render(<VedtakForm sak={sak} onVedtak={vi.fn()} />)

    const felt = screen.getByRole<HTMLInputElement>('textbox', { name: /Problemsammendrag til OeBS/i })
    expect(felt).toHaveFocus()
    expect(felt.selectionStart).toBe(0)
    expect(felt.selectionEnd).toBe(0)
  })

  it('bevarer markørplasseringen når papirsøknadens felt får fokus igjen', () => {
    papirsøknad.current = true

    render(<VedtakForm sak={sak} onVedtak={vi.fn()} />)

    const felt = screen.getByRole<HTMLInputElement>('textbox', { name: /Problemsammendrag til OeBS/i })
    felt.blur()
    felt.setSelectionRange(5, 5)
    felt.focus()

    expect(felt.selectionStart).toBe(5)
    expect(felt.selectionEnd).toBe(5)
  })

  it('gir ikke problemsammendraget automatisk fokus for digitale søknader', () => {
    render(<VedtakForm sak={sak} onVedtak={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: /Problemsammendrag til OeBS/i })).not.toHaveFocus()
  })

  it.each([';tekst', ' ; tekst'])('avviser problemsammendrag som starter med semikolon: %s', async (tekst) => {
    const onVedtak = vi.fn()
    const ref = createRef<VedtakFormHandle>()
    render(<VedtakForm sak={sak} onVedtak={onVedtak} ref={ref} />)

    const felt = screen.getByRole('textbox', { name: /Problemsammendrag til OeBS/i })
    fireEvent.change(felt, { target: { value: tekst } })
    await act(async () => {
      await ref.current?.submit()
    })

    expect(await screen.findByText('Problemsammendrag må fylles ut')).toBeInTheDocument()
    expect(onVedtak).not.toHaveBeenCalled()
  })

  it('avviser semikolon ved vanlig innsending av skjemaet', async () => {
    const onVedtak = vi.fn()
    render(<VedtakForm sak={sak} onVedtak={onVedtak} />)

    const felt = screen.getByRole('textbox', { name: /Problemsammendrag til OeBS/i })
    fireEvent.change(felt, { target: { value: ';tekst' } })
    const form = felt.closest('form')
    if (!form) throw new Error('Skjema mangler')
    fireEvent.submit(form)

    expect(await screen.findByText('Problemsammendrag må fylles ut')).toBeInTheDocument()
    expect(onVedtak).not.toHaveBeenCalled()
  })

  it('godtar problemsammendrag med innhold ved innsending', async () => {
    const onVedtak = vi.fn()
    const ref = createRef<VedtakFormHandle>()
    render(<VedtakForm sak={sak} onVedtak={onVedtak} ref={ref} />)

    await act(async () => {
      await ref.current?.submit()
    })

    expect(onVedtak).toHaveBeenCalledWith(expect.objectContaining({ problemsammendrag: 'Problemsammendrag' }))
  })
})
