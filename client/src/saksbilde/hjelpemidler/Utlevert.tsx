import { Tekst } from '../../felleskomponenter/typografi'
import { Utlevertinfo, UtlevertType } from '../../types/BehovsmeldingTypes'

interface UtlevertProps {
  alleredeUtlevert: boolean
  utlevertInfo: Utlevertinfo
}

export function Utlevert({ alleredeUtlevert, utlevertInfo }: UtlevertProps) {
  if (!alleredeUtlevert) return null

  let utlevertTekst
  switch (utlevertInfo.utleverttype) {
    case UtlevertType.FREMSKUTT_LAGER:
      utlevertTekst = 'Fra fremskutt lager'
      break
    case UtlevertType.OVERFØRT:
      utlevertTekst = `Overført fra annen bruker. Brukernummer ${utlevertInfo.annenKommentar}`
      break
    case UtlevertType.KORTTIDSLÅN:
      utlevertTekst = 'Korttidsutlån/utprøvingslån'
      break
    case UtlevertType.ANNET:
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
