import React from 'react'
import styled from 'styled-components'
import useSwr from 'swr'

import { sorterKronologisk } from '../../../utils/date'

import { Saksdokument, SaksdokumentType } from '../../../types/types.internal'
import { KolonneTittel } from '../Høyrekolonne'
import { BrevKort } from './BrevKort'

export interface UtgåendeBrevProps {
  sakId: string
}

export const UtgåendeBrev = React.memo((props: UtgåendeBrevProps) => {
  const { sakId } = props

  const { data: saksdokumenter, isLoading } = useSaksdokumenter(sakId)

  if (isLoading || !saksdokumenter) {
    // TODO
    return <></>
  }

  if (saksdokumenter?.length === 0) {
    return (
      <Container>
        <KolonneTittel>TIDLIGERE BREV</KolonneTittel>
        <div>Ingen brev sendt</div>
      </Container>
    )
  } else
    return (
      <Container>
        <KolonneTittel>TIDLIGERE BREV</KolonneTittel>
        {saksdokumenter
          .sort((a, b) => sorterKronologisk(a.opprettetDato, b.opprettetDato))
          .map((it) => (
            <BrevKort key={it.dokumentID} {...it} />
          ))}
      </Container>
    )
})

function useSaksdokumenter(sakId: string) {
  const { data, isLoading } = useSwr<Saksdokument[]>(`/api/sak/${sakId}/dokumenter?type=${SaksdokumentType.UTGÅENDE}`)

  return {
    data,
    isLoading,
  }
}

export const Container = styled.ul`
  //height: 95vh;
  //margin: 0;
  //padding: 0;
  flex: 1;
  flex-shrink: 0;
  //padding: 0 24px;
  box-sizing: border-box;
  //border-left: 1px solid var(--a-border-default);
`
