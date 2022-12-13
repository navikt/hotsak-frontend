import styled from 'styled-components'

import { Heading, Loader } from '@navikt/ds-react'

import { useDokument } from '../dokumenter/dokumentHook'
import { Dokumenter } from './Dokumenter'

const Container = styled.div`
  padding: 2rem;
  overflow: auto;
`

export const JournalpostSkjema: React.FC = () => {
  const { journalpost, /*isError,*/ isLoading } = useDokument()

  if (isLoading || !journalpost) {
    return (
      <div>
        <Loader />
        Henter journalpost...
      </div>
    )
  }

  //const { journalpostID, journalpostOpprettetDato, tittel, fnr, journalstatus, saksbehandler, dokumenter } = journalpost

  return (
    <Container>
      <div>
        <Heading size={'small'} level={'2'}>
          Dokumenter
        </Heading>
        <Dokumenter />
      </div>
    </Container>
  )
}
