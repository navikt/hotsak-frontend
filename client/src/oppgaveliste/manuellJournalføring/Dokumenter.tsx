import { Heading } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { useJournalposter } from '../../saksbilde/journalpostHook'
import { useDokumentContext } from '../dokumenter/DokumentContext'
import { DokumentVelger } from './DokumentVelger'

export const Dokumenter: React.FC = () => {
  const { dokumenter } = useJournalposter()
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
              setValgtDokument({ journalpostID: dokument.journalpostId, dokumentID: dokument.dokumentID })
            }}
          />
        ))}
      </ul>
    </Avstand>
  )
}
