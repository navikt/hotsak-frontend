import styled from 'styled-components'

import { Link } from '@navikt/ds-react'

import { formaterTidsstempel } from '../../../utils/dato'
import { Etikett, Tekst, Undertittel } from '../../../felleskomponenter/typografi'
import type { Saksdokument } from '../../../types/types.internal'

export function BrevKort({ tittel, opprettet, saksbehandler, journalpostId, dokumentId }: Saksdokument) {
  return (
    <Container>
      <ContentContainer>
        <Etikett>
          <Link href={`/api/journalpost/${journalpostId}/${dokumentId}`} target="_blank">
            {tittel}
          </Link>
        </Etikett>
        {opprettet && <Undertittel>{formaterTidsstempel(opprettet)}</Undertittel>}
        <Tekst>{saksbehandler.navn}</Tekst>
      </ContentContainer>
    </Container>
  )
}

const Container = styled.li`
  margin: 0;
  padding: 16px 0;
  display: flex;

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--ax-border-neutral);
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`
