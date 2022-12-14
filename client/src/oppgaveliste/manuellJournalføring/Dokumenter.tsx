import { Heading } from '@navikt/ds-react'

import { useDokument } from '../dokumenter/dokumentHook'
import { DokumentVelger } from './DokumentVelger'

export const Dokumenter: React.FC = () => {
  const journalpost = useDokument()

  return (
    <>
      <Heading size={'small'} level={'2'}>
        Dokumenter
      </Heading>
      <ul>
        {journalpost?.journalpost?.dokumenter.map((dokument) => (
          <DokumentVelger key={dokument.dokumentID} dokument={dokument} />
        ))}
      </ul>
    </>
  )
}
