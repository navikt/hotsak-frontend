import { BodyShort, Box, HStack, Label, Link, Tag, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'

import { useDokumentContext } from '../../dokument/DokumentContext'
import { DokumentPanel } from '../../dokument/DokumentPanel'
import { CompactExpandableCard } from '../../felleskomponenter/panel/CompactExpandableCard'
import { useJournalpost } from '../../saksbilde/useJournalpost'
import { useJournalposter } from '../../saksbilde/useJournalposter'
import classes from './PapirsøknadPanel.module.css'

export function PapirsøknadPanel() {
  const { dokumenter } = useJournalposter()
  const { setValgtDokument } = useDokumentContext()

  const journalpostId = dokumenter[0]?.journalpostId
  const dokumentId = dokumenter[0]?.dokumentId

  const { journalpost } = useJournalpost(journalpostId)

  useEffect(() => {
    if (journalpostId && dokumentId) {
      setValgtDokument({ journalpostId, dokumentId })
    }
  }, [journalpostId, dokumentId, setValgtDokument])

  return (
    <div className={classes.container}>
      {journalpost && (
        <Box paddingInline="space-12" paddingBlock="space-0 space-8">
          <CompactExpandableCard variant="subtle" tittel="Journalpost">
            <VStack gap="space-16" padding="space-12">
              <HStack gap="space-20" wrap>
                <VStack gap="space-4">
                  <Label size="small">Tittel</Label>
                  <BodyShort size="small">{journalpost.tittel}</BodyShort>
                </VStack>
                <VStack gap="space-4">
                  <Label size="small">Tema</Label>
                  <BodyShort size="small">{journalpost.tema.term}</BodyShort>
                </VStack>
                <VStack gap="space-4">
                  <Label size="small">Journalpost-ID</Label>
                  <BodyShort size="small">{journalpost.journalpostId}</BodyShort>
                </VStack>
              </HStack>

              <VStack gap="space-12">
                <Label size="small">Dokumenter</Label>
                {journalpost.dokumenter.map((dokument) => (
                  <VStack key={dokument.dokumentId} gap="space-8">
                    <HStack gap="space-12" align="center">
                      <BodyShort size="small">{dokument.tittel}</BodyShort>
                      <Link
                        href={`/api/journalpost/${dokument.journalpostId}/${dokument.dokumentId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <BodyShort size="small">Åpne</BodyShort>
                      </Link>
                    </HStack>
                    {dokument.logiskeVedlegg.length > 0 && (
                      <HStack gap="space-8" wrap>
                        {dokument.logiskeVedlegg.map((vedlegg) => (
                          <Tag key={vedlegg.vedleggId} variant="neutral" size="xsmall">
                            {vedlegg.tittel}
                          </Tag>
                        ))}
                      </HStack>
                    )}
                  </VStack>
                ))}
              </VStack>
            </VStack>
          </CompactExpandableCard>
        </Box>
      )}
      <DokumentPanel />
    </div>
  )
}
