import { Tekst } from '../../../felleskomponenter/typografi'
import { InfoModal } from '../../../saksbilde/komponenter/InfoModal'

export function NotatIUtkastModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <InfoModal heading="Notat ikke ferdigstilt" open={open} width="500px" onClose={onClose}>
      <Tekst spacing>Du har et utkast til notat som må ferdigstilles eller slettes.</Tekst>
    </InfoModal>
  )
}
