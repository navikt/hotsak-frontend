import { Tekst } from '../../../felleskomponenter/typografi'
import { InfoModal } from '../../../saksbilde/komponenter/InfoModal'

export function ResultatManglerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <InfoModal heading="Mangler resultat" open={open} width="500px" onClose={onClose}>
      <Tekst spacing>Du må velge et vedtaksresultat under "Behandle sak" før du kan fatte vedtak.</Tekst>
    </InfoModal>
  )
}
