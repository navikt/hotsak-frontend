import { useSWRConfig } from 'swr'
import { useBrevMetadata } from '../../../brev/useBrevMetadata'
import { useToast } from '../../../felleskomponenter/toast/ToastContext'
import { Tekst } from '../../../felleskomponenter/typografi'
import { BekreftelseModal } from '../../../saksbilde/komponenter/BekreftelseModal'
import { useSakId } from '../../../saksbilde/useSak'
import { useBehandling } from '../behandling/useBehandling'

export function SlettBrevutkastModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { mutate } = useSWRConfig()
  const sakId = useSakId()
  const { showSuccessToast } = useToast()
  const { mutate: mutateGjeldendeBehandling } = useBehandling()
  const { mutate: mutateBrevMetadata } = useBrevMetadata()

  // TODO duplisert logikk, bør kanskje flyttes til en felles actions hook?
  const slettBrevutkast = async () => {
    await fetch(`/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`, {
      method: 'delete',
    }).then((res) => {
      if (!res.ok) throw new Error(`Brev ikke slettet, statuskode ${res.status}`)
    })
    await mutate(`/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`)
    showSuccessToast('Brevutkast slettet')
    mutateGjeldendeBehandling()
    mutateBrevMetadata()
    onClose()
  }

  return (
    <BekreftelseModal
      heading={`Du må slette brevutkastet ditt før du kan endre resultatet`}
      //loading={vedtakLoader}
      open={open}
      width="700px"
      bekreftButtonLabel="Slett brevutkast"
      onBekreft={slettBrevutkast}
      onClose={onClose}
    >
      <Tekst>
        Du har begynt på et utkast til vedtaksbrev. Dette må slettes før du kan endre resultatet. Hvis du sletter
        brevet, kan det ikke gjenopprettes.
      </Tekst>
    </BekreftelseModal>
  )
}
