import { useState } from 'react'

import { Alert, Heading, VStack } from '@navikt/ds-react'
import { type ISvar } from '../../../innsikt/Besvarelse'
import { Tekst } from '../../../felleskomponenter/typografi'
import { NotatType } from '../../notat/notatTyper'
import { useNotater } from '../../notat/useNotater'
import { BekreftelsesDialog } from '../../../saksbilde/komponenter/BekreftelsesDialog'
import { useSakId } from '../../../saksbilde/useSak'
import { useSakActions } from '../../../saksbilde/useSakActions'
import { useBehandling } from '../behandling/useBehandling'

export interface OverførTilGosysModalProps {
  open: boolean
  onClose(): void
}

const OVERFØRING_ÅRSAK: ISvar = {
  type: 'fritekst',
  spørsmål: 'Hvorfor overføres saken til Gosys?',
  sti: [],
  svar: 'Søknaden er sendt inn på feil bruker, eller inneholder dokumenter som gjelder andre brukere',
}

export function OverførTilGosysModal({ open, onClose }: OverførTilGosysModalProps) {
  const sakId = useSakId()
  const { notater } = useNotater(sakId)
  const { overførSakTilGosys, state } = useSakActions()
  const { mutate: mutateBehandling } = useBehandling()
  const [loading, setLoading] = useState(false)

  async function onBekreft() {
    setLoading(true)
    try {
      await overførSakTilGosys([OVERFØRING_ÅRSAK])
      await mutateBehandling()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <BekreftelsesDialog
      heading="Vil du overføre saken til Gosys?"
      loading={loading || state.loading}
      open={open}
      bekreftButtonLabel="Overfør til Gosys"
      onBekreft={onBekreft}
      onClose={onClose}
    >
      {notater.length > 0 && (
        <VStack gap="space-12">
          {notater.find((notat) => notat.type === NotatType.JOURNALFØRT) && (
            <Alert variant="warning" size="small">
              <Heading size="xsmall" level="2" spacing>
                Saken har forvaltningsnotat - kontakt DigiHoT for hjelp
              </Heading>
              <Tekst>
                Denne saken har et eller flere forvaltningsnotater knyttet til seg. Når saken overføres til Gosys vil
                disse notatene bli feilregistrert og miste knytning til den nye saken. Hvis dere har behov for å knytte
                disse notatene til den nye saken i Gosys, ta kontakt med DigiHoT på teamskanalen "DigiHoT - innspill,
                spørsmål og info", så hjelper vi dere.
              </Tekst>
            </Alert>
          )}
        </VStack>
      )}
    </BekreftelsesDialog>
  )
}
