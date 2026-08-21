import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { Box, Detail, Link, Table, Tooltip, VStack, HStack, Label } from '@navikt/ds-react'
import { Tekst } from '../../../felleskomponenter/typografi'
import { CompactExpandableCard } from '../../../felleskomponenter/panel/CompactExpandableCard'
import { useDokumentContext } from '../../../dokument/DokumentContext.tsx'
import { useJournalposter } from '../../../saksbilde/useJournalposter'
import { useSaksregler } from '../../../saksregler/useSaksregler.ts'
import type { LogiskVedlegg } from '../../../types/types.internal.ts'
import { useSetPanelVisibility } from '../paneler/usePanelHooks.ts'

export function formaterLogiskeVedlegg(logiskeVedlegg: LogiskVedlegg[]) {
  return logiskeVedlegg.length === 0 ? 'Ingen logiske vedlegg' : logiskeVedlegg.map(({ tittel }) => tittel).join(', ')
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
                      {dokument.logiskeVedlegg && (
                        <HStack gap="space-4">
                          <Label size="small">Vedlegg:</Label>
                          <Detail>{formaterLogiskeVedlegg(dokument.logiskeVedlegg)}</Detail>
                        </HStack>
                      )}
                      <HStack gap="space-4">
                        <Label size="small">Journalpost:</Label>
                        <Detail>{dokument.journalpostId}</Detail>
                      </HStack>
                    </VStack>
                  }
                >
                  <Table.DataCell scope="row">
                    <Tekst>
                      <Link
                        href={dokumentUrl}
                        onClick={(event) => {
                          event.preventDefault()
                          setValgtDokument({ journalpostId: dokument.journalpostId, dokumentId: dokument.dokumentId })
                          setDokumentpanelSynlig(true)
                        }}
                      >
                        {erValgtDokument ? <strong>{dokument.tittel}</strong> : dokument.tittel}
                      </Link>
                    </Tekst>
                  </Table.DataCell>
                  <Table.DataCell>
                    <Tooltip content="Åpne i ny fane">
                      <Link href={dokumentUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLinkIcon title={`Åpne ${dokument.tittel} i ny fane`} />
                      </Link>
                    </Tooltip>
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
