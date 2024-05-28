import { Tekst } from '../../felleskomponenter/typografi'
import { UtlevertInfo, UtlevertType } from '../../types/types.internal'

interface UtlevertProps {
  alleredeUtlevert: boolean
  utlevertInfo: UtlevertInfo
}

export function Utlevert({ alleredeUtlevert, utlevertInfo }: UtlevertProps) {
  if (!alleredeUtlevert) return null

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
    <>
      &nbsp;
      <Tekst>{utlevertTekst}</Tekst>
    </>
  )
}
