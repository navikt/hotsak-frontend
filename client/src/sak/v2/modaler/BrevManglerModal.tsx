import { Tekst } from '../../../felleskomponenter/typografi'
import { InfoModal } from '../../../saksbilde/komponenter/InfoModal'
import { storForbokstavIOrd } from '../../../utils/formater'
import { Gjenstående, type VedtaksResultat } from '../behandling/behandlingTyper'

export interface BrevManglerModalProps {
  open: boolean
  onClose(): void
  gjenstående: Gjenstående[]
  vedtaksresultat?: VedtaksResultat
}

export function BrevManglerModal({ open, onClose, gjenstående, vedtaksresultat }: BrevManglerModalProps) {
  return (
    <InfoModal heading="Mangler brev" open={open} width="500px" onClose={onClose}>
      {gjenstående.includes(Gjenstående.BREV_MANGLER) && (
        <>
          <Tekst spacing>
            Når du fatter et vedtak med resultat "{storForbokstavIOrd(vedtaksresultat).replace(/_/g, ' ')}" er det krav
            om at man underetter brukeren med brev.
          </Tekst>
          <Tekst spacing>
            Velg "Opprett vedtaksbrev", rediger brevet, og merk så brevet som klart ved å klikke "Ferdigstill utkast".
            Deretter kan du prøve å fatte vedtaket på nytt.
          </Tekst>
        </>
      )}
      {gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT) && (
        <Tekst spacing>Før du kan fatte vedtaket må du ferdigstille brevet du har påstartet.</Tekst>
      )}
    </InfoModal>
  )
}
