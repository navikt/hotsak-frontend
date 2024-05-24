import styled from 'styled-components'

import { Tekst } from '../../felleskomponenter/typografi'
import { UtlevertInfo, UtlevertType } from '../../types/types.internal'

interface UtlevertProps {
  alleredeUtlevert: boolean
  utlevertInfo: UtlevertInfo
}

export function Utlevert({ alleredeUtlevert, utlevertInfo }: UtlevertProps) {
  if (alleredeUtlevert) {
    let utlevertTekst

    switch (utlevertInfo.utlevertType) {
      case UtlevertType.FremskuttLager:
        utlevertTekst = 'Fra fremskutt lager'
        break
      case UtlevertType.Overført:
        utlevertTekst = `Overført fra annen bruker. Brukernummer ${utlevertInfo.annenKommentar}`
        break
      case UtlevertType.Korttidslån:
        utlevertTekst = 'Korttidsutlån/utprøvingslån'
        break
      case UtlevertType.Annet:
        utlevertTekst = ` ${utlevertInfo.annenKommentar}`
        break
    }

    return (
      <UtlevertTekst>
        <Tekst>{utlevertTekst}</Tekst>
      </UtlevertTekst>
    )
  }
  return null
}

const UtlevertTekst = styled('div')`
  padding-left: 0.2rem;
`
