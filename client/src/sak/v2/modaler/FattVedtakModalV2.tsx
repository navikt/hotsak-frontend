import { Alert } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { useToast } from '../../../felleskomponenter/toast/ToastContext'
import { Tekst } from '../../../felleskomponenter/typografi'
import { BekreftelseModal } from '../../../saksbilde/komponenter/BekreftelseModal'
import { Sak } from '../../../types/types.internal'
import { assertNever } from '../../../utils/type'
import { VedtakForm, VedtakFormHandle } from '../../felles/VedtakForm'
import { VedtaksResultat } from '../behandling/behandlingTyper'
import { useBehandlingActions } from '../behandling/useBehandlingActions'
import { VedtakFormValues } from '../../felles/useVedtak'

export function FattVedtakModalV2({
  open,
  onClose,
  sak,
  vedtaksResultat,
}: {
  open: boolean
  onClose: () => void
  sak: Sak
  vedtaksResultat: VedtaksResultat
}) {
  const [vedtakLoader, setVedtakLoader] = useState(false)
  const { ferdigstillBehandling } = useBehandlingActions()
  const { showSuccessToast } = useToast()
  const formRef = useRef<VedtakFormHandle>(null)

  const erAvslag = vedtaksResultat === VedtaksResultat.AVSLÅTT
  const erDelvisInnvilget = vedtaksResultat === VedtaksResultat.DELVIS_INNVILGET
  const erInnvilget = vedtaksResultat === VedtaksResultat.INNVILGET

  const fattVedtak = async (data: VedtakFormValues) => {
    setVedtakLoader(true)

    if (erInnvilget) {
      await ferdigstillBehandling({ problemsammendrag: data.problemsammendrag, postbegrunnelse: data.postbegrunnelse })
    } else if (erDelvisInnvilget) {
      await ferdigstillBehandling({ problemsammendrag: data.problemsammendrag })
    }

    setVedtakLoader(false)
    showSuccessToast('Vedtak fattet')
    onClose()
  }

  const fattAvslagsvedtak = async () => {
    setVedtakLoader(true)
    await ferdigstillBehandling({})

    setVedtakLoader(false)
    showSuccessToast('Vedtak fattet')
    onClose()
  }

  const vedtakTekst = (() => {
    switch (vedtaksResultat) {
      case VedtaksResultat.INNVILGET:
        return { verb: 'innvilge', knapp: 'Innvilg' }
      case VedtaksResultat.DELVIS_INNVILGET:
        return { verb: 'delvis innvilge', knapp: 'Delvis innvilg' }
      case VedtaksResultat.AVSLÅTT:
        return { verb: 'avslå', knapp: 'Avslå' }
      default:
        return assertNever(vedtaksResultat)
    }
  })()

  return (
    <BekreftelseModal
      heading={`Vil du ${vedtakTekst?.verb} søknaden?`}
      loading={vedtakLoader}
      open={open}
      width="700px"
      bekreftButtonLabel={`${vedtakTekst?.knapp} søknaden`}
      onBekreft={erAvslag ? fattAvslagsvedtak : () => formRef.current?.submit()}
      onClose={onClose}
    >
      {(erInnvilget || erDelvisInnvilget) && (
        <>
          <Tekst spacing>
            Når du {erDelvisInnvilget ? 'delvis innvilger' : 'innvilger'} søknaden vil det opprettes en
            serviceforespørsel (SF) i OeBS. Innbygger kan se vedtaket på innlogget side på nav.no
          </Tekst>
          {erDelvisInnvilget && (
            <Alert variant="info" size="small" style={{ margin: '1em 0' }}>
              Når du delvis innvilger må du huske å redigere hjepemidlene i serviceforespøreselen i OeBS før du
              oppretter ordre.
            </Alert>
          )}
          {(erInnvilget || erDelvisInnvilget) && (
            <VedtakForm sak={sak} ref={formRef} onVedtak={fattVedtak} postbegrunnelsePåkrevd={erInnvilget} />
          )}
        </>
      )}
      {erAvslag && (
        <>
          <Tekst spacing>
            Når du avslår søknaden vil det naturligvis ikke opprettes en serviceforespørsel (SF) i OeBS. Bruker
            underrettes med brevet du har forfattet. Innbygger kan også se vedtaket på innlogget side på nav.no
          </Tekst>
        </>
      )}
    </BekreftelseModal>
  )
}
