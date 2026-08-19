import { Heading, VStack } from '@navikt/ds-react'

import { type Dokument, type Journalpost } from '../types/types.internal.ts'
import { DokumentRad } from './DokumentRad.tsx'

interface JournalføringDokumenterProps {
  journalpost: Journalpost
  dokumentTitler: Record<string, string>
  annetInnhold: Record<string, string[]>
  onTittelChange(dokumentId: string, tittel: string): void
  onChipsChange(dokumentId: string, chips: string[]): void
  readOnly: boolean
}

export function JournalføringDokumenter({
  journalpost,
  dokumentTitler,
  annetInnhold,
  onTittelChange,
  onChipsChange,
  readOnly,
}: JournalføringDokumenterProps) {
  return (
    <VStack gap="space-8">
      <Heading level="2" size="small">
        Dokumenter
      </Heading>
      {journalpost.dokumenter.map((dok: Dokument, idx: number) => (
        <DokumentRad
          key={dok.dokumentId}
          dokument={dok}
          index={idx}
          total={journalpost.dokumenter.length}
          valgtTittel={dokumentTitler[dok.dokumentId] ?? dok.tittel}
          onTittelChange={(tittel) => onTittelChange(dok.dokumentId, tittel)}
          valgteChips={annetInnhold[dok.dokumentId] ?? []}
          onChipsChange={(chips) => onChipsChange(dok.dokumentId, chips)}
          readOnly={readOnly}
        />
      ))}
    </VStack>
  )
}
