import '@testing-library/jest-dom/vitest'

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { useForm } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type Sak, Saksstatus, SaksstatusKategori, Sakstype } from '../../types/types.internal.ts'
import { VedtaksResultat } from '../v2/behandling/behandlingTyper.ts'
import { FattVedtakModalV2 } from '../v2/modaler/FattVedtakModalV2.tsx'
import { type VedtakFormHandle, VedtakForm } from './VedtakForm.tsx'

const { papirsøknad, laster, svar } = vi.hoisted(() => ({
  papirsøknad: { current: false },
  laster: { current: false },
  svar: { current: 'Problemsammendrag' as string | undefined },
}))

vi.mock('../../saksregler/useSaksregler.ts', () => ({
  useSaksregler: () => ({ erPapirsøknad: papirsøknad.current }),
}))

vi.mock('./useVedtak.ts', () => ({
  useVedtak: () => ({
    form: useForm({ values: { problemsammendrag: svar.current ?? '' } }),
    sammendragMedLavere: false,
    utleveringsmerknad: '',
    logTilUmami: vi.fn(),
    isLoading: laster.current,
    harServiceforespørselSvar: svar.current !== undefined,
    originaltProblemsammendrag: svar.current ?? '',
  }),
}))

vi.mock('../../brev/useBrev.ts', () => ({
  useBrevForSak: () => ({ harVedtaksbrev: false }),
}))

vi.mock('../../personoversikt/usePerson.ts', () => ({
  usePerson: () => ({ personInfo: { vergemål: [] } }),
}))

vi.mock('../../felleskomponenter/toast/useToast.ts', () => ({
  useToast: () => ({ showSuccessToast: vi.fn() }),
}))

vi.mock('../v2/behandling/useBehandlingActions.ts', () => ({
  useBehandlingActions: () => ({ ferdigstillBehandling: vi.fn() }),
}))

vi.mock('../v2/paneler/usePanelHooks.ts', () => ({
  useClosePanel: () => vi.fn(),
}))

const sak: Sak = {
  sakId: 'sak-1',
  sakstype: Sakstype.SØKNAD,
  saksstatus: Saksstatus.AVVENTER_SAKSBEHANDLER,
  saksstatusGyldigFra: '2026-01-01',
  statuskategori: SaksstatusKategori.ÅPEN,
  opprettet: '2026-01-01',
  søknadGjelder: 'Hjelpemidler',
  søknadMottatt: '2026-01-01',
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
    svar.current = 'Problemsammendrag'
  })

  it('gir problemsammendraget fokus med markøren først for papirsøknader', async () => {
    papirsøknad.current = true

    render(<VedtakForm sak={sak} onVedtak={vi.fn()} />)

    const felt = screen.getByRole<HTMLInputElement>('textbox', { name: /Problemsammendrag til OeBS/i })
    await waitFor(() => expect(felt).toHaveFocus())
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

  it('venter på svar og skjemaverdi før fokus og markør settes i vedtaksdialogen', async () => {
    papirsøknad.current = true
    laster.current = true
    svar.current = undefined
    const { rerender } = render(
      <FattVedtakModalV2 open sak={sak} vedtaksresultat={VedtaksResultat.INNVILGET} onClose={vi.fn()} />
    )

    expect(screen.queryByRole('textbox', { name: /Problemsammendrag til OeBS/i })).not.toBeInTheDocument()

    svar.current = 'Tekst fra serviceforespørsel'
    laster.current = false
    rerender(<FattVedtakModalV2 open sak={sak} vedtaksresultat={VedtaksResultat.INNVILGET} onClose={vi.fn()} />)

    const felt = await screen.findByRole<HTMLInputElement>('textbox', { name: /Problemsammendrag til OeBS/i })
    await waitFor(() => {
      expect(felt).toHaveValue('Tekst fra serviceforespørsel')
      expect(felt).toHaveFocus()
      expect(felt.selectionStart).toBe(0)
      expect(felt.selectionEnd).toBe(0)
    })
  })

  it('fokuserer problemsammendraget i vedtaksdialogen når svaret allerede er lastet', async () => {
    papirsøknad.current = true
    const originalFocus = HTMLInputElement.prototype.focus
    const focus = vi.spyOn(HTMLInputElement.prototype, 'focus').mockImplementation(function (
      this: HTMLInputElement,
      options
    ) {
      originalFocus.call(this, options)
      if (options && 'focusVisible' in options && options.focusVisible) {
        this.setSelectionRange(this.value.length, this.value.length)
      }
    })

    try {
      render(<FattVedtakModalV2 open sak={sak} vedtaksresultat={VedtaksResultat.INNVILGET} onClose={vi.fn()} />)

      const felt = await screen.findByRole<HTMLInputElement>('textbox', { name: /Problemsammendrag til OeBS/i })
      await waitFor(() => expect(focus).toHaveBeenCalledWith(expect.objectContaining({ focusVisible: true })))
      expect(felt).toHaveFocus()
      expect(felt.selectionStart).toBe(0)
      expect(felt.selectionEnd).toBe(0)
    } finally {
      focus.mockRestore()
    }
  })

  it('beholder fokus på Innvilg-knappen i vedtaksdialogen for digitale søknader', async () => {
    render(<FattVedtakModalV2 open sak={sak} vedtaksresultat={VedtaksResultat.INNVILGET} onClose={vi.fn()} />)

    await waitFor(() => expect(screen.getByRole('button', { name: 'Innvilg' })).toHaveFocus())
  })

  it('beholder fokus på Avslå-knappen når en papirsøknad avslås', async () => {
    papirsøknad.current = true
    render(<FattVedtakModalV2 open sak={sak} vedtaksresultat={VedtaksResultat.AVSLÅTT} onClose={vi.fn()} />)

    await waitFor(() => expect(screen.getByRole('button', { name: 'Avslå' })).toHaveFocus())
  })

  it('fokuserer ikke feltet uten svar fra serviceforespørsel', () => {
    papirsøknad.current = true
    svar.current = undefined

    render(<VedtakForm sak={sak} onVedtak={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: /Problemsammendrag til OeBS/i })).not.toHaveFocus()
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
