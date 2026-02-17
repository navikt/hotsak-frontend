import { useRef } from 'react'
import { Tekst } from '../../felleskomponenter/typografi'
import { VedtakFormValues } from '../../sak/felles/useVedtak'
import { VedtakForm, VedtakFormHandle } from '../../sak/felles/VedtakForm'
import { Sak } from '../../types/types.internal'
import { BekreftelseModal } from '../komponenter/BekreftelseModal'
import { useSakActions } from '../useSakActions'

export function FattVedtakModal({ sak, open, onClose }: { sak: Sak; open: boolean; onClose: () => void }) {
  const sakActions = useSakActions()
  const formRef = useRef<VedtakFormHandle>(null)

  const fattVedtak = async (data: VedtakFormValues) => {
    await sakActions.fattVedtak(data.problemsammendrag, data.postbegrunnelse)
    onClose()
  }

  return (
    <BekreftelseModal
      heading="Vil du innvilge søknaden?"
      loading={sakActions.state.loading}
      open={open}
      buttonSize="medium"
      width="700px"
      bekreftButtonLabel="Innvilg søknaden"
      onBekreft={() => formRef.current?.submit()}
      onClose={onClose}
    >
      <Tekst spacing>
        Når du innvilger søknaden vil det opprettes en serviceforespørsel (SF) i OeBS. Innbygger kan se vedtaket på
        innlogget side på nav.no neste virkedag.
      </Tekst>
      <VedtakForm sak={sak} ref={formRef} onVedtak={fattVedtak} />
    </BekreftelseModal>
  )
}
