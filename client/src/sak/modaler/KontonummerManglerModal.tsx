import { Tekst } from '../../felleskomponenter/typografi'
import { InfoModal } from '../../saksbilde/komponenter/InfoModal'

export function KontonummerManglerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <InfoModal heading="Mangler kontonummer" open={open} width="500px" onClose={onClose}>
      <Tekst spacing>
        Vi fant ikke kontonummer til den som skal motta utbetalingen. Kontakt personen og be dem legge inn kontonummer
        hos Nav før du sender saken til godkjenning. Hvis saken skal henlegges eller avslås, er det ikke nødvendig å
        gjøre dette.
      </Tekst>
    </InfoModal>
  )
}
