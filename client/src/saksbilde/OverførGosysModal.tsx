import { Alert, VStack } from '@navikt/ds-react'
import type { Tilbakemelding } from '../innsikt/Besvarelse'
import { SpørreundersøkelseModal } from '../innsikt/SpørreundersøkelseModal'
import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'
import { useNotater } from './høyrekolonne/notat/useNotater'
import { useSakId } from './useSak'
import { Brødtekst } from '../felleskomponenter/typografi'
import { NotatType } from '../types/types.internal'

export interface OverførGosysModalProps {
  open: boolean
  loading: boolean
  spørreundersøkelseId: SpørreundersøkelseId

  onBekreft(tilbakemelding: Tilbakemelding): void | Promise<void>
  onClose(): void
}

export function OverførGosysModal({ open, loading, spørreundersøkelseId, onBekreft, onClose }: OverførGosysModalProps) {
  const sakId = useSakId()
  const { notater } = useNotater(sakId)

  if (notater.length > 0) {
  }
  return (
    <SpørreundersøkelseModal
      open={open}
      loading={loading}
      spørreundersøkelseId={spørreundersøkelseId}
      size="small"
      knappetekst="Overfør til Gosys"
      onBesvar={onBekreft}
      onClose={onClose}
    >
      {notater.length > 0 && (
        <Alert variant="info" size="small">
          <VStack gap="3">
            {notater.find((notat) => notat.type === NotatType.JOURNALFØRT) && (
              <Brødtekst>
                Journalførte notater feilregistreres ved overføring av sak til Gosys. Hvis du har behov for å knytte
                feilregistrert notat til ny sak i Gosys, kan dere inntil videre ta kontakt med DigiHoT på Teams kanalen
                "DigiHoT - innspill, spørsmål og info" for bistand.
              </Brødtekst>
            )}
            {notater.find((notat) => notat.type === NotatType.INTERNT) && (
              <Brødtekst>
                Interne notater i saken overføres ikke til Gosys. Hvis du har behov for å overføre disse til oppgaven i
                Gosys, må det gjøres mannuelt.
              </Brødtekst>
            )}
          </VStack>
        </Alert>
      )}
    </SpørreundersøkelseModal>
  )
}
