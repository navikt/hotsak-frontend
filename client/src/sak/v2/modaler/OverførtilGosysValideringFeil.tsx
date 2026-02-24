import { Tekst } from '../../../felleskomponenter/typografi'
import { InfoModal } from '../../../saksbilde/komponenter/InfoModal'
import { GjenståendeOverfør, VedtaksResultat } from '../behandling/behandlingTyper'

export function OverførtilGosysValideringFeil({
  open,
  onClose,
  gjenstående,
}: {
  open: boolean
  onClose: () => void
  gjenstående: GjenståendeOverfør[]
  vedtaksResultat?: VedtaksResultat
}) {
  return (
    <InfoModal heading="Kan ikke overføre sak til Gosys" open={open} width="500px" onClose={onClose}>
      {gjenstående.map((gjenstående) => {
        switch (gjenstående) {
          case GjenståendeOverfør.BREV_MÅ_SLETTES:
            return (
              <Tekst key="BREV_MÅ_SLETTES" spacing>
                For å kunne overføre saken til Gosys må brevutkast slettes.
              </Tekst>
            )
          case GjenståendeOverfør.BREV_MÅ_ÅPNES_FOR_REDIGERING_OG_SLETTES:
            return (
              <Tekst key="BREV_MÅ_ÅPNES_FOR_REDIGERING_OG_SLETTES" spacing>
                For å kunne overføre saken til Gosys må påbegynte brevutkast slettes.
              </Tekst>
            )
          case GjenståendeOverfør.NOTATUTKAST_MÅ_SLETTES:
            return (
              <Tekst key="NOTATUTKAST_MÅ_SLETTES" spacing>
                For å kunne overføre saken til Gosys må notatutkast slettes eller ferdigstilles.
              </Tekst>
            )
        }
      })}
    </InfoModal>
  )
}
