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

function useSaksdokumenter(sakId: string) {
  const url = `/api/sak/${sakId}/dokumenter?type=${encodeURIComponent(SaksdokumentType.UTGÅENDE)}`
  const { data, isLoading } = useSwr<Saksdokument[]>(url)

  return {
    data,
    isLoading,
  }
}

export const Container = styled.ul`
  flex: 1;
  flex-shrink: 0;
  box-sizing: border-box;
`
