import { Box, Heading, Table } from '@navikt/ds-react'

import { Dokument } from '../types/types.internal'
import { useDokumentContext } from './DokumentContext'
import { DokumentVelger } from './DokumentVelger'

interface DokumenterProps {
  dokumenter: Dokument[]
}

export function Dokumenter(props: DokumenterProps) {
  const { dokumenter } = props
  const { valgtDokument, setValgtDokument } = useDokumentContext()

  return (
    <Box paddingBlock="space-24 space-0">
      <Heading size={'xsmall'} level={'2'}>
        Dokumenter
      </Heading>
      <Table size="small" title="dokumenter">
        <Table.Body>
          {dokumenter.map((dokument) => (
            <DokumentVelger
              key={dokument.dokumentId}
              valgtDokumentId={valgtDokument.dokumentId}
              dokument={dokument}
              onClick={() => {
                setValgtDokument({ journalpostId: dokument.journalpostId, dokumentId: dokument.dokumentId })
              }}
            />
          ))}
        </Table.Body>
      </Table>
    </Box>
  )
}
