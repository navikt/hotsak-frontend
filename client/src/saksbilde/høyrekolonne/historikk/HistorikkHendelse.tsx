import React from 'react'
import styled from 'styled-components'

import { norskTimestamp } from '../../../utils/date'

import { Etikett, Tekst, Undertittel } from '../../../felleskomponenter/typografi'
import { Hendelse } from '../../../types/types.internal'

const Container = styled.li`
  margin: 0;
  padding: 16px 0;
  display: flex;

  &:not(:last-of-type) {
    border-bottom: 1px solid var(--a-border-default);
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const HistorikkHendelse: React.FC<Hendelse> = ({ hendelse, detaljer, opprettet, bruker }) => {
  return (
    <Container>
      <ContentContainer>
        <Etikett>{hendelse}</Etikett>
        {opprettet && <Undertittel>{norskTimestamp(opprettet)}</Undertittel>}
        {detaljer?.split(';').map((detalj) => (
          <Tekst key={detalj}>{detalj}</Tekst>
        ))}
        <Tekst>{bruker}</Tekst>
      </ContentContainer>
    </Container>
  )
}
