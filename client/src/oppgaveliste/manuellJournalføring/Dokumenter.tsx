import { Heading } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { useDokumentContext } from '../dokumenter/DokumentContext'
import { useDokument } from '../dokumenter/dokumentHook'
import { DokumentVelger } from './DokumentVelger'

export const Dokumenter: React.FC = () => {
  const { journalpost } = useDokument()
  const { valgtDokumentID, setValgtDokumentID } = useDokumentContext()

  return (
    <>
      <Heading size={'small'} level={'2'}>
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
    </>
  )
}
