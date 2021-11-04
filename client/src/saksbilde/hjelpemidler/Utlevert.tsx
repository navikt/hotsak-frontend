import { Tekst } from '../../felleskomponenter/typografi'
import { UtlevertInfo, UtlevertType } from '../../types/types.internal'

interface UtlevertProps {
  alleredeUtlevert: boolean
  utlevertInfo: UtlevertInfo
}

export const Utlevert: React.FC<UtlevertProps> = ({ alleredeUtlevert, utlevertInfo }) => {
  if (alleredeUtlevert) {
    let utlevertTekst

    switch (utlevertInfo.utlevertType) {
      case UtlevertType.FremskuttLager:
        utlevertTekst = 'Fra fremskutt lager'
        break
      case UtlevertType.Overført:
        utlevertTekst = `Overført fra annen bruker. Brukernummer ${utlevertInfo.overførtFraBruker}`
        break
      case UtlevertType.Korttidslån:
        utlevertTekst = 'Korttidsutlån/utprøvingslån'
        break
      case UtlevertType.Annen:
        utlevertTekst = ` ${utlevertInfo.annenKommentar}`
        break
    }

    return <Tekst>{`Utlevert: ${utlevertTekst}`}</Tekst>
  }
  return null
}
