import styled from 'styled-components/macro'

import { norskTimestamp } from '../../../utils/date'

import { Etikett, Tekst, Undertittel } from '../../../felleskomponenter/typografi'
import { Hendelse } from '../../../types/types.internal'

const Container = styled.li`
  margin: 0;
  padding: 16px 0;
  display: flex;

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--navds-semantic-color-border-muted);
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const HistorikkHendelse = ({ hendelse, detaljer, opprettet, bruker }: Hendelse) => {
  return (
    <Container>
      <ContentContainer>
        <Etikett>{hendelse}</Etikett>
        {opprettet && <Undertittel>{norskTimestamp(opprettet)}</Undertittel>}
        <Tekst>{detaljer}</Tekst>
        <Tekst>{bruker}</Tekst>
      </ContentContainer>
    </Container>
  )
}
