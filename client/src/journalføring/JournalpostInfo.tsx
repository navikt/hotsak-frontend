import { BodyShort, HStack } from '@navikt/ds-react'

import { Skillelinje } from '../felleskomponenter/Strek.tsx'
import { type Journalpost } from '../types/types.internal.ts'
import { formaterDato } from '../utils/dato.ts'

interface JournalpostInfoProps {
  journalpost: Journalpost
}

export function JournalpostInfo({ journalpost }: JournalpostInfoProps) {
  const kilde = journalpost.kanal.kode === 'SKAN_IM' ? 'Skanning' : journalpost.kanal.term

  return (
    <div>
      <HStack gap="space-12" paddingBlock="space-0">
        <BodyShort size="small">
          <strong>Kilde:</strong> {kilde}
        </BodyShort>
        <BodyShort size="small">
          <strong>Registrert dato:</strong> {formaterDato(journalpost.journalpostOpprettetTid)}
        </BodyShort>
      </HStack>
      <Skillelinje />
    </div>
  )
}
