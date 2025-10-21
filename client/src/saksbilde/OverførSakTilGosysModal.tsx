import { Alert, Heading, VStack } from '@navikt/ds-react'

import { Brødtekst } from '../felleskomponenter/typografi'
import type { Tilbakemelding } from '../innsikt/Besvarelse'
import { SpørreundersøkelseModal } from '../innsikt/SpørreundersøkelseModal'
import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'
import { NotatType } from '../types/types.internal'
import { useNotater } from './høyrekolonne/notat/useNotater'
import { useSakId } from './useSak'

export interface OverførSakTilGosysModalProps {
  open: boolean
  loading: boolean
  spørreundersøkelseId: SpørreundersøkelseId

  onBekreft(tilbakemelding: Tilbakemelding): void | Promise<void>
  onClose(): void
}

export function OverførSakTilGosysModal({
  open,
  loading,
  spørreundersøkelseId,
  onBekreft,
  onClose,
}: OverførSakTilGosysModalProps) {
  const sakId = useSakId()
  const { notater } = useNotater(sakId)

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
        <VStack gap="3">
          {notater.find((notat) => notat.type === NotatType.JOURNALFØRT) && (
            <Alert variant="warning" size="small">
              <Heading size="xsmall" level="2" spacing>
                Saken har forvaltningsnotat - kontakt DigiHoT for hjelp
              </Heading>
              <Brødtekst>
                Denne saken har et eller flere forvaltningsnotater knyttet til seg. Når saken overføres til Gosys vil
                disse notatene bli feilregistrert og miste knytning til den nye saken. Hvis dere har behov for å knytte
                disse notatene til den nye saken i Gosys, ta kontakt med DigiHoT på teamskanalen "DigiHoT - innspill,
                spørsmål og info", så hjelper vi dere.
              </Brødtekst>
            </Alert>
          )}
          {notater.find((notat) => notat.type === NotatType.INTERNT) && (
            <Alert variant="info" size="small">
              <Brødtekst>
                Denne saken har et eller flere interne arbeidsnotater knyttet til seg. Disse notatene følger ikke med
                til Gosys hvis du overfører saken. Hvis du har behov for å overføre disse notatene til oppgaven i Gosys,
                må det gjøres manuelt.
              </Brødtekst>
            </Alert>
          )}
        </VStack>
      )}
    </SpørreundersøkelseModal>
  )
}
