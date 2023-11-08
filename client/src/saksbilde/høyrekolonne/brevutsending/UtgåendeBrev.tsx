import React from 'react'
import styled from 'styled-components'

import { sorterKronologisk } from '../../../utils/date'

import { useSaksdokumenter } from '../../barnebriller/useSaksdokumenter'
import { KolonneTittel } from '../Høyrekolonne'
import { BrevKort } from './BrevKort'
import { Loader } from '@navikt/ds-react'

export interface UtgåendeBrevProps {
  sakId: string
}

export const UtgåendeBrev = React.memo((props: UtgåendeBrevProps) => {
  const { sakId } = props

  const { data: saksdokumenter, isLoading } = useSaksdokumenter(sakId)

  if (isLoading || !saksdokumenter) {
    return (
      <Container>
        <KolonneTittel>UTGÅENDE BREV</KolonneTittel>
        <Loader size="small">Henter brev...</Loader>
      </Container>
    )
  }

  if (saksdokumenter?.length === 0) {
    return (
      <Container>
        <KolonneTittel>UTGÅENDE BREV</KolonneTittel>
        <div>Ingen brev sendt</div>
      </Container>
    )
  } else
    return (
      <Container>
        <KolonneTittel>UTGÅENDE BREV</KolonneTittel>
        {saksdokumenter
          .sort((a, b) => sorterKronologisk(a.opprettet, b.opprettet))
          .map((it) => (
            <BrevKort key={it.dokumentID} {...it} />
          ))}
      </Container>
    )
})

export const Container = styled.ul`
  flex: 1;
  flex-shrink: 0;
  box-sizing: border-box;
`
