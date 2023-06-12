import { Heading } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Dokument } from '../../types/types.internal'
import { useDokumentContext } from '../dokumenter/DokumentContext'
import { DokumentVelger } from './DokumentVelger'

interface DokumenterProps {
  dokumenter: Dokument[]
}

export const Dokumenter: React.FC<DokumenterProps> = (props) => {
  const { dokumenter } = props
  const { valgtDokument, setValgtDokument } = useDokumentContext()

  return (
    <Avstand paddingTop={6} paddingBottom={2}>
      <Heading size={'xsmall'} level={'2'}>
        Dokumenter
      </Heading>
      <ul>
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
      </ul>
    </Avstand>
  )
}
