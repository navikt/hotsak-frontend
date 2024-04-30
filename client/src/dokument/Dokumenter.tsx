import { Heading, Table } from '@navikt/ds-react'

import { Dokument } from '../types/types.internal'
import { useDokumentContext } from './DokumentContext'
import { DokumentVelger } from './DokumentVelger'

interface DokumenterProps {
  dokumenter: Dokument[]
}

export const Dokumenter: React.FC<DokumenterProps> = (props) => {
  const { dokumenter } = props
  const { valgtDokument, setValgtDokument } = useDokumentContext()

  return (
    <>
      <Heading size={'xsmall'} level={'2'}>
        Dokumenter
      </Heading>
      <Table size="small" title="dokumenter">
        <Table.Body>
          {dokumenter.map((dokument) => (
            <DokumentVelger
              key={dokument.dokumentID}
              valgtDokumentID={valgtDokument.dokumentID}
              dokument={dokument}
              onClick={() => {
                setValgtDokument({ journalpostID: dokument.journalpostID, dokumentID: dokument.dokumentID })
              }}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}
