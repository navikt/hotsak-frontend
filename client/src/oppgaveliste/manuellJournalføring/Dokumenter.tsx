import { useParams } from 'react-router'

import { Heading } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { useDokumentContext } from '../dokumenter/DokumentContext'
import { useDokument } from '../dokumenter/dokumentHook'
import { DokumentVelger } from './DokumentVelger'

interface DokumenterProps {
  journalpostID?: string
}

export const Dokumenter: React.FC<DokumenterProps> = ({ journalpostID }) => {
  const { journalpost } = useDokument(journalpostID)
  const { valgtDokumentID, setValgtDokumentID } = useDokumentContext()

  if (!journalpostID) {
    return <></>
  }

  return (
    <Avstand paddingTop={6} paddingBottom={2}>
      <Heading size={'xsmall'} level={'2'}>
        Dokumenter
      </Heading>
      <ul>
        {journalpost?.dokumenter.map((dokument) => (
          <DokumentVelger
            key={dokument.dokumentID}
            valgtDokumentID={valgtDokumentID}
            dokument={dokument}
            onClick={() => {
              setValgtDokumentID(dokument.dokumentID)
            }}
          />
        ))}
      </ul>
    </Avstand>
  )
}
