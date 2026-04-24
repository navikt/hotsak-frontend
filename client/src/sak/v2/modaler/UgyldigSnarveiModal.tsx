import { Tekst } from '../../../felleskomponenter/typografi'
import { InfoModal } from '../../../saksbilde/komponenter/InfoModal'

export function UgyldigSnarveiModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <InfoModal heading="Ikke mulig å innvilge" open={open} width="500px" onClose={onClose}>
      <Tekst spacing>
        Du har allerede satt et annet resultat i saken. Saken må ferdigstilles ved å klikke på "Fatt vedtak" knappen.
      </Tekst>
    </InfoModal>
  )
}
