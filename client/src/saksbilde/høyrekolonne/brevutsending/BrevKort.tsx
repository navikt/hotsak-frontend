import React from 'react'
import styled from 'styled-components'

import { norskTimestamp } from '../../../utils/date'

import { Etikett, Tekst, Undertittel } from '../../../felleskomponenter/typografi'
import { Hendelse, Saksdokument } from '../../../types/types.internal'

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

export const BrevKort: React.FC<Saksdokument> = ({ tittel, opprettetDato, saksbehandler }) => {
  return (
    <Container>
      <ContentContainer>
        <Etikett>{tittel}</Etikett>
        {opprettetDato && <Undertittel>{norskTimestamp(opprettetDato)}</Undertittel>}

        <Tekst>{saksbehandler.navn}</Tekst>
      </ContentContainer>
    </Container>
  )
}
