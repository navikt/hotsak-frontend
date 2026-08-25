import { Box, Button, HStack, Label, Link, Table, VStack } from '@navikt/ds-react'
import { useDokumentContext } from '../../../dokument/DokumentContext.tsx'
import { CompactExpandableCard } from '../../../felleskomponenter/panel/CompactExpandableCard'
import { Tekst } from '../../../felleskomponenter/typografi'
import { useJournalposter } from '../../../saksbilde/useJournalposter'
import { useSaksregler } from '../../../saksregler/useSaksregler.ts'
import type { LogiskVedlegg } from '../../../types/types.internal.ts'
import { useSetPanelVisibility } from '../paneler/usePanelHooks.ts'

export function LogiskeVedlegg({ vedlegg }: { vedlegg: LogiskVedlegg[] }) {
  return vedlegg.length === 0 ? (
    <Tekst>Ingen logiske vedlegg</Tekst>
  ) : (
    vedlegg.map(({ tittel }) => <Tekst key={tittel}>{tittel}</Tekst>)
  )
}

export function skalDokumentkortVæreÅpent(erPapirsøknad: boolean, antallDokumenter: number) {
  return erPapirsøknad || antallDokumenter > 1
}

export function JournalpostCard() {
  const { dokumenter } = useJournalposter()
  const { valgtDokument, setValgtDokument } = useDokumentContext()
  const { erPapirsøknad } = useSaksregler()
  const setDokumentpanelSynlig = useSetPanelVisibility('dokumentpanel')

  if (dokumenter.length === 0) {
    return null
  }

  return (
    <Box>
      <CompactExpandableCard
        variant="subtle"
        tittel="Dokumenter"
        defaultOpen={skalDokumentkortVæreÅpent(erPapirsøknad, dokumenter.length)}
      >
        <Table size="small">
          <Table.Body>
            {dokumenter.map((dokument) => {
              const dokumentUrl = `/api/journalpost/${dokument.journalpostId}/${dokument.dokumentId}`
              const erValgtDokument =
                valgtDokument.journalpostId === dokument.journalpostId &&
                valgtDokument.dokumentId === dokument.dokumentId

              return (
                <Table.ExpandableRow
                  key={`${dokument.journalpostId}-${dokument.dokumentId}`}
                  content={
                    <VStack gap="space-4" paddingBlock="space-0" paddingInline="space-0">
                      <HStack gap="space-4">
                        <Label size="small">Journalpost:</Label>
                        <Tekst>{dokument.journalpostId}</Tekst>
                      </HStack>
                      {dokument.logiskeVedlegg && (
                        <>
                          <Label size="small">Vedlegg:</Label>
                          <LogiskeVedlegg vedlegg={dokument.logiskeVedlegg} />
                        </>
                      )}
                    </VStack>
                  }
                >
                  <Table.DataCell scope="row">
                    <Tekst>
                      <Link href={dokumentUrl} target="_blank" rel="noopener noreferrer">
                        {erValgtDokument ? <strong>{dokument.tittel}</strong> : dokument.tittel}
                      </Link>
                    </Tekst>
                  </Table.DataCell>
                  <Table.DataCell>
                    <Button
                      variant="tertiary"
                      size="small"
                      onClick={() => {
                        setValgtDokument({ journalpostId: dokument.journalpostId, dokumentId: dokument.dokumentId })
                        setDokumentpanelSynlig(true)
                      }}
                    >
                      Vis
                    </Button>
                  </Table.DataCell>
                </Table.ExpandableRow>
              )
            })}
          </Table.Body>
        </Table>
      </CompactExpandableCard>
    </Box>
  )
}
