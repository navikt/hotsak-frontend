import React from 'react'
import styled from 'styled-components'

import { norskTimestamp } from '../../../utils/date'

import { Etikett, Tekst, Undertittel } from '../../../felleskomponenter/typografi'
import { Hendelse } from '../../../types/types.internal'

const Container = styled.li`
  margin: 0;
  padding: 0;
  display: flex;

  &:not(:first-of-type) {
    padding-top: var(--a-spacing-4);
  }

  &:not(:last-of-type) {
    padding-bottom: var(--a-spacing-4);
    border-bottom: 1px solid var(--a-border-subtle);
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
        {detaljer?.split(';').map((detalj) => <Tekst key={detalj}>{detalj}</Tekst>)}
        <Tekst>{bruker}</Tekst>
      </ContentContainer>
    </Container>
  )
}
